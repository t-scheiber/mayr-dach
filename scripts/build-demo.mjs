import { cp, mkdir, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const stage = join(root, ".demo-build");
// Only generated build directories inside this checkout are ever removed.
await rm(stage, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
const excluded = new Set([".git", ".github", ".next", ".demo-build", ".demo-out", "node_modules", "proxy.ts", "WEBSITE-REPORT.pdf"]);
for (const entry of await readdir(root)) {
  if (!excluded.has(entry) && !entry.startsWith(".env")) {
    await cp(join(root, entry), join(stage, entry), { recursive: true });
  }
}
for (const path of ["app/api", "app/[locale]/admin", "app/robots.ts", "app/sitemap.ts"]) {
  await rm(join(stage, path), { recursive: true, force: true });
}
await writeFile(join(stage, "public/robots.txt"), "User-agent: *\nDisallow: /\n");
await symlink(join(root, "node_modules"), join(stage, "node_modules"), process.platform === "win32" ? "junction" : "dir");
const env = { ...process.env, NEXT_PUBLIC_DEMO_MODE: "true", NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://mayr-dach.thomasscheiber.com" };
const result = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build", stage, "--webpack"], { cwd: stage, env, stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);
await rm(join(root, ".demo-out"), { recursive: true, force: true });
await cp(join(stage, "out"), join(root, ".demo-out"), { recursive: true });
