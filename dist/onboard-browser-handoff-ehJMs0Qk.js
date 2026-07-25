import { m as resolveGatewayPort } from "./paths-CHQRdQZ3.js";
import "./utils-K2PjeLaV.js";
import { t as sleep } from "./sleep-Ce8zcpEF.js";
import { n as resolveGatewayAuth } from "./auth-resolve-OMDlKaXM.js";
import "./config-BOMcY2yX.js";
import { i as GATEWAY_CLIENT_NAMES, n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-D4mGPeue.js";
import { c as callGateway } from "./call-ChM1o8yU.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-DxoP8lsw.js";
import { r as resolveLocalControlUiProbeLinks, t as resolveAdvertisedControlUiLinks } from "./control-ui-links-CzaYlpy_.js";
import { n as openUrl } from "./browser-open-BhXEMQv1.js";
import { n as t } from "./i18n-CX_FBkXY.js";
import { a as formatControlUiSshHint, r as buildOnboardingControlUiUrl } from "./onboard-helpers-p2UlKv8D.js";
//#region src/commands/onboard-browser-handoff.ts
const GUI_HANDOFF_TIMEOUT_MS = 6e4;
const HEADLESS_HANDOFF_TIMEOUT_MS = 3e5;
const HANDOFF_POLL_INTERVAL_MS = 1e3;
const HANDOFF_PROBE_TIMEOUT_MS = 5e3;
function hasSshSession(env) {
	return Boolean(env.SSH_CONNECTION || env.SSH_TTY);
}
/** Pure graphical-session detection used before attempting a browser launch. */
function detectGraphicalSession(env, platform) {
	if (hasSshSession(env)) return false;
	if (platform === "darwin" || platform === "win32") return true;
	if (platform === "linux") return Boolean(env.DISPLAY || env.WAYLAND_DISPLAY);
	return false;
}
async function resolveBrowserHatchTarget(config, env, suppressTokenOutput) {
	const port = resolveGatewayPort(config, env);
	const bind = config.gateway?.bind ?? "loopback";
	const customBindHost = config.gateway?.customBindHost;
	const basePath = config.gateway?.controlUi?.basePath;
	const tlsEnabled = config.gateway?.tls?.enabled === true;
	const credentials = await resolveGatewayCredentialsWithSecretInputs({
		config,
		env,
		modeOverride: "local",
		localTokenPrecedence: "config-first",
		localPasswordPrecedence: "config-first"
	});
	const auth = resolveGatewayAuth({
		authConfig: {
			...config.gateway?.auth,
			...credentials.token ? { token: credentials.token } : {},
			...credentials.password ? { password: credentials.password } : {}
		},
		env: {},
		...config.gateway?.tailscale?.mode ? { tailscaleMode: config.gateway.tailscale.mode } : {}
	});
	const [displayLinks, probeLinks] = await Promise.all([resolveAdvertisedControlUiLinks({
		bind,
		port,
		customBindHost,
		basePath,
		tlsEnabled
	}), Promise.resolve(resolveLocalControlUiProbeLinks({
		bind,
		port,
		customBindHost,
		basePath,
		tlsEnabled
	}))]);
	const token = auth.mode === "token" ? auth.token : void 0;
	const setupAuthValue = auth.mode === "password" ? auth.password : void 0;
	const target = {
		config,
		dashboardUrl: buildOnboardingControlUiUrl({
			httpUrl: displayLinks.httpUrl,
			authMode: auth.mode,
			token,
			suppressTokenOutput
		}),
		...bind === "loopback" ? { sshHint: formatControlUiSshHint({
			port,
			...basePath ? { basePath } : {},
			...token && !suppressTokenOutput ? { token } : {}
		}) } : {},
		wsUrl: probeLinks.wsUrl,
		...token ? { token } : {}
	};
	if (setupAuthValue) target["password"] = setupAuthValue;
	return target;
}
function isConnectedControlUi(entry) {
	return entry.host === GATEWAY_CLIENT_IDS.CONTROL_UI && entry.mode === GATEWAY_CLIENT_MODES.WEBCHAT && entry.reason !== "disconnect";
}
function dashboardPresenceKey(entry) {
	return [
		entry.deviceId,
		entry.instanceId,
		entry.host,
		entry.mode,
		entry.ts
	].join("\0");
}
async function probeDashboardPresence(target, timeoutMs) {
	try {
		return {
			reachable: true,
			clientKeys: (await callGateway({
				config: target.config,
				method: "system-presence",
				timeoutMs,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI,
				...target.token ? { token: target.token } : {},
				...target.password ? { password: target.password } : {},
				expectFinal: false,
				ignoreEnvUrlOverride: true
			}) ?? []).filter(isConnectedControlUi).map(dashboardPresenceKey)
		};
	} catch (error) {
		return {
			reachable: false,
			reason: error instanceof Error ? error.message : String(error)
		};
	}
}
async function waitForDashboardClient(params) {
	const now = params.now ?? Date.now;
	const sleepFor = params.sleep ?? sleep;
	const deadline = now() + params.timeoutMs;
	while (true) {
		const beforeProbeMs = deadline - now();
		if (beforeProbeMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		const result = await params.probe(params.target, Math.min(HANDOFF_PROBE_TIMEOUT_MS, beforeProbeMs));
		if (!result.reachable) return {
			connected: false,
			reason: "gateway-unreachable"
		};
		if (result.clientKeys.some((key) => !params.baselineClientKeys.has(key))) return { connected: true };
		const remainingMs = deadline - now();
		if (remainingMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		await sleepFor(Math.min(HANDOFF_POLL_INTERVAL_MS, remainingMs));
	}
}
/** Lightweight reachability gate used before guided onboarding announces a handoff. */
async function probeBrowserHatchGateway(params) {
	if (params.config.gateway?.controlUi?.enabled === false) return {
		ok: false,
		detail: "control ui disabled"
	};
	try {
		const presence = await probeDashboardPresence(await resolveBrowserHatchTarget(params.config, params.env ?? process.env, false), HANDOFF_PROBE_TIMEOUT_MS);
		return presence.reachable ? { ok: true } : {
			ok: false,
			...presence.reason ? { detail: presence.reason } : {}
		};
	} catch (error) {
		return {
			ok: false,
			detail: error instanceof Error ? error.message : String(error)
		};
	}
}
/** Opens or prints the dashboard and waits for its Control UI client connection. */
async function runBrowserHatchHandoff(params, deps = {}) {
	const env = deps.env ?? process.env;
	const graphical = detectGraphicalSession(env, deps.platform ?? process.platform);
	let target;
	try {
		target = await (deps.resolveTarget ?? resolveBrowserHatchTarget)(params.config, env, params.suppressTokenOutput === true);
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	const probePresence = deps.probePresence ?? probeDashboardPresence;
	const baseline = await probePresence(target, HANDOFF_PROBE_TIMEOUT_MS);
	if (!baseline.reachable) return {
		handedOff: false,
		reason: "gateway-unreachable"
	};
	let opened = false;
	if (graphical) opened = await (deps.openBrowser ?? openUrl)(target.dashboardUrl);
	if (opened) await params.prompter.note(t("wizard.guided.browserHandoffOpening"), t("wizard.guided.browserHandoffTitle"));
	else {
		const sshHint = target.sshHint ? `\n\n${target.sshHint}` : "";
		await params.prompter.note(`${t("wizard.guided.browserHandoffCopy", { url: target.dashboardUrl })}${sshHint}`, t("wizard.guided.browserHandoffTitle"));
	}
	const wait = await (deps.pollForClient ?? waitForDashboardClient)({
		target,
		baselineClientKeys: new Set(baseline.clientKeys),
		timeoutMs: graphical ? GUI_HANDOFF_TIMEOUT_MS : HEADLESS_HANDOFF_TIMEOUT_MS,
		probe: probePresence,
		...deps.now ? { now: deps.now } : {},
		...deps.sleep ? { sleep: deps.sleep } : {}
	});
	if (!wait.connected) return {
		handedOff: false,
		reason: wait.reason
	};
	await params.prompter.note(t("wizard.guided.browserHandoffContinuing"), t("wizard.guided.browserHandoffTitle"));
	return { handedOff: true };
}
//#endregion
export { probeBrowserHatchGateway, runBrowserHatchHandoff };
