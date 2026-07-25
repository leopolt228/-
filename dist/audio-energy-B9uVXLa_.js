import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-COWbwBfI.js";
import { E as parseAgentSessionKey } from "./session-key-Drrs61Fd.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-S7z_Yn4H.js";
import { n as deliveryContextFromSession, o as normalizeDeliveryContext } from "./delivery-context.shared-D6zu5SGz.js";
import { bt as beginSessionWorkAdmission, ut as parseSessionThreadInfoFast } from "./store-DDuGv_UJ.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-Vx3ij-ME.js";
import { a as isModelSelectionLocked, r as ModelSelectionLockedError } from "./model-overrides-BlzAR7Nc.js";
import { n as forkSessionEntryFromParent } from "./session-fork-DrD0yo6D.js";
import { E as createRealtimeVoiceForcedConsultCoordinator, N as recordTalkObservabilityEvent, a as recordRealtimeVoiceBridgeEvent, b as collectRealtimeVoiceAgentConsultVisibleText, i as isLikelyRealtimeVoiceAssistantEchoTranscript, j as createTalkSessionController, n as getRealtimeVoiceBridgeEventHealth, o as recordRealtimeVoiceTranscript, r as getRealtimeVoiceTranscriptHealth, s as createRealtimeVoiceBridgeSession, t as extendRealtimeVoiceOutputEchoSuppression, v as buildRealtimeVoiceAgentConsultPrompt } from "./session-log-runtime-GBoG4Ecc.js";
import { randomUUID } from "node:crypto";
//#region src/talk/output-activity-tracker.ts
/** Create a fresh output activity tracker for a realtime voice session. */
function createRealtimeVoiceOutputActivityTracker(options = {}) {
	const now = options.now ?? Date.now;
	let audioMs = 0;
	let chunks = 0;
	let sourceAudioBytes = 0;
	let sinkAudioBytes = 0;
	let playbackStarted = false;
	let streamEnding = false;
	let lastAudioAt;
	let playbackStartedAt;
	const snapshot = () => ({
		audioMs,
		chunks,
		sourceAudioBytes,
		sinkAudioBytes,
		playbackStarted,
		streamEnding,
		...lastAudioAt === void 0 ? {} : { lastAudioAt },
		...playbackStartedAt === void 0 ? {} : { playbackStartedAt }
	});
	return {
		markStreamOpened() {
			streamEnding = false;
			playbackStarted = false;
			playbackStartedAt = void 0;
			lastAudioAt = void 0;
		},
		markStreamEnding() {
			streamEnding = true;
		},
		markPlaybackStarted() {
			if (playbackStarted) return;
			playbackStarted = true;
			playbackStartedAt = now();
		},
		markAudio(delta) {
			audioMs += Math.max(0, delta.audioMs ?? 0);
			sourceAudioBytes += Math.max(0, delta.sourceAudioBytes ?? 0);
			sinkAudioBytes += Math.max(0, delta.sinkAudioBytes ?? 0);
			chunks += 1;
			lastAudioAt = now();
		},
		reset() {
			audioMs = 0;
			chunks = 0;
			sourceAudioBytes = 0;
			sinkAudioBytes = 0;
			playbackStarted = false;
			streamEnding = false;
			lastAudioAt = void 0;
			playbackStartedAt = void 0;
		},
		isActive(sinkActive = false) {
			return sinkActive || chunks > 0;
		},
		isInterruptible(sinkActive = false) {
			return sinkActive || chunks > 0 || audioMs > 0;
		},
		elapsedPlaybackMs() {
			return playbackStartedAt === void 0 ? 0 : now() - playbackStartedAt;
		},
		playbackWatchdogDelayMs({ marginMs, minMs = 1e3 }) {
			if (playbackStartedAt === void 0 || audioMs <= 0) return;
			return Math.max(minMs, audioMs - (now() - playbackStartedAt) + marginMs);
		},
		snapshot
	};
}
//#endregion
//#region src/talk/agent-consult-runtime.ts
/**
* Fails closed when a realtime consult would cross a model-selection lock.
*/
function assertRealtimeVoiceAgentConsultModelSelectionUnlocked(params) {
	const candidates = /* @__PURE__ */ new Map();
	const remember = (sessionKey, fallbackAgentId, storePath) => {
		const candidateAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? fallbackAgentId;
		const candidateStorePath = storePath ?? params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, { agentId: candidateAgentId });
		candidates.set(`${candidateStorePath}\u0000${sessionKey}`, {
			sessionKey,
			storePath: candidateStorePath
		});
	};
	remember(params.sessionKey, params.agentId, params.storePath);
	const requesterSessionKey = params.spawnedBy?.trim();
	if (requesterSessionKey) {
		const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId ?? params.agentId;
		remember(requesterSessionKey, requesterAgentId);
		const { baseSessionKey } = parseSessionThreadInfoFast(requesterSessionKey);
		if (baseSessionKey && baseSessionKey !== requesterSessionKey) remember(baseSessionKey, requesterAgentId);
	}
	for (const { sessionKey, storePath } of candidates.values()) if (isModelSelectionLocked(params.agentRuntime.session.getSessionEntry({
		storePath,
		sessionKey,
		readConsistency: "latest"
	}))) throw new ModelSelectionLockedError();
}
function resolveRealtimeVoiceAgentSandboxSessionKey(agentId, sessionKey) {
	const trimmed = sessionKey.trim();
	if (trimmed.toLowerCase().startsWith("agent:")) return trimmed;
	return `agent:${agentId}:${trimmed}`;
}
function hasRoutableDeliveryContext(context) {
	return Boolean(context?.channel && context?.to);
}
function resolveDeliverySessionFields(context) {
	const normalized = normalizeDeliveryContext(context);
	if (!normalized?.channel || !normalized.to) return {};
	return {
		deliveryContext: normalized,
		lastChannel: normalized.channel,
		lastTo: normalized.to,
		lastAccountId: normalized.accountId,
		lastThreadId: normalized.threadId
	};
}
function resolveRealtimeVoiceAgentDeliveryContext(params) {
	const requesterSessionKey = params.spawnedBy?.trim();
	try {
		const candidates = [];
		if (requesterSessionKey) {
			const { baseSessionKey } = parseSessionThreadInfoFast(requesterSessionKey);
			candidates.push(...[requesterSessionKey, baseSessionKey].filter((key) => Boolean(key)));
		}
		candidates.push(params.sessionKey);
		for (const key of candidates) {
			const context = deliveryContextFromSession(params.agentRuntime.session.getSessionEntry({
				storePath: params.storePath,
				sessionKey: key
			}));
			if (hasRoutableDeliveryContext(context)) return context;
		}
	} catch {}
}
async function resolveRealtimeVoiceAgentConsultSessionEntry(params) {
	const now = Date.now();
	const deliveryFields = resolveDeliverySessionFields(params.deliveryContext);
	const requesterSessionKey = params.spawnedBy?.trim();
	const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
	const shouldFork = params.contextMode === "fork" && requesterSessionKey && (!requesterAgentId || requesterAgentId === params.agentId);
	let forkDecisionWarning;
	let patched = null;
	if (shouldFork) {
		const forked = await forkSessionEntryFromParent({
			storePath: params.storePath,
			parentSessionKey: requesterSessionKey,
			agentId: params.agentId,
			config: params.cfg,
			sessionKey: params.sessionKey,
			fallbackEntry: {
				sessionId: "",
				updatedAt: now
			},
			skipForkWhen: (entry) => Boolean(entry.sessionId?.trim()),
			skipPatch: () => ({
				...deliveryFields,
				updatedAt: now
			}),
			patch: () => ({
				...deliveryFields,
				spawnedBy: requesterSessionKey,
				updatedAt: now
			})
		});
		if (forked.status === "forked" || forked.status === "skipped") {
			if (forked.status === "skipped" && forked.decision?.status === "skip") forkDecisionWarning = forked.decision.message;
			if (forked.sessionEntry.sessionId?.trim()) patched = forked.sessionEntry;
		}
	}
	patched ??= await params.agentRuntime.session.patchSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		fallbackEntry: {
			sessionId: "",
			updatedAt: now
		},
		update: async (entry) => {
			if (entry.sessionId?.trim()) return {
				...deliveryFields,
				updatedAt: now
			};
			return {
				...deliveryFields,
				sessionId: randomUUID(),
				...requesterSessionKey ? { spawnedBy: requesterSessionKey } : {},
				updatedAt: now
			};
		}
	});
	if (forkDecisionWarning) params.logger.warn(`[talk] ${forkDecisionWarning}`);
	if (patched?.sessionId?.trim()) return patched;
	throw new Error("realtime voice agent consult session could not be initialized");
}
/**
* Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
*/
async function consultRealtimeVoiceAgent(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
	const agentDir = params.agentRuntime.resolveAgentDir(params.cfg, agentId);
	const workspaceDir = params.agentRuntime.resolveAgentWorkspaceDir(params.cfg, agentId);
	const storePath = params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, { agentId });
	const initialSessionEntry = params.agentRuntime.session.getSessionEntry({
		storePath,
		sessionKey: params.sessionKey,
		readConsistency: "latest"
	});
	const modelLockParams = {
		cfg: params.cfg,
		agentRuntime: params.agentRuntime,
		agentId,
		sessionKey: params.sessionKey,
		spawnedBy: params.spawnedBy,
		storePath
	};
	assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
	const lifecycleAbortController = new AbortController();
	const sessionWorkAdmission = await beginSessionWorkAdmission({
		scope: storePath,
		identities: [params.sessionKey, initialSessionEntry?.sessionId],
		onInterrupt: () => lifecycleAbortController.abort(/* @__PURE__ */ new Error("Realtime voice agent consult interrupted by a session lifecycle change.")),
		assertAllowed: () => {
			const currentEntry = params.agentRuntime.session.getSessionEntry({
				storePath,
				sessionKey: params.sessionKey,
				readConsistency: "latest"
			});
			if (initialSessionEntry ? !currentEntry || currentEntry.sessionId !== initialSessionEntry.sessionId : Boolean(currentEntry)) throw new Error(`Session "${params.sessionKey}" changed while starting work. Retry.`);
			const archivedSessionError = resolveSessionWorkStartError(params.sessionKey, currentEntry);
			if (archivedSessionError) throw new Error(archivedSessionError);
			assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
		}
	});
	try {
		return await sessionWorkAdmission.run(async () => {
			await params.agentRuntime.ensureAgentWorkspace({ dir: workspaceDir });
			const resolvedDeliveryContext = resolveRealtimeVoiceAgentDeliveryContext({
				agentRuntime: params.agentRuntime,
				storePath,
				sessionKey: params.sessionKey,
				spawnedBy: params.spawnedBy
			});
			const sessionEntry = await resolveRealtimeVoiceAgentConsultSessionEntry({
				agentId,
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				spawnedBy: params.spawnedBy,
				contextMode: params.contextMode,
				deliveryContext: resolvedDeliveryContext,
				storePath,
				agentRuntime: params.agentRuntime,
				logger: params.logger
			});
			const consultDeliveryContext = resolvedDeliveryContext ?? deliveryContextFromSession(sessionEntry);
			const sessionId = sessionEntry.sessionId;
			assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
			const result = await params.agentRuntime.runEmbeddedAgent({
				sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: {
					agentId,
					sessionId,
					sessionKey: params.sessionKey,
					storePath
				},
				sandboxSessionKey: resolveRealtimeVoiceAgentSandboxSessionKey(agentId, params.sessionKey),
				agentId,
				spawnedBy: params.spawnedBy,
				messageProvider: consultDeliveryContext?.channel ?? params.messageProvider,
				agentAccountId: consultDeliveryContext?.accountId,
				messageTo: consultDeliveryContext?.to,
				messageThreadId: consultDeliveryContext?.threadId,
				currentChannelId: consultDeliveryContext?.to,
				currentThreadTs: consultDeliveryContext?.threadId != null ? String(consultDeliveryContext.threadId) : void 0,
				workspaceDir,
				config: params.cfg,
				prompt: buildRealtimeVoiceAgentConsultPrompt({
					args: params.args,
					transcript: params.transcript,
					surface: params.surface,
					userLabel: params.userLabel,
					assistantLabel: params.assistantLabel,
					questionSourceLabel: params.questionSourceLabel
				}),
				provider: params.provider,
				model: params.model,
				thinkLevel: params.thinkLevel ?? "high",
				fastMode: params.fastMode,
				verboseLevel: "off",
				reasoningLevel: "off",
				toolResultFormat: "plain",
				toolsAllow: params.toolsAllow,
				timeoutMs: params.timeoutMs ?? params.agentRuntime.resolveAgentTimeoutMs({ cfg: params.cfg }),
				runId: `${params.runIdPrefix}:${Date.now()}`,
				lane: params.lane,
				extraSystemPrompt: params.extraSystemPrompt ?? "You are the configured OpenClaw agent receiving delegated requests from a live voice bridge. Act on behalf of the user, use available tools when appropriate, and return a brief speakable result.",
				agentDir,
				abortSignal: lifecycleAbortController.signal
			});
			const text = collectRealtimeVoiceAgentConsultVisibleText(result.payloads ?? []);
			if (!text) {
				const reason = result.meta?.aborted ? "agent run aborted" : "agent returned no speakable text";
				params.logger.warn(`[talk] agent consult produced no answer: ${reason}`);
				return { text: params.fallbackText ?? "I need a moment to verify that before answering." };
			}
			return { text };
		});
	} finally {
		sessionWorkAdmission.release();
	}
}
//#endregion
//#region src/talk/agent-talkback-runtime.ts
/** Create a serial consult queue for realtime transcript talkback. */
function createRealtimeVoiceAgentTalkbackQueue(params) {
	let active = false;
	let pendingQuestions = [];
	let debounceTimer;
	let activeAbortController;
	const clearDebounceTimer = () => {
		if (!debounceTimer) return;
		clearTimeout(debounceTimer);
		debounceTimer = void 0;
	};
	const run = async (pending) => {
		const trimmed = pending.question.trim();
		if (!trimmed || params.isStopped()) return;
		if (active) {
			appendPendingQuestion(pendingQuestions, {
				question: trimmed,
				metadata: pending.metadata
			});
			return;
		}
		active = true;
		let nextQuestion = {
			question: trimmed,
			metadata: pending.metadata
		};
		let consultStartedAt;
		try {
			while (nextQuestion) {
				if (params.isStopped()) return;
				const currentQuestion = nextQuestion;
				consultStartedAt = Date.now();
				params.logger.info(`${params.logPrefix} consult: chars=${currentQuestion.question.length} queued=${pendingQuestions.length}`);
				activeAbortController = new AbortController();
				const result = await params.consult({
					question: currentQuestion.question,
					metadata: currentQuestion.metadata,
					responseStyle: params.responseStyle,
					signal: activeAbortController.signal
				});
				activeAbortController = void 0;
				const text = result.text.trim();
				params.logger.info(`${params.logPrefix} consult done: elapsedMs=${Date.now() - consultStartedAt} answerChars=${text.length} queued=${pendingQuestions.length}`);
				if (!params.isStopped() && text) params.deliver(text);
				nextQuestion = pendingQuestions.shift();
			}
		} catch (error) {
			activeAbortController = void 0;
			if (params.isStopped() || isAbortError(error)) return;
			const message = error instanceof Error ? error.message : String(error);
			const elapsedDetail = consultStartedAt === void 0 ? "" : ` elapsedMs=${Date.now() - consultStartedAt}`;
			params.logger.warn(`${params.logPrefix} consult failed:${elapsedDetail} ${message}`);
			params.deliver(params.fallbackText);
		} finally {
			active = false;
			const queuedQuestion = pendingQuestions.shift();
			if (queuedQuestion && !params.isStopped()) run(queuedQuestion);
		}
	};
	return {
		close: () => {
			clearDebounceTimer();
			pendingQuestions = [];
			activeAbortController?.abort();
		},
		enqueue: (question, metadata) => {
			const trimmed = question.trim();
			if (!trimmed || params.isStopped()) return;
			if (active) {
				appendPendingQuestion(pendingQuestions, {
					question: trimmed,
					metadata
				});
				params.logger.info(`${params.logPrefix} consult queued: chars=${trimmed.length} queued=${pendingQuestions.length}`);
				clearDebounceTimer();
				return;
			}
			appendPendingQuestion(pendingQuestions, {
				question: trimmed,
				metadata
			});
			clearDebounceTimer();
			debounceTimer = setTimeout(() => {
				debounceTimer = void 0;
				const queuedQuestion = pendingQuestions.shift();
				if (queuedQuestion && !params.isStopped()) run(queuedQuestion);
			}, params.debounceMs);
			debounceTimer.unref?.();
		}
	};
}
function appendPendingQuestion(queue, next) {
	const current = queue.at(-1);
	if (current && Object.is(current.metadata, next.metadata)) {
		current.question = `${current.question}\n${next.question}`;
		return;
	}
	queue.push(next);
}
function isAbortError(error) {
	return error instanceof Error && error.name === "AbortError";
}
//#endregion
//#region src/talk/realtime-session-harness.ts
function createRealtimeVoiceSessionHarness(params) {
	let closed = false;
	let bridge;
	let lastInputAt;
	let lastOutputAt;
	let lastSuppressedInputAt;
	let lastInputBytes = 0;
	let suppressedInputBytes = 0;
	let suppressInputUntilMs = 0;
	let lastOutputPlayableUntilMs = 0;
	let outputFlushGeneration = 0;
	const transcript = [];
	const bridgeEvents = [];
	const outputActivity = createRealtimeVoiceOutputActivityTracker();
	const forcedConsults = createRealtimeVoiceForcedConsultCoordinator(params.forcedConsults);
	const talk = createTalkSessionController({
		...params.talk,
		maxRecentEvents: 40
	}, { onEvent: (event) => {
		recordTalkObservabilityEvent(event);
		params.onTalkEvent?.(event);
	} });
	const talkback = params.talkback ? createRealtimeVoiceAgentTalkbackQueue({
		...params.talkback,
		isStopped: () => closed
	}) : void 0;
	const ensureTurn = () => talk.ensureTurn({ payload: params.talkPayloads.turnStarted() }).turnId;
	const flushOutput = (flush) => {
		outputFlushGeneration += 1;
		suppressInputUntilMs = 0;
		lastOutputPlayableUntilMs = 0;
		flush();
	};
	const harness = {
		forcedConsults,
		outputActivity,
		talk,
		talkback,
		transcript,
		close() {
			if (closed) return;
			closed = true;
			talkback?.close();
			forcedConsults.clear();
		},
		createBridge(bridgeParams) {
			bridge = createRealtimeVoiceBridgeSession({
				...bridgeParams,
				onTranscript: (role, text, isFinal) => {
					if (isFinal) harness.recordTranscript(role, text);
					bridgeParams.onTranscript?.(role, text, isFinal);
				},
				onEvent: (event) => {
					recordRealtimeVoiceBridgeEvent(bridgeEvents, event);
					bridgeParams.onEvent?.(event);
				}
			});
			return bridge;
		},
		emit: (input) => talk.emit(input),
		ensureTurn,
		endTurn(reason = "completed") {
			talk.endTurn({ payload: params.talkPayloads.turnEnded(reason) });
		},
		finishOutputAudio(reason) {
			talk.finishOutputAudio({ payload: params.talkPayloads.outputAudioDone(reason) });
		},
		flushOutput,
		getHealth(healthParams) {
			const output = outputActivity.snapshot();
			return {
				providerConnected: healthParams.providerConnected,
				realtimeReady: healthParams.realtimeReady,
				audioInputActive: lastInputBytes > 0,
				audioOutputActive: outputActivity.isActive(),
				lastInputAt,
				lastOutputAt,
				lastSuppressedInputAt,
				lastInputBytes,
				lastOutputBytes: output.sinkAudioBytes,
				suppressedInputBytes,
				...getRealtimeVoiceTranscriptHealth(transcript),
				...bridge ? getRealtimeVoiceBridgeEventHealth(bridgeEvents) : {},
				recentTalkEvents: talk.recentEvents.slice(-20).map((event) => ({
					id: event.id,
					type: event.type,
					sessionId: event.sessionId,
					turnId: event.turnId,
					seq: event.seq,
					timestamp: event.timestamp,
					final: event.final
				}))
			};
		},
		handleBargeIn(options, fallbackFlush) {
			suppressInputUntilMs = 0;
			const flushGeneration = outputFlushGeneration;
			bridge?.handleBargeIn(options);
			if (flushGeneration === outputFlushGeneration) flushOutput(fallbackFlush);
		},
		isLikelyAssistantEchoTranscript(text) {
			return params.echoSuppression ? isLikelyRealtimeVoiceAssistantEchoTranscript({
				transcript,
				text,
				lookbackMs: params.echoSuppression.transcriptLookbackMs
			}) : false;
		},
		isOutputPlaybackWindowActive() {
			return Date.now() <= Math.max(lastOutputPlayableUntilMs, suppressInputUntilMs);
		},
		recordInputAudio(audio) {
			if (Date.now() < suppressInputUntilMs) {
				lastSuppressedInputAt = (/* @__PURE__ */ new Date()).toISOString();
				suppressedInputBytes += audio.byteLength;
				return false;
			}
			lastInputAt = (/* @__PURE__ */ new Date()).toISOString();
			lastInputBytes += audio.byteLength;
			harness.emit({
				type: "input.audio.delta",
				turnId: ensureTurn(),
				payload: params.talkPayloads.inputAudioDelta(audio)
			});
			return true;
		},
		recordOutputAudio(audio, activity = {}) {
			const turnId = ensureTurn();
			talk.startOutputAudio({
				turnId,
				payload: params.talkPayloads.outputAudioStarted()
			});
			harness.emit({
				type: "output.audio.delta",
				turnId,
				payload: params.talkPayloads.outputAudioDelta(audio)
			});
			let audioMs = activity.audioMs;
			if (params.echoSuppression) {
				const suppression = extendRealtimeVoiceOutputEchoSuppression({
					audio,
					bytesPerMs: params.echoSuppression.bytesPerMs,
					tailMs: params.echoSuppression.tailMs,
					nowMs: Date.now(),
					lastOutputPlayableUntilMs,
					suppressInputUntilMs
				});
				lastOutputPlayableUntilMs = suppression.lastOutputPlayableUntilMs;
				suppressInputUntilMs = suppression.suppressInputUntilMs;
				audioMs ??= suppression.durationMs;
			}
			outputActivity.markAudio({
				audioMs,
				sourceAudioBytes: activity.sourceAudioBytes ?? audio.byteLength,
				sinkAudioBytes: activity.sinkAudioBytes ?? audio.byteLength
			});
			lastOutputAt = (/* @__PURE__ */ new Date()).toISOString();
		},
		recordTranscript: (role, text) => recordRealtimeVoiceTranscript(transcript, role, text)
	};
	return harness;
}
//#endregion
//#region src/talk/audio-codec.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const RESAMPLE_FILTER_TAPS = 31;
const RESAMPLE_CUTOFF_GUARD = .94;
const RESAMPLE_MAX_PRECOMPUTED_PHASES = 4096;
const RESAMPLE_HALF_TAPS = Math.floor(RESAMPLE_FILTER_TAPS / 2);
const RESAMPLE_WINDOW = Array.from({ length: RESAMPLE_FILTER_TAPS }, (_, tapIndex) => .5 - .5 * Math.cos(2 * Math.PI * tapIndex / (RESAMPLE_FILTER_TAPS - 1)));
const HOST_IS_LITTLE_ENDIAN = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
/** Clamp an intermediate sample to signed 16-bit PCM range. */
function clamp16(value) {
	return Math.max(-32768, Math.min(32767, value));
}
function canUseInt16View(buffer) {
	return HOST_IS_LITTLE_ENDIAN && buffer.byteOffset % Int16Array.BYTES_PER_ELEMENT === 0;
}
function int16View(buffer) {
	return new Int16Array(buffer.buffer, buffer.byteOffset, Math.floor(buffer.byteLength / Int16Array.BYTES_PER_ELEMENT));
}
function readInt16Samples(buffer) {
	if (canUseInt16View(buffer)) return int16View(buffer);
	const samples = new Int16Array(Math.floor(buffer.byteLength / Int16Array.BYTES_PER_ELEMENT));
	for (let i = 0; i < samples.length; i += 1) samples[i] = buffer.readInt16LE(i * Int16Array.BYTES_PER_ELEMENT);
	return samples;
}
function sinc(x) {
	if (x === 0) return 1;
	return Math.sin(Math.PI * x) / (Math.PI * x);
}
function gcd(left, right) {
	let a = Math.abs(Math.trunc(left));
	let b = Math.abs(Math.trunc(right));
	while (b !== 0) {
		const next = a % b;
		a = b;
		b = next;
	}
	return a || 1;
}
function buildResampleKernel(inputSampleRate, outputSampleRate, cutoffCyclesPerSample) {
	if (!Number.isInteger(inputSampleRate) || !Number.isInteger(outputSampleRate)) return;
	const divisor = gcd(inputSampleRate, outputSampleRate);
	const inputStep = inputSampleRate / divisor;
	const phaseCount = outputSampleRate / divisor;
	if (phaseCount > RESAMPLE_MAX_PRECOMPUTED_PHASES) return;
	return {
		coefficients: Array.from({ length: phaseCount }, (_, phaseIndex) => {
			const phase = phaseIndex / phaseCount;
			const phaseCoefficients = new Float64Array(RESAMPLE_FILTER_TAPS);
			for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
				const distance = tap - phase;
				const lowPass = 2 * cutoffCyclesPerSample * sinc(2 * cutoffCyclesPerSample * distance);
				const tapIndex = tap + RESAMPLE_HALF_TAPS;
				phaseCoefficients[tapIndex] = lowPass * (RESAMPLE_WINDOW[tapIndex] ?? 0);
			}
			return phaseCoefficients;
		}),
		inputStep,
		phaseCount
	};
}
function sampleBandlimitedWithCoefficients(input, center, coefficients) {
	let weighted = 0;
	let weightSum = 0;
	for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
		const sampleIndex = center + tap;
		if (sampleIndex < 0 || sampleIndex >= input.length) continue;
		const coeff = coefficients[tap + RESAMPLE_HALF_TAPS] ?? 0;
		weighted += (input[sampleIndex] ?? 0) * coeff;
		weightSum += coeff;
	}
	if (weightSum === 0) return input[Math.max(0, Math.min(input.length - 1, center))] ?? 0;
	return weighted / weightSum;
}
function sampleBandlimited(input, srcPos, cutoffCyclesPerSample) {
	const center = Math.floor(srcPos);
	let weighted = 0;
	let weightSum = 0;
	for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
		const sampleIndex = center + tap;
		if (sampleIndex < 0 || sampleIndex >= input.length) continue;
		const distance = sampleIndex - srcPos;
		const coeff = 2 * cutoffCyclesPerSample * sinc(2 * cutoffCyclesPerSample * distance) * (RESAMPLE_WINDOW[tap + RESAMPLE_HALF_TAPS] ?? 0);
		weighted += (input[sampleIndex] ?? 0) * coeff;
		weightSum += coeff;
	}
	if (weightSum === 0) return input[Math.max(0, Math.min(input.length - 1, Math.round(srcPos)))] ?? 0;
	return weighted / weightSum;
}
/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
function resamplePcm(input, inputSampleRate, outputSampleRate) {
	if (inputSampleRate === outputSampleRate) return input;
	const inputSamples = Math.floor(input.length / 2);
	if (inputSamples === 0) return Buffer.alloc(0);
	const ratio = inputSampleRate / outputSampleRate;
	const outputSamples = Math.floor(inputSamples / ratio);
	const output = Buffer.alloc(outputSamples * 2);
	const maxCutoff = .5;
	const downsampleCutoff = ratio > 1 ? maxCutoff / ratio : maxCutoff;
	const cutoffCyclesPerSample = Math.max(.01, downsampleCutoff * RESAMPLE_CUTOFF_GUARD);
	const kernel = buildResampleKernel(inputSampleRate, outputSampleRate, cutoffCyclesPerSample);
	const inputView = readInt16Samples(input);
	const outputView = canUseInt16View(output) ? int16View(output) : void 0;
	for (let i = 0; i < outputSamples; i += 1) {
		const sample = Math.round(kernel ? sampleBandlimitedWithCoefficients(inputView, Math.floor(i * inputSampleRate / outputSampleRate), expectDefined(kernel.coefficients[i * kernel.inputStep % kernel.phaseCount], "coefficients entry at (i * kernel.input step) % kernel.phase count") ?? kernel.coefficients[0]) : sampleBandlimited(inputView, i * ratio, cutoffCyclesPerSample));
		if (outputView) outputView[i] = clamp16(sample);
		else output.writeInt16LE(clamp16(sample), i * 2);
	}
	return output;
}
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
function resamplePcmTo8k(input, inputSampleRate) {
	return resamplePcm(input, inputSampleRate, TELEPHONY_SAMPLE_RATE);
}
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
function pcmToMulaw(pcm) {
	const pcmView = readInt16Samples(pcm);
	const mulaw = Buffer.alloc(pcmView.length);
	for (let i = 0; i < pcmView.length; i += 1) mulaw[i] = linearToMulaw(pcmView[i] ?? 0);
	return mulaw;
}
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
function mulawToPcm(mulaw) {
	const pcm = Buffer.alloc(mulaw.length * 2);
	const pcmView = canUseInt16View(pcm) ? int16View(pcm) : void 0;
	if (pcmView) {
		for (let i = 0; i < mulaw.length; i += 1) pcmView[i] = clamp16(mulawToLinear(mulaw[i] ?? 0));
		return pcm;
	}
	for (let i = 0; i < mulaw.length; i += 1) pcm.writeInt16LE(clamp16(mulawToLinear(mulaw[i] ?? 0)), i * 2);
	return pcm;
}
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
function convertPcmToMulaw8k(pcm, inputSampleRate) {
	return pcmToMulaw(resamplePcmTo8k(pcm, inputSampleRate));
}
function linearToMulaw(sampleInput) {
	let sample = sampleInput;
	const BIAS = 132;
	const CLIP = 32635;
	const sign = sample < 0 ? 128 : 0;
	if (sample < 0) sample = -sample;
	if (sample > CLIP) sample = CLIP;
	sample += BIAS;
	let exponent = 7;
	for (let expMask = 16384; (sample & expMask) === 0 && exponent > 0; exponent -= 1) expMask >>= 1;
	const mantissa = sample >> exponent + 3 & 15;
	return ~(sign | exponent << 4 | mantissa) & 255;
}
function mulawToLinear(value) {
	const muLaw = ~value & 255;
	const sign = muLaw & 128;
	const exponent = muLaw >> 4 & 7;
	let sample = ((muLaw & 15) << 3) + 132 << exponent;
	sample -= 132;
	return sign ? -sample : sample;
}
//#endregion
//#region src/talk/audio-energy.ts
const PCM16_MAX_AMPLITUDE = 32768;
const MULAW_LINEAR_SAMPLES = (() => {
	const encoded = Buffer.from([...Array(256).keys()]);
	const decoded = mulawToPcm(encoded);
	return Int16Array.from(encoded, (_, index) => decoded.readInt16LE(index * 2));
})();
/** Read RMS and absolute peak from complete little-endian signed PCM16 samples. */
function readPcm16AudioStats(audio) {
	let sumSquares = 0;
	let peak = 0;
	const samples = Math.floor(audio.byteLength / 2);
	for (let index = 0; index < samples; index += 1) {
		const sample = audio.readInt16LE(index * 2);
		peak = Math.max(peak, Math.abs(sample));
		sumSquares += sample * sample;
	}
	return {
		rms: samples > 0 ? Math.sqrt(sumSquares / samples) : 0,
		peak
	};
}
/** Calculate normalized RMS from G.711 mu-law bytes. */
function calculateMulawRms(muLaw) {
	if (muLaw.length === 0) return 0;
	let sumSquares = 0;
	for (const encoded of muLaw) {
		const normalized = (MULAW_LINEAR_SAMPLES[encoded] ?? 0) / PCM16_MAX_AMPLITUDE;
		sumSquares += normalized * normalized;
	}
	return Math.sqrt(sumSquares / muLaw.length);
}
/** Build an OR-threshold gate with optional sustained onset, silence hold, and cooldown. */
function createSpeechThresholdGate(options) {
	const speechFrames = Math.max(1, Math.floor(options.speechFrames ?? 1));
	const silenceFrames = Math.max(0, Math.floor(options.silenceFrames ?? 0));
	const cooldownMs = Math.max(0, options.cooldownMs ?? 0);
	let loudFrames = 0;
	let quietFrames = 0;
	let speaking = false;
	let lastTriggerAt = Number.NEGATIVE_INFINITY;
	return { accept(stats, acceptOptions = {}) {
		if (!(options.rmsThreshold !== void 0 && stats.rms >= options.rmsThreshold || options.peakThreshold !== void 0 && stats.peak >= options.peakThreshold)) {
			loudFrames = 0;
			if (speaking && ++quietFrames >= silenceFrames) speaking = false;
			return false;
		}
		quietFrames = 0;
		loudFrames += 1;
		if (speaking || loudFrames < speechFrames) return false;
		const nowMs = acceptOptions.nowMs ?? Date.now();
		if (nowMs - lastTriggerAt < cooldownMs || acceptOptions.onTrigger?.() === false) return false;
		lastTriggerAt = nowMs;
		speaking = silenceFrames > 0;
		if (!speaking) loudFrames = 0;
		return true;
	} };
}
//#endregion
export { mulawToPcm as a, resamplePcmTo8k as c, assertRealtimeVoiceAgentConsultModelSelectionUnlocked as d, consultRealtimeVoiceAgent as f, convertPcmToMulaw8k as i, createRealtimeVoiceSessionHarness as l, createSpeechThresholdGate as n, pcmToMulaw as o, createRealtimeVoiceOutputActivityTracker as p, readPcm16AudioStats as r, resamplePcm as s, calculateMulawRms as t, createRealtimeVoiceAgentTalkbackQueue as u };
