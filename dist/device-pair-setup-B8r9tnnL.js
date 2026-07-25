import { r as runCommandWithTimeout } from "./exec-Cb0CNQNz.js";
import { t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { ht as validateDevicePairSetupCodeParams } from "./src-Cy32TawB.js";
import { n as renderQrPngDataUrl } from "./qr-image-D9DQA_F6.js";
import { b as PAIRING_SETUP_BOOTSTRAP_PROFILE, y as NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE } from "./device-bootstrap-jcudyeA5.js";
import { t as formatForLog } from "./ws-log-Bj-6Do--.js";
import { n as resolvePairingSetupFromConfig, t as encodePairingSetupCode } from "./setup-code-UnTdva8l.js";
import { t as assertValidParams } from "./validation-5fLHFuIF.js";
//#region src/gateway/server-methods/device-pair-setup.ts
const MAX_QR_DATA_URL_LENGTH = 16384;
function readConfiguredDevicePairPublicUrl(config) {
	const value = config.plugins?.entries?.["device-pair"]?.config?.["publicUrl"];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
/** Gateway handler for producing a device-pairing setup code + connect QR. */
const devicePairSetupHandlers = { "device.pair.setupCode": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateDevicePairSetupCodeParams, "device.pair.setupCode", respond)) return;
	try {
		const config = context.getRuntimeConfig();
		const requestPublicUrl = typeof params.publicUrl === "string" ? params.publicUrl : void 0;
		const configuredPublicUrl = params.preferRemoteUrl === true ? void 0 : readConfiguredDevicePairPublicUrl(config);
		const publicUrl = requestPublicUrl ?? configuredPublicUrl;
		const resolved = await resolvePairingSetupFromConfig(config, {
			env: process.env,
			publicUrl,
			preferRemoteUrl: params.preferRemoteUrl === true,
			...params.bootstrapProfile ? { bootstrapProfile: params.bootstrapProfile === "node" ? NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE : PAIRING_SETUP_BOOTSTRAP_PROFILE } : {},
			runCommandWithTimeout: async (argv, runOpts) => await runCommandWithTimeout(argv, { timeoutMs: runOpts.timeoutMs })
		});
		if (!resolved.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, resolved.error));
			return;
		}
		const setupCode = encodePairingSetupCode(resolved.payload);
		const renderedQr = params.includeQr !== false ? await renderQrPngDataUrl(setupCode).catch(() => void 0) : void 0;
		const qrDataUrl = renderedQr && renderedQr.length <= MAX_QR_DATA_URL_LENGTH ? renderedQr : void 0;
		respond(true, {
			setupCode,
			...qrDataUrl ? { qrDataUrl } : {},
			gatewayUrl: resolved.payload.url,
			...resolved.payload.urls ? { gatewayUrls: resolved.payload.urls } : {},
			auth: resolved.authLabel,
			urlSource: requestPublicUrl ? "request.publicUrl" : resolved.urlSource,
			access: resolved.access,
			...resolved.accessDowngraded ? { accessDowngraded: true } : {}
		}, void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
	}
} };
//#endregion
export { devicePairSetupHandlers };
