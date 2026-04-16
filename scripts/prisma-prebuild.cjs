/**
 * Runs `prisma generate` before `next build`, with retries for Windows EPERM
 * (rename of query_engine-windows.dll.node) when another Node process briefly locks the file.
 */
const { execSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const maxAttempts = 5;
const delayMs = 3000;

function sleepMs(ms) {
  try {
    execSync(`powershell -NoProfile -Command "Start-Sleep -Milliseconds ${ms}"`, {
      stdio: "ignore",
      cwd: root,
    });
  } catch {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      /* busy fallback */
    }
  }
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    execSync("npx prisma generate", { stdio: "inherit", cwd: root, shell: true });
    process.exit(0);
  } catch {
    const isLast = attempt === maxAttempts;
    if (isLast) {
      console.error("\n--- prisma generate failed ---");
      console.error(
        "Windows EPERM on query_engine-windows.dll.node almost always means a process still has that file open."
      );
      console.error("Do this, then run `npm run build` again:");
      console.error("  1. Stop `npm run dev` (and any other terminal running this app).");
      console.error("  2. In Task Manager, end stray “Node.js” processes if needed.");
      console.error("  3. If it still fails: reboot once, or pause real-time AV for this folder.");
      console.error("\nWorkaround (client already generated): npm run build:next\n");
      process.exit(1);
    }
    console.warn(
      `[prisma-prebuild] attempt ${attempt}/${maxAttempts} failed; retrying in ${delayMs / 1000}s...`
    );
    sleepMs(delayMs);
  }
}
