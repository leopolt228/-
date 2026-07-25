import { i as createAssistantMessageEventStream } from "../../validation-BnRQQL2Q.js";
import "../../llm-23LMVVXI.js";
import { t as definePluginEntry } from "../../plugin-entry-IGDbtR-A.js";
import { t as createLocalEmbeddingProvider } from "../../embeddings-D-HBqAK-.js";
import "../../memory-core-host-engine-embeddings-BgaDotZ3.js";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region extensions/llama-cpp/src/defaults.ts
const LLAMA_CPP_PROVIDER_ID = "llama-cpp";
const LLAMA_CPP_PROVIDER_LABEL = "Local model (llama.cpp)";
const LLAMA_CPP_LOCAL_AUTH_MARKER = "llama-cpp-local";
const LLAMA_CPP_LOCAL_BASE_URL = "local://llama-cpp";
function resolveLlamaCppSyntheticApiKey() {
	return LLAMA_CPP_LOCAL_AUTH_MARKER;
}
const DEFAULT_LLAMA_CPP_MODEL_ID = "gemma-4-e4b-it-q4_k_m";
const DEFAULT_LLAMA_CPP_MODEL_REF = `${LLAMA_CPP_PROVIDER_ID}/${DEFAULT_LLAMA_CPP_MODEL_ID}`;
const DEFAULT_LLAMA_CPP_MODEL_URI = "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf";
const DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE = "hf_unsloth_gemma-4-E4B-it-GGUF_gemma-4-E4B-it-Q4_K_M.gguf";
const DEFAULT_LLAMA_CPP_CONTEXT_SIZE = 8192;
const LLAMA_CPP_DEFAULT_MODEL_RAM_FLOOR_BYTES = 16 * 1024 ** 3;
function meetsLlamaCppDefaultModelRamFloor(totalmemBytes = os.totalmem()) {
	return totalmemBytes >= LLAMA_CPP_DEFAULT_MODEL_RAM_FLOOR_BYTES;
}
function resolveLlamaCppModelCacheDir(provider) {
	const configured = provider?.params?.modelCacheDir;
	return typeof configured === "string" && configured.trim() ? resolveHomePath(configured.trim()) : path.join(os.homedir(), ".node-llama-cpp", "models");
}
function resolveHomePath(value) {
	if (value === "~") return os.homedir();
	if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
	return value;
}
function resolveLlamaCppModelSource(model) {
	const configured = model.params?.modelPath;
	if (typeof configured === "string" && configured.trim()) return resolveHomePath(configured.trim());
	return model.id === "gemma-4-e4b-it-q4_k_m" ? DEFAULT_LLAMA_CPP_MODEL_URI : resolveHomePath(model.id);
}
function resolveCachedLlamaCppModelPath(params) {
	const source = resolveLlamaCppModelSource(params.model);
	const cacheDir = resolveLlamaCppModelCacheDir(params.provider);
	if (source === "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf") return path.join(cacheDir, DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
	if (/^hf:/i.test(source)) return null;
	if (/^https?:\/\//i.test(source)) return null;
	const localPath = resolveHomePath(source);
	return path.isAbsolute(localPath) ? localPath : path.resolve(cacheDir, localPath);
}
function buildDefaultLlamaCppModel() {
	return {
		id: DEFAULT_LLAMA_CPP_MODEL_ID,
		name: "Gemma 4 E4B (Q4_K_M)",
		api: "openai-completions",
		reasoning: false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
		contextTokens: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
		maxTokens: 2048,
		params: {
			modelPath: DEFAULT_LLAMA_CPP_MODEL_URI,
			contextSize: "auto"
		},
		compat: {
			supportsTools: true,
			supportsUsageInStreaming: true
		}
	};
}
function buildLlamaCppProviderConfig(existing) {
	const defaultModel = buildDefaultLlamaCppModel();
	const configuredModels = existing?.models ?? [];
	const models = configuredModels.some((model) => model.id === defaultModel.id) ? configuredModels : [...configuredModels, defaultModel];
	return {
		...existing,
		baseUrl: existing?.baseUrl ?? LLAMA_CPP_LOCAL_BASE_URL,
		api: existing?.api ?? "openai-completions",
		models
	};
}
//#endregion
//#region extensions/llama-cpp/src/node-llama.runtime.ts
function isNodeLlamaCppMissing(error) {
	if (!(error instanceof Error)) return false;
	return error.code === "ERR_MODULE_NOT_FOUND" && error.message.includes("node-llama-cpp");
}
function formatErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
function formatLlamaCppSetupError(error) {
	const detail = formatErrorMessage(error);
	const missing = isNodeLlamaCppMissing(error);
	return [
		"Local llama.cpp is unavailable.",
		missing ? "Reason: node-llama-cpp is missing or failed to install." : detail ? `Reason: ${detail}` : void 0,
		missing && detail ? `Detail: ${detail}` : null,
		"To enable local GGUF models:",
		"1) Install the official provider plugin: openclaw plugins install @openclaw/llama-cpp-provider",
		"2) Use Node 24 for native installs/updates.",
		"3) If you use pnpm from source: pnpm approve-builds, then pnpm rebuild node-llama-cpp."
	].filter(Boolean).join("\n");
}
const requireFromPlugin = createRequire(import.meta.url);
function resolveNodeLlamaCppImportUrl() {
	return pathToFileURL(requireFromPlugin.resolve("node-llama-cpp")).href;
}
async function importNodeLlamaCpp() {
	return await import(resolveNodeLlamaCppImportUrl());
}
//#endregion
//#region extensions/llama-cpp/src/embedding-provider.ts
const LLAMA_CPP_EMBEDDING_PROVIDER_ID = "local";
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_CACHE_FILE_NAME = "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf";
function normalizeOptionalString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readLocalOptions(options) {
	return options.local ?? {};
}
function createLlamaCppCacheKeyData(model, outputDimensionality) {
	return {
		provider: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
		model,
		...typeof outputDimensionality === "number" ? { outputDimensionality } : {}
	};
}
function resolveLlamaCppModelIdentity(local, modelPath, outputDimensionality) {
	const modelCacheDir = normalizeOptionalString(local.modelCacheDir) ?? path.join(os.homedir(), ".node-llama-cpp", "models");
	const resolvedDefaultModelPath = path.resolve(modelCacheDir, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_CACHE_FILE_NAME);
	const resolvedModelPath = /^(?:hf:|https?:\/\/)/i.test(modelPath) ? void 0 : path.resolve(modelCacheDir, modelPath);
	if (modelPath !== DEFAULT_LLAMA_CPP_EMBEDDING_MODEL && resolvedModelPath !== resolvedDefaultModelPath) return {
		model: modelPath,
		cacheKeyData: createLlamaCppCacheKeyData(modelPath, outputDimensionality),
		aliases: []
	};
	const aliasModels = /* @__PURE__ */ new Set([resolvedDefaultModelPath, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_CACHE_FILE_NAME]);
	if (modelPath !== DEFAULT_LLAMA_CPP_EMBEDDING_MODEL) aliasModels.add(modelPath);
	return {
		model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
		cacheKeyData: createLlamaCppCacheKeyData(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, outputDimensionality),
		aliases: Array.from(aliasModels, (aliasModel) => ({
			model: aliasModel,
			cacheKeyData: createLlamaCppCacheKeyData(aliasModel, outputDimensionality)
		}))
	};
}
function textFromEmbeddingInput(input) {
	return typeof input === "string" ? input : input.text;
}
function toMemoryEmbeddingInput(input) {
	return typeof input === "string" ? { text: input } : input;
}
function copyLocalRuntimeFacts(source, target) {
	const getRuntimeFacts = Reflect.get(source, LOCAL_EMBEDDING_RUNTIME_FACTS);
	if (typeof getRuntimeFacts === "function") Object.defineProperty(target, LOCAL_EMBEDDING_RUNTIME_FACTS, {
		enumerable: false,
		value: getRuntimeFacts
	});
}
function adaptMemoryEmbeddingProvider(provider) {
	const adapted = {
		id: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
		model: provider.model,
		maxInputTokens: provider.maxInputTokens,
		embed: async (input, callOptions) => await provider.embedQuery(textFromEmbeddingInput(input), { signal: callOptions?.signal }),
		embedBatch: async (inputs, callOptions) => {
			if (provider.embedBatchInputs) return await provider.embedBatchInputs(inputs.map(toMemoryEmbeddingInput), { signal: callOptions?.signal });
			return await provider.embedBatch(inputs.map(textFromEmbeddingInput), { signal: callOptions?.signal });
		},
		close: provider.close
	};
	copyLocalRuntimeFacts(provider, adapted);
	return adapted;
}
async function createLlamaCppMemoryEmbeddingProvider(options, runtimeOptions = {}) {
	const createOptions = buildMemoryCreateOptions(options, options.outputDimensionality);
	const local = readLocalOptions(createOptions);
	const provider = await createLocalEmbeddingProvider(createOptions, { nodeLlamaCppImportUrl: runtimeOptions.nodeLlamaCppImportUrl ?? resolveNodeLlamaCppImportUrl() });
	const identity = resolveLlamaCppModelIdentity(local, provider.model, createOptions.outputDimensionality);
	const identifiedProvider = identity.model === provider.model ? provider : {
		...provider,
		model: identity.model
	};
	if (identifiedProvider !== provider) copyLocalRuntimeFacts(provider, identifiedProvider);
	return {
		provider: identifiedProvider,
		runtime: createLlamaCppEmbeddingProviderRuntime(identity)
	};
}
async function createLlamaCppEmbeddingProviderResult(options, runtimeOptions = {}) {
	const result = await createLlamaCppMemoryEmbeddingProvider(buildMemoryCreateOptions(options, options.dimensions), runtimeOptions);
	return {
		provider: result.provider ? adaptMemoryEmbeddingProvider(result.provider) : null,
		runtime: result.runtime
	};
}
function buildMemoryCreateOptions(options, outputDimensionality) {
	const local = readLocalOptions(options);
	const modelPath = normalizeOptionalString(local.modelPath) || DEFAULT_LLAMA_CPP_EMBEDDING_MODEL;
	return {
		config: options.config,
		agentDir: options.agentDir,
		provider: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
		fallback: "none",
		remote: options.remote,
		model: modelPath,
		inputType: options.inputType,
		queryInputType: options.queryInputType,
		documentInputType: options.documentInputType,
		local: {
			...local,
			modelPath
		},
		outputDimensionality
	};
}
function createLlamaCppEmbeddingProviderRuntime(identity) {
	return {
		id: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
		inlineQueryTimeoutMs: 5 * 6e4,
		inlineBatchTimeoutMs: 10 * 6e4,
		cacheKeyData: identity.cacheKeyData,
		...identity.aliases.length > 0 ? { indexIdentityAliases: identity.aliases } : {}
	};
}
const llamaCppEmbeddingProviderAdapter = {
	id: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
	defaultModel: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
	transport: "local",
	formatSetupError: formatLlamaCppSetupError,
	resolveIndexIdentity: (options) => {
		const createOptions = buildMemoryCreateOptions(options, options.dimensions);
		const local = readLocalOptions(createOptions);
		return resolveLlamaCppModelIdentity(local, normalizeOptionalString(local.modelPath) ?? DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, createOptions.outputDimensionality);
	},
	create: async (options) => await createLlamaCppEmbeddingProviderResult(options)
};
//#endregion
//#region extensions/llama-cpp/src/inference-provider.ts
let loadedModel;
let llamaInstance;
let operationQueue = Promise.resolve();
function zeroCostUsage(input = 0, output = 0) {
	return {
		input,
		output,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: input + output,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
function buildMessage(params) {
	return {
		role: "assistant",
		content: params.content,
		api: params.model.api,
		provider: params.model.provider,
		model: params.model.id,
		stopReason: params.stopReason,
		usage: params.usage ?? zeroCostUsage(),
		timestamp: Date.now(),
		...params.errorMessage ? { errorMessage: params.errorMessage } : {}
	};
}
function extractText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((part) => Boolean(part) && typeof part === "object" && part.type === "text").map((part) => part.text).join("");
}
function normalizeArguments(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function mapContextToLlamaChatHistory(context) {
	const history = [];
	if (context.systemPrompt?.trim()) history.push({
		type: "system",
		text: context.systemPrompt
	});
	const toolResults = new Map(context.messages.filter((message) => message.role === "toolResult").map((message) => [message.toolCallId, extractText(message.content)]));
	const consumedToolResults = /* @__PURE__ */ new Set();
	for (const message of context.messages) {
		if (message.role === "user") {
			history.push({
				type: "user",
				text: extractText(message.content)
			});
			continue;
		}
		if (message.role === "assistant") {
			const response = [];
			for (const part of message.content) {
				if (part.type === "text") {
					if (part.text) response.push(part.text);
					continue;
				}
				if (part.type === "thinking") {
					if (part.thinking) response.push({
						type: "segment",
						segmentType: "thought",
						text: part.thinking,
						ended: true
					});
					continue;
				}
				const result = toolResults.get(part.id);
				if (result !== void 0) consumedToolResults.add(part.id);
				response.push({
					type: "functionCall",
					name: part.name,
					params: part.arguments,
					result: result ?? ""
				});
			}
			history.push({
				type: "model",
				response
			});
			continue;
		}
		if (!consumedToolResults.has(message.toolCallId)) history.push({
			type: "user",
			text: `Tool result (${message.toolName}): ${extractText(message.content)}`
		});
	}
	return history;
}
function mapToolsToLlamaFunctions(context) {
	if (!context.tools?.length) return;
	return Object.fromEntries(context.tools.map((tool) => [tool.name, {
		description: tool.description,
		params: tool.parameters
	}]));
}
function readContextSizeValue(value) {
	if (value === "auto") return value;
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function resolveContextSize(model, providerConfig) {
	const configured = readContextSizeValue(model.params?.contextSize) ?? readContextSizeValue(providerConfig?.params?.contextSize);
	if (typeof configured === "number") return configured;
	return { max: typeof model.contextTokens === "number" && model.contextTokens > 0 ? Math.floor(model.contextTokens) : DEFAULT_LLAMA_CPP_CONTEXT_SIZE };
}
async function disposeLoadedModel() {
	if (!loadedModel) return;
	const previous = loadedModel;
	loadedModel = void 0;
	await previous.context.dispose();
	await previous.model.dispose();
}
async function getLoadedModel(params) {
	const source = resolveLlamaCppModelSource(params.model);
	const modelPath = await params.runtime.resolveModelFile(source, {
		directory: resolveLlamaCppModelCacheDir(params.providerConfig),
		download: false
	});
	const contextSize = resolveContextSize(params.model, params.providerConfig);
	const key = `${modelPath}\0${JSON.stringify(contextSize)}`;
	if (loadedModel?.key === key) return loadedModel;
	await disposeLoadedModel();
	const llama = llamaInstance ?? await params.runtime.getLlama();
	llamaInstance = llama;
	const fitContextSize = typeof contextSize === "number" ? contextSize : contextSize.max;
	const model = await llama.loadModel({
		modelPath,
		loadSignal: params.signal,
		gpuLayers: { fitContext: { contextSize: fitContextSize } }
	});
	let context;
	try {
		context = await model.createContext({
			contextSize,
			createSignal: params.signal
		});
		const sequence = context.getSequence();
		loadedModel = {
			key,
			model,
			context,
			sequence
		};
		return loadedModel;
	} catch (error) {
		await context?.dispose();
		await model.dispose();
		throw error;
	}
}
async function serialize(operation) {
	const current = operationQueue.then(operation, operation);
	operationQueue = current.catch(() => void 0);
	await current;
}
async function clearLlamaCppInferenceCacheForTests() {
	await serialize(async () => {
		await disposeLoadedModel();
		if (llamaInstance) {
			await llamaInstance.dispose();
			llamaInstance = void 0;
		}
	});
}
function createLlamaCppStreamFn(params) {
	return (model, context, options) => {
		const stream = createAssistantMessageEventStream();
		let streamedText = "";
		let generationAborted = false;
		let started = false;
		let ended = false;
		const signal = options?.signal;
		const abortWhileQueued = () => {
			if (started || ended) return;
			ended = true;
			stream.push({
				type: "error",
				reason: "aborted",
				error: buildMessage({
					model,
					content: [],
					stopReason: "aborted",
					errorMessage: "Request was aborted"
				})
			});
			stream.end();
		};
		signal?.addEventListener("abort", abortWhileQueued, { once: true });
		if (signal?.aborted) abortWhileQueued();
		const run = async () => {
			if (ended) return;
			started = true;
			signal?.removeEventListener("abort", abortWhileQueued);
			try {
				const runtime = await importNodeLlamaCpp();
				const sequence = (await getLoadedModel({
					runtime,
					model,
					providerConfig: params.providerConfig,
					signal: options?.signal
				})).sequence;
				const chat = new runtime.LlamaChat({
					contextSequence: sequence,
					chatWrapper: "auto",
					autoDisposeSequence: false
				});
				const before = sequence.tokenMeter.getState();
				let textStarted = false;
				const partial = () => buildMessage({
					model,
					content: streamedText ? [{
						type: "text",
						text: streamedText
					}] : [],
					stopReason: "stop"
				});
				const appendTextDelta = (delta) => {
					if (!delta) return;
					if (!textStarted) {
						textStarted = true;
						stream.push({
							type: "start",
							partial: partial()
						});
						stream.push({
							type: "text_start",
							contentIndex: 0,
							partial: partial()
						});
					}
					streamedText += delta;
					stream.push({
						type: "text_delta",
						contentIndex: 0,
						delta
					});
				};
				try {
					const result = await chat.generateResponse(mapContextToLlamaChatHistory(context), {
						functions: mapToolsToLlamaFunctions(context),
						documentFunctionParams: true,
						signal: options?.signal,
						maxTokens: options?.maxTokens ?? model.maxTokens,
						temperature: options?.temperature,
						customStopTriggers: options?.stop,
						onTextChunk: appendTextDelta
					});
					if (result.metadata.stopReason === "abort" || signal?.aborted) {
						generationAborted = true;
						throw signal?.reason ?? /* @__PURE__ */ new Error("Request was aborted");
					}
					const usageDelta = sequence.tokenMeter.diff(before);
					if (!streamedText && result.response) appendTextDelta(result.response);
					const content = streamedText ? [{
						type: "text",
						text: streamedText
					}] : [];
					if (textStarted) stream.push({
						type: "text_end",
						contentIndex: 0,
						content: streamedText,
						partial: partial()
					});
					const toolCalls = (result.functionCalls ?? []).map((call) => ({
						type: "toolCall",
						id: `llama_cpp_call_${randomUUID()}`,
						name: call.functionName,
						arguments: normalizeArguments(call.params)
					}));
					content.push(...toolCalls);
					const reason = toolCalls.length > 0 ? "toolUse" : result.metadata.stopReason === "maxTokens" ? "length" : "stop";
					const message = buildMessage({
						model,
						content,
						stopReason: reason,
						usage: zeroCostUsage(usageDelta.usedInputTokens, usageDelta.usedOutputTokens)
					});
					stream.push({
						type: "done",
						reason,
						message
					});
				} finally {
					chat.dispose();
				}
			} catch (error) {
				const aborted = generationAborted || options?.signal?.aborted === true;
				const reason = aborted ? "aborted" : "error";
				const errorMessage = aborted ? "Request was aborted" : formatLlamaCppSetupError(error);
				stream.push({
					type: "error",
					reason,
					error: buildMessage({
						model,
						content: streamedText ? [{
							type: "text",
							text: streamedText
						}] : [],
						stopReason: reason,
						errorMessage
					})
				});
			} finally {
				ended = true;
				stream.end();
			}
		};
		if (!ended) queueMicrotask(() => void serialize(run));
		return stream;
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.llamaCppInferenceTestApi")] = {
	mapContextToLlamaChatHistory,
	mapToolsToLlamaFunctions,
	clearLlamaCppInferenceCacheForTests
};
//#endregion
//#region extensions/llama-cpp/src/setup.ts
const BYTES_PER_GB = 1e9;
const BYTES_PER_MB = 1e6;
function formatLlamaCppDownloadProgress(params) {
	const downloadedSize = Math.max(0, params.downloadedSize);
	const totalSize = Math.max(1, params.totalSize);
	return `Downloading Gemma 4 E4B… ${Math.min(100, Math.floor(downloadedSize / totalSize * 100))}% (${(downloadedSize / BYTES_PER_GB).toFixed(1)}/${(totalSize / BYTES_PER_GB).toFixed(1)} GB, ${Math.max(0, Math.round(params.bytesPerSecond / BYTES_PER_MB))} MB/s)`;
}
function formatRamGb(totalmemBytes) {
	return (totalmemBytes / 1024 ** 3).toFixed(1).replace(/\.0$/, "");
}
function readPrimaryModel(config) {
	const model = config.agents?.defaults?.model;
	return typeof model === "string" ? model : model?.primary;
}
function configuredCandidates(config) {
	const existing = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const provider = buildLlamaCppProviderConfig(existing);
	const primary = readPrimaryModel(config);
	const primaryId = primary?.startsWith(`llama-cpp/`) ? primary.slice(10) : void 0;
	return provider.models.map((model) => ({
		model,
		provider
	})).toSorted((a, b) => Number(b.model.id === primaryId) - Number(a.model.id === primaryId));
}
async function isFile(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function detectLlamaCppSetup(ctx) {
	let runtime;
	try {
		runtime = await importNodeLlamaCpp();
	} catch {
		return null;
	}
	for (const candidate of configuredCandidates(ctx.config)) try {
		if (!await isFile(await runtime.resolveModelFile(resolveLlamaCppModelSource(candidate.model), {
			directory: resolveLlamaCppModelCacheDir(candidate.provider),
			download: false,
			cli: false
		}))) continue;
		return {
			modelRef: `${LLAMA_CPP_PROVIDER_ID}/${candidate.model.id}`,
			detail: `${candidate.model.id} (downloaded)`
		};
	} catch {}
	return null;
}
function buildSetupResult(config, defaultModel = DEFAULT_LLAMA_CPP_MODEL_REF) {
	return {
		profiles: [],
		defaultModel,
		configPatch: { models: {
			mode: config.models?.mode ?? "merge",
			providers: { [LLAMA_CPP_PROVIDER_ID]: buildLlamaCppProviderConfig(config.models?.providers?.[LLAMA_CPP_PROVIDER_ID]) }
		} }
	};
}
async function prepareLlamaCppSetup(ctx) {
	return (await detectLlamaCppSetup(ctx))?.modelRef === ctx.modelRef ? buildSetupResult(ctx.config, ctx.modelRef) : null;
}
async function runLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const cacheDir = resolveLlamaCppModelCacheDir(existing);
	const cachedPath = resolveCachedLlamaCppModelPath({
		model: {
			id: DEFAULT_LLAMA_CPP_MODEL_ID,
			params: { modelPath: DEFAULT_LLAMA_CPP_MODEL_URI }
		},
		provider: existing
	});
	if (!cachedPath || !await isFile(cachedPath)) {
		const totalmemBytes = os.totalmem();
		if (!meetsLlamaCppDefaultModelRamFloor(totalmemBytes)) {
			await ctx.prompter.note(`This machine has ${formatRamGb(totalmemBytes)} GB RAM; the bundled local model needs 16 GB+. Use Ollama/LM Studio with a smaller model, or a cloud provider.`, "Setup skipped");
			return { profiles: [] };
		}
		if (!await ctx.prompter.confirm({
			message: "Download Gemma 4 E4B IT Q4_K_M (about 5.0 GB) for local llama.cpp inference?",
			initialValue: false
		})) {
			await ctx.prompter.note("Local model download skipped.", "Setup skipped");
			return { profiles: [] };
		}
		const progress = ctx.prompter.progress("Preparing Gemma 4 E4B model download…");
		try {
			const runtime = await importNodeLlamaCpp();
			let previousDownloadedSize;
			let previousProgressAtMs;
			let rollingBytesPerSecond = 0;
			await (await runtime.createModelDownloader({
				modelUri: DEFAULT_LLAMA_CPP_MODEL_URI,
				dirPath: cacheDir,
				fileName: DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE,
				showCliProgress: false,
				onProgress: ({ downloadedSize, totalSize }) => {
					const now = Date.now();
					if (previousDownloadedSize !== void 0 && previousProgressAtMs !== void 0 && downloadedSize >= previousDownloadedSize && now > previousProgressAtMs) {
						const elapsedSeconds = (now - previousProgressAtMs) / 1e3;
						const currentBytesPerSecond = (downloadedSize - previousDownloadedSize) / elapsedSeconds;
						rollingBytesPerSecond = rollingBytesPerSecond === 0 ? currentBytesPerSecond : rollingBytesPerSecond * .75 + currentBytesPerSecond * .25;
					}
					previousDownloadedSize = downloadedSize;
					previousProgressAtMs = now;
					const expectedSize = totalSize || 4977169568;
					progress.update(formatLlamaCppDownloadProgress({
						downloadedSize,
						totalSize: expectedSize,
						bytesPerSecond: rollingBytesPerSecond
					}));
				}
			})).download({ signal: ctx.signal });
			progress.stop("Gemma 4 E4B model downloaded");
		} catch (error) {
			progress.stop("Model download failed");
			throw new Error(formatLlamaCppSetupError(error), { cause: error });
		}
	}
	return buildSetupResult(ctx.config);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.llamaCppSetupTestApi")] = { formatLlamaCppDownloadProgress };
//#endregion
//#region extensions/llama-cpp/index.ts
var llama_cpp_default = definePluginEntry({
	id: "llama-cpp",
	name: "llama.cpp Provider",
	description: "Local GGUF text inference and embeddings through node-llama-cpp",
	register(api) {
		api.registerEmbeddingProvider(llamaCppEmbeddingProviderAdapter);
		api.registerProvider({
			id: LLAMA_CPP_PROVIDER_ID,
			label: LLAMA_CPP_PROVIDER_LABEL,
			docsPath: "/plugins/llama-cpp",
			auth: [{
				id: "local",
				label: LLAMA_CPP_PROVIDER_LABEL,
				hint: "In-process local GGUF model (about 5.0 GB download; requires 16 GB RAM)",
				kind: "custom",
				appGuidedSetup: {
					detect: detectLlamaCppSetup,
					prepare: prepareLlamaCppSetup
				},
				run: runLlamaCppSetup
			}],
			catalog: {
				order: "late",
				run: async (ctx) => ({ provider: buildLlamaCppProviderConfig(ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID]) })
			},
			staticCatalog: {
				order: "late",
				run: async () => ({ provider: buildLlamaCppProviderConfig() })
			},
			createStreamFn: ({ config, provider }) => createLlamaCppStreamFn({ providerConfig: config?.models?.providers?.[provider] }),
			resolveSyntheticAuth: () => ({
				apiKey: resolveLlamaCppSyntheticApiKey(),
				source: "local llama.cpp runtime",
				mode: "api-key"
			}),
			wizard: {
				setup: {
					choiceId: LLAMA_CPP_PROVIDER_ID,
					choiceLabel: LLAMA_CPP_PROVIDER_LABEL,
					choiceHint: "In-process local model (about 5.0 GB download; requires 16 GB RAM)",
					groupId: LLAMA_CPP_PROVIDER_ID,
					groupLabel: "Local llama.cpp",
					groupHint: "No API key required",
					methodId: "local"
				},
				modelPicker: {
					label: "llama.cpp (local GGUF)",
					hint: "Run a GGUF model in the OpenClaw process",
					methodId: "local"
				}
			}
		});
	}
});
//#endregion
export { llama_cpp_default as default };
