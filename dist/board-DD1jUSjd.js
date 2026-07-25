import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { a as enqueueSystemEvent } from "./system-events-BNfyhKS3.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { n as readCanvasDocumentHtmlSource } from "./documents-8dSg_abm.js";
import { _ as buildWidgetDocument } from "./openclaw-tools-U0Zy3sfO.js";
import { A as validateBoardWidgetGrantParams, C as validateBoardDataReadParams, D as validateBoardUpdateParams, E as validateBoardPromptAuthorizeParams, O as validateBoardWidgetAppViewParams, S as validateBoardActionParams, T as validateBoardGetParams, j as validateBoardWidgetPutParams, k as validateBoardWidgetContent, w as validateBoardEventParams } from "./src-Cy32TawB.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { a as BoardValidationError, n as boardWidgetHasGrantedTool, r as normalizeBoardWidgetDeclared } from "./board-capabilities-BM7pQKX1.js";
import { a as resolveMcpAppActiveView, c as mintMcpAppViewFromTranscript, i as requireMcpAppInteraction, o as resolveMcpAppAllowedToolNames } from "./mcp-app-operations-DgdBtUr6.js";
import { a as createBoardViewTicket, c as buildBoardWidgetSandboxPath, i as buildBoardWidgetFrameUrl, o as boardStore, r as BOARD_VIEW_TICKET_TTL_MS, t as resolveAuthorizedBoardWidgetView } from "./board-widget-view-BWLCrbN8.js";
import { t as agentsHandlers } from "./agents-wrN7W6TG.js";
import { t as cronHandlers } from "./cron-CknYTl_T.js";
import { t as healthHandlers } from "./health-DUaua7ub.js";
import { t as sessionsHandlers } from "./sessions-B9uswc0V.js";
import { n as usageHandlers } from "./usage-BJA-uhNE.js";
//#region src/boards/board-notices.ts
const BOARD_EVENT_MAX_BYTES = 8 * 1024;
const BOARD_NOTICE_MAX_CHARS = 500;
const BOARD_EVENT_DEDUPE_MS = 5e3;
const recentNotices = /* @__PURE__ */ new Map();
var BoardEventPayloadError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "BoardEventPayloadError";
	}
};
function serializePayload(payload) {
	try {
		const serialized = JSON.stringify(payload);
		return serialized === void 0 ? String(payload) : serialized;
	} catch {
		throw new BoardEventPayloadError("board event payload must be JSON serializable");
	}
}
function formatNotice(widget, summary) {
	const prefix = "[dashboard] ";
	const suffix = ` on widget ${widget}`;
	const available = BOARD_NOTICE_MAX_CHARS - 12 - suffix.length;
	return `${prefix}${summary.length <= available ? summary : `${summary.slice(0, Math.max(0, available - 1))}…`}${suffix}`;
}
function appendBoardEventNotice(params) {
	const summary = serializePayload(params.payload);
	if (Buffer.byteLength(summary, "utf8") > BOARD_EVENT_MAX_BYTES) throw new BoardEventPayloadError(`board event payload exceeds ${BOARD_EVENT_MAX_BYTES} bytes`);
	const now = params.now ?? Date.now();
	const key = `${params.sessionKey}\0${params.widget}`;
	const recent = recentNotices.get(key);
	if (recent?.summary === summary && now - recent.at < BOARD_EVENT_DEDUPE_MS) return false;
	recentNotices.set(key, {
		summary,
		at: now
	});
	for (const [candidate, notice] of recentNotices) if (now - notice.at >= BOARD_EVENT_DEDUPE_MS) recentNotices.delete(candidate);
	return enqueueSystemEvent(formatNotice(params.widget, summary), {
		sessionKey: params.sessionKey,
		contextKey: `dashboard:${params.widget}:${now}`
	});
}
//#endregion
//#region src/gateway/board-host-tools.ts
const BOARD_DATA_BINDING_IDS = [
	"sessions.list",
	"usage.status",
	"usage.cost",
	"cron.list",
	"cron.status",
	"agents.list",
	"health"
];
const BOARD_DATA_HANDLERS = {
	"sessions.list": sessionsHandlers["sessions.list"],
	"usage.status": usageHandlers["usage.status"],
	"usage.cost": usageHandlers["usage.cost"],
	"cron.list": cronHandlers["cron.list"],
	"cron.status": cronHandlers["cron.status"],
	"agents.list": agentsHandlers["agents.list"],
	health: healthHandlers.health
};
function isBoardDataBindingId(value) {
	return BOARD_DATA_BINDING_IDS.includes(value);
}
async function invokeGatewayHandler(handler, method, params, invocation) {
	let didRespond = false;
	let succeeded = false;
	let payload;
	let responseError;
	await handler({
		...invocation,
		req: {
			...invocation.req,
			method,
			params
		},
		params,
		respond: (ok, value, error) => {
			if (didRespond) return;
			didRespond = true;
			if (ok) {
				succeeded = true;
				payload = value;
			} else responseError = error;
		}
	});
	if (!didRespond) throw new BoardValidationError("invalid_operation", `${method} did not return a result`);
	if (!succeeded) throw new BoardValidationError("invalid_operation", responseError?.message || `${method} failed`);
	return payload;
}
async function readBoardDataBinding(bindingId, params, invocation) {
	if (!isBoardDataBindingId(bindingId)) throw new BoardValidationError("invalid_operation", `board widget data binding is not allowed: ${bindingId}`);
	return await invokeGatewayHandler(BOARD_DATA_HANDLERS[bindingId], bindingId, params, invocation);
}
async function triggerBoardCronJob(jobId, invocation) {
	return await invokeGatewayHandler(cronHandlers["cron.run"], "cron.run", {
		id: jobId,
		mode: "force"
	}, invocation);
}
//#endregion
//#region src/gateway/server-methods/board.ts
const defaultMcpAppDependencies = {
	resolveActiveView: resolveMcpAppActiveView,
	resolveAllowedToolNames: resolveMcpAppAllowedToolNames,
	mintFromTranscript: mintMcpAppViewFromTranscript
};
function invalidParams(method, errors, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(errors)}`));
}
function respondBoardError(error, respond) {
	if (error instanceof BoardValidationError || error instanceof BoardEventPayloadError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
}
function createBoardHandlers(store, appendNotice = appendBoardEventNotice, readCanvasDocument = readCanvasDocumentHtmlSource, dependencies = {}) {
	const mcpApp = {
		resolveActiveView: dependencies.resolveActiveView ?? defaultMcpAppDependencies.resolveActiveView,
		resolveAllowedToolNames: dependencies.resolveAllowedToolNames ?? defaultMcpAppDependencies.resolveAllowedToolNames,
		mintFromTranscript: dependencies.mintFromTranscript ?? defaultMcpAppDependencies.mintFromTranscript
	};
	const readDataBinding = dependencies.readDataBinding ?? readBoardDataBinding;
	const triggerCronJob = dependencies.triggerCronJob ?? triggerBoardCronJob;
	return {
		"board.get": async ({ params, respond, context }) => {
			if (!validateBoardGetParams(params)) {
				invalidParams("board.get", validateBoardGetParams.errors, respond);
				return;
			}
			const snapshot = store.getSnapshot(params.sessionKey);
			let sandboxPort = context.getMcpAppSandboxPort?.();
			for (const widget of snapshot.widgets) {
				if (widget.grantState !== "none" && widget.grantState !== "granted") continue;
				const document = store.readWidgetHtml(snapshot.sessionKey, widget.name);
				if (!document || document.revision !== widget.revision) continue;
				if (sandboxPort === void 0 && context.ensureSandboxHostPort) try {
					sandboxPort = await context.ensureSandboxHostPort();
				} catch (error) {
					respondBoardError(error, respond);
					return;
				}
				const { ticket } = createBoardViewTicket({
					sessionKey: snapshot.sessionKey,
					name: widget.name,
					revision: widget.revision,
					viewGeneration: document.viewGeneration
				});
				widget.frameUrl = buildBoardWidgetFrameUrl({
					sessionKey: snapshot.sessionKey,
					name: widget.name,
					ticket
				});
				widget.viewTicket = ticket;
				widget.viewTicketTtlMs = BOARD_VIEW_TICKET_TTL_MS;
				widget.viewGeneration = document.viewGeneration;
				if (sandboxPort !== void 0) {
					widget.sandboxUrl = buildBoardWidgetSandboxPath(document);
					widget.sandboxPort = sandboxPort;
					const configuredOrigin = context.getRuntimeConfig?.().mcp?.apps?.sandboxOrigin;
					if (configuredOrigin) widget.sandboxOrigin = new URL(configuredOrigin).origin;
				}
			}
			respond(true, snapshot);
		},
		"board.update": ({ params, respond, context }) => {
			if (!validateBoardUpdateParams(params)) {
				invalidParams("board.update", validateBoardUpdateParams.errors, respond);
				return;
			}
			try {
				const boardParams = params;
				const snapshot = store.applyOps(boardParams.sessionKey, boardParams.ops);
				if (boardParams.ops.length > 0) context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision
				});
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.widget.put": async ({ params, respond, context }) => {
			if (!validateBoardWidgetPutParams(params)) {
				invalidParams("board.widget.put", validateBoardWidgetPutParams.errors, respond);
				return;
			}
			try {
				const requestParams = params;
				const boardSessionKey = store.getSnapshot(requestParams.sessionKey).sessionKey;
				const { declared: requestDeclared, ...requestWithoutDeclared } = requestParams;
				let content;
				let declared = requestDeclared;
				if (requestParams.content.kind === "canvas-doc") {
					const document = await readCanvasDocument(requestParams.content.docId);
					if (document.cspSandbox !== "scripts") throw new BoardValidationError("invalid_operation", `canvas document is not script-enabled: ${requestParams.content.docId}`);
					content = {
						kind: "html",
						html: document.html
					};
				} else if (requestParams.content.kind === "mcp-app") {
					const active = await mcpApp.resolveActiveView({
						sessionKey: boardSessionKey,
						viewId: requestParams.content.viewId,
						cfg: context.getRuntimeConfig()
					});
					const { view } = active;
					if (!view.toolCallId) throw new BoardValidationError("invalid_operation", "MCP App view is missing its originating tool call");
					let interactive = false;
					try {
						await requireMcpAppInteraction(view);
						interactive = true;
					} catch {}
					const allowedTools = interactive ? await mcpApp.resolveAllowedToolNames(active) : [];
					content = {
						kind: "mcp-app",
						descriptor: {
							serverName: view.serverName,
							toolName: view.toolName,
							uiResourceUri: view.uiResourceUri,
							toolCallId: view.toolCallId
						},
						interactive
					};
					declared = allowedTools.length > 0 ? { tools: allowedTools } : void 0;
				} else content = requestParams.content;
				if (!validateBoardWidgetContent(content.kind === "mcp-app" ? {
					kind: content.kind,
					descriptor: content.descriptor
				} : content)) {
					invalidParams("board.widget.put content", validateBoardWidgetContent.errors, respond);
					return;
				}
				declared = normalizeBoardWidgetDeclared(declared);
				const materializedContent = content.kind === "html" ? {
					kind: "html",
					html: buildWidgetDocument(requestParams.title ?? requestParams.name, content.html, { connectOrigins: declared?.netOrigins })
				} : content;
				const boardParams = {
					...requestWithoutDeclared,
					sessionKey: boardSessionKey,
					content: materializedContent,
					...declared ? { declared } : {}
				};
				const snapshot = store.putWidget(boardParams);
				context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision,
					widget: boardParams.name
				});
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.widget.grant": ({ params, respond, context }) => {
			if (!validateBoardWidgetGrantParams(params)) {
				invalidParams("board.widget.grant", validateBoardWidgetGrantParams.errors, respond);
				return;
			}
			try {
				const boardParams = params;
				const snapshot = store.grant(boardParams.sessionKey, boardParams.name, boardParams.decision, boardParams.revision, boardParams.instanceId);
				context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision
				});
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.widget.appView": async ({ params, respond, context }) => {
			if (!validateBoardWidgetAppViewParams(params)) {
				invalidParams("board.widget.appView", validateBoardWidgetAppViewParams.errors, respond);
				return;
			}
			try {
				const boardParams = params;
				const snapshot = store.getSnapshot(boardParams.sessionKey);
				const widget = snapshot.widgets.find((candidate) => candidate.name === boardParams.name);
				const document = store.readWidgetMcpApp(snapshot.sessionKey, boardParams.name);
				if (!widget || widget.contentKind !== "mcp-app" || widget.revision !== boardParams.revision || widget.instanceId !== boardParams.instanceId || !document || document.revision !== boardParams.revision || document.instanceId !== boardParams.instanceId) throw new BoardValidationError("not_found", `board MCP App widget not found: ${boardParams.name}`);
				const interactive = document.interactive && document.grantState === "granted";
				const authorizeAppInteraction = interactive ? () => {
					const current = store.readWidgetMcpApp(snapshot.sessionKey, boardParams.name);
					return current?.interactive === true && current.grantState === "granted" && current.revision === boardParams.revision && current.instanceId === boardParams.instanceId;
				} : void 0;
				const minted = await mcpApp.mintFromTranscript({
					cfg: context.getRuntimeConfig(),
					sessionKey: snapshot.sessionKey,
					descriptor: document.descriptor,
					allowedAppToolNames: new Set(interactive ? document.declaredTools : []),
					...authorizeAppInteraction ? { authorizeAppInteraction } : {},
					readOnly: !interactive
				});
				if (!minted) throw new Error("Pinned MCP App source is no longer available");
				respond(true, {
					viewId: minted.view.viewId,
					expiresAtMs: minted.view.expiresAtMs
				});
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.event": ({ params, respond }) => {
			if (!validateBoardEventParams(params)) {
				invalidParams("board.event", validateBoardEventParams.errors, respond);
				return;
			}
			try {
				const boardParams = params;
				const identity = "ticket" in boardParams ? resolveAuthorizedBoardWidgetView(store, boardParams.ticket) : (() => {
					const snapshot = store.getSnapshot(boardParams.sessionKey);
					if (!snapshot.widgets.some((candidate) => candidate.name === boardParams.widget)) throw new BoardValidationError("not_found", `board widget not found: ${boardParams.widget}`);
					return {
						sessionKey: snapshot.sessionKey,
						name: boardParams.widget
					};
				})();
				respond(true, {
					ok: true,
					appended: appendNotice({
						sessionKey: identity.sessionKey,
						widget: identity.name,
						payload: boardParams.payload
					})
				});
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.prompt.authorize": ({ params, respond }) => {
			if (!validateBoardPromptAuthorizeParams(params)) {
				invalidParams("board.prompt.authorize", validateBoardPromptAuthorizeParams.errors, respond);
				return;
			}
			try {
				const { document } = resolveAuthorizedBoardWidgetView(store, params.ticket);
				respond(true, { confirmationRequired: !boardWidgetHasGrantedTool(document.declared, document.grantState, "prompt") });
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.data.read": async (invocation) => {
			const { params, respond } = invocation;
			if (!validateBoardDataReadParams(params)) {
				invalidParams("board.data.read", validateBoardDataReadParams.errors, respond);
				return;
			}
			try {
				const boardParams = params;
				const bindingParams = boardParams.params ?? {};
				if (Buffer.byteLength(JSON.stringify(bindingParams), "utf8") > 8 * 1024) throw new BoardValidationError("invalid_operation", "board widget data binding params exceed 8192 UTF-8 bytes");
				const { document } = resolveAuthorizedBoardWidgetView(store, boardParams.ticket);
				if (!boardWidgetHasGrantedTool(document.declared, document.grantState, boardParams.bindingId)) throw new BoardValidationError("invalid_operation", `board widget tool is not granted: ${boardParams.bindingId}`);
				respond(true, await readDataBinding(boardParams.bindingId, bindingParams, invocation));
			} catch (error) {
				respondBoardError(error, respond);
			}
		},
		"board.action": async (invocation) => {
			const { params, respond } = invocation;
			if (!validateBoardActionParams(params)) {
				invalidParams("board.action", validateBoardActionParams.errors, respond);
				return;
			}
			try {
				const boardParams = params;
				const { document } = resolveAuthorizedBoardWidgetView(store, boardParams.ticket);
				const capability = `cron.trigger:${boardParams.jobId}`;
				if (!boardWidgetHasGrantedTool(document.declared, document.grantState, capability)) throw new BoardValidationError("invalid_operation", `board widget tool is not granted: ${capability}`);
				respond(true, await triggerCronJob(boardParams.jobId, invocation));
			} catch (error) {
				respondBoardError(error, respond);
			}
		}
	};
}
const boardHandlers = createBoardHandlers(boardStore);
//#endregion
export { boardHandlers, createBoardHandlers };
