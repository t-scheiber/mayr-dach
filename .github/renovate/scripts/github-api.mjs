export async function github(route, { method = 'GET', body, token = process.env.GH_TOKEN || process.env.RENOVATE_TOKEN, allow404 = false } = {}) {
  if (!token) throw new Error('GitHub token is required');
  const response = await fetch(`https://api.github.com${route}`, {
    method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(60000),
  });
  if (response.status === 404 && allow404) return null;
  if (!response.ok) throw new Error(`GitHub ${method} ${route}: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}
export async function pages(route, options) {
  const result = [];
  for (let page = 1; ; page++) {
    const data = await github(`${route}${route.includes('?') ? '&' : '?'}per_page=100&page=${page}`, options);
    result.push(...data);
    if (data.length < 100) return result;
  }
}
export function trustedPR(pr, repo) {
  return pr.state === 'open' && !pr.draft && pr.head?.repo?.full_name === repo &&
    pr.head.ref.startsWith('renovate/') && ['t-scheiber', 'renovate[bot]'].includes(pr.user?.login);
}
export const VALIDATION_CONTEXT = 'renovate/validated';
export const validationDescription = (base, revision) => `base=${base}; policy=${revision}`;
