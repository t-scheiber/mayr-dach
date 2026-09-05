import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { github, trustedPR, VALIDATION_CONTEXT, validationDescription } from './github-api.mjs';
const repo = process.env.GITHUB_REPOSITORY;
const number = process.env.PR_NUMBER;
if (!/^\d+$/.test(number || '')) throw new Error('Invalid PR number');
const route = `/repos/${repo}`;
const pr = await github(`${route}/pulls/${number}`);
if (!trustedPR(pr, repo)) throw new Error('PR is not an open trusted Renovate update');
const mode = process.argv[2];
const url = `https://github.com/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`;
if (mode === 'prepare') {
  if (process.env.RUNNER_TEMP) fs.writeFileSync(`${process.env.RUNNER_TEMP}/renovate-release-notes.md`, (pr.body || '').slice(0,40000));
  const base = await github(`${route}/git/ref/heads/${encodeURIComponent(pr.base.ref)}`);
  for (const [key,value] of Object.entries({ head:pr.head.sha, branch:pr.head.ref, base:base.object.sha, base_ref:pr.base.ref })) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  await github(`${route}/statuses/${pr.head.sha}`, { method:'POST', body:{ state:'pending', context:VALIDATION_CONTEXT, target_url:url, description:validationDescription(base.object.sha, process.env.POLICY_REVISION) } });
} else if (mode === 'finish') {
  let sha = process.env.ORIGINAL_HEAD;
  const passed = process.env.VALIDATION_RESULT === 'success';
  // Never publish evidence for a different PR revision that arrived during validation.
  if (pr.head.sha !== sha) throw new Error('PR changed during validation; a fresh run is required');
  if (passed) {
    const repaired = execFileSync('git', ['rev-parse','HEAD'], { encoding:'utf8' }).trim();
    const baseline = process.env.VALIDATION_BASELINE_SHA;
    if (!/^[a-f0-9]{40}$/.test(baseline || '')) throw new Error('Missing validation baseline');
    const changes = execFileSync('git', ['diff','--name-only',baseline,repaired], { encoding:'utf8' }).trim();
    // A synthetic base merge is validation evidence, not an application repair.
    if (changes) {
      execFileSync('gh',['auth','setup-git'],{stdio:'inherit'});
      execFileSync('git',['push','origin',`HEAD:refs/heads/${pr.head.ref}`],{stdio:'inherit'});
      sha = repaired;
    }
  }
  await github(`${route}/statuses/${sha}`, { method:'POST', body:{state:passed?'success':'failure',context:VALIDATION_CONTEXT,target_url:url,description:validationDescription(process.env.BASE_SHA, process.env.POLICY_REVISION)} });
  if (!passed) throw new Error('Dependency validation or repair failed');
} else throw new Error('Expected prepare or finish');
