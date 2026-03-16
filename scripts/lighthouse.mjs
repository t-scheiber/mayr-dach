import { spawn, execSync } from "child_process";

const filterPatterns = [
  "ERR:error",
  "Runtime error",
  "EPERM",
  "at rmSync",
  "at Launcher",
  "at Object.",
  "at runLighthouse",
  "at async",
  "taskkill stderr",
];

const lh = spawn(
  "lighthouse",
  [
    "https://mayr-dach.com",
    "--output",
    "html",
    "--output-path",
    "./lighthouse-report.html",
  ],
  { stdio: ["inherit", "inherit", "pipe"] }
);

lh.stderr.on("data", (chunk) => {
  const lines = chunk.toString().split("\n");
  for (const line of lines) {
    if (line && !filterPatterns.some((p) => line.includes(p))) {
      process.stderr.write(line + "\n");
    }
  }
});

lh.on("close", () => {
  try {
    execSync("explorer lighthouse-report.html", { stdio: "ignore" });
  } catch {
    // ignore
  }
});
