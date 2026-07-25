import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { d as resolveConfigDir } from "./utils-K2PjeLaV.js";
import { n as resolveEffectiveTtsConfig, o as normalizeTtsAutoMode } from "./tts-config-Cl3uWggE.js";
import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, x as selectApplicableRuntimeConfig } from "./runtime-snapshot-BW7iP5ad.js";
import "./runtime-config-snapshot-CbOz4rru.js";
import { n as normalizeSpeechProviderId } from "./provider-registry-core-CKNVXTz9.js";
import "./speech-settings-CeMKW0cY.js";
import "./string-coerce-runtime-DBMkn-gE.js";
import "./text-utility-runtime-Bs8FhB83.js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
//#region packages/speech-core/speaker.ts
function readString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
/** Populate canonical and legacy speaker voice fields together. */
function withSpeakerSelectionCompat(config) {
	const next = config ? { ...config } : {};
	const speakerVoice = readString(next.speakerVoice);
	const speakerVoiceId = readString(next.speakerVoiceId);
	const voice = readString(next.voice);
	const voiceName = readString(next.voiceName);
	const voiceId = readString(next.voiceId);
	const canonicalVoice = speakerVoice ?? voice ?? voiceName;
	const canonicalVoiceId = speakerVoiceId ?? voiceId;
	if (canonicalVoice) {
		next.speakerVoice = canonicalVoice;
		next.voice = canonicalVoice;
		next.voiceName = canonicalVoice;
	}
	if (canonicalVoiceId) {
		next.speakerVoiceId = canonicalVoiceId;
		next.voiceId = canonicalVoiceId;
	}
	return next;
}
/** Fill legacy speaker fields only when callers have not set them explicitly. */
function withSpeakerSelectionFallbackCompat(config) {
	const next = config ? { ...config } : {};
	const speakerVoice = readString(next.speakerVoice);
	const speakerVoiceId = readString(next.speakerVoiceId);
	if (speakerVoice) {
		next.voice ??= speakerVoice;
		next.voiceName ??= speakerVoice;
	}
	if (speakerVoiceId) next.voiceId ??= speakerVoiceId;
	return next;
}
//#endregion
//#region packages/speech-core/src/tts-settings.ts
const DEFAULT_TTS_TIMEOUT_MS = 3e4;
const DEFAULT_TTS_MAX_LENGTH = 1500;
const DEFAULT_TTS_SUMMARIZE = true;
const DEFAULT_MAX_TEXT_LENGTH = 4096;
function resolveConfiguredTtsAutoMode(raw) {
	return normalizeTtsAutoMode(raw.auto) ?? (raw.enabled ? "always" : "off");
}
function normalizeConfiguredSpeechProviderId(providerId) {
	const normalized = normalizeSpeechProviderId(providerId);
	if (!normalized) return;
	return normalized === "edge" ? "microsoft" : normalized;
}
function normalizeTtsPersonaId(personaId) {
	return normalizeOptionalLowercaseString(personaId ?? void 0);
}
function resolveTtsPrefsPathValue(prefsPath) {
	if (prefsPath?.trim()) return resolveUserPath(prefsPath.trim());
	const envPath = process.env.OPENCLAW_TTS_PREFS?.trim();
	if (envPath) return resolveUserPath(envPath);
	return path.join(resolveConfigDir(process.env), "settings", "tts.json");
}
function resolveModelOverridePolicy(overrides) {
	if (!(overrides?.enabled ?? true)) return {
		enabled: false,
		allowText: false,
		allowProvider: false,
		allowVoice: false,
		allowModelId: false,
		allowVoiceSettings: false,
		allowNormalization: false,
		allowSeed: false
	};
	const allow = (value, defaultValue = true) => value ?? defaultValue;
	return {
		enabled: true,
		allowText: allow(overrides?.allowText),
		allowProvider: allow(overrides?.allowProvider, false),
		allowVoice: allow(overrides?.allowVoice),
		allowModelId: allow(overrides?.allowModelId),
		allowVoiceSettings: allow(overrides?.allowVoiceSettings),
		allowNormalization: allow(overrides?.allowNormalization),
		allowSeed: allow(overrides?.allowSeed)
	};
}
function resolveTtsRuntimeConfig(cfg) {
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	}) ?? cfg;
}
function asProviderConfig(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? withSpeakerSelectionCompat(value) : {};
}
function asProviderConfigMap(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}
function hasOwnProperty(value, key) {
	return Object.hasOwn(value, key);
}
function normalizeProviderConfigMap(value) {
	const rawMap = asProviderConfigMap(value);
	if (Object.keys(rawMap).length === 0) return;
	const next = {};
	for (const [providerId, providerConfig] of Object.entries(rawMap)) {
		const normalized = normalizeConfiguredSpeechProviderId(providerId) ?? providerId;
		next[normalized] = asProviderConfig(providerConfig);
	}
	return next;
}
function collectTtsPersonas(raw) {
	const rawPersonas = asProviderConfigMap(raw.personas);
	const personas = {};
	for (const [id, value] of Object.entries(rawPersonas)) {
		const normalizedId = normalizeTtsPersonaId(id);
		if (!normalizedId || typeof value !== "object" || value === null || Array.isArray(value)) continue;
		const persona = value;
		personas[normalizedId] = {
			...persona,
			id: normalizedId,
			provider: normalizeConfiguredSpeechProviderId(persona.provider) ?? persona.provider,
			providers: normalizeProviderConfigMap(persona.providers)
		};
	}
	return personas;
}
function collectDirectProviderConfigEntries(raw) {
	const entries = {};
	const rawProviders = asProviderConfigMap(raw.providers);
	for (const [providerId, value] of Object.entries(rawProviders)) {
		const normalized = normalizeConfiguredSpeechProviderId(providerId) ?? providerId;
		entries[normalized] = asProviderConfig(value);
	}
	const reservedKeys = /* @__PURE__ */ new Set([
		"auto",
		"enabled",
		"maxTextLength",
		"mode",
		"modelOverrides",
		"persona",
		"personas",
		"prefsPath",
		"provider",
		"providers",
		"summaryModel",
		"timeoutMs"
	]);
	for (const [key, value] of Object.entries(raw)) {
		if (reservedKeys.has(key)) continue;
		if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
		const normalized = normalizeConfiguredSpeechProviderId(key) ?? key;
		entries[normalized] ??= asProviderConfig(value);
	}
	return entries;
}
function resolveTtsConfig(cfgInput, contextOrAgentId) {
	const cfg = resolveTtsRuntimeConfig(cfgInput);
	const raw = resolveEffectiveTtsConfig(cfg, contextOrAgentId);
	const providerSource = raw.provider ? "config" : "default";
	const timeoutMs = raw.timeoutMs ?? 3e4;
	const timeoutMsSource = raw.timeoutMs === void 0 ? "default" : "config";
	return {
		auto: resolveConfiguredTtsAutoMode(raw),
		mode: raw.mode ?? "final",
		provider: normalizeConfiguredSpeechProviderId(raw.provider) ?? (providerSource === "config" ? normalizeOptionalLowercaseString(raw.provider) ?? "" : ""),
		providerSource,
		persona: normalizeTtsPersonaId(raw.persona),
		personas: collectTtsPersonas(raw),
		summaryModel: normalizeOptionalString(raw.summaryModel),
		modelOverrides: resolveModelOverridePolicy(raw.modelOverrides),
		providerConfigs: collectDirectProviderConfigEntries(raw),
		prefsPath: raw.prefsPath,
		maxTextLength: raw.maxTextLength ?? DEFAULT_MAX_TEXT_LENGTH,
		timeoutMs,
		timeoutMsSource,
		rawConfig: raw,
		sourceConfig: cfg
	};
}
function resolveTtsPrefsPath(config) {
	return resolveTtsPrefsPathValue(config.prefsPath);
}
function readTtsPrefs(prefsPath) {
	try {
		if (!existsSync(prefsPath)) return {};
		const parsed = JSON.parse(readFileSync(prefsPath, "utf8"));
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function resolveTtsAutoModeFromPrefs(prefs) {
	const auto = normalizeTtsAutoMode(prefs.tts?.auto);
	if (auto) return auto;
	if (typeof prefs.tts?.enabled === "boolean") return prefs.tts.enabled ? "always" : "off";
}
function resolveTtsAutoMode(params) {
	const sessionAuto = normalizeTtsAutoMode(params.sessionAuto);
	if (sessionAuto) return sessionAuto;
	return resolveTtsAutoModeFromPrefs(readTtsPrefs(params.prefsPath)) ?? params.config.auto;
}
function resolveTtsPersonaIdFromPrefs(config, prefs) {
	if (prefs.tts && hasOwnProperty(prefs.tts, "persona")) return normalizeTtsPersonaId(prefs.tts.persona);
	return normalizeTtsPersonaId(config.persona);
}
function resolveTtsPersonaFromPrefs(config, prefs) {
	const personaId = resolveTtsPersonaIdFromPrefs(config, prefs);
	return personaId ? config.personas[personaId] : void 0;
}
function resolveTtsSettingsSnapshot(params) {
	const config = resolveTtsConfig(params.cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = resolveTtsPrefsPath(config);
	const prefs = readTtsPrefs(prefsPath);
	const personaId = resolveTtsPersonaIdFromPrefs(config, prefs);
	const persona = personaId ? config.personas[personaId] : void 0;
	const preferredProvider = normalizeConfiguredSpeechProviderId(prefs.tts?.provider) ?? normalizeConfiguredSpeechProviderId(persona?.provider) ?? (config.providerSource === "config" ? normalizeConfiguredSpeechProviderId(config.provider) ?? config.provider : void 0);
	return {
		autoMode: normalizeTtsAutoMode(params.sessionAuto) ?? resolveTtsAutoModeFromPrefs(prefs) ?? config.auto,
		config,
		maxLength: prefs.tts?.maxLength ?? DEFAULT_TTS_MAX_LENGTH,
		...persona ? { persona } : {},
		...personaId ? { personaId } : {},
		...preferredProvider ? { preferredProvider } : {},
		prefsPath,
		summarize: prefs.tts?.summarize ?? DEFAULT_TTS_SUMMARIZE
	};
}
function buildTtsSystemPromptHint(cfg, agentId) {
	const settings = resolveTtsSettingsSnapshot({
		cfg,
		agentId
	});
	if (settings.autoMode === "off") return;
	return [
		"Voice (TTS) is enabled.",
		settings.autoMode === "inbound" ? "Only use TTS when the user's last message includes audio/voice." : settings.autoMode === "tagged" ? "Only use TTS when you include [[tts:key=value]] directives or a [[tts:text]]...[[/tts:text]] block." : void 0,
		settings.persona ? `Active TTS persona: ${settings.persona.label ?? settings.persona.id}${settings.persona.description ? ` - ${settings.persona.description}` : ""}.` : void 0,
		`Keep spoken text ≤${settings.maxLength} chars to avoid auto-summary (summary ${settings.summarize ? "on" : "off"}).`,
		"If workspace context (especially MEMORY.md) tells you not to use [[tts:...]] or to use a local/non-tagged voice workflow, follow that workspace instruction instead.",
		"Use [[tts:...]] and optional [[tts:text]]...[[/tts:text]] to control voice/expressiveness."
	].filter(Boolean).join("\n");
}
function isTtsEnabled(config, prefsPath, sessionAuto) {
	return resolveTtsAutoMode({
		config,
		prefsPath,
		sessionAuto
	}) !== "off";
}
function getTtsPersona(config, prefsPath) {
	return resolveTtsPersonaFromPrefs(config, readTtsPrefs(prefsPath));
}
function listTtsPersonas(config) {
	return Object.values(config.personas).toSorted((left, right) => left.id.localeCompare(right.id));
}
function getTtsMaxLength(prefsPath) {
	return readTtsPrefs(prefsPath).tts?.maxLength ?? DEFAULT_TTS_MAX_LENGTH;
}
function isSummarizationEnabled(prefsPath) {
	return readTtsPrefs(prefsPath).tts?.summarize ?? DEFAULT_TTS_SUMMARIZE;
}
//#endregion
export { withSpeakerSelectionFallbackCompat as S, resolveTtsPersonaFromPrefs as _, getTtsMaxLength as a, resolveTtsSettingsSnapshot as b, isSummarizationEnabled as c, normalizeConfiguredSpeechProviderId as d, normalizeTtsPersonaId as f, resolveTtsConfig as g, resolveTtsAutoMode as h, buildTtsSystemPromptHint as i, isTtsEnabled as l, resolveModelOverridePolicy as m, asProviderConfig as n, getTtsPersona as o, readTtsPrefs as p, asProviderConfigMap as r, hasOwnProperty as s, DEFAULT_TTS_TIMEOUT_MS as t, listTtsPersonas as u, resolveTtsPrefsPath as v, withSpeakerSelectionCompat as x, resolveTtsRuntimeConfig as y };
