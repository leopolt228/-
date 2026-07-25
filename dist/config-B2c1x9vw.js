import { n as isTruthyEnvValue } from "./env-CHfvZ8Nb.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/canvas/config.ts
/** Core Canvas host enablement from the shipped Canvas plugin configuration surface. */
/** Returns whether core-owned widget hosting and tools should be active. */
function isCoreCanvasHostEnabled(config, env = process.env) {
	if (isTruthyEnvValue(env.OPENCLAW_SKIP_CANVAS_HOST)) return false;
	const host = config?.plugins?.entries?.canvas?.config?.host;
	return !isRecord(host) || host.enabled !== false;
}
//#endregion
export { isCoreCanvasHostEnabled as t };
