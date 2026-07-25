import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-Crk_c9KW.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as formatErrorMessage$1 } from "./errors-DdbcjW1Y.js";
import "./utils-K2PjeLaV.js";
import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-S7z_Yn4H.js";
import { n as callGatewayFromCli } from "./gateway-rpc-BeSn3X6s.js";
import { n as getRealtimeTranscriptionProvider, r as listRealtimeTranscriptionProviders } from "./provider-registry-Cyk6R62G.js";
import { B as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, T as resolveRealtimeVoiceAgentConsultToolsAllow, V as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, c as resolveConfiguredRealtimeVoiceProvider, w as resolveRealtimeVoiceAgentConsultTools, y as buildRealtimeVoiceAgentConsultWorkingResponse } from "./session-log-runtime-GBoG4Ecc.js";
import { a as mulawToPcm, f as consultRealtimeVoiceAgent, i as convertPcmToMulaw8k, l as createRealtimeVoiceSessionHarness, n as createSpeechThresholdGate, r as readPcm16AudioStats, s as resamplePcm } from "./audio-energy-B9uVXLa_.js";
import { randomUUID } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/meeting-bot/realtime-audio-format.ts
function resolveMeetingRealtimeAudioFormat(audioFormat) {
	return audioFormat === "g711-ulaw-8khz" ? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ : REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ;
}
function convertMeetingBridgeAudioForStt(audio, audioFormat) {
	if (audioFormat === "g711-ulaw-8khz") return audio;
	return convertPcmToMulaw8k(audio, 24e3);
}
function convertMeetingTtsAudioForBridge(audio, sampleRate, audioFormat, outputFormat, platformName = "meeting platform") {
	const sourceFormat = sourceTelephonyTtsFormat(outputFormat, platformName);
	if (audioFormat === "g711-ulaw-8khz" && sourceFormat === "mulaw" && sampleRate === 8e3) return audio;
	const pcm = decodeMeetingTelephonyTtsAudio(audio, sourceFormat);
	return audioFormat === "g711-ulaw-8khz" ? convertPcmToMulaw8k(pcm, sampleRate) : resamplePcm(pcm, sampleRate, 24e3);
}
function sourceTelephonyTtsFormat(outputFormat, platformName) {
	const normalized = outputFormat?.trim().toLowerCase().replaceAll("_", "-") ?? "";
	if (!normalized || normalized === "pcm" || normalized.startsWith("pcm-") || normalized.includes("pcm16") || normalized.includes("16bit-mono-pcm")) return "pcm";
	if (normalized === "mulaw" || normalized === "ulaw" || normalized.includes("mu-law") || normalized.includes("mulaw") || normalized.includes("ulaw")) return "mulaw";
	if (normalized === "alaw" || normalized.includes("a-law") || normalized.includes("alaw")) return "alaw";
	throw new Error(`Unsupported telephony TTS output format for ${platformName}: ${outputFormat}`);
}
function decodeMeetingTelephonyTtsAudio(audio, sourceFormat) {
	switch (sourceFormat) {
		case "pcm": return audio;
		case "mulaw": return mulawToPcm(audio);
		case "alaw": return alawToPcm(audio);
	}
	return unsupportedMeetingTelephonyTtsFormat(sourceFormat);
}
function unsupportedMeetingTelephonyTtsFormat(_format) {
	throw new Error("Unsupported telephony TTS output format for meeting platform");
}
function alawToPcm(alaw) {
	const pcm = Buffer.alloc(alaw.length * 2);
	for (let index = 0; index < alaw.length; index += 1) pcm.writeInt16LE(alawByteToLinear(alaw[index] ?? 0), index * 2);
	return pcm;
}
function alawByteToLinear(value) {
	const aLaw = value ^ 85;
	const sign = aLaw & 128;
	const exponent = (aLaw & 112) >> 4;
	const mantissa = aLaw & 15;
	const sample = exponent === 0 ? (mantissa << 4) + 8 : (mantissa << 4) + 264 << exponent - 1;
	return sign ? sample : -sample;
}
const MEETING_OUTPUT_ECHO_SUPPRESSION_TAIL_MS = 3e3;
const MEETING_TRANSCRIPT_ECHO_LOOKBACK_MS = 45e3;
function meetingOutputBytesPerMs(audioFormat) {
	return audioFormat === "g711-ulaw-8khz" ? 8 : 48;
}
function resolveMeetingRealtimeProvider(params) {
	return resolveConfiguredRealtimeVoiceProvider({
		configuredProviderId: params.config.realtime.voiceProvider ?? params.config.realtime.provider,
		providerConfigs: params.config.realtime.providers,
		cfg: params.fullConfig,
		providers: params.providers,
		defaultModel: params.config.realtime.model,
		noRegisteredProviderMessage: "No configured realtime voice provider registered"
	});
}
function resolveMeetingRealtimeTranscriptionProvider(params) {
	const providers = params.providers ?? listRealtimeTranscriptionProviders(params.fullConfig);
	if (providers.length === 0) throw new Error("No configured realtime transcription provider registered");
	const providerId = params.config.realtime.transcriptionProvider ?? params.config.realtime.provider;
	const provider = (providerId ? params.providers?.find((entry) => entry.id === providerId || entry.aliases?.includes(providerId)) ?? getRealtimeTranscriptionProvider(providerId, params.fullConfig) : void 0) ?? providers[0];
	if (!provider) throw new Error("No configured realtime transcription provider registered");
	const rawConfig = providerId ? params.config.realtime.providers[providerId] ?? params.config.realtime.providers[provider.id] ?? {} : params.config.realtime.providers[provider.id] ?? {};
	const providerConfig = provider.resolveConfig ? provider.resolveConfig({
		cfg: params.fullConfig,
		rawConfig
	}) : rawConfig;
	if (!provider.isConfigured({
		cfg: params.fullConfig,
		providerConfig
	})) throw new Error(`Realtime transcription provider "${provider.id}" is not configured`);
	return {
		provider,
		providerConfig
	};
}
function buildMeetingSpeakExactUserMessage(text) {
	return ["Speak this exact OpenClaw answer to the meeting, without adding, removing, or rephrasing words.", `Answer: ${JSON.stringify(text)}`].join("\n");
}
function readLogString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function formatLogValue(value) {
	return (value ? truncateUtf16Safe(value.replace(/\s+/g, "_"), 180) : void 0) || "unknown";
}
function resolveProviderModelForLog(params) {
	return readLogString(params.providerConfig.model) ?? readLogString(params.providerConfig.modelId) ?? readLogString(params.fallbackModel) ?? readLogString(params.provider.defaultModel) ?? "provider-default";
}
function formatMeetingRealtimeVoiceModelLog(params) {
	return [
		`${params.logScope} realtime voice bridge starting: strategy=${formatLogValue(params.strategy)}`,
		`provider=${formatLogValue(params.provider.id)}`,
		`model=${formatLogValue(resolveProviderModelForLog({
			provider: params.provider,
			providerConfig: params.providerConfig,
			fallbackModel: params.fallbackModel
		}))}`,
		`audioFormat=${formatLogValue(params.audioFormat)}`
	].join(" ");
}
function formatMeetingAgentAudioModelLog(params) {
	return [
		`${params.logScope} agent audio bridge starting: transcriptionProvider=${formatLogValue(params.provider.id)}`,
		`transcriptionModel=${formatLogValue(resolveProviderModelForLog({
			provider: params.provider,
			providerConfig: params.providerConfig
		}))}`,
		"tts=telephony",
		`audioFormat=${formatLogValue(params.audioFormat)}`
	].join(" ");
}
function formatMeetingAgentTtsResultLog(logScope, prefix, result) {
	return [
		`${logScope} ${prefix} TTS: provider=${formatLogValue(result.provider)}`,
		`model=${formatLogValue(result.providerModel)}`,
		`voice=${formatLogValue(result.providerVoice)}`,
		`outputFormat=${formatLogValue(result.outputFormat)}`,
		`sampleRate=${result.sampleRate ?? "unknown"}`,
		...result.fallbackFrom ? [`fallbackFrom=${formatLogValue(result.fallbackFrom)}`] : []
	].join(" ");
}
function formatMeetingTranscriptSummaryLog(logScope, prefix, text) {
	return `${logScope} ${prefix}: chars=${text.length}`;
}
function normalizeMeetingTtsPromptText(text) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	const sayExactly = trimmed.match(/^say exactly:\s*(?<text>.+)$/is)?.groups?.text?.trim();
	if (sayExactly) return sayExactly.replace(/^["']|["']$/g, "").trim() || trimmed;
	return trimmed;
}
async function startMeetingRealtimeEngine(params) {
	let stopped = false;
	let stopPromise;
	let bridgeClosed = false;
	let transportStopped = false;
	let transportDisposed = false;
	let bridge = void 0;
	let realtimeReady = false;
	let lastClearAt;
	let clearCount = 0;
	const realtimeLogScope = params.logPrefix ? `${params.logPrefix} realtime` : "realtime";
	const stop = async () => {
		stopped = true;
		if (stopPromise) {
			await stopPromise;
			return;
		}
		const cleanup = Promise.resolve().then(async () => {
			if (!bridgeClosed) {
				bridgeClosed = true;
				harness.close();
				try {
					bridge?.close();
				} catch (error) {
					params.logger.debug?.(`${params.platform.logScope} ${realtimeLogScope}${params.logPrefix ? "" : " voice"} bridge close ignored: ${formatErrorMessage$1(error)}`);
				}
			}
			let cleanupError;
			if (!transportStopped) try {
				await params.transport.stop();
				transportStopped = true;
			} catch (error) {
				cleanupError = error;
			}
			if (!transportDisposed) try {
				await params.transport.dispose();
				transportDisposed = true;
			} catch (error) {
				cleanupError ??= error;
			}
			if (cleanupError) throw cleanupError instanceof Error ? cleanupError : new Error("Meeting realtime transport cleanup failed", { cause: cleanupError });
		});
		stopPromise = cleanup;
		try {
			await cleanup;
		} finally {
			if (stopPromise === cleanup) stopPromise = void 0;
		}
	};
	const stopAfterFailure = (source) => {
		stop().catch((error) => {
			params.logger.warn(`${params.platform.logScope} ${realtimeLogScope} ${source} cleanup failed: ${formatErrorMessage$1(error)}`);
		});
	};
	const clearOutputPlayback = () => {
		if (stopped) return;
		clearCount += 1;
		lastClearAt = (/* @__PURE__ */ new Date()).toISOString();
		params.transport.clearOutput().catch((error) => {
			params.logger.warn(`${params.platform.logScope} ${params.logPrefix ? `${params.logPrefix} audio clear` : "audio output clear"} failed: ${formatErrorMessage$1(error)}`);
			stopAfterFailure("audio output clear");
		});
	};
	const writeOutputAudio = (audio) => {
		params.transport.writeOutput(audio).catch((error) => {
			params.logger.warn(`${params.platform.logScope} ${params.logPrefix ? `${params.logPrefix} audio output` : "audio output"} failed: ${formatErrorMessage$1(error)}`);
			stopAfterFailure("audio output");
		});
	};
	const startHumanBargeInMonitor = () => {
		if (!params.transport.startBargeInMonitor) return;
		params.transport.startBargeInMonitor(() => {
			if (stopped || !harness.outputActivity.isInterruptible()) return false;
			const now = Date.now();
			const playbackActive = harness.isOutputPlaybackWindowActive();
			const lastOutputAudioAt = harness.outputActivity.snapshot().lastAudioAt;
			if (!playbackActive && (lastOutputAudioAt === void 0 || now - lastOutputAudioAt > 1e3)) return false;
			harness.handleBargeIn({ audioPlaybackActive: true }, clearOutputPlayback);
			return true;
		});
	};
	const resolved = resolveMeetingRealtimeProvider({
		config: params.config,
		fullConfig: params.fullConfig,
		providers: params.providers
	});
	const strategy = params.config.realtime.strategy;
	params.logger.info(formatMeetingRealtimeVoiceModelLog({
		logScope: params.platform.logScope,
		strategy,
		provider: resolved.provider,
		providerConfig: resolved.providerConfig,
		fallbackModel: params.config.realtime.model,
		audioFormat: params.config.chrome.audioFormat
	}));
	const meetingTalkPayload = params.talkContext ? {
		bridgeId: params.talkContext.bridgeId,
		meetingSessionId: params.meetingSessionId
	} : { meetingSessionId: params.meetingSessionId };
	const outputTalkPayload = params.talkContext ? { bridgeId: params.talkContext.bridgeId } : { meetingSessionId: params.meetingSessionId };
	const reasonTalkPayload = (reason) => params.talkContext ? {
		bridgeId: params.talkContext.bridgeId,
		reason
	} : { reason };
	const harness = createRealtimeVoiceSessionHarness({
		talk: {
			sessionId: params.talkSessionId ?? `${params.platform.sessionIdPrefix}:${params.meetingSessionId}:command-realtime`,
			mode: "realtime",
			transport: "gateway-relay",
			brain: strategy === "bidi" ? "direct-tools" : "agent-consult",
			provider: resolved.provider.id
		},
		talkPayloads: {
			turnStarted: () => meetingTalkPayload,
			turnEnded: reasonTalkPayload,
			inputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
			outputAudioStarted: () => outputTalkPayload,
			outputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
			outputAudioDone: reasonTalkPayload
		},
		echoSuppression: {
			bytesPerMs: meetingOutputBytesPerMs(params.config.chrome.audioFormat),
			tailMs: MEETING_OUTPUT_ECHO_SUPPRESSION_TAIL_MS,
			transcriptLookbackMs: MEETING_TRANSCRIPT_ECHO_LOOKBACK_MS
		},
		talkback: {
			debounceMs: 900,
			logger: params.logger,
			logPrefix: `${params.platform.logScope} ${realtimeLogScope} agent`,
			responseStyle: "Brief, natural spoken answer for a live meeting.",
			fallbackText: "I hit an error while checking that. Please try again.",
			consult: ({ question, responseStyle }) => params.consultAgent({
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				args: {
					question,
					responseStyle
				},
				transcript: harness.transcript
			}),
			deliver: (text) => {
				bridge?.sendUserMessage(buildMeetingSpeakExactUserMessage(text));
			}
		}
	});
	harness.emit({
		type: "session.started",
		payload: params.talkContext ? {
			...meetingTalkPayload,
			nodeId: params.talkContext.nodeId
		} : meetingTalkPayload
	});
	params.transport.onFatal(() => {
		stopAfterFailure("audio transport");
	});
	if (stopped) throw new Error(`${params.platform.displayName} audio transport failed before realtime provider setup`);
	try {
		bridge = harness.createBridge({
			provider: resolved.provider,
			cfg: params.fullConfig,
			providerConfig: resolved.providerConfig,
			audioFormat: resolveMeetingRealtimeAudioFormat(params.config.chrome.audioFormat),
			instructions: params.config.realtime.instructions,
			initialGreetingInstructions: params.config.realtime.introMessage,
			autoRespondToAudio: strategy === "bidi",
			triggerGreetingOnReady: false,
			markStrategy: "ack-immediately",
			tools: strategy === "bidi" ? params.tools : [],
			audioSink: {
				isOpen: () => !stopped,
				sendAudio: (audio) => {
					harness.outputActivity.markPlaybackStarted();
					harness.recordOutputAudio(audio);
					writeOutputAudio(audio);
				},
				clearAudio: () => {
					harness.flushOutput(clearOutputPlayback);
					harness.finishOutputAudio("clear");
				}
			},
			onTranscript: (role, text, isFinal) => {
				const turnId = harness.ensureTurn();
				const eventType = role === "assistant" ? isFinal ? "output.text.done" : "output.text.delta" : isFinal ? "transcript.done" : "transcript.delta";
				const payload = role === "assistant" ? { text } : {
					role,
					text
				};
				harness.emit({
					type: eventType,
					turnId,
					payload,
					final: isFinal
				});
				if (role === "user" && isFinal) harness.emit({
					type: "input.audio.committed",
					turnId,
					payload: outputTalkPayload,
					final: true
				});
				if (isFinal) {
					params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${realtimeLogScope} ${role}`, text));
					if (role === "user" && strategy === "agent") {
						if (harness.isLikelyAssistantEchoTranscript(text)) {
							params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${realtimeLogScope} ignored assistant echo transcript`, text));
							return;
						}
						harness.talkback?.enqueue(text);
					}
				}
			},
			onEvent: (event) => {
				if (event.type === "input_audio_buffer.speech_started") harness.ensureTurn();
				else if (event.type === "input_audio_buffer.speech_stopped") {
					const turnId = harness.talk.activeTurnId;
					if (!turnId) return;
					harness.emit({
						type: "input.audio.committed",
						turnId,
						payload: {
							...outputTalkPayload,
							source: event.type
						},
						final: true
					});
				} else if (event.type === "response.done") {
					harness.finishOutputAudio("response.done");
					harness.endTurn("response.done");
				} else if (event.type === "error") harness.emit({
					type: "session.error",
					payload: { message: event.detail ?? "Realtime provider error" },
					final: true
				});
				if (event.type === "error" || event.type === "response.done" || event.type === "input_audio_buffer.speech_started" || event.type === "input_audio_buffer.speech_stopped" || event.type === "conversation.item.input_audio_transcription.completed" || event.type === "conversation.item.input_audio_transcription.failed") {
					const detail = event.detail ? ` ${event.detail}` : "";
					params.logger.info(`${params.platform.logScope} ${realtimeLogScope} ${event.direction}:${event.type}${detail}`);
				}
			},
			onToolCall: (event, session) => {
				harness.emit({
					type: "tool.call",
					turnId: harness.ensureTurn(),
					itemId: event.itemId,
					callId: event.callId,
					payload: {
						name: event.name,
						args: event.args
					}
				});
				const turnId = harness.ensureTurn();
				return params.handleToolCall({
					strategy,
					session,
					event,
					meetingSessionId: params.meetingSessionId,
					requesterSessionKey: params.requesterSessionKey,
					transcript: harness.transcript,
					onTalkEvent: (inputLocal) => harness.emit({
						...inputLocal,
						turnId: inputLocal.turnId ?? turnId
					})
				});
			},
			onError: (error) => {
				harness.emit({
					type: "session.error",
					payload: { message: formatErrorMessage$1(error) },
					final: true
				});
				params.logger.warn(`${params.platform.logScope} ${realtimeLogScope} voice bridge failed: ${formatErrorMessage$1(error)}`);
				stopAfterFailure("voice bridge");
			},
			onClose: (reason) => {
				realtimeReady = false;
				harness.finishOutputAudio(reason);
				harness.emit({
					type: "session.closed",
					payload: { reason },
					final: true
				});
				stopAfterFailure("voice bridge close");
			},
			onReady: () => {
				realtimeReady = true;
				harness.emit({
					type: "session.ready",
					payload: outputTalkPayload
				});
			}
		});
		startHumanBargeInMonitor();
		params.transport.startInput((audio) => {
			if (stopped || audio.byteLength === 0) return;
			if (!harness.recordInputAudio(audio)) return;
			bridge?.sendAudio(audio);
		});
		await bridge.connect();
		if (stopped) throw new Error(`${params.platform.displayName} audio transport stopped during realtime provider setup`);
	} catch (error) {
		try {
			await stop();
		} catch (cleanupError) {
			params.logger.debug?.(`${params.platform.logScope} ${realtimeLogScope} failed-start cleanup ignored: ${formatErrorMessage$1(cleanupError)}`);
			try {
				await stop();
			} catch (retryError) {
				params.logger.debug?.(`${params.platform.logScope} ${realtimeLogScope} failed-start cleanup retry ignored: ${formatErrorMessage$1(retryError)}`);
			}
		}
		throw error;
	}
	return {
		providerId: resolved.provider.id,
		speak: (instructions) => {
			bridge?.triggerGreeting(instructions);
		},
		getHealth: () => ({
			...harness.getHealth({
				providerConnected: bridge?.bridge.isConnected() ?? false,
				realtimeReady
			}),
			...params.transport.getHealth?.(),
			lastClearAt,
			clearCount,
			bridgeClosed: stopped
		}),
		stop
	};
}
//#endregion
//#region src/meeting-bot/realtime-agent-engine.ts
async function startMeetingAgentRealtimeEngine(params) {
	let stopped = false;
	let stopPromise;
	let sttSession = null;
	let realtimeReady = false;
	let ttsQueue = Promise.resolve();
	const agentLogScope = params.logPrefix ? `${params.logPrefix} agent` : "agent";
	const resolved = resolveMeetingRealtimeTranscriptionProvider({
		config: params.config,
		fullConfig: params.fullConfig,
		providers: params.providers
	});
	params.logger.info(formatMeetingAgentAudioModelLog({
		logScope: params.platform.logScope,
		provider: resolved.provider,
		providerConfig: resolved.providerConfig,
		audioFormat: params.config.chrome.audioFormat
	}));
	const stop = async () => {
		if (stopped) {
			await stopPromise;
			return;
		}
		stopped = true;
		stopPromise = (async () => {
			harness.close();
			try {
				sttSession?.close();
			} catch (error) {
				params.logger.debug?.(`${params.platform.logScope} ${agentLogScope} transcription bridge close ignored: ${formatErrorMessage$1(error)}`);
			}
			harness.emit({
				type: "session.closed",
				final: true,
				payload: { meetingSessionId: params.meetingSessionId }
			});
			try {
				await params.transport.stop();
			} finally {
				await params.transport.dispose();
			}
		})();
		await stopPromise;
	};
	const stopAfterFailure = (source) => {
		stop().catch((error) => {
			params.logger.warn(`${params.platform.logScope} ${agentLogScope} ${source} cleanup failed: ${formatErrorMessage$1(error)}`);
		});
	};
	const writeOutputAudio = async (audio) => {
		harness.outputActivity.markPlaybackStarted();
		harness.recordOutputAudio(audio);
		await params.transport.writeOutput(audio);
	};
	const enqueueSpeakText = (text) => {
		const normalized = normalizeMeetingTtsPromptText(text);
		if (!normalized || stopped) return;
		ttsQueue = ttsQueue.then(async () => {
			if (stopped) return;
			harness.recordTranscript("assistant", normalized);
			params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${agentLogScope} assistant`, normalized));
			const turnId = harness.ensureTurn();
			harness.emit({
				type: "output.text.done",
				turnId,
				final: true,
				payload: {
					meetingSessionId: params.meetingSessionId,
					text: normalized
				}
			});
			const result = await params.runtime.tts.textToSpeechTelephony({
				text: normalized,
				cfg: params.fullConfig
			});
			if (!result.success || !result.audioBuffer || !result.sampleRate) throw new Error(result.error ?? "TTS conversion failed");
			params.logger.info(formatMeetingAgentTtsResultLog(params.platform.logScope, agentLogScope, result));
			await writeOutputAudio(convertMeetingTtsAudioForBridge(result.audioBuffer, result.sampleRate, params.config.chrome.audioFormat, result.outputFormat, params.platform.displayName));
			harness.finishOutputAudio("completed");
			harness.endTurn();
		}).catch((error) => {
			harness.finishOutputAudio("failed");
			harness.endTurn("failed");
			params.logger.warn(`${params.platform.logScope} ${agentLogScope} TTS failed: ${formatErrorMessage$1(error)}`);
		});
	};
	const harness = createRealtimeVoiceSessionHarness({
		talk: {
			sessionId: `${params.platform.sessionIdPrefix}:${params.meetingSessionId}:agent`,
			mode: "stt-tts",
			transport: "gateway-relay",
			brain: "agent-consult",
			provider: resolved.provider.id,
			turnIdPrefix: `${params.platform.sessionIdPrefix}:${params.meetingSessionId}:turn`
		},
		talkPayloads: {
			turnStarted: () => ({ meetingSessionId: params.meetingSessionId }),
			turnEnded: () => ({ meetingSessionId: params.meetingSessionId }),
			inputAudioDelta: (audio) => ({
				meetingSessionId: params.meetingSessionId,
				bytes: audio.byteLength
			}),
			outputAudioStarted: () => ({ meetingSessionId: params.meetingSessionId }),
			outputAudioDelta: (audio) => ({
				meetingSessionId: params.meetingSessionId,
				bytes: audio.byteLength
			}),
			outputAudioDone: () => ({ meetingSessionId: params.meetingSessionId })
		},
		echoSuppression: {
			bytesPerMs: meetingOutputBytesPerMs(params.config.chrome.audioFormat),
			tailMs: MEETING_OUTPUT_ECHO_SUPPRESSION_TAIL_MS,
			transcriptLookbackMs: MEETING_TRANSCRIPT_ECHO_LOOKBACK_MS
		},
		talkback: {
			debounceMs: 900,
			logger: params.logger,
			logPrefix: `${params.platform.logScope} ${agentLogScope}`,
			responseStyle: "Brief, natural spoken answer for a live meeting.",
			fallbackText: "I hit an error while checking that. Please try again.",
			consult: ({ question, responseStyle }) => params.consultAgent({
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				args: {
					question,
					responseStyle
				},
				transcript: harness.transcript
			}),
			deliver: enqueueSpeakText
		}
	});
	params.transport.onFatal(() => {
		stopAfterFailure("audio transport");
	});
	if (stopped) throw new Error(`${params.platform.displayName} audio transport failed before transcription provider setup`);
	try {
		sttSession = resolved.provider.createSession({
			cfg: params.fullConfig,
			providerConfig: resolved.providerConfig,
			onTranscript: (text) => {
				const trimmed = text.trim();
				if (!trimmed || stopped) return;
				const turnId = harness.ensureTurn();
				harness.emit({
					type: "input.audio.committed",
					turnId,
					final: true,
					payload: { meetingSessionId: params.meetingSessionId }
				});
				harness.emit({
					type: "transcript.done",
					turnId,
					final: true,
					payload: {
						meetingSessionId: params.meetingSessionId,
						text: trimmed,
						role: "user"
					}
				});
				harness.recordTranscript("user", trimmed);
				params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${agentLogScope} user`, trimmed));
				if (harness.isLikelyAssistantEchoTranscript(trimmed)) {
					params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${agentLogScope} ignored assistant echo transcript`, trimmed));
					return;
				}
				harness.talkback?.enqueue(trimmed);
			},
			onError: (error) => {
				params.logger.warn(`${params.platform.logScope} ${agentLogScope} transcription bridge failed: ${formatErrorMessage$1(error)}`);
				harness.emit({
					type: "session.error",
					final: true,
					payload: {
						meetingSessionId: params.meetingSessionId,
						error: formatErrorMessage$1(error)
					}
				});
				stopAfterFailure("transcription bridge");
			}
		});
		harness.emit({
			type: "session.started",
			payload: {
				meetingSessionId: params.meetingSessionId,
				provider: resolved.provider.id
			}
		});
		params.transport.startInput((audio) => {
			if (stopped || !realtimeReady || audio.byteLength === 0) return;
			if (!harness.recordInputAudio(audio)) return;
			sttSession?.sendAudio(convertMeetingBridgeAudioForStt(audio, params.config.chrome.audioFormat));
		});
		await sttSession.connect();
	} catch (error) {
		try {
			await stop();
		} catch (cleanupError) {
			params.logger.debug?.(`${params.platform.logScope} ${agentLogScope} failed-start cleanup ignored: ${formatErrorMessage$1(cleanupError)}`);
		}
		throw error;
	}
	if (stopped) throw new Error(`${params.platform.displayName} audio transport stopped during transcription provider setup`);
	realtimeReady = true;
	harness.emit({
		type: "session.ready",
		payload: { meetingSessionId: params.meetingSessionId }
	});
	return {
		providerId: resolved.provider.id,
		speak: enqueueSpeakText,
		getHealth: () => ({
			...harness.getHealth({
				providerConnected: sttSession?.isConnected() ?? false,
				realtimeReady
			}),
			...params.transport.getHealth?.(),
			bridgeClosed: stopped
		}),
		stop
	};
}
//#endregion
//#region src/meeting-bot/bridge-process.ts
function hasExited(proc) {
	return proc.exitCode !== null || proc.signalCode !== null;
}
function waitForExit(proc, timeoutMs) {
	if (hasExited(proc)) return Promise.resolve(true);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (exited) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			proc.off("exit", onExit);
			resolve(exited);
		};
		const onExit = () => finish(true);
		const timeout = setTimeout(() => finish(hasExited(proc)), timeoutMs);
		timeout.unref?.();
		proc.once("exit", onExit);
		if (hasExited(proc)) finish(true);
	});
}
/** Settles after the bridge exits or the bounded force-kill sequence finishes. */
async function terminateMeetingBridgeProcess(proc, options) {
	if (!proc || hasExited(proc)) return;
	const initialSignal = options.initialSignal ?? "SIGTERM";
	try {
		if (!proc.kill(initialSignal)) return;
	} catch {
		return;
	}
	const forceKillWaitMs = options.forceKillWaitMs ?? 1e3;
	if (initialSignal === "SIGKILL") {
		await waitForExit(proc, forceKillWaitMs);
		return;
	}
	if (await waitForExit(proc, options.graceMs)) return;
	try {
		if (!proc.kill("SIGKILL")) return;
	} catch {
		return;
	}
	await waitForExit(proc, forceKillWaitMs);
}
//#endregion
//#region src/meeting-bot/realtime-local-audio-transport.ts
const LOCAL_BRIDGE_TERMINATION_GRACE_MS = 1e3;
function splitCommand$1(argv) {
	const [command, ...args] = argv;
	if (!command) throw new Error("audio bridge command must not be empty");
	return {
		command,
		args
	};
}
function createLocalMeetingRealtimeAudioTransport(params) {
	const input = splitCommand$1(params.inputCommand);
	const output = splitCommand$1(params.outputCommand);
	const spawnFn = params.spawn ?? ((command, args, options) => spawn(command, args, options));
	const spawnOutputProcess = () => spawnFn(output.command, output.args, { stdio: [
		"pipe",
		"ignore",
		"pipe"
	] });
	let outputProcess = spawnOutputProcess();
	const inputProcess = spawnFn(input.command, input.args, { stdio: [
		"ignore",
		"pipe",
		"pipe"
	] });
	let bargeInInputProcess;
	let stopped = false;
	let inputStarted = false;
	let fatalSignaled = false;
	let fatalHandler;
	let stopPromise;
	const retiredOutputStops = /* @__PURE__ */ new Set();
	const signalFatal = () => {
		if (!fatalSignaled) {
			fatalSignaled = true;
			fatalHandler?.();
		}
	};
	const fail = (label) => (error) => {
		params.logger.warn(`${params.logScope} ${label} failed: ${formatErrorMessage$1(error)}`);
		signalFatal();
	};
	const attachOutputProcessHandlers = (proc) => {
		proc.on("error", (error) => {
			if (proc === outputProcess) fail("audio output command")(error);
		});
		proc.stdin?.on?.("error", (error) => {
			if (proc === outputProcess) fail("audio output command")(error);
		});
		proc.on("exit", (code, signal) => {
			if (proc === outputProcess && !stopped) {
				params.logger.warn(`${params.logScope} audio output command exited (${code ?? signal ?? "done"})`);
				signalFatal();
			}
		});
		proc.stderr?.on("data", (chunk) => {
			params.logger.debug?.(`${params.logScope} audio output: ${String(chunk).trim()}`);
		});
		proc.stderr?.on("error", (error) => {
			if (proc === outputProcess) fail("audio output command stderr")(error);
		});
	};
	attachOutputProcessHandlers(outputProcess);
	inputProcess.on("error", fail("audio input command"));
	inputProcess.on("exit", (code, signal) => {
		if (!stopped) {
			params.logger.warn(`${params.logScope} audio input command exited (${code ?? signal ?? "done"})`);
			signalFatal();
		}
	});
	inputProcess.stderr?.on("data", (chunk) => {
		params.logger.debug?.(`${params.logScope} audio input: ${String(chunk).trim()}`);
	});
	inputProcess.stdout?.on("error", fail("audio input command stdout"));
	inputProcess.stderr?.on("error", fail("audio input command stderr"));
	const transport = {
		onFatal: (handler) => {
			fatalHandler = handler;
			if (fatalSignaled) handler();
		},
		startInput: (onAudio) => {
			if (inputStarted) throw new Error("audio input transport already started");
			inputStarted = true;
			inputProcess.stdout?.on("data", (chunk) => {
				if (!stopped) onAudio(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
			});
		},
		stop: () => {
			stopPromise ??= (async () => {
				stopped = true;
				await Promise.all([
					terminateMeetingBridgeProcess(inputProcess, { graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS }),
					terminateMeetingBridgeProcess(outputProcess, { graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS }),
					terminateMeetingBridgeProcess(bargeInInputProcess, { graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS }),
					...retiredOutputStops
				]);
			})();
			return stopPromise;
		},
		writeOutput: async (audio) => {
			if (stopped) return;
			try {
				outputProcess.stdin?.write(audio);
			} catch (error) {
				fail("audio output command")(error);
			}
		},
		clearOutput: async () => {
			if (stopped) return;
			const previousOutput = outputProcess;
			outputProcess = spawnOutputProcess();
			attachOutputProcessHandlers(outputProcess);
			params.logger.debug?.(`${params.logScope} cleared realtime audio output buffer by restarting playback command`);
			const retiredOutputStop = terminateMeetingBridgeProcess(previousOutput, {
				graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS,
				initialSignal: "SIGKILL"
			});
			retiredOutputStops.add(retiredOutputStop);
			retiredOutputStop.finally(() => {
				retiredOutputStops.delete(retiredOutputStop);
			});
		},
		dispose: async () => {
			await transport.stop();
		}
	};
	if (!params.bargeInInputCommand) return transport;
	return {
		...transport,
		startBargeInMonitor: (onBargeIn) => {
			if (bargeInInputProcess || stopped) return;
			const command = splitCommand$1(params.bargeInInputCommand ?? []);
			const bargeInGate = createSpeechThresholdGate({
				rmsThreshold: params.bargeInRmsThreshold,
				peakThreshold: params.bargeInPeakThreshold,
				cooldownMs: params.bargeInCooldownMs
			});
			bargeInInputProcess = spawnFn(command.command, command.args, { stdio: [
				"ignore",
				"pipe",
				"pipe"
			] });
			bargeInInputProcess.stdout?.on("data", (chunk) => {
				const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				if (stopped) return;
				const stats = readPcm16AudioStats(audio);
				if (!bargeInGate.accept(stats, {
					nowMs: Date.now(),
					onTrigger: () => onBargeIn(audio)
				})) return;
				params.logger.debug?.(`${params.logScope} human barge-in detected by local input (rms=${Math.round(stats.rms)}, peak=${stats.peak})`);
			});
			bargeInInputProcess.stdout?.on("error", (error) => {
				params.logger.warn(`${params.logScope} human barge-in input stdout failed: ${formatErrorMessage$1(error)}`);
			});
			bargeInInputProcess.stderr?.on("data", (chunk) => {
				params.logger.debug?.(`${params.logScope} barge-in input: ${String(chunk).trim()}`);
			});
			bargeInInputProcess.stderr?.on("error", (error) => {
				params.logger.warn(`${params.logScope} human barge-in input stderr failed: ${formatErrorMessage$1(error)}`);
			});
			bargeInInputProcess.on("error", (error) => {
				params.logger.warn(`${params.logScope} human barge-in input failed: ${formatErrorMessage$1(error)}`);
			});
			bargeInInputProcess.on("exit", (code, signal) => {
				if (!stopped) params.logger.debug?.(`${params.logScope} human barge-in input exited (${code ?? signal ?? "done"})`);
			});
		}
	};
}
//#endregion
//#region src/meeting-bot/realtime-node-audio-transport.ts
function asRecord$2(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function readString$2(value) {
	return typeof value === "string" && value.trim() ? value : void 0;
}
function createNodeMeetingRealtimeAudioTransport(params) {
	let stopped = false;
	let inputStarted = false;
	let consecutiveInputErrors = 0;
	let lastInputError;
	let fatalSignaled = false;
	let fatalHandler;
	const signalFatal = () => {
		if (!fatalSignaled) {
			fatalSignaled = true;
			fatalHandler?.();
		}
	};
	const transport = {
		onFatal: (handler) => {
			fatalHandler = handler;
			if (fatalSignaled) handler();
		},
		startInput: (onAudio) => {
			if (inputStarted) throw new Error("audio input transport already started");
			inputStarted = true;
			(async () => {
				for (;;) {
					if (stopped) break;
					try {
						const raw = await params.runtime.nodes.invoke({
							nodeId: params.nodeId,
							command: params.commandName,
							params: {
								action: "pullAudio",
								bridgeId: params.bridgeId,
								timeoutMs: 250
							},
							timeoutMs: 2e3
						});
						const result = asRecord$2(asRecord$2(raw).payload ?? raw);
						consecutiveInputErrors = 0;
						lastInputError = void 0;
						const base64 = readString$2(result.base64);
						if (base64) onAudio(Buffer.from(base64, "base64"));
						if (result.closed === true) {
							signalFatal();
							break;
						}
					} catch (error) {
						if (stopped) break;
						const message = formatErrorMessage$1(error);
						consecutiveInputErrors += 1;
						lastInputError = message;
						params.logger.warn(`${params.logScope} ${params.logPrefix} audio input failed (${consecutiveInputErrors}/5): ${message}`);
						if (consecutiveInputErrors >= 5 || /unknown bridgeId|bridge is not open/i.test(message)) {
							signalFatal();
							break;
						}
						await new Promise((resolve) => {
							setTimeout(resolve, 250);
						});
					}
				}
			})();
		},
		stop: async () => {
			if (stopped) return;
			stopped = true;
			try {
				await params.runtime.nodes.invoke({
					nodeId: params.nodeId,
					command: params.commandName,
					params: {
						action: "stop",
						bridgeId: params.bridgeId
					},
					timeoutMs: 5e3
				});
			} catch (error) {
				params.logger.debug?.(`${params.logScope} node audio bridge stop ignored: ${formatErrorMessage$1(error)}`);
			}
		},
		writeOutput: async (audio) => {
			await params.runtime.nodes.invoke({
				nodeId: params.nodeId,
				command: params.commandName,
				params: {
					action: "pushAudio",
					bridgeId: params.bridgeId,
					base64: audio.toString("base64")
				},
				timeoutMs: 5e3
			});
		},
		clearOutput: async () => {
			await params.runtime.nodes.invoke({
				nodeId: params.nodeId,
				command: params.commandName,
				params: {
					action: "clearAudio",
					bridgeId: params.bridgeId
				},
				timeoutMs: 5e3
			});
		},
		dispose: async () => {
			await transport.stop();
		},
		getHealth: () => ({
			consecutiveInputErrors,
			lastInputError
		})
	};
	return transport;
}
//#endregion
//#region src/meeting-bot/session-cleanup-tracker.ts
var MeetingSessionCleanupTracker = class {
	#states = /* @__PURE__ */ new Map();
	begin(sessionId, browserLeft) {
		if (this.#states.has(sessionId)) return false;
		this.#states.set(sessionId, {
			browserLeft,
			browserSettled: false,
			stopSettled: false
		});
		return true;
	}
	isPending(sessionId) {
		return this.#states.has(sessionId);
	}
	async cleanup(params) {
		const state = this.#states.get(params.sessionId);
		if (!state) throw new Error("Missing cleanup state for meeting session " + params.sessionId);
		let cleanupError;
		if (!state.stopSettled) try {
			await params.stop?.();
			state.stopSettled = true;
		} catch (error) {
			cleanupError = error;
		}
		if (!state.browserSettled) try {
			if (params.keepBrowserTab) state.browserSettled = true;
			else {
				state.browserLeft = await params.releaseBrowser();
				state.browserSettled = state.browserLeft !== false;
			}
		} catch (error) {
			cleanupError ??= error;
		}
		const complete = this.#completeIfSettled(params.sessionId, state);
		if (cleanupError) throw cleanupError instanceof Error ? cleanupError : new Error("Meeting session cleanup failed", { cause: cleanupError });
		return {
			browserLeft: state.browserLeft,
			complete,
			stopSettled: state.stopSettled
		};
	}
	async retryBrowserAfterFailedJoin(params) {
		const state = this.#states.get(params.sessionId);
		if (!state) return {
			browserLeft: params.browserLeft,
			complete: true,
			incomplete: false
		};
		if (!params.hasBrowserTab()) state.browserSettled ||= state.browserLeft !== false;
		else if (!state.browserSettled) try {
			state.browserLeft = await params.releaseBrowser();
			state.browserSettled = state.browserLeft !== false;
		} catch (error) {
			return {
				browserLeft: state.browserLeft,
				complete: false,
				error,
				incomplete: params.hasBrowserTab()
			};
		}
		return {
			browserLeft: state.browserLeft,
			complete: this.#completeIfSettled(params.sessionId, state),
			incomplete: params.hasBrowserTab()
		};
	}
	async rollbackFailedJoin(params) {
		let retryFullCleanup = false;
		try {
			await params.leave();
		} catch (error) {
			params.warn(`replacement cleanup failed: ${params.formatError(error)}`);
			retryFullCleanup = true;
		}
		if (retryFullCleanup) try {
			await params.leave();
		} catch (error) {
			params.warn(`replacement cleanup retry failed: ${params.formatError(error)}`);
		}
		const retry = await this.retryBrowserAfterFailedJoin(params);
		params.onBrowserResult(retry.browserLeft);
		if (retry.error) params.warn(`replacement browser cleanup retry failed: ${params.formatError(retry.error)}`);
		if (retry.complete) params.onComplete();
		if (retry.incomplete) params.warn("replacement browser cleanup incomplete after failed join");
	}
	#completeIfSettled(sessionId, state) {
		if (!state.stopSettled || !state.browserSettled) return false;
		this.#states.delete(sessionId);
		return true;
	}
};
//#endregion
//#region src/meeting-bot/session-join-lock.ts
/** Serializes adoption and departure for one physical browser meeting. */
var MeetingSessionJoinLock = class {
	#tails = /* @__PURE__ */ new Map();
	async run(key, operation) {
		const previous = this.#tails.get(key) ?? Promise.resolve();
		let release;
		const gate = new Promise((resolve) => {
			release = resolve;
		});
		const tail = previous.then(() => gate);
		this.#tails.set(key, tail);
		await previous;
		try {
			return await operation();
		} finally {
			release?.();
			if (this.#tails.get(key) === tail) this.#tails.delete(key);
		}
	}
};
//#endregion
//#region src/meeting-bot/session-transcript-store.ts
const TRANSCRIPT_MAX_LINES = 2e3;
var MeetingSessionTranscriptStore = class {
	#transcripts = /* @__PURE__ */ new Map();
	#captures = /* @__PURE__ */ new Map();
	#finalizing = /* @__PURE__ */ new Set();
	#retired = /* @__PURE__ */ new Set();
	constructor(options) {
		this.options = options;
	}
	async read(sessionId, options = {}) {
		const session = this.options.getSession(sessionId);
		if (!session) return { found: false };
		if (!this.options.isTranscribeSession(session)) throw new Error("transcript is only available for transcribe-mode sessions");
		const sinceIndex = options.sinceIndex ?? 0;
		if (!Number.isSafeInteger(sinceIndex) || sinceIndex < 0) throw new Error("sinceIndex must be a non-negative safe integer");
		if (session.state === "active" && !this.#finalizing.has(session.id)) await this.capture(session);
		const snapshot = this.#transcripts.get(sessionId) ?? {
			droppedLines: 0,
			lines: []
		};
		const startIndex = Math.max(sinceIndex, snapshot.droppedLines);
		return {
			found: true,
			sessionId,
			startIndex,
			nextIndex: snapshot.droppedLines + snapshot.lines.length,
			droppedLines: snapshot.droppedLines,
			...session.transcriptEvicted ? { evicted: true } : {},
			lines: snapshot.lines.slice(startIndex - snapshot.droppedLines)
		};
	}
	startFinalizing(sessionId) {
		this.#finalizing.add(sessionId);
	}
	finishFinalizing(sessionId) {
		this.#finalizing.delete(sessionId);
	}
	async capture(session, options = {}) {
		const capture = (this.#captures.get(session.id) ?? Promise.resolve()).catch(() => {}).then(async () => {
			if (!this.options.isBrowserSession(session) || !this.options.isTranscribeSession(session) || !this.options.hasBrowserTab(session)) return;
			const snapshot = await this.options.capture(session, options);
			if (snapshot) this.#merge(session.id, snapshot);
		});
		this.#captures.set(session.id, capture);
		try {
			await capture;
		} finally {
			if (this.#captures.get(session.id) === capture) this.#captures.delete(session.id);
		}
	}
	retire(sessionId) {
		const snapshot = this.#transcripts.get(sessionId);
		if (snapshot) {
			this.#transcripts.delete(sessionId);
			this.#transcripts.set(sessionId, snapshot);
			this.#retired.delete(sessionId);
			this.#retired.add(sessionId);
		}
		const retainedIds = [...this.#retired].filter((id) => this.#transcripts.has(id)).toSorted((left, right) => (this.options.getSession(left)?.updatedAt ?? "").localeCompare(this.options.getSession(right)?.updatedAt ?? ""));
		for (const id of retainedIds.slice(0, -4)) {
			this.#transcripts.delete(id);
			this.#retired.delete(id);
			const session = this.options.getSession(id);
			if (session) session.transcriptEvicted = true;
		}
	}
	#merge(sessionId, snapshot) {
		const pageNextIndex = snapshot.droppedLines + snapshot.lines.length;
		const retained = this.#transcripts.get(sessionId);
		if (!retained) {
			const excess = Math.max(0, snapshot.lines.length - TRANSCRIPT_MAX_LINES);
			this.#transcripts.set(sessionId, {
				droppedLines: snapshot.droppedLines + excess,
				lines: excess > 0 ? snapshot.lines.slice(excess) : snapshot.lines,
				pageEpoch: snapshot.epoch,
				pageNextIndex
			});
			return;
		}
		const retainedNextIndex = retained.droppedLines + retained.lines.length;
		if (retained.pageEpoch !== snapshot.epoch) {
			if (snapshot.droppedLines > 0) {
				retained.droppedLines = retainedNextIndex + snapshot.droppedLines;
				retained.lines = [...snapshot.lines];
			} else retained.lines.push(...snapshot.lines);
			retained.pageEpoch = snapshot.epoch;
			retained.pageNextIndex = pageNextIndex;
		} else if (pageNextIndex > retained.pageNextIndex) {
			if (snapshot.droppedLines > retained.pageNextIndex) {
				retained.droppedLines = retainedNextIndex - retained.pageNextIndex + snapshot.droppedLines;
				retained.lines = [...snapshot.lines];
			} else retained.lines.push(...snapshot.lines.slice(retained.pageNextIndex - snapshot.droppedLines));
			retained.pageNextIndex = pageNextIndex;
		}
		const excess = retained.lines.length - TRANSCRIPT_MAX_LINES;
		if (excess > 0) {
			retained.lines.splice(0, excess);
			retained.droppedLines += excess;
		}
	}
};
//#endregion
//#region src/meeting-bot/session-runtime.ts
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
/** Shared lifecycle owner; platform strategies perform transport-specific I/O only. */
var MeetingSessionRuntime = class {
	#sessions = /* @__PURE__ */ new Map();
	#sessionLeaves = /* @__PURE__ */ new Map();
	#sessionCleanup = new MeetingSessionCleanupTracker();
	#meetingLock = new MeetingSessionJoinLock();
	#sessionStops = /* @__PURE__ */ new Map();
	#sessionSpeakers = /* @__PURE__ */ new Map();
	#sessionHealth = /* @__PURE__ */ new Map();
	#transcriptStore;
	constructor(options) {
		this.options = options;
		this.#transcriptStore = new MeetingSessionTranscriptStore({
			getSession: (sessionId) => this.#sessions.get(sessionId),
			isBrowserSession: (session) => this.options.isBrowserTransport(session.transport),
			isTranscribeSession: (session) => this.options.isTranscribeMode(session.mode),
			hasBrowserTab: (session) => Boolean(this.options.getBrowser(session)?.tab),
			capture: async (session, captureOptions) => await this.options.captureTranscript(session, captureOptions)
		});
	}
	list() {
		this.refreshHealth();
		return [...this.#sessions.values()].toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
	}
	getSession(sessionId) {
		return this.#sessions.get(sessionId);
	}
	async status(sessionId) {
		this.refreshHealth(sessionId);
		if (!sessionId) {
			const sessions = [...this.#sessions.values()].toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
			await Promise.all(sessions.map((session) => this.options.refreshStatus(session)));
			return {
				found: true,
				sessions
			};
		}
		const session = this.#sessions.get(sessionId);
		if (session) await this.options.refreshStatus(session);
		return session ? {
			found: true,
			session
		} : { found: false };
	}
	async transcript(sessionId, options = {}) {
		return await this.#transcriptStore.read(sessionId, options);
	}
	isReusableSession(session, resolved) {
		return session.state === "active" && this.options.sameMeetingUrl(session.url, resolved.url) && session.transport === resolved.transport && session.mode === resolved.mode && session.agentId === resolved.agentId;
	}
	async join(request) {
		const resolved = this.options.resolveJoin(request);
		return await this.#meetingLock.run(this.#meetingKey(resolved.transport, resolved.url), async () => await this.#joinUnlocked(request, resolved));
	}
	async leave(sessionId, options) {
		const session = this.#sessions.get(sessionId);
		if (!session) return { found: false };
		return await this.#meetingLock.run(this.#meetingKey(session.transport, session.url), async () => await this.#leaveUnlocked(sessionId, options));
	}
	async speak(sessionId, instructions) {
		const session = this.#sessions.get(sessionId);
		if (!session) return {
			found: false,
			spoken: false
		};
		if (session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		const delegated = await this.options.speakViaTransport(session, instructions);
		if (session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		if (delegated?.handled) return {
			found: true,
			spoken: delegated.spoken,
			session
		};
		await this.refreshBrowserHealth(session);
		if (session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		const handles = await this.options.ensureRealtimeBridge(session);
		if (session.state !== "active") {
			await handles?.stop?.();
			return {
				found: true,
				spoken: false,
				session
			};
		}
		if (handles) this.#attachRuntimeHandles(session, handles);
		const speak = this.#sessionSpeakers.get(sessionId);
		if (!speak || session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		const readiness = this.refreshSpeechReadiness(session);
		if (!readiness.ready) {
			const note = readiness.message ? `Realtime speech blocked: ${readiness.message}` : this.options.messages.speechBlockedFallback;
			this.#noteSession(session, note);
			session.updatedAt = nowIso();
			return {
				found: true,
				spoken: false,
				session
			};
		}
		speak(instructions || this.options.defaultSpeechInstructions);
		session.updatedAt = nowIso();
		this.refreshHealth(sessionId);
		return {
			found: true,
			spoken: true,
			session
		};
	}
	async speakWhenReady(session, instructions) {
		let result = await this.speak(session.id, instructions);
		if (result.spoken || !this.options.isBrowserTransport(session.transport)) return result.spoken;
		const waitMs = Math.min(Math.max(0, this.options.waitForInCallMs), Math.max(0, this.options.joinTimeoutMs));
		const deadline = Date.now() + waitMs;
		while (Date.now() < deadline) {
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(250, Math.max(0, deadline - Date.now())));
			});
			result = await this.speak(session.id, instructions);
			if (result.spoken) return true;
			const health = this.options.getBrowser(result.session)?.health;
			if (health?.manualActionRequired || result.session?.state !== "active") return false;
			const blocked = health?.speechBlockedReason;
			if (blocked && !this.options.transientSpeechBlockedReasons.has(blocked)) return false;
		}
		return false;
	}
	hasHealthHandle(sessionId) {
		return this.#sessionHealth.has(sessionId);
	}
	refreshHealth(sessionId) {
		const ids = sessionId ? [sessionId] : [...this.#sessionHealth.keys()];
		for (const id of ids) {
			const session = this.#sessions.get(id);
			const getHealth = this.#sessionHealth.get(id);
			const browser = session ? this.options.getBrowser(session) : void 0;
			if (!session || !browser || !getHealth) continue;
			this.options.setBrowserHealth(session, {
				...browser.health,
				...getHealth()
			});
			this.refreshSpeechReadiness(session);
		}
	}
	async refreshBrowserHealth(session, options = {}) {
		if (!this.#isManagedBrowserSession(session)) {
			this.refreshSpeechReadiness(session);
			return;
		}
		if (!options.force && this.options.isTalkBackMode(session.mode) && this.#evaluateSpeechReadiness(session).ready) {
			this.refreshSpeechReadiness(session);
			return;
		}
		await this.options.refreshBrowserHealth(session, options);
		this.refreshSpeechReadiness(session);
	}
	async refreshCaptionHealth(session) {
		if (!this.options.isTranscribeMode(session.mode)) {
			this.refreshSpeechReadiness(session);
			return;
		}
		await this.refreshBrowserHealth(session);
	}
	refreshSpeechReadiness(session) {
		const readiness = this.#evaluateSpeechReadiness(session);
		if (readiness.ready) session.notes = session.notes.filter((note) => !note.startsWith("Realtime speech blocked:"));
		const browser = this.options.getBrowser(session);
		if (browser) this.options.setBrowserHealth(session, {
			...browser.health,
			speechReady: readiness.ready,
			speechBlockedReason: readiness.reason,
			speechBlockedMessage: readiness.message
		});
		return readiness;
	}
	markSessionEnded(session, reason) {
		session.state = "ended";
		session.updatedAt = nowIso();
		this.#dropRuntimeHandles(session.id);
		this.#noteSession(session, reason);
	}
	async #joinUnlocked(request, resolved) {
		const activeSessions = this.list().filter((session) => session.state === "active" && this.options.sameMeetingUrl(session.url, resolved.url) && session.transport === resolved.transport);
		const retained = [];
		if (this.options.isBrowserTransport(resolved.transport)) for (const session of activeSessions) {
			if (this.isReusableSession(session, resolved)) continue;
			const browser = this.options.getBrowser(session);
			const tab = this.options.reuseExistingBrowserTab ? browser?.tab : void 0;
			const keepBrowserParticipant = Boolean(tab) || browser?.launched === false;
			if (tab) retained.push({
				session,
				tab
			});
			try {
				if ((await this.#leaveUnlocked(session.id, keepBrowserParticipant ? { keepBrowserTab: true } : void 0)).browserLeft === false) throw new Error(this.options.messages.previousBrowserLeaveFailed);
			} catch (error) {
				await this.#settleRetainedBrowserTabsAfterFailure(retained);
				throw error;
			}
			this.#noteSession(session, this.options.messages.reassignedSessionNote);
		}
		let reusable = activeSessions.find((session) => this.isReusableSession(session, resolved));
		if (reusable) {
			const refreshResult = await this.options.refreshReusableSession(reusable, request, resolved);
			if (reusable.state !== "active") {
				await this.#leaveSession(reusable, { keepBrowserTab: refreshResult?.keepBrowserTab ?? true });
				reusable = void 0;
			}
		}
		const speechInstructions = this.options.resolveSpeechInstructions(request);
		if (reusable) {
			await this.refreshBrowserHealth(reusable);
			this.#noteSession(reusable, this.options.messages.reusedSessionNote);
			reusable.updatedAt = nowIso();
			const spoken = this.options.isTalkBackMode(resolved.mode) && speechInstructions ? await this.speakWhenReady(reusable, speechInstructions) : false;
			return {
				session: reusable,
				spoken
			};
		}
		const session = this.options.createSession({
			request,
			resolved,
			createdAt: nowIso()
		});
		let delegatedSpoken;
		try {
			delegatedSpoken = (await this.options.joinTransport({
				request,
				session,
				context: {
					attachRuntimeHandles: (target, handles) => this.#attachRuntimeHandles(target, handles),
					inheritedBrowserTab: (params) => this.#inheritBrowserTabOwnership(params)
				}
			})).delegatedSpoken === true;
			const browser = this.options.getBrowser(session);
			if (!await this.#settleRetainedBrowserTabs(retained, browser?.tab ? {
				transport: session.transport,
				nodeId: browser.nodeId,
				tab: browser.tab
			} : void 0)) throw new Error(this.options.messages.replacementBrowserLeaveFailed);
		} catch (error) {
			await this.#rollbackFailedJoinSession(session);
			await this.#settleRetainedBrowserTabsAfterFailure(retained);
			this.options.logger.warn(`${this.options.logScope} join failed: ${this.options.formatError(error)}`);
			throw error;
		}
		this.#sessions.set(session.id, session);
		return {
			session,
			spoken: delegatedSpoken ? true : this.options.isTalkBackMode(resolved.mode) && speechInstructions ? await this.speakWhenReady(session, speechInstructions) : false
		};
	}
	async #leaveUnlocked(sessionId, options) {
		const inFlight = this.#sessionLeaves.get(sessionId);
		if (inFlight) return await inFlight;
		const session = this.#sessions.get(sessionId);
		if (!session) return { found: false };
		if (session.state === "ended" && !this.#sessionCleanup.isPending(sessionId)) return {
			found: true,
			session,
			...session.browserLeft === void 0 ? {} : { browserLeft: session.browserLeft }
		};
		const leave = this.#leaveSession(session, options);
		this.#sessionLeaves.set(sessionId, leave);
		try {
			return await leave;
		} finally {
			if (this.#sessionLeaves.get(sessionId) === leave) this.#sessionLeaves.delete(sessionId);
		}
	}
	async #leaveSession(session, options) {
		const firstAttempt = this.#sessionCleanup.begin(session.id, session.browserLeft);
		if (firstAttempt && this.options.isTranscribeMode(session.mode)) {
			this.#transcriptStore.startFinalizing(session.id);
			await this.#transcriptStore.capture(session, { finalize: true }).catch((error) => {
				this.options.logger.debug?.(`${this.options.logScope} final transcript snapshot ignored: ${this.options.formatError(error)}`);
			});
		}
		session.state = "ended";
		session.updatedAt = nowIso();
		this.#sessionSpeakers.delete(session.id);
		this.#sessionHealth.delete(session.id);
		const stop = this.#sessionStops.get(session.id);
		try {
			const cleanup = await this.#sessionCleanup.cleanup({
				sessionId: session.id,
				stop,
				keepBrowserTab: options?.keepBrowserTab === true,
				releaseBrowser: async () => await this.options.releaseBrowserTab(session)
			});
			session.browserLeft = cleanup.browserLeft;
			const browser = this.options.getBrowser(session);
			if (cleanup.browserLeft === true && browser?.health) this.options.setBrowserHealth(session, {
				...browser.health,
				inCall: false,
				micMuted: void 0,
				manualActionRequired: false,
				manualActionReason: void 0,
				manualActionMessage: void 0,
				speechReady: false,
				speechBlockedReason: void 0,
				speechBlockedMessage: void 0
			});
			if (cleanup.stopSettled && stop && this.#sessionStops.get(session.id) === stop) this.#sessionStops.delete(session.id);
			if (cleanup.complete) this.#dropRuntimeHandles(session.id);
			return {
				found: true,
				session,
				...cleanup.browserLeft === void 0 ? {} : { browserLeft: cleanup.browserLeft }
			};
		} finally {
			if (firstAttempt) {
				this.#transcriptStore.retire(session.id);
				this.#transcriptStore.finishFinalizing(session.id);
			}
		}
	}
	#meetingKey(transport, url) {
		return `${transport}:${this.options.normalizeMeetingUrlForReuse(url) ?? url}`;
	}
	#inheritBrowserTabOwnership(params) {
		if (!params.tab) return;
		return [...this.#sessions.values()].some((session) => {
			const browser = this.options.getBrowser(session);
			const browserTab = browser?.tab;
			return session.transport === params.transport && this.options.sameMeetingUrl(session.url, params.meetingUrl) && browser?.nodeId === params.nodeId && browserTab?.targetId === params.tab?.targetId && browserTab?.openedByPlugin === true;
		}) ? {
			...params.tab,
			openedByPlugin: true
		} : params.tab;
	}
	async #settleRetainedBrowserTabs(retained, adopted) {
		let settled = true;
		for (let index = 0; index < retained.length;) {
			const retainedTab = retained[index];
			if (!retainedTab) break;
			const { session, tab } = retainedTab;
			const browser = this.options.getBrowser(session);
			if (adopted?.transport === session.transport && adopted.nodeId === browser?.nodeId && adopted.tab.targetId === tab.targetId) {
				this.options.setBrowserTab(session, void 0);
				retained.splice(index, 1);
				continue;
			}
			if (await this.options.releaseBrowserTab(session) === false) {
				settled = false;
				index += 1;
				continue;
			}
			retained.splice(index, 1);
		}
		return settled;
	}
	async #rollbackFailedJoinSession(session) {
		await this.#sessionCleanup.rollbackFailedJoin({
			sessionId: session.id,
			browserLeft: session.browserLeft,
			leave: async () => await this.#leaveSession(session),
			hasBrowserTab: () => Boolean(this.options.getBrowser(session)?.tab),
			releaseBrowser: async () => await this.options.releaseBrowserTab(session),
			formatError: (error) => this.options.formatError(error),
			warn: (message) => this.options.logger.warn(`${this.options.logScope} ${message}`),
			onBrowserResult: (left) => session.browserLeft = left,
			onComplete: () => this.#dropRuntimeHandles(session.id)
		});
	}
	async #settleRetainedBrowserTabsAfterFailure(retained) {
		for (let attempt = 0; attempt < 2 && retained.length > 0; attempt += 1) try {
			if (await this.#settleRetainedBrowserTabs(retained)) return;
		} catch (error) {
			this.options.logger.warn(`${this.options.logScope} retained browser cleanup failed: ${this.options.formatError(error)}`);
		}
		if (retained.length > 0) this.options.logger.warn(`${this.options.logScope} retained browser cleanup incomplete after failed join`);
	}
	#attachRuntimeHandles(session, handles) {
		if (handles.stop) this.#sessionStops.set(session.id, handles.stop);
		if (handles.speak) this.#sessionSpeakers.set(session.id, handles.speak);
		if (handles.getHealth) this.#sessionHealth.set(session.id, handles.getHealth);
	}
	#dropRuntimeHandles(sessionId) {
		this.#sessionStops.delete(sessionId);
		this.#sessionSpeakers.delete(sessionId);
		this.#sessionHealth.delete(sessionId);
	}
	#isManagedBrowserSession(session) {
		const browser = this.options.getBrowser(session);
		return Boolean(this.options.isBrowserTransport(session.transport) && browser?.launched);
	}
	#evaluateSpeechReadiness(session) {
		const speech = this.options.messages.speech;
		const browser = this.options.getBrowser(session);
		if (!this.options.isTalkBackMode(session.mode) || !browser) return { ready: true };
		if (!this.#isManagedBrowserSession(session)) return browser.hasAudioBridge ? { ready: true } : {
			ready: false,
			reason: speech.audioBridgeUnavailableReason,
			message: speech.audioBridgeUnavailable
		};
		const health = browser.health;
		if (health?.manualActionRequired) return {
			ready: false,
			reason: health.manualActionReason ?? speech.browserUnverifiedReason,
			message: health.manualActionMessage ?? speech.manualActionFallback
		};
		if (health?.inCall === true) {
			if (health.micMuted !== false) {
				const muted = health.micMuted === true;
				return {
					ready: false,
					reason: muted ? speech.microphoneMutedReason : speech.browserUnverifiedReason,
					message: muted ? speech.microphoneMuted : speech.browserUnverified
				};
			}
			return browser.hasAudioBridge ? { ready: true } : {
				ready: false,
				reason: speech.audioBridgeUnavailableReason,
				message: speech.audioBridgeUnavailable
			};
		}
		if (health?.inCall === false) return {
			ready: false,
			reason: speech.notInCallReason,
			message: speech.notInCall
		};
		return {
			ready: false,
			reason: speech.browserUnverifiedReason,
			message: speech.browserUnverified
		};
	}
	#noteSession(session, note) {
		session.notes = [...session.notes.filter((item) => item !== note), note];
	}
};
//#endregion
//#region src/meeting-bot/browser-act-lock.ts
const browserActLock = new MeetingSessionJoinLock();
const BROWSER_ACT_TIMEOUT_MESSAGE = "Meeting browser operation timed out waiting for browser tab control.";
async function runMeetingBrowserAct(params) {
	const waitMs = Math.floor(params.deadline - Date.now());
	if (waitMs <= 0) throw new Error(BROWSER_ACT_TIMEOUT_MESSAGE);
	let acquired = false;
	let markAcquired;
	const acquisition = new Promise((resolve) => {
		markAcquired = resolve;
	});
	let timeout;
	const queued = browserActLock.run(params.targetId, async () => {
		const remainingMs = Math.floor(params.deadline - Date.now());
		if (remainingMs <= 0) throw new Error(BROWSER_ACT_TIMEOUT_MESSAGE);
		acquired = true;
		clearTimeout(timeout);
		markAcquired?.();
		return await params.operation(remainingMs);
	});
	queued.catch(() => void 0);
	const expired = new Promise((_resolve, reject) => {
		timeout = setTimeout(() => {
			if (!acquired) reject(/* @__PURE__ */ new Error(BROWSER_ACT_TIMEOUT_MESSAGE));
		}, waitMs);
	});
	try {
		await Promise.race([acquisition, expired]);
	} finally {
		clearTimeout(timeout);
	}
	return await queued;
}
//#endregion
//#region src/meeting-bot/browser-navigation-errors.ts
function isMeetingBrowserTransientNavigationError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /execution context was destroyed.*navigation|cannot find context with specified id/i.test(message);
}
//#endregion
//#region src/meeting-bot/browser-request.ts
function asMeetingBrowserTabs(result) {
	const record = result && typeof result === "object" ? result : {};
	return Array.isArray(record.tabs) ? record.tabs : [];
}
function readMeetingBrowserTab(result) {
	return result && typeof result === "object" ? result : void 0;
}
function resolveBrowserGatewayTimeoutMs(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs) ?? 1;
}
async function callLocalBrowserRequest(params) {
	return await callGatewayFromCli("browser.request", {
		json: true,
		timeout: String(resolveBrowserGatewayTimeoutMs(params.timeoutMs))
	}, {
		method: params.method,
		path: params.path,
		body: params.body,
		timeoutMs: params.timeoutMs
	}, { progress: false });
}
async function resolveLocalMeetingBrowserRequest(runtime) {
	if (!await runtime.gateway.isAvailable()) return callLocalBrowserRequest;
	return async (params) => await runtime.gateway.request("browser.request", {
		method: params.method,
		path: params.path,
		body: params.body,
		timeoutMs: params.timeoutMs
	}, {
		timeoutMs: resolveBrowserGatewayTimeoutMs(params.timeoutMs),
		scopes: ["operator.admin"]
	});
}
//#endregion
//#region src/meeting-bot/browser-controller.ts
function mergeBrowserNotes(browser, notes) {
	if (!browser || notes.length === 0) return browser;
	return {
		...browser,
		notes: uniqueStrings([...browser.notes ?? [], ...notes])
	};
}
function applyMeetingManualAction(browser, manual) {
	return browser && manual ? {
		...browser,
		manualActionRequired: true,
		manualActionReason: manual.reason,
		manualActionMessage: manual.message
	} : browser;
}
async function prepareMeetingBrowserTab(params) {
	const plan = params.adapter.browser.permissions({
		allowMicrophone: params.allowMicrophone,
		meetingUrl: params.meetingUrl
	});
	if (!plan) return params.adapter.browser.permissionNotes({ allowMicrophone: params.allowMicrophone });
	try {
		const result = await params.callBrowser({
			method: "POST",
			path: "/permissions/grant",
			body: {
				origin: plan.origin,
				permissions: plan.permissions,
				optionalPermissions: plan.optionalPermissions,
				targetId: params.targetId,
				timeoutMs: Math.min(params.timeoutMs, 5e3)
			},
			timeoutMs: Math.min(params.timeoutMs, 5e3)
		});
		return params.adapter.browser.permissionNotes({
			allowMicrophone: params.allowMicrophone,
			result
		});
	} catch (error) {
		return params.adapter.browser.permissionNotes({
			allowMicrophone: params.allowMicrophone,
			error
		});
	}
}
function selectReusableTab(params) {
	const matches = params.tabs.filter((tab) => params.adapter.urls.isRecoverableTab(tab, params.url));
	const accountHint = params.adapter.urls.accountHint(params.url);
	return {
		matches,
		tab: matches.find((candidate) => params.adapter.urls.isPreferredJoinUrl(candidate.url) && (!accountHint || params.adapter.urls.accountHint(candidate.url) === accountHint))
	};
}
async function openMeetingWithBrowser(params) {
	if (!params.config.launch) return { launched: false };
	const timeoutMs = Math.max(1e3, params.config.joinTimeoutMs);
	let targetId;
	let tab;
	let openSession = params.session;
	let openedByPlugin = false;
	if (params.config.reuseExistingTab) {
		const tabs = asMeetingBrowserTabs(await params.callBrowser({
			method: "GET",
			path: "/tabs",
			timeoutMs: Math.min(timeoutMs, 5e3)
		}));
		const reusable = selectReusableTab({
			adapter: params.adapter,
			tabs,
			url: params.session.url
		});
		tab = reusable.tab;
		if (!tab && !params.adapter.urls.accountHint(params.session.url)) {
			const fallbackUrl = reusable.matches.find((candidate) => candidate.url)?.url;
			if (fallbackUrl) openSession = {
				...params.session,
				url: fallbackUrl
			};
		}
		targetId = tab?.targetId;
		if (tab && targetId) await params.callBrowser({
			method: "POST",
			path: "/tabs/focus",
			body: { targetId },
			timeoutMs: Math.min(timeoutMs, 5e3)
		});
	}
	if (!targetId) {
		tab = readMeetingBrowserTab(await params.callBrowser({
			method: "POST",
			path: "/tabs/open",
			body: { url: params.adapter.urls.buildJoinUrl(openSession) },
			timeoutMs
		}));
		targetId = tab?.targetId;
		openedByPlugin = Boolean(targetId);
	}
	if (!targetId) return {
		launched: true,
		browser: {
			status: "browser-control",
			notes: [`Browser proxy opened ${params.adapter.browserLabel} but did not return a targetId.`],
			browserUrl: tab?.url,
			browserTitle: tab?.title
		}
	};
	const tabIdentity = {
		targetId,
		openedByPlugin
	};
	const allowMicrophone = params.adapter.browser.allowsMicrophone(params.session.mode);
	const permissionNotes = await prepareMeetingBrowserTab({
		adapter: params.adapter,
		allowMicrophone,
		callBrowser: params.callBrowser,
		meetingUrl: params.session.url,
		targetId,
		timeoutMs
	});
	const deadline = Date.now() + Math.max(0, params.config.waitForInCallMs);
	let browser = {
		status: "browser-control",
		browserUrl: tab?.url,
		browserTitle: tab?.title,
		notes: permissionNotes
	};
	let allowSessionAdoption = true;
	do {
		try {
			const adoptSession = allowSessionAdoption;
			allowSessionAdoption = false;
			const actionTimeoutMs = Math.min(timeoutMs, 1e4);
			const evaluated = await runMeetingBrowserAct({
				deadline: Date.now() + actionTimeoutMs,
				targetId,
				operation: async (remainingMs) => await params.callBrowser({
					method: "POST",
					path: "/act",
					body: {
						kind: "evaluate",
						targetId,
						fn: params.adapter.browser.buildStatusJoinScript({
							...params.session,
							allowSessionAdoption: adoptSession,
							autoJoin: params.config.autoJoin,
							captureCaptions: params.adapter.browser.captions.enabled(params.session.mode),
							guestName: params.config.guestName,
							waitForInCallMs: params.config.waitForInCallMs
						})
					},
					timeoutMs: remainingMs
				})
			});
			browser = mergeBrowserNotes(params.adapter.browser.parseStatus(evaluated) ?? browser, permissionNotes);
			const manual = browser ? params.adapter.browser.classifyManualAction(browser) : void 0;
			browser = applyMeetingManualAction(browser, manual);
			const shouldRetry = browser ? params.adapter.browser.shouldRetryJoinStatus?.(browser) === true : false;
			if (!shouldRetry && browser?.inCall === true && browser.manualActionRequired !== true && (!allowMicrophone || browser.micMuted !== true)) return {
				launched: true,
				browser,
				tab: tabIdentity
			};
			if (!shouldRetry && browser?.manualActionRequired === true) return {
				launched: true,
				browser,
				tab: tabIdentity
			};
		} catch (error) {
			if (isMeetingBrowserTransientNavigationError(error) && Date.now() < deadline) browser = mergeBrowserNotes(browser, [`${params.adapter.browserLabel} navigated while joining; retrying browser inspection.`]);
			else {
				const manual = params.adapter.browser.browserControlUnavailable(error);
				browser = {
					...browser,
					inCall: false,
					manualActionRequired: true,
					manualActionReason: manual.reason,
					manualActionMessage: manual.message,
					notes: [...permissionNotes, `Browser control could not inspect or auto-join ${params.adapter.browserLabel}: ${error instanceof Error ? error.message : String(error)}`]
				};
				break;
			}
		}
		const remainingWaitMs = deadline - Date.now();
		if (remainingWaitMs > 0) await new Promise((resolve) => {
			setTimeout(resolve, Math.min(750, remainingWaitMs));
		});
	} while (Date.now() < deadline);
	return {
		launched: true,
		browser,
		tab: tabIdentity
	};
}
function findRecoverableTab(params) {
	const candidates = params.tabs.filter((tab) => params.adapter.urls.isRecoverableTab(tab, params.requestedMeetingUrl));
	if (!params.requestedMeetingUrl) {
		const meetingCandidates = candidates.filter((tab) => params.adapter.urls.normalizeForReuse(tab.url));
		return meetingCandidates.find((tab) => params.adapter.urls.isPreferredJoinUrl(tab.url)) ?? meetingCandidates[0] ?? candidates[0];
	}
	const accountHint = params.adapter.urls.accountHint(params.requestedMeetingUrl);
	const accountCandidates = accountHint ? candidates.filter((tab) => params.adapter.urls.accountHint(tab.url) === accountHint) : candidates;
	return accountCandidates.find((tab) => params.adapter.urls.isPreferredJoinUrl(tab.url)) ?? accountCandidates[0];
}
async function inspectRecoverableTab(params) {
	const allowMicrophone = params.adapter.browser.allowsMicrophone(params.mode);
	const focusTimeoutMs = params.deadline === void 0 ? params.timeoutMs : Math.floor(params.deadline - Date.now());
	if (focusTimeoutMs <= 0) throw new Error("Meeting browser recovery timed out.");
	await params.callBrowser({
		method: "POST",
		path: "/tabs/focus",
		body: { targetId: params.targetId },
		timeoutMs: Math.min(focusTimeoutMs, 5e3)
	});
	const localeAction = params.adapter.urls.localeAction(params.tab);
	if (localeAction) return {
		found: true,
		targetId: params.targetId,
		tab: params.tab,
		browser: {
			status: "browser-control",
			browserUrl: params.tab.url,
			browserTitle: params.tab.title,
			manualActionRequired: true,
			manualActionReason: localeAction.reason,
			manualActionMessage: localeAction.message
		},
		message: localeAction.message
	};
	const permissionNotes = params.readOnly ? [] : await prepareMeetingBrowserTab({
		adapter: params.adapter,
		allowMicrophone,
		callBrowser: params.callBrowser,
		meetingUrl: params.requestedMeetingUrl ?? params.tab.url ?? "",
		targetId: params.targetId,
		timeoutMs: params.deadline === void 0 ? params.timeoutMs : Math.max(1, Math.floor(params.deadline - Date.now()))
	});
	const navigationNotes = [];
	const inspectionDeadline = params.deadline ?? Date.now() + Math.min(params.timeoutMs, 1e4);
	let allowSessionAdoption = params.allowSessionAdoption ?? false;
	let evaluated;
	for (;;) try {
		const adoptSession = allowSessionAdoption;
		allowSessionAdoption = false;
		evaluated = await runMeetingBrowserAct({
			deadline: inspectionDeadline,
			targetId: params.targetId,
			operation: async (remainingMs) => await params.callBrowser({
				method: "POST",
				path: "/act",
				body: {
					kind: "evaluate",
					targetId: params.targetId,
					fn: params.adapter.browser.buildStatusJoinScript({
						allowSessionAdoption: adoptSession,
						meetingSessionId: params.meetingSessionId ?? "",
						mode: params.mode,
						url: params.requestedMeetingUrl ?? params.tab.url ?? "",
						autoJoin: params.autoJoin ?? false,
						captureCaptions: params.adapter.browser.captions.enabled(params.mode),
						guestName: params.config.guestName,
						readOnly: params.readOnly,
						waitForInCallMs: params.config.waitForInCallMs
					})
				},
				timeoutMs: remainingMs
			})
		});
		break;
	} catch (error) {
		const remainingMs = inspectionDeadline - Date.now();
		if (!isMeetingBrowserTransientNavigationError(error) || remainingMs <= 0) throw error;
		navigationNotes.push(`${params.adapter.browserLabel} navigated while recovering; retrying browser inspection.`);
		await new Promise((resolve) => {
			setTimeout(resolve, Math.min(250, remainingMs));
		});
		if (Date.now() >= inspectionDeadline) throw error;
	}
	const browser = mergeBrowserNotes(params.adapter.browser.parseStatus(evaluated) ?? {
		status: "browser-control",
		browserUrl: params.tab.url,
		browserTitle: params.tab.title
	}, [...permissionNotes, ...navigationNotes]);
	const manual = browser ? params.adapter.browser.classifyManualAction(browser) : void 0;
	const recoveredBrowser = applyMeetingManualAction(browser, manual);
	const message = manual?.message ?? (recoveredBrowser?.inCall ? `Existing ${params.adapter.browserLabel} tab is in-call.` : `Existing ${params.adapter.browserLabel} tab focused.`);
	return {
		found: true,
		targetId: params.targetId,
		tab: params.tab,
		browser: recoveredBrowser,
		message
	};
}
async function recoverMeetingBrowserTab(params) {
	const configuredTimeoutMs = Math.max(1e3, params.config.joinTimeoutMs);
	const timeoutMs = params.timeoutMs === void 0 ? configuredTimeoutMs : Math.max(1, Math.min(configuredTimeoutMs, params.timeoutMs));
	const deadline = params.timeoutMs === void 0 ? void 0 : Date.now() + timeoutMs;
	const tabs = asMeetingBrowserTabs(await params.callBrowser({
		method: "GET",
		path: "/tabs",
		timeoutMs: deadline === void 0 ? Math.min(timeoutMs, 5e3) : Math.min(Math.max(1, Math.floor(deadline - Date.now())), 5e3)
	}));
	const trackedCandidate = params.trackedTargetId ? tabs.find((tab) => tab.targetId === params.trackedTargetId) : void 0;
	const trackedUrlHasMeetingIdentity = Boolean(params.adapter.urls.normalizeForReuse(trackedCandidate?.url));
	const trackedIdentityMatches = params.adapter.urls.isSameMeeting(params.trackedMeetingUrl, params.requestedMeetingUrl);
	const trackedUrlMatches = params.adapter.urls.isSameMeeting(trackedCandidate?.url, params.requestedMeetingUrl);
	const tab = (trackedCandidate && trackedIdentityMatches && (!trackedUrlHasMeetingIdentity || trackedUrlMatches) ? trackedCandidate : void 0) ?? findRecoverableTab({
		adapter: params.adapter,
		tabs,
		requestedMeetingUrl: params.requestedMeetingUrl
	});
	const targetId = tab?.targetId;
	if (!tab || !targetId) return {
		found: false,
		tab,
		message: params.requestedMeetingUrl ? `No existing ${params.adapter.browserLabel} tab matched ${params.requestedMeetingUrl}.` : `No existing ${params.adapter.browserLabel} tab found ${params.locationLabel}.`
	};
	return await inspectRecoverableTab({
		adapter: params.adapter,
		allowSessionAdoption: params.allowSessionAdoption,
		autoJoin: params.autoJoin,
		callBrowser: params.callBrowser,
		config: params.config,
		...deadline === void 0 ? {} : { deadline },
		meetingSessionId: params.meetingSessionId,
		mode: params.mode,
		readOnly: params.readOnly,
		requestedMeetingUrl: params.requestedMeetingUrl,
		timeoutMs,
		tab,
		targetId
	});
}
//#endregion
//#region src/meeting-bot/browser-session-control.ts
async function leaveMeetingInPage(params) {
	const deadline = Date.now() + params.timeoutMs;
	let clickedLeave = false;
	let clickedConfirmation = false;
	let ownershipRetained = false;
	do {
		const remainingMs = Math.floor(deadline - Date.now());
		if (remainingMs <= 0) throw new Error("Meeting browser leave timed out.");
		const evaluated = await params.callBrowser({
			method: "POST",
			path: "/act",
			body: {
				kind: "evaluate",
				targetId: params.targetId,
				fn: params.adapter.browser.buildSessionLeaveScript?.({
					leaveInitiated: clickedLeave,
					meetingSessionId: params.meetingSessionId ?? "",
					meetingUrl: params.meetingUrl
				}) ?? params.adapter.browser.buildLeaveScript(params.meetingUrl)
			},
			timeoutMs: remainingMs
		});
		const step = params.adapter.browser.parseLeaveResult(evaluated);
		clickedLeave ||= step.leaveAction === "leave";
		clickedConfirmation ||= step.leaveAction === "confirm";
		if (step.sessionMatched === false) {
			const stepOwnershipRetained = clickedLeave && step.sessionConflict !== true;
			if (step.departed || !stepOwnershipRetained) return {
				departed: stepOwnershipRetained ? step.departed : false,
				clickedLeave,
				clickedConfirmation,
				ownershipRetained: stepOwnershipRetained,
				sessionConflict: step.sessionConflict,
				sessionMatched: false,
				urlMatched: step.urlMatched
			};
			ownershipRetained = true;
		}
		if (step.departed || step.urlMatched !== true) return {
			departed: step.departed,
			clickedLeave,
			clickedConfirmation,
			...ownershipRetained && step.sessionConflict !== true ? { ownershipRetained: true } : {},
			urlMatched: step.urlMatched
		};
		if (!step.leaveAction && !clickedLeave) return {
			departed: false,
			clickedLeave,
			clickedConfirmation,
			urlMatched: true
		};
		if (!step.leaveAction) await new Promise((resolve) => {
			setTimeout(resolve, 100);
		});
	} while (Date.now() < deadline);
	return {
		departed: false,
		clickedLeave,
		clickedConfirmation,
		...ownershipRetained ? {
			ownershipRetained: true,
			sessionMatched: false
		} : {},
		urlMatched: true
	};
}
async function leaveMeetingWithBrowser(params) {
	if (!params.launch) return {
		left: false,
		note: "Browser leave skipped because chrome.launch is disabled."
	};
	const timeoutMs = Math.min(Math.max(1e3, params.timeoutMs), 5e3);
	const { targetId, openedByPlugin } = params.tab;
	try {
		if (!asMeetingBrowserTabs(await params.callBrowser({
			method: "GET",
			path: "/tabs",
			timeoutMs
		})).find((entry) => entry.targetId === targetId)) return {
			left: true,
			note: `${params.adapter.browserLabel} tab is already closed.`
		};
		let leaveResult;
		let tabClosed = false;
		try {
			const locked = await runMeetingBrowserAct({
				deadline: Date.now() + timeoutMs,
				targetId,
				operation: async (remainingMs) => {
					const operationDeadline = Date.now() + remainingMs;
					const closeReserveMs = openedByPlugin ? Math.min(1e3, Math.max(250, Math.floor(remainingMs / 4))) : 0;
					const result = await leaveMeetingInPage({
						adapter: params.adapter,
						callBrowser: params.callBrowser,
						meetingSessionId: params.meetingSessionId,
						meetingUrl: params.meetingUrl,
						targetId,
						timeoutMs: Math.max(1, remainingMs - closeReserveMs)
					});
					if (!(openedByPlugin && (result.urlMatched === true || result.departed) && (result.sessionMatched !== false || result.ownershipRetained === true))) return {
						leaveResult: result,
						tabClosed: false
					};
					const closeTimeoutMs = Math.floor(operationDeadline - Date.now());
					if (closeTimeoutMs <= 0) throw new Error("Meeting browser leave timed out before the tab could close.");
					await params.callBrowser({
						method: "DELETE",
						path: `/tabs/${targetId}`,
						timeoutMs: closeTimeoutMs
					});
					return {
						leaveResult: result,
						tabClosed: true
					};
				}
			});
			leaveResult = locked.leaveResult;
			tabClosed = locked.tabClosed;
		} catch (error) {
			return {
				left: false,
				note: `Browser control could not verify the ${params.adapter.browserLabel} tab before leaving: ${error instanceof Error ? error.message : String(error)}`
			};
		}
		if (leaveResult.urlMatched === false) return {
			left: true,
			note: `${params.adapter.browserLabel} tab moved away from this session; left its current page untouched.`
		};
		if (leaveResult.sessionMatched === false && leaveResult.ownershipRetained !== true) {
			if (leaveResult.sessionConflict !== true) return {
				left: false,
				note: `Browser control could not verify that the ${params.adapter.browserLabel} tab still belongs to this OpenClaw meeting session.`
			};
			return {
				left: true,
				note: `${params.adapter.browserLabel} tab belongs to another OpenClaw meeting session; left its current call untouched.`
			};
		}
		if (leaveResult.urlMatched !== true && !leaveResult.departed) return {
			left: false,
			note: "Browser control could not verify that the tracked tab still showed this meeting."
		};
		const { clickedLeave, departed } = leaveResult;
		return {
			left: openedByPlugin ? tabClosed : departed,
			note: openedByPlugin ? clickedLeave ? `Clicked ${params.adapter.browserLabel}'s Leave call button and closed the ${params.adapter.browserLabel} tab.` : `Closed the ${params.adapter.browserLabel} tab to leave the meeting (Leave call button was not found).` : departed ? `Clicked ${params.adapter.browserLabel}'s Leave call button; kept the reused browser tab open.` : clickedLeave ? `Clicked ${params.adapter.browserLabel}'s Leave call button, but could not verify departure; leave it manually.` : `Could not find ${params.adapter.browserLabel}'s Leave call button in the reused browser tab; leave it manually.`
		};
	} catch (error) {
		return {
			left: false,
			note: `Browser control could not leave the ${params.adapter.browserLabel} tab: ${error instanceof Error ? error.message : String(error)}`
		};
	}
}
async function readMeetingTranscriptWithBrowser(params) {
	const result = await runMeetingBrowserAct({
		deadline: Date.now() + Math.max(1, params.timeoutMs),
		targetId: params.tab.targetId,
		operation: async (remainingMs) => await params.callBrowser({
			method: "POST",
			path: "/act",
			body: {
				kind: "evaluate",
				targetId: params.tab.targetId,
				fn: params.adapter.browser.captions.buildTranscriptScript({
					finalize: params.finalize,
					meetingSessionId: params.meetingSessionId,
					meetingUrl: params.meetingUrl
				})
			},
			timeoutMs: remainingMs
		})
	});
	const snapshot = params.adapter.browser.captions.parseTranscript(result);
	if (snapshot.urlMatched === false) throw new Error(`The tracked ${params.adapter.browserLabel} tab no longer shows this session's meeting URL.`);
	if (snapshot.sessionMatched === false) throw new Error(`The tracked ${params.adapter.browserLabel} tab now belongs to another OpenClaw meeting session.`);
	return {
		droppedLines: snapshot.droppedLines,
		...snapshot.epoch ? { epoch: snapshot.epoch } : {},
		lines: snapshot.lines
	};
}
//#endregion
//#region src/meeting-bot/browser-node.ts
function isMeetingBrowserNode(node, adapter) {
	const commands = Array.isArray(node.commands) ? node.commands : [];
	const caps = Array.isArray(node.caps) ? node.caps : [];
	return node.connected === true && commands.includes(adapter.nodeCommandName) && (commands.includes("browser.proxy") || caps.includes("browser"));
}
function matchesRequestedNode(node, requested) {
	return [
		node.nodeId,
		node.displayName,
		node.remoteIp
	].some((value) => value === requested);
}
function formatNodeLabel(node) {
	const parts = [
		node.displayName,
		node.nodeId,
		node.remoteIp
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" / ") : "unknown node";
}
function describeNodeUsabilityIssues(node, adapter) {
	const commands = Array.isArray(node.commands) ? node.commands : [];
	const caps = Array.isArray(node.caps) ? node.caps : [];
	const issues = [];
	if (node.connected !== true) issues.push("offline");
	if (!commands.includes(adapter.nodeCommandName)) issues.push(`missing ${adapter.nodeCommandName}`);
	if (!commands.includes("browser.proxy") && !caps.includes("browser")) issues.push("missing browser.proxy/browser capability");
	return issues;
}
async function listMeetingNodes(runtime, adapter, params) {
	try {
		return params ? await runtime.nodes.list(params) : await runtime.nodes.list();
	} catch (error) {
		throw new Error(`${adapter.displayName} node inventory unavailable`, { cause: error });
	}
}
async function resolveMeetingBrowserNodeInfo(params) {
	const requested = params.requestedNode?.trim();
	if (requested) {
		const matches = (await listMeetingNodes(params.runtime, params.adapter)).nodes.filter((node) => matchesRequestedNode(node, requested));
		if (matches.length > 1) throw new Error(`Configured ${params.adapter.displayName} node ${requested} is ambiguous (${matches.length} matches). Pin ${params.adapter.nodeConfigPath} to a unique node id, display name, or remote IP.`);
		const [node] = matches;
		if (!node) throw new Error(`Configured ${params.adapter.displayName} node ${requested} was not found. Run \`openclaw nodes status\` and start or approve the Chrome node.`);
		if (isMeetingBrowserNode(node, params.adapter)) return node;
		throw new Error(`Configured ${params.adapter.displayName} node ${requested} is not usable (${formatNodeLabel(node)}): ${describeNodeUsabilityIssues(node, params.adapter).join("; ")}. Start or reinstall \`openclaw node run\` on that Chrome host, approve pairing, and allow ${params.adapter.nodeCommandName} plus browser.proxy.`);
	}
	const nodes = (await listMeetingNodes(params.runtime, params.adapter, { connected: true })).nodes.filter((node) => isMeetingBrowserNode(node, params.adapter));
	const [node] = nodes;
	if (!node) throw new Error(`No connected ${params.adapter.displayName}-capable node with browser proxy. Run \`openclaw node run\` on the Chrome host with browser proxy enabled, approve pairing, and allow ${params.adapter.nodeCommandName} plus browser.proxy.`);
	if (nodes.length === 1) return node;
	throw new Error(`Multiple ${params.adapter.displayName}-capable nodes connected. Set ${params.adapter.nodeConfigPath}.`);
}
async function resolveMeetingBrowserNode(params) {
	const node = await resolveMeetingBrowserNodeInfo(params);
	if (!node.nodeId) throw new Error(`${params.adapter.displayName} node did not include a node id.`);
	return node.nodeId;
}
function unwrapNodeInvokePayload(raw, adapter) {
	const record = raw && typeof raw === "object" ? raw : {};
	if (typeof record.payloadJSON === "string" && record.payloadJSON.trim()) try {
		return JSON.parse(record.payloadJSON);
	} catch (error) {
		throw new Error(`${adapter.displayName} browser proxy returned malformed payloadJSON.`, { cause: error });
	}
	if ("payload" in record) return record.payload;
	return raw;
}
function parseBrowserProxyResult(raw, adapter) {
	const payload = unwrapNodeInvokePayload(raw, adapter);
	const proxy = payload && typeof payload === "object" ? payload : void 0;
	if (!proxy || !("result" in proxy)) throw new Error(`${adapter.displayName} browser proxy returned an invalid result.`);
	return proxy.result;
}
async function callMeetingBrowserProxyOnNode(params) {
	return parseBrowserProxyResult(await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: "browser.proxy",
		params: {
			method: params.method,
			path: params.path,
			body: params.body,
			timeoutMs: params.timeoutMs
		},
		timeoutMs: addTimerTimeoutGraceMs(params.timeoutMs) ?? 1,
		scopes: ["operator.admin"]
	}), params.adapter);
}
function createMeetingBrowserNodeCaller(params) {
	return async (request) => await callMeetingBrowserProxyOnNode({
		runtime: params.runtime,
		adapter: params.adapter,
		nodeId: params.nodeId,
		...request
	});
}
//#endregion
//#region src/meeting-bot/agent-consult.ts
function resolveMeetingRealtimeTools(policy) {
	return resolveRealtimeVoiceAgentConsultTools(policy);
}
async function submitMeetingConsultWorkingResponse(params) {
	if (!params.session.bridge.supportsToolResultContinuation) return;
	await params.session.submitToolResult(params.callId, buildRealtimeVoiceAgentConsultWorkingResponse(params.label), { willContinue: true });
}
async function consultMeetingAgent(params) {
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : resolveDefaultAgentId(params.config);
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey) ?? `agent:${agentId}:main`;
	const sessionKey = `agent:${agentId}:subagent:${params.surface.id}:${params.meetingSessionId}`;
	return await consultRealtimeVoiceAgent({
		cfg: params.config,
		agentRuntime: params.runtime.agent,
		logger: params.logger,
		agentId,
		sessionKey,
		messageProvider: params.surface.provider,
		lane: params.surface.lane,
		runIdPrefix: `${params.surface.id}:${params.meetingSessionId}`,
		spawnedBy: requesterSessionKey,
		contextMode: "fork",
		args: params.args,
		transcript: params.transcript,
		surface: params.surface.surface,
		userLabel: params.surface.userLabel,
		assistantLabel: params.surface.assistantLabel,
		questionSourceLabel: params.surface.questionSourceLabel,
		toolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(params.toolPolicy),
		extraSystemPrompt: params.surface.extraSystemPrompt
	});
}
async function handleMeetingRealtimeConsultToolCall(params) {
	const callId = params.event.callId || params.event.itemId;
	if (params.strategy !== "bidi") {
		const error = `Tool "${params.event.name}" is only available in bidi realtime strategy`;
		await params.session.submitToolResult(callId, { error });
		params.onTalkEvent?.({
			type: "tool.error",
			callId,
			payload: {
				name: params.event.name,
				error
			},
			final: true
		});
		return;
	}
	if (params.event.name !== "openclaw_agent_consult") {
		const error = `Tool "${params.event.name}" not available`;
		await params.session.submitToolResult(callId, { error });
		params.onTalkEvent?.({
			type: "tool.error",
			callId,
			payload: {
				name: params.event.name,
				error
			},
			final: true
		});
		return;
	}
	await submitMeetingConsultWorkingResponse({
		session: params.session,
		callId,
		label: params.surface.workingResponseLabel
	});
	params.onTalkEvent?.({
		type: "tool.progress",
		callId,
		payload: {
			name: params.event.name,
			status: "working"
		}
	});
	let result;
	try {
		result = await consultMeetingAgent({
			surface: params.surface,
			config: params.config,
			runtime: params.runtime,
			logger: params.logger,
			agentId: params.agentId,
			toolPolicy: params.toolPolicy,
			meetingSessionId: params.meetingSessionId,
			requesterSessionKey: params.requesterSessionKey,
			args: params.event.args,
			transcript: params.transcript
		});
	} catch (error) {
		const message = formatErrorMessage$1(error);
		await params.session.submitToolResult(callId, { error: message });
		params.onTalkEvent?.({
			type: "tool.error",
			callId,
			payload: {
				name: params.event.name,
				error: message
			},
			final: true
		});
		return;
	}
	await params.session.submitToolResult(callId, result);
	params.onTalkEvent?.({
		type: "tool.result",
		callId,
		payload: {
			name: params.event.name,
			result
		},
		final: true
	});
}
//#endregion
//#region src/meeting-bot/voice-call-gateway.ts
function createMeetingVoiceCallGateway(params) {
	if (!params.config.gatewayUrl) return {
		trustedPluginIdentity: true,
		request: (method, requestParams) => params.runtime.gateway.request(method, requestParams, { timeoutMs: params.config.requestTimeoutMs })
	};
	return {
		trustedPluginIdentity: false,
		async request(method, requestParams) {
			const client = await params.connectClient(params);
			try {
				return await client.request(method, requestParams, { timeoutMs: params.config.requestTimeoutMs });
			} finally {
				await client.stopAndWait({ timeoutMs: 1e3 }).catch(() => {});
			}
		}
	};
}
function isMeetingVoiceCallMissingError(error) {
	const message = formatErrorMessage$1(error).toLowerCase();
	return message.includes("call not found") || message.includes("call is not active");
}
async function joinMeetingViaVoiceCallGateway(params) {
	if (params.agentId && params.agentId !== "main" && !params.gateway.trustedPluginIdentity) throw new Error(`Per-agent Voice Call routing requires the local Gateway runtime. Remove ${params.surface.configPath} or omit agent routing.`);
	params.logger?.info(`${params.surface.logScope} Delegating ${params.surface.providerLabel} join to Voice Call (dtmf=${params.dtmfSequence ? "pre-connect" : "none"}, intro=${params.message ? "delayed" : "none"})`);
	const start = await params.gateway.request("voicecall.start", {
		to: params.dialInNumber,
		mode: "conversation",
		...params.dtmfSequence ? { dtmfSequence: params.dtmfSequence } : {},
		...params.requesterSessionKey ? { requesterSessionKey: params.requesterSessionKey } : {},
		...params.agentId && params.gateway.trustedPluginIdentity ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	if (!start.callId) throw new Error(start.error || "voicecall.start did not return callId");
	params.logger?.info(`${params.surface.logScope} Voice Call ${params.surface.providerLabel} phone leg started: callId=${start.callId}`);
	const dtmfSent = Boolean(params.dtmfSequence);
	if (dtmfSent) params.logger?.info(`${params.surface.logScope} ${params.surface.meetingLabel} DTMF queued before realtime connect: callId=${start.callId} digits=${params.dtmfSequence?.length ?? 0}`);
	let introSent = false;
	if (params.message) {
		const delayMs = params.dtmfSequence ? params.config.postDtmfSpeechDelayMs : 0;
		if (delayMs > 0) {
			params.logger?.info(`${params.surface.logScope} Waiting ${delayMs}ms after ${params.surface.meetingLabel} DTMF before speaking intro for callId=${start.callId}`);
			await sleep(delayMs);
		}
		let spoken;
		try {
			spoken = await params.gateway.request("voicecall.speak", {
				callId: start.callId,
				allowTwimlFallback: false,
				message: params.message
			});
		} catch (error) {
			params.logger?.warn?.(`${params.surface.logScope} Skipped intro speech because realtime bridge was not ready: ${formatErrorMessage$1(error)}`);
			spoken = { success: false };
		}
		if (spoken.success === false) params.logger?.warn?.(`${params.surface.logScope} Skipped intro speech because realtime bridge was not ready: ${spoken.error || "voicecall.speak failed"}`);
		else {
			introSent = true;
			params.logger?.info(`${params.surface.logScope} Intro speech requested after ${params.surface.meetingLabel} dial sequence: callId=${start.callId}`);
		}
	}
	return {
		callId: start.callId,
		dtmfSent,
		introSent
	};
}
async function endMeetingVoiceCallGatewayCall(params) {
	try {
		await params.gateway.request("voicecall.end", { callId: params.callId });
	} catch (error) {
		if (!isMeetingVoiceCallMissingError(error)) throw error;
	}
}
async function getMeetingVoiceCallGatewayCall(params) {
	return await params.gateway.request("voicecall.status", { callId: params.callId });
}
async function speakMeetingViaVoiceCallGateway(params) {
	const spoken = await params.gateway.request("voicecall.speak", {
		callId: params.callId,
		message: params.message
	});
	if (spoken.success === false) throw new Error(spoken.error || "voicecall.speak failed");
}
//#endregion
//#region src/meeting-bot/setup-checks.ts
function createMeetingSetupStatus(checks) {
	return {
		ok: checks.every((check) => check.ok),
		checks
	};
}
function addMeetingSetupCheck(status, check) {
	return createMeetingSetupStatus([...status.checks, check]);
}
//#endregion
//#region src/meeting-bot/sox-audio-command.ts
function formatArgs(format) {
	return [
		"-t",
		"raw",
		"-r",
		String(format.sampleRate),
		"-c",
		String(format.channels),
		"-e",
		format.encoding,
		"-b",
		String(format.bits),
		...format.endian === "little" ? ["-L"] : format.endian === "big" ? ["-B"] : [],
		"-"
	];
}
function withBuffer(executable, bufferBytes, args) {
	return [
		executable,
		"-q",
		"--buffer",
		String(bufferBytes),
		...args
	];
}
function buildMeetingSoxAudioCommands(params) {
	const wire = formatArgs(params.format);
	if (!params.device) return {
		inputCommand: withBuffer(params.inputExecutable ?? "rec", params.bufferBytes, wire),
		outputCommand: withBuffer(params.outputExecutable ?? "play", params.bufferBytes, wire)
	};
	const deviceType = params.deviceType ?? "coreaudio";
	return {
		inputCommand: withBuffer(params.inputExecutable ?? "sox", params.bufferBytes, [
			"-t",
			deviceType,
			params.device,
			...wire
		]),
		outputCommand: withBuffer(params.outputExecutable ?? "sox", params.bufferBytes, [
			...wire,
			"-t",
			deviceType,
			params.device
		])
	};
}
//#endregion
//#region src/meeting-bot/node-invoke-policy.ts
function asRecord$1(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function readString$1(value) {
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
function readPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function copyCommand(command) {
	return command && command.length > 0 ? [...command] : void 0;
}
function denied(options, message) {
	return {
		ok: false,
		code: options.deniedCode,
		message
	};
}
function approved(params) {
	return {
		approved: true,
		params
	};
}
function buildStartParams(params, options) {
	let url;
	try {
		url = options.normalizeUrl(params.url);
	} catch (error) {
		return {
			approved: false,
			result: denied(options, error instanceof Error ? error.message : `${options.commandName} start requires url`)
		};
	}
	const mode = readString$1(params.mode);
	if (mode && !options.supportedModes.has(mode)) return {
		approved: false,
		result: denied(options, `${options.commandName} start mode is unsupported: ${mode}`)
	};
	const startParams = {
		action: "start",
		url,
		launch: params.launch === false ? false : options.start.launch,
		browserProfile: options.start.browserProfile,
		joinTimeoutMs: options.start.joinTimeoutMs
	};
	if (mode) startParams.mode = mode;
	for (const key of [
		"audioInputCommand",
		"audioOutputCommand",
		"audioBridgeCommand",
		"audioBridgeHealthCommand"
	]) {
		const command = copyCommand(options.start[key]);
		if (command) startParams[key] = command;
	}
	return approved(startParams);
}
function denyMissing(options, action, field) {
	return {
		approved: false,
		result: denied(options, `${options.commandName} ${action} requires ${field}`)
	};
}
function buildForwardParams(params, options) {
	const action = readString$1(params.action);
	switch (action) {
		case "setup": return approved({ action });
		case "status": {
			const bridgeId = readString$1(params.bridgeId);
			return approved(bridgeId ? {
				action,
				bridgeId
			} : { action });
		}
		case "list": {
			const forwarded = { action };
			const url = readString$1(params.url);
			const mode = readString$1(params.mode);
			if (url) try {
				forwarded.url = options.normalizeUrl(url);
			} catch (error) {
				return {
					approved: false,
					result: denied(options, error instanceof Error ? error.message : `${options.commandName} list url`)
				};
			}
			if (mode) forwarded.mode = mode;
			return approved(forwarded);
		}
		case "stopByUrl": {
			const forwarded = { action };
			const url = readString$1(params.url);
			const mode = readString$1(params.mode);
			const exceptBridgeId = readString$1(params.exceptBridgeId);
			if (!url) return denyMissing(options, action, "url");
			try {
				forwarded.url = options.normalizeUrl(url);
			} catch (error) {
				return {
					approved: false,
					result: denied(options, error instanceof Error ? error.message : `${options.commandName} stopByUrl url`)
				};
			}
			if (mode) forwarded.mode = mode;
			if (exceptBridgeId) forwarded.exceptBridgeId = exceptBridgeId;
			return approved(forwarded);
		}
		case "pullAudio": {
			const forwarded = { action };
			const bridgeId = readString$1(params.bridgeId);
			const timeoutMs = readPositiveNumber(params.timeoutMs);
			if (!bridgeId) return denyMissing(options, action, "bridgeId");
			forwarded.bridgeId = bridgeId;
			if (timeoutMs) forwarded.timeoutMs = timeoutMs;
			return approved(forwarded);
		}
		case "pushAudio": {
			const forwarded = { action };
			const bridgeId = readString$1(params.bridgeId);
			const base64 = readString$1(params.base64);
			if (!bridgeId) return denyMissing(options, action, "bridgeId");
			if (!base64) return denyMissing(options, action, "base64");
			forwarded.bridgeId = bridgeId;
			forwarded.base64 = base64;
			return approved(forwarded);
		}
		case "clearAudio": {
			const bridgeId = readString$1(params.bridgeId);
			return bridgeId ? approved({
				action,
				bridgeId
			}) : denyMissing(options, action, "bridgeId");
		}
		case "stop": {
			const bridgeId = readString$1(params.bridgeId);
			return approved(bridgeId ? {
				action,
				bridgeId
			} : { action });
		}
		default: return null;
	}
}
function createMeetingBrowserNodeInvokePolicy(options) {
	return {
		commands: [options.commandName],
		dangerous: true,
		async handle(ctx) {
			if (ctx.command !== options.commandName) return denied(options, `unsupported ${options.displayName} node command: ${ctx.command}`);
			const params = asRecord$1(ctx.params);
			const decision = readString$1(params.action) === "start" ? buildStartParams(params, options) : buildForwardParams(params, options) ?? {
				approved: false,
				result: denied(options, `unsupported ${options.commandName} action`)
			};
			if (!decision.approved) return decision.result;
			return await ctx.invokeNode({ params: decision.params });
		}
	};
}
//#endregion
//#region src/meeting-bot/node-audio-pull-waiters.ts
/** Internal pull-wait ownership used by the node-host long poll. */
var MeetingNodeAudioPullWaiters = class {
	#waiters = /* @__PURE__ */ new Set();
	get size() {
		return this.#waiters.size;
	}
	async wait(timeoutMs) {
		let wake;
		const ready = new Promise((resolve) => {
			wake = resolve;
			this.#waiters.add(wake);
		});
		try {
			await Promise.race([setTimeout$1(timeoutMs), ready]);
		} finally {
			this.#waiters.delete(wake);
		}
	}
	wake() {
		const waiters = [...this.#waiters];
		this.#waiters.clear();
		for (const waiter of waiters) waiter();
	}
};
//#endregion
//#region src/meeting-bot/node-host.ts
const NODE_BRIDGE_TERMINATION_GRACE_MS = 2e3;
function readStringArray(value) {
	if (!Array.isArray(value)) return;
	const result = value.filter((entry) => typeof entry === "string" && entry.length > 0);
	return result.length > 0 ? result : void 0;
}
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function readString(value) {
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
function formatErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
function readNumber(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
function runCommandWithTimeout(argv, timeoutMs) {
	const [command, ...args] = argv;
	if (!command) throw new Error("command must not be empty");
	const result = spawnSync(command, args, {
		encoding: "utf8",
		timeout: timeoutMs
	});
	const errorMessage = result.error ? formatErrorMessage(result.error) : "";
	const stderr = errorMessage && result.stderr ? `${errorMessage}: ${result.stderr}` : errorMessage || result.stderr || (result.signal ? `terminated by ${result.signal}` : "");
	return {
		code: typeof result.status === "number" ? result.status : 1,
		stdout: result.stdout ?? "",
		stderr
	};
}
function splitCommand(argv) {
	const [command, ...args] = argv;
	if (!command) throw new Error("audio command must not be empty");
	return {
		command,
		args
	};
}
function createMeetingNodeHost(options) {
	const sessions = /* @__PURE__ */ new Map();
	const wake = (session) => {
		session.waiters.wake();
	};
	const retireOutputProcess = (session, outputProcess) => {
		const stopPromise = terminateMeetingBridgeProcess(outputProcess, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS });
		session.retiredOutputStops.add(stopPromise);
		stopPromise.finally(() => {
			session.retiredOutputStops.delete(stopPromise);
		});
	};
	const stopSession = (session) => {
		if (session.stopPromise) return session.stopPromise;
		session.closed = true;
		session.closedAt = (/* @__PURE__ */ new Date()).toISOString();
		wake(session);
		session.stopPromise = Promise.all([
			terminateMeetingBridgeProcess(session.input, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS }),
			terminateMeetingBridgeProcess(session.output, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS }),
			...session.retiredOutputStops
		]).then(() => void 0);
		return session.stopPromise;
	};
	const attachOutputProcessHandlers = (session, outputProcess) => {
		const stopIfCurrent = () => {
			if (session.output === outputProcess) stopSession(session);
		};
		outputProcess.on("exit", stopIfCurrent);
		outputProcess.on("error", stopIfCurrent);
		outputProcess.stdin?.on("error", stopIfCurrent);
		outputProcess.stderr?.on("error", stopIfCurrent);
	};
	const startOutputProcess = (command) => spawn(command.command, command.args, { stdio: [
		"pipe",
		"ignore",
		"pipe"
	] });
	const startCommandPair = (params) => {
		const input = splitCommand(params.inputCommand);
		const output = splitCommand(params.outputCommand);
		const session = {
			id: `${options.bridgeIdPrefix}${randomUUID()}`,
			url: params.url,
			mode: params.mode,
			outputCommand: output,
			chunks: [],
			waiters: new MeetingNodeAudioPullWaiters(),
			closed: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastInputBytes: 0,
			lastOutputBytes: 0,
			clearCount: 0,
			retiredOutputStops: /* @__PURE__ */ new Set()
		};
		const outputProcess = startOutputProcess(output);
		const inputProcess = spawn(input.command, input.args, { stdio: [
			"ignore",
			"pipe",
			"pipe"
		] });
		session.input = inputProcess;
		session.output = outputProcess;
		inputProcess.stdout?.on("data", (chunk) => {
			const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			session.lastInputAt = (/* @__PURE__ */ new Date()).toISOString();
			session.lastInputBytes += audio.byteLength;
			session.chunks.push(audio);
			if (session.chunks.length > 200) session.chunks.splice(0, session.chunks.length - 200);
			wake(session);
		});
		const stop = () => {
			stopSession(session);
		};
		inputProcess.on("exit", stop);
		inputProcess.on("error", stop);
		inputProcess.stdout?.on("error", stop);
		inputProcess.stderr?.on("error", stop);
		attachOutputProcessHandlers(session, outputProcess);
		sessions.set(session.id, session);
		return session;
	};
	const pullAudio = async (params) => {
		const bridgeId = readString(params.bridgeId);
		if (!bridgeId) throw new Error("bridgeId required");
		const session = sessions.get(bridgeId);
		if (!session) throw new Error(`unknown bridgeId: ${bridgeId}`);
		const timeoutMs = Math.min(readNumber(params.timeoutMs, 250), 2e3);
		if (session.chunks.length === 0 && !session.closed) await session.waiters.wait(timeoutMs);
		const chunk = session.chunks.shift();
		return {
			bridgeId,
			closed: session.closed,
			base64: chunk ? chunk.toString("base64") : void 0
		};
	};
	const pushAudio = (params) => {
		const bridgeId = readString(params.bridgeId);
		const base64 = readString(params.base64);
		if (!bridgeId || !base64) throw new Error("bridgeId and base64 required");
		const session = sessions.get(bridgeId);
		if (!session || session.closed) throw new Error(`bridge is not open: ${bridgeId}`);
		const audio = Buffer.from(base64, "base64");
		session.lastOutputAt = (/* @__PURE__ */ new Date()).toISOString();
		session.lastOutputBytes += audio.byteLength;
		try {
			session.output?.stdin?.write(audio);
		} catch {
			stopSession(session);
			throw new Error(`bridge is not open: ${bridgeId}`);
		}
		return {
			bridgeId,
			ok: true
		};
	};
	const clearAudio = (params) => {
		const bridgeId = readString(params.bridgeId);
		if (!bridgeId) throw new Error("bridgeId required");
		const session = sessions.get(bridgeId);
		if (!session || session.closed) throw new Error(`bridge is not open: ${bridgeId}`);
		const previousOutput = session.output;
		const outputProcess = startOutputProcess(session.outputCommand);
		session.output = outputProcess;
		attachOutputProcessHandlers(session, outputProcess);
		session.clearCount += 1;
		session.lastClearAt = (/* @__PURE__ */ new Date()).toISOString();
		retireOutputProcess(session, previousOutput);
		return {
			bridgeId,
			ok: true,
			clearCount: session.clearCount
		};
	};
	const startBrowser = (params) => {
		const url = options.normalizeUrl(params.url);
		const timeoutMs = readNumber(params.joinTimeoutMs, 3e4);
		const mode = readString(params.mode);
		let bridgeId;
		let audioBridge;
		if (mode && options.talkBackModes.has(mode)) {
			options.assertAudioAvailable(Math.min(timeoutMs, 1e4));
			const healthCommand = readStringArray(params.audioBridgeHealthCommand);
			if (healthCommand) {
				const health = runCommandWithTimeout(healthCommand, timeoutMs);
				if (health.code !== 0) throw new Error(`Chrome audio bridge health check failed: ${health.stderr || health.stdout || health.code}`);
			}
			const bridgeCommand = readStringArray(params.audioBridgeCommand);
			if (bridgeCommand) {
				if (mode === options.agentMode) throw new Error("Chrome agent mode requires audioInputCommand and audioOutputCommand so OpenClaw can run STT and regular TTS directly.");
				const bridge = runCommandWithTimeout(bridgeCommand, timeoutMs);
				if (bridge.code !== 0) throw new Error(`failed to start Chrome audio bridge: ${bridge.stderr || bridge.stdout || bridge.code}`);
				audioBridge = { type: "external-command" };
			} else {
				bridgeId = startCommandPair({
					inputCommand: readStringArray(params.audioInputCommand) ?? [...options.defaultAudioInputCommand],
					outputCommand: readStringArray(params.audioOutputCommand) ?? [...options.defaultAudioOutputCommand],
					url,
					mode
				}).id;
				audioBridge = { type: "node-command-pair" };
			}
		}
		if (params.launch !== false) {
			const argv = [
				"open",
				"-a",
				options.browser.application,
				url
			];
			const browserProfile = readString(params.browserProfile);
			if (browserProfile) argv.push(...options.browser.buildProfileArgs(browserProfile));
			const result = runCommandWithTimeout(argv, timeoutMs);
			if (result.code !== 0) {
				if (bridgeId) {
					const session = sessions.get(bridgeId);
					if (session) stopSession(session);
				}
				throw new Error(`failed to launch Chrome for ${options.browserLabel}: ${result.stderr || result.stdout || result.code}`);
			}
		}
		return {
			launched: params.launch !== false,
			bridgeId,
			audioBridge,
			browser: params.launch !== false ? {
				status: options.browser.openedStatus,
				browserUrl: url,
				notes: options.browser.openedNotes
			} : void 0
		};
	};
	const bridgeStatus = (params) => {
		const bridgeId = readString(params.bridgeId);
		const session = bridgeId ? sessions.get(bridgeId) : void 0;
		return { bridge: session ? {
			bridgeId,
			closed: session.closed,
			createdAt: session.createdAt,
			lastInputAt: session.lastInputAt,
			lastOutputAt: session.lastOutputAt,
			lastClearAt: session.lastClearAt,
			lastInputBytes: session.lastInputBytes,
			lastOutputBytes: session.lastOutputBytes,
			clearCount: session.clearCount,
			queuedInputChunks: session.chunks.length
		} : bridgeId ? {
			bridgeId,
			closed: true
		} : void 0 };
	};
	const summarizeSession = (session) => ({
		bridgeId: session.id,
		url: session.url,
		mode: session.mode,
		closed: session.closed,
		createdAt: session.createdAt,
		closedAt: session.closedAt,
		lastInputAt: session.lastInputAt,
		lastOutputAt: session.lastOutputAt,
		lastInputBytes: session.lastInputBytes,
		lastOutputBytes: session.lastOutputBytes
	});
	const listSessions = (params) => {
		const urlKey = options.normalizeMeetingKey(readString(params.url));
		const mode = readString(params.mode);
		return { bridges: [...sessions.values()].filter((session) => !session.closed).filter((session) => !urlKey || options.normalizeMeetingKey(session.url) === urlKey).filter((session) => !mode || session.mode === mode).map(summarizeSession) };
	};
	const stopSessionsByUrl = async (params) => {
		const urlKey = options.normalizeMeetingKey(readString(params.url));
		if (!urlKey) throw new Error("url required");
		const mode = readString(params.mode);
		const exceptBridgeId = readString(params.exceptBridgeId);
		let stopped = 0;
		const stopping = [];
		for (const [bridgeId, session] of sessions) {
			if (exceptBridgeId && bridgeId === exceptBridgeId) continue;
			if (options.normalizeMeetingKey(session.url) !== urlKey) continue;
			if (mode && session.mode !== mode) continue;
			const wasClosed = session.closed;
			stopping.push({
				bridgeId,
				session,
				stopPromise: stopSession(session)
			});
			if (!wasClosed) stopped += 1;
		}
		await Promise.all(stopping.map(({ stopPromise }) => stopPromise));
		for (const { bridgeId, session } of stopping) if (sessions.get(bridgeId) === session) sessions.delete(bridgeId);
		return {
			ok: true,
			stopped
		};
	};
	const stopBrowser = async (params) => {
		const bridgeId = readString(params.bridgeId);
		if (!bridgeId) return {
			ok: true,
			stopped: false
		};
		const session = sessions.get(bridgeId);
		if (!session) return {
			ok: true,
			stopped: false
		};
		await stopSession(session);
		if (sessions.get(bridgeId) === session) sessions.delete(bridgeId);
		return {
			ok: true,
			stopped: true
		};
	};
	return { async handleCommand(paramsJSON) {
		let raw = {};
		if (paramsJSON) try {
			raw = JSON.parse(paramsJSON);
		} catch {
			throw new Error(`${options.displayName} node host received malformed params JSON.`);
		}
		const params = asRecord(raw);
		const action = readString(params.action);
		let result;
		switch (action) {
			case "setup":
				options.assertAudioAvailable(1e4);
				result = { ok: true };
				break;
			case "start":
				result = startBrowser(params);
				break;
			case "status":
				result = bridgeStatus(params);
				break;
			case "list":
				result = listSessions(params);
				break;
			case "stopByUrl":
				result = await stopSessionsByUrl(params);
				break;
			case "pullAudio":
				result = await pullAudio(params);
				break;
			case "pushAudio":
				result = pushAudio(params);
				break;
			case "clearAudio":
				result = clearAudio(params);
				break;
			case "stop":
				result = await stopBrowser(params);
				break;
			default: throw new Error(`unsupported ${options.commandName} action`);
		}
		return JSON.stringify(result);
	} };
}
//#endregion
export { startMeetingRealtimeEngine as A, asMeetingBrowserTabs as C, createNodeMeetingRealtimeAudioTransport as D, MeetingSessionRuntime as E, convertMeetingTtsAudioForBridge as M, resolveMeetingRealtimeAudioFormat as N, createLocalMeetingRealtimeAudioTransport as O, recoverMeetingBrowserTab as S, resolveLocalMeetingBrowserRequest as T, resolveMeetingBrowserNode as _, createMeetingSetupStatus as a, readMeetingTranscriptWithBrowser as b, getMeetingVoiceCallGatewayCall as c, speakMeetingViaVoiceCallGateway as d, consultMeetingAgent as f, createMeetingBrowserNodeCaller as g, callMeetingBrowserProxyOnNode as h, addMeetingSetupCheck as i, convertMeetingBridgeAudioForStt as j, startMeetingAgentRealtimeEngine as k, isMeetingVoiceCallMissingError as l, resolveMeetingRealtimeTools as m, createMeetingBrowserNodeInvokePolicy as n, createMeetingVoiceCallGateway as o, handleMeetingRealtimeConsultToolCall as p, buildMeetingSoxAudioCommands as r, endMeetingVoiceCallGatewayCall as s, createMeetingNodeHost as t, joinMeetingViaVoiceCallGateway as u, resolveMeetingBrowserNodeInfo as v, readMeetingBrowserTab as w, openMeetingWithBrowser as x, leaveMeetingWithBrowser as y };
