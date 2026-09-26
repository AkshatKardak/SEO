import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("\x1b[36m%s\x1b[0m", "   🚀 Starting SerpoAI Full-Stack Development Workspace   ");
console.log("\x1b[36m%s\x1b[0m", "   - Backend & In-Server ML Engine: http://localhost:5000 ");
console.log("\x1b[36m%s\x1b[0m", "   - Frontend Client:               http://localhost:5173 ");
console.log("\x1b[36m%s\x1b[0m", "==========================================================");

// Spawn Server
const serverProc = spawn(npmCmd, ["run", "server"], {
  cwd: path.join(rootDir, "server"),
  stdio: "inherit",
  shell: true,
});

// Spawn Client
const clientProc = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(rootDir, "client"),
  stdio: "inherit",
  shell: true,
});

function cleanup() {
  console.log("\nShutting down SerpoAI development servers...");
  try { serverProc.kill(); } catch {}
  try { clientProc.kill(); } catch {}
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
