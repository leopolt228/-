import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as isTruthyEnvValue } from "./env-CHfvZ8Nb.js";
import { P as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-Crk_c9KW.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName, u as resolveGatewayLaunchAgentLabel } from "./constants-obO8goqF.js";
import { $ as executeSqliteQueryTakeFirstSync, O as resolveOpenClawStateSqlitePath, Q as executeSqliteQuerySync, a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction, et as getNodeSqliteKysely } from "./openclaw-state-db-DkOMT2fb.js";
import { r as runCommandWithTimeout } from "./exec-Cb0CNQNz.js";
import { a as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-BCaMyZ4m.js";
import { d as scheduleGatewaySigusr1Restart, l as resolveGatewayRestartDeferralTimeoutMs } from "./restart-B84EHBne.js";
import { t as forceKillChildProcessTree } from "./child-process-tree-CuWXndbk.js";
import { r as detectRespawnSupervisor, t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-BnF4Tqgn.js";
import { a as channelToNpmTag, l as normalizeUpdateChannel } from "./update-channels-CQNa2YMG.js";
import { n as compareSemverStrings, o as resolveNpmChannelTag, t as checkUpdateStatus } from "./update-check-CIh2X210.js";
import { r as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON } from "./update-control-plane-sentinel-ByRELXRQ.js";
import { t as MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX } from "./update-managed-service-handoff-cleanup-DiOrEHy2.js";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { spawn } from "node:child_process";
//#region src/infra/update-managed-service-handoff.ts
const PARENT_EXIT_SHUTDOWN_RESERVE_MS = 3e4;
const HANDOFF_READY_TIMEOUT_MS = 3e4;
const HANDOFF_READY_MARKER = "OPENCLAW_UPDATE_HANDOFF_READY\n";
const HANDOFF_STATE_DATABASE_BUSY_TIMEOUT_MS = 5e3;
const SYSTEMD_RUN_CANDIDATE_PATHS = ["/usr/bin/systemd-run", "/bin/systemd-run"];
const SERVICE_IDENTITY_ENV_VARS = /* @__PURE__ */ new Set([
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
]);
const HANDOFF_SCRIPT = String.raw`
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const params = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));

function appendLog(line) {
  try {
    fs.mkdirSync(path.dirname(params.logPath), { recursive: true, mode: 0o700 });
    fs.appendFileSync(params.logPath, "[" + new Date().toISOString() + "] " + line + "\n", {
      mode: 0o600,
    });
  } catch {
    // Best effort only.
  }
}

fs.writeSync(1, ${JSON.stringify(HANDOFF_READY_MARKER)});

function isPidAlive(pid) {
  if (!pid || typeof pid !== "number") {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err && err.code === "EPERM";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanupSensitiveFiles() {
  for (const filePath of params.sensitivePaths || []) {
    try {
      fs.rmSync(filePath, { force: true });
    } catch {
      // Best effort only.
    }
  }
}

function resolveExistingDirectory(candidates) {
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "string") {
      continue;
    }
    try {
      const stat = fs.statSync(candidate);
      if (stat.isDirectory()) {
        return candidate;
      }
    } catch {
      // Try the next candidate.
    }
  }
  return undefined;
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function isPendingUpdatePayload(payload) {
  const reason = payload && payload.stats && payload.stats.reason;
  return (
    payload &&
    payload.kind === "update" &&
    payload.status === "skipped" &&
    (reason === "managed-service-handoff-started" || reason === "restart-health-pending")
  );
}

function openStateDatabase() {
  if (!params.stateDatabasePath || typeof params.stateDatabasePath !== "string") {
    return null;
  }
  try {
    const sqlite = require("node:sqlite");
    fs.mkdirSync(path.dirname(params.stateDatabasePath), { recursive: true, mode: 0o700 });
    const db = new sqlite.DatabaseSync(params.stateDatabasePath);
    db.exec("PRAGMA busy_timeout = ${HANDOFF_STATE_DATABASE_BUSY_TIMEOUT_MS};");
    db.exec([
      "CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (",
      "sentinel_key TEXT NOT NULL PRIMARY KEY,",
      "version INTEGER NOT NULL,",
      "kind TEXT NOT NULL,",
      "status TEXT NOT NULL,",
      "ts INTEGER NOT NULL,",
      "session_key TEXT,",
      "thread_id TEXT,",
      "delivery_channel TEXT,",
      "delivery_to TEXT,",
      "delivery_account_id TEXT,",
      "message TEXT,",
      "continuation_json TEXT,",
      "doctor_hint TEXT,",
      "stats_json TEXT,",
      "payload_json TEXT NOT NULL,",
      "updated_at_ms INTEGER NOT NULL",
      ") STRICT;",
      "CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts",
      "ON gateway_restart_sentinel(ts DESC, sentinel_key);",
    ].join(" "));
    ensureGatewayRestartSentinelColumns(db);
    hardenStateDatabaseFiles();
    return db;
  } catch (err) {
    appendLog("failed to open restart sentinel database: " + (err && err.stack ? err.stack : String(err)));
    return null;
  }
}

function tableHasColumn(db, tableName, columnName) {
  try {
    return db.prepare("PRAGMA table_info(" + tableName + ")").all().some((row) => row && row.name === columnName);
  } catch {
    return false;
  }
}

function ensureColumn(db, tableName, columnSql) {
  const columnName = columnSql.trim().split(/\s+/, 1)[0];
  if (!columnName || tableHasColumn(db, tableName, columnName)) {
    return;
  }
  db.exec("ALTER TABLE " + tableName + " ADD COLUMN " + columnSql + ";");
}

function ensureGatewayRestartSentinelColumns(db) {
  ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
}

function hardenStateDatabaseFiles() {
  if (!params.stateDatabasePath || typeof params.stateDatabasePath !== "string") {
    return;
  }
  for (const filePath of [
    params.stateDatabasePath,
    params.stateDatabasePath + "-wal",
    params.stateDatabasePath + "-shm",
  ]) {
    try {
      if (fs.existsSync(filePath)) {
        fs.chmodSync(filePath, 0o600);
      }
    } catch {
      // Best effort only.
    }
  }
}

function parseJsonColumn(value) {
  if (typeof value !== "string" || !value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readRestartSentinelRecord(db) {
  const row = db
    .prepare(
      [
        "SELECT version, kind, status, ts, session_key, thread_id,",
        "delivery_channel, delivery_to, delivery_account_id, message, continuation_json,",
        "doctor_hint, stats_json, updated_at_ms",
        "FROM gateway_restart_sentinel WHERE sentinel_key = ?",
      ].join(" "),
    )
    .get("current");
  if (
    !row ||
    row.version !== 1 ||
    typeof row.kind !== "string" ||
    typeof row.status !== "string" ||
    typeof row.ts !== "number" ||
    typeof row.updated_at_ms !== "number"
  ) {
    return null;
  }
  const payload = {
    kind: row.kind,
    status: row.status,
    ts: row.ts,
  };
  if (typeof row.session_key === "string") payload.sessionKey = row.session_key;
  if (typeof row.thread_id === "string") payload.threadId = row.thread_id;
  const deliveryContext = {};
  if (typeof row.delivery_channel === "string") deliveryContext.channel = row.delivery_channel;
  if (typeof row.delivery_to === "string") deliveryContext.to = row.delivery_to;
  if (typeof row.delivery_account_id === "string") deliveryContext.accountId = row.delivery_account_id;
  if (Object.keys(deliveryContext).length > 0) payload.deliveryContext = deliveryContext;
  if (typeof row.message === "string") payload.message = row.message;
  const continuation = parseJsonColumn(row.continuation_json);
  if (continuation) payload.continuation = continuation;
  if (typeof row.doctor_hint === "string") payload.doctorHint = row.doctor_hint;
  const stats = parseJsonColumn(row.stats_json);
  if (stats) payload.stats = stats;
  return { revision: row.updated_at_ms, payload };
}

function readRestartSentinelRevisionFloor(db) {
  const row = db
    .prepare("SELECT updated_at_ms FROM gateway_restart_sentinel WHERE sentinel_key = ?")
    .get("revision-floor");
  if (!row) return null;
  if (!Number.isSafeInteger(row.updated_at_ms)) {
    throw new Error("restart sentinel revision floor is outside the safe integer range");
  }
  return row.updated_at_ms;
}

function advanceRestartSentinelRevisionFloor(db, revision) {
  const payloadJson = JSON.stringify({ kind: "restart", status: "skipped", ts: revision });
  db.prepare(
    [
      "INSERT INTO gateway_restart_sentinel (",
      "sentinel_key, version, kind, status, ts, session_key, thread_id,",
      "delivery_channel, delivery_to, delivery_account_id, message, continuation_json,",
      "doctor_hint, stats_json, payload_json, updated_at_ms",
      ") VALUES ('revision-floor', 1, 'restart', 'skipped', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)",
      "ON CONFLICT(sentinel_key) DO UPDATE SET",
      "ts = excluded.ts, payload_json = excluded.payload_json, updated_at_ms = excluded.updated_at_ms",
    ].join(" "),
  ).run(revision, payloadJson, revision);
}

function writeRestartSentinelPayload(db, payload, currentRevision) {
  const revisionFloor = readRestartSentinelRevisionFloor(db);
  const updatedAtMs = Math.max(Date.now(), Math.max(currentRevision || 0, revisionFloor || 0) + 1);
  if (!Number.isSafeInteger(updatedAtMs)) {
    throw new Error("restart sentinel revision exhausted the safe integer range");
  }
  const values = [
    payload.kind,
    payload.status,
    payload.ts,
    payload.sessionKey || null,
    payload.threadId || null,
    payload.deliveryContext && typeof payload.deliveryContext.channel === "string"
      ? payload.deliveryContext.channel
      : null,
    payload.deliveryContext && typeof payload.deliveryContext.to === "string"
      ? payload.deliveryContext.to
      : null,
    payload.deliveryContext && typeof payload.deliveryContext.accountId === "string"
      ? payload.deliveryContext.accountId
      : null,
    payload.message || null,
    payload.continuation ? JSON.stringify(payload.continuation) : null,
    payload.doctorHint || null,
    payload.stats ? JSON.stringify(payload.stats) : null,
    JSON.stringify(payload),
    updatedAtMs,
  ];
  let changed;
  if (currentRevision === null) {
    changed = db.prepare(
      [
        "INSERT INTO gateway_restart_sentinel (",
        "sentinel_key, version, kind, status, ts, session_key, thread_id,",
        "delivery_channel, delivery_to, delivery_account_id, message, continuation_json,",
        "doctor_hint, stats_json, payload_json, updated_at_ms",
        ") VALUES ('current', 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ].join(" "),
    ).run(...values).changes === 1;
  } else {
    changed = db.prepare(
      [
        "UPDATE gateway_restart_sentinel SET",
        "version = 1, kind = ?, status = ?, ts = ?, session_key = ?, thread_id = ?,",
        "delivery_channel = ?, delivery_to = ?, delivery_account_id = ?, message = ?,",
        "continuation_json = ?, doctor_hint = ?, stats_json = ?, payload_json = ?, updated_at_ms = ?",
        "WHERE sentinel_key = 'current' AND updated_at_ms = ?",
      ].join(" "),
    ).run(...values, currentRevision).changes === 1;
  }
  if (changed) {
    // This runs inside the same BEGIN IMMEDIATE section as the guarded current-row write.
    advanceRestartSentinelRevisionFloor(db, updatedAtMs);
  }
  return changed;
}

function buildFallbackFailurePayload(reason) {
  const metaFile = params.metaPath ? readJsonFile(params.metaPath) : null;
  const meta = metaFile && metaFile.version === 1 && metaFile.meta ? metaFile.meta : {};
  const payload = {
    kind: "update",
    status: "error",
    ts: Date.now(),
    message: typeof meta.note === "string" ? meta.note : null,
    stats: {
      mode: "unknown",
      ...(typeof meta.handoffId === "string" && meta.handoffId.trim()
        ? { handoffId: meta.handoffId }
        : {}),
      reason,
      steps: [],
      durationMs: 0,
    },
  };
  if (typeof meta.sessionKey === "string" && meta.sessionKey.trim()) {
    payload.sessionKey = meta.sessionKey;
  }
  if (meta.deliveryContext && typeof meta.deliveryContext === "object") {
    payload.deliveryContext = meta.deliveryContext;
  }
  if (typeof meta.threadId === "string" && meta.threadId.trim()) {
    payload.threadId = meta.threadId;
  }
  return payload;
}

function markUpdateSentinelFailureIfPending(reason) {
  const snapshotDb = openStateDatabase();
  if (!snapshotDb) return;
  let snapshot;
  try {
    snapshot = readRestartSentinelRecord(snapshotDb);
  } catch {
    return;
  } finally {
    try {
      snapshotDb.close();
    } catch {}
  }
  const fallbackPayload = snapshot === null ? buildFallbackFailurePayload(reason) : null;

  const db = openStateDatabase();
  if (!db) return;
  let transactionOpen = false;
  try {
    db.exec("BEGIN IMMEDIATE;");
    transactionOpen = true;
    const current = readRestartSentinelRecord(db);
    if (
      (snapshot === null && current !== null) ||
      (snapshot !== null &&
        (current === null || current.revision !== snapshot.revision))
    ) {
      db.exec("COMMIT;");
      transactionOpen = false;
      return;
    }

    let payload = current && current.payload;
    if (payload && (payload.kind !== "update" || !isPendingUpdatePayload(payload))) {
      db.exec("COMMIT;");
      transactionOpen = false;
      return;
    }
    const handoffId = typeof params.handoffId === "string" ? params.handoffId.trim() : "";
    if (payload && handoffId && (!payload.stats || payload.stats.handoffId !== handoffId)) {
      db.exec("COMMIT;");
      transactionOpen = false;
      return;
    }
    if (payload) {
      payload = { ...payload, status: "error" };
      delete payload.continuation;
      payload.stats = { ...(payload.stats || {}), reason };
    } else {
      payload = fallbackPayload;
    }
    if (!payload) {
      throw new Error("restart sentinel disappeared before guarded failure write");
    }
    if (!writeRestartSentinelPayload(db, payload, current ? current.revision : null)) {
      throw new Error("restart sentinel changed before guarded failure write");
    }
    db.exec("COMMIT;");
    transactionOpen = false;
  } catch (err) {
    if (transactionOpen) {
      try {
        db.exec("ROLLBACK;");
      } catch {}
    }
    appendLog("failed to write update sentinel failure: " + (err && err.stack ? err.stack : String(err)));
  } finally {
    hardenStateDatabaseFiles();
    try {
      db.close();
    } catch {}
  }
}

function runServiceCommand(command, args) {
  try {
    const result = spawnSync(command, args, { stdio: "ignore", timeout: 30000 });
    return typeof result.status === "number" ? result.status : 1;
  } catch {
    return 1;
  }
}

function startGatewayServiceBestEffort() {
  const recovery = params.serviceRecovery;
  if (!recovery || typeof recovery !== "object" || !recovery.kind) {
    return;
  }
  let target = "";
  let status = 1;
  if (recovery.kind === "systemd") {
    target = recovery.unit;
    status = runServiceCommand("systemctl", ["--user", "start", recovery.unit]);
  } else if (recovery.kind === "launchd") {
    target = recovery.label;
    const serviceTarget = "gui/" + recovery.uid + "/" + recovery.label;
    status = runServiceCommand("launchctl", ["kickstart", serviceTarget]);
    if (status !== 0) {
      runServiceCommand("launchctl", ["enable", serviceTarget]);
      status = runServiceCommand("launchctl", [
        "bootstrap",
        "gui/" + recovery.uid,
        recovery.plistPath,
      ]);
      if (status !== 0) {
        // Bootstrap can fail when the label is already loaded. Retry start-only
        // so recovery does not bounce a gateway that is already running.
        status = runServiceCommand("launchctl", ["kickstart", serviceTarget]);
      }
    }
  } else if (recovery.kind === "schtasks") {
    target = recovery.taskName;
    status = runServiceCommand("schtasks.exe", ["/Run", "/TN", recovery.taskName]);
  } else {
    return;
  }
  appendLog(
    "gateway service recovery " +
      (status === 0 ? "succeeded" : "failed status=" + status) +
      " target=" +
      target,
  );
}

(async () => {
  const deadline =
    typeof params.parentExitTimeoutMs === "number"
      ? Date.now() + params.parentExitTimeoutMs
      : null;
  while (isPidAlive(params.parentPid) && (deadline === null || Date.now() < deadline)) {
    await sleep(250);
  }
  if (deadline !== null && isPidAlive(params.parentPid)) {
    appendLog("gateway parent pid " + params.parentPid + " did not exit before handoff timeout");
    markUpdateSentinelFailureIfPending("managed-service-handoff-parent-timeout");
    cleanupSensitiveFiles();
    process.exitCode = 1;
    return;
  }

  appendLog("starting managed update command: " + params.commandLabel);
  let outputFd;
  try {
    outputFd = fs.openSync(params.logPath, "a", 0o600);
    const commandCwd =
      resolveExistingDirectory([
        params.cwd,
        os.homedir(),
        os.tmpdir(),
        path.parse(process.execPath).root,
      ]) || params.cwd;
    if (commandCwd !== params.cwd) {
      appendLog("managed update command cwd fallback: " + params.cwd + " -> " + commandCwd);
    }
    const child = spawn(params.commandArgv[0], params.commandArgv.slice(1), {
      cwd: commandCwd,
      env: process.env,
      detached: true,
      stdio: ["ignore", outputFd, outputFd],
    });
    appendLog("managed update command pid=" + (child.pid || "unknown"));
    const exit = await new Promise((resolve) => {
      child.once("error", (err) => resolve({ error: err }));
      child.once("exit", (code, signal) => resolve({ code, signal }));
    });
    if (exit && exit.error) {
      appendLog("managed update command failed to start: " + (exit.error && exit.error.stack ? exit.error.stack : String(exit.error)));
      markUpdateSentinelFailureIfPending("managed-service-handoff-spawn-failed");
      startGatewayServiceBestEffort();
      process.exitCode = 1;
      return;
    }
    appendLog(
      "managed update command exited code=" +
        (exit && exit.code !== null && exit.code !== undefined ? exit.code : "null") +
        " signal=" +
        (exit && exit.signal ? exit.signal : "null"),
    );
    if (exit && typeof exit.code === "number" && exit.code !== 0) {
      markUpdateSentinelFailureIfPending("managed-service-handoff-failed");
      startGatewayServiceBestEffort();
      process.exitCode = exit.code;
    } else if (exit && exit.signal) {
      markUpdateSentinelFailureIfPending("managed-service-handoff-failed");
      startGatewayServiceBestEffort();
      process.exitCode = 1;
    }
  } finally {
    if (outputFd !== undefined) {
      try {
        fs.closeSync(outputFd);
      } catch {
        // Ignore close failures.
      }
    }
    cleanupSensitiveFiles();
  }
})().catch((err) => {
  appendLog("handoff failed: " + (err && err.stack ? err.stack : String(err)));
  markUpdateSentinelFailureIfPending("managed-service-handoff-helper-failed");
  startGatewayServiceBestEffort();
  cleanupSensitiveFiles();
  process.exitCode = 1;
});
`;
let activeManagedServiceUpdateHandoff = null;
function isNodeLikeRuntime(execPath) {
	if (!execPath?.trim()) return false;
	const base = path.basename(execPath).toLowerCase();
	return base === "node" || base === "node.exe" || base === "bun" || base === "bun.exe";
}
function resolveUpdateCliArgv(params) {
	const updateArgs = [
		"update",
		"--yes",
		"--json"
	];
	if (params.channel) updateArgs.push("--channel", params.channel);
	if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) updateArgs.push("--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3))));
	const execPath = params.execPath?.trim();
	const argv1 = params.argv1?.trim();
	if (execPath && argv1) return [
		execPath,
		argv1,
		...updateArgs
	];
	if (execPath && !isNodeLikeRuntime(execPath)) return [execPath, ...updateArgs];
	return ["openclaw", ...updateArgs];
}
function formatManagedServiceUpdateCommand(params) {
	const args = [
		"openclaw",
		"update",
		"--yes"
	];
	if (params?.channel) args.push("--channel", params.channel);
	if (typeof params?.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) args.push("--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3))));
	return args.join(" ");
}
function resolveGatewayServiceRecovery(supervisor, env) {
	if (supervisor === "systemd") {
		const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
		return {
			kind: "systemd",
			unit: override ? override.endsWith(".service") ? override : `${override}.service` : `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`
		};
	}
	if (supervisor === "launchd") {
		const label = env.OPENCLAW_LAUNCHD_LABEL?.trim() || resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
		const uid = typeof process.getuid === "function" ? process.getuid() : 501;
		const home = env.HOME?.trim() || os.homedir();
		return {
			kind: "launchd",
			uid,
			label,
			plistPath: path.join(home, "Library", "LaunchAgents", `${label}.plist`)
		};
	}
	if (supervisor === "schtasks") return {
		kind: "schtasks",
		taskName: env.OPENCLAW_WINDOWS_TASK_NAME?.trim() || resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE)
	};
}
function stripSupervisorHintEnv(env) {
	const next = { ...env };
	for (const key of SUPERVISOR_HINT_ENV_VARS) {
		if (SERVICE_IDENTITY_ENV_VARS.has(key)) continue;
		delete next[key];
	}
	return next;
}
async function resolveManagedServiceHandoffCwd(root) {
	const candidates = [
		os.homedir(),
		os.tmpdir(),
		path.dirname(process.execPath),
		root
	];
	for (const candidate of candidates) {
		if (!candidate.trim()) continue;
		try {
			if ((await fs.stat(candidate)).isDirectory()) return candidate;
		} catch {}
	}
	return root;
}
async function resolveExecutableOnPath(name, env, fallbackPaths) {
	const candidates = /* @__PURE__ */ new Set();
	const pathValue = env.PATH?.trim();
	if (pathValue) {
		for (const dir of pathValue.split(path.delimiter)) if (dir.trim()) candidates.add(path.join(dir, name));
	}
	for (const candidate of fallbackPaths) candidates.add(candidate);
	for (const candidate of candidates) try {
		await fs.access(candidate, fs.constants.X_OK);
		return candidate;
	} catch {}
	return null;
}
function sanitizeSystemdUnitFragment(value) {
	return (value?.trim().replace(/[^A-Za-z0-9_.:@-]+/gu, "-") ?? "").replace(/^-+|-+$/gu, "").slice(0, 80);
}
function buildSystemdHandoffUnitName(handoffId) {
	return `openclaw-update-${sanitizeSystemdUnitFragment(handoffId) || sanitizeSystemdUnitFragment(`${process.pid}-${Date.now()}`) || "handoff"}.scope`;
}
async function waitForHandoffReady(child) {
	const output = child.stdout;
	await new Promise((resolve, reject) => {
		let settled = false;
		let buffered = "";
		const cleanup = () => {
			clearTimeout(timeout);
			child.removeListener("error", onError);
			child.removeListener("exit", onExit);
			output.removeListener("data", onData);
			output.removeListener("error", onOutputError);
			output.destroy();
		};
		const finish = (err) => {
			if (settled) return;
			settled = true;
			cleanup();
			if (err) reject(err);
			else resolve();
		};
		const onError = (err) => finish(err);
		const onExit = (code, signal) => finish(/* @__PURE__ */ new Error(`managed update handoff exited before signaling readiness (code=${code ?? "null"}, signal=${signal ?? "null"})`));
		const terminateBeforeFailure = () => {
			if (typeof child.pid !== "number" || child.pid <= 0) return;
			forceKillChildProcessTree(child);
		};
		const onOutputError = (err) => {
			terminateBeforeFailure();
			finish(err);
		};
		const onData = (chunk) => {
			buffered = `${buffered}${chunk.toString()}`.slice(-60);
			if (buffered.includes(HANDOFF_READY_MARKER)) finish();
		};
		const timeout = setTimeout(() => {
			terminateBeforeFailure();
			finish(/* @__PURE__ */ new Error("managed update handoff did not signal readiness within 30 seconds"));
		}, HANDOFF_READY_TIMEOUT_MS);
		child.once("error", onError);
		child.once("exit", onExit);
		output.once("error", onOutputError);
		output.on("data", onData);
	});
}
async function resolveHandoffSpawn(params) {
	if (params.supervisor !== "systemd") return {
		command: params.execPath,
		args: [params.scriptPath, params.paramsPath]
	};
	const systemdRunPath = await resolveExecutableOnPath("systemd-run", params.env, SYSTEMD_RUN_CANDIDATE_PATHS);
	if (!systemdRunPath) throw new Error("systemd-run is required to start the managed update handoff outside openclaw-gateway.service");
	return {
		command: systemdRunPath,
		args: [
			"--user",
			"--scope",
			"--collect",
			`--unit=${buildSystemdHandoffUnitName(params.handoffId)}`,
			params.execPath,
			params.scriptPath,
			params.paramsPath
		]
	};
}
async function spawnManagedServiceUpdateHandoff(params, onExit) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX));
	const scriptPath = path.join(dir, "handoff.cjs");
	const paramsPath = path.join(dir, "handoff.json");
	const metaPath = path.join(dir, "sentinel-meta.json");
	const logPath = path.join(dir, "handoff.log");
	const commandArgv = resolveUpdateCliArgv({
		timeoutMs: params.timeoutMs,
		channel: params.channel,
		execPath: params.execPath ?? process.execPath,
		argv1: params.argv1 ?? process.argv[1]
	});
	const commandLabel = formatManagedServiceUpdateCommand({
		timeoutMs: params.timeoutMs,
		channel: params.channel
	});
	const handoffCwd = await resolveManagedServiceHandoffCwd(params.root);
	const metaFile = {
		version: 1,
		meta: params.meta
	};
	const helperParams = {
		parentPid: params.parentPid ?? process.pid,
		parentExitTimeoutMs: params.restartDrainTimeoutMs === void 0 ? null : Math.max(0, params.restartDelayMs ?? 0) + Math.max(0, params.restartDrainTimeoutMs) + PARENT_EXIT_SHUTDOWN_RESERVE_MS,
		cwd: handoffCwd,
		commandArgv,
		commandLabel,
		handoffId: params.handoffId,
		logPath,
		metaPath,
		stateDatabasePath: resolveOpenClawStateSqlitePath(params.env ?? process.env),
		sensitivePaths: [
			scriptPath,
			paramsPath,
			metaPath
		],
		serviceRecovery: resolveGatewayServiceRecovery(params.supervisor, params.env ?? process.env)
	};
	let child;
	try {
		await fs.writeFile(scriptPath, `${HANDOFF_SCRIPT}\n`, { mode: 448 });
		await fs.writeFile(paramsPath, `${JSON.stringify(helperParams, null, 2)}\n`, { mode: 384 });
		await fs.writeFile(metaPath, `${JSON.stringify(metaFile, null, 2)}\n`, { mode: 384 });
		const env = {
			...stripSupervisorHintEnv(params.env ?? process.env),
			[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV]: metaPath,
			OPENCLAW_UPDATE_RUN_HANDOFF: "1"
		};
		const spawnTarget = await resolveHandoffSpawn({
			supervisor: params.supervisor,
			env,
			execPath: params.execPath ?? process.execPath,
			scriptPath,
			paramsPath,
			handoffId: params.handoffId
		});
		child = spawn(spawnTarget.command, spawnTarget.args, {
			cwd: handoffCwd,
			env,
			detached: true,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		});
		child.once("exit", onExit);
		await waitForHandoffReady(child);
	} catch (err) {
		child?.removeListener("exit", onExit);
		await fs.rm(dir, {
			recursive: true,
			force: true
		}).catch(() => {});
		throw err;
	}
	child.unref();
	return {
		status: "started",
		...child.pid ? { pid: child.pid } : {},
		command: commandLabel,
		logPath,
		...params.handoffId ? { handoffId: params.handoffId } : {}
	};
}
async function startManagedServiceUpdateHandoff(params) {
	const active = activeManagedServiceUpdateHandoff;
	if (active) return {
		...await active,
		status: "joined"
	};
	const flight = spawnManagedServiceUpdateHandoff(params, () => {
		if (activeManagedServiceUpdateHandoff === flight) activeManagedServiceUpdateHandoff = null;
	});
	activeManagedServiceUpdateHandoff = flight;
	try {
		return await flight;
	} catch (err) {
		if (activeManagedServiceUpdateHandoff === flight) activeManagedServiceUpdateHandoff = null;
		throw err;
	}
}
function buildManagedServiceHandoffUnavailableMessage(command) {
	return ["OpenClaw updates cannot safely run inside the live gateway process without a managed-service handoff.", `Run \`${command}\` from a shell outside the gateway service, or restart/update from the host UI.`].join("\n");
}
//#endregion
//#region src/infra/update-startup.ts
let updateAvailableCache = null;
function getUpdateAvailable() {
	return updateAvailableCache;
}
const UPDATE_CHECK_STATE_KEY = "default";
const UPDATE_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const ONE_HOUR_MS = 3600 * 1e3;
const AUTO_UPDATE_COMMAND_TIMEOUT_MS = 2700 * 1e3;
const AUTO_STABLE_DELAY_HOURS_DEFAULT = 6;
const AUTO_STABLE_JITTER_HOURS_DEFAULT = 12;
const AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT = 1;
const MANAGED_AUTO_UPDATE_SYSTEMD_RESTART_GRACE_MS = 2e3;
function shouldSkipCheck(allowInTests) {
	if (allowInTests) return false;
	if (process.env.VITEST || false) return true;
	return false;
}
function resolveAutoUpdatePolicy(cfg) {
	const auto = cfg.update?.auto;
	return {
		enabled: Boolean(auto?.enabled),
		stableDelayHours: AUTO_STABLE_DELAY_HOURS_DEFAULT,
		stableJitterHours: AUTO_STABLE_JITTER_HOURS_DEFAULT,
		betaCheckIntervalHours: AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT
	};
}
function resolveCheckIntervalMs(cfg) {
	const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
	const auto = resolveAutoUpdatePolicy(cfg);
	if (!auto.enabled) return UPDATE_CHECK_INTERVAL_MS;
	if (channel === "beta") return Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS));
	if (channel === "stable") return ONE_HOUR_MS;
	return UPDATE_CHECK_INTERVAL_MS;
}
function presentString(value) {
	return value ?? void 0;
}
async function readState() {
	const database = openOpenClawStateDatabase();
	const stateDb = getNodeSqliteKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("update_check_state").selectAll().where("state_key", "=", UPDATE_CHECK_STATE_KEY));
	if (!row) return {};
	return {
		lastCheckedAt: presentString(row.last_checked_at),
		lastNotifiedVersion: presentString(row.last_notified_version),
		lastNotifiedTag: presentString(row.last_notified_tag),
		lastAvailableVersion: presentString(row.last_available_version),
		lastAvailableTag: presentString(row.last_available_tag),
		autoInstallId: presentString(row.auto_install_id),
		autoFirstSeenVersion: presentString(row.auto_first_seen_version),
		autoFirstSeenTag: presentString(row.auto_first_seen_tag),
		autoFirstSeenAt: presentString(row.auto_first_seen_at),
		autoLastAttemptVersion: presentString(row.auto_last_attempt_version),
		autoLastAttemptAt: presentString(row.auto_last_attempt_at),
		autoLastSuccessVersion: presentString(row.auto_last_success_version),
		autoLastSuccessAt: presentString(row.auto_last_success_at)
	};
}
async function writeState(state) {
	const updatedAtMs = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, stateDb.deleteFrom("update_check_state").where("state_key", "=", UPDATE_CHECK_STATE_KEY));
		executeSqliteQuerySync(db, stateDb.insertInto("update_check_state").values({
			state_key: UPDATE_CHECK_STATE_KEY,
			last_checked_at: state.lastCheckedAt ?? null,
			last_notified_version: state.lastNotifiedVersion ?? null,
			last_notified_tag: state.lastNotifiedTag ?? null,
			last_available_version: state.lastAvailableVersion ?? null,
			last_available_tag: state.lastAvailableTag ?? null,
			auto_install_id: state.autoInstallId ?? null,
			auto_first_seen_version: state.autoFirstSeenVersion ?? null,
			auto_first_seen_tag: state.autoFirstSeenTag ?? null,
			auto_first_seen_at: state.autoFirstSeenAt ?? null,
			auto_last_attempt_version: state.autoLastAttemptVersion ?? null,
			auto_last_attempt_at: state.autoLastAttemptAt ?? null,
			auto_last_success_version: state.autoLastSuccessVersion ?? null,
			auto_last_success_at: state.autoLastSuccessAt ?? null,
			updated_at_ms: updatedAtMs
		}));
	});
}
function sameUpdateAvailable(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.currentVersion === b.currentVersion && a.latestVersion === b.latestVersion && a.channel === b.channel;
}
function setUpdateAvailableCache(params) {
	if (sameUpdateAvailable(updateAvailableCache, params.next)) return;
	updateAvailableCache = params.next;
	params.onUpdateAvailableChange?.(params.next);
}
function isPersistedAvailabilityForChannel(params) {
	const tag = params.state.lastAvailableTag?.trim();
	if (params.channel === "stable") return !tag || tag === "latest";
	if (params.channel === "beta") return tag === "beta" || tag === "latest";
	return tag === params.channel;
}
function resolvePersistedUpdateAvailable(state, channel) {
	const latestVersion = state.lastAvailableVersion?.trim();
	if (!latestVersion || !isPersistedAvailabilityForChannel({
		state,
		channel
	})) return null;
	const cmp = compareSemverStrings(VERSION, latestVersion);
	if (cmp == null || cmp >= 0) return null;
	return {
		currentVersion: VERSION,
		latestVersion,
		channel: state.lastAvailableTag?.trim() || channelToNpmTag(channel)
	};
}
function clearPersistedAvailabilityForChannel(nextState, channel) {
	if (!isPersistedAvailabilityForChannel({
		state: nextState,
		channel
	})) return;
	delete nextState.lastAvailableVersion;
	delete nextState.lastAvailableTag;
}
function resolveStableJitterMs(params) {
	if (params.jitterWindowMs <= 0) return 0;
	return createHash("sha256").update(`${params.installId}:${params.version}:${params.tag}`).digest().readUInt32BE(0) % (Math.floor(params.jitterWindowMs) + 1);
}
function resolveUpdateCheckNowMs(valueMs) {
	return asDateTimestampMs(valueMs) ?? asDateTimestampMs(Date.now()) ?? 0;
}
function resolveUpdateCheckTimestamp(valueMs) {
	return timestampMsToIsoString(valueMs) ?? timestampMsToIsoString(resolveUpdateCheckNowMs(Date.now())) ?? (/* @__PURE__ */ new Date()).toISOString();
}
function resolveStableAutoApplyAtMs(params) {
	if (!params.nextState.autoInstallId) params.nextState.autoInstallId = params.state.autoInstallId?.trim() || randomUUID();
	const installId = params.nextState.autoInstallId;
	if (!(params.state.autoFirstSeenVersion === params.version && params.state.autoFirstSeenTag === params.tag)) {
		params.nextState.autoFirstSeenVersion = params.version;
		params.nextState.autoFirstSeenTag = params.tag;
		params.nextState.autoFirstSeenAt = resolveUpdateCheckTimestamp(params.nowMs);
	} else {
		params.nextState.autoFirstSeenVersion = params.state.autoFirstSeenVersion;
		params.nextState.autoFirstSeenTag = params.state.autoFirstSeenTag;
		params.nextState.autoFirstSeenAt = params.state.autoFirstSeenAt;
	}
	const parsedFirstSeenMs = params.nextState.autoFirstSeenAt ? Date.parse(params.nextState.autoFirstSeenAt) : params.nowMs;
	const firstSeenMs = Number.isFinite(parsedFirstSeenMs) ? parsedFirstSeenMs : params.nowMs;
	const baseDelayMs = Math.max(0, params.stableDelayHours) * ONE_HOUR_MS;
	const jitterWindowMs = Math.max(0, params.stableJitterHours) * ONE_HOUR_MS;
	const jitterMs = resolveStableJitterMs({
		installId,
		version: params.version,
		tag: params.tag,
		jitterWindowMs
	});
	return firstSeenMs + baseDelayMs + jitterMs;
}
function resolveAutoUpdateHandoffRoot(root) {
	if (root?.trim()) return root;
	try {
		return process.cwd();
	} catch {
		return os.homedir();
	}
}
function resolveManagedAutoUpdateRestartDelayMs(supervisor) {
	return supervisor === "systemd" ? MANAGED_AUTO_UPDATE_SYSTEMD_RESTART_GRACE_MS : 0;
}
async function startManagedServiceAutoUpdateHandoff(params) {
	const restartDelayMs = resolveManagedAutoUpdateRestartDelayMs(params.supervisor);
	const handoffId = randomUUID();
	try {
		const started = await startManagedServiceUpdateHandoff({
			root: resolveAutoUpdateHandoffRoot(params.root),
			timeoutMs: params.timeoutMs,
			restartDrainTimeoutMs: params.restartDrainTimeoutMs,
			channel: params.channel,
			restartDelayMs,
			supervisor: params.supervisor,
			handoffId,
			meta: {
				handoffId,
				note: "background auto-update"
			}
		});
		if (started.status === "started") scheduleGatewaySigusr1Restart({
			delayMs: restartDelayMs,
			reason: "update.auto",
			skipCooldown: true,
			skipDeferral: true
		});
		return {
			ok: true,
			code: 0,
			reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
			command: started.command,
			logPath: started.logPath
		};
	} catch (err) {
		return {
			ok: false,
			code: null,
			reason: String(err)
		};
	}
}
async function runAutoUpdateCommand(params) {
	if (isGatewayExternallySupervised()) return {
		ok: false,
		code: null,
		reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
	};
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (supervisor) return await startManagedServiceAutoUpdateHandoff({
		channel: params.channel,
		timeoutMs: params.timeoutMs,
		restartDrainTimeoutMs: params.restartDrainTimeoutMs,
		root: params.root,
		supervisor
	});
	const baseArgs = [
		"update",
		"--yes",
		"--channel",
		params.channel,
		"--json"
	];
	const execPath = process.execPath?.trim();
	const argv1 = process.argv[1]?.trim();
	const lowerExecBase = execPath ? normalizeLowercaseStringOrEmpty(path.basename(execPath)) : "";
	const runtimeIsNodeOrBun = lowerExecBase === "node" || lowerExecBase === "node.exe" || lowerExecBase === "bun" || lowerExecBase === "bun.exe";
	const argv = [];
	if (execPath && argv1) argv.push(execPath, argv1, ...baseArgs);
	else if (execPath && !runtimeIsNodeOrBun) argv.push(execPath, ...baseArgs);
	else if (execPath && params.root) {
		const candidates = [
			path.join(params.root, "dist", "entry.js"),
			path.join(params.root, "dist", "entry.mjs"),
			path.join(params.root, "dist", "index.js"),
			path.join(params.root, "dist", "index.mjs")
		];
		for (const candidate of candidates) try {
			await fs.access(candidate);
			argv.push(execPath, candidate, ...baseArgs);
			break;
		} catch {}
	}
	if (argv.length === 0) argv.push("openclaw", ...baseArgs);
	try {
		const res = await runCommandWithTimeout(argv, { timeoutMs: params.timeoutMs });
		return {
			ok: res.code === 0,
			code: res.code,
			stdout: res.stdout,
			stderr: res.stderr,
			reason: res.code === 0 ? void 0 : "non-zero-exit"
		};
	} catch (err) {
		return {
			ok: false,
			code: null,
			reason: String(err)
		};
	}
}
function clearAutoState(nextState) {
	delete nextState.autoFirstSeenVersion;
	delete nextState.autoFirstSeenTag;
	delete nextState.autoFirstSeenAt;
}
async function resolveStartupInstallStatus() {
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	return {
		root,
		status: await checkUpdateStatus({
			root,
			timeoutMs: 2500,
			fetchGit: false,
			includeRegistry: false
		})
	};
}
async function runGatewayUpdateCheck(params) {
	if (shouldSkipCheck(Boolean(params.allowInTests))) return;
	if (params.isNixMode) return;
	const configuredChannel = normalizeUpdateChannel(params.cfg.update?.channel) ?? "stable";
	const auto = resolveAutoUpdatePolicy(params.cfg);
	const autoDisabledByEnv = isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE);
	const autoDisabledByExternalSupervisor = isGatewayExternallySupervised();
	const shouldRunAutoUpdate = (configuredChannel === "stable" || configuredChannel === "beta") && auto.enabled && !autoDisabledByEnv && !autoDisabledByExternalSupervisor;
	const shouldRunUpdateHints = params.cfg.update?.checkOnStart !== false;
	if (!shouldRunUpdateHints && !shouldRunAutoUpdate) {
		if (configuredChannel === "extended-stable") setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		return;
	}
	let installStatus;
	if (configuredChannel === "extended-stable") {
		installStatus = await resolveStartupInstallStatus();
		if (installStatus.status.installKind !== "package") {
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			return;
		}
	}
	const state = await readState();
	const rawNow = Date.now();
	const now = resolveUpdateCheckNowMs(rawNow);
	const rawNowIsValid = asDateTimestampMs(rawNow) !== void 0;
	const lastCheckedAt = state.lastCheckedAt ? Date.parse(state.lastCheckedAt) : null;
	const persistedAvailable = shouldRunUpdateHints ? resolvePersistedUpdateAvailable(state, configuredChannel) : null;
	const hasExtendedStableCheckMarker = state.lastAvailableTag?.trim() === "extended-stable";
	const shouldBypassSharedThrottle = configuredChannel === "extended-stable" && !hasExtendedStableCheckMarker;
	if (shouldRunUpdateHints) setUpdateAvailableCache({
		next: persistedAvailable,
		onUpdateAvailableChange: params.onUpdateAvailableChange
	});
	else setUpdateAvailableCache({
		next: null,
		onUpdateAvailableChange: params.onUpdateAvailableChange
	});
	const checkIntervalMs = shouldRunAutoUpdate ? resolveCheckIntervalMs(params.cfg) : UPDATE_CHECK_INTERVAL_MS;
	if (!shouldBypassSharedThrottle && rawNowIsValid && lastCheckedAt && Number.isFinite(lastCheckedAt)) {
		if (now - lastCheckedAt < checkIntervalMs) return;
	}
	installStatus ??= await resolveStartupInstallStatus();
	const { root, status } = installStatus;
	const nextState = {
		...state,
		lastCheckedAt: resolveUpdateCheckTimestamp(now)
	};
	if (status.installKind !== "package") {
		delete nextState.lastAvailableVersion;
		delete nextState.lastAvailableTag;
		clearAutoState(nextState);
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		await writeState(nextState);
		return;
	}
	const channel = configuredChannel;
	const resolved = await resolveNpmChannelTag({
		channel,
		timeoutMs: 2500
	});
	const tag = resolved.tag;
	if (!resolved.version) {
		if (channel === "extended-stable") {
			clearPersistedAvailabilityForChannel(nextState, channel);
			if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
		}
		await writeState(nextState);
		return;
	}
	const cmp = compareSemverStrings(VERSION, resolved.version);
	if (cmp != null && cmp < 0) {
		const nextAvailable = {
			currentVersion: VERSION,
			latestVersion: resolved.version,
			channel: tag
		};
		if (shouldRunUpdateHints) setUpdateAvailableCache({
			next: nextAvailable,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		nextState.lastAvailableVersion = resolved.version;
		nextState.lastAvailableTag = tag;
		const shouldNotify = state.lastNotifiedVersion !== resolved.version || state.lastNotifiedTag !== tag;
		if (shouldRunUpdateHints && shouldNotify) {
			params.log.info(`update available (${tag}): v${resolved.version} (current v${VERSION}). Run: ${formatCliCommand("openclaw update")}`);
			nextState.lastNotifiedVersion = resolved.version;
			nextState.lastNotifiedTag = tag;
		}
		if (channel !== "extended-stable" && auto.enabled && autoDisabledByEnv) params.log.info("auto-update disabled by OPENCLAW_NO_AUTO_UPDATE", {
			version: resolved.version,
			tag
		});
		if (channel !== "extended-stable" && auto.enabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: resolved.version,
			tag,
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		if (shouldRunAutoUpdate && (channel === "stable" || channel === "beta")) {
			const runAuto = params.runAutoUpdate ?? runAutoUpdateCommand;
			const attemptIntervalMs = channel === "beta" ? Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS)) : ONE_HOUR_MS;
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			const recentAttemptForSameVersion = state.autoLastAttemptVersion === resolved.version && lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < attemptIntervalMs;
			let dueNow = channel === "beta";
			let applyAfterMs = null;
			if (channel === "stable") {
				applyAfterMs = resolveStableAutoApplyAtMs({
					state,
					nextState,
					nowMs: now,
					version: resolved.version,
					tag,
					stableDelayHours: auto.stableDelayHours,
					stableJitterHours: auto.stableJitterHours
				});
				dueNow = now >= applyAfterMs;
			}
			if (!dueNow) params.log.info("auto-update deferred (stable rollout window active)", {
				version: resolved.version,
				tag,
				applyAfter: applyAfterMs ? resolveUpdateCheckTimestamp(applyAfterMs) : void 0
			});
			else if (recentAttemptForSameVersion) params.log.info("auto-update deferred (recent attempt exists)", {
				version: resolved.version,
				tag
			});
			else {
				nextState.autoLastAttemptVersion = resolved.version;
				nextState.autoLastAttemptAt = resolveUpdateCheckTimestamp(now);
				const outcome = await runAuto({
					channel,
					timeoutMs: AUTO_UPDATE_COMMAND_TIMEOUT_MS,
					restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
					root: root ?? status.root ?? void 0
				});
				if (outcome.ok && outcome.reason === "managed-service-handoff-started") params.log.info("auto-update handoff started", {
					channel,
					version: resolved.version,
					tag,
					...outcome.command ? { command: outcome.command } : {},
					...outcome.logPath ? { logPath: outcome.logPath } : {}
				});
				else if (outcome.ok) {
					nextState.autoLastSuccessVersion = resolved.version;
					nextState.autoLastSuccessAt = resolveUpdateCheckTimestamp(now);
					params.log.info("auto-update applied", {
						channel,
						version: resolved.version,
						tag
					});
				} else params.log.info("auto-update attempt failed", {
					channel,
					version: resolved.version,
					tag,
					reason: outcome.reason ?? `exit:${outcome.code}`
				});
			}
		}
	} else {
		if (channel === "extended-stable") {
			clearPersistedAvailabilityForChannel(nextState, channel);
			if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
		} else {
			delete nextState.lastAvailableVersion;
			delete nextState.lastAvailableTag;
			clearAutoState(nextState);
		}
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
	}
	await writeState(nextState);
}
function scheduleGatewayUpdateCheck(params) {
	if ((normalizeUpdateChannel(params.cfg.update?.channel) ?? "stable") === "extended-stable" && params.cfg.update?.checkOnStart === false) return () => {};
	let stopped = false;
	let timer = null;
	let running = false;
	const tick = async () => {
		if (stopped || running) return;
		running = true;
		try {
			await runGatewayUpdateCheck(params);
		} catch {} finally {
			running = false;
		}
		if (stopped) return;
		const intervalMs = resolveCheckIntervalMs(params.cfg);
		timer = setTimeout(() => {
			tick();
		}, intervalMs);
	};
	tick();
	return () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};
}
//#endregion
export { formatManagedServiceUpdateCommand as a, buildManagedServiceHandoffUnavailableMessage as i, runGatewayUpdateCheck as n, startManagedServiceUpdateHandoff as o, scheduleGatewayUpdateCheck as r, getUpdateAvailable as t };
