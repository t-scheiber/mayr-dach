import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const quote = x => `'${x.replaceAll("'", "'\\''")}'`;
const excluded = /(^|\/)(node_modules|vendor|\.github\/renovate|\.renovate-config|dist|build)\//;
export function makePlan(root, files, changed) {
  const exists = p => fs.existsSync(path.join(root, p));
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  const plan = { installs: [], commands: [], needs_bun: false, needs_pnpm: false, needs_java: false, needs_python: false, needs_rust: false, bun_version: '', pnpm_version: '', supported: false };
  const actionOnly = changed.length > 0 && changed.every(p => p.startsWith('.github/workflows/'));
  // Even repositories without an application must actually validate workflow updates.
  if (changed.some(p => p.startsWith('.github/workflows/'))) plan.commands.push('actionlint -shellcheck= -pyflakes=');
  let packages = files.filter(p => /(^|\/)package\.json$/.test(p) && !excluded.test(p));
  const rootPackage = exists('package.json') ? read('package.json') : null;
  if (rootPackage?.workspaces) packages = ['package.json'];
  for (const manifest of packages) {
    const dir = path.posix.dirname(manifest);
    const prefix = `cd ${quote(dir)} && `;
    const pkg = read(manifest);
    const scripts = pkg.scripts || {};
    const at = p => dir === '.' ? p : `${dir}/${p}`;
    let runner = 'npm run';
    let install = exists(at('package-lock.json')) ? 'npm ci' : 'npm install';
    let refresh = 'npm install --package-lock-only --ignore-scripts';
    if (pkg.packageManager?.startsWith('bun@') || exists(at('bun.lock')) || exists(at('bun.lockb'))) {
      plan.needs_bun = true;
      plan.bun_version ||= pkg.packageManager?.startsWith('bun@') ? pkg.packageManager.slice(4).split('+')[0] : 'latest';
      install = 'bun install --frozen-lockfile'; refresh = 'bun install --lockfile-only --ignore-scripts'; runner = 'bun run';
    } else if (pkg.packageManager?.startsWith('pnpm@') || exists(at('pnpm-lock.yaml'))) {
      plan.needs_pnpm = true;
      plan.pnpm_version ||= pkg.packageManager?.startsWith('pnpm@') ? pkg.packageManager.slice(5).split('+')[0] : '11';
      install = 'pnpm install --frozen-lockfile'; refresh = 'pnpm install --lockfile-only --ignore-scripts'; runner = 'pnpm run';
    } else if (exists(at('yarn.lock'))) {
      install = 'corepack yarn install --immutable'; refresh = 'corepack yarn install --mode=update-lockfile'; runner = 'corepack yarn run';
      if (!pkg.packageManager || pkg.packageManager.startsWith('yarn@1.')) {
        install = 'corepack yarn install --frozen-lockfile'; refresh = 'corepack yarn install --ignore-scripts';
      }
    }
    if (JSON.stringify(scripts).includes('bun')) { plan.needs_bun = true; plan.bun_version ||= 'latest'; }
    plan.installs.push({ command: prefix + install, refresh: prefix + refresh });
    const names = ['lint', 'typecheck', 'type-check', 'check', 'validate', 'test', 'build'];
    let count = 0;
    // Workspaces with platform-specific release scripts need explicit build targets.
    if (scripts['db:generate']) plan.commands.push(prefix + runner + ' db:generate');
    for (const name of names) {
      if (!scripts[name] || scripts[name].includes('no test specified')) continue;
      let extra = '';
      if (name === 'test' && /react-scripts test/.test(scripts[name])) extra = ' --watchAll=false --passWithNoTests';
      else if (name === 'test' && /(^|\s)vitest(\s|$)/.test(scripts[name]) && !/\brun\b/.test(scripts[name])) extra = ' --run';
      plan.commands.push(prefix + runner + ' ' + name + extra); count++;
    }
    for (const name of ['build:api', 'build:web']) if (!scripts.build && scripts[name]) { plan.commands.push(prefix + runner + ' ' + name); count++; }
    if (count === 0) {
      // A syntax smoke test is explicit evidence for small JS services with no test suite.
      const js = files.filter(p => !excluded.test(p) && path.posix.dirname(p) === dir && /\.[cm]?js$/.test(p));
      for (const file of js) { plan.commands.push(`node --check ${quote(file)}`); count++; }
      if (!count && !actionOnly) throw new Error(`No validation command for ${manifest}`);
    }
  }
  const requirements = files.filter(p => /(^|\/)requirements[^/]*\.txt$/.test(p) && !excluded.test(p));
  if (requirements.length && (!actionOnly || !packages.length)) {
    plan.needs_python = true;
    plan.installs.push({ command: `python -m pip install ${requirements.map(p => '-r ' + quote(p)).join(' ')}`, refresh: null });
    plan.commands.push('python -m pip check');
    const py = files.filter(p => p.endsWith('.py') && !excluded.test(p));
    if (py.length) plan.commands.push(`python -m py_compile ${py.map(quote).join(' ')}`);
    if (files.some(p => /(^|\/)(test_[^/]+|[^/]+_test)\.py$/.test(p))) plan.commands.push('python -m pytest');
  }
  const gradle = files.filter(p => /(^|\/)gradlew$/.test(p));
  if (gradle.length) {
    plan.needs_java = true;
    for (const file of gradle) plan.commands.push(`cd ${quote(path.posix.dirname(file))} && bash ./gradlew build --no-daemon`);
  }
  const rust = changed.some(p => /(^|\/)Cargo\.(toml|lock)$/.test(p));
  if (rust) {
    plan.needs_rust = true;
    for (const file of files.filter(p => /(^|\/)Cargo.toml$/.test(p) && !excluded.test(p))) {
      plan.commands.push(`cargo test --locked --manifest-path ${quote(file)}`);
    }
  }
  if (changed.some(p => /(^|\/)(Dockerfile[^/]*|(?:docker-)?compose\.ya?ml)$/.test(p))) {
    for (const file of changed.filter(p => /(^|\/)(?:docker-)?compose\.ya?ml$/.test(p))) plan.commands.push(`docker compose -f ${quote(file)} config --quiet`);
    for (const file of changed.filter(p => /(^|\/)Dockerfile[^/]*$/.test(p))) plan.commands.push(`docker build --file ${quote(file)} ${quote(path.posix.dirname(file))}`);
  }
  plan.supported = plan.commands.length > 0;
  return plan;
}

