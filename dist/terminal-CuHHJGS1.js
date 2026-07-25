import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-D4mGPeue.js";
import { i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS, p as NODE_TERMINAL_UPLOAD_COMMAND } from "./node-commands-CLCBg3iU.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-DMws3TUh.js";
import { Ap as validateTerminalAttachParams, Fp as validateTerminalTextParams, Ip as validateTerminalUploadParams, Lp as validateTerminalUploadResult, Mp as validateTerminalInputParams, Np as validateTerminalOpenParams, Pp as validateTerminalResizeParams, jp as validateTerminalCloseParams } from "./src-Cy32TawB.js";
import { r as isCanonicalTerminalUploadBase64 } from "./terminal-constants-0UMJMHnf.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { a as renderTerminalBufferText, i as waitForTerminalOpenDeadline, n as TerminalOpenDeadlineError, r as createTerminalOpenDeadline, t as TERMINAL_OPEN_DEADLINE_MS } from "./open-deadline-DiZLlHPv.js";
import { r as resolveTerminalSpawnPlan, t as buildTerminalEnv } from "./launch-DQqvaR2k.js";
import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
import { n as resolveSessionCatalogProvider } from "./session-catalog-DghE0Gh3.js";
import { t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-TwoLqvJD.js";
import { n as surrogateSafeTail } from "./output-ring-Bz-YhhYd.js";
//#region src/gateway/terminal/node-relay.ts
const DATA_INPUT_CHUNK_BYTES = 2 * 1024;
const MAX_PENDING_DATA_CHARS = 512 * 1024;
function parseExit(result) {
	if (!result.ok) return { error: `${result.error?.code ?? "NODE_INVOKE_FAILED"}: ${result.error?.message ?? "node terminal invoke failed"}` };
	try {
		const raw = result.payloadJSON ?? (result.payload === void 0 ? void 0 : JSON.stringify(result.payload));
		if (!raw) return { exitCode: 0 };
		const value = JSON.parse(raw);
		if (!value || typeof value !== "object" || Array.isArray(value)) return { exitCode: 0 };
		const record = value;
		return {
			...typeof record.exitCode === "number" ? { exitCode: record.exitCode } : {},
			...typeof record.signal === "number" ? { signal: record.signal } : {}
		};
	} catch {
		return { error: "node terminal returned an invalid exit result" };
	}
}
function splitInput(data) {
	const chunks = [];
	let start = 0;
	let bytes = 0;
	for (let index = 0; index < data.length; index += 1) {
		const codePoint = data.codePointAt(index);
		if (codePoint === void 0) break;
		const char = String.fromCodePoint(codePoint);
		const size = Buffer.byteLength(char, "utf8");
		if (bytes > 0 && bytes + size > DATA_INPUT_CHUNK_BYTES) {
			chunks.push(data.slice(start, index));
			start = index;
			bytes = 0;
		}
		bytes += size;
		if (char.length === 2) index += 1;
	}
	if (start < data.length) chunks.push(data.slice(start));
	return chunks;
}
async function createNodeRelayBackend(params) {
	let invokeId;
	let dataCallback;
	let exitCallback;
	const pendingData = new BoundedBuffer(MAX_PENDING_DATA_CHARS, {
		mode: "drop-oldest",
		fit: surrogateSafeTail
	}, (chunk) => chunk.length);
	let pendingExit;
	const abort = new AbortController();
	const result = params.registry.invoke({
		nodeId: params.nodeId,
		expectedConnId: params.expectedConnId,
		command: params.command,
		params: params.params,
		timeoutMs: 0,
		idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
		signal: abort.signal,
		onInvokeId: (id) => {
			invokeId = id;
		},
		onProgress: (chunk) => {
			if (!chunk) return;
			if (dataCallback) dataCallback(chunk);
			else pendingData.push(chunk);
		}
	}).then(parseExit).catch((error) => ({ error: error instanceof Error ? error.message : String(error) })).then((exit) => {
		if (exitCallback) exitCallback(exit);
		else pendingExit = exit;
		return exit;
	});
	await Promise.resolve();
	if (!invokeId) {
		const exit = await result;
		throw new Error(exit.error ?? "failed to start node terminal invoke");
	}
	const activeInvokeId = invokeId;
	const send = (payload) => params.registry.sendInvokeInput(activeInvokeId, payload);
	return {
		write(data) {
			for (const chunk of splitInput(data)) send({
				kind: "data",
				data: chunk
			});
		},
		resize(cols, rows) {
			send({
				kind: "resize",
				cols,
				rows
			});
		},
		pause() {},
		resume() {},
		kill() {
			abort.abort();
		},
		onData(callback) {
			dataCallback = callback;
			for (const chunk of pendingData.drain()) callback(chunk);
		},
		onExit(callback) {
			exitCallback = callback;
			if (pendingExit) {
				const exit = pendingExit;
				pendingExit = void 0;
				callback(exit);
			}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/terminal-open-plan.ts
function authorizeTerminalNodeCommand(context, nodeId, command) {
	const node = context.nodeRegistry.get(nodeId);
	if (!node) return {
		ok: false,
		message: "terminal node is not connected"
	};
	if (!node.commands.includes(command)) return {
		ok: false,
		message: "terminal node command is not available"
	};
	const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
		...node,
		approvedCommands: node.commands
	});
	const allowed = isNodeCommandAllowed({
		command,
		declaredCommands: node.commands,
		allowlist
	});
	return allowed.ok ? {
		ok: true,
		node
	} : {
		ok: false,
		message: allowed.reason
	};
}
function authorizeCatalogTerminalNode(context, plan) {
	return authorizeTerminalNodeCommand(context, plan.nodeId, plan.command);
}
function resolveTerminalOpenSpawnPlan(launchPlan, catalogPlan) {
	if (!catalogPlan) return resolveTerminalSpawnPlan(launchPlan);
	if (catalogPlan.kind === "local") return resolveTerminalSpawnPlan({
		...launchPlan,
		initialCommand: catalogPlan.argv,
		cwdOverride: catalogPlan.cwd
	});
	return {
		agentId: launchPlan.agentId,
		cwd: catalogPlan.cwd ?? launchPlan.cwd,
		shell: catalogPlan.title ?? catalogPlan.command,
		args: []
	};
}
//#endregion
//#region src/gateway/server-methods/terminal-upload.ts
function invalid$1(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
const terminalUploadHandlers = { "terminal.upload": async (opts) => {
	const { params, respond, context } = opts;
	if (!validateTerminalUploadParams(params)) {
		invalid$1(respond, `invalid terminal.upload params: ${formatValidationErrors(validateTerminalUploadParams.errors)}`);
		return;
	}
	const connId = opts.client?.connId;
	if (!connId) {
		invalid$1(respond, "terminal requires an authenticated connection");
		return;
	}
	const p = params;
	if (!isCanonicalTerminalUploadBase64(p.contentBase64)) {
		invalid$1(respond, "invalid terminal.upload base64 content");
		return;
	}
	if (!context.terminalSessions || !context.isTerminalEnabled()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
		return;
	}
	try {
		const result = await context.terminalSessions.upload(connId, p.sessionId, {
			name: p.name,
			contentBase64: p.contentBase64
		});
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		respond(true, result);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "terminal upload failed"));
	}
} };
//#endregion
//#region src/gateway/server-methods/terminal.ts
function invalid(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
function requireConnId(opts) {
	const connId = opts.client?.connId;
	if (!connId) {
		invalid(opts.respond, "terminal requires an authenticated connection");
		return null;
	}
	return connId;
}
function terminalEnabled(context) {
	return context.isTerminalEnabled();
}
function respondTerminalOpenTimeout(respond) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal open timed out"));
}
function parseNodePayload(payload, payloadJSON) {
	if (!payloadJSON) return payload;
	try {
		return JSON.parse(payloadJSON);
	} catch {
		return;
	}
}
async function stageNodeTerminalUpload(context, nodeId, file) {
	const access = authorizeTerminalNodeCommand(context, nodeId, NODE_TERMINAL_UPLOAD_COMMAND);
	if (!access.ok) throw new Error(access.message);
	const result = await context.nodeRegistry.invoke({
		nodeId,
		expectedConnId: access.node.connId,
		command: NODE_TERMINAL_UPLOAD_COMMAND,
		params: file,
		timeoutMs: 12e4
	});
	if (!result.ok) throw new Error(result.error?.message ?? "terminal node upload failed");
	const payload = parseNodePayload(result.payload, result.payloadJSON);
	if (!validateTerminalUploadResult(payload)) throw new Error("terminal node returned an invalid upload result");
	return payload;
}
function respondLaunchBlocked(respond, block) {
	if (block.kind === "disabled") {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is disabled"));
		return;
	}
	if (block.kind === "unknown-agent") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent "${block.agentId}"`));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `terminal unavailable: agent "${block.agentId}" runs in a sandbox (mode "${block.mode}"); in-sandbox terminals are not supported yet`));
}
/** Handlers for the operator terminal method family. */
const terminalHandlers = {
	...terminalUploadHandlers,
	"terminal.open": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalOpenParams(params)) {
			invalid(respond, `invalid terminal.open params: ${formatValidationErrors(validateTerminalOpenParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const manager = context.terminalSessions;
		if (!manager) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const p = params;
		const launch = context.resolveTerminalLaunchPolicy(p.agentId);
		if (!launch.ok) {
			respondLaunchBlocked(respond, launch.block);
			return;
		}
		const deadline = createTerminalOpenDeadline();
		let catalogPlan;
		let title;
		let createBackend;
		let nodeRelay;
		let stageUpload;
		if (p.catalog) {
			const provider = resolveSessionCatalogProvider(p.catalog.catalogId);
			if (!provider) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${p.catalog.catalogId}`));
				return;
			}
			if (!provider.openTerminal) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session catalog cannot open terminals"));
				return;
			}
			const openTerminal = provider.openTerminal;
			const catalog = p.catalog;
			try {
				catalogPlan = await waitForTerminalOpenDeadline(() => openTerminal.call(provider, {
					hostId: catalog.hostId,
					threadId: catalog.threadId
				}), deadline);
			} catch (error) {
				if (error instanceof TerminalOpenDeadlineError) {
					respondTerminalOpenTimeout(respond);
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "catalog terminal open failed"));
				return;
			}
			title = catalogPlan.title;
			if (catalogPlan.kind === "local") {
				if (catalogPlan.argv.length === 0) {
					invalid(respond, "catalog terminal plan has no command");
					return;
				}
			} else {
				const nodeCatalogPlan = catalogPlan;
				const access = authorizeCatalogTerminalNode(context, nodeCatalogPlan);
				if (!access.ok) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, access.message));
					return;
				}
				let nodeParams;
				try {
					const parsed = JSON.parse(catalogPlan.paramsJSON);
					if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid params");
					nodeParams = {
						...parsed,
						cols: p.cols,
						rows: p.rows
					};
				} catch {
					invalid(respond, "catalog terminal plan has invalid params");
					return;
				}
				let policyResult;
				try {
					policyResult = await waitForTerminalOpenDeadline(() => applyPluginNodeInvokePolicy({
						context,
						client: opts.client,
						nodeSession: access.node,
						command: nodeCatalogPlan.command,
						params: nodeParams
					}), deadline);
				} catch (error) {
					if (error instanceof TerminalOpenDeadlineError) {
						respondTerminalOpenTimeout(respond);
						return;
					}
					throw error;
				}
				if (policyResult && !policyResult.ok) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, policyResult.message));
					return;
				}
				nodeRelay = {
					plan: nodeCatalogPlan,
					params: nodeParams
				};
				stageUpload = async (file) => await stageNodeTerminalUpload(context, nodeCatalogPlan.nodeId, file);
			}
		}
		if (context.isConnectionActive?.(connId) === false) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal connection closed"));
			return;
		}
		if (!terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is disabled"));
			return;
		}
		const refreshedLaunch = context.resolveTerminalLaunchPolicy(p.agentId);
		if (!refreshedLaunch.ok) {
			respondLaunchBlocked(respond, refreshedLaunch.block);
			return;
		}
		if (nodeRelay) {
			const relay = nodeRelay;
			const access = authorizeCatalogTerminalNode(context, relay.plan);
			if (!access.ok) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, access.message));
				return;
			}
			createBackend = async () => await createNodeRelayBackend({
				registry: context.nodeRegistry,
				nodeId: relay.plan.nodeId,
				expectedConnId: access.node.connId,
				command: relay.plan.command,
				params: relay.params
			});
		}
		const spawnPlan = resolveTerminalOpenSpawnPlan(refreshedLaunch.plan, catalogPlan);
		const terminalEnv = buildTerminalEnv(process.env);
		if (catalogPlan?.kind === "local" && catalogPlan.pathEnv) terminalEnv.PATH = catalogPlan.pathEnv;
		let openingTerminal;
		let outcome;
		try {
			outcome = await waitForTerminalOpenDeadline(() => {
				openingTerminal = manager.open({
					owner: {
						kind: "conn",
						connId
					},
					agentId: spawnPlan.agentId,
					cwd: spawnPlan.cwd,
					shell: spawnPlan.shell,
					args: spawnPlan.args,
					cols: p.cols,
					rows: p.rows,
					env: terminalEnv,
					signal: deadline.controller.signal,
					...createBackend ? { createBackend } : {},
					...stageUpload ? { stageUpload } : {}
				});
				return openingTerminal;
			}, deadline);
		} catch (error) {
			if (error instanceof TerminalOpenDeadlineError) {
				if (openingTerminal) openingTerminal.then((lateOutcome) => {
					if (lateOutcome.ok) manager.close(connId, lateOutcome.sessionId);
				}, () => void 0);
				respondTerminalOpenTimeout(respond);
				return;
			}
			throw error;
		}
		if (!outcome.ok) {
			respond(false, void 0, errorShape(outcome.code === "limit" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, outcome.message));
			return;
		}
		if (context.isConnectionActive?.(connId) === false) {
			manager.close(connId, outcome.sessionId);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal connection closed"));
			return;
		}
		context.logGateway.info(`terminal opened session=${outcome.sessionId} agent=${outcome.agentId} conn=${connId} shell=${outcome.shell}`);
		respond(true, {
			sessionId: outcome.sessionId,
			agentId: outcome.agentId,
			shell: outcome.shell,
			cwd: outcome.cwd,
			confined: false,
			...title ? { title } : {}
		});
	},
	"terminal.input": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalInputParams(params)) {
			invalid(respond, `invalid terminal.input params: ${formatValidationErrors(validateTerminalInputParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.write(connId, p.sessionId, p.data) ?? false });
	},
	"terminal.resize": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalResizeParams(params)) {
			invalid(respond, `invalid terminal.resize params: ${formatValidationErrors(validateTerminalResizeParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.resize(connId, p.sessionId, p.cols, p.rows) ?? false });
	},
	"terminal.close": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalCloseParams(params)) {
			invalid(respond, `invalid terminal.close params: ${formatValidationErrors(validateTerminalCloseParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		respond(true, { ok: context.terminalSessions?.close(connId, p.sessionId) ?? false });
	},
	"terminal.attach": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalAttachParams(params)) {
			invalid(respond, `invalid terminal.attach params: ${formatValidationErrors(validateTerminalAttachParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!context.terminalSessions || !terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const attached = context.terminalSessions.attach(connId, p.sessionId);
		if (!attached) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		context.logGateway.info(`terminal attached session=${attached.sessionId} agent=${attached.agentId} conn=${connId}`);
		const supportsOffsetSeq = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_OFFSET_SEQ);
		respond(true, {
			sessionId: attached.sessionId,
			agentId: attached.agentId,
			shell: attached.shell,
			cwd: attached.cwd,
			confined: false,
			buffer: attached.buffer,
			...supportsOffsetSeq ? { seq: attached.seq } : {}
		});
	},
	"terminal.list": async (opts) => {
		const { respond, context } = opts;
		if (!requireConnId(opts)) return;
		respond(true, { sessions: context.terminalSessions && terminalEnabled(context) ? context.terminalSessions.list().map((session) => ({
			sessionId: session.sessionId,
			agentId: session.agentId,
			shell: session.shell,
			cwd: session.cwd,
			confined: false,
			attached: session.attached,
			owner: session.owner,
			createdAtMs: session.createdAtMs
		})) : [] });
	},
	"terminal.text": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalTextParams(params)) {
			invalid(respond, `invalid terminal.text params: ${formatValidationErrors(validateTerminalTextParams.errors)}`);
			return;
		}
		if (!requireConnId(opts)) return;
		const p = params;
		if (!context.terminalSessions || !terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const raw = context.terminalSessions.snapshot(p.sessionId);
		if (raw === void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		respond(true, { text: renderTerminalBufferText(raw) });
	}
};
//#endregion
export { TERMINAL_OPEN_DEADLINE_MS, terminalHandlers };
