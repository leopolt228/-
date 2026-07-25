import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { _ as uniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { a as isValidFileSecretRefId, i as isValidExecSecretRefId, r as formatExecSecretRefIdValidationMessage } from "./ref-contract-DzV1H2nk.js";
import { An as preprocess, At as boolean, Bt as discriminatedUnion, Et as array, Kn as tuple, Nn as record, Rn as string, St as _null, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CBJjibl3.js";
import { n as ZodIssueCode } from "./compat-Ci0Yc9vr.js";
import { a as isSandboxHostPathAbsolute, c as splitSandboxBindSpec, t as getBlockedNetworkModeReason } from "./network-mode-_J-LGFGe.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { t as LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS } from "./web-search-legacy-provider-keys-pn4zHmNy.js";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.js";
import { n as MODEL_THINKING_FORMATS, t as MODEL_APIS } from "./types.models-BHfgMdAm.js";
import { t as sensitive } from "./zod-schema.sensitive-WMWbzq4S.js";
import path from "node:path";
//#region src/config/zod-schema.agent-model.ts
/** Schema for agent model config accepting a string or fallback object. */
const AgentModelSchema = union([string(), object({
	primary: string().optional(),
	fallbacks: array(string()).optional()
}).strict()]);
const AgentToolModelSchema = union([string(), object({
	primary: string().optional(),
	fallbacks: array(string()).optional(),
	timeoutMs: number().int().positive().optional()
}).strict()]);
//#endregion
//#region src/config/zod-schema.allowdeny.ts
const AllowDenyActionSchema = union([literal("allow"), literal("deny")]);
const AllowDenyChatTypeSchema = union([
	literal("direct"),
	literal("group"),
	literal("channel")
]).optional();
function createAllowDenyChannelRulesSchema() {
	return object({
		default: AllowDenyActionSchema.optional(),
		rules: array(object({
			action: AllowDenyActionSchema,
			match: object({
				channel: string().optional(),
				chatType: AllowDenyChatTypeSchema,
				keyPrefix: string().optional(),
				rawKeyPrefix: string().optional()
			}).strict().optional()
		}).strict()).optional()
	}).strict().optional();
}
//#endregion
//#region src/config/zod-schema.core.ts
const ENV_SECRET_REF_ID_PATTERN = /^[A-Z][A-Z0-9_]{0,127}$/;
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function isAbsolutePath(value) {
	return path.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
/** Config-level secret reference schema shared by model/provider/plugin credential fields. */
const SecretRefSchema = discriminatedUnion("source", [
	object({
		source: literal("env"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().regex(ENV_SECRET_REF_ID_PATTERN, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict(),
	object({
		source: literal("file"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
	}).strict(),
	object({
		source: literal("exec"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
	}).strict()
]);
/** Accepts either legacy inline secret strings or structured secret references. */
const SecretInputSchema = union([string(), SecretRefSchema]);
/** Schema for one configured env/file/exec secret provider entry. */
const SecretProviderSchema = union([
	object({
		source: literal("env"),
		allowlist: array(string().regex(ENV_SECRET_REF_ID_PATTERN)).max(256).optional()
	}).strict(),
	object({
		source: literal("file"),
		path: string().min(1),
		mode: union([literal("singleValue"), literal("json")]).optional(),
		timeoutMs: number().int().positive().max(12e4).optional(),
		maxBytes: number().int().positive().max(20 * 1024 * 1024).optional(),
		allowInsecurePath: boolean().optional()
	}).strict(),
	union([object({
		source: literal("exec"),
		command: string().min(1).refine((value) => isSafeExecutableValue(value), "secrets.providers.*.command is unsafe.").refine((value) => isAbsolutePath(value), "secrets.providers.*.command must be an absolute path."),
		args: array(string().max(1024)).max(128).optional(),
		timeoutMs: number().int().positive().max(12e4).optional(),
		noOutputTimeoutMs: number().int().positive().max(12e4).optional(),
		maxOutputBytes: number().int().positive().max(20 * 1024 * 1024).optional(),
		jsonOnly: boolean().optional(),
		env: record(string(), string()).optional(),
		passEnv: array(string().regex(ENV_SECRET_REF_ID_PATTERN)).max(128).optional(),
		trustedDirs: array(string().min(1).refine((value) => isAbsolutePath(value), "trustedDirs entries must be absolute paths.")).max(64).optional(),
		allowInsecurePath: boolean().optional(),
		allowSymlinkCommand: boolean().optional()
	}).strict(), object({
		source: literal("exec"),
		pluginIntegration: object({
			pluginId: string().min(1).max(128),
			integrationId: string().min(1).max(128)
		}).strict()
	}).strict()])
]);
/** Schema for the top-level `secrets` config block. */
const SecretsConfigSchema = object({
	providers: object({}).catchall(SecretProviderSchema).optional(),
	defaults: object({
		env: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		file: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		exec: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional()
	}).strict().optional()
}).strict().optional();
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const ModelApiSchema = _enum(MODEL_APIS, { error: (issue) => issue.input === LEGACY_OPENAI_CODEX_RESPONSES_API ? `"${LEGACY_OPENAI_CODEX_RESPONSES_API}" is a removed api id; use "${OPENAI_CHATGPT_RESPONSES_API}"` : void 0 });
const ModelCompatSchema = object({
	supportsStore: boolean().optional(),
	supportsPromptCacheKey: boolean().optional(),
	supportsDeveloperRole: boolean().optional(),
	supportsReasoningEffort: boolean().optional(),
	supportsTemperature: boolean().optional(),
	supportsUsageInStreaming: boolean().optional(),
	supportsTools: boolean().optional(),
	supportsStrictMode: boolean().optional(),
	requiresStringContent: boolean().optional(),
	strictMessageKeys: boolean().optional(),
	visibleReasoningDetailTypes: array(string().min(1)).optional(),
	supportedReasoningEfforts: array(string().min(1)).optional(),
	reasoningEffortMap: record(string().min(1), string().min(1)).optional(),
	maxTokensField: union([literal("max_completion_tokens"), literal("max_tokens")]).optional(),
	thinkingFormat: _enum(MODEL_THINKING_FORMATS).optional(),
	requiresToolResultName: boolean().optional(),
	requiresAssistantAfterToolResult: boolean().optional(),
	requiresThinkingAsText: boolean().optional(),
	requiresReasoningContentOnAssistantMessages: boolean().optional(),
	toolSchemaProfile: string().optional(),
	unsupportedToolSchemaKeywords: array(string().min(1)).optional(),
	nativeWebSearchTool: boolean().optional(),
	toolCallArgumentsEncoding: string().optional(),
	requiresMistralToolIds: boolean().optional(),
	requiresOpenAiAnthropicToolPayload: boolean().optional()
}).strict().optional();
const ConfiguredProviderRequestTlsSchema = object({
	ca: SecretInputSchema.optional().register(sensitive),
	cert: SecretInputSchema.optional().register(sensitive),
	key: SecretInputSchema.optional().register(sensitive),
	passphrase: SecretInputSchema.optional().register(sensitive),
	serverName: string().optional(),
	insecureSkipVerify: boolean().optional()
}).strict().optional();
const ConfiguredProviderRequestAuthSchema = union([
	object({ mode: literal("provider-default") }).strict(),
	object({
		mode: literal("authorization-bearer"),
		token: SecretInputSchema.register(sensitive)
	}).strict(),
	object({
		mode: literal("header"),
		headerName: string().min(1),
		value: SecretInputSchema.register(sensitive),
		prefix: string().optional()
	}).strict()
]).optional();
const ConfiguredProviderRequestProxySchema = union([object({
	mode: literal("env-proxy"),
	tls: ConfiguredProviderRequestTlsSchema
}).strict(), object({
	mode: literal("explicit-proxy"),
	url: string().min(1),
	tls: ConfiguredProviderRequestTlsSchema
}).strict()]).optional();
const ConfiguredProviderRequestFields = {
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	auth: ConfiguredProviderRequestAuthSchema,
	proxy: ConfiguredProviderRequestProxySchema,
	tls: ConfiguredProviderRequestTlsSchema
};
const ConfiguredProviderRequestSchema = object(ConfiguredProviderRequestFields).strict().optional();
const ConfiguredModelProviderRequestSchema = object({
	...ConfiguredProviderRequestFields,
	allowPrivateNetwork: boolean().optional()
}).strict().optional();
const ModelAgentRuntimePolicySchema = object({ id: string().optional() }).strict().optional();
const ModelMediaInputSchema = object({ image: object({
	maxBytes: number().int().positive().optional(),
	maxPixels: number().int().positive().optional(),
	maxSidePx: number().int().positive().optional(),
	preferredSidePx: number().int().positive().optional(),
	tokenMode: union([
		literal("tile"),
		literal("detail"),
		literal("provider")
	]).optional()
}).strict().optional() }).strict();
const ThinkingLevelMapValueSchema = string().nullable();
const ThinkingLevelMapSchema = object({
	off: ThinkingLevelMapValueSchema.optional(),
	minimal: ThinkingLevelMapValueSchema.optional(),
	low: ThinkingLevelMapValueSchema.optional(),
	medium: ThinkingLevelMapValueSchema.optional(),
	high: ThinkingLevelMapValueSchema.optional(),
	xhigh: ThinkingLevelMapValueSchema.optional(),
	max: ThinkingLevelMapValueSchema.optional()
}).strict();
const ModelDefinitionSchema = object({
	id: string().min(1),
	name: string().min(1),
	api: ModelApiSchema.optional(),
	baseUrl: string().min(1).optional(),
	reasoning: boolean().optional(),
	input: array(union([
		literal("text"),
		literal("image"),
		literal("video"),
		literal("audio")
	])).optional(),
	cost: object({
		input: number().optional(),
		output: number().optional(),
		cacheRead: number().optional(),
		cacheWrite: number().optional(),
		tieredPricing: array(object({
			input: number(),
			output: number(),
			cacheRead: number(),
			cacheWrite: number(),
			range: union([tuple([number(), number()]), tuple([number()])])
		}).strict()).optional()
	}).strict().optional(),
	contextWindow: number().positive().optional(),
	contextTokens: number().int().positive().optional(),
	maxTokens: number().positive().optional(),
	thinkingLevelMap: ThinkingLevelMapSchema.optional(),
	params: record(string(), unknown()).optional(),
	agentRuntime: ModelAgentRuntimePolicySchema,
	headers: record(string(), string()).optional(),
	compat: ModelCompatSchema,
	mediaInput: ModelMediaInputSchema.optional(),
	metadataSource: literal("models-add").optional()
}).strict();
const ModelProviderLocalServiceSchema = object({
	command: string().min(1),
	args: array(string()).optional(),
	cwd: string().min(1).optional(),
	env: record(string(), string().register(sensitive)).optional(),
	healthUrl: string().min(1).optional(),
	readyTimeoutMs: number().int().positive().optional(),
	idleStopMs: number().int().nonnegative().optional()
}).strict().optional();
const BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS = /* @__PURE__ */ new Set([
	"amazon-bedrock",
	"amazon-bedrock-mantle",
	"anthropic",
	"anthropic-vertex",
	"arcee",
	"azure-openai-responses",
	"byteplus",
	"byteplus-plan",
	"cerebras",
	"chutes",
	"claude-cli",
	"clawrouter",
	"cloudflare-ai-gateway",
	"codex",
	"comfy",
	"copilot-proxy",
	"dashscope",
	"deepinfra",
	"deepseek",
	"fal",
	"fireworks",
	"github-copilot",
	"gmi",
	"gmi-cloud",
	"gmicloud",
	"google",
	"google-antigravity",
	"google-gemini-cli",
	"google-vertex",
	"groq",
	"huggingface",
	"kilocode",
	"kimi",
	"kimi-coding",
	"litellm",
	"lmstudio",
	"meta",
	"microsoft-foundry",
	"minimax",
	"minimax-portal",
	"mistral",
	"modelstudio",
	"moonshot",
	"moonshot-ai",
	"moonshotai",
	"nvidia",
	"novita",
	"novita-ai",
	"novitaai",
	"ollama",
	"ollama-cloud",
	"openai",
	"opencode",
	"opencode-go",
	"openrouter",
	"qianfan",
	"qwen",
	"qwen-token-plan",
	"qwencloud",
	"sglang",
	"stepfun",
	"stepfun-plan",
	"synthetic",
	"tencent-tokenhub",
	"tencent-tokenplan",
	"together",
	"venice",
	"vercel-ai-gateway",
	"vllm",
	"volcengine",
	"volcengine-plan",
	"vydra",
	"x-ai",
	"xai",
	"xiaomi",
	"xiaomi-token-plan",
	"z.ai",
	"z-ai",
	"zai"
]);
function isBuiltInModelProviderOverlayId(providerId) {
	return BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS.has(normalizeProviderId(providerId));
}
const ModelProviderSchema = object({
	baseUrl: string().min(1).optional(),
	apiKey: SecretInputSchema.optional().register(sensitive),
	auth: union([
		literal("api-key"),
		literal("aws-sdk"),
		literal("oauth"),
		literal("token")
	]).optional(),
	api: ModelApiSchema.optional(),
	contextWindow: number().positive().optional(),
	contextTokens: number().int().positive().optional(),
	maxTokens: number().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	region: string().min(1).optional(),
	injectNumCtxForOpenAICompat: boolean().optional(),
	params: record(string(), unknown()).optional(),
	agentRuntime: ModelAgentRuntimePolicySchema,
	localService: ModelProviderLocalServiceSchema,
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	authHeader: boolean().optional(),
	request: ConfiguredModelProviderRequestSchema,
	models: array(ModelDefinitionSchema).optional()
}).strict();
const ModelProvidersSchema = record(string(), ModelProviderSchema).superRefine((providers, ctx) => {
	for (const [providerId, provider] of Object.entries(providers)) {
		if (isBuiltInModelProviderOverlayId(providerId)) continue;
		if (!provider.baseUrl) ctx.addIssue({
			code: "custom",
			path: [providerId, "baseUrl"],
			message: "custom model providers must declare baseUrl; provider overlays without baseUrl are only supported for bundled providers"
		});
		if (!Array.isArray(provider.models)) ctx.addIssue({
			code: "custom",
			path: [providerId, "models"],
			message: "custom model providers must declare models; provider overlays without models are only supported for bundled providers"
		});
	}
});
const ModelPricingConfigSchema = object({ enabled: boolean().optional() }).strict().optional();
const ModelsConfigSchema = object({
	mode: union([literal("merge"), literal("replace")]).optional(),
	providers: ModelProvidersSchema.optional(),
	pricing: ModelPricingConfigSchema
}).strict().optional();
const VisibleRepliesValueSchema = _enum(["automatic", "message_tool"]);
const AmbientGroupInboundSchema = _enum(["user_request", "room_event"]);
const VisibleRepliesSchema = union([VisibleRepliesValueSchema, boolean()]).overwrite((value) => {
	if (value === true) return "automatic";
	if (value === false) return "message_tool";
	return value;
});
const MentionPatternsPolicySchema = object({
	mode: union([literal("allow"), literal("deny")]).optional(),
	allowIn: array(string()).optional(),
	denyIn: array(string()).optional()
}).strict();
const GroupChatSchema = object({
	mentionPatterns: array(string()).optional(),
	historyLimit: number().int().positive().optional(),
	unmentionedInbound: AmbientGroupInboundSchema.optional(),
	visibleReplies: VisibleRepliesSchema.optional()
}).strict().optional();
const DmConfigSchema = object({ historyLimit: number().int().min(0).optional() }).strict();
const IdentitySchema = object({
	name: string().optional(),
	theme: string().optional(),
	emoji: string().optional(),
	avatar: string().optional()
}).strict().optional();
const QueueModeSchema = union([
	literal("steer"),
	literal("followup"),
	literal("collect"),
	literal("interrupt")
]);
const QueueDropSchema = union([
	literal("old"),
	literal("new"),
	literal("summarize")
]);
const ReplyToModeSchema = union([
	literal("off"),
	literal("first"),
	literal("all"),
	literal("batched")
]);
const TypingModeSchema = union([
	literal("never"),
	literal("instant"),
	literal("thinking"),
	literal("message")
]);
const GroupPolicySchema = _enum([
	"open",
	"disabled",
	"allowlist"
]);
const DmPolicySchema = _enum([
	"pairing",
	"allowlist",
	"open",
	"disabled"
]);
const ContextVisibilityModeSchema = _enum([
	"all",
	"allowlist",
	"allowlist_quote"
]);
const BlockStreamingCoalesceSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	idleMs: number().int().nonnegative().optional()
}).strict();
const TextChunkModeSchema = _enum(["length", "newline"]);
const ChannelStreamingBlockSchema = object({
	enabled: boolean().optional(),
	coalesce: BlockStreamingCoalesceSchema.optional()
}).strict();
/** Delivery-only nested streaming config for channels without preview modes. */
const ChannelDeliveryStreamingConfigSchema = object({
	chunkMode: TextChunkModeSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
}).strict();
const ReplyRuntimeConfigSchemaShape = {
	historyLimit: number().int().min(0).optional(),
	dmHistoryLimit: number().int().min(0).optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	dms: record(string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: number().int().positive().optional(),
	streaming: ChannelDeliveryStreamingConfigSchema.optional(),
	responsePrefix: string().optional(),
	mediaMaxMb: number().positive().optional()
};
const BlockStreamingChunkSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	breakPreference: union([
		literal("paragraph"),
		literal("newline"),
		literal("sentence")
	]).optional()
}).strict();
const MarkdownConfigSchema = object({ tables: _enum([
	"off",
	"bullets",
	"code",
	"block"
]).optional() }).strict().optional();
const TtsProviderSchema = string().min(1);
const TtsModeSchema = _enum(["final", "all"]);
const TtsAutoSchema = _enum([
	"off",
	"always",
	"inbound",
	"tagged"
]);
const TtsProviderConfigSchema = object({ apiKey: SecretInputSchema.optional().register(sensitive) }).catchall(union([
	string(),
	number(),
	boolean(),
	_null(),
	array(unknown()),
	record(string(), unknown())
]));
const TtsPersonaPromptSchema = object({
	profile: string().optional(),
	scene: string().optional(),
	sampleContext: string().optional(),
	style: string().optional(),
	accent: string().optional(),
	pacing: string().optional(),
	constraints: array(string()).optional()
}).strict();
const TtsPersonaSchema = object({
	label: string().optional(),
	description: string().optional(),
	provider: TtsProviderSchema.optional(),
	fallbackPolicy: union([
		literal("preserve-persona"),
		literal("provider-defaults"),
		literal("fail")
	]).optional(),
	prompt: TtsPersonaPromptSchema.optional(),
	providers: record(string(), TtsProviderConfigSchema).optional()
}).strict();
const TtsConfigSchema = object({
	auto: TtsAutoSchema.optional(),
	enabled: boolean().optional(),
	mode: TtsModeSchema.optional(),
	provider: TtsProviderSchema.optional(),
	persona: string().optional(),
	personas: record(string(), TtsPersonaSchema).optional(),
	summaryModel: string().optional(),
	modelOverrides: object({
		enabled: boolean().optional(),
		allowText: boolean().optional(),
		allowProvider: boolean().optional(),
		allowVoice: boolean().optional(),
		allowModelId: boolean().optional(),
		allowVoiceSettings: boolean().optional(),
		allowNormalization: boolean().optional(),
		allowSeed: boolean().optional()
	}).strict().optional(),
	providers: record(string(), TtsProviderConfigSchema).optional(),
	prefsPath: string().optional(),
	maxTextLength: number().int().min(1).optional(),
	timeoutMs: number().int().min(1e3).max(12e4).optional()
}).strict().optional();
const HumanDelaySchema = object({
	mode: union([
		literal("off"),
		literal("natural"),
		literal("custom")
	]).optional(),
	minMs: number().int().nonnegative().optional(),
	maxMs: number().int().nonnegative().optional()
}).strict();
const CliBackendWatchdogModeSchema = object({
	noOutputTimeoutRatio: number().min(.05).max(.95).optional(),
	minMs: number().int().min(1e3).optional(),
	maxMs: number().int().min(1e3).optional()
}).strict().optional();
const CliBackendSchema = object({
	command: string(),
	args: array(string()).optional(),
	output: union([
		literal("json"),
		literal("text"),
		literal("jsonl")
	]).optional(),
	resumeOutput: union([
		literal("json"),
		literal("text"),
		literal("jsonl")
	]).optional(),
	jsonlDialect: union([literal("claude-stream-json"), literal("gemini-stream-json")]).optional(),
	liveSession: literal("claude-stdio").optional(),
	input: union([literal("arg"), literal("stdin")]).optional(),
	maxPromptArgChars: number().int().positive().optional(),
	env: record(string(), string()).optional(),
	clearEnv: array(string()).optional(),
	modelArg: string().optional(),
	modelAliases: record(string(), string()).optional(),
	sessionArg: string().optional(),
	sessionArgs: array(string()).optional(),
	resumeArgs: array(string()).optional(),
	forkArg: string().optional(),
	sessionMode: union([
		literal("always"),
		literal("existing"),
		literal("none")
	]).optional(),
	sessionIdFields: array(string()).optional(),
	systemPromptArg: string().optional(),
	systemPromptFileArg: string().optional(),
	systemPromptFileConfigArg: string().optional(),
	systemPromptFileConfigKey: string().optional(),
	systemPromptMode: union([literal("append"), literal("replace")]).optional(),
	systemPromptWhen: union([
		literal("first"),
		literal("always"),
		literal("never")
	]).optional(),
	imageArg: string().optional(),
	imageMode: union([literal("repeat"), literal("list")]).optional(),
	imagePathScope: union([literal("temp"), literal("workspace")]).optional(),
	serialize: boolean().optional(),
	reseedFromRawTranscriptWhenUncompacted: boolean().optional(),
	reliability: object({ watchdog: object({
		fresh: CliBackendWatchdogModeSchema,
		resume: CliBackendWatchdogModeSchema
	}).strict().optional() }).strict().optional()
}).strict();
const normalizeAllowFrom = (values) => normalizeStringEntries(values);
/**
* Canonical cross-field check for dmPolicy vs allowFrom. This is the single
* source of truth shared by the Zod schema refinements and the CLI config
* validator so the rule cannot drift between the two surfaces.
*/
const evaluateDmPolicyAllowFromDependency = (params) => {
	const allow = normalizeAllowFrom(params.allowFrom);
	if (params.policy === "open" && !allow.includes("*")) return "open_requires_wildcard";
	if (params.policy === "allowlist" && allow.length === 0) return "allowlist_requires_entries";
	return null;
};
const requireOpenAllowFrom = (params) => {
	if (evaluateDmPolicyAllowFromDependency({
		policy: params.policy,
		allowFrom: params.allowFrom
	}) !== "open_requires_wildcard") return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path,
		message: params.message
	});
};
/**
* Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
* Without this, all DMs are silently dropped because the allowlist is empty
* and no senders can match.
*/
const requireAllowlistAllowFrom = (params) => {
	if (evaluateDmPolicyAllowFromDependency({
		policy: params.policy,
		allowFrom: params.allowFrom
	}) !== "allowlist_requires_entries") return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path,
		message: params.message
	});
};
const MSTeamsReplyStyleSchema = _enum(["thread", "top-level"]);
const QueueModeBySurfaceSchema = object({
	whatsapp: QueueModeSchema.optional(),
	telegram: QueueModeSchema.optional(),
	discord: QueueModeSchema.optional(),
	irc: QueueModeSchema.optional(),
	googlechat: QueueModeSchema.optional(),
	slack: QueueModeSchema.optional(),
	mattermost: QueueModeSchema.optional(),
	signal: QueueModeSchema.optional(),
	imessage: QueueModeSchema.optional(),
	msteams: QueueModeSchema.optional(),
	webchat: QueueModeSchema.optional(),
	matrix: QueueModeSchema.optional()
}).strict().optional();
const DebounceMsBySurfaceSchema = record(string(), number().int().nonnegative()).optional();
const QueueSchema = object({
	mode: QueueModeSchema.optional(),
	byChannel: QueueModeBySurfaceSchema,
	debounceMsByChannel: DebounceMsBySurfaceSchema,
	cap: number().int().positive().optional(),
	drop: QueueDropSchema.optional()
}).strict().optional();
const InboundDebounceSchema = object({
	debounceMs: number().int().nonnegative().optional(),
	byChannel: DebounceMsBySurfaceSchema
}).strict().optional();
const HexColorSchema = string().regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
const ExecutableTokenSchema = string().refine(isSafeExecutableValue, "expected safe executable name or path");
const MediaUnderstandingScopeSchema = createAllowDenyChannelRulesSchema();
const MediaUnderstandingCapabilitiesSchema = array(union([
	literal("image"),
	literal("audio"),
	literal("video")
])).optional();
const MediaUnderstandingAttachmentsSchema = object({
	mode: union([literal("first"), literal("all")]).optional(),
	maxAttachments: number().int().positive().optional(),
	prefer: union([
		literal("first"),
		literal("last"),
		literal("path"),
		literal("url")
	]).optional()
}).strict().optional();
const ProviderOptionValueSchema = union([
	string(),
	number(),
	boolean()
]);
const ProviderOptionsSchema = record(string(), record(string(), ProviderOptionValueSchema)).optional();
const MediaUnderstandingRuntimeFields = {
	prompt: string().optional(),
	timeoutSeconds: number().int().positive().optional(),
	language: string().optional(),
	providerOptions: ProviderOptionsSchema,
	baseUrl: string().optional(),
	headers: record(string(), string()).optional(),
	request: ConfiguredProviderRequestSchema
};
const MediaUnderstandingModelSchema = object({
	provider: string().optional(),
	model: string().optional(),
	capabilities: MediaUnderstandingCapabilitiesSchema,
	type: union([literal("provider"), literal("cli")]).optional(),
	command: string().optional(),
	args: array(string()).optional(),
	maxChars: number().int().positive().optional(),
	maxBytes: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	profile: string().optional(),
	preferredProfile: string().optional()
}).strict().optional();
const ToolsMediaUnderstandingSchema = object({
	enabled: boolean().optional(),
	scope: MediaUnderstandingScopeSchema,
	maxBytes: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	attachments: MediaUnderstandingAttachmentsSchema,
	models: array(MediaUnderstandingModelSchema).optional(),
	echoTranscript: boolean().optional(),
	echoFormat: string().optional()
}).strict().optional();
const ToolsMediaSchema = object({
	models: array(MediaUnderstandingModelSchema).optional(),
	concurrency: number().int().positive().optional(),
	image: ToolsMediaUnderstandingSchema.optional(),
	audio: ToolsMediaUnderstandingSchema.optional(),
	video: ToolsMediaUnderstandingSchema.optional()
}).strict().optional();
const LinkModelSchema = object({
	type: literal("cli").optional(),
	command: string().min(1),
	args: array(string()).optional(),
	timeoutSeconds: number().int().positive().optional()
}).strict();
const ToolsLinksSchema = object({
	enabled: boolean().optional(),
	scope: MediaUnderstandingScopeSchema,
	maxLinks: number().int().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	models: array(LinkModelSchema).optional()
}).strict().optional();
const NativeCommandsSettingSchema = union([boolean(), literal("auto")]);
const ProviderCommandsSchema = object({
	native: NativeCommandsSettingSchema.optional(),
	nativeSkills: NativeCommandsSettingSchema.optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.agent-runtime.ts
function validateSandboxBindEntries(binds, ctx) {
	if (!binds) return;
	for (let i = 0; i < binds.length; i += 1) {
		const bind = normalizeOptionalString(binds[i]) ?? "";
		if (!bind) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["binds", i],
				message: "Sandbox security: bind mount entry must be a non-empty string."
			});
			continue;
		}
		const parsed = splitSandboxBindSpec(bind);
		const source = (parsed ? parsed.host : bind).trim();
		if (!isSandboxHostPathAbsolute(source)) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["binds", i],
			message: `Sandbox security: bind mount "${bind}" uses a non-absolute source path "${source}". Only absolute POSIX or Windows drive-letter paths are supported for sandbox binds.`
		});
	}
}
const AgentEntryEmbeddedAgentConfigSchema = object({ executionContract: union([literal("default"), literal("strict-agentic")]).optional() }).strict();
const HeartbeatSchema = object({
	every: string().optional(),
	activeHours: object({
		start: string().optional(),
		end: string().optional(),
		timezone: string().optional()
	}).strict().optional(),
	model: string().optional(),
	session: string().optional(),
	includeReasoning: boolean().optional(),
	target: string().optional(),
	directPolicy: union([literal("allow"), literal("block")]).optional(),
	to: string().optional(),
	accountId: string().optional(),
	prompt: string().optional(),
	includeSystemPromptSection: boolean().optional(),
	ackMaxChars: number().int().nonnegative().optional(),
	suppressToolErrorWarnings: boolean().optional(),
	timeoutSeconds: number().int().positive().optional(),
	lightContext: boolean().optional(),
	isolatedSession: boolean().optional(),
	skipWhenBusy: boolean().optional()
}).strict().superRefine((val, ctx) => {
	if (!val.every) return;
	try {
		parseDurationMs(val.every, { defaultUnit: "m" });
	} catch {
		ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["every"],
			message: "invalid duration (use ms, s, m, h)"
		});
	}
	const active = val.activeHours;
	if (!active) return;
	const timePattern = /^([01]\d|2[0-3]|24):([0-5]\d)$/;
	const validateTime = (raw, opts, path) => {
		if (!raw) return;
		if (!timePattern.test(raw)) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["activeHours", path],
				message: "invalid time (use \"HH:MM\" 24h format)"
			});
			return;
		}
		const [hourStr, minuteStr] = raw.split(":");
		const hour = Number(hourStr);
		const minute = Number(minuteStr);
		if (hour === 24 && minute !== 0) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["activeHours", path],
				message: "invalid time (24:00 is the only allowed 24:xx value)"
			});
			return;
		}
		if (hour === 24 && !opts.allow24) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["activeHours", path],
			message: "invalid time (start cannot be 24:00)"
		});
	};
	validateTime(active.start, { allow24: false }, "start");
	validateTime(active.end, { allow24: true }, "end");
}).optional();
const SandboxDockerSchema = object({
	image: string().optional(),
	containerPrefix: string().optional(),
	workdir: string().optional(),
	readOnlyRoot: boolean().optional(),
	tmpfs: array(string()).optional(),
	network: string().optional(),
	user: string().optional(),
	capDrop: array(string()).optional(),
	env: record(string(), string()).optional(),
	setupCommand: union([string(), array(string())]).transform((value) => Array.isArray(value) ? value.join("\n") : value).pipe(string()).optional(),
	pidsLimit: number().int().positive().optional(),
	memory: union([string(), number()]).optional(),
	memorySwap: union([string(), number()]).optional(),
	cpus: number().positive().optional(),
	gpus: string().min(1).optional(),
	ulimits: record(string(), union([
		string(),
		number(),
		object({
			soft: number().int().nonnegative().optional(),
			hard: number().int().nonnegative().optional()
		}).strict()
	])).optional(),
	seccompProfile: string().optional(),
	apparmorProfile: string().optional(),
	dns: array(string()).optional(),
	extraHosts: array(string()).optional(),
	binds: array(string()).optional(),
	dangerouslyAllowReservedContainerTargets: boolean().optional(),
	dangerouslyAllowExternalBindSources: boolean().optional(),
	dangerouslyAllowContainerNamespaceJoin: boolean().optional()
}).strict().superRefine((data, ctx) => {
	validateSandboxBindEntries(data.binds, ctx);
	const blockedNetworkReason = getBlockedNetworkModeReason({
		network: data.network,
		allowContainerNamespaceJoin: data.dangerouslyAllowContainerNamespaceJoin === true
	});
	if (blockedNetworkReason === "host") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["network"],
		message: "Sandbox security: network mode \"host\" is blocked. Use \"bridge\" or \"none\" instead."
	});
	if (blockedNetworkReason === "container_namespace_join") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["network"],
		message: "Sandbox security: network mode \"container:*\" is blocked by default. Use a custom bridge network, or set dangerouslyAllowContainerNamespaceJoin=true only when you fully trust this runtime."
	});
	if (normalizeLowercaseStringOrEmpty(data.seccompProfile ?? "") === "unconfined") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["seccompProfile"],
		message: "Sandbox security: seccomp profile \"unconfined\" is blocked. Use a custom seccomp profile file or omit this setting."
	});
	if (normalizeLowercaseStringOrEmpty(data.apparmorProfile ?? "") === "unconfined") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["apparmorProfile"],
		message: "Sandbox security: apparmor profile \"unconfined\" is blocked. Use a named AppArmor profile or omit this setting."
	});
}).optional();
const SandboxBrowserSchema = object({
	enabled: boolean().optional(),
	image: string().optional(),
	containerPrefix: string().optional(),
	network: string().optional(),
	cdpPort: number().int().positive().optional(),
	cdpSourceRange: string().optional(),
	vncPort: number().int().positive().optional(),
	noVncPort: number().int().positive().optional(),
	headless: boolean().optional(),
	enableNoVnc: boolean().optional(),
	allowHostControl: boolean().optional(),
	autoStart: boolean().optional(),
	autoStartTimeoutMs: number().int().positive().optional(),
	binds: array(string()).optional()
}).superRefine((data, ctx) => {
	validateSandboxBindEntries(data.binds, ctx);
	if (normalizeLowercaseStringOrEmpty(data.network ?? "") === "host") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["network"],
		message: "Sandbox security: browser network mode \"host\" is blocked. Use \"bridge\" or a custom bridge network instead."
	});
}).strict().optional();
const SandboxPruneSchema = object({
	idleHours: number().int().nonnegative().optional(),
	maxAgeDays: number().int().nonnegative().optional()
}).strict().optional();
const AgentContextLimitsSchema = object({
	memoryGetMaxChars: number().int().min(1).max(25e4).optional(),
	memoryGetDefaultLines: number().int().min(1).max(5e3).optional(),
	toolResultMaxChars: number().int().min(1).max(1e6).optional(),
	postCompactionMaxChars: number().int().min(1).max(5e4).optional()
}).strict().optional();
const AgentSkillsLimitsSchema = object({ maxSkillsPromptChars: number().int().min(0).optional() }).strict().optional();
const ToolPolicySchema = object({
	allow: array(string()).optional(),
	alsoAllow: array(string()).optional(),
	deny: array(string()).optional()
}).strict().superRefine((value, ctx) => {
	if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "tools policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)"
	});
}).optional();
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema).optional();
const TrimmedOptionalConfigStringSchema = string().transform((value) => {
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}).optional();
const CodexAllowedDomainsSchema = array(string()).transform((values) => {
	const deduped = uniqueStrings(values.map((value) => value.trim()).filter((value) => value.length > 0));
	return deduped.length > 0 ? deduped : void 0;
}).optional();
const CodexUserLocationSchema = object({
	country: TrimmedOptionalConfigStringSchema,
	region: TrimmedOptionalConfigStringSchema,
	city: TrimmedOptionalConfigStringSchema,
	timezone: TrimmedOptionalConfigStringSchema
}).strict().transform((value) => {
	return value.country || value.region || value.city || value.timezone ? value : void 0;
}).optional();
const BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD = "__openclawBlockedWebSearchKeys";
const ToolsWebSchema = object({
	search: preprocess((value) => {
		if (!isRecord(value)) return value;
		const blockedKeys = Object.getOwnPropertyNames(value).filter((key) => isBlockedObjectKey(key));
		if (blockedKeys.length === 0) return value;
		return {
			...value,
			[BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD]: blockedKeys
		};
	}, object({
		enabled: boolean().optional(),
		provider: string().optional(),
		maxResults: number().int().positive().optional(),
		timeoutSeconds: number().int().positive().optional(),
		cacheTtlMinutes: number().nonnegative().optional(),
		openaiCodex: object({
			enabled: boolean().optional(),
			mode: union([literal("cached"), literal("live")]).optional(),
			allowedDomains: CodexAllowedDomainsSchema,
			contextSize: union([
				literal("low"),
				literal("medium"),
				literal("high")
			]).optional(),
			userLocation: CodexUserLocationSchema
		}).strict().optional()
	}).catchall(unknown()).superRefine((value, ctx) => {
		const blockedKeys = value[BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD];
		if (Array.isArray(blockedKeys)) for (const key of blockedKeys) {
			if (typeof key !== "string") continue;
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: [key],
				message: "tools.web.search must not contain blocked object keys"
			});
		}
		for (const [key, entry] of Object.entries(value)) {
			if (key === BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD || isBlockedObjectKey(key)) continue;
			if (key === "apiKey" || LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS.has(key) && isRecord(entry)) ctx.addIssue({
				code: ZodIssueCode.custom,
				path: [key],
				message: "legacy web_search provider config must use plugins.entries.<plugin>.config.webSearch"
			});
		}
	})).optional(),
	fetch: object({
		enabled: boolean().optional(),
		provider: string().optional(),
		maxChars: number().int().positive().optional(),
		maxCharsCap: number().int().positive().optional(),
		maxResponseBytes: number().int().positive().optional(),
		timeoutSeconds: number().int().positive().optional(),
		cacheTtlMinutes: number().nonnegative().optional(),
		maxRedirects: number().int().nonnegative().optional(),
		userAgent: string().optional(),
		readability: boolean().optional(),
		useTrustedEnvProxy: boolean().optional(),
		ssrfPolicy: object({
			allowRfc2544BenchmarkRange: boolean().optional(),
			allowIpv6UniqueLocalRange: boolean().optional()
		}).strict().optional()
	}).strict().optional()
}).strict().optional();
const ToolProfileSchema = union([
	literal("minimal"),
	literal("coding"),
	literal("messaging"),
	literal("full")
]).optional();
function addAllowAlsoAllowConflictIssue(value, ctx, message) {
	if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		message
	});
}
const ToolPolicyWithProfileSchema = object({
	allow: array(string()).optional(),
	alsoAllow: array(string()).optional(),
	deny: array(string()).optional(),
	profile: ToolProfileSchema
}).strict().superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools.byProvider policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
});
const ElevatedAllowFromSchema = record(string(), array(union([string(), number()]))).optional();
const ToolExecApplyPatchSchema = object({
	enabled: boolean().optional(),
	workspaceOnly: boolean().optional(),
	allowModels: array(string()).optional()
}).strict().optional();
const ToolExecSafeBinProfileSchema = object({
	minPositional: number().int().nonnegative().optional(),
	maxPositional: number().int().nonnegative().optional(),
	allowedValueFlags: array(string()).optional(),
	deniedFlags: array(string()).optional()
}).strict();
const ToolExecBaseShape = {
	host: _enum([
		"auto",
		"sandbox",
		"gateway",
		"node"
	]).optional(),
	mode: _enum([
		"deny",
		"allowlist",
		"ask",
		"auto",
		"full"
	]).optional(),
	security: _enum([
		"deny",
		"allowlist",
		"full"
	]).optional(),
	ask: _enum([
		"off",
		"on-miss",
		"always"
	]).optional(),
	node: string().optional(),
	pathPrepend: array(string()).optional(),
	safeBins: array(string()).optional(),
	strictInlineEval: boolean().optional(),
	commandHighlighting: boolean().optional(),
	safeBinTrustedDirs: array(string()).optional(),
	safeBinProfiles: record(string(), ToolExecSafeBinProfileSchema).optional(),
	reviewer: object({
		model: AgentModelSchema.optional(),
		timeoutMs: number().int().positive().optional()
	}).strict().optional(),
	backgroundMs: number().int().positive().optional(),
	timeoutSec: number().int().positive().optional(),
	cleanupMs: number().int().positive().optional(),
	notifyOnExit: boolean().optional(),
	notifyOnExitEmptySuccess: boolean().optional(),
	applyPatch: ToolExecApplyPatchSchema
};
function addExecPolicyModeConflictIssue(value, ctx) {
	if (value.mode === void 0 || value.security === void 0 && value.ask === void 0) return;
	ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["mode"],
		message: "tools.exec.mode cannot be combined with tools.exec.security or tools.exec.ask"
	});
}
const AgentToolExecSchema = object({
	...ToolExecBaseShape,
	approvalRunningNoticeMs: number().int().nonnegative().optional()
}).strict().superRefine(addExecPolicyModeConflictIssue).optional();
const ToolExecSchema = object(ToolExecBaseShape).strict().superRefine(addExecPolicyModeConflictIssue).optional();
const ToolFsSchema = object({ workspaceOnly: boolean().optional() }).strict().optional();
const ToolLoopDetectionSchema = object({ enabled: boolean().optional() }).strict().optional();
const ToolSearchSchema = union([boolean(), object({
	enabled: boolean().optional(),
	mode: _enum([
		"code",
		"tools",
		"directory"
	]).optional(),
	codeTimeoutMs: number().int().positive().optional(),
	searchDefaultLimit: number().int().positive().optional(),
	maxSearchLimit: number().int().positive().optional()
}).strict()]).optional();
const CodeModeSchema = union([boolean(), object({
	enabled: boolean().optional(),
	runtime: literal("quickjs-wasi").optional(),
	mode: literal("only").optional(),
	languages: array(_enum(["javascript", "typescript"])).optional(),
	timeoutMs: number().int().positive().optional(),
	memoryLimitBytes: number().int().positive().optional(),
	maxOutputBytes: number().int().positive().optional(),
	maxSnapshotBytes: number().int().positive().optional(),
	maxPendingToolCalls: number().int().positive().optional(),
	snapshotTtlSeconds: number().int().positive().optional(),
	searchDefaultLimit: number().int().positive().optional(),
	maxSearchLimit: number().int().positive().optional()
}).strict()]).optional();
const SwarmSchema = union([boolean(), object({
	enabled: boolean().optional(),
	maxConcurrent: number().int().positive().optional(),
	maxChildrenPerGroup: number().int().positive().optional(),
	maxTotalPerGroup: number().int().positive().optional(),
	waitTimeoutSecondsMax: number().int().positive().optional(),
	defaultAgentId: string().optional()
}).strict()]).optional();
const SandboxSshSchema = object({
	target: string().min(1).optional(),
	command: string().min(1).optional(),
	workspaceRoot: string().min(1).optional(),
	strictHostKeyChecking: boolean().optional(),
	updateHostKeys: boolean().optional(),
	identityFile: string().min(1).optional(),
	certificateFile: string().min(1).optional(),
	knownHostsFile: string().min(1).optional(),
	identityData: SecretInputSchema.optional().register(sensitive),
	certificateData: SecretInputSchema.optional().register(sensitive),
	knownHostsData: SecretInputSchema.optional().register(sensitive)
}).strict().optional();
const AgentSandboxSchema = object({
	mode: union([
		literal("off"),
		literal("non-main"),
		literal("all")
	]).optional(),
	backend: string().min(1).optional(),
	workspaceAccess: union([
		literal("none"),
		literal("ro"),
		literal("rw")
	]).optional(),
	sessionToolsVisibility: union([literal("spawned"), literal("all")]).optional(),
	scope: union([
		literal("session"),
		literal("agent"),
		literal("shared")
	]).optional(),
	workspaceRoot: string().optional(),
	docker: SandboxDockerSchema,
	ssh: SandboxSshSchema,
	browser: SandboxBrowserSchema,
	prune: SandboxPruneSchema
}).strict().superRefine((data, ctx) => {
	if (getBlockedNetworkModeReason({
		network: data.browser?.network,
		allowContainerNamespaceJoin: data.docker?.dangerouslyAllowContainerNamespaceJoin === true
	}) === "container_namespace_join") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["browser", "network"],
		message: "Sandbox security: browser network mode \"container:*\" is blocked by default. Set sandbox.docker.dangerouslyAllowContainerNamespaceJoin=true only when you fully trust this runtime."
	});
}).optional();
const CommonToolPolicyFields = {
	profile: ToolProfileSchema,
	allow: array(string()).optional(),
	alsoAllow: array(string()).optional(),
	deny: array(string()).optional(),
	byProvider: record(string(), ToolPolicyWithProfileSchema).optional(),
	toolsBySender: ToolPolicyBySenderSchema
};
const MessageToolConfigSchema = object({
	crossContext: object({
		allowWithinProvider: boolean().optional(),
		allowAcrossProviders: boolean().optional(),
		marker: object({
			enabled: boolean().optional(),
			prefix: string().optional(),
			suffix: string().optional()
		}).strict().optional()
	}).strict().optional(),
	actions: object({ allow: array(string()).optional() }).strict().optional(),
	broadcast: object({ enabled: boolean().optional() }).strict().optional()
}).strict().optional();
const AgentToolsSchema = object({
	...CommonToolPolicyFields,
	codeMode: CodeModeSchema,
	swarm: SwarmSchema,
	elevated: object({
		enabled: boolean().optional(),
		allowFrom: ElevatedAllowFromSchema
	}).strict().optional(),
	exec: AgentToolExecSchema,
	fs: ToolFsSchema,
	loopDetection: ToolLoopDetectionSchema,
	message: MessageToolConfigSchema,
	sandbox: object({ tools: ToolPolicySchema }).strict().optional()
}).strict().superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "agent tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
const MemorySearchSchema = object({
	enabled: boolean().optional(),
	rememberAcrossConversations: boolean().optional(),
	sources: array(union([literal("memory"), literal("sessions")])).optional(),
	extraPaths: array(string()).optional(),
	qmd: object({ extraCollections: array(object({
		path: string(),
		name: string().optional(),
		pattern: string().optional()
	}).strict()).optional() }).strict().optional(),
	multimodal: object({
		enabled: boolean().optional(),
		modalities: array(union([
			literal("image"),
			literal("audio"),
			literal("all")
		])).optional(),
		maxFileBytes: number().int().positive().optional()
	}).strict().optional(),
	experimental: object({ sessionMemory: boolean().optional() }).strict().optional(),
	provider: string().optional(),
	remote: object({
		baseUrl: string().optional(),
		apiKey: SecretInputSchema.optional().register(sensitive),
		headers: record(string(), string()).optional(),
		nonBatchConcurrency: number().int().positive().optional(),
		batch: object({
			enabled: boolean().optional(),
			wait: boolean().optional(),
			concurrency: number().int().positive().optional(),
			pollIntervalMs: number().int().nonnegative().optional(),
			timeoutMinutes: number().int().positive().optional()
		}).strict().optional()
	}).strict().optional(),
	fallback: string().optional(),
	model: string().optional(),
	inputType: string().min(1).optional(),
	queryInputType: string().min(1).optional(),
	documentInputType: string().min(1).optional(),
	outputDimensionality: number().int().positive().optional(),
	local: object({
		modelPath: string().optional(),
		modelCacheDir: string().optional(),
		contextSize: union([number().int().positive(), literal("auto")]).optional()
	}).strict().optional(),
	store: object({
		driver: literal("sqlite").optional(),
		fts: object({ tokenizer: union([literal("unicode61"), literal("trigram")]).optional() }).strict().optional(),
		vector: object({
			enabled: boolean().optional(),
			extensionPath: string().optional()
		}).strict().optional()
	}).strict().optional(),
	sync: object({
		onSessionStart: boolean().optional(),
		onSearch: boolean().optional(),
		watch: boolean().optional(),
		embeddingBatchTimeoutSeconds: number().int().positive().optional(),
		sessions: object({
			deltaBytes: number().int().nonnegative().optional(),
			deltaMessages: number().int().nonnegative().optional(),
			postCompactionForce: boolean().optional()
		}).strict().optional()
	}).strict().optional(),
	query: object({
		maxResults: number().int().positive().optional(),
		minScore: number().min(0).max(1).optional(),
		hybrid: object({
			enabled: boolean().optional(),
			mmr: object({ enabled: boolean().optional() }).strict().optional(),
			temporalDecay: object({ enabled: boolean().optional() }).strict().optional()
		}).strict().optional()
	}).strict().optional(),
	cache: object({ enabled: boolean().optional() }).strict().optional()
}).strict().optional();
const AgentRuntimeAcpSchema = object({
	agent: string().optional(),
	backend: string().optional(),
	mode: _enum(["persistent", "oneshot"]).optional(),
	cwd: string().optional()
}).strict().optional();
const AgentRuntimeSchema = union([object({ type: literal("embedded") }).strict(), object({
	type: literal("acp"),
	acp: AgentRuntimeAcpSchema
}).strict()]).optional();
const AgentRuntimePolicySchema = object({ id: string().optional() }).strict().optional();
const AgentModelRuntimeEntrySchema = object({
	alias: string().optional(),
	params: record(string(), unknown()).optional(),
	agentRuntime: AgentRuntimePolicySchema,
	streaming: boolean().optional()
}).strict();
const AgentModelPolicySchema = object({ allow: array(string()).optional() }).strict();
const AgentEntrySchema = object({
	id: string(),
	default: boolean().optional(),
	name: string().optional(),
	description: string().optional(),
	workspace: string().optional(),
	agentDir: string().optional(),
	model: AgentModelSchema.optional(),
	utilityModel: string().optional(),
	models: record(string(), AgentModelRuntimeEntrySchema).optional(),
	modelPolicy: AgentModelPolicySchema.optional(),
	thinkingDefault: _enum([
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"adaptive",
		"max",
		"ultra"
	]).optional(),
	verboseDefault: _enum([
		"off",
		"on",
		"full"
	]).optional(),
	toolProgressDetail: _enum(["explain", "raw"]).optional(),
	reasoningDefault: _enum([
		"on",
		"off",
		"stream"
	]).optional(),
	fastModeDefault: union([boolean(), literal("auto")]).optional(),
	contextInjection: union([
		literal("always"),
		literal("continuation-skip"),
		literal("never")
	]).optional(),
	bootstrapMaxChars: number().int().positive().optional(),
	bootstrapTotalMaxChars: number().int().positive().optional(),
	experimental: object({ localModelLean: boolean().optional() }).strict().optional(),
	skills: array(string()).optional(),
	memorySearch: MemorySearchSchema,
	humanDelay: HumanDelaySchema.optional(),
	tts: TtsConfigSchema,
	skillsLimits: AgentSkillsLimitsSchema,
	contextLimits: AgentContextLimitsSchema,
	contextTokens: number().int().positive().optional(),
	heartbeat: HeartbeatSchema,
	identity: IdentitySchema,
	groupChat: GroupChatSchema,
	subagents: object({
		delegationMode: _enum(["suggest", "prefer"]).optional(),
		allowAgents: array(string()).optional(),
		model: AgentModelSchema.optional(),
		thinking: string().optional(),
		requireAgentId: boolean().optional()
	}).strict().optional(),
	embeddedAgent: AgentEntryEmbeddedAgentConfigSchema.optional(),
	sandbox: AgentSandboxSchema,
	params: record(string(), unknown()).optional(),
	tools: AgentToolsSchema,
	runtime: AgentRuntimeSchema
}).strict();
const ToolsSchema = object({
	...CommonToolPolicyFields,
	web: ToolsWebSchema,
	media: ToolsMediaSchema,
	links: ToolsLinksSchema,
	sessions: object({ visibility: _enum([
		"self",
		"tree",
		"agent",
		"all"
	]).optional() }).strict().optional(),
	loopDetection: ToolLoopDetectionSchema,
	toolSearch: ToolSearchSchema,
	codeMode: CodeModeSchema,
	swarm: SwarmSchema,
	message: MessageToolConfigSchema,
	agentToAgent: object({
		enabled: boolean().optional(),
		allow: array(string()).optional()
	}).strict().optional(),
	elevated: object({
		enabled: boolean().optional(),
		allowFrom: ElevatedAllowFromSchema
	}).strict().optional(),
	exec: ToolExecSchema,
	fs: ToolFsSchema,
	subagents: object({ tools: ToolPolicySchema }).strict().optional(),
	sandbox: object({ tools: ToolPolicySchema }).strict().optional(),
	sessions_spawn: object({ attachments: object({
		enabled: boolean().optional(),
		maxTotalBytes: number().optional(),
		maxFiles: number().optional(),
		maxFileBytes: number().optional(),
		retainOnSessionKeep: boolean().optional()
	}).strict().optional() }).strict().optional(),
	experimental: object({ planTool: boolean().optional() }).strict().optional()
}).strict().superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
//#endregion
export { ProviderCommandsSchema as A, TtsConfigSchema as B, HumanDelaySchema as C, MentionPatternsPolicySchema as D, MarkdownConfigSchema as E, SecretProviderSchema as F, evaluateDmPolicyAllowFromDependency as G, TtsProviderSchema as H, SecretRefSchema as I, requireOpenAllowFrom as J, isBuiltInModelProviderOverlayId as K, SecretsConfigSchema as L, ReplyRuntimeConfigSchemaShape as M, ReplyToModeSchema as N, ModelsConfigSchema as O, SecretInputSchema as P, TextChunkModeSchema as R, HexColorSchema as S, MSTeamsReplyStyleSchema as T, TypingModeSchema as U, TtsModeSchema as V, VisibleRepliesSchema as W, AgentModelSchema as X, createAllowDenyChannelRulesSchema as Y, AgentToolModelSchema as Z, DmConfigSchema as _, AgentSandboxSchema as a, GroupChatSchema as b, MemorySearchSchema as c, BlockStreamingChunkSchema as d, BlockStreamingCoalesceSchema as f, ContextVisibilityModeSchema as g, CliBackendSchema as h, AgentModelRuntimeEntrySchema as i, QueueSchema as j, NativeCommandsSettingSchema as k, ToolPolicySchema as l, ChannelStreamingBlockSchema as m, AgentEntrySchema as n, ElevatedAllowFromSchema as o, ChannelDeliveryStreamingConfigSchema as p, requireAllowlistAllowFrom as q, AgentModelPolicySchema as r, HeartbeatSchema as s, AgentContextLimitsSchema as t, ToolsSchema as u, DmPolicySchema as v, InboundDebounceSchema as w, GroupPolicySchema as x, ExecutableTokenSchema as y, TtsAutoSchema as z };
