import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { f as clampTimerTimeoutMs } from "./number-coercion-Crk_c9KW.js";
import { c as redactSensitiveText } from "./redact-DNq_HeDt.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as isVerbose } from "./global-state-BCtvHc7P.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { n as tempWorkspaceSync } from "./private-temp-workspace-HLulDJ5y.js";
import { n as privateFileStoreSync } from "./private-file-store-BR9m_0ne.js";
import { r as logVerbose } from "./globals-DBBT7Ru5.js";
import { t as mergeDeep } from "./deep-merge-C9bNFIT3.js";
import { _ as voiceProviderSupportsModel, g as resolveVoiceProviderCandidates, h as resolveVoiceModelRefs, m as resolveSupportedVoiceModelRefs, p as resolvePrimaryVoiceProviderCandidate } from "./registry-BSBtFA2q.js";
import { f as markReplyPayloadAsTtsSupplement } from "./reply-payload-BtIUrr9c.js";
import { n as transcodeAudioBuffer } from "./media-services-YHqWbhOq.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-CPcXnHho.js";
import { n as normalizeSpeechProviderId } from "./provider-registry-core-CKNVXTz9.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import { _ as resolveTtsPersonaFromPrefs, a as getTtsMaxLength, b as resolveTtsSettingsSnapshot, c as isSummarizationEnabled, d as normalizeConfiguredSpeechProviderId, f as normalizeTtsPersonaId, g as resolveTtsConfig, m as resolveModelOverridePolicy, n as asProviderConfig, o as getTtsPersona, p as readTtsPrefs, r as asProviderConfigMap, s as hasOwnProperty, v as resolveTtsPrefsPath, x as withSpeakerSelectionCompat, y as resolveTtsRuntimeConfig } from "./tts-settings-Cunm4eSy.js";
import "./security-runtime-B_Vsvs-F.js";
import { o as scheduleCleanup } from "./tts-provider-helpers-CJMO42yE.js";
import { n as summarizeText } from "./speech-core-C3kNeFmT.js";
import { i as getSpeechProvider, n as parseTtsDirectives, o as listSpeechProviders, r as canonicalizeSpeechProviderId } from "./directives-DPx_aiSw.js";
import { t as resolveChannelTtsVoiceDelivery } from "./channel-targets-BzJs4Ox_.js";
import "./error-runtime-DUxkdoW4.js";
import "./logging-core-DZYwpRgj.js";
import "./media-runtime-BF28IqU8.js";
import "./number-runtime-C6TGSEc_.js";
import "./plugin-config-runtime-Dnur9SGp.js";
import "./runtime-env-BDC_axp1.js";
import "./sandbox-Da_vbfE8.js";
import { n as stripMarkdown } from "./chunk-items-Bwws2oGs.js";
import "./text-chunking-CcRmx-1w.js";
import path from "node:path";
//#region packages/speech-core/src/runtime-availability.ts
/** Host-owned availability guard shared by every speech-core entrypoint. */
let assertRuntimeAvailable;
/** Installs the process-lifecycle availability guard owned by the OpenClaw host. */
function setSpeechRuntimeAvailabilityGuard(guard) {
	assertRuntimeAvailable = guard;
}
/** Throws the host's typed unavailable error when speech is configured cold. */
function assertSpeechRuntimeAvailable() {
	assertRuntimeAvailable?.();
}
/** Returns false only when the installed host guard rejects speech execution. */
function isSpeechRuntimeAvailable() {
	try {
		assertSpeechRuntimeAvailable();
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region packages/speech-core/src/tts-settings-writes.ts
function updateTtsPrefs(prefsPath, update) {
	const prefs = readTtsPrefs(prefsPath);
	update(prefs);
	privateFileStoreSync(path.dirname(prefsPath)).writeText(path.basename(prefsPath), JSON.stringify(prefs, null, 2));
}
function setTtsAutoMode(prefsPath, mode) {
	updateTtsPrefs(prefsPath, (prefs) => {
		const next = { ...prefs.tts };
		delete next.enabled;
		next.auto = mode;
		prefs.tts = next;
	});
}
function setTtsEnabled(prefsPath, enabled) {
	setTtsAutoMode(prefsPath, enabled ? "always" : "off");
}
function setTtsPersona(prefsPath, persona) {
	updateTtsPrefs(prefsPath, (prefs) => {
		const next = { ...prefs.tts };
		next.persona = normalizeTtsPersonaId(persona) ?? null;
		prefs.tts = next;
	});
}
function setTtsProvider(prefsPath, provider) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			provider: canonicalizeSpeechProviderId(provider) ?? provider
		};
	});
}
function setTtsMaxLength(prefsPath, maxLength) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			maxLength
		};
	});
}
function setSummarizationEnabled(prefsPath, enabled) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			summarize: enabled
		};
	});
}
//#endregion
//#region packages/speech-core/src/speech-text.ts
const CODE_HEAVY_SPOKEN_FALLBACK = "I've put the detailed response on screen.";
const CODE_HEAVY_FENCED_CHAR_RATIO = .5;
function unwrapFenceContainer(line) {
	let content = line;
	let blockquoteDepth = 0;
	while (true) {
		const match = /^(?: {0,3}>[ \t]?)/u.exec(content);
		if (!match) break;
		content = content.slice(match[0].length);
		blockquoteDepth += 1;
	}
	const indentation = /^ +/u.exec(content)?.[0].length ?? 0;
	const listIndent = indentation > 3 && indentation <= 8 ? indentation : 0;
	if (listIndent > 0) content = content.slice(listIndent);
	return {
		content,
		container: {
			blockquoteDepth,
			listIndent
		}
	};
}
function parseFenceOpener(line) {
	const { content, container } = unwrapFenceContainer(line);
	const fence = /^(?: {0,3})(`{3,}|~{3,})/u.exec(content)?.[1];
	if (!fence) return;
	const marker = fence[0];
	if (marker !== "`" && marker !== "~") return;
	return {
		marker,
		length: fence.length,
		...container
	};
}
function isFenceCloser(line, opener) {
	const { content, container } = unwrapFenceContainer(line);
	if (container.blockquoteDepth !== opener.blockquoteDepth || container.listIndent !== opener.listIndent) return false;
	const fence = /^(?: {0,3})(`+|~+)([ \t]*)$/u.exec(content)?.[1];
	return fence !== void 0 && fence[0] === opener.marker && fence.length >= opener.length;
}
function unwrapFenceBodyLine(line, opener) {
	let content = line;
	for (let index = 0; index < opener.blockquoteDepth; index += 1) {
		const match = /^(?: {0,3}>[ \t]?)/u.exec(content);
		if (!match) return line;
		content = content.slice(match[0].length);
	}
	if (opener.listIndent > 0 && content.startsWith(" ".repeat(opener.listIndent))) return content.slice(opener.listIndent);
	return content;
}
function countFencedCodeChars(text) {
	const lines = text.split(/\r?\n/u);
	let fencedCodeChars = 0;
	let opener;
	let bodyLines = [];
	for (const line of lines) {
		if (!opener) {
			opener = parseFenceOpener(line);
			continue;
		}
		if (isFenceCloser(line, opener)) {
			fencedCodeChars += bodyLines.join("\n").length;
			opener = void 0;
			bodyLines = [];
			continue;
		}
		bodyLines.push(unwrapFenceBodyLine(line, opener));
	}
	if (opener) fencedCodeChars += bodyLines.join("\n").length;
	return fencedCodeChars;
}
function isCodeHeavySpeechText(text) {
	const trimmed = text.trim();
	if (!trimmed) return false;
	return countFencedCodeChars(trimmed) / trimmed.length >= CODE_HEAVY_FENCED_CHAR_RATIO;
}
function normalizeSpeechText(text) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	return stripMarkdown(trimmed, {
		linkStyle: "label",
		mode: "speech"
	}).trim();
}
//#endregion
//#region packages/speech-core/src/tts.ts
function resolvePositiveTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? clampTimerTimeoutMs(timeoutMs) : void 0;
}
function resolveSpeechProviderTimeoutMs(params) {
	if (params.timeoutMs !== void 0) return resolvePositiveTimeoutMs(params.timeoutMs) ?? params.config.timeoutMs;
	if (params.config.timeoutMsSource !== "default") return resolvePositiveTimeoutMs(params.config.timeoutMs) ?? 3e4;
	return resolvePositiveTimeoutMs(params.provider.defaultTimeoutMs) ?? params.config.timeoutMs;
}
let lastTtsAttempt;
function resolveConfiguredSpeechVoiceModelRefs(cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	return resolveSupportedVoiceModelRefs({
		config: effectiveCfg?.agents?.defaults?.voiceModel,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg)
	});
}
function resolveConfiguredSpeechVoiceModelForProvider(params) {
	const provider = params.provider ?? getSpeechProvider(params.providerId, params.cfg);
	if (params.voiceModel) return voiceProviderSupportsModel(provider, params.voiceModel.model) ? params.voiceModel : void 0;
	return resolveSupportedVoiceModelRefs({
		config: params.cfg?.agents?.defaults?.voiceModel,
		providers: provider ? [provider] : [],
		providerId: params.providerId
	})[0];
}
function applyVoiceModelToSpeechProviderConfig(params) {
	const voiceModel = resolveConfiguredSpeechVoiceModelForProvider({
		cfg: params.cfg,
		providerId: params.providerId,
		provider: params.provider,
		voiceModel: params.voiceModel
	});
	if (!voiceModel) return params.providerConfig;
	if (normalizeOptionalString(params.providerConfig.model) || normalizeOptionalString(params.providerConfig.modelId)) return params.providerConfig;
	return {
		...params.providerConfig,
		model: voiceModel.model,
		modelId: voiceModel.model
	};
}
function sortSpeechProvidersForAutoSelection(cfg) {
	return listSpeechProviders(cfg).toSorted((left, right) => {
		const leftOrder = left.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
		if (leftOrder !== rightOrder) return leftOrder - rightOrder;
		return left.id.localeCompare(right.id);
	});
}
function resolvePersonaProviderConfig(persona, providerId) {
	if (!persona?.providers) return;
	const normalized = normalizeConfiguredSpeechProviderId(providerId) ?? providerId;
	if (hasOwnProperty(persona.providers, normalized)) return persona.providers[normalized];
	if (hasOwnProperty(persona.providers, providerId)) return persona.providers[providerId];
}
function mergeProviderConfigWithPersona(params) {
	if (!params.persona) return {
		providerConfig: params.providerConfig,
		personaBinding: "none"
	};
	const personaProviderConfig = resolvePersonaProviderConfig(params.persona, params.providerId);
	if (!personaProviderConfig) return {
		providerConfig: params.providerConfig,
		personaBinding: "missing"
	};
	return {
		providerConfig: {
			...params.providerConfig,
			...personaProviderConfig
		},
		personaProviderConfig,
		personaBinding: "applied"
	};
}
function resolveRawProviderConfig(raw, providerId) {
	if (!raw) return {};
	return withSpeakerSelectionCompat(asProviderConfig(asProviderConfigMap(raw.providers)[providerId] ?? raw[providerId]));
}
function resolveLazyProviderConfig(config, providerId, cfg, voiceModel) {
	const canonical = normalizeConfiguredSpeechProviderId(providerId) ?? normalizeLowercaseStringOrEmpty(providerId);
	const existing = voiceModel ? void 0 : config.providerConfigs[canonical];
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : config.sourceConfig;
	if (existing && !effectiveCfg) return existing;
	const rawConfig = resolveRawProviderConfig(config.rawConfig, canonical);
	const rawBaseConfig = config.rawConfig;
	const rawProviders = asProviderConfigMap(config.rawConfig?.providers);
	const resolvedProvider = getSpeechProvider(canonical, effectiveCfg);
	let hasRawProviderConfig = Object.hasOwn(rawProviders, canonical) || (rawBaseConfig ? Object.hasOwn(rawBaseConfig, canonical) : false);
	let rawProviderConfig = rawProviders[canonical] ?? rawBaseConfig?.[canonical];
	if (!hasRawProviderConfig) for (const alias of resolvedProvider?.aliases ?? []) {
		const normalizedAlias = normalizeSpeechProviderId(alias);
		if (!normalizedAlias) continue;
		if (Object.hasOwn(rawProviders, normalizedAlias)) {
			hasRawProviderConfig = true;
			rawProviderConfig = rawProviders[normalizedAlias];
			break;
		}
		if (rawBaseConfig && Object.hasOwn(rawBaseConfig, normalizedAlias)) {
			hasRawProviderConfig = true;
			rawProviderConfig = rawBaseConfig[normalizedAlias];
			break;
		}
	}
	const compatRawProviderConfig = applyVoiceModelToSpeechProviderConfig({
		cfg: effectiveCfg,
		providerId: canonical,
		providerConfig: withSpeakerSelectionCompat(asProviderConfig(rawProviderConfig)),
		provider: resolvedProvider,
		voiceModel
	});
	const shouldInjectCanonicalProviderConfig = hasRawProviderConfig || Boolean(voiceModel) || Object.keys(rawProviders).length === 0;
	const rawConfigForProvider = {
		...rawBaseConfig,
		providers: shouldInjectCanonicalProviderConfig ? {
			...rawProviders,
			[canonical]: compatRawProviderConfig
		} : rawProviders,
		...shouldInjectCanonicalProviderConfig ? { [canonical]: compatRawProviderConfig } : {}
	};
	const next = withSpeakerSelectionCompat(effectiveCfg && resolvedProvider?.resolveConfig ? resolvedProvider.resolveConfig({
		cfg: effectiveCfg,
		rawConfig: rawConfigForProvider,
		timeoutMs: resolveSpeechProviderTimeoutMs({
			config,
			provider: resolvedProvider
		})
	}) : applyVoiceModelToSpeechProviderConfig({
		cfg: effectiveCfg,
		providerId: canonical,
		providerConfig: rawConfig,
		provider: resolvedProvider,
		voiceModel
	}));
	if (!voiceModel) config.providerConfigs[canonical] = next;
	return next;
}
function getResolvedSpeechProviderConfig(config, providerId, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : config.sourceConfig;
	return resolveLazyProviderConfig(config, canonicalizeSpeechProviderId(providerId, effectiveCfg) ?? normalizeConfiguredSpeechProviderId(providerId) ?? normalizeLowercaseStringOrEmpty(providerId), effectiveCfg);
}
function getResolvedSpeechProviderConfigForVoiceModel(params) {
	if (!params.voiceModel) return getResolvedSpeechProviderConfig(params.config, params.providerId, params.cfg);
	const effectiveCfg = resolveTtsRuntimeConfig(params.cfg);
	const canonical = canonicalizeSpeechProviderId(params.providerId, effectiveCfg) ?? normalizeConfiguredSpeechProviderId(params.providerId) ?? normalizeLowercaseStringOrEmpty(params.providerId);
	return resolveLazyProviderConfig(params.config, canonical, effectiveCfg, params.voiceModel);
}
function getTtsProvider(config, prefsPath) {
	const prefs = readTtsPrefs(prefsPath);
	const prefsProvider = canonicalizeSpeechProviderId(prefs.tts?.provider) ?? normalizeConfiguredSpeechProviderId(prefs.tts?.provider);
	if (prefsProvider) return prefsProvider;
	const activePersona = resolveTtsPersonaFromPrefs(config, prefs);
	const personaProvider = canonicalizeSpeechProviderId(activePersona?.provider, config.sourceConfig) ?? normalizeConfiguredSpeechProviderId(activePersona?.provider);
	if (personaProvider && getSpeechProvider(personaProvider, config.sourceConfig)) return personaProvider;
	if (config.providerSource === "config") return normalizeConfiguredSpeechProviderId(config.provider) ?? config.provider;
	const configuredVoiceProvider = resolveConfiguredSpeechVoiceModelRefs(config.sourceConfig)[0]?.provider;
	if (configuredVoiceProvider && getSpeechProvider(configuredVoiceProvider, config.sourceConfig)) return configuredVoiceProvider;
	const effectiveCfg = config.sourceConfig;
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg)) if (isTtsProviderConfigured(config, provider.id, effectiveCfg)) return provider.id;
	return config.provider;
}
/** Merge a surface TTS override and resolve its inline synthesis directives. */
function prepareTtsRequest(params) {
	const cfg = params.override ? {
		...params.cfg,
		messages: {
			...params.cfg.messages,
			tts: mergeDeep(params.cfg.messages?.tts ?? {}, params.override)
		}
	} : params.cfg;
	const config = resolveTtsConfig(cfg);
	return {
		cfg,
		directives: parseTtsDirectives(params.text, config.modelOverrides, {
			cfg,
			providerConfigs: config.providerConfigs,
			preferredProviderId: getTtsProvider(config, resolveTtsPrefsPath(config))
		})
	};
}
function resolveExplicitTtsOverrides(params) {
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const providerInput = params.provider?.trim();
	const modelId = params.modelId?.trim();
	const voiceId = params.voiceId?.trim();
	const config = resolveTtsConfig(cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = params.prefsPath ?? resolveTtsPrefsPath(config);
	const selectedProvider = canonicalizeSpeechProviderId(providerInput, cfg) ?? (modelId || voiceId ? getTtsProvider(config, prefsPath) : void 0);
	if (providerInput && !selectedProvider) throw new Error(`Unknown TTS provider "${providerInput}".`);
	if (!modelId && !voiceId) return selectedProvider ? { provider: selectedProvider } : {};
	if (!selectedProvider) throw new Error("TTS model or voice overrides require a resolved provider.");
	const provider = getSpeechProvider(selectedProvider, cfg);
	if (!provider) throw new Error(`speech provider ${selectedProvider} is not registered`);
	if (!provider.resolveTalkOverrides) throw new Error(`TTS provider "${selectedProvider}" does not support model or voice overrides.`);
	const providerOverrides = provider.resolveTalkOverrides({
		talkProviderConfig: {},
		params: {
			...voiceId ? { voiceId } : {},
			...modelId ? { modelId } : {}
		}
	});
	if ((voiceId || modelId) && (!providerOverrides || Object.keys(providerOverrides).length === 0)) throw new Error(`TTS provider "${selectedProvider}" ignored the requested model or voice overrides.`);
	const overridesRecord = providerOverrides;
	return {
		provider: selectedProvider,
		providerOverrides: { [provider.id]: overridesRecord }
	};
}
function getLastTtsAttempt() {
	return lastTtsAttempt;
}
function setLastTtsAttempt(entry) {
	lastTtsAttempt = entry;
}
function supportsNativeVoiceNoteTts(channel) {
	return resolveChannelTtsVoiceDelivery(channel) !== void 0;
}
function supportsTranscodedVoiceNoteTts(channel) {
	const delivery = resolveChannelTtsVoiceDelivery(channel);
	return delivery?.synthesisTarget === "voice-note" && delivery.transcodesAudio === true;
}
function resolveTtsSynthesisTarget(channel) {
	return resolveChannelTtsVoiceDelivery(channel)?.synthesisTarget ?? "audio-file";
}
function supportsAudioFileVoiceMemoOutput(params) {
	const formats = new Set(params.audioFileFormats?.map((format) => format.trim().toLowerCase()));
	if (formats.size === 0) return false;
	const extension = params.fileExtension?.trim().toLowerCase();
	if (extension && formats.has(extension.replace(/^\./, ""))) return true;
	const outputFormat = params.outputFormat?.trim().toLowerCase();
	return outputFormat ? formats.has(outputFormat) : false;
}
function shouldDeliverTtsAsVoice(params) {
	const delivery = resolveChannelTtsVoiceDelivery(params.channel);
	if (!delivery) return false;
	if (delivery.synthesisTarget === "audio-file") return params.target === "audio-file" && supportsAudioFileVoiceMemoOutput({
		fileExtension: params.fileExtension,
		outputFormat: params.outputFormat,
		audioFileFormats: delivery.audioFileFormats
	});
	if (params.target !== "voice-note") return false;
	return params.voiceCompatible === true || delivery.transcodesAudio === true;
}
function resolveTtsProviderOrder(primary, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	const normalizedPrimary = canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary;
	const ordered = /* @__PURE__ */ new Set([normalizedPrimary]);
	for (const ref of resolveVoiceModelRefs(effectiveCfg?.agents?.defaults?.voiceModel)) {
		const provider = canonicalizeSpeechProviderId(ref.provider, effectiveCfg) ?? ref.provider;
		if (provider !== normalizedPrimary) ordered.add(provider);
	}
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg)) {
		const normalized = provider.id;
		if (normalized !== normalizedPrimary) ordered.add(normalized);
	}
	return [...ordered];
}
function resolveTtsProviderCandidates(primary, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	return resolveVoiceProviderCandidates({
		primaryProvider: canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg),
		voiceModelConfig: effectiveCfg?.agents?.defaults?.voiceModel
	});
}
function resolvePrimaryTtsProviderCandidate(primary, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	return resolvePrimaryVoiceProviderCandidate({
		primaryProvider: canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg),
		voiceModelConfig: effectiveCfg?.agents?.defaults?.voiceModel
	});
}
function isTtsProviderConfigured(config, provider, cfg) {
	try {
		const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : config.sourceConfig;
		const resolvedProvider = getSpeechProvider(provider, effectiveCfg);
		if (!resolvedProvider) return false;
		return resolvedProvider.isConfigured({
			cfg: effectiveCfg,
			providerConfig: getResolvedSpeechProviderConfig(config, resolvedProvider.id, effectiveCfg),
			timeoutMs: resolveSpeechProviderTimeoutMs({
				config,
				provider: resolvedProvider
			})
		}) ?? false;
	} catch {
		return false;
	}
}
function formatTtsProviderError(provider, err) {
	const error = err instanceof Error ? err : new Error(String(err));
	if (error.name === "AbortError") return `${provider}: request timed out`;
	return `${provider}: ${redactSensitiveText(error.message)}`;
}
function sanitizeTtsErrorForLog(err) {
	return redactSensitiveText(formatErrorMessage(err)).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
function buildTtsFailureResult(errors, attemptedProviders, attempts, persona) {
	return {
		success: false,
		error: `TTS conversion failed: ${errors.join("; ") || "no providers available"}`,
		attemptedProviders,
		attempts,
		persona
	};
}
function resolveReadySpeechProvider(params) {
	const resolvedProvider = getSpeechProvider(params.provider, params.cfg);
	if (!resolvedProvider) return {
		kind: "skip",
		reasonCode: "no_provider_registered",
		message: `${params.provider}: no provider registered`
	};
	const merged = mergeProviderConfigWithPersona({
		providerConfig: getResolvedSpeechProviderConfigForVoiceModel({
			config: params.config,
			providerId: resolvedProvider.id,
			cfg: params.cfg,
			voiceModel: params.voiceModel
		}),
		persona: params.persona,
		providerId: resolvedProvider.id
	});
	if (params.persona?.fallbackPolicy === "fail" && merged.personaBinding === "missing") return {
		kind: "skip",
		reasonCode: "not_configured",
		message: `${params.provider}: persona ${params.persona.id} has no provider binding`,
		personaBinding: "missing"
	};
	if (!resolvedProvider.isConfigured({
		cfg: params.cfg,
		providerConfig: merged.providerConfig,
		timeoutMs: resolveSpeechProviderTimeoutMs({
			config: params.config,
			provider: resolvedProvider
		})
	})) return {
		kind: "skip",
		reasonCode: "not_configured",
		message: `${params.provider}: not configured`
	};
	if (params.requireTelephony && !resolvedProvider.synthesizeTelephony) return {
		kind: "skip",
		reasonCode: "unsupported_for_telephony",
		message: `${params.provider}: unsupported for telephony`
	};
	return {
		kind: "ready",
		provider: resolvedProvider,
		providerConfig: merged.providerConfig,
		personaProviderConfig: merged.personaProviderConfig,
		synthesisPersona: params.persona?.fallbackPolicy === "provider-defaults" && merged.personaBinding === "missing" ? void 0 : params.persona,
		personaBinding: merged.personaBinding
	};
}
async function prepareSpeechSynthesis(params) {
	if (!params.provider.prepareSynthesis) return {
		text: params.text,
		providerConfig: params.providerConfig,
		providerOverrides: params.providerOverrides
	};
	const prepared = await params.provider.prepareSynthesis({
		text: params.text,
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		providerOverrides: params.providerOverrides,
		persona: params.persona,
		personaProviderConfig: params.personaProviderConfig,
		target: params.target,
		timeoutMs: params.timeoutMs
	});
	return {
		text: prepared?.text ?? params.text,
		providerConfig: prepared?.providerConfig ? {
			...params.providerConfig,
			...prepared.providerConfig
		} : params.providerConfig,
		providerOverrides: prepared?.providerOverrides ? {
			...params.providerOverrides,
			...prepared.providerOverrides
		} : params.providerOverrides
	};
}
function resolveTtsRequestSetup(params) {
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const config = resolveTtsConfig(cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = params.prefsPath ?? resolveTtsPrefsPath(config);
	if (params.text.length > config.maxTextLength) return { error: `Text too long (${params.text.length} chars, max ${config.maxTextLength})` };
	const userProvider = getTtsProvider(config, prefsPath);
	const provider = canonicalizeSpeechProviderId(params.providerOverride, cfg) ?? userProvider;
	return {
		cfg,
		config,
		persona: getTtsPersona(config, prefsPath),
		providers: params.disableFallback ? [resolvePrimaryTtsProviderCandidate(provider, cfg)] : resolveTtsProviderCandidates(provider, cfg)
	};
}
function readTtsResultString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function resolveTtsResultModel(providerConfig, providerOverrides) {
	return readTtsResultString(providerOverrides?.modelId) ?? readTtsResultString(providerOverrides?.model) ?? readTtsResultString(providerConfig.modelId) ?? readTtsResultString(providerConfig.model);
}
function resolveTtsResultVoice(providerConfig, providerOverrides) {
	return readTtsResultString(providerOverrides?.speakerVoiceId) ?? readTtsResultString(providerOverrides?.speakerVoice) ?? readTtsResultString(providerOverrides?.voiceId) ?? readTtsResultString(providerOverrides?.voiceName) ?? readTtsResultString(providerOverrides?.voice) ?? readTtsResultString(providerConfig.speakerVoiceId) ?? readTtsResultString(providerConfig.speakerVoice) ?? readTtsResultString(providerConfig.voiceId) ?? readTtsResultString(providerConfig.voiceName) ?? readTtsResultString(providerConfig.voice);
}
async function textToSpeech(params) {
	const synthesis = await synthesizeSpeech(params);
	if (!synthesis.success || !synthesis.audioBuffer || !synthesis.fileExtension) return {
		success: false,
		error: synthesis.error ?? "TTS conversion failed",
		persona: synthesis.persona,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts
	};
	let audioBuffer = synthesis.audioBuffer;
	let fileExtension = synthesis.fileExtension;
	let outputFormat = synthesis.outputFormat;
	const transcoded = await maybePreTranscodeForVoiceDelivery({
		channel: params.channel,
		target: synthesis.target,
		audioBuffer,
		fileExtension,
		outputFormat
	});
	if (transcoded) {
		audioBuffer = transcoded.audioBuffer;
		fileExtension = transcoded.fileExtension;
		outputFormat = transcoded.outputFormat;
	}
	const temp = tempWorkspaceSync({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "tts-"
	});
	const audioPath = temp.write(`voice-${Date.now()}${fileExtension}`, audioBuffer);
	scheduleCleanup(temp.dir);
	return {
		success: true,
		audioPath,
		latencyMs: synthesis.latencyMs,
		provider: synthesis.provider,
		persona: synthesis.persona,
		fallbackFrom: synthesis.fallbackFrom,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts,
		outputFormat,
		voiceCompatible: synthesis.voiceCompatible,
		audioAsVoice: shouldDeliverTtsAsVoice({
			channel: params.channel,
			target: synthesis.target,
			voiceCompatible: synthesis.voiceCompatible,
			fileExtension,
			outputFormat
		}),
		target: synthesis.target
	};
}
async function maybePreTranscodeForVoiceDelivery(params) {
	if (params.target !== "audio-file") return;
	const preferred = resolveChannelTtsVoiceDelivery(params.channel)?.preferAudioFileFormat?.trim().toLowerCase();
	if (!preferred) return;
	const sourceExt = params.fileExtension.trim().toLowerCase().replace(/^\./, "");
	if (sourceExt === preferred) return;
	const outcome = await transcodeAudioBuffer({
		audioBuffer: params.audioBuffer,
		sourceExtension: sourceExt,
		targetExtension: preferred
	});
	if (!outcome.ok) {
		if (outcome.reason === "transcoder-failed") logVerbose(`TTS: pre-transcode ${sourceExt}->${preferred} for channel=${params.channel ?? "?"} failed: ${outcome.detail ?? "unknown"}`);
		return;
	}
	return {
		audioBuffer: outcome.buffer,
		fileExtension: `.${preferred}`,
		outputFormat: preferred
	};
}
async function synthesizeSpeech(params) {
	assertSpeechRuntimeAvailable();
	const setup = resolveTtsRequestSetup({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider,
		disableFallback: params.disableFallback,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if ("error" in setup) return {
		success: false,
		error: setup.error
	};
	const { cfg, config, persona, providers } = setup;
	const textForSynthesis = normalizeSpeechText(params.text);
	const target = resolveTtsSynthesisTarget(params.channel);
	const errors = [];
	const attemptedProviders = [];
	const attempts = [];
	const primaryProvider = providers[0]?.provider;
	logVerbose(`TTS: starting with provider ${primaryProvider}, fallbacks: ${providers.slice(1).map((entry) => entry.provider).join(", ") || "none"}`);
	for (const { provider, voiceModel } of providers) {
		attemptedProviders.push(provider);
		const providerStart = Date.now();
		try {
			const resolvedProvider = resolveReadySpeechProvider({
				provider,
				cfg,
				config,
				persona,
				voiceModel
			});
			if (resolvedProvider.kind === "skip") {
				errors.push(resolvedProvider.message);
				attempts.push({
					provider,
					outcome: "skipped",
					reasonCode: resolvedProvider.reasonCode,
					persona: persona?.id,
					...resolvedProvider.personaBinding ? { personaBinding: resolvedProvider.personaBinding } : {},
					error: resolvedProvider.message
				});
				logVerbose(`TTS: provider ${provider} skipped (${resolvedProvider.message})`);
				continue;
			}
			const timeoutMs = resolveSpeechProviderTimeoutMs({
				timeoutMs: params.timeoutMs ?? voiceModel?.timeoutMs,
				config,
				provider: resolvedProvider.provider
			});
			const prepared = await prepareSpeechSynthesis({
				provider: resolvedProvider.provider,
				text: textForSynthesis,
				cfg,
				providerConfig: resolvedProvider.providerConfig,
				providerOverrides: params.overrides?.providerOverrides?.[resolvedProvider.provider.id],
				persona: resolvedProvider.synthesisPersona,
				personaProviderConfig: resolvedProvider.personaProviderConfig,
				target,
				timeoutMs
			});
			const synthesis = await resolvedProvider.provider.synthesize({
				text: prepared.text,
				cfg,
				providerConfig: prepared.providerConfig,
				target,
				providerOverrides: prepared.providerOverrides,
				timeoutMs
			});
			const latencyMs = Date.now() - providerStart;
			attempts.push({
				provider,
				outcome: "success",
				reasonCode: "success",
				persona: persona?.id,
				personaBinding: resolvedProvider.personaBinding,
				latencyMs
			});
			return {
				success: true,
				audioBuffer: synthesis.audioBuffer,
				latencyMs,
				provider,
				providerModel: resolveTtsResultModel(prepared.providerConfig, prepared.providerOverrides),
				providerVoice: resolveTtsResultVoice(prepared.providerConfig, prepared.providerOverrides),
				persona: persona?.id,
				fallbackFrom: provider !== primaryProvider ? primaryProvider : void 0,
				attemptedProviders,
				attempts,
				outputFormat: synthesis.outputFormat,
				voiceCompatible: synthesis.voiceCompatible,
				fileExtension: synthesis.fileExtension,
				target
			};
		} catch (err) {
			const errorMsg = formatTtsProviderError(provider, err);
			const latencyMs = Date.now() - providerStart;
			errors.push(errorMsg);
			attempts.push({
				provider,
				outcome: "failed",
				reasonCode: err instanceof Error && err.name === "AbortError" ? "timeout" : "provider_error",
				latencyMs,
				persona: persona?.id,
				personaBinding: resolvePersonaProviderConfig(persona, provider) != null ? "applied" : persona ? "missing" : "none",
				error: errorMsg
			});
			const rawError = sanitizeTtsErrorForLog(err);
			if (provider === primaryProvider) logVerbose(`TTS: primary provider ${provider} failed (${rawError})${providers.length > 1 ? "; trying fallback providers." : "; no fallback providers configured."}`);
			else logVerbose(`TTS: ${provider} failed (${rawError}); trying next provider.`);
		}
	}
	return buildTtsFailureResult(errors, attemptedProviders, attempts, persona?.id);
}
async function streamSpeech(params) {
	assertSpeechRuntimeAvailable();
	const setup = resolveTtsRequestSetup({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider,
		disableFallback: params.disableFallback,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if ("error" in setup) return {
		success: false,
		error: setup.error
	};
	const { cfg, config, persona, providers } = setup;
	const target = resolveTtsSynthesisTarget(params.channel);
	const errors = [];
	const attemptedProviders = [];
	const attempts = [];
	const primaryProvider = providers[0]?.provider;
	logVerbose(`TTS stream: starting with provider ${primaryProvider}, fallbacks: ${providers.slice(1).map((entry) => entry.provider).join(", ") || "none"}`);
	for (const { provider, voiceModel } of providers) {
		attemptedProviders.push(provider);
		const providerStart = Date.now();
		try {
			const resolvedProvider = resolveReadySpeechProvider({
				provider,
				cfg,
				config,
				persona,
				voiceModel
			});
			if (resolvedProvider.kind === "skip") {
				errors.push(resolvedProvider.message);
				attempts.push({
					provider,
					outcome: "skipped",
					reasonCode: resolvedProvider.reasonCode,
					persona: persona?.id,
					...resolvedProvider.personaBinding ? { personaBinding: resolvedProvider.personaBinding } : {},
					error: resolvedProvider.message
				});
				logVerbose(`TTS stream: provider ${provider} skipped (${resolvedProvider.message})`);
				continue;
			}
			if (!resolvedProvider.provider.streamSynthesize) {
				const message = `${provider} does not support streaming TTS`;
				errors.push(message);
				attempts.push({
					provider,
					outcome: "skipped",
					reasonCode: "unsupported_for_streaming",
					persona: persona?.id,
					personaBinding: resolvedProvider.personaBinding,
					error: message
				});
				logVerbose(`TTS stream: provider ${provider} skipped (${message})`);
				continue;
			}
			const timeoutMs = resolveSpeechProviderTimeoutMs({
				timeoutMs: params.timeoutMs ?? voiceModel?.timeoutMs,
				config,
				provider: resolvedProvider.provider
			});
			const prepared = await prepareSpeechSynthesis({
				provider: resolvedProvider.provider,
				text: params.text,
				cfg,
				providerConfig: resolvedProvider.providerConfig,
				providerOverrides: params.overrides?.providerOverrides?.[resolvedProvider.provider.id],
				persona: resolvedProvider.synthesisPersona,
				personaProviderConfig: resolvedProvider.personaProviderConfig,
				target,
				timeoutMs
			});
			const synthesis = await resolvedProvider.provider.streamSynthesize({
				text: prepared.text,
				cfg,
				providerConfig: prepared.providerConfig,
				target,
				providerOverrides: prepared.providerOverrides,
				timeoutMs
			});
			const latencyMs = Date.now() - providerStart;
			attempts.push({
				provider,
				outcome: "success",
				reasonCode: "success",
				persona: persona?.id,
				personaBinding: resolvedProvider.personaBinding,
				latencyMs
			});
			return {
				success: true,
				audioStream: synthesis.audioStream,
				latencyMs,
				provider,
				providerModel: resolveTtsResultModel(prepared.providerConfig, prepared.providerOverrides),
				providerVoice: resolveTtsResultVoice(prepared.providerConfig, prepared.providerOverrides),
				persona: persona?.id,
				fallbackFrom: provider !== primaryProvider ? primaryProvider : void 0,
				attemptedProviders,
				attempts,
				outputFormat: synthesis.outputFormat,
				voiceCompatible: synthesis.voiceCompatible,
				fileExtension: synthesis.fileExtension,
				target,
				release: synthesis.release
			};
		} catch (err) {
			const errorMsg = formatTtsProviderError(provider, err);
			const latencyMs = Date.now() - providerStart;
			errors.push(errorMsg);
			attempts.push({
				provider,
				outcome: "failed",
				reasonCode: err instanceof Error && err.name === "AbortError" ? "timeout" : "provider_error",
				latencyMs,
				persona: persona?.id,
				personaBinding: resolvePersonaProviderConfig(persona, provider) != null ? "applied" : persona ? "missing" : "none",
				error: errorMsg
			});
			const rawError = sanitizeTtsErrorForLog(err);
			if (provider === primaryProvider) logVerbose(`TTS stream: primary provider ${provider} failed (${rawError})${providers.length > 1 ? "; trying fallback providers." : "; no fallback providers configured."}`);
			else logVerbose(`TTS stream: ${provider} failed (${rawError}); trying next provider.`);
		}
	}
	return buildTtsFailureResult(errors, attemptedProviders, attempts, persona?.id);
}
async function textToSpeechStream(params) {
	const synthesis = await streamSpeech(params);
	if (!synthesis.success || !synthesis.audioStream || !synthesis.fileExtension) return {
		success: false,
		error: synthesis.error ?? "Streaming TTS conversion failed",
		persona: synthesis.persona,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts
	};
	return synthesis;
}
async function textToSpeechTelephony(params) {
	assertSpeechRuntimeAvailable();
	const setup = resolveTtsRequestSetup({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider
	});
	if ("error" in setup) return {
		success: false,
		error: setup.error
	};
	const { cfg, config, persona, providers } = setup;
	const errors = [];
	const attemptedProviders = [];
	const attempts = [];
	const primaryProvider = providers[0]?.provider;
	logVerbose(`TTS telephony: starting with provider ${primaryProvider}, fallbacks: ${providers.slice(1).map((entry) => entry.provider).join(", ") || "none"}`);
	for (const { provider, voiceModel } of providers) {
		attemptedProviders.push(provider);
		const providerStart = Date.now();
		try {
			const resolvedProvider = resolveReadySpeechProvider({
				provider,
				cfg,
				config,
				persona,
				voiceModel,
				requireTelephony: true
			});
			if (resolvedProvider.kind === "skip") {
				errors.push(resolvedProvider.message);
				attempts.push({
					provider,
					outcome: "skipped",
					reasonCode: resolvedProvider.reasonCode,
					persona: persona?.id,
					...resolvedProvider.personaBinding ? { personaBinding: resolvedProvider.personaBinding } : {},
					error: resolvedProvider.message
				});
				logVerbose(`TTS telephony: provider ${provider} skipped (${resolvedProvider.message})`);
				continue;
			}
			const timeoutMs = resolveSpeechProviderTimeoutMs({
				timeoutMs: params.timeoutMs ?? voiceModel?.timeoutMs,
				config,
				provider: resolvedProvider.provider
			});
			const synthesizeTelephony = resolvedProvider.provider.synthesizeTelephony;
			const prepared = await prepareSpeechSynthesis({
				provider: resolvedProvider.provider,
				text: params.text,
				cfg,
				providerConfig: resolvedProvider.providerConfig,
				providerOverrides: params.overrides?.providerOverrides?.[resolvedProvider.provider.id],
				persona: resolvedProvider.synthesisPersona,
				personaProviderConfig: resolvedProvider.personaProviderConfig,
				target: "telephony",
				timeoutMs
			});
			const synthesis = await synthesizeTelephony({
				text: prepared.text,
				cfg,
				providerConfig: prepared.providerConfig,
				providerOverrides: prepared.providerOverrides,
				timeoutMs
			});
			const latencyMs = Date.now() - providerStart;
			attempts.push({
				provider,
				outcome: "success",
				reasonCode: "success",
				persona: persona?.id,
				personaBinding: resolvedProvider.personaBinding,
				latencyMs
			});
			return {
				success: true,
				audioBuffer: synthesis.audioBuffer,
				latencyMs,
				provider,
				providerModel: resolveTtsResultModel(prepared.providerConfig, prepared.providerOverrides),
				providerVoice: resolveTtsResultVoice(prepared.providerConfig, prepared.providerOverrides),
				persona: persona?.id,
				fallbackFrom: provider !== primaryProvider ? primaryProvider : void 0,
				attemptedProviders,
				attempts,
				outputFormat: synthesis.outputFormat,
				sampleRate: synthesis.sampleRate
			};
		} catch (err) {
			const errorMsg = formatTtsProviderError(provider, err);
			const latencyMs = Date.now() - providerStart;
			errors.push(errorMsg);
			attempts.push({
				provider,
				outcome: "failed",
				reasonCode: err instanceof Error && err.name === "AbortError" ? "timeout" : "provider_error",
				latencyMs,
				persona: persona?.id,
				personaBinding: resolvePersonaProviderConfig(persona, provider) != null ? "applied" : persona ? "missing" : "none",
				error: errorMsg
			});
			const rawError = sanitizeTtsErrorForLog(err);
			if (provider === primaryProvider) logVerbose(`TTS telephony: primary provider ${provider} failed (${rawError})${providers.length > 1 ? "; trying fallback providers." : "; no fallback providers configured."}`);
			else logVerbose(`TTS telephony: ${provider} failed (${rawError}); trying next provider.`);
		}
	}
	return buildTtsFailureResult(errors, attemptedProviders, attempts, persona?.id);
}
async function listSpeechVoices(params) {
	assertSpeechRuntimeAvailable();
	const cfg = params.cfg ? resolveTtsRuntimeConfig(params.cfg) : void 0;
	const provider = canonicalizeSpeechProviderId(params.provider, cfg);
	if (!provider) throw new Error("speech provider id is required");
	const config = params.config ?? (cfg ? resolveTtsConfig(cfg) : void 0);
	if (!config) throw new Error(`speech provider ${provider} requires cfg or resolved config`);
	const resolvedProvider = getSpeechProvider(provider, cfg);
	if (!resolvedProvider) throw new Error(`speech provider ${provider} is not registered`);
	if (!resolvedProvider.listVoices) throw new Error(`speech provider ${provider} does not support voice listing`);
	const timeoutMs = resolveSpeechProviderTimeoutMs({
		config,
		provider: resolvedProvider
	});
	return await resolvedProvider.listVoices({
		cfg,
		providerConfig: getResolvedSpeechProviderConfig(config, resolvedProvider.id, cfg),
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		timeoutMs
	});
}
function hasLegacyFinalMediaDirective(text) {
	return /(?:^|\n)\s*MEDIA\s*:/i.test(text);
}
async function maybeApplyTtsToPayload(params) {
	if (!isSpeechRuntimeAvailable()) return params.payload;
	if (params.payload.isCompactionNotice) return params.payload;
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const { autoMode, config, prefsPath } = resolveTtsSettingsSnapshot({
		cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if (autoMode === "off") return params.payload;
	const activeProvider = getTtsProvider(config, prefsPath);
	const reply = resolveSendableOutboundReplyParts(params.payload);
	const text = reply.text;
	const directives = parseTtsDirectives(text, config.modelOverrides, {
		cfg,
		providerConfigs: config.providerConfigs,
		preferredProviderId: activeProvider
	});
	if (directives.warnings.length > 0) logVerbose(`TTS: ignored directive overrides (${directives.warnings.join("; ")})`);
	if (isVerbose()) {
		const effectiveProvider = directives.overrides?.provider ? canonicalizeSpeechProviderId(directives.overrides.provider, cfg) ?? activeProvider : activeProvider;
		logVerbose(`TTS: auto mode enabled (${autoMode}), channel=${params.channel}, selected provider=${effectiveProvider}, config.provider=${config.provider}, config.providerSource=${config.providerSource}`);
	}
	const trimmedCleaned = directives.cleanedText.trim();
	const visibleText = trimmedCleaned.length > 0 ? trimmedCleaned : "";
	const explicitTtsText = directives.ttsText?.trim() || "";
	const ttsText = explicitTtsText || visibleText;
	const nextPayload = visibleText === text.trim() ? params.payload : {
		...params.payload,
		text: visibleText.length > 0 ? visibleText : void 0
	};
	if (autoMode === "tagged" && !directives.hasDirective) return nextPayload;
	if (autoMode === "inbound" && params.inboundAudio !== true) return nextPayload;
	if ((config.mode ?? "final") === "final" && params.kind && params.kind !== "final") return nextPayload;
	if (!ttsText.trim()) return nextPayload;
	if (reply.hasMedia || hasLegacyFinalMediaDirective(text)) return nextPayload;
	if (!explicitTtsText && ttsText.trim().length < 10) return nextPayload;
	const maxLength = getTtsMaxLength(prefsPath);
	let textForAudio = ttsText.trim();
	let wasSummarized = false;
	if (!explicitTtsText && isCodeHeavySpeechText(textForAudio)) return nextPayload;
	if (textForAudio.length > maxLength) if (!isSummarizationEnabled(prefsPath)) {
		logVerbose(`TTS: truncating long text (${textForAudio.length} > ${maxLength}), summarization disabled.`);
		textForAudio = `${truncateUtf16Safe(textForAudio, maxLength - 3)}...`;
	} else try {
		textForAudio = (await summarizeText({
			text: textForAudio,
			targetLength: maxLength,
			cfg,
			config,
			timeoutMs: config.timeoutMs
		})).summary;
		wasSummarized = true;
		if (textForAudio.length > config.maxTextLength) {
			logVerbose(`TTS: summary exceeded hard limit (${textForAudio.length} > ${config.maxTextLength}); truncating.`);
			textForAudio = `${truncateUtf16Safe(textForAudio, config.maxTextLength - 3)}...`;
		}
	} catch (err) {
		logVerbose(`TTS: summarization failed, truncating instead: ${err.message}`);
		textForAudio = `${truncateUtf16Safe(textForAudio, maxLength - 3)}...`;
	}
	const normalizedTextForAudio = normalizeSpeechText(textForAudio);
	if (!normalizedTextForAudio) return nextPayload;
	if (!explicitTtsText && normalizedTextForAudio.length < 10) return nextPayload;
	const ttsStart = Date.now();
	const result = await textToSpeech({
		text: textForAudio,
		cfg,
		prefsPath,
		channel: params.channel,
		overrides: directives.overrides,
		agentId: params.agentId,
		accountId: params.accountId
	});
	if (result.success && result.audioPath) {
		lastTtsAttempt = {
			timestamp: Date.now(),
			success: true,
			textLength: text.length,
			summarized: wasSummarized,
			provider: result.provider,
			persona: result.persona,
			fallbackFrom: result.fallbackFrom,
			attemptedProviders: result.attemptedProviders,
			attempts: result.attempts,
			latencyMs: result.latencyMs
		};
		const payloadWithAudio = {
			...nextPayload,
			mediaUrl: result.audioPath,
			audioAsVoice: result.audioAsVoice || params.payload.audioAsVoice,
			spokenText: textForAudio,
			trustedLocalMedia: true
		};
		return nextPayload.text?.trim() ? markReplyPayloadAsTtsSupplement(payloadWithAudio) : payloadWithAudio;
	}
	lastTtsAttempt = {
		timestamp: Date.now(),
		success: false,
		textLength: text.length,
		summarized: wasSummarized,
		persona: result.persona,
		attemptedProviders: result.attemptedProviders,
		attempts: result.attempts,
		error: result.error
	};
	logVerbose(`TTS: conversion failed after ${Date.now() - ttsStart}ms (${result.error ?? "unknown"}).`);
	return nextPayload;
}
const testApi = {
	parseTtsDirectives,
	resolveModelOverridePolicy,
	supportsNativeVoiceNoteTts,
	supportsTranscodedVoiceNoteTts,
	resolveTtsSynthesisTarget,
	shouldDeliverTtsAsVoice,
	summarizeText,
	getResolvedSpeechProviderConfig,
	formatTtsProviderError,
	sanitizeTtsErrorForLog
};
//#endregion
export { setTtsPersona as C, setTtsMaxLength as S, setSpeechRuntimeAvailabilityGuard as T, CODE_HEAVY_SPOKEN_FALLBACK as _, listSpeechVoices as a, setTtsAutoMode as b, resolveExplicitTtsOverrides as c, streamSpeech as d, synthesizeSpeech as f, textToSpeechTelephony as g, textToSpeechStream as h, isTtsProviderConfigured as i, resolveTtsProviderOrder as l, textToSpeech as m, getResolvedSpeechProviderConfig as n, maybeApplyTtsToPayload as o, testApi as p, getTtsProvider as r, prepareTtsRequest as s, getLastTtsAttempt as t, setLastTtsAttempt as u, isCodeHeavySpeechText as v, setTtsProvider as w, setTtsEnabled as x, setSummarizationEnabled as y };
