import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { P as timestampMsToIsoString } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-K2PjeLaV.js";
import { _ as resolveSessionAgentId } from "./agent-scope-CrBA-6Gx.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { E as parseAgentSessionKey } from "./session-key-Drrs61Fd.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { t as isStringOption } from "./string-readers-A0wspDGq.js";
import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import "./client-DpNJQtBd.js";
import { n as GatewayClientRequestError } from "./client-U9ekE9wL.js";
import { x as recordCronNextCheckProposal } from "./agent-events-Dg0sI2pr.js";
import { _ as readStringParam, d as readNonNegativeIntegerParam } from "./common-C39GdgQ7.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { p as extractTextFromChatContent } from "./sanitize-user-facing-text-sWgeyF-a.js";
import { c as CRON_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-Bi5DGU0C.js";
import { f as expandToolGroups, m as normalizeToolName, o as expandPolicyWithPluginGroups, r as buildPluginToolGroups } from "./tool-policy-GYMCyycR.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-gf5E9Psx.js";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-CfE4TIm1.js";
import { t as parseCronPacingBounds } from "./pacing-DJkK49TC.js";
import { n as readGatewayCallOptions, o as withGatewayToolCallerIdentity, t as callGatewayTool, u as setToolTerminalPresentation } from "./gateway-wQ1RjFk5.js";
import { a as optionalPositiveIntegerSchema, i as optionalNonNegativeIntegerSchema, o as optionalStringEnum, r as optionalFiniteNumberSchema, s as stringEnum } from "./typebox-BEFPvxS2.js";
import { c as resolveMainSessionAlias, s as resolveInternalSessionKey } from "./sessions-helpers-DVMRiynf.js";
import { t as resolveCronCreationDelivery } from "./delivery-context-3tiYyUnG.js";
import { t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-D5dmr1ev.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BOvGxtq0.js";
import { Type } from "typebox";
//#region src/agents/tools/gateway-schema.ts
/**
* Shared Gateway tool schema fragments.
*
* Keeps gateway URL/token/timeout parameters aligned across tools that call Gateway methods.
*/
/** Returns optional gateway URL/token/timeout schema properties for tool params. */
function gatewayCallOptionSchemaProperties() {
	return {
		gatewayUrl: Type.Optional(Type.String()),
		gatewayToken: Type.Optional(Type.String()),
		timeoutMs: optionalPositiveIntegerSchema()
	};
}
//#endregion
//#region src/agents/tools/cron-tool-canonicalize.ts
/**
* Cron tool argument canonicalization.
*
* Recovers flat or partial model/tool inputs into the structured cron job/patch shape.
*/
const CRON_SCHEDULE_KINDS$1 = [
	"at",
	"every",
	"cron",
	"on-exit"
];
const CRON_FLAT_PAYLOAD_KEYS = [
	"message",
	"text",
	"script",
	"model",
	"fallbacks",
	"toolsAllow",
	"thinking",
	"timeoutSeconds",
	"toolBudget",
	"lightContext",
	"allowUnsafeExternalContent"
];
const CRON_FLAT_SCHEDULE_KEYS = [
	"kind",
	"at",
	"atMs",
	"every",
	"everyMs",
	"anchorMs",
	"cron",
	"expr",
	"tz",
	"stagger",
	"staggerMs",
	"exact",
	"command",
	"cwd"
];
const CRON_RECOVERABLE_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"name",
	"declarationKey",
	"displayName",
	"owner",
	"schedule",
	"pacing",
	"trigger",
	"sessionTarget",
	"wakeMode",
	"payload",
	"delivery",
	"enabled",
	"description",
	"deleteAfterRun",
	"agentId",
	"sessionKey",
	"failureAlert",
	"namePayload",
	"scheduleKind",
	"sessionTargetName",
	...CRON_FLAT_PAYLOAD_KEYS,
	...CRON_FLAT_SCHEDULE_KEYS
]);
function isCronScheduleKind(value) {
	return isStringOption(value, CRON_SCHEDULE_KINDS$1);
}
function isCronPayloadKind(value) {
	return value === "systemEvent" || value === "agentTurn" || value === "script";
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function isStringArrayOrNull(value) {
	return value === null || Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function moveDefinedField(params) {
	if (params.source[params.from] === void 0) return false;
	params.target[params.to ?? params.from] = params.source[params.from];
	delete params.source[params.from];
	return true;
}
function repairConcatenatedCronToolKeys(value) {
	if (!isRecord(value.payload) && isRecord(value.namePayload)) value.payload = { ...value.namePayload };
	const rawScheduleKind = value.scheduleKind;
	if (!isRecord(value.schedule)) {
		if (isRecord(rawScheduleKind)) value.schedule = { ...rawScheduleKind };
		else if (isCronScheduleKind(rawScheduleKind)) value.schedule = { kind: rawScheduleKind };
	} else if (isCronScheduleKind(rawScheduleKind) && !isCronScheduleKind(value.schedule.kind)) value.schedule = {
		...value.schedule,
		kind: rawScheduleKind
	};
	if (!isNonEmptyString(value.name) && isNonEmptyString(value.sessionTargetName)) value.name = value.sessionTargetName;
	delete value.namePayload;
	delete value.scheduleKind;
	delete value.sessionTargetName;
}
function setScheduleAtMs(schedule, value) {
	const atMs = typeof value === "number" ? value : Number(value);
	schedule.at = Number.isFinite(atMs) ? timestampMsToIsoString(Math.floor(atMs)) ?? value : value;
}
function canonicalizeCronToolSchedule(value) {
	const schedule = isRecord(value.schedule) ? { ...value.schedule } : {};
	let hasSchedule = isRecord(value.schedule);
	if (schedule.atMs !== void 0) {
		setScheduleAtMs(schedule, schedule.atMs);
		delete schedule.atMs;
		if (!isCronScheduleKind(schedule.kind)) schedule.kind = "at";
	}
	if (schedule.everyMs === void 0 && schedule.every !== void 0) {
		schedule.everyMs = schedule.every;
		delete schedule.every;
	}
	if (schedule.expr === void 0 && schedule.cron !== void 0) {
		schedule.expr = schedule.cron;
		delete schedule.cron;
	}
	if (schedule.staggerMs === void 0 && schedule.stagger !== void 0) {
		schedule.staggerMs = schedule.stagger;
		delete schedule.stagger;
	}
	if (schedule.exact === true && schedule.staggerMs === void 0) schedule.staggerMs = 0;
	delete schedule.exact;
	if (isCronScheduleKind(value.kind) && !isCronScheduleKind(schedule.kind)) {
		schedule.kind = value.kind;
		delete value.kind;
		hasSchedule = true;
	}
	if (moveDefinedField({
		source: value,
		target: schedule,
		from: "at"
	}) && !isCronScheduleKind(schedule.kind)) schedule.kind = "at";
	if (value.atMs !== void 0) {
		setScheduleAtMs(schedule, value.atMs);
		delete value.atMs;
		if (!isCronScheduleKind(schedule.kind)) schedule.kind = "at";
		hasSchedule = true;
	}
	if ((moveDefinedField({
		source: value,
		target: schedule,
		from: "everyMs"
	}) || moveDefinedField({
		source: value,
		target: schedule,
		from: "every",
		to: "everyMs"
	})) && !isCronScheduleKind(schedule.kind)) schedule.kind = "every";
	if ((moveDefinedField({
		source: value,
		target: schedule,
		from: "cron",
		to: "expr"
	}) || moveDefinedField({
		source: value,
		target: schedule,
		from: "expr"
	})) && !isCronScheduleKind(schedule.kind)) schedule.kind = "cron";
	if (moveDefinedField({
		source: value,
		target: schedule,
		from: "command"
	}) && !isCronScheduleKind(schedule.kind)) schedule.kind = "on-exit";
	for (const key of [
		"anchorMs",
		"tz",
		"staggerMs",
		"cwd"
	]) hasSchedule = moveDefinedField({
		source: value,
		target: schedule,
		from: key
	}) || hasSchedule;
	hasSchedule = moveDefinedField({
		source: value,
		target: schedule,
		from: "stagger",
		to: "staggerMs"
	}) || hasSchedule;
	if (value.exact === true && schedule.staggerMs === void 0) {
		schedule.staggerMs = 0;
		hasSchedule = true;
	}
	delete value.exact;
	if (!isCronScheduleKind(schedule.kind)) {
		if (schedule.at !== void 0) schedule.kind = "at";
		else if (schedule.everyMs !== void 0) schedule.kind = "every";
		else if (schedule.expr !== void 0) schedule.kind = "cron";
		else if (schedule.command !== void 0) schedule.kind = "on-exit";
	}
	if (hasSchedule || Object.keys(schedule).length > 0) value.schedule = schedule;
}
function canonicalizeCronToolPayload(value) {
	const payload = isRecord(value.payload) ? { ...value.payload } : {};
	let hasPayload = isRecord(value.payload);
	for (const key of CRON_FLAT_PAYLOAD_KEYS) hasPayload = moveDefinedField({
		source: value,
		target: payload,
		from: key
	}) || hasPayload;
	if (isCronPayloadKind(value.kind) && !isCronPayloadKind(payload.kind)) {
		payload.kind = value.kind;
		delete value.kind;
		hasPayload = true;
	}
	if (!isCronPayloadKind(payload.kind)) {
		if (isNonEmptyString(payload.script)) payload.kind = "script";
		else if (isNonEmptyString(payload.message) || isNonEmptyString(payload.model) || payload.model === null || isNonEmptyString(payload.thinking) || typeof payload.timeoutSeconds === "number" || typeof payload.lightContext === "boolean" || typeof payload.allowUnsafeExternalContent === "boolean" || payload.fallbacks !== void 0 && isStringArrayOrNull(payload.fallbacks)) payload.kind = "agentTurn";
		else if (isNonEmptyString(payload.text)) payload.kind = "systemEvent";
	}
	if (hasPayload || Object.keys(payload).length > 0) value.payload = payload;
}
/**
* Normalizes whitespace-padded cron object keys. Some tool-call
* extraction/serialization pipelines can produce keys with trailing spaces
* (e.g. "schedule " instead of "schedule"), which causes strict gateway
* validation to reject the job with "unexpected property" errors.
*
* Only recognized CRON_RECOVERABLE_OBJECT_KEYS are trimmed — arbitrary keys
* (including special ones like "__proto__") are never mutated.
*
* If both the padded and canonical form of a key exist (e.g. "schedule " and
* "schedule"), the padded key is preserved so strict gateway validation
* rejects the ambiguous input rather than silently picking one value.
*/
function repairPaddedCronKeys(value) {
	for (const key of Object.keys(value)) {
		const trimmed = key.trim();
		if (trimmed !== key && CRON_RECOVERABLE_OBJECT_KEYS.has(trimmed)) {
			if (!(trimmed in value)) {
				value[trimmed] = value[key];
				delete value[key];
			}
		}
	}
}
/** Converts model-friendly cron tool shorthands into the nested gateway job/patch shape. */
function canonicalizeCronToolObject(value) {
	const next = { ...isRecord(value.data) ? value.data : isRecord(value.job) ? value.job : value };
	repairPaddedCronKeys(next);
	repairConcatenatedCronToolKeys(next);
	canonicalizeCronToolSchedule(next);
	canonicalizeCronToolPayload(next);
	return next;
}
/** Detects recovered update patches that contain no meaningful cron fields after normalization. */
function isEmptyRecoveredCronPatch(value) {
	if (!isRecord(value)) return true;
	const keys = Object.keys(value);
	return keys.length === 0 || keys.length === 1 && keys[0] === "payload" && isRecord(value.payload) && Object.keys(value.payload).length === 0;
}
/** Recovers cron job or patch fields that a model flattened beside the action arguments. */
function recoverCronObjectFromFlatParams(params) {
	const value = {};
	let found = false;
	for (const key of Object.keys(params)) if (CRON_RECOVERABLE_OBJECT_KEYS.has(key) && params[key] !== void 0) {
		value[key] = params[key];
		found = true;
	}
	return {
		found,
		value: canonicalizeCronToolObject(value)
	};
}
/** Checks whether a recovered flat object has enough schedule/payload signal to create a job. */
function hasCronCreateSignal(value) {
	return value.schedule !== void 0 || value.at !== void 0 || value.atMs !== void 0 || value.everyMs !== void 0 || value.cron !== void 0 || value.expr !== void 0 || value.payload !== void 0 || value.message !== void 0 || value.text !== void 0;
}
//#endregion
//#region src/agents/tools/cron-tool-creator-cap.ts
function normalizeCronToolsAllow(values) {
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of expandToolGroups([...values])) {
		const toolName = normalizeToolName(entry);
		if (!toolName || seen.has(toolName)) continue;
		seen.add(toolName);
		normalized.push(toolName);
	}
	return normalized;
}
function normalizeCronCreatorToolsAllow(values) {
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of values) {
		const name = normalizeToolName(typeof entry === "string" ? entry : entry.name);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		const pluginId = typeof entry === "string" || typeof entry.pluginId !== "string" ? void 0 : normalizeToolName(entry.pluginId);
		normalized.push(pluginId ? {
			name,
			pluginId
		} : { name });
	}
	return normalized;
}
function hasCronTriggerScript(value) {
	return isRecord(value) && typeof value.script === "string" && value.script.trim().length > 0;
}
function capCronJobToolsAllow(params) {
	const writesToolsAllow = Object.hasOwn(params.payload, "toolsAllow");
	if (params.payload.kind !== "agentTurn" && params.payload.kind !== "script" && !hasCronTriggerScript(params.trigger) && !writesToolsAllow) return;
	const creatorToolsAllow = normalizeCronCreatorToolsAllow(params.creatorToolAllowlist);
	const creatorToolNames = creatorToolsAllow.map((tool) => tool.name);
	const requestedRaw = Object.hasOwn(params.payload, "toolsAllow") ? params.payload.toolsAllow : params.defaultToolsAllow;
	if (!Array.isArray(requestedRaw)) {
		params.payload.toolsAllow = creatorToolNames;
		params.payload.toolsAllowIsDefault = true;
		return;
	}
	const requestedToolsAllow = normalizeCronToolsAllow(requestedRaw.filter((entry) => typeof entry === "string"));
	if (requestedToolsAllow.length === 0) {
		params.payload.toolsAllow = [];
		delete params.payload.toolsAllowIsDefault;
		return;
	}
	if (requestedToolsAllow.includes("*")) {
		params.payload.toolsAllow = creatorToolNames;
		params.payload.toolsAllowIsDefault = true;
		return;
	}
	const pluginGroups = buildPluginToolGroups({
		tools: creatorToolsAllow,
		toolMeta: (tool) => tool.pluginId ? { pluginId: tool.pluginId } : void 0
	});
	const requestedPolicy = expandPolicyWithPluginGroups({ allow: requestedToolsAllow }, pluginGroups);
	params.payload.toolsAllow = creatorToolNames.filter((toolName) => isToolAllowedByPolicyName(toolName, requestedPolicy));
	delete params.payload.toolsAllowIsDefault;
}
function capCronJobToolsAllowOnCreate(value, creatorToolAllowlist) {
	if (!creatorToolAllowlist || !isRecord(value) || !isRecord(value.payload)) return;
	capCronJobToolsAllow({
		payload: value.payload,
		trigger: value.trigger,
		creatorToolAllowlist
	});
}
function readCronPayloadKind(value) {
	return isRecord(value) && typeof value.kind === "string" ? value.kind : void 0;
}
/** Purely derives the agent-tool patch; current job state is requested only when required. */
function planCronJobUpdatePatch(params) {
	const patch = structuredClone(params.patch);
	const payload = isRecord(patch.payload) ? patch.payload : void 0;
	const explicitPayloadKind = readCronPayloadKind(payload);
	if (params.creatorToolAllowlist && explicitPayloadKind !== void 0 && payload && Object.hasOwn(payload, "toolsAllow")) {
		capCronJobToolsAllow({
			payload,
			trigger: patch.trigger,
			creatorToolAllowlist: params.creatorToolAllowlist
		});
		return {
			kind: "ready",
			patch
		};
	}
	if (!(payload !== void 0 && explicitPayloadKind === void 0) && !params.creatorToolAllowlist) return {
		kind: "ready",
		patch
	};
	if (!params.currentJob) return { kind: "needs-current-job" };
	const existingPayload = params.currentJob.payload;
	const payloadKind = explicitPayloadKind ?? readCronPayloadKind(existingPayload);
	if (payload && payloadKind !== void 0) {
		payload.kind = payloadKind;
		patch.payload = payload;
	}
	if (!params.creatorToolAllowlist) return {
		kind: "ready",
		patch
	};
	const trigger = Object.hasOwn(patch, "trigger") ? patch.trigger : params.currentJob.trigger;
	const writesToolsAllow = payload !== void 0 && Object.hasOwn(payload, "toolsAllow");
	if (payloadKind !== "agentTurn" && payloadKind !== "script" && !hasCronTriggerScript(trigger) && !writesToolsAllow) return {
		kind: "ready",
		patch
	};
	const nextPayload = payload ?? {};
	if (payloadKind !== void 0) nextPayload.kind = payloadKind;
	patch.payload = nextPayload;
	capCronJobToolsAllow({
		payload: nextPayload,
		trigger,
		creatorToolAllowlist: params.creatorToolAllowlist,
		defaultToolsAllow: isRecord(existingPayload) && existingPayload.toolsAllowIsDefault !== true ? existingPayload.toolsAllow : void 0
	});
	return {
		kind: "ready",
		patch
	};
}
//#endregion
//#region src/agents/tools/cron-tool-write.ts
function assertNoCronShellExecution(value) {
	if (!isRecord(value)) return;
	if (normalizeLowercaseStringOrEmpty((isRecord(value.payload) ? value.payload : void 0)?.kind) === "command") throw new Error("cron command payloads cannot be created or edited through the agent cron tool; use the CLI or Gateway API.");
	if ((isRecord(value.schedule) ? value.schedule : void 0)?.kind === "on-exit") throw new Error("cron on-exit schedules cannot be created or edited through the agent cron tool; use the CLI or Gateway API.");
}
async function prepareCronJobUpdateForGateway(params) {
	const initialPlan = planCronJobUpdatePatch({
		patch: params.patch,
		creatorToolAllowlist: params.creatorToolAllowlist
	});
	if (initialPlan.kind === "ready") return { patch: initialPlan.patch };
	const existing = await params.callGateway("cron.get", params.gatewayOpts, { id: params.id });
	const existingRecord = isRecord(existing) ? existing : void 0;
	const expectedConfigRevision = existingRecord?.configRevision;
	if (typeof expectedConfigRevision !== "string" || expectedConfigRevision.length === 0) throw new Error("cron.get response is missing configRevision; restart the Gateway before retrying this update");
	const finalPlan = planCronJobUpdatePatch({
		patch: params.patch,
		creatorToolAllowlist: params.creatorToolAllowlist,
		currentJob: existingRecord
	});
	if (finalPlan.kind !== "ready") throw new Error("cron update patch planning did not use the loaded job");
	return {
		patch: finalPlan.patch,
		expectedConfigRevision
	};
}
function isCronJobConfigRevisionConflict(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	return (isRecord(error.details) ? error.details : void 0)?.code === "CRON_JOB_CHANGED";
}
async function updateCronJobFromAgentTool(params) {
	const callerIncludedPayloadPatch = isRecord(params.patch.payload);
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const prepared = await prepareCronJobUpdateForGateway(params);
		if (callerIncludedPayloadPatch) assertNoCronShellExecution(prepared.patch);
		try {
			return await params.callGateway("cron.update", params.gatewayOpts, {
				id: params.id,
				patch: prepared.patch,
				...prepared.expectedConfigRevision ? { expectedConfigRevision: prepared.expectedConfigRevision } : {}
			});
		} catch (error) {
			if (attempt === 0 && isCronJobConfigRevisionConflict(error)) continue;
			throw error;
		}
	}
	throw new Error("cron update retry exhausted");
}
//#endregion
//#region src/agents/tools/cron-tool.ts
/**
* cron built-in tool.
*
* Manages scheduled jobs, wake/run actions, delivery context, and reminder-style payload normalization.
*/
const CRON_ACTIONS = [
	"status",
	"list",
	"get",
	"add",
	"update",
	"remove",
	"run",
	"runs",
	"next_check",
	"wake"
];
const CRON_SCHEDULE_KINDS = [
	"at",
	"every",
	"cron"
];
const CRON_WAKE_MODES = ["now", "next-heartbeat"];
const CRON_PAYLOAD_KINDS = [
	"systemEvent",
	"agentTurn",
	"script"
];
const CRON_DELIVERY_MODES = [
	"none",
	"announce",
	"webhook"
];
const CRON_RUN_MODES = ["due", "force"];
const REMINDER_CONTEXT_MESSAGES_MAX = 10;
const REMINDER_CONTEXT_PER_MESSAGE_MAX = 220;
const REMINDER_CONTEXT_TOTAL_MAX = 700;
const REMINDER_CONTEXT_MARKER = "\n\nRecent context:\n";
function isMissingOrEmptyObject(value) {
	return !value || isRecord(value) && Object.keys(value).length === 0;
}
function nullableStringSchema(description) {
	return Type.Optional(Type.Union([Type.String(), Type.Null()], { description }));
}
function nullableStringArraySchema(description) {
	return Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()], { description }));
}
function deliveryStringSchema(params) {
	return params.nullableClears ? nullableStringSchema(`${params.description}, or null to clear`) : Type.Optional(Type.String({ description: params.description }));
}
function deliveryThreadIdSchema(params) {
	const variants = params.nullableClears ? [
		Type.String(),
		Type.Number(),
		Type.Null()
	] : [Type.String(), Type.Number()];
	return Type.Optional(Type.Union(variants, { description: "Thread/topic id" }));
}
function failureDestinationModeSchema(params) {
	const variants = params.nullableClears ? [
		Type.Literal("announce"),
		Type.Literal("webhook"),
		Type.Null()
	] : [Type.Literal("announce"), Type.Literal("webhook")];
	return Type.Optional(Type.Union(variants));
}
function cronPayloadObjectSchema(params) {
	return Type.Object({
		kind: optionalStringEnum(CRON_PAYLOAD_KINDS, { description: "Payload kind" }),
		text: Type.Optional(Type.String({ description: "systemEvent text" })),
		message: Type.Optional(Type.String({ description: "agentTurn prompt" })),
		script: Type.Optional(Type.String({ description: "Headless code-mode script" })),
		model: params.model,
		thinking: Type.Optional(Type.String({ description: "Thinking override" })),
		timeoutSeconds: optionalFiniteNumberSchema({ minimum: 0 }),
		toolBudget: optionalPositiveIntegerSchema({ description: "Maximum script tool calls" }),
		lightContext: Type.Optional(Type.Boolean()),
		allowUnsafeExternalContent: Type.Optional(Type.Boolean()),
		fallbacks: params.fallbacks,
		toolsAllow: params.toolsAllow
	}, { additionalProperties: true });
}
function createCronScheduleSchema() {
	return Type.Optional(Type.Object({
		kind: optionalStringEnum(CRON_SCHEDULE_KINDS, { description: "Schedule kind" }),
		at: Type.Optional(Type.String({ description: "ISO-8601 time (kind=at)" })),
		everyMs: optionalPositiveIntegerSchema({ description: "Interval ms (kind=every)" }),
		anchorMs: optionalNonNegativeIntegerSchema({ description: "Start anchor ms (kind=every)" }),
		expr: Type.Optional(Type.String({ description: "Cron wall-time expr; never UTC-convert. Missing tz=Gateway local. Example \"0 18 * * *\", \"Asia/Shanghai\"." })),
		tz: Type.Optional(Type.String({ description: "IANA timezone for wall-clock fields; missing=Gateway host local timezone. Example \"Asia/Shanghai\"." })),
		staggerMs: optionalNonNegativeIntegerSchema({ description: "Jitter ms (kind=cron)" })
	}, { additionalProperties: true }));
}
function createCronPacingSchema(params) {
	const pacing = Type.Object({
		min: Type.Optional(Type.String({ description: "Minimum dynamic delay" })),
		max: Type.Optional(Type.String({ description: "Maximum dynamic delay" }))
	}, {
		additionalProperties: false,
		description: "Dynamic-cadence bounds; at least one of min or max is required"
	});
	return Type.Optional(params.nullableClears ? Type.Union([pacing, Type.Null()]) : pacing);
}
function assertCronPacingInput(value, params) {
	if (value === void 0 || params.nullableClears && value === null) return;
	if (!isRecord(value)) throw new Error("cron pacing must be an object");
	parseCronPacingBounds(value);
}
function createCronPayloadSchema() {
	return Type.Optional(cronPayloadObjectSchema({
		model: Type.Optional(Type.String({ description: "Model override" })),
		toolsAllow: Type.Optional(Type.Array(Type.String(), { description: "Allowed tools" })),
		fallbacks: Type.Optional(Type.Array(Type.String(), { description: "Fallback models" }))
	}));
}
function createCronTriggerSchema(params) {
	const trigger = Type.Object({
		script: Type.String({
			minLength: 1,
			maxLength: 65536
		}),
		once: Type.Optional(Type.Boolean())
	}, { additionalProperties: false });
	return Type.Optional(params.nullableClears ? Type.Union([trigger, Type.Null()]) : trigger);
}
function cronDeliverySchema(params) {
	const failureDestinationObject = Type.Object({
		channel: deliveryStringSchema({
			description: "Failure delivery channel",
			nullableClears: params.nullableClears
		}),
		to: deliveryStringSchema({
			description: "Failure delivery target",
			nullableClears: params.nullableClears
		}),
		accountId: deliveryStringSchema({
			description: "Failure delivery account",
			nullableClears: params.nullableClears
		}),
		mode: failureDestinationModeSchema({ nullableClears: params.nullableClears })
	}, { additionalProperties: true });
	return Type.Optional(Type.Object({
		mode: optionalStringEnum(CRON_DELIVERY_MODES, { description: "Delivery mode" }),
		channel: deliveryStringSchema({
			description: "Delivery channel",
			nullableClears: params.nullableClears
		}),
		to: deliveryStringSchema({
			description: "Delivery target",
			nullableClears: params.nullableClears
		}),
		threadId: deliveryThreadIdSchema({ nullableClears: params.nullableClears }),
		bestEffort: Type.Optional(Type.Boolean()),
		accountId: deliveryStringSchema({
			description: "Delivery account",
			nullableClears: params.nullableClears
		}),
		failureDestination: params.nullableClears ? Type.Optional(Type.Union([failureDestinationObject, Type.Null()], { description: "Failure destination; null clears." })) : Type.Optional(failureDestinationObject)
	}, { additionalProperties: true }));
}
function createCronDeliverySchema() {
	return cronDeliverySchema({ nullableClears: false });
}
function createCronDeliveryPatchSchema() {
	return cronDeliverySchema({ nullableClears: true });
}
function createCronFailureAlertSchema() {
	return Type.Optional(Type.Unsafe({
		type: "object",
		properties: {
			after: optionalPositiveIntegerSchema({ description: "Failures before alert" }),
			channel: Type.Optional(Type.String({ description: "Alert channel" })),
			to: Type.Optional(Type.String({ description: "Alert target" })),
			cooldownMs: optionalNonNegativeIntegerSchema({ description: "Alert cooldown ms" }),
			includeSkipped: Type.Optional(Type.Boolean({ description: "Count skipped runs." })),
			mode: optionalStringEnum(["announce", "webhook"]),
			accountId: Type.Optional(Type.String())
		},
		additionalProperties: true,
		description: "Failure alert; false disables."
	}));
}
function createCronJobObjectSchema() {
	return Type.Optional(Type.Object({
		name: Type.Optional(Type.String({ description: "Job name" })),
		declarationKey: Type.Optional(Type.String({
			description: "Idempotent declaration key.",
			minLength: 1,
			maxLength: 200
		})),
		displayName: Type.Optional(Type.String({
			description: "Human-readable declarative job label",
			maxLength: 200
		})),
		owner: Type.Optional(Type.Object({
			agentId: Type.Optional(Type.String()),
			sessionKey: Type.Optional(Type.String())
		}, { additionalProperties: false })),
		schedule: createCronScheduleSchema(),
		pacing: createCronPacingSchema({ nullableClears: false }),
		trigger: createCronTriggerSchema({ nullableClears: false }),
		sessionTarget: Type.Optional(Type.String({ description: "main | isolated | current | session:<id>" })),
		wakeMode: optionalStringEnum(CRON_WAKE_MODES, { description: "Wake timing" }),
		payload: createCronPayloadSchema(),
		delivery: createCronDeliverySchema(),
		agentId: nullableStringSchema("Agent id, or null to keep it unset"),
		description: Type.Optional(Type.String({ description: "Human description" })),
		enabled: Type.Optional(Type.Boolean()),
		deleteAfterRun: Type.Optional(Type.Boolean({ description: "Delete after first run" })),
		sessionKey: nullableStringSchema("Explicit session key, or null to clear it"),
		failureAlert: createCronFailureAlertSchema()
	}, { additionalProperties: true }));
}
function createCronPatchObjectSchema() {
	return Type.Optional(Type.Object({
		name: Type.Optional(Type.String({ description: "Job name" })),
		displayName: Type.Optional(Type.Union([Type.String({ maxLength: 200 }), Type.Null()], { description: "Human-readable label; null clears it" })),
		schedule: createCronScheduleSchema(),
		pacing: createCronPacingSchema({ nullableClears: true }),
		trigger: createCronTriggerSchema({ nullableClears: true }),
		sessionTarget: Type.Optional(Type.String({ description: "Session target" })),
		wakeMode: optionalStringEnum(CRON_WAKE_MODES),
		payload: Type.Optional(cronPayloadObjectSchema({
			model: nullableStringSchema("Model override, or null to clear"),
			toolsAllow: nullableStringArraySchema("Allowed tool ids, or null to clear"),
			fallbacks: nullableStringArraySchema("Fallback models, or null to clear")
		})),
		delivery: createCronDeliveryPatchSchema(),
		description: Type.Optional(Type.String()),
		enabled: Type.Optional(Type.Boolean()),
		deleteAfterRun: Type.Optional(Type.Boolean()),
		agentId: nullableStringSchema("Agent id, or null to clear it"),
		sessionKey: nullableStringSchema("Explicit session key, or null to clear it"),
		failureAlert: createCronFailureAlertSchema()
	}, { additionalProperties: true }));
}
function createCronToolSchema() {
	return Type.Object({
		action: stringEnum(CRON_ACTIONS),
		...gatewayCallOptionSchemaProperties(),
		includeDisabled: Type.Optional(Type.Boolean()),
		job: createCronJobObjectSchema(),
		jobId: Type.Optional(Type.String()),
		id: Type.Optional(Type.String()),
		patch: createCronPatchObjectSchema(),
		in: Type.Optional(Type.String({ description: "Relative duration for action=\"next_check\" (for example, \"15m\")" })),
		text: Type.Optional(Type.String()),
		mode: optionalStringEnum(CRON_WAKE_MODES),
		runMode: optionalStringEnum(CRON_RUN_MODES, { description: "Run mode for action=\"run\": omitted defaults to \"due\"; use \"force\" to trigger now." }),
		contextMessages: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: REMINDER_CONTEXT_MESSAGES_MAX
		})),
		agentId: Type.Optional(Type.String({ description: "List filter for `action: \"list\"`; wake target override for `action: \"wake\"` (defaults to the calling agent when omitted on wake)" })),
		sessionKey: Type.Optional(Type.String({ description: "Wake target override for `action: \"wake\"`: route the event to another session owned by the calling agent. Defaults to the resolved calling-session key when omitted." }))
	}, { additionalProperties: true });
}
function replaceWithEffectiveCronCreatorToolAllowlist(target, tools, toolMeta) {
	target.length = 0;
	const seen = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		const name = normalizeToolName(tool.name);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		const meta = toolMeta?.(tool);
		const pluginId = typeof meta?.pluginId === "string" ? normalizeToolName(meta.pluginId) : void 0;
		target.push(pluginId ? {
			name,
			pluginId
		} : { name });
	}
}
function stripExistingContext(text) {
	const index = text.indexOf(REMINDER_CONTEXT_MARKER);
	if (index === -1) return text;
	return text.slice(0, index).trim();
}
function truncateText(input, maxLen) {
	if (input.length <= maxLen) return input;
	return `${truncateUtf16Safe(input, Math.max(0, maxLen - 3)).trimEnd()}...`;
}
function readCronJobIdParam(params) {
	return readStringParam(params, "jobId") ?? readStringParam(params, "id");
}
function resolveCronToolCallerScope(opts, cfg) {
	const sessionKey = opts?.agentSessionKey?.trim();
	if (!sessionKey) return;
	return {
		kind: "agentTool",
		agentId: resolveSessionAgentId({
			sessionKey,
			config: cfg
		})
	};
}
function readCronToolAgentId(value) {
	return typeof value === "string" && value.trim() ? normalizeAgentId(value) : void 0;
}
function readAgentIdFromCronToolSessionRef(value) {
	return typeof value === "string" && value.trim() ? parseAgentSessionKey(value.trim())?.agentId : void 0;
}
function readAgentIdFromCronToolSessionTarget(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed.startsWith("session:")) return;
	return readAgentIdFromCronToolSessionRef(trimmed.slice(8));
}
function assertCronToolAgentFieldMatchesScope(params) {
	if (params.value === void 0) return;
	const agentId = readCronToolAgentId(params.value);
	if (agentId && agentId === params.callerScope.agentId) return;
	throw new Error(`${params.field} must match the calling agent`);
}
function assertCronToolSessionRefsMatchScope(value, callerScope) {
	const sessionAgentId = readAgentIdFromCronToolSessionRef(value.sessionKey);
	if (sessionAgentId && normalizeAgentId(sessionAgentId) !== callerScope.agentId) throw new Error("cron sessionKey must match the calling agent");
	const sessionTargetAgentId = readAgentIdFromCronToolSessionTarget(value.sessionTarget);
	if (sessionTargetAgentId && normalizeAgentId(sessionTargetAgentId) !== callerScope.agentId) throw new Error("cron sessionTarget must match the calling agent");
}
const CRON_SELF_REMOVE_SCOPE_ERROR = "Cron tool is restricted to the current cron job.";
function readCronSelfRemoveOnlyJobId(opts) {
	return opts?.selfRemoveOnlyJobId?.trim() || void 0;
}
function isCronSelfIntrospectionAction(action) {
	return action === "status" || action === "list";
}
function assertCronSelfRemoveScope(opts, action, params) {
	const selfRemoveOnlyJobId = readCronSelfRemoveOnlyJobId(opts);
	if (!selfRemoveOnlyJobId || isCronSelfIntrospectionAction(action)) return;
	if (action === "next_check" && params.jobId === void 0 && params.id === void 0) return;
	if (action === "get" || action === "remove" || action === "runs") {
		const id = readCronJobIdParam(params);
		if (id && id === selfRemoveOnlyJobId) return;
	}
	throw new Error(CRON_SELF_REMOVE_SCOPE_ERROR);
}
function filterCronDeliveryPreviewsByJobId(previews, jobId) {
	if (!isRecord(previews)) return previews;
	if (!Object.hasOwn(previews, jobId)) return {};
	return { [jobId]: previews[jobId] };
}
function filterCronListResultToJobId(result, jobId) {
	if (!isRecord(result) || !Array.isArray(result.jobs)) return result;
	const jobs = result.jobs.filter((job) => isRecord(job) && job.id === jobId);
	return {
		...result,
		jobs,
		total: jobs.length,
		offset: 0,
		limit: jobs.length,
		hasMore: false,
		nextOffset: null,
		...Object.hasOwn(result, "deliveryPreviews") ? { deliveryPreviews: filterCronDeliveryPreviewsByJobId(result.deliveryPreviews, jobId) } : {}
	};
}
function filterCronStatusResultForSelfScope(result) {
	return { enabled: isRecord(result) && result.enabled === true };
}
function formatCronTerminalPresentation(params, result) {
	if (!isRecord(params) || !isRecord(result) || !isRecord(result.details)) return;
	switch (params.action) {
		case "status": return { text: `Cron scheduler status.\nEnabled: ${result.details.enabled === true ? "yes" : "no"}` };
		case "list": {
			const count = (typeof result.details.total === "number" && Number.isFinite(result.details.total) && result.details.total >= 0 ? Math.floor(result.details.total) : void 0) ?? (Array.isArray(result.details.jobs) ? result.details.jobs.length : void 0);
			return count === void 0 ? { text: "Cron jobs listed." } : { text: `Cron jobs listed.\nCount: ${count}` };
		}
		case "get": return { text: "Cron job loaded." };
		case "runs": {
			const entries = Array.isArray(result.details.entries) ? result.details.entries.length : void 0;
			return entries === void 0 ? { text: "Cron run history loaded." } : { text: `Cron run history loaded.\nCount: ${entries}` };
		}
		default: return;
	}
}
function cronListResultHasJob(result, jobId) {
	return isRecord(result) && Array.isArray(result.jobs) && result.jobs.some((job) => isRecord(job) && job.id === jobId);
}
function readCronListNextOffset(result, currentOffset) {
	if (!isRecord(result) || result.hasMore !== true || typeof result.nextOffset !== "number") return;
	const nextOffset = Math.floor(result.nextOffset);
	return Number.isFinite(nextOffset) && nextOffset > currentOffset ? nextOffset : void 0;
}
function isOlderGatewayWithoutCompactCronList(error) {
	return error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("invalid cron.list params") && error.message.includes("unexpected property 'compact'");
}
function extractMessageText(message) {
	const role = typeof message.role === "string" ? message.role : "";
	if (role !== "user" && role !== "assistant") return null;
	const text = extractTextFromChatContent(message.content);
	return text ? {
		role,
		text
	} : null;
}
async function buildReminderContextLines(params) {
	const maxMessages = Math.min(REMINDER_CONTEXT_MESSAGES_MAX, Math.max(0, Math.floor(params.contextMessages)));
	if (maxMessages <= 0) return [];
	const sessionKey = params.agentSessionKey?.trim();
	if (!sessionKey) return [];
	const { mainKey, alias } = resolveMainSessionAlias(getRuntimeConfig());
	const resolvedKey = resolveInternalSessionKey({
		key: sessionKey,
		alias,
		mainKey
	});
	try {
		const res = await params.callGatewayTool("chat.history", params.gatewayOpts, {
			sessionKey: resolvedKey,
			limit: maxMessages
		});
		const recent = (Array.isArray(res?.messages) ? res.messages : []).map((msg) => extractMessageText(msg)).filter((msg) => Boolean(msg)).slice(-maxMessages);
		if (recent.length === 0) return [];
		const lines = [];
		let total = 0;
		for (const entry of recent) {
			const line = `- ${entry.role === "user" ? "User" : "Assistant"}: ${truncateText(entry.text, REMINDER_CONTEXT_PER_MESSAGE_MAX)}`;
			total += line.length;
			if (total > REMINDER_CONTEXT_TOTAL_MAX) break;
			lines.push(line);
		}
		return lines;
	} catch {
		return [];
	}
}
function createCronTool(opts, deps) {
	const callGateway = deps?.callGatewayTool ?? callGatewayTool;
	return setToolTerminalPresentation({
		label: "Cron",
		name: "cron",
		displaySummary: CRON_TOOL_DISPLAY_SUMMARY,
		description: `Gateway schedules/wakes: reminders, later checks/follow-ups, recurring work. Never exec sleep/process-poll as timer. Main job => heartbeat system event; isolated => background task in \`openclaw tasks\`.

ACTIONS:
- status scheduler; list compact summaries (includeDisabled, session agentId auto-filter; get for full); get jobId
- add job; update jobId+patch; remove jobId
- run jobId (due only; runMode="force" now); runs jobId history; next_check in (current paced job only)
- wake text (+ optional mode). Default caller lane; top-level sessionKey/agentId selects another caller-owned lane.

ADD JOB:
{ "name":"...", "schedule":{...}, "pacing":{ "min":"15m", "max":"4h" }, "trigger":{ "script":"...", "once":false }, "payload":{...}, "delivery":{...}, "sessionTarget":"main|isolated|current|session:<id>", "enabled":true }
Required: schedule,payload. enabled default true. trigger only every/cron.

TARGET/PAYLOAD:
- main => systemEvent {kind:"systemEvent",text:"..."} or script; systemEvent defaults main.
- isolated/current/session:<id> => agentTurn {kind:"agentTurn",message:"...",model?,thinking?,timeoutSeconds?}; agentTurn defaults isolated. timeoutSeconds=0 means none.
- script {kind:"script",script:"...",timeoutSeconds?,toolBudget?} supports main or isolated only and requires cron.triggers.enabled.
- current binds caller session at creation. session:<id> is persistent. Prefer isolated unless user explicitly wants current binding.

SCHEDULE:
- at: {kind:"at",at:"ISO-8601"}; timezone-less = UTC.
- every: {kind:"every",everyMs:<ms>,anchorMs?}.
- cron: {kind:"cron",expr:"...",tz?:"IANA"}. Expr is requested local wall time; never pre-convert to UTC. Missing tz = Gateway host local, not UTC. Shanghai 18:00: {kind:"cron",expr:"0 18 * * *",tz:"Asia/Shanghai"}.

TRIGGER SCRIPT:
- Requires cron.triggers.enabled; if off, explain and never model-poll fallback.
- Headless owner allowlist; quiet check has no model. Prior trigger.state is frozen JSON. Return/json({fire:boolean,message?:string,state?:JSONValue}); create new state, never mutate prior.
- fire:false saves state only; no payload/history. fire:true runs payload and appends message; fired state saves only after payload success.
- Fire on every actionable state, including failures/timeouts; success-only watchers go silent when broken, which looks healthy. Dedupe by comparing trigger.state and returning new state, never memory.
- Keep scripts read-only; actions belong in payload. message must be self-contained: it is the fired run's entire context.
- Silent watcher: top-level delivery.mode="none". Omitted delivery on isolated agentTurn announces and missing route may fail.
- once:true disables after first successful fire. Per check: 30s, 5 tool calls, 16KB state.
- Hidden Code Mode tools: await tools.call("exec", {command:"..."}); unknown id => search/describe.

DELIVERY top-level: {mode:"none|announce|webhook",channel?,to?,threadId?,bestEffort?}
- Isolated agentTurn omitted delivery => announce. announce only isolated/current/session; channel/to optional; threadId chat topic. Specific chat: set channel/to; no messaging tool inside run.
- webhook posts finished-run event to URL in to.

Restricted isolated runs may only self status/list, current get/runs/remove, and next_check for their own paced job. wake mode: next-heartbeat default | now. jobId canonical; id compat. contextMessages 0-10 adds prior messages.`,
		parameters: createCronToolSchema(),
		execute: async (_toolCallId, args) => {
			const params = args;
			const action = readStringParam(params, "action", { required: true });
			assertCronSelfRemoveScope(opts, action, params);
			const parsedGatewayOpts = readGatewayCallOptions(params);
			const gatewayOpts = {
				...parsedGatewayOpts,
				timeoutMs: parsedGatewayOpts.timeoutMs ?? 6e4
			};
			const runtimeConfig = getRuntimeConfig();
			const callerScope = resolveCronToolCallerScope(opts, runtimeConfig);
			return await withGatewayToolCallerIdentity(callerScope && opts?.agentSessionKey?.trim() ? {
				agentId: callerScope.agentId,
				sessionKey: opts.agentSessionKey.trim()
			} : void 0, async () => {
				switch (action) {
					case "status": {
						const result = await callGateway("cron.status", gatewayOpts, {});
						return jsonResult(readCronSelfRemoveOnlyJobId(opts) ? filterCronStatusResultForSelfScope(result) : result);
					}
					case "list": {
						const selfRemoveOnlyJobId = readCronSelfRemoveOnlyJobId(opts);
						const explicitAgentId = readCronToolAgentId(params.agentId);
						if (callerScope && explicitAgentId && explicitAgentId !== callerScope.agentId) throw new Error("cron list agentId must match the calling agent");
						const listAgentId = callerScope?.agentId ?? explicitAgentId;
						const includeDisabled = Boolean(params.includeDisabled);
						let offset = 0;
						let result;
						let shouldContinue = true;
						let useCompactList = true;
						while (shouldContinue) {
							try {
								result = await callGateway("cron.list", gatewayOpts, {
									includeDisabled,
									...useCompactList ? { compact: true } : {},
									...listAgentId ? { agentId: listAgentId } : {},
									...selfRemoveOnlyJobId ? {
										limit: 200,
										offset
									} : {}
								});
							} catch (error) {
								if (!useCompactList || !isOlderGatewayWithoutCompactCronList(error)) throw error;
								useCompactList = false;
								continue;
							}
							if (!selfRemoveOnlyJobId || cronListResultHasJob(result, selfRemoveOnlyJobId)) shouldContinue = false;
							else {
								const nextOffset = readCronListNextOffset(result, offset);
								if (nextOffset === void 0) shouldContinue = false;
								else offset = nextOffset;
							}
						}
						return jsonResult(selfRemoveOnlyJobId ? filterCronListResultToJobId(result, selfRemoveOnlyJobId) : result);
					}
					case "get": {
						const id = readCronJobIdParam(params);
						if (!id) throw new Error("jobId required (id accepted for backward compatibility)");
						return jsonResult(await callGateway("cron.get", gatewayOpts, { id }));
					}
					case "add": {
						if (isMissingOrEmptyObject(params.job)) {
							const synthetic = recoverCronObjectFromFlatParams(params);
							if (synthetic.found && hasCronCreateSignal(synthetic.value)) params.job = synthetic.value;
						}
						if (!params.job || typeof params.job !== "object") throw new Error("job required");
						const canonicalJob = canonicalizeCronToolObject(params.job);
						assertNoCronShellExecution(canonicalJob);
						assertCronDeliveryInputNonBlankFields(canonicalJob.delivery);
						assertCronPacingInput(canonicalJob.pacing, { nullableClears: false });
						if (typeof canonicalJob.declarationKey === "string" && canonicalJob.declarationKey.trim().length === 0) throw new Error("declarationKey must be a non-empty string");
						if (typeof canonicalJob.displayName === "string" && canonicalJob.displayName.trim().length === 0) throw new Error("displayName must be a non-empty string");
						const enabledExplicit = typeof canonicalJob.enabled === "boolean";
						const job = normalizeCronJobCreate(canonicalJob, { sessionContext: { sessionKey: opts?.agentSessionKey } }) ?? canonicalJob;
						if (typeof job.declarationKey === "string" && job.declarationKey.length > 0 && !enabledExplicit) delete job.enabled;
						capCronJobToolsAllowOnCreate(job, opts?.creatorToolAllowlist);
						if (job && typeof job === "object") {
							const { mainKey, alias } = resolveMainSessionAlias(runtimeConfig);
							const resolvedSessionKey = opts?.agentSessionKey ? resolveInternalSessionKey({
								key: opts.agentSessionKey,
								alias,
								mainKey
							}) : void 0;
							if (callerScope) {
								assertCronToolAgentFieldMatchesScope({
									value: job.agentId,
									field: "cron job agentId",
									callerScope
								});
								job.agentId = callerScope.agentId;
								assertCronToolSessionRefsMatchScope(job, callerScope);
							}
							const sessionTarget = normalizeLowercaseStringOrEmpty(job.sessionTarget);
							if (!("sessionKey" in job) && resolvedSessionKey && sessionTarget !== "isolated") job.sessionKey = resolvedSessionKey;
						}
						if ((opts?.agentSessionKey || opts?.currentDeliveryContext) && job && typeof job === "object" && "payload" in job && job.payload?.kind === "agentTurn") {
							const deliveryValue = job.delivery;
							const delivery = isRecord(deliveryValue) ? deliveryValue : void 0;
							const mode = normalizeLowercaseStringOrEmpty(typeof delivery?.mode === "string" ? delivery.mode : "");
							if (mode === "webhook") {
								const webhookUrl = normalizeHttpWebhookUrl(delivery?.to);
								if (!webhookUrl) throw new Error("delivery.mode=\"webhook\" requires delivery.to to be a valid http(s) URL");
								if (delivery) delivery.to = webhookUrl;
							}
							const hasTarget = typeof delivery?.channel === "string" && delivery.channel.trim() || typeof delivery?.to === "string" && delivery.to.trim();
							if ((deliveryValue == null || delivery) && (mode === "" || mode === "announce") && !hasTarget) {
								const inferred = resolveCronCreationDelivery({
									cfg: runtimeConfig,
									currentDeliveryContext: opts.currentDeliveryContext,
									agentSessionKey: opts.agentSessionKey
								});
								if (inferred) job.delivery = {
									...inferred,
									...delivery
								};
							}
						}
						const contextMessages = readNonNegativeIntegerParam(params, "contextMessages") ?? 0;
						if (job && typeof job === "object" && "payload" in job && job.payload?.kind === "systemEvent") {
							const payload = job.payload;
							if (typeof payload.text === "string" && payload.text.trim()) {
								const contextLines = await buildReminderContextLines({
									agentSessionKey: opts?.agentSessionKey,
									gatewayOpts,
									contextMessages,
									callGatewayTool: callGateway
								});
								if (contextLines.length > 0) payload.text = `${stripExistingContext(payload.text)}${REMINDER_CONTEXT_MARKER}${contextLines.join("\n")}`;
							}
						}
						return jsonResult(await callGateway("cron.add", gatewayOpts, { ...job }));
					}
					case "update": {
						const id = readCronJobIdParam(params);
						if (!id) throw new Error("jobId required (id accepted for backward compatibility)");
						let recoveredFlatPatch = false;
						if (isMissingOrEmptyObject(params.patch)) {
							const synthetic = recoverCronObjectFromFlatParams(params);
							if (synthetic.found) {
								params.patch = synthetic.value;
								recoveredFlatPatch = true;
							}
						}
						if (!params.patch || typeof params.patch !== "object") throw new Error("patch required");
						const canonicalPatch = canonicalizeCronToolObject(params.patch);
						assertNoCronShellExecution(canonicalPatch);
						assertCronDeliveryInputNonBlankFields(canonicalPatch.delivery);
						assertCronPacingInput(canonicalPatch.pacing, { nullableClears: true });
						if (typeof canonicalPatch.displayName === "string" && canonicalPatch.displayName.trim().length === 0) throw new Error("displayName must be a non-empty string or null");
						const patch = normalizeCronJobPatch(canonicalPatch) ?? canonicalPatch;
						if (recoveredFlatPatch && isEmptyRecoveredCronPatch(patch)) throw new Error("patch required");
						if (callerScope && "agentId" in patch) throw new Error("cron patch agentId cannot be changed by the agent cron tool");
						if (callerScope) assertCronToolSessionRefsMatchScope(patch, callerScope);
						return jsonResult(await updateCronJobFromAgentTool({
							id,
							patch,
							creatorToolAllowlist: opts?.creatorToolAllowlist,
							gatewayOpts,
							callGateway
						}));
					}
					case "remove": {
						const id = readCronJobIdParam(params);
						if (!id) throw new Error("jobId required (id accepted for backward compatibility)");
						return jsonResult(await callGateway("cron.remove", gatewayOpts, { id }));
					}
					case "run": {
						const id = readCronJobIdParam(params);
						if (!id) throw new Error("jobId required (id accepted for backward compatibility)");
						const runMode = params.runMode === "due" || params.runMode === "force" ? params.runMode : "due";
						return jsonResult(await callGateway("cron.run", gatewayOpts, {
							id,
							mode: runMode
						}));
					}
					case "runs": {
						const id = readCronJobIdParam(params);
						if (!id) throw new Error("jobId required (id accepted for backward compatibility)");
						return jsonResult(await callGateway("cron.runs", gatewayOpts, { id }));
					}
					case "next_check": {
						const jobId = readCronSelfRemoveOnlyJobId(opts);
						const runId = opts?.runId?.trim();
						if (!jobId || !runId) throw new Error("cron next_check is only available to the currently running job");
						const rawDuration = readStringParam(params, "in", { required: true });
						let delayMs;
						try {
							delayMs = parseDurationMs(rawDuration);
						} catch {
							throw new Error("cron next_check in must be a positive duration");
						}
						if (delayMs <= 0) throw new Error("cron next_check in must be a positive duration");
						recordCronNextCheckProposal(runId, jobId, delayMs);
						return jsonResult({
							ok: true,
							delayMs
						});
					}
					case "wake": {
						const text = readStringParam(params, "text", { required: true });
						const mode = params.mode === "now" || params.mode === "next-heartbeat" ? params.mode : "next-heartbeat";
						const cfg = getRuntimeConfig();
						const { mainKey, alias } = resolveMainSessionAlias(cfg);
						const explicitSessionKey = readStringParam(params, "sessionKey");
						const explicitAgentId = readStringParam(params, "agentId");
						if (callerScope) {
							assertCronToolAgentFieldMatchesScope({
								value: explicitAgentId,
								field: "wake agentId",
								callerScope
							});
							assertCronToolSessionRefsMatchScope({ sessionKey: explicitSessionKey }, callerScope);
						}
						const inferredSessionKey = opts?.agentSessionKey ? resolveInternalSessionKey({
							key: opts.agentSessionKey,
							alias,
							mainKey
						}) : void 0;
						const inferredAgentId = opts?.agentSessionKey ? resolveSessionAgentId({
							sessionKey: opts.agentSessionKey,
							config: cfg
						}) : void 0;
						const sessionKey = explicitSessionKey ?? inferredSessionKey;
						const agentIdFromExplicitSessionKey = explicitSessionKey ? parseAgentSessionKey(explicitSessionKey)?.agentId : void 0;
						if (explicitAgentId && agentIdFromExplicitSessionKey && normalizeLowercaseStringOrEmpty(explicitAgentId) !== normalizeLowercaseStringOrEmpty(agentIdFromExplicitSessionKey)) throw new Error(`wake agentId "${explicitAgentId}" contradicts the agent that owns sessionKey ("${agentIdFromExplicitSessionKey}"); pass a single canonical wake target`);
						const agentId = callerScope?.agentId ?? explicitAgentId ?? (explicitSessionKey ? agentIdFromExplicitSessionKey : inferredAgentId);
						return jsonResult(await callGateway("wake", gatewayOpts, {
							mode,
							text,
							...sessionKey ? { sessionKey } : {},
							...agentId ? { agentId } : {}
						}, { expectFinal: false }));
					}
					default: throw new Error(`Unknown action: ${action}`);
				}
			});
		}
	}, formatCronTerminalPresentation);
}
//#endregion
export { replaceWithEffectiveCronCreatorToolAllowlist as n, gatewayCallOptionSchemaProperties as r, createCronTool as t };