function run(command) {
  console.log(`$ ${command}`);
  return spawnSync('bash', ['-lc', command], { stdio: 'inherit', env: { ...process.env, CI: 'true' } }).status === 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.env.RENOVATE_PLAN || '/tmp/renovate-plan.json';
  const mode = process.argv[2];
  if (mode === 'detect') {
    const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n');
    const changed = execFileSync('git', ['diff', '--name-only', `${process.env.BASE_SHA}...HEAD`], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    const plan = makePlan(process.cwd(), files, changed);
    fs.writeFileSync(file, JSON.stringify(plan));
    if (process.env.GITHUB_OUTPUT) for (const [key, value] of Object.entries(plan)) if (!Array.isArray(value)) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
    console.log(JSON.stringify(plan, null, 2));
    if (!plan.supported) throw new Error('No supported validation for this update');
  } else {
    const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!plan.supported || !plan.commands.length) throw new Error('Missing validation plan');
    if (mode === 'install') {
      for (const install of plan.installs) {
        if (run(install.command)) continue;
        // Regenerate through the package manager, then require a frozen install.
        if (!install.refresh || !run(install.refresh) || !run(install.command)) process.exit(1);
      }
    } else if (mode === 'validate') {
      for (const command of plan.commands) if (!run(command)) process.exit(1);
    } else throw new Error('Expected detect, install, or validate');
  }
}
