import { github, pages, trustedPR, VALIDATION_CONTEXT, validationDescription } from './github-api.mjs';
import { decision, POLICY_REVISION, reconcile, MERGE_READY_CONTEXT } from './reconcile-prs.mjs';
const repo=process.env.GITHUB_REPOSITORY, number=process.env.PR_NUMBER;
if (!/^\d+$/.test(number||'')) throw new Error('Invalid PR number');
const route=`/repos/${repo}`;
const pr=await github(`${route}/pulls/${number}`);
if (!trustedPR(pr,repo)) throw new Error('Not an eligible Renovate PR');
const base=(await github(`${route}/git/ref/heads/${encodeURIComponent(pr.base.ref)}`)).object.sha;
const all=await pages(`${route}/commits/${pr.head.sha}/statuses`);
const latest=[...new Map([...all].reverse().map(s=>[s.context,s])).values()];
const proof=all.find(s=>s.context===VALIDATION_CONTEXT&&s.description===validationDescription(base,POLICY_REVISION)&&s.creator?.login==='github-actions[bot]');
const id=proof?.target_url?.match(new RegExp(`^https://github\\.com/${repo}/actions/runs/(\\d+)$`))?.[1];
const run=id?await github(`${route}/actions/runs/${id}`):null;
let validationJobSucceeded=false;
if (id===process.env.GITHUB_RUN_ID) {
  const jobs=await github(`${route}/actions/runs/${id}/jobs?per_page=100`);
  validationJobSucceeded=jobs.jobs.some(j=>j.name==='renovate-ai-fix'&&j.status==='completed'&&j.conclusion==='success');
}
const raw=await github(`${route}/commits/${pr.head.sha}/check-runs?per_page=100`);
if(raw.total_count>100) throw new Error('Too many check runs to safely evaluate in one page');
const checks=[...new Map([...raw.check_runs].reverse().map(c=>[`${c.app.id}:${c.name}`,{conclusion:c.status==='completed'?c.conclusion?.toUpperCase():'PENDING'}])).values()];
const action=decision({pr,repo,base,statuses:latest,run,validationJobSucceeded,checks});
if(action!=='merge') { console.log(`Merge deferred: ${action}. A later reconciliation will retry.`);process.exit(0); }
const current=await github(`${route}/pulls/${number}`);
const currentBase=(await github(`${route}/git/ref/heads/${encodeURIComponent(pr.base.ref)}`)).object.sha;
if(current.head.sha!==pr.head.sha||currentBase!==base) throw new Error('PR or default branch changed; validation must run again');
let result;
try {
  result=await github(`${route}/pulls/${number}/merge`,{method:'PUT',body:{sha:pr.head.sha,merge_method:'squash'}});
} catch (error) {
  if (!error.message.endsWith('HTTP 403')) throw error;
  await github(`${route}/statuses/${pr.head.sha}`,{method:'POST',body:{state:'success',context:MERGE_READY_CONTEXT,target_url:proof.target_url,description:validationDescription(base,POLICY_REVISION)}});
  console.log('All merge checks passed. The central Renovate token will perform the workflow-permission write on its next reconciliation.');
  process.exit(0);
}
if(!result.merged) throw new Error('Merge was not confirmed');
const verified=await github(`${route}/pulls/${number}`);
if(!verified.merged) throw new Error('Merge readback failed');
console.log(`Merged ${repo} #${number} at ${result.sha}`);

// A confirmed merge advances the queue immediately. Failures retain the scheduled backoff.
console.log(await reconcile(repo));
