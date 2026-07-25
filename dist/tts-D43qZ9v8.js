import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { n as SecretSurfaceUnavailableError, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DTFzouyz.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { Ci as validateTtsSpeakParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { C as setTtsPersona, c as resolveExplicitTtsOverrides, f as synthesizeSpeech, i as isTtsProviderConfigured, l as resolveTtsProviderOrder, m as textToSpeech, r as getTtsProvider, w as setTtsProvider, x as setTtsEnabled } from "./runtime-api-IUluPrEw.js";
import { g as resolveTtsConfig, h as resolveTtsAutoMode, l as isTtsEnabled, o as getTtsPersona, u as listTtsPersonas, v as resolveTtsPrefsPath } from "./tts-settings-Cunm4eSy.js";
import { i as getSpeechProvider, o as listSpeechProviders, r as canonicalizeSpeechProviderId } from "./directives-DPx_aiSw.js";
import "./tts-CtDDp0V8.js";
import { t as formatForLog } from "./ws-log-Bj-6Do--.js";
import { t as inferSpeechMimeType } from "./speech-mime-DhqL3Zyq.js";
//#region src/gateway/server-methods/tts.ts
/** Gateway request handlers for TTS status, preference mutation, and synthesis. */
const ttsHandlers = {
	"tts.status": async ({ respond, context }) => {
		try {
			const cfg = context.getRuntimeConfig();
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			const provider = getTtsProvider(config, prefsPath);
			const persona = getTtsPersona(config, prefsPath);
			const autoMode = resolveTtsAutoMode({
				config,
				prefsPath
			});
			const fallbackProviders = resolveTtsProviderOrder(provider, cfg).slice(1).filter((candidate) => isTtsProviderConfigured(config, candidate, cfg));
			const providerStates = listSpeechProviders(cfg).map((candidate) => ({
				id: candidate.id,
				label: candidate.label,
				configured: isTtsProviderConfigured(config, candidate.id, cfg)
			}));
			respond(true, {
				enabled: isTtsEnabled(config, prefsPath),
				auto: autoMode,
				provider,
				persona: persona?.id ?? null,
				personas: listTtsPersonas(config).map((entry) => ({
					id: entry.id,
					label: entry.label,
					description: entry.description,
					provider: entry.provider
				})),
				fallbackProvider: fallbackProviders[0] ?? null,
				fallbackProviders,
				prefsPath,
				providerStates
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.enable": async ({ respond, context }) => {
		try {
			setTtsEnabled(resolveTtsPrefsPath(resolveTtsConfig(context.getRuntimeConfig())), true);
			respond(true, { enabled: true });
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.disable": async ({ respond, context }) => {
		try {
			setTtsEnabled(resolveTtsPrefsPath(resolveTtsConfig(context.getRuntimeConfig())), false);
			respond(true, { enabled: false });
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.convert": async ({ params, respond, context }) => {
		const text = normalizeOptionalString(params.text) ?? "";
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "tts.convert requires text"));
			return;
		}
		try {
			const cfg = context.getRuntimeConfig();
			const channel = normalizeOptionalString(params.channel);
			const providerRaw = normalizeOptionalString(params.provider);
			const modelId = normalizeOptionalString(params.modelId);
			const voiceId = normalizeOptionalString(params.voiceId);
			let overrides;
			try {
				overrides = resolveExplicitTtsOverrides({
					cfg,
					provider: providerRaw,
					modelId,
					voiceId
				});
			} catch (err) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
				return;
			}
			const result = await textToSpeech({
				text,
				cfg,
				channel,
				overrides,
				disableFallback: Boolean(overrides.provider || modelId || voiceId)
			});
			if (result.success && result.audioPath) {
				respond(true, {
					audioPath: result.audioPath,
					provider: result.provider,
					outputFormat: result.outputFormat,
					voiceCompatible: result.voiceCompatible
				});
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, result.error ?? "TTS conversion failed"));
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.speak": async ({ params, respond, context }) => {
		if (!validateTtsSpeakParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid tts.speak params: ${formatValidationErrors(validateTtsSpeakParams.errors)}`));
			return;
		}
		const text = normalizeOptionalString(params.text);
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "tts.speak requires text"));
			return;
		}
		try {
			const cfg = context.getRuntimeConfig();
			const maxTextLength = resolveTtsConfig(cfg).maxTextLength;
			if (text.length > maxTextLength) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `tts.speak text too long (${text.length} chars, max ${maxTextLength})`));
				return;
			}
			assertSecretOwnerAvailable("capability", "tts");
			const result = await synthesizeSpeech({
				text,
				cfg
			});
			const provider = normalizeOptionalString(result.provider);
			if (!result.success || !result.audioBuffer || result.audioBuffer.length === 0 || !provider) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, result.error ?? "TTS synthesis failed"));
				return;
			}
			respond(true, {
				audioBase64: result.audioBuffer.toString("base64"),
				provider,
				outputFormat: result.outputFormat,
				mimeType: inferSpeechMimeType(result.outputFormat, result.fileExtension),
				fileExtension: result.fileExtension
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err), err instanceof SecretSurfaceUnavailableError ? { details: {
				reason: err.code,
				ownerKind: err.ownerKind,
				ownerId: err.ownerId
			} } : void 0));
		}
	},
	"tts.setProvider": async ({ params, respond, context }) => {
		const cfg = context.getRuntimeConfig();
		const provider = canonicalizeSpeechProviderId(normalizeOptionalString(params.provider) ?? "", cfg);
		if (!provider || !getSpeechProvider(provider, cfg)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid provider. Use a registered TTS provider id."));
			return;
		}
		try {
			setTtsProvider(resolveTtsPrefsPath(resolveTtsConfig(cfg)), provider);
			respond(true, { provider });
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.personas": async ({ respond, context }) => {
		try {
			const config = resolveTtsConfig(context.getRuntimeConfig());
			respond(true, {
				active: getTtsPersona(config, resolveTtsPrefsPath(config))?.id ?? null,
				personas: listTtsPersonas(config).map((persona) => ({
					id: persona.id,
					label: persona.label,
					description: persona.description,
					provider: persona.provider,
					fallbackPolicy: persona.fallbackPolicy,
					providers: Object.keys(persona.providers ?? {})
				}))
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.setPersona": async ({ params, respond, context }) => {
		const cfg = context.getRuntimeConfig();
		const rawPersona = normalizeOptionalString(params.persona);
		try {
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			if (!rawPersona || [
				"off",
				"none",
				"default"
			].includes(rawPersona.toLowerCase())) {
				setTtsPersona(prefsPath, null);
				respond(true, { persona: null });
				return;
			}
			const persona = listTtsPersonas(config).find((entry) => entry.id === rawPersona.toLowerCase());
			if (!persona) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid persona. Use a configured TTS persona id."));
				return;
			}
			setTtsPersona(prefsPath, persona.id);
			respond(true, { persona: persona.id });
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"tts.providers": async ({ respond, context }) => {
		try {
			const cfg = context.getRuntimeConfig();
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			respond(true, {
				providers: listSpeechProviders(cfg).map((provider) => ({
					id: provider.id,
					name: provider.label,
					configured: isTtsProviderConfigured(config, provider.id, cfg),
					models: [...provider.models ?? []],
					voices: [...provider.voices ?? []]
				})),
				active: getTtsProvider(config, prefsPath)
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
};
//#endregion
export { ttsHandlers };
