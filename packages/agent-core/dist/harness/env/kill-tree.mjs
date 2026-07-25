// packages/agent-core/src/harness/env/kill-tree.ts
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
var DEFAULT_GRACE_MS = 3e3;
var MAX_GRACE_MS = 6e4;
function killProcessTree(pid, opts) {
  if (!Number.isFinite(pid) || pid <= 0) {
    return;
  }
  if (process.platform === "win32") {
    if (opts?.force === true) {
      signalProcessTreeWindows(pid, "SIGKILL");
      return;
    }
    const graceMs2 = normalizeGraceMs(opts?.graceMs);
    killProcessTreeWindows(pid, graceMs2);
    return;
  }
  const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
  if (opts?.force === true) {
    signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
    return;
  }
  const graceMs = normalizeGraceMs(opts?.graceMs);
  signalProcessTreeUnix(pid, "SIGTERM", useGroupKill);
  setTimeout(() => {
    const stillAlive = useGroupKill ? isProcessAlive(-pid) || isProcessAlive(pid) : isProcessAlive(pid);
    if (!stillAlive) {
      return;
    }
    signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
  }, graceMs).unref();
}
function signalProcessTree(pid, signal, opts) {
  if (!Number.isFinite(pid) || pid <= 0) {
    return;
  }
  if (process.platform === "win32") {
    signalProcessTreeWindows(pid, signal);
    return;
  }
  const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
  signalProcessTreeUnix(pid, signal, useGroupKill);
}
function normalizeGraceMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_GRACE_MS;
  }
  return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function parseProcessGroupId(value) {
  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) {
    return void 0;
  }
  const pgid = Number(value.trim());
  return Number.isSafeInteger(pgid) && pgid > 0 ? pgid : void 0;
}
function readProcessGroupIdFromPs(pid) {
  try {
    const res = spawnSync("ps", ["-p", String(pid), "-o", "pgid="], {
      encoding: "utf8",
      timeout: 500
    });
    if (res.error || res.status !== 0) {
      return void 0;
    }
    return parseProcessGroupId(res.stdout);
  } catch {
    return void 0;
  }
}
function readProcessGroupIdFromProc(pid) {
  try {
    const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
    const commEnd = stat.lastIndexOf(")");
    if (commEnd < 0) {
      return void 0;
    }
    const fields = stat.slice(commEnd + 1).trim().split(/\s+/);
    return parseProcessGroupId(fields[2]);
  } catch {
    return void 0;
  }
}
function isProcessGroupLeader(pid) {
  const procPgid = process.platform === "linux" ? readProcessGroupIdFromProc(pid) : void 0;
  const pgid = procPgid ?? readProcessGroupIdFromPs(pid);
  return pgid === pid;
}
function signalProcessTreeUnix(pid, signal, useGroupKill) {
  if (useGroupKill) {
    try {
      process.kill(-pid, signal);
      return;
    } catch {
    }
  }
  try {
    process.kill(pid, signal);
  } catch {
  }
}
function runTaskkill(args) {
  try {
    const child = spawn("taskkill", args, {
      stdio: "ignore",
      detached: true,
      windowsHide: true
    });
    child.once("error", () => {
    });
  } catch {
  }
}
function killProcessTreeWindows(pid, graceMs) {
  signalProcessTreeWindows(pid, "SIGTERM");
  setTimeout(() => {
    if (!isProcessAlive(pid)) {
      return;
    }
    signalProcessTreeWindows(pid, "SIGKILL");
  }, graceMs).unref();
}
function signalProcessTreeWindows(pid, signal) {
  const args = signal === "SIGKILL" ? ["/F", "/T", "/PID", String(pid)] : ["/T", "/PID", String(pid)];
  runTaskkill(args);
}
export {
  killProcessTree,
  signalProcessTree
};
