import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./agent-scope-CrBA-6Gx.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-S7z_Yn4H.js";
import { r as logVerbose } from "./globals-DBBT7Ru5.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { i as resolveSimpleCompletionSelectionForAgent, r as prepareSimpleCompletionModelForAgent, t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-runtime-DNyn8RYv.js";
//#region src/auto-reply/reply/conversation-label-generator.ts
const DEFAULT_MAX_LABEL_LENGTH = 128;
const CONVERSATION_LABEL_MAX_TOKENS = 4096;
const TIMEOUT_MS = 15e3;
function isTextContentBlock(block) {
	return block.type === "text";
}
function isCodexSimpleCompletionModel(model) {
	return model.api === "openai-chatgpt-responses";
}
function extractSimpleCompletionError(result) {
	if (result.stopReason !== "error") return null;
	return result.errorMessage?.trim() || "unknown error";
}
function resolveMaxLabelLength(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_MAX_LABEL_LENGTH;
}
function logLabelFailure(phase, message) {
	logVerbose(`conversation-label-generator: ${phase === "utility" ? "" : `${phase} `}${message}`);
}
async function prepareLabelModel(params) {
	try {
		const prepared = await prepareSimpleCompletionModelForAgent({
			cfg: params.cfg,
			agentId: params.agentId,
			agentDir: params.agentDir,
			...params.attempt.modelRef ? { modelRef: params.attempt.modelRef } : {},
			...params.attempt.useUtilityModel !== void 0 ? { useUtilityModel: params.attempt.useUtilityModel } : {},
			...params.attempt.preferredProfile ? { preferredProfile: params.attempt.preferredProfile } : {},
			...params.attempt.bindAuthOwner !== void 0 ? { bindAuthOwner: params.attempt.bindAuthOwner } : {},
			useAsyncModelResolution: true,
			allowMissingApiKeyModes: ["aws-sdk"]
		});
		if ("error" in prepared) logLabelFailure(params.phase, prepared.error);
		return prepared;
	} catch (err) {
		logLabelFailure(params.phase, `model preparation failed: ${String(err)}`);
		return null;
	}
}
function selectedLabelModelsMatch(first, second) {
	const firstSelection = first && "selection" in first ? first.selection : void 0;
	const secondSelection = second && "selection" in second ? second.selection : void 0;
	return Boolean(firstSelection && secondSelection && firstSelection.provider === secondSelection.provider && firstSelection.runtimeProvider === secondSelection.runtimeProvider && firstSelection.modelId === secondSelection.modelId && firstSelection.profileId === secondSelection.profileId);
}
function resolveAttemptSelection(params) {
	return resolveSimpleCompletionSelectionForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		...params.attempt.modelRef ? { modelRef: params.attempt.modelRef } : {},
		...params.attempt.useUtilityModel !== void 0 ? { useUtilityModel: params.attempt.useUtilityModel } : {}
	});
}
function resolveRawModelProvider(modelRef) {
	const model = splitTrailingAuthProfile(modelRef?.trim() ?? "").model;
	const separator = model.indexOf("/");
	return (separator > 0 ? model.slice(0, separator).trim().toLowerCase() : "") || void 0;
}
function resolveAttemptKey(params) {
	const selection = resolveAttemptSelection(params);
	if (selection) return [
		"resolved",
		selection.provider,
		selection.runtimeProvider ?? "",
		selection.modelId,
		selection.profileId ?? params.attempt.preferredProfile ?? ""
	].join("\0");
	const rawRef = splitTrailingAuthProfile(params.attempt.modelRef?.trim() ?? "");
	return [
		"raw",
		rawRef.model,
		rawRef.profile ?? params.attempt.preferredProfile ?? ""
	].join("\0");
}
async function completeLabel(params) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const maxTokens = Math.min(CONVERSATION_LABEL_MAX_TOKENS, Math.floor(params.prepared.model.maxTokens));
		const result = await completeWithPreparedSimpleCompletionModel({
			model: params.prepared.model,
			auth: params.prepared.auth,
			cfg: params.cfg,
			context: {
				systemPrompt: params.prompt,
				messages: [{
					role: "user",
					content: params.userMessage,
					timestamp: Date.now()
				}]
			},
			options: {
				maxTokens,
				...isCodexSimpleCompletionModel(params.prepared.model) ? {} : { temperature: .3 },
				signal: controller.signal
			}
		});
		const errorMessage = extractSimpleCompletionError(result);
		if (errorMessage) {
			logLabelFailure(params.phase, `completion failed: ${errorMessage}`);
			return null;
		}
		const text = result.content.filter(isTextContentBlock).map((block) => block.text).join("").trim();
		return text ? truncateUtf16Safe(text, params.maxLength) || null : null;
	} catch (err) {
		logLabelFailure(params.phase, `completion failed: ${String(err)}`);
		return null;
	} finally {
		clearTimeout(timeout);
	}
}
/** Generates a bounded human-readable label for a session, or null on failure. */
async function generateConversationLabel(params) {
	const { userMessage, prompt, cfg, agentId, agentDir } = params;
	const maxLength = resolveMaxLabelLength(params.maxLength);
	const resolvedAgentId = agentId ?? resolveDefaultAgentId(cfg);
	const utilityPrepared = await prepareLabelModel({
		cfg,
		agentId: resolvedAgentId,
		agentDir,
		attempt: { useUtilityModel: true },
		phase: "utility"
	});
	const utilityCompletionAttempted = Boolean(utilityPrepared && !("error" in utilityPrepared));
	if (utilityPrepared && !("error" in utilityPrepared)) {
		const label = await completeLabel({
			prepared: utilityPrepared,
			cfg,
			userMessage,
			prompt,
			maxLength,
			phase: "utility"
		});
		if (label) return label;
	}
	const primaryPrepared = await prepareLabelModel({
		cfg,
		agentId: resolvedAgentId,
		agentDir,
		attempt: { useUtilityModel: false },
		phase: "primary fallback"
	});
	if (!primaryPrepared || "error" in primaryPrepared || utilityCompletionAttempted && selectedLabelModelsMatch(utilityPrepared, primaryPrepared)) return null;
	return await completeLabel({
		prepared: primaryPrepared,
		cfg,
		userMessage,
		prompt,
		maxLength,
		phase: "primary fallback"
	});
}
/** Tries an explicit utility model once, then the regular model once when needed. */
async function generateConversationLabelWithFallback(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
	const regularAttempt = {
		modelRef: params.regularModelRef,
		...params.preferredProfile ? { preferredProfile: params.preferredProfile } : {},
		bindAuthOwner: true
	};
	const utilityRef = params.utilityModelRef?.trim();
	let utilityAttempt;
	if (utilityRef) {
		const candidate = {
			modelRef: utilityRef,
			bindAuthOwner: true
		};
		const utilitySelection = resolveAttemptSelection({
			cfg: params.cfg,
			agentId,
			agentDir: params.agentDir,
			attempt: candidate
		});
		const regularSelection = resolveAttemptSelection({
			cfg: params.cfg,
			agentId,
			agentDir: params.agentDir,
			attempt: regularAttempt
		});
		const utilityAuthProvider = utilitySelection?.provider ?? resolveRawModelProvider(utilityRef);
		const regularAuthProvider = regularSelection?.provider ?? resolveRawModelProvider(params.regularModelRef);
		const utilityRawProfile = splitTrailingAuthProfile(utilityRef).profile;
		utilityAttempt = params.preferredProfile && !utilitySelection?.profileId && !utilityRawProfile && utilityAuthProvider && utilityAuthProvider === regularAuthProvider ? {
			modelRef: `${utilityRef}@${params.preferredProfile}`,
			bindAuthOwner: true
		} : candidate;
	}
	const attempts = [...utilityAttempt ? [utilityAttempt] : [], regularAttempt];
	const seen = /* @__PURE__ */ new Set();
	const maxLength = resolveMaxLabelLength(params.maxLength);
	let previousCompletedModel = null;
	for (const attempt of attempts) {
		const key = resolveAttemptKey({
			cfg: params.cfg,
			agentId,
			agentDir: params.agentDir,
			attempt
		});
		if (seen.has(key)) continue;
		seen.add(key);
		const phase = attempt === regularAttempt ? "primary fallback" : "utility";
		const prepared = await prepareLabelModel({
			cfg: params.cfg,
			agentId,
			agentDir: params.agentDir,
			attempt,
			phase
		});
		if (!prepared || "error" in prepared) continue;
		if (previousCompletedModel && selectedLabelModelsMatch(previousCompletedModel, prepared)) continue;
		previousCompletedModel = prepared;
		const label = await completeLabel({
			prepared,
			cfg: params.cfg,
			userMessage: params.userMessage,
			prompt: params.prompt,
			maxLength,
			phase
		});
		if (label) {
			const normalized = params.normalizeLabel ? params.normalizeLabel(label) : label;
			if (normalized) return normalized;
		}
	}
	return null;
}
//#endregion
export { generateConversationLabelWithFallback as n, generateConversationLabel as t };
