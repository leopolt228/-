import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { h as shortenHomePath } from "./utils-K2PjeLaV.js";
import { r as normalizeChatChannelId } from "./ids-retRJEzF.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { n as runExec } from "./exec-Cb0CNQNz.js";
import { a as loadCronQuarantineFile, s as resolveCronJobsStorePath } from "./store-CFkN1_TJ.js";
import { n as listReadOnlyChannelPluginsForConfig } from "./read-only-CTGMGkDz.js";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-DNk_xIW4.js";
import { t as note } from "./note-AoV1Tth-.js";
import { r as normalizeStoredCronJobs } from "./store-migration-9VgEllds.js";
import { c as formatUnresolvedShellPromptAdvisory, l as countStaleDreamingJobs, o as formatLegacyIssuePreview, r as loadLegacyCronRepairState, s as formatUnresolvedCommandPromptAdvisory, t as applyLegacyCronStoreRepair } from "./legacy-repair-xJaMajjZ.js";
//#region src/commands/doctor/cron/warnings.ts
const LEGACY_WHATSAPP_HEALTH_SCRIPT_RE = /(?:^|\s)(?:"[^"]*ensure-whatsapp\.sh"|'[^']*ensure-whatsapp\.sh'|[^\s#;|&]*ensure-whatsapp\.sh)\b/u;
const CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT = 3;
const CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT = 3;
const CRONTAB_READ_TIMEOUT_MS = 5e3;
function pluralize$1(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function normalizeModelProvider(value) {
	const raw = normalizeOptionalString(value);
	if (!raw) return;
	const slash = raw.indexOf("/");
	if (slash <= 0 || slash >= raw.length - 1) return;
	return raw.slice(0, slash).trim().toLowerCase() || void 0;
}
function normalizeModelRef(value) {
	const raw = normalizeOptionalString(value);
	if (!raw) return;
	const slash = raw.indexOf("/");
	if (slash <= 0 || slash >= raw.length - 1) return;
	const provider = raw.slice(0, slash).trim().toLowerCase();
	const model = raw.slice(slash + 1).trim();
	return provider && model ? `${provider}/${model}` : void 0;
}
function normalizeModelMismatchKey(value) {
	return normalizeModelRef(value) ?? normalizeOptionalString(value)?.toLowerCase();
}
function getRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function formatSortedCounts(counts) {
	return [...counts.entries()].toSorted(([left], [right]) => left.localeCompare(right)).map(([label, count]) => `${label}=${count}`).join(", ");
}
/** Emit a note when cron jobs pin models instead of inheriting the default model. */
function noteCronModelOverrides(params) {
	const defaultModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
	const defaultKey = normalizeModelMismatchKey(defaultModel);
	const providerCounts = /* @__PURE__ */ new Map();
	const mismatchExamples = [];
	let overrideCount = 0;
	let mismatchCount = 0;
	for (const rawJob of params.jobs) {
		const payload = getRecord(rawJob.payload);
		const kind = normalizeOptionalString(payload?.kind)?.toLowerCase();
		if (kind && kind !== "agentturn") continue;
		const model = normalizeOptionalString(payload?.model);
		if (!model) continue;
		overrideCount += 1;
		const provider = normalizeModelProvider(model) ?? "bare/alias";
		providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1);
		const modelKey = normalizeModelMismatchKey(model);
		if (defaultKey && modelKey && modelKey !== defaultKey) {
			mismatchCount += 1;
			if (mismatchExamples.length < CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT) {
				const id = normalizeOptionalString(rawJob.id) ?? normalizeOptionalString(rawJob.jobId);
				const name = normalizeOptionalString(rawJob.name);
				mismatchExamples.push(`${id ?? name ?? "<unnamed>"} -> ${model}`);
			}
		}
	}
	if (overrideCount === 0) return;
	const lines = [
		`Cron model overrides detected at ${shortenHomePath(params.storePath)}.`,
		`- ${pluralize$1(overrideCount, "job")} set \`payload.model\` and will not inherit \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`,
		`- Provider namespaces: ${formatSortedCounts(providerCounts)}`
	];
	if (mismatchCount > 0) {
		lines.push(`- ${pluralize$1(mismatchCount, "job")} ${mismatchCount === 1 ? "uses" : "use"} a different model than \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`);
		lines.push(`- Examples: ${mismatchExamples.join(", ")}`);
	}
	lines.push(`Review with ${formatCliCommand("openclaw cron list")} and ${formatCliCommand("openclaw cron show <job-id>")}; remove \`payload.model\` from jobs that should inherit the default.`);
	note(lines.join("\n"), "Cron");
}
/** Canonicalizes a channel id/alias for comparison, falling back to lowercase for external plugin ids. */
function canonicalChannelKey(value) {
	return normalizeChatChannelId(value) ?? value.trim().toLowerCase();
}
/** Collects the concrete announce channels cron jobs pin, skipping pseudo/relative targets. */
function listConcreteCronDeliveryTargets(jobs) {
	const targets = [];
	for (const job of jobs) {
		if (job.enabled === false) continue;
		if (!getRecord(job.delivery)) continue;
		const plan = resolveCronDeliveryPlan(job);
		if (plan.mode !== "announce" || !plan.channel || plan.channel === "last") continue;
		targets.push({
			channel: plan.channel,
			job
		});
	}
	return targets;
}
/**
* Builds an advisory when persisted cron jobs announce to a concrete channel whose plugin
* is not active in the current config, so their next scheduled run will fail-closed on
* delivery. Pseudo/relative targets (announce-to-`last`, webhook, `none`) are skipped because
* they resolve at run time. Observer-only: it never repairs jobs or writes config. The channel
* list is resolved lazily so doctor skips the read-only channel snapshot when no job can drift.
* Returns `null` when no job pins a concrete target or every concrete target is active.
*/
function collectCronDeliveryTargetAdvisory(params) {
	const concreteTargets = listConcreteCronDeliveryTargets(params.jobs);
	if (concreteTargets.length === 0) return null;
	const availableKeys = /* @__PURE__ */ new Set();
	for (const id of params.resolveAvailableChannelIds()) {
		const normalized = normalizeOptionalString(id);
		if (normalized) availableKeys.add(canonicalChannelKey(normalized));
	}
	const channelCounts = /* @__PURE__ */ new Map();
	const examples = [];
	let unavailableCount = 0;
	for (const { channel, job } of concreteTargets) {
		if (availableKeys.has(canonicalChannelKey(channel))) continue;
		unavailableCount += 1;
		channelCounts.set(channel, (channelCounts.get(channel) ?? 0) + 1);
		if (examples.length < CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT) {
			const id = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
			const name = normalizeOptionalString(job.name);
			examples.push(`${id ?? name ?? "<unnamed>"} -> ${channel}`);
		}
	}
	if (unavailableCount === 0) return null;
	return [
		`Cron delivery targets unavailable channels at ${shortenHomePath(params.storePath)}.`,
		`- ${pluralize$1(unavailableCount, "job")} ${unavailableCount === 1 ? "announces" : "announce"} to a channel whose plugin is not active; the next scheduled run will fail to deliver`,
		`- Channels: ${formatSortedCounts(channelCounts)}`,
		`- Examples: ${examples.join(", ")}`,
		`Reactivate the channel plugin or update the job's \`delivery.channel\` after reviewing with ${formatCliCommand("openclaw cron list")} and ${formatCliCommand("openclaw cron show <job-id>")}.`
	].join("\n");
}
/** Emit a note when cron jobs announce to a concrete channel whose plugin is not active. */
function noteCronDeliveryTargetAdvisory(params) {
	let advisory;
	try {
		advisory = collectCronDeliveryTargetAdvisory({
			jobs: params.jobs,
			storePath: params.storePath,
			resolveAvailableChannelIds: () => listReadOnlyChannelPluginsForConfig(params.cfg, {
				includePersistedAuthState: false,
				includeSetupFallbackPlugins: true
			}).map((plugin) => plugin.id)
		});
	} catch {
		return;
	}
	if (advisory) note(advisory, "Cron");
}
async function readUserCrontab() {
	const result = await runExec("crontab", ["-l"], {
		logOutput: false,
		timeoutMs: CRONTAB_READ_TIMEOUT_MS
	});
	return {
		stdout: result.stdout,
		stderr: result.stderr
	};
}
function coerceCrontabText(crontab) {
	if (typeof crontab === "string") return crontab;
	if (crontab == null) return "";
	if (typeof crontab === "number" || typeof crontab === "boolean" || typeof crontab === "bigint") return String(crontab);
	return "";
}
function findLegacyWhatsAppHealthCrontabLines(crontab) {
	return coerceCrontabText(crontab).split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#")).filter((line) => LEGACY_WHATSAPP_HEALTH_SCRIPT_RE.test(line));
}
/** Return a warning when the user's crontab still runs the old WhatsApp health script. */
async function collectLegacyWhatsAppCrontabHealthWarning(params = {}) {
	if ((params.platform ?? process.platform) !== "linux") return null;
	let crontab;
	try {
		crontab = (await (params.readCrontab ?? readUserCrontab)()).stdout;
	} catch {
		return null;
	}
	const legacyLines = findLegacyWhatsAppHealthCrontabLines(crontab);
	if (legacyLines.length === 0) return null;
	return [
		"Legacy WhatsApp crontab health check detected.",
		"`~/.openclaw/bin/ensure-whatsapp.sh` is not maintained by current OpenClaw and can misreport `Gateway inactive` from cron when the systemd user bus environment is missing.",
		`Remove the stale crontab entry with ${formatCliCommand("crontab -e")}; use ${formatCliCommand("openclaw channels status --probe")}, ${formatCliCommand("openclaw doctor")}, and ${formatCliCommand("openclaw gateway status")} for current health checks.`,
		`Matched ${pluralize$1(legacyLines.length, "entry")}.`
	].join("\n");
}
/** Emit the legacy WhatsApp crontab warning when present. */
async function noteLegacyWhatsAppCrontabHealthCheck(params = {}) {
	const warning = await collectLegacyWhatsAppCrontabHealthWarning(params);
	if (warning) note(warning, "Cron");
}
//#endregion
//#region src/commands/doctor/cron/index.ts
function pluralize(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function errorMessage(err) {
	return err instanceof Error ? err.message : String(err);
}
function countInFlightCronJobs(jobs) {
	return jobs.filter((job) => {
		const state = job.state;
		return typeof state === "object" && state !== null && typeof state.runningAtMs === "number";
	}).length;
}
const CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS = 3;
function countChronicallyFailingCronJobs(jobs) {
	return jobs.filter((job) => {
		if (job.enabled === false) return false;
		const state = job.state;
		if (typeof state !== "object" || state === null) return false;
		const consecutiveErrors = state.consecutiveErrors;
		return typeof consecutiveErrors === "number" && consecutiveErrors >= CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS;
	}).length;
}
const LEGACY_CRON_STORE_CHECK_ID = "core/doctor/legacy-cron-store";
function legacyCronStoreFinding(params) {
	return {
		checkId: LEGACY_CRON_STORE_CHECK_ID,
		severity: "warning",
		message: params.message,
		path: params.path,
		requirement: params.requirement,
		fixHint: params.fixHint ?? `Run ${formatCliCommand("openclaw doctor --fix")} to normalize legacy cron storage.`
	};
}
async function collectLegacyCronStoreHealthFindings(params) {
	let state;
	try {
		state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			readOnly: true
		});
	} catch (err) {
		const storePath = resolveCronJobsStorePath(params.cfg.cron?.store);
		return [legacyCronStoreFinding({
			message: `Unable to read cron job store at ${shortenHomePath(storePath)}.`,
			path: storePath,
			requirement: "cron-store-readable",
			fixHint: [
				`Fix the file's permissions or contents and re-run ${formatCliCommand("openclaw doctor")}.`,
				"Later health checks will continue.",
				`Details: ${errorMessage(err)}`
			].join(" ")
		})];
	}
	if (!state) return [];
	const findings = [];
	const { storePath, quarantinePath, legacyStoreDetected, legacyRunLogDetected, legacyImportCount, sqliteProjectionBackfillCount, rawJobs } = state;
	try {
		const quarantine = await loadCronQuarantineFile(quarantinePath);
		if (quarantine.jobs.length > 0) findings.push(legacyCronStoreFinding({
			message: `${pluralize(quarantine.jobs.length, "quarantined cron job row")} found at ${shortenHomePath(quarantinePath)}.`,
			path: quarantinePath,
			requirement: "quarantined-cron-rows",
			fixHint: `Review or repair the quarantined rows manually before copying any job back into ${shortenHomePath(storePath)}.`
		}));
	} catch (err) {
		findings.push(legacyCronStoreFinding({
			message: `Unable to read quarantined cron rows at ${shortenHomePath(quarantinePath)}.`,
			path: quarantinePath,
			requirement: "cron-quarantine-readable",
			fixHint: `Fix the quarantine file's permissions or contents. Details: ${errorMessage(err)}`
		}));
	}
	if (legacyStoreDetected) findings.push(legacyCronStoreFinding({
		message: legacyImportCount > 0 ? `${pluralize(legacyImportCount, "legacy JSON cron job")} will be imported into SQLite.` : `Legacy JSON cron store was found at ${shortenHomePath(storePath)}.`,
		path: storePath,
		requirement: "legacy-cron-store"
	}));
	if (legacyRunLogDetected) findings.push(legacyCronStoreFinding({
		message: `Legacy JSON cron run logs will be imported into SQLite for ${shortenHomePath(storePath)}.`,
		path: storePath,
		requirement: "legacy-cron-run-logs"
	}));
	if (rawJobs.length === 0) return findings;
	const normalized = normalizeStoredCronJobs(rawJobs);
	for (const line of formatLegacyIssuePreview(normalized.issues)) findings.push(legacyCronStoreFinding({
		message: line.replace(/^- /u, ""),
		path: storePath,
		requirement: "legacy-cron-store-shape"
	}));
	if (sqliteProjectionBackfillCount > 0) findings.push(legacyCronStoreFinding({
		message: `${pluralize(sqliteProjectionBackfillCount, "SQLite cron row")} will be backfilled from stored config JSON into split columns.`,
		path: storePath,
		requirement: "sqlite-projection-backfill"
	}));
	const notifyCount = rawJobs.filter((job) => job.notify === true).length;
	if (notifyCount > 0) findings.push(legacyCronStoreFinding({
		message: `${pluralize(notifyCount, "job")} still uses legacy notify webhook fallback.`,
		path: storePath,
		requirement: "legacy-notify-fallback"
	}));
	const dreamingStaleCount = countStaleDreamingJobs(rawJobs);
	if (dreamingStaleCount > 0) findings.push(legacyCronStoreFinding({
		message: `${pluralize(dreamingStaleCount, "managed dreaming job")} still has the legacy heartbeat-coupled shape.`,
		path: storePath,
		requirement: "legacy-dreaming-payload"
	}));
	return findings;
}
function noteLegacyCronRepairResult(result) {
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
/** Inspect cron storage and optionally repair legacy JSON/SQLite/payload shapes. */
async function maybeRepairLegacyCronStore(params) {
	let state;
	try {
		state = await loadLegacyCronRepairState({ cfg: params.cfg });
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		note([
			`Unable to read cron job store at ${shortenHomePath(resolveCronJobsStorePath(params.cfg.cron?.store))}.`,
			`- ${reason}`,
			`Fix the file's permissions or contents and re-run ${formatCliCommand("openclaw doctor")}; later health checks will continue.`
		].join("\n"), "Cron");
		return;
	}
	if (!state) return;
	const { storePath, quarantinePath, legacyStoreDetected, legacyRunLogDetected, legacyImportCount, sqliteProjectionBackfillCount, rawJobs } = state;
	try {
		const quarantine = await loadCronQuarantineFile(quarantinePath);
		if (quarantine.jobs.length > 0) note([
			`Quarantined cron job rows found at ${shortenHomePath(quarantinePath)}.`,
			`- ${pluralize(quarantine.jobs.length, "row")} was removed from the active cron store after runtime validation failed.`,
			`- Review or repair the quarantined rows manually before copying any job back into ${shortenHomePath(storePath)}.`
		].join("\n"), "Cron");
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		note([`Unable to read quarantined cron rows at ${shortenHomePath(quarantinePath)}.`, `- ${reason}`].join("\n"), "Cron");
	}
	if (rawJobs.length === 0) {
		if (!legacyStoreDetected && !legacyRunLogDetected) return;
		const previewLines = [];
		if (legacyStoreDetected) previewLines.push("- legacy JSON cron store will be archived after SQLite migration");
		if (legacyRunLogDetected) previewLines.push("- legacy JSON cron run logs will be imported into SQLite");
		note([
			`Legacy cron storage detected at ${shortenHomePath(storePath)}.`,
			...previewLines,
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to finish the migration.`
		].join("\n"), "Cron");
		if (!await params.prompter.confirm({
			message: "Repair legacy cron jobs now?",
			initialValue: true
		})) return;
		noteLegacyCronRepairResult(await applyLegacyCronStoreRepair({
			cfg: params.cfg,
			state
		}));
		return;
	}
	noteCronModelOverrides({
		cfg: params.cfg,
		jobs: rawJobs,
		storePath
	});
	noteCronDeliveryTargetAdvisory({
		cfg: params.cfg,
		jobs: rawJobs,
		storePath
	});
	const inFlightCount = countInFlightCronJobs(rawJobs);
	if (inFlightCount > 0) {
		const subject = inFlightCount === 1 ? "it" : "them";
		note([
			`${pluralize(inFlightCount, "cron job")} ${inFlightCount === 1 ? "is" : "are"} still marked in-flight (\`state.runningAtMs\` is set), so ${formatCliCommand("openclaw cron list")} shows ${subject} as \`running\`.`,
			`- If no gateway is currently executing ${subject}, the marker is left over from an interrupted run; the gateway marks such runs interrupted the next time it starts.`,
			`- Review with ${formatCliCommand("openclaw cron list")} or ${formatCliCommand("openclaw cron show <id>")}.`
		].join("\n"), "Cron");
	}
	const chronicFailureCount = countChronicallyFailingCronJobs(rawJobs);
	if (chronicFailureCount > 0) note([
		`${pluralize(chronicFailureCount, "cron job")} ${chronicFailureCount === 1 ? "has" : "have"} failed ${CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS}+ runs in a row (\`state.consecutiveErrors\`), so the scheduler only re-fires ${chronicFailureCount === 1 ? "it" : "them"} on error backoff.`,
		`- The count resets on the next successful run and also counts runs interrupted by a gateway restart, so a lasting streak means repeated task failures, repeatedly interrupted runs, or a mix. Failure alerts are opt-in, so this may be the only notice.`,
		`- Review with ${formatCliCommand("openclaw cron list")} or ${formatCliCommand("openclaw cron show <id>")}.`
	].join("\n"), "Cron");
	const normalized = normalizeStoredCronJobs(rawJobs);
	const notifyCount = rawJobs.filter((job) => job.notify === true).length;
	const dreamingStaleCount = countStaleDreamingJobs(rawJobs);
	const commandPromptAdvisory = formatUnresolvedCommandPromptAdvisory(normalized.unresolvedAgentTurnCommandPromptJobs);
	if (commandPromptAdvisory) note(commandPromptAdvisory, "Cron");
	const shellPromptAdvisory = formatUnresolvedShellPromptAdvisory(normalized.unresolvedAgentTurnShellToolPromptJobs);
	if (shellPromptAdvisory) note(shellPromptAdvisory, "Cron");
	const previewLines = formatLegacyIssuePreview(normalized.issues);
	if (legacyStoreDetected) previewLines.unshift(legacyImportCount > 0 ? `- ${pluralize(legacyImportCount, "legacy JSON cron job")} will be imported into SQLite` : "- legacy JSON cron store will be archived after SQLite migration");
	if (legacyRunLogDetected) previewLines.push("- legacy JSON cron run logs will be imported into SQLite");
	if (sqliteProjectionBackfillCount > 0) previewLines.push(`- ${pluralize(sqliteProjectionBackfillCount, "SQLite cron row")} will be backfilled from stored config JSON into split columns`);
	if (notifyCount > 0) previewLines.push(`- ${pluralize(notifyCount, "job")} still uses legacy \`notify: true\` webhook fallback`);
	if (dreamingStaleCount > 0) previewLines.push(`- ${pluralize(dreamingStaleCount, "managed dreaming job")} still has the legacy heartbeat-coupled shape`);
	if (previewLines.length === 0 && !legacyStoreDetected) return;
	note([
		legacyStoreDetected ? `Legacy cron job storage detected at ${shortenHomePath(storePath)}.` : `Cron store issues detected at ${shortenHomePath(storePath)}.`,
		...previewLines,
		`Repair with ${formatCliCommand("openclaw doctor --fix")} to normalize the store before the next scheduler run.`
	].join("\n"), "Cron");
	if (!await params.prompter.confirm({
		message: "Repair legacy cron jobs now?",
		initialValue: true
	})) return;
	noteLegacyCronRepairResult(await applyLegacyCronStoreRepair({
		cfg: params.cfg,
		state,
		normalized
	}));
}
//#endregion
export { collectLegacyCronStoreHealthFindings, collectLegacyWhatsAppCrontabHealthWarning, maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck };
