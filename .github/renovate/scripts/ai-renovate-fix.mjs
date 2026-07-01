#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const geminiApiKey = process.env.GEMINI_API_KEY;
delete process.env.GEMINI_API_KEY;
delete process.env.RENOVATE_TOKEN;
delete process.env.GH_TOKEN;

function parseArgs(argv) {
  const args = { commands: [], conflicts: false };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--log") {
      args.log = argv[++i];
    } else if (value === "--command") {
      args.commands.push(argv[++i]);
    } else if (value === "--attempts") {
      args.attempts = Number(argv[++i]);
    } else if (value === "--conflicts") {
      args.conflicts = true;
    }
  }
  return args;
}

function run(command) {
  return spawnSync(command, {
    cwd: process.cwd(),
    shell: true,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function runFile(command, args) {
  return spawnSync(command, args, {
    cwd: process.cwd(),
    shell: false,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function git(command) {
  const result = run(`git ${command}`);
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `git ${command} failed`);
  }
  return result.stdout.trim();
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function repositoryRoot() {
  return git("rev-parse --show-toplevel");
}

function normalizeRepositoryPath(filePath) {
  const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  if (!normalized || path.isAbsolute(normalized)) return null;
  if (normalized === ".git" || normalized.startsWith(".git/")) return null;
  if (
    normalized === ".renovate-config" ||
    normalized.startsWith(".renovate-config/") ||
    normalized === "renovate.json" ||
    normalized === ".renovaterc" ||
    normalized.startsWith(".github/workflows/") ||
    normalized.startsWith(".github/renovate/")
  ) {
    return null;
  }

  const root = repositoryRoot();
  const absolutePath = path.resolve(root, normalized);
  const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
  if (!relativePath || relativePath === ".." || relativePath.startsWith("../")) {
    return null;
  }
  return relativePath;
}

function validateChangedPaths(allowedPaths) {
  const changed = unique([
    ...run("git diff --name-only --diff-filter=ACMR").stdout.split(/\r?\n/),
    ...run("git ls-files --others --exclude-standard").stdout.split(/\r?\n/),
  ].map((entry) => entry.trim()));
  const denied = changed.filter(
    (entry) => {
      if (
        entry === ".renovate-config" ||
        entry.startsWith(".renovate-config/") ||
        /^\.renovate-ai-(?:fix-\d+\.patch|response-\d+\.txt)$/.test(entry) ||
        /^renovate-ai-validation-\d+\.log$/.test(entry) ||
        entry === "renovate-validation.log" ||
        entry === ".renovate-commands" ||
        entry === ".renovate-install-command" ||
        entry === ".renovate-script-names"
      ) {
        return false;
      }
      const safePath = normalizeRepositoryPath(entry);
      return !safePath || !allowedPaths.has(safePath);
    },
  );
  return { ok: denied.length === 0, denied };
}

async function readTextFile(filePath) {
  try {
    const stats = await fs.lstat(filePath);
    if (!stats.isFile() || stats.isSymbolicLink() || stats.size > 150_000) return null;
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function extractCandidatePaths(logText) {
  const matches = logText.matchAll(
    /([A-Za-z0-9_./\\-]+\.(?:[cm]?[jt]sx?|json|ya?ml|mjs|cjs|php|gradle|md|toml|cfg|ini|lock))/g,
  );
  return unique(
    [...matches]
      .map((match) => match[1].replaceAll("\\", "/"))
      .map((entry) => entry.replace(/^\.\//, "")),
  );
}

async function collectContext(logText) {
  const baseRef = process.env.BASE_REF;
  const diffRange =
    baseRef && run(`git rev-parse --verify "origin/${baseRef}"`).status === 0
      ? `origin/${baseRef}...HEAD`
      : "HEAD~1..HEAD";
  const changedFiles = unique(
    git(`diff --name-only ${diffRange}`)
      .split(/\r?\n/)
      .map((entry) => entry.trim()),
  );

  const relatedFiles = unique([
    ...changedFiles,
    ...extractCandidatePaths(logText),
    "package.json",
    "eslint.config.mjs",
    "eslint.config.js",
    ".eslintrc.json",
    ".eslintrc.js",
    ".eslintrc.cjs",
    "tsconfig.json",
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
    "vite.config.ts",
    "vite.config.js",
    "prisma.config.ts",
    "build.gradle",
    "build.gradle.kts",
    "settings.gradle",
    "settings.gradle.kts",
  ]).slice(0, 30);

  const fileContexts = [];
  const fileContextPaths = [];
  for (const file of relatedFiles) {
    const absolutePath = path.resolve(process.cwd(), file);
    const content = await readTextFile(absolutePath);
    if (content) {
      fileContexts.push(`FILE: ${file}\n${content}`);
      fileContextPaths.push(file);
    }
  }

  const fullDiff = git(`diff ${diffRange}`);

  return {
    branch: git("rev-parse --abbrev-ref HEAD"),
    lastCommit: git("show --stat --oneline --no-patch HEAD"),
    diffSummary: git(`diff --stat ${diffRange}`),
    fullDiff,
    fileContexts,
    allowedPaths: new Set(fileContextPaths.map(normalizeRepositoryPath).filter(Boolean)),
  };
}

function extractFileReplacements(text) {
  if (!text) return null;
  if (text.includes("NO_FIX")) return null;

  const replacements = [];
  const pattern = /FILE:\s*([^\n]+)\n```[^\n]*\n([\s\S]*?)```/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2];
    if (filePath && content != null) {
      replacements.push({ filePath, content });
    }
  }

  return replacements.length > 0 ? replacements : null;
}

function extractDiff(text) {
  if (!text) return null;
  if (text.includes("NO_FIX")) return null;

  const fenced = text.match(/```diff\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();

  if (text.includes("diff --git")) {
    return text.slice(text.indexOf("diff --git")).trim();
  }

  return null;
}

async function callGemini(prompt, { temperature = 0.2 } = {}) {
  const apiKey = geminiApiKey;
  if (!apiKey) throw new Error("GEMINI_API_KEY is required");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-pro";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          topP: 0.95,
          maxOutputTokens: 65535,
        },
      }),
    },
  );

  const payload = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(payload, null, 2));

  return (
    payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n") || ""
  );
}

function applyPatch(patchPath) {
  const apply3Way = run(`git apply --3way --whitespace=nowarn "${patchPath}"`);
  if (apply3Way.status === 0) return { ok: true };

  const applyFuzz = run(`git apply --whitespace=nowarn -C1 "${patchPath}"`);
  if (applyFuzz.status === 0) return { ok: true };

  const applyReject = run(`git apply --reject --whitespace=nowarn "${patchPath}"`);
  if (applyReject.status === 0) return { ok: true };

  const errorOutput = [apply3Way.stderr, applyFuzz.stderr, applyReject.stderr]
    .filter(Boolean)
    .join("\n");
  return { ok: false, error: errorOutput };
}

async function applyFileReplacements(replacements, allowedPaths) {
  let applied = 0;
  for (const { filePath, content } of replacements) {
    const safePath = normalizeRepositoryPath(filePath);
    if (!safePath || !allowedPaths.has(safePath)) {
      console.error(`  Refusing out-of-scope file replacement: ${filePath}`);
      continue;
    }
    const absolutePath = path.resolve(repositoryRoot(), safePath);
    try {
      const stats = await fs.lstat(absolutePath);
      if (!stats.isFile() || stats.isSymbolicLink()) {
        console.error(`  Refusing non-regular file replacement: ${filePath}`);
        continue;
      }
      await fs.writeFile(absolutePath, content, "utf8");
      applied += 1;
      console.log(`  Replaced: ${filePath}`);
    } catch (err) {
      console.error(`  Failed to write ${filePath}: ${err.message}`);
    }
  }
  return applied > 0;
}

async function resolveConflicts(maxAttempts) {
  const conflictedFiles = unique(
    git("diff --name-only --diff-filter=U")
      .split(/\r?\n/)
      .map((entry) => entry.trim()),
  );
  if (conflictedFiles.length === 0) {
    console.log("No merge conflicts to resolve.");
    return;
  }

  const safeFiles = conflictedFiles.map(normalizeRepositoryPath).filter(Boolean);
  if (safeFiles.length !== conflictedFiles.length) {
    throw new Error("Merge conflict touches a protected or unsafe path");
  }

  const originals = new Map();
  for (const file of safeFiles) {
    originals.set(file, await fs.readFile(path.resolve(repositoryRoot(), file), "utf8"));
  }

  const templatePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../prompts/renovate-conflict-fix.md",
  );
  const template = await fs.readFile(templatePath, "utf8");
  const allowedPaths = new Set(safeFiles);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    for (const [file, content] of originals) {
      await fs.writeFile(path.resolve(repositoryRoot(), file), content, "utf8");
    }

    const contexts = safeFiles.map(
      (file) => `FILE: ${file}\n${originals.get(file)}`,
    );
    const prompt = [
      template.trim(),
      "",
      `Attempt: ${attempt}/${maxAttempts}`,
      "",
      "Conflicted files (content includes Git conflict markers):",
      contexts.join("\n\n-----\n\n"),
    ].join("\n");

    const response = await callGemini(prompt, {
      temperature: attempt === 1 ? 0.1 : 0.2,
    });
    const replacements = extractFileReplacements(response);
    if (!replacements) continue;
    if (!(await applyFileReplacements(replacements, allowedPaths))) continue;

    const unresolvedMarkers = [];
    for (const file of safeFiles) {
      const content = await fs.readFile(path.resolve(repositoryRoot(), file), "utf8");
      if (/^(<{7}|={7}|>{7})/m.test(content)) unresolvedMarkers.push(file);
    }
    if (unresolvedMarkers.length > 0) continue;

    const addResult = runFile("git", ["add", "--", ...safeFiles]);
    if (addResult.status !== 0) continue;
    const unresolved = run("git diff --name-only --diff-filter=U").stdout.trim();
    if (!unresolved) {
      console.log(`AI resolved merge conflicts on attempt ${attempt}.`);
      return;
    }
  }

  throw new Error(`AI could not safely resolve conflicts after ${maxAttempts} attempts`);
}

function runValidation(commands) {
  const outputs = [];
  for (const command of commands) {
    const result = run(command);
    outputs.push(`$ ${command}\n${result.stdout}${result.stderr}`);
    if (result.status !== 0) {
      return { ok: false, output: outputs.join("\n\n") };
    }
  }
  return { ok: true, output: outputs.join("\n\n") };
}

function buildPrompt(template, context, commands, logText, mode) {
  const parts = [template.trim()];

  if (mode === "file-replacement") {
    parts.push(
      "",
      "IMPORTANT: A previous attempt using a unified diff failed to apply.",
      "Instead of a diff, return the COMPLETE replacement content for each file that needs changes.",
      "Use this exact format for EACH file:",
      "",
      "FILE: path/to/file",
      "```language",
      "complete file content here",
      "```",
      "",
      "Return the full file content, not a partial snippet. Only include files that need changes.",
    );
  }

  parts.push(
    "",
    `Branch: ${context.branch}`,
    `Last commit: ${context.lastCommit}`,
    "",
    "Dependency update diff summary:",
    context.diffSummary,
    "",
    "Full dependency update diff:",
    context.fullDiff.slice(0, 15_000),
    "",
    "Validation commands:",
    commands.map((command) => `- ${command}`).join("\n"),
    "",
    "Validation failure log:",
    logText.slice(0, 30_000),
    "",
    "Relevant file contents:",
    context.fileContexts.join("\n\n-----\n\n"),
  );

  return parts.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const commands = args.commands.filter(Boolean);
  const maxAttempts = args.attempts || 3;

  if (args.conflicts) {
    await resolveConflicts(maxAttempts);
    return;
  }

  if (!args.log) throw new Error("--log is required");
  if (commands.length === 0) throw new Error("At least one --command is required");

  const promptTemplatePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../prompts/renovate-fix.md",
  );
  const promptTemplate = await fs.readFile(promptTemplatePath, "utf8");
  let logText = await fs.readFile(path.resolve(process.cwd(), args.log), "utf8");
  const context = await collectContext(logText);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const useDiffMode = attempt < maxAttempts ? attempt % 2 === 1 : false;
    const mode = useDiffMode ? "diff" : "file-replacement";
    const temperature = attempt === 1 ? 0.2 : 0.3 + (attempt - 2) * 0.1;

    console.log(
      `\nAttempt ${attempt}/${maxAttempts} (mode: ${mode}, temperature: ${temperature.toFixed(1)})`,
    );

    if (attempt > 1) {
      run("git checkout -- .");
      run("git clean -f -- .renovate-ai-fix-*.patch .renovate-ai-response-*.txt renovate-ai-validation-*.log");
    }

    const prompt = buildPrompt(promptTemplate, context, commands, logText, mode);

    let responseText;
    try {
      responseText = await callGemini(prompt, { temperature });
    } catch (err) {
      console.error(`  Gemini API error: ${err.message}`);
      continue;
    }

    await fs.writeFile(
      path.resolve(process.cwd(), `.renovate-ai-response-${attempt}.txt`),
      responseText,
      "utf8",
    );

    let applied = false;

    if (mode === "diff") {
      const diffText = extractDiff(responseText);
      if (!diffText) {
        console.error("  Gemini did not return an applicable diff.");
        continue;
      }

      const patchPath = path.resolve(process.cwd(), `.renovate-ai-fix-${attempt}.patch`);
      await fs.writeFile(patchPath, `${diffText}\n`, "utf8");

      const patchResult = applyPatch(patchPath);
      if (!patchResult.ok) {
        console.error(`  Failed to apply patch: ${patchResult.error?.slice(0, 500)}`);
        logText += `\n\n--- Patch apply failure (attempt ${attempt}) ---\n${patchResult.error}`;
        continue;
      }
      applied = true;
    } else {
      const replacements = extractFileReplacements(responseText);
      if (!replacements) {
        const diffText = extractDiff(responseText);
        if (diffText) {
          const patchPath = path.resolve(process.cwd(), `.renovate-ai-fix-${attempt}.patch`);
          await fs.writeFile(patchPath, `${diffText}\n`, "utf8");
          const patchResult = applyPatch(patchPath);
          applied = patchResult.ok;
          if (!applied) {
            console.error("  File replacement extraction failed, diff fallback also failed.");
            continue;
          }
        } else {
          console.error("  Gemini did not return file replacements or a diff.");
          continue;
        }
      } else {
        applied = await applyFileReplacements(replacements, context.allowedPaths);
        if (!applied) {
          console.error("  Failed to write any file replacements.");
          continue;
        }
      }
    }

    if (!applied) continue;

    const pathValidation = validateChangedPaths(context.allowedPaths);
    if (!pathValidation.ok) {
      console.error(
        `  Refusing AI changes outside the approved context: ${pathValidation.denied.join(", ")}`,
      );
      logText += `\n\nRejected out-of-scope files: ${pathValidation.denied.join(", ")}`;
      continue;
    }

    const changedAfterPatch = run("git diff --name-only").stdout.trim();
    if (changedAfterPatch.includes("package.json") || changedAfterPatch.includes("build.gradle")) {
      console.log("  Dependency files changed, re-running install...");
      const installCmd = await fs
        .readFile(path.resolve(process.cwd(), ".renovate-install-command"), "utf8")
        .catch(() => "");
      if (installCmd.trim()) {
        run(`bash -lc "${installCmd.trim()}"`);
      }
    }

    const validation = runValidation(commands);
    await fs.writeFile(
      path.resolve(process.cwd(), `renovate-ai-validation-${attempt}.log`),
      validation.output,
      "utf8",
    );

    if (validation.ok) {
      console.log(`AI fix applied and validation succeeded on attempt ${attempt}.`);
      process.exit(0);
    }

    console.error(`  Validation still failing after attempt ${attempt}.`);
    logText = validation.output;
  }

  console.error(
    `AI fix failed after ${maxAttempts} attempts. Check .renovate-ai-response-*.txt for Gemini outputs.`,
  );
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
