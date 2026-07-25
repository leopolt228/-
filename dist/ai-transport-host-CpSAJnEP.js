import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { i as redactSecrets, u as redactToolPayloadText } from "./redact-DNq_HeDt.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { d as swapSecretSentinelsInText } from "./provider-secret-egress-BC9ES6v4.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-D75_xhiu.js";
import { t as buildGuardedModelFetch } from "./provider-transport-fetch-CqHtV1lD.js";
import { configureAiTransportHost } from "@openclaw/ai";
//#region src/agents/openai-strict-tool-setting.ts
/**
* Strict tool-schema default resolution for native OpenAI-compatible routes.
*
* Compatible providers can support strict schemas without inheriting OpenAI's required default.
*/
const optionalString = readStringValue;
function resolvesToNativeOpenAIStrictTools(model, transport) {
	const capabilities = resolveProviderRequestCapabilities({
		provider: optionalString(model.provider),
		api: optionalString(model.api),
		baseUrl: optionalString(model.baseUrl),
		capability: "llm",
		transport,
		modelId: optionalString(model.id),
		compat: model.compat
	});
	if (!capabilities.usesKnownNativeOpenAIRoute) return false;
	return capabilities.provider === "openai" || capabilities.provider === "azure-openai" || capabilities.provider === "azure-openai-responses";
}
/** Resolve the strict-tool setting for one OpenAI-compatible model/transport. */
function resolveOpenAIStrictToolSetting(model, options) {
	if (resolvesToNativeOpenAIStrictTools(model, options?.transport ?? "stream")) return true;
	if (options?.supportsStrictMode) return false;
}
//#endregion
//#region src/llm/ai-transport-host.ts
const transportLogBySubsystem = /* @__PURE__ */ new Map();
function transportLog(subsystem) {
	let log = transportLogBySubsystem.get(subsystem);
	if (!log) {
		log = createSubsystemLogger(subsystem);
		transportLogBySubsystem.set(subsystem, log);
	}
	return log;
}
configureAiTransportHost({
	buildModelFetch: buildGuardedModelFetch,
	resolveSecretSentinel: (value) => {
		const swapped = swapSecretSentinelsInText(value);
		const unknown = swapped.unknown[0];
		if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing to construct provider client`);
		return swapped.text;
	},
	redactSecrets,
	redactToolPayloadText,
	resolveOpenAIStrictToolSetting,
	logDebug: (subsystem, build) => {
		const log = transportLog(subsystem);
		if (!log.isEnabled("debug", "any")) return;
		const entry = build();
		if (entry) log.debug(entry.message, entry.data);
	}
});
//#endregion
export { resolveOpenAIStrictToolSetting as t };
