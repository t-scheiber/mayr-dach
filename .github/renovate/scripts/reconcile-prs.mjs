import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { github, pages, trustedPR, VALIDATION_CONTEXT, validationDescription } from './github-api.mjs';
export const POLICY_REVISION = '2';
export const MERGE_READY_CONTEXT = 'renovate/merge-ready';
export function mergeAuthorized(statuses, repo, base, now = Date.now()) {
  const validation = statuses.find(s => s.context === VALIDATION_CONTEXT);
  const ready = statuses.find(s => s.context === MERGE_READY_CONTEXT);
  const expected = validationDescription(base, POLICY_REVISION);
  return [validation,ready].every(s => s?.state === 'success' && s.description === expected && s.creator?.login === 'github-actions[bot]') &&
    ready.target_url === validation.target_url && ready.target_url.startsWith(`https://github.com/${repo}/actions/runs/`) &&
    /^\d+$/.test(ready.target_url.split('/').at(-1)) && Date.parse(ready.created_at) >= Date.parse(validation.created_at) &&
    now - Date.parse(ready.created_at) >= 0 && now - Date.parse(ready.created_at) < 60*60*1000;
}
export function decision({ pr, repo, base, statuses, run, validationJobSucceeded = false, checks = [], now = Date.now() }) {
  if (!trustedPR(pr, repo)) return 'skip';
  const expected = validationDescription(base, POLICY_REVISION);
  const proofs = statuses.filter(s => s.context === VALIDATION_CONTEXT && s.description === expected && s.creator?.login === 'github-actions[bot]');
  const proof = proofs[0];
  if (!proof) return 'validate';
  if (proof.state === 'pending' && now - Date.parse(proof.created_at) < 45 * 60 * 1000) return 'wait';
  if (proof.state === 'success') {
    if (!run || (run.status !== 'completed' && !validationJobSucceeded)) return 'wait';
    if ((!validationJobSucceeded && run.conclusion !== 'success') || !['workflow_dispatch','repository_dispatch'].includes(run.event) || run.path !== '.github/workflows/renovate-ai-fix.yml') return 'blocked';
    // Explicit evidence does not override another real CI failure or pending check.
    if (checks.some(c => !['SUCCESS', 'NEUTRAL', 'SKIPPED'].includes(c.conclusion))) return 'blocked';
    if (statuses.some(s => s.context !== VALIDATION_CONTEXT && s.state !== 'success')) return 'blocked';
    return pr.mergeable === false ? 'blocked' : 'merge';
  }
  const failures = proofs.filter(s => s.state === 'failure').length;
  if (failures >= 3) return 'blocked';
  if (failures && now - Date.parse(proof.created_at) < 24 * 60 * 60 * 1000) return 'backoff';
  return 'validate';
}

export async function reconcile(repo) {
  const meta = await github(`/repos/${repo}`, { allow404: true });
  if (!meta || meta.archived || meta.disabled) return `${repo}: skipped`;
  const prs = (await pages(`/repos/${repo}/pulls?state=open`)).filter(pr => trustedPR(pr, repo));
  // Security updates first; then oldest, to avoid starving an existing update.
  prs.sort((a,b) => Number(/security/i.test(b.title)) - Number(/security/i.test(a.title)) || Date.parse(a.created_at)-Date.parse(b.created_at));
  const base = (await github(`/repos/${repo}/git/ref/heads/${encodeURIComponent(meta.default_branch)}`)).object.sha;
  for (const summary of prs) {
    const pr = await github(`/repos/${repo}/pulls/${summary.number}`);
    const all = await pages(`/repos/${repo}/commits/${pr.head.sha}/statuses`);
    if (mergeAuthorized(all,repo,base)) {
      // The fresh scoped merge job has checked all CI. The existing Renovate token
      // supplies only the final write for workflow updates that GITHUB_TOKEN cannot merge.
      const current = await github(`/repos/${repo}/pulls/${pr.number}`);
      const currentBase = (await github(`/repos/${repo}/git/ref/heads/${encodeURIComponent(meta.default_branch)}`)).object.sha;
      if (!trustedPR(current,repo) || current.head.sha !== pr.head.sha || currentBase !== base) return `${repo}: revision changed before central merge`;
      const result = await github(`/repos/${repo}/pulls/${pr.number}/merge`,{method:'PUT',body:{sha:pr.head.sha,merge_method:'squash'}});
      if (!result.merged || !(await github(`/repos/${repo}/pulls/${pr.number}`)).merged) throw new Error(`Merge readback failed for ${repo} #${pr.number}`);
      console.log(`Merged ${repo} #${pr.number} at ${result.sha} after scoped authorization`);
      return reconcile(repo);
    }
    const proofs = all.filter(s => s.context === VALIDATION_CONTEXT && s.description === validationDescription(base,POLICY_REVISION) && s.creator?.login === 'github-actions[bot]');
    const proof = proofs[0];
    let action = 'validate';
    if (proof?.state === 'success') action = 'merge';
    else if (proof?.state === 'pending' && Date.now() - Date.parse(proof.created_at) < 45*60*1000) action = 'wait';
    else if (proof?.state === 'failure') {
      if (proofs.filter(s=>s.state==='failure').length >= 3) action='blocked';
      else if (Date.now()-Date.parse(proof.created_at)<24*60*60*1000) action='backoff';
    }
    console.log(`${repo} #${pr.number}: ${action}`);
    if (action === 'validate' || action === 'merge') {
      // repository_dispatch needs the existing Contents permission, not Actions admin access.
      // The target repo performs the independent merge gate using its scoped GITHUB_TOKEN.
      await github(`/repos/${repo}/dispatches`,{method:'POST',body:{event_type:'renovate-validate',client_payload:{pr_number:String(pr.number),mode:action}}});
      return `${repo}: queued ${action} for #${pr.number}`;
    }
    if (action === 'wait') return `${repo}: validation pending for #${pr.number}`;
  }
  return `${repo}: ${prs.length ? 'remaining updates need repair' : 'no open Renovate PRs'}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const repos = (process.env.RENOVATE_REPOSITORIES || '').split(',').map(x=>x.trim()).filter(Boolean);
  if (!repos.length) throw new Error('RENOVATE_REPOSITORIES is empty');
  const results = [];
  let failed = false;
  for (const repo of repos) {
    try { results.push(await reconcile(repo)); }
    catch (error) { failed=true;results.push(`${repo}: ${error.message}`);console.error(error.message); }
  }
  console.log(results.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, results.map(x=>`- ${x}`).join('\n')+'\n');
  if (failed) process.exitCode=1;
}
