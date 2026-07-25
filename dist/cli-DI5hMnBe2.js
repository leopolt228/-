import { a as addTimerTimeoutGraceMs, y as parseStrictNonNegativeInteger } from "./number-coercion-Crk_c9KW.js";
import "./number-runtime-C6TGSEc_.js";
import { n as callGatewayFromCli } from "./gateway-rpc-BeSn3X6s.js";
import "./gateway-runtime-BpblXBwU.js";
import { s as resolveZoomMeetingsGatewayOperationTimeoutMs, t as resolveZoomMeetingsProbeTimeoutMs } from "./probe-timeout-6SljKpTQ.js";
//#region extensions/zoom-meetings/src/cli.ts
function print(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function parseTimeout(value) {
	if (value === void 0) return;
	const parsed = parseStrictNonNegativeInteger(value);
	if (parsed === void 0 || parsed === 0) throw new Error("timeout-ms must be a positive integer");
	return parsed;
}
function resolveZoomMeetingsCliGatewayTimeoutMs(config, options) {
	const operationTimeoutMs = resolveZoomMeetingsGatewayOperationTimeoutMs(config);
	const probeTimeoutMs = options.probe ? resolveZoomMeetingsProbeTimeoutMs(options.requestedTimeoutMs, config.chrome.joinTimeoutMs) : void 0;
	return probeTimeoutMs === void 0 ? operationTimeoutMs : addTimerTimeoutGraceMs(operationTimeoutMs, probeTimeoutMs) ?? 1;
}
async function call(params) {
	const requestedTimeout = typeof params.payload?.timeoutMs === "number" ? params.payload.timeoutMs : void 0;
	const timeoutMs = resolveZoomMeetingsCliGatewayTimeoutMs(params.config, {
		probe: params.method === "zoommeetings.testSpeech" || params.method === "zoommeetings.testListen",
		requestedTimeoutMs: requestedTimeout
	});
	print(await callGatewayFromCli(params.method, {
		json: true,
		timeout: String(timeoutMs)
	}, params.payload, {
		progress: false,
		scopes: ["operator.admin"]
	}));
}
function joinPayload(url, options) {
	return {
		url,
		...options.transport ? { transport: options.transport } : {},
		...options.mode ? { mode: options.mode } : {},
		...options.message ? { message: options.message } : {},
		...options.timeoutMs ? { timeoutMs: parseTimeout(options.timeoutMs) } : {}
	};
}
function addJoinOptions(command) {
	return command.option("--transport <transport>", "chrome or chrome-node").option("--mode <mode>", "agent, bidi, or transcribe").option("--message <text>", "instructions to speak after joining");
}
function addProbeOptions(command) {
	return addJoinOptions(command).option("--timeout-ms <ms>", "probe timeout in milliseconds");
}
function registerZoomMeetingsCli(params) {
	const root = params.program.command("zoommeetings").description("Join and manage Zoom meeting guests");
	addJoinOptions(root.command("join <url>").description("join a Zoom meeting as a guest")).action(async (url, options) => {
		await call({
			config: params.config,
			method: "zoommeetings.join",
			payload: joinPayload(url, options)
		});
	});
	root.command("leave <session-id>").description("leave a Zoom meeting").action(async (sessionId) => {
		await call({
			config: params.config,
			method: "zoommeetings.leave",
			payload: { sessionId }
		});
	});
	root.command("status [session-id]").description("show Zoom meeting session status").action(async (sessionId) => {
		await call({
			config: params.config,
			method: "zoommeetings.status",
			payload: sessionId ? { sessionId } : {}
		});
	});
	root.command("transcript <session-id>").description("read the current transcript snapshot").option("--since-index <index>", "resume from a prior transcript index").action(async (sessionId, options) => {
		const sinceIndex = options.sinceIndex === void 0 ? void 0 : parseStrictNonNegativeInteger(options.sinceIndex);
		if (options.sinceIndex !== void 0 && sinceIndex === void 0) throw new Error("since-index must be a non-negative integer");
		await call({
			config: params.config,
			method: "zoommeetings.transcript",
			payload: {
				sessionId,
				...sinceIndex === void 0 ? {} : { sinceIndex }
			}
		});
	});
	root.command("speak <session-id> [message]").description("speak through an active talk-back session").action(async (sessionId, message) => {
		await call({
			config: params.config,
			method: "zoommeetings.speak",
			payload: {
				sessionId,
				...message ? { message } : {}
			}
		});
	});
	root.command("setup").description("check Zoom meeting prerequisites").option("--transport <transport>", "chrome or chrome-node").option("--mode <mode>", "agent, bidi, or transcribe").action(async (options) => {
		await call({
			config: params.config,
			method: "zoommeetings.setup",
			payload: options
		});
	});
	for (const [name, method, description] of [[
		"test-speech",
		"zoommeetings.testSpeech",
		"join and verify talk-back output"
	], [
		"test-listen",
		"zoommeetings.testListen",
		"join in transcribe mode and report caption support"
	]]) addProbeOptions(root.command(`${name} <url>`).description(description)).action(async (url, options) => {
		await call({
			config: params.config,
			method,
			payload: joinPayload(url, options)
		});
	});
}
//#endregion
export { registerZoomMeetingsCli, resolveZoomMeetingsCliGatewayTimeoutMs };
