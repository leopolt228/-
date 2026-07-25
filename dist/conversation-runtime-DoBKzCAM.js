import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./session-binding-service-CN_JDEcd.js";
import "./conversation-binding-DxvXOS3H.js";
import "./thread-bindings-policy-KHvvPdbA.js";
import "./session-yxeGbX83.js";
import "./pairing-store-BaZlMduS.js";
import "./binding-routing-3b8H2XZ-.js";
import "./pairing-labels-CcWgNb6K.js";
import "./channel-access-compat-Cr7fdQii.js";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
/**
* Best-effort inbound session metadata recorder for channel plugin command handlers.
*/
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordInboundSessionMeta({
			storePath,
			sessionKey: params.sessionKey,
			ctx: params.ctx
		});
	} catch (err) {
		params.onError?.(err);
	}
}
//#endregion
export { recordInboundSessionMetaSafe as t };
