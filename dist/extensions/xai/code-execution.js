import { p as readProviderJsonObjectResponse } from "../../provider-http-errors-DrOMjuGn.js";
import { a as getRuntimeConfigSnapshot } from "../../runtime-snapshot-BW7iP5ad.js";
import { _ as readStringParam } from "../../common-C39GdgQ7.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import "../../runtime-config-snapshot-CbOz4rru.js";
import { d as postTrustedWebToolsJson } from "../../web-search-provider-common-9xC_0p_Y.js";
import "../../provider-http-D2uO-AEP.js";
import "../../provider-web-search-CyddQoxo.js";
import { a as XAI_DEFAULT_MODEL_ID } from "../../model-definitions-C831dtJI.js";
import { n as createCodeExecutionToolDefinition, t as buildMissingCodeExecutionApiKeyPayload } from "../../code-execution-tool-shared-CeAkKo1Y.js";
import { r as resolveXaiToolApiKeyWithAuth } from "../../tool-auth-shared-Ny7TRVp9.js";
import { n as readPluginCodeExecutionConfig, r as resolveCodeExecutionEnabled, t as readCodeExecutionConfigRecord } from "../../code-execution-config-DljwG_FH.js";
import { n as resolveNormalizedXaiToolModel, r as resolvePositiveIntegerToolConfig } from "../../tool-config-shared-Kd1mcFgS.js";
import { i as requireXaiResponseTextAndCitations, n as buildXaiResponsesToolBody, t as XAI_RESPONSES_ENDPOINT } from "../../responses-tool-shared-CO9AID3-.js";
//#region extensions/xai/src/code-execution-shared.ts
const XAI_CODE_EXECUTION_ENDPOINT = XAI_RESPONSES_ENDPOINT;
const XAI_DEFAULT_CODE_EXECUTION_MODEL = XAI_DEFAULT_MODEL_ID;
function resolveXaiCodeExecutionModel(config) {
	return resolveNormalizedXaiToolModel({
		config,
		defaultModel: XAI_DEFAULT_CODE_EXECUTION_MODEL
	});
}
function resolveXaiCodeExecutionMaxTurns(config) {
	return resolvePositiveIntegerToolConfig(config, "maxTurns");
}
function buildXaiCodeExecutionPayload(params) {
	return {
		task: params.task,
		provider: "xai",
		model: params.model,
		tookMs: params.tookMs,
		content: params.content,
		citations: params.citations,
		usedCodeExecution: params.usedCodeExecution,
		outputTypes: params.outputTypes
	};
}
async function requestXaiCodeExecution(params) {
	return await postTrustedWebToolsJson({
		url: XAI_CODE_EXECUTION_ENDPOINT,
		timeoutSeconds: params.timeoutSeconds,
		apiKey: params.apiKey,
		body: buildXaiResponsesToolBody({
			model: params.model,
			inputText: params.task,
			tools: [{ type: "code_interpreter" }],
			maxTurns: params.maxTurns,
			reasoningEffort: params.model === XAI_DEFAULT_CODE_EXECUTION_MODEL ? "low" : void 0
		}),
		errorLabel: "xAI"
	}, async (response) => {
		const data = await readProviderJsonObjectResponse(response, "xAI code execution failed");
		const { content, citations } = requireXaiResponseTextAndCitations(data, "xAI code execution failed");
		const outputTypes = Array.isArray(data.output) ? [...new Set(data.output.map((entry) => entry?.type).filter((value) => Boolean(value)))] : [];
		return {
			content,
			citations,
			usedCodeExecution: outputTypes.includes("code_interpreter_call"),
			outputTypes
		};
	});
}
//#endregion
//#region extensions/xai/code-execution.ts
function createCodeExecutionTool(options) {
	const runtimeConfig = options?.runtimeConfig ?? getRuntimeConfigSnapshot();
	const codeExecutionConfig = readPluginCodeExecutionConfig(runtimeConfig ?? void 0) ?? readPluginCodeExecutionConfig(options?.config);
	if (!resolveCodeExecutionEnabled({
		sourceConfig: options?.config,
		runtimeConfig: runtimeConfig ?? void 0,
		config: codeExecutionConfig,
		auth: options?.auth
	})) return null;
	return createCodeExecutionToolDefinition(async (_toolCallId, args) => {
		const apiKey = await resolveXaiToolApiKeyWithAuth({
			runtimeConfig: runtimeConfig ?? void 0,
			sourceConfig: options?.config,
			auth: options?.auth
		});
		if (!apiKey) return jsonResult(buildMissingCodeExecutionApiKeyPayload());
		const task = readStringParam(args, "task", { required: true });
		const codeExecutionConfigRecord = readCodeExecutionConfigRecord(codeExecutionConfig);
		const model = resolveXaiCodeExecutionModel(codeExecutionConfigRecord);
		const maxTurns = resolveXaiCodeExecutionMaxTurns(codeExecutionConfigRecord);
		const timeoutSeconds = typeof codeExecutionConfigRecord?.timeoutSeconds === "number" && Number.isFinite(codeExecutionConfigRecord.timeoutSeconds) ? codeExecutionConfigRecord.timeoutSeconds : 30;
		const startedAt = Date.now();
		const result = await requestXaiCodeExecution({
			apiKey,
			model,
			timeoutSeconds,
			maxTurns,
			task
		});
		return jsonResult(buildXaiCodeExecutionPayload({
			task,
			model,
			tookMs: Date.now() - startedAt,
			content: result.content,
			citations: result.citations,
			usedCodeExecution: result.usedCodeExecution,
			outputTypes: result.outputTypes
		}));
	});
}
//#endregion
export { createCodeExecutionTool };
