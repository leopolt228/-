import { _ as resolveSessionAgentId } from "./agent-scope-CrBA-6Gx.js";
import { t as listAgentEntries } from "./agent-scope-config-S7z_Yn4H.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-CV4VBWUf.js";
import "./model-selection-Dx2ArePR.js";
import { u as loadSessionEntry } from "./session-utils-CEU0rCPC.js";
import { t as resolveDefaultModel } from "./directive-handling.defaults-DI13cICy.js";
import { n as createModelSelectionState } from "./model-selection-CXB7FsER.js";
import { n as buildStatusReply } from "./commands-status-uGlhRIFX.js";
import { t as resolveCurrentDirectiveLevels } from "./directive-handling.levels-5KB6kVYO.js";
//#region src/plugin-sdk/command-status.runtime.ts
/**
* Builds a direct `/status` reply for an arbitrary session key.
* Unauthorized requesters may see the session exists, but configured reasoning
* state is masked so private agent/session defaults are not leaked.
*/
async function resolveDirectStatusReplyForSession(params) {
	const requestedSessionKey = params.sessionKey.trim();
	if (!requestedSessionKey) return;
	const statusLoaded = loadSessionEntry(requestedSessionKey);
	const statusCfg = statusLoaded.cfg ?? params.cfg;
	const statusSessionKey = statusLoaded.canonicalKey;
	const statusEntry = statusLoaded.entry;
	const statusAgentId = resolveSessionAgentId({
		sessionKey: statusSessionKey,
		config: statusCfg
	});
	const agentCfg = statusCfg.agents?.defaults;
	const agentEntry = listAgentEntries(statusCfg).find((entry) => entry.id?.trim().toLowerCase() === statusAgentId);
	const statusModel = resolveDefaultModelForAgent({
		cfg: statusCfg,
		agentId: statusAgentId
	});
	const { defaultProvider, defaultModel } = resolveDefaultModel({
		cfg: statusCfg,
		agentId: statusAgentId
	});
	const selectedProvider = statusEntry?.providerOverride?.trim() || statusEntry?.modelProvider?.trim() || statusModel.provider;
	const selectedModel = statusEntry?.modelOverride?.trim() || statusEntry?.model?.trim() || statusModel.model;
	const modelState = await createModelSelectionState({
		cfg: statusCfg,
		agentId: statusAgentId,
		agentCfg,
		sessionEntry: statusEntry,
		sessionStore: statusLoaded.store,
		sessionKey: statusSessionKey,
		parentSessionKey: statusEntry?.parentSessionKey,
		storePath: statusLoaded.storePath,
		defaultProvider,
		defaultModel,
		provider: selectedProvider,
		model: selectedModel,
		hasModelDirective: false
	});
	const { currentThinkLevel, currentFastMode, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } = await resolveCurrentDirectiveLevels({
		sessionEntry: statusEntry,
		agentEntry,
		agentCfg,
		resolveDefaultThinkingLevel: () => modelState.resolveDefaultThinkingLevel()
	});
	const thinkingCatalog = await modelState.resolveThinkingCatalog();
	let resolvedReasoningLevel = currentReasoningLevel;
	const hasAgentReasoningDefault = agentEntry?.reasoningDefault !== void 0 && agentEntry.reasoningDefault !== null || agentCfg?.reasoningDefault !== void 0 && agentCfg.reasoningDefault !== null;
	const sessionReasoningExplicitlySet = statusEntry?.reasoningLevel !== void 0 && statusEntry.reasoningLevel !== null;
	if (!(params.senderIsOwner || params.isAuthorizedSender) && (sessionReasoningExplicitlySet || hasAgentReasoningDefault)) resolvedReasoningLevel = "off";
	if (!(sessionReasoningExplicitlySet || hasAgentReasoningDefault) && resolvedReasoningLevel === "off" && currentThinkLevel === "off") resolvedReasoningLevel = await modelState.resolveDefaultReasoningLevel();
	return await buildStatusReply({
		cfg: statusCfg,
		command: {
			surface: params.channel,
			channel: params.channel,
			ownerList: [],
			senderIsOwner: params.senderIsOwner,
			isAuthorizedSender: params.isAuthorizedSender,
			senderId: params.senderId,
			rawBodyNormalized: "/status",
			commandBodyNormalized: "/status"
		},
		sessionEntry: statusEntry,
		sessionKey: statusSessionKey,
		parentSessionKey: statusEntry?.parentSessionKey,
		sessionScope: statusCfg.session?.scope,
		storePath: statusLoaded.storePath,
		provider: selectedProvider,
		model: selectedModel,
		contextTokens: statusEntry?.contextTokens ?? 0,
		thinkingCatalog,
		resolvedThinkLevel: currentThinkLevel,
		resolvedFastMode: currentFastMode,
		resolvedVerboseLevel: currentVerboseLevel ?? "off",
		resolvedReasoningLevel,
		resolvedElevatedLevel: currentElevatedLevel,
		resolveDefaultThinkingLevel: () => modelState.resolveDefaultThinkingLevel(),
		isGroup: params.isGroup,
		defaultGroupActivation: params.defaultGroupActivation
	});
}
//#endregion
export { resolveDirectStatusReplyForSession };
