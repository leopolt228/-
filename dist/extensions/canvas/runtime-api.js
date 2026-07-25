import { t as resolveHostedPluginSurfaceUrl } from "../../hosted-plugin-surface-url-C5u_O_hj.js";
import { c as normalizePluginNodeCapabilityScopedUrl, n as PLUGIN_NODE_CAPABILITY_PATH_PREFIX, r as buildPluginNodeCapabilityScopedHostUrl, s as mintPluginNodeCapabilityToken, t as DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS } from "../../plugin-node-capability-9V7uhGk6.js";
import "../../gateway-runtime-BpblXBwU.js";
import { a as resolveCanvasHostConfig, i as parseCanvasPluginConfig, n as isCanvasHostEnabled, r as isCanvasPluginEnabled, t as canvasConfigSchema } from "../../config-a5Ixt-uf.js";
import { n as CANVAS_HOST_PATH, r as CANVAS_WS_PATH, t as A2UI_PATH } from "../../a2ui-shared-CYxiODnT.js";
import { t as handleA2uiHttpRequest } from "../../a2ui-HytU9Koy.js";
import { n as startCanvasHost, t as createCanvasHostHandler } from "../../server-CMduNhEj.js";
import { r as parseCanvasSnapshotPayload, t as canvasSnapshotTempPath } from "../../cli-helpers-CKKJnsCi.js";
import { n as registerNodesCanvasCommands } from "../../cli-Do3OgS9S.js";
//#region extensions/canvas/src/capability.ts
/**
* Canvas capability-token helpers for scoped hosted node URLs.
*/
/** Path prefix used for Canvas capability-scoped gateway routes. */
const CANVAS_CAPABILITY_PATH_PREFIX = PLUGIN_NODE_CAPABILITY_PATH_PREFIX;
/** Default Canvas capability token TTL in milliseconds. */
const CANVAS_CAPABILITY_TTL_MS = DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS;
/** Creates a new opaque Canvas capability token. */
function mintCanvasCapabilityToken() {
	return mintPluginNodeCapabilityToken();
}
/** Builds a Canvas host URL scoped by the supplied capability token. */
function buildCanvasScopedHostUrl(baseUrl, capability) {
	return buildPluginNodeCapabilityScopedHostUrl(baseUrl, capability);
}
/** Normalizes and validates a Canvas capability-scoped URL. */
function normalizeCanvasScopedUrl(rawUrl) {
	return normalizePluginNodeCapabilityScopedUrl(rawUrl);
}
//#endregion
//#region extensions/canvas/src/host-url.ts
/**
* Canvas hosted-surface URL resolver.
*/
/** Resolves the externally visible Canvas host URL for a gateway/plugin surface. */
function resolveCanvasHostUrl(params) {
	return resolveHostedPluginSurfaceUrl({
		...params,
		port: params.canvasPort
	});
}
//#endregion
export { A2UI_PATH, CANVAS_CAPABILITY_PATH_PREFIX, CANVAS_CAPABILITY_TTL_MS, CANVAS_HOST_PATH, CANVAS_WS_PATH, buildCanvasScopedHostUrl, canvasConfigSchema, canvasSnapshotTempPath, createCanvasHostHandler, handleA2uiHttpRequest, isCanvasHostEnabled, isCanvasPluginEnabled, mintCanvasCapabilityToken, normalizeCanvasScopedUrl, parseCanvasPluginConfig, parseCanvasSnapshotPayload, registerNodesCanvasCommands, resolveCanvasHostConfig, resolveCanvasHostUrl, startCanvasHost };
