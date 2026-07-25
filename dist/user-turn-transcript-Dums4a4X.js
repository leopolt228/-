import { l as mimeTypeFromFilePath } from "./mime-De36NoRj.js";
import { u as persistSessionTranscriptTurn } from "./session-accessor-Mu3lv_Tl.js";
import { i as applyInputProvenanceToUserMessage, u as normalizeInputProvenance } from "./input-provenance-B6vSIOBi.js";
import path from "node:path";
//#region src/sessions/user-turn-transcript.ts
function buildRunUserTurnIdempotencyKey(runId) {
	return `${runId}:user`;
}
function normalizeOptionalText(value) {
	const normalized = value?.trim();
	return normalized ? normalized : void 0;
}
function normalizeTranscriptText(value) {
	return value ?? "";
}
function resolvePersistedUserTurnText(value) {
	const normalized = normalizeOptionalText(value);
	if (!normalized) return;
	return normalized;
}
function mediaTypeForTranscript(media) {
	return normalizeOptionalText(media.contentType) ?? normalizeOptionalText(media.kind) ?? "application/octet-stream";
}
function normalizeMediaEntryForTranscript(media) {
	const pathLocal = normalizeOptionalText(media.path) ?? normalizeOptionalText(media.url);
	if (!pathLocal) return;
	return {
		path: pathLocal,
		type: mediaTypeForTranscript(media)
	};
}
function normalizeOptionalTextArray(values) {
	return values?.map(normalizeOptionalText) ?? [];
}
const URL_LIKE_MEDIA_PATH_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function resolveTranscriptMediaType(params) {
	return params.explicitType ?? mimeTypeFromFilePath(params.mediaPath ?? params.mediaUrl);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	if (!fields) return [];
	const mediaFields = fields;
	const paths = normalizeOptionalTextArray(mediaFields.MediaPaths);
	const urls = normalizeOptionalTextArray(mediaFields.MediaUrls);
	const types = normalizeOptionalTextArray(mediaFields.MediaTypes);
	const singlePath = normalizeOptionalText(mediaFields.MediaPath);
	const singleUrl = normalizeOptionalText(mediaFields.MediaUrl);
	const singleType = normalizeOptionalText(mediaFields.MediaType);
	const workspaceDir = normalizeOptionalText(mediaFields.MediaWorkspaceDir);
	const mediaCount = Math.max(paths.length, urls.length, singlePath || singleUrl ? 1 : 0);
	const media = [];
	for (let index = 0; index < mediaCount; index += 1) {
		const rawPath = paths[index] ?? (index === 0 ? singlePath : void 0);
		const mediaPath = rawPath ? resolveTranscriptMediaPath(rawPath, workspaceDir) : void 0;
		const url = urls[index] ?? (index === 0 ? singleUrl : void 0);
		if (!mediaPath && !url) continue;
		media.push({
			...mediaPath ? { path: mediaPath } : {},
			...url ? { url } : {},
			contentType: resolveTranscriptMediaType({
				explicitType: types[index] ?? (index === 0 ? singleType : void 0),
				mediaPath,
				mediaUrl: url
			})
		});
	}
	return media;
}
function buildLateMediaAttachedText(message) {
	return (readOpenClawMessageMeta(message)?.lateMedia === true ? buildPersistedUserTurnMediaInputsFromFields(message) : []).map((entry) => `[media attached: ${entry.path ?? entry.url}]`).join("\n") || void 0;
}
function buildPersistedUserTurnMediaFields(media) {
	const normalized = (Array.isArray(media) ? media : []).map(normalizeMediaEntryForTranscript).filter((entry) => entry !== void 0);
	const paths = normalized.map((entry) => entry.path);
	if (paths.length === 0) return {};
	const types = normalized.map((entry) => entry.type);
	return {
		MediaPath: paths[0],
		MediaPaths: paths,
		MediaType: types[0],
		MediaTypes: types
	};
}
function buildUserTurnSenderMeta(sender) {
	const senderId = normalizeOptionalText(sender?.id);
	const senderName = normalizeOptionalText(sender?.name);
	const senderUsername = normalizeOptionalText(sender?.username);
	if (!senderId && !senderName && !senderUsername) return;
	return {
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {}
	};
}
function readOpenClawMessageMeta(message) {
	const meta = message["__openclaw"];
	return meta && typeof meta === "object" && !Array.isArray(meta) ? meta : void 0;
}
function buildPersistedUserTurnMessage(params) {
	const mediaFields = buildPersistedUserTurnMediaFields(params.media);
	const text = normalizeTranscriptText(params.text);
	const senderMeta = buildUserTurnSenderMeta(params.sender);
	const openClawMeta = {
		...params.senderIsOwner === void 0 ? {} : { senderIsOwner: params.senderIsOwner },
		...senderMeta,
		...params.transport ? { transport: params.transport } : {}
	};
	return applyInputProvenanceToUserMessage({
		role: "user",
		content: text,
		timestamp: params.timestamp ?? Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...mediaFields,
		...Object.keys(openClawMeta).length > 0 ? { __openclaw: openClawMeta } : {}
	}, params.provenance);
}
function resolvePersistedUserTurnMessage(params) {
	if (params.message) return params.message;
	if (!params.input) return;
	return buildPersistedUserTurnMessage(params.input);
}
function isUserMessage(message) {
	return message.role === "user";
}
function buildLateResolvedMediaMessage(params) {
	const admittedMedia = buildPersistedUserTurnMediaInputsFromFields(params.admittedMessage);
	const resolvedMedia = buildPersistedUserTurnMediaInputsFromFields(params.resolvedMessage);
	if (resolvedMedia.length === 0 || JSON.stringify(resolvedMedia) === JSON.stringify(admittedMedia)) return;
	const resolved = params.resolvedMessage;
	const admittedContent = params.admittedMessage?.content;
	const resolvedContent = params.resolvedMessage.content;
	let content = resolvedContent;
	if (resolvedContent === admittedContent) content = "";
	else if (Array.isArray(resolvedContent) && typeof admittedContent === "string") content = resolvedContent.filter((block) => {
		const textBlock = block;
		return textBlock?.type !== "text" || textBlock.text !== admittedContent;
	});
	const idempotencyKey = typeof resolved.idempotencyKey === "string" && resolved.idempotencyKey.length > 0 ? `${resolved.idempotencyKey}:late-media` : `late-media:${typeof resolved.timestamp === "number" ? resolved.timestamp : Date.now()}`;
	return {
		...resolved,
		content,
		idempotencyKey,
		__openclaw: {
			...readOpenClawMessageMeta(params.resolvedMessage),
			lateMedia: true
		}
	};
}
function isBeforeAgentRunBlockedMessage(message) {
	return message["__openclaw"]?.beforeAgentRunBlocked !== void 0;
}
function userMessageHasImageContent(message) {
	return isUserMessage(message) && Array.isArray(message.content) && message.content.some((block) => typeof block === "object" && block !== null && block.type === "image");
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || isBeforeAgentRunBlockedMessage(params.runtimeMessage)) return params.runtimeMessage;
	const runtimeMessage = params.runtimeMessage;
	const preparedMessage = params.preparedMessage;
	const runtimeMeta = readOpenClawMessageMeta(params.runtimeMessage);
	const preparedMeta = readOpenClawMessageMeta(params.preparedMessage);
	return {
		...runtimeMessage,
		...preparedMessage,
		...preparedMeta ? { __openclaw: {
			...runtimeMeta,
			...preparedMeta
		} } : {},
		...userMessageHasImageContent(params.runtimeMessage) ? { content: params.runtimeMessage.content } : {}
	};
}
/** Restores only auth state that write hooks must not be able to forge or erase. */
function restorePreparedUserTurnOperationalMetaForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage)) return params.runtimeMessage;
	const senderIsOwner = readOpenClawMessageMeta(params.preparedMessage)?.senderIsOwner;
	if (typeof senderIsOwner !== "boolean") return params.runtimeMessage;
	return {
		...params.runtimeMessage,
		__openclaw: {
			...readOpenClawMessageMeta(params.runtimeMessage),
			senderIsOwner
		}
	};
}
/** Applies before-message hooks while preserving user-turn transcript metadata. */
function preparePersistedUserTurnMessageForTranscriptWrite(message, params) {
	if (!params.beforeMessageWrite) return message;
	const originalMessage = message;
	const idempotencyKey = typeof originalMessage.idempotencyKey === "string" ? originalMessage.idempotencyKey : void 0;
	const provenance = normalizeInputProvenance(message.provenance);
	const senderIsOwner = readOpenClawMessageMeta(message)?.senderIsOwner;
	const originalTransport = readOpenClawMessageMeta(message)?.transport;
	const lateMedia = readOpenClawMessageMeta(message)?.lateMedia === true;
	const transport = originalTransport && typeof originalTransport === "object" && !Array.isArray(originalTransport) ? { ...originalTransport } : void 0;
	const nextMessage = params.beforeMessageWrite({
		message,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	if (nextMessage?.role !== "user") return;
	const nextUserMessage = provenance ? applyInputProvenanceToUserMessage(nextMessage, provenance) : nextMessage;
	if (!idempotencyKey && typeof senderIsOwner !== "boolean" && !transport && !lateMedia) return nextUserMessage;
	const protectedMeta = {
		...readOpenClawMessageMeta(nextUserMessage),
		...typeof senderIsOwner === "boolean" ? { senderIsOwner } : {},
		...transport ? { transport } : {},
		...lateMedia ? { lateMedia: true } : {}
	};
	return {
		...nextUserMessage,
		...idempotencyKey ? { idempotencyKey } : {},
		...Object.keys(protectedMeta).length > 0 ? { __openclaw: protectedMeta } : {}
	};
}
async function persistUserTurnTranscript(params) {
	const message = resolvePersistedUserTurnMessage(params);
	if (!message) return;
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		...params.sessionStore ? { sessionStore: params.sessionStore } : {},
		...params.storePath ? { storePath: params.storePath } : {},
		agentId: params.agentId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		...params.expectedSessionState ? { expectedSessionState: params.expectedSessionState } : {},
		...params.sessionLifecyclePatch ? { sessionLifecyclePatch: params.sessionLifecyclePatch } : {},
		updateMode: params.updateMode ?? "inline",
		messages: [{
			message,
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (candidate) => preparePersistedUserTurnMessageForTranscriptWrite(candidate, params)
		}]
	});
	const appended = turn.messages[0];
	if (!appended) return;
	return {
		...appended,
		sessionEntry: turn.sessionEntry,
		sessionFile: turn.sessionFile
	};
}
async function resolveUserTurnTranscriptTarget(target) {
	return typeof target === "function" ? await target() : target;
}
function createUserTurnTranscriptRecorder(params) {
	const message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let persisted = false;
	let runtimePersisted = false;
	let persistedResult;
	let runtimePersistencePromise;
	let selfPersistencePromise;
	let resolvedMessagePromise;
	let persistedMessageNotified = false;
	let runtimePersistedMessage;
	let sentToProvider = false;
	let resolvedBeforeProvider = false;
	const handlePersistenceError = (error) => {
		if (params.onPersistenceError) {
			params.onPersistenceError(error);
			return;
		}
		import("./globals-DeqGi6qa.js").then(({ logVerbose }) => {
			logVerbose(`failed to persist ${params.errorContext ?? "user turn transcript"}: ${String(error)}`);
		}).catch(() => void 0);
	};
	const resolveMessageForPersistence = async () => {
		if (params.message) return params.message;
		if (!params.resolveInput) return message;
		if (!resolvedMessagePromise) resolvedMessagePromise = (async () => {
			try {
				const resolvedInput = await params.resolveInput?.();
				const resolvedMessage = resolvePersistedUserTurnMessage({
					message: params.message,
					input: resolvedInput ?? params.input
				}) ?? message;
				resolvedBeforeProvider = !sentToProvider;
				return resolvedMessage;
			} catch (error) {
				handlePersistenceError(error);
				return message;
			}
		})();
		return await resolvedMessagePromise;
	};
	const notifyMessagePersisted = (persistedMessage) => {
		const notificationMessage = persistedMessage ?? persistedResult?.message ?? message;
		if (!notificationMessage || persistedMessageNotified || !params.onMessagePersisted) return;
		persistedMessageNotified = true;
		try {
			Promise.resolve(params.onMessagePersisted(notificationMessage)).catch(handlePersistenceError);
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const waitForRuntimePersistence = async () => {
		if (!runtimePersistencePromise) return;
		try {
			await runtimePersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const persistPrepared = async (options) => {
		if (options.skipWhenBlocked && blocked) return;
		if (!options.message && !message && !params.resolveInput) return;
		if (options.waitForRuntime) await waitForRuntimePersistence();
		if (selfPersistencePromise) return await selfPersistencePromise;
		selfPersistencePromise = (async () => {
			const resolvedMessage = options.message ?? await resolveMessageForPersistence();
			if (!resolvedMessage) return;
			const target = await resolveUserTurnTranscriptTarget(options.target ?? params.target);
			if (!target) return;
			const resolvedTarget = options.cwd ? {
				...target,
				cwd: options.cwd
			} : target;
			const updateMode = options.updateMode ?? params.updateMode ?? "inline";
			const persistMessage = async (candidate, candidateUpdateMode) => await persistUserTurnTranscript({
				...resolvedTarget,
				message: candidate,
				...options.expectedSessionId ? { expectedSessionId: options.expectedSessionId } : {},
				...options.sessionLifecyclePatch ?? params.sessionLifecyclePatch ? { sessionLifecyclePatch: options.sessionLifecyclePatch ?? params.sessionLifecyclePatch } : {},
				...options.expectedSessionState ?? params.expectedSessionState ? { expectedSessionState: options.expectedSessionState ?? params.expectedSessionState } : {},
				updateMode: candidateUpdateMode,
				...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}
			});
			const lateMediaMessage = sentToProvider && !resolvedBeforeProvider ? buildLateResolvedMediaMessage({
				admittedMessage: runtimePersistedMessage ?? message,
				resolvedMessage
			}) : void 0;
			if (lateMediaMessage) {
				if (!runtimePersisted && !persisted && message) {
					const admittedResult = await persistMessage(message, updateMode);
					if (admittedResult) {
						persisted = true;
						persistedResult = admittedResult;
						notifyMessagePersisted(admittedResult.message);
					}
				}
				const appendedMedia = await persistMessage(lateMediaMessage, "none");
				if (appendedMedia) {
					persisted = true;
					persistedResult = appendedMedia;
				}
				return appendedMedia;
			}
			if (runtimePersisted) return;
			if (persisted) return persistedResult;
			const result = await persistMessage(resolvedMessage, updateMode);
			if (result) {
				persisted = true;
				persistedResult = result;
				notifyMessagePersisted(result.message);
			}
			return result;
		})();
		try {
			return await selfPersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
			throw error;
		}
	};
	return {
		message,
		resolveMessage: resolveMessageForPersistence,
		getPersistedMessage: () => runtimePersistedMessage ?? persistedResult?.message,
		markSentToProvider: () => {
			sentToProvider = true;
		},
		markRuntimePersistencePending: (pending) => {
			runtimePersistencePromise = pending;
		},
		markRuntimePersisted: (persistedMessage) => {
			runtimePersistedMessage = persistedMessage;
			runtimePersisted = true;
			if (persistedMessage && persistedResult) persistedResult = {
				...persistedResult,
				message: persistedMessage
			};
			notifyMessagePersisted(persistedMessage);
		},
		markBlocked: () => {
			blocked = true;
		},
		hasPersisted: () => persisted || runtimePersisted,
		isBlocked: () => blocked,
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0,
		waitForRuntimePersistence,
		persistApproved: async (options) => await persistPrepared({
			waitForRuntime: false,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode,
			cwd: options?.cwd,
			expectedSessionId: options?.expectedSessionId,
			expectedSessionState: options?.expectedSessionState,
			sessionLifecyclePatch: options?.sessionLifecyclePatch
		}),
		persistBlocked: async (blockedMessage, options) => {
			blocked = true;
			return await persistPrepared({
				waitForRuntime: false,
				skipWhenBlocked: false,
				message: blockedMessage,
				target: options?.target,
				updateMode: options?.updateMode,
				cwd: options?.cwd
			});
		},
		persistFallback: async (options) => await persistPrepared({
			waitForRuntime: true,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode,
			cwd: options?.cwd
		})
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.userTurnTranscriptTestApi")] = { persistUserTurnTranscript };
//#endregion
export { createUserTurnTranscriptRecorder as a, resolvePersistedUserTurnText as c, buildRunUserTurnIdempotencyKey as i, restorePreparedUserTurnOperationalMetaForRuntime as l, buildPersistedUserTurnMediaInputsFromFields as n, mergePreparedUserTurnMessageForRuntime as o, buildPersistedUserTurnMessage as r, preparePersistedUserTurnMessageForTranscriptWrite as s, buildLateMediaAttachedText as t };
