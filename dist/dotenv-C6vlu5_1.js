import { u as tryProcessCwd } from "./home-dir-DxrrpDft.js";
import { a as normalizeEnvVarKey } from "./host-env-security-pMY6K0Qy.js";
import { n as listKnownProviderAuthEnvVarNames } from "./provider-env-vars-BX8unNjx.js";
import { n as readDotEnvFile, t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-D5JdeSG4.js";
import path from "node:path";
//#region src/infra/dotenv.ts
const BLOCKED_PROVIDER_AUTH_WORKSPACE_DOTENV_KEYS = [
	"AI_GATEWAY_API_KEY",
	"ANTHROPIC_API_KEY",
	"ANTHROPIC_OAUTH_TOKEN",
	"ARCEEAI_API_KEY",
	"AZURE_OPENAI_API_KEY",
	"AZURE_SPEECH_API_KEY",
	"AZURE_SPEECH_KEY",
	"AZURE_SPEECH_REGION",
	"BRAVE_API_KEY",
	"BYTEPLUS_API_KEY",
	"BYTEPLUS_SEED_SPEECH_API_KEY",
	"CEREBRAS_API_KEY",
	"CHUTES_API_KEY",
	"CHUTES_OAUTH_TOKEN",
	"CLOUDFLARE_AI_GATEWAY_API_KEY",
	"COMFY_API_KEY",
	"COMFY_CLOUD_API_KEY",
	"COPILOT_GITHUB_TOKEN",
	"DASHSCOPE_API_KEY",
	"DEEPGRAM_API_KEY",
	"DEEPINFRA_API_KEY",
	"DEEPSEEK_API_KEY",
	"ELEVENLABS_API_KEY",
	"EXA_API_KEY",
	"FAL_API_KEY",
	"FAL_KEY",
	"FIRECRAWL_API_KEY",
	"FIREWORKS_API_KEY",
	"GEMINI_API_KEY",
	"GH_TOKEN",
	"GITHUB_TOKEN",
	"GOOGLE_API_KEY",
	"GOOGLE_CLOUD_API_KEY",
	"GRADIUM_API_KEY",
	"GROQ_API_KEY",
	"HF_TOKEN",
	"HUGGINGFACE_HUB_TOKEN",
	"INWORLD_API_KEY",
	"KILOCODE_API_KEY",
	"KIMICODE_API_KEY",
	"KIMI_API_KEY",
	"LITELLM_API_KEY",
	"LM_API_TOKEN",
	"MINIMAX_API_KEY",
	"MINIMAX_CODE_PLAN_KEY",
	"MINIMAX_CODING_API_KEY",
	"MINIMAX_OAUTH_TOKEN",
	"MISTRAL_API_KEY",
	"MODEL_API_KEY",
	"MODELSTUDIO_API_KEY",
	"MOONSHOT_API_KEY",
	"NVIDIA_API_KEY",
	"OLLAMA_API_KEY",
	"OPENAI_API_KEY",
	"OPENCODE_API_KEY",
	"OPENCODE_ZEN_API_KEY",
	"OPENROUTER_API_KEY",
	"PERPLEXITY_API_KEY",
	"QIANFAN_API_KEY",
	"QWEN_API_KEY",
	"QWEN_TOKEN_PLAN_API_KEY",
	"RUNWAY_API_KEY",
	"RUNWAYML_API_SECRET",
	"SENSEAUDIO_API_KEY",
	"SGLANG_API_KEY",
	"SPEECH_KEY",
	"SPEECH_REGION",
	"STEPFUN_API_KEY",
	"SYNTHETIC_API_KEY",
	"TAVILY_API_KEY",
	"TOGETHER_API_KEY",
	"TOKENHUB_API_KEY",
	"TOKENPLAN_API_KEY",
	"VENICE_API_KEY",
	"VLLM_API_KEY",
	"VOLCANO_ENGINE_API_KEY",
	"VOLCENGINE_TTS_API_KEY",
	"VOLCENGINE_TTS_APPID",
	"VOLCENGINE_TTS_TOKEN",
	"VOYAGE_API_KEY",
	"VYDRA_API_KEY",
	"XAI_API_KEY",
	"XIAOMI_API_KEY",
	"XI_API_KEY",
	"ZAI_API_KEY",
	"Z_AI_API_KEY"
];
[...BLOCKED_PROVIDER_AUTH_WORKSPACE_DOTENV_KEYS];
function buildProviderAuthWorkspaceDotEnvBlocklist() {
	const keys = new Set(BLOCKED_PROVIDER_AUTH_WORKSPACE_DOTENV_KEYS);
	for (const rawKey of listKnownProviderAuthEnvVarNames({ includeUntrustedWorkspacePlugins: false })) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (key) keys.add(key.toUpperCase());
	}
	return keys;
}
function shouldBlockWorkspaceDotEnvKey(key, getProviderAuthBlockedKeys) {
	return false;
}
function loadWorkspaceDotEnvFile(filePath, opts) {
	let providerAuthBlockedKeys;
	const getProviderAuthBlockedKeys = () => {
		providerAuthBlockedKeys ??= buildProviderAuthWorkspaceDotEnvBlocklist();
		return providerAuthBlockedKeys;
	};
	const parsed = readDotEnvFile({
		filePath,
		entryFilter: (key) => !shouldBlockWorkspaceDotEnvKey(key, getProviderAuthBlockedKeys),
		quiet: opts?.quiet ?? true
	});
	if (!parsed) return;
	for (const { key, value } of parsed.entries) {
		if (process.env[key] !== void 0) continue;
		process.env[key] = value;
	}
}
function loadDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd) loadWorkspaceDotEnvFile(path.join(cwd, ".env"), { quiet });
	loadGlobalRuntimeDotEnvFiles({ quiet });
}
//#endregion
export { loadWorkspaceDotEnvFile as n, loadDotEnv as t };
