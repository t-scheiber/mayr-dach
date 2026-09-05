import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
export function assertManifestPreserved(before, after) {
  if (JSON.stringify(before.scripts || {}) !== JSON.stringify(after.scripts || {})) throw new Error('AI repair may not change validation scripts');
  for (const group of ['dependencies','devDependencies','optionalDependencies','peerDependencies']) {
    for (const [name,version] of Object.entries(before[group] || {})) {
      if (after[group]?.[name] !== version) throw new Error(`AI repair may not remove or change the Renovate target for ${name}`);
    }
  }
}
export function assertRepairPolicy() {
  const files=execFileSync('git',['diff','HEAD','--name-only'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  for (const file of files) {
    if (!fs.existsSync(file) || fs.lstatSync(file).isSymbolicLink()) throw new Error(`AI repair deleted a file or introduced a symlink: ${file}`);
    if (/(^|\/)package.json$/.test(file)) {
      const before=JSON.parse(execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'}));
      assertManifestPreserved(before,JSON.parse(fs.readFileSync(file,'utf8')));
    }
    const diff=execFileSync('git',['diff','HEAD','--',file],{encoding:'utf8'});
    const added=diff.split('\n').filter(x=>x.startsWith('+')&&!x.startsWith('+++')).join('\n');
    if (/@ts-(ignore|nocheck)|eslint-disable|ignoreBuildErrors\s*:\s*true|"noCheck"\s*:\s*true|"strict"\s*:\s*false/.test(added)) throw new Error(`AI repair weakened validation in ${file}`);
  }
}
