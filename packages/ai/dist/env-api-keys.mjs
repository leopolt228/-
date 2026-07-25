var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// packages/ai/src/env-api-keys.ts
var existsSync = null;
var homedir = null;
var join = null;
var dynamicImport = (specifier) => import(specifier);
var NODE_FS_SPECIFIER = "node:fs";
var NODE_OS_SPECIFIER = "node:os";
var NODE_PATH_SPECIFIER = "node:path";
function loadNodeBuiltinModule(specifier) {
  const getBuiltinModule = typeof process !== "undefined" ? process : void 0;
  if (typeof getBuiltinModule?.getBuiltinModule === "function") {
    return getBuiltinModule.getBuiltinModule(specifier);
  }
  if (typeof __require === "function") {
    return __require(specifier);
  }
  return null;
}
function loadNodeHelpersSync() {
  try {
    const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
    const osModule = loadNodeBuiltinModule(NODE_OS_SPECIFIER);
    const pathModule = loadNodeBuiltinModule(NODE_PATH_SPECIFIER);
    existsSync ??= fsModule?.existsSync ?? null;
    homedir ??= osModule?.homedir ?? null;
    join ??= pathModule?.join ?? null;
    if (!existsSync || !homedir || !join) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
if (typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) {
  if (!loadNodeHelpersSync()) {
    void dynamicImport(NODE_FS_SPECIFIER).then((m) => {
      existsSync = m.existsSync;
    });
    void dynamicImport(NODE_OS_SPECIFIER).then((m) => {
      homedir = m.homedir;
    });
    void dynamicImport(NODE_PATH_SPECIFIER).then((m) => {
      join = m.join;
    });
  }
}
var procEnvCache = null;
function getProcessEnv() {
  return typeof process === "undefined" ? void 0 : process.env;
}
function getProcEnv(key) {
  if (typeof process === "undefined" || !process.versions?.bun) {
    return void 0;
  }
  const env = getProcessEnv();
  if (!env) {
    return void 0;
  }
  if (Object.keys(env).length > 0) {
    return void 0;
  }
  if (procEnvCache === null) {
    procEnvCache = /* @__PURE__ */ new Map();
    try {
      const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
      if (!fsModule) {
        return void 0;
      }
      const data = fsModule.readFileSync("/proc/self/environ", "utf-8");
      for (const entry of data.split("\0")) {
        const idx = entry.indexOf("=");
        if (idx > 0) {
          procEnvCache.set(entry.slice(0, idx), entry.slice(idx + 1));
        }
      }
    } catch {
    }
  }
  return procEnvCache.get(key);
}
function getEnvValue(key) {
  return (getProcessEnv()?.[key] || getProcEnv(key))?.trim() || void 0;
}
var cachedVertexAdcCredentialsExists = null;
function hasVertexAdcCredentials() {
  if (cachedVertexAdcCredentialsExists === null) {
    if (!existsSync || !homedir || !join) {
      const isNode = typeof process !== "undefined" && (process.versions?.node || process.versions?.bun);
      if (!isNode || !loadNodeHelpersSync()) {
        return false;
      }
    }
    const nodeExistsSync = existsSync;
    const nodeHomedir = homedir;
    const nodeJoin = join;
    if (!nodeExistsSync || !nodeHomedir || !nodeJoin) {
      return false;
    }
    const gacPath = getEnvValue("GOOGLE_APPLICATION_CREDENTIALS");
    if (gacPath) {
      cachedVertexAdcCredentialsExists = nodeExistsSync(gacPath) ? true : null;
    } else {
      cachedVertexAdcCredentialsExists = nodeExistsSync(
        nodeJoin(nodeHomedir(), ".config", "gcloud", "application_default_credentials.json")
      ) ? true : null;
    }
  }
  return cachedVertexAdcCredentialsExists === true;
}
function getApiKeyEnvVars(provider) {
  if (provider === "github-copilot") {
    return ["COPILOT_GITHUB_TOKEN"];
  }
  if (provider === "anthropic") {
    return ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"];
  }
  if (provider === "moonshot") {
    return ["MOONSHOT_API_KEY", "KIMI_API_KEY"];
  }
  if (provider === "kimi" || provider === "kimi-coding") {
    return ["KIMI_API_KEY", "KIMICODE_API_KEY"];
  }
  const envMap = {
    openai: "OPENAI_API_KEY",
    meta: "MODEL_API_KEY",
    "azure-openai-responses": "AZURE_OPENAI_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    google: "GEMINI_API_KEY",
    "google-vertex": "GOOGLE_CLOUD_API_KEY",
    groq: "GROQ_API_KEY",
    cerebras: "CEREBRAS_API_KEY",
    xai: "XAI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    "vercel-ai-gateway": "AI_GATEWAY_API_KEY",
    zai: "ZAI_API_KEY",
    mistral: "MISTRAL_API_KEY",
    minimax: "MINIMAX_API_KEY",
    "minimax-cn": "MINIMAX_CN_API_KEY",
    moonshotai: "MOONSHOT_API_KEY",
    "moonshotai-cn": "MOONSHOT_API_KEY",
    huggingface: "HF_TOKEN",
    fireworks: "FIREWORKS_API_KEY",
    together: "TOGETHER_API_KEY",
    opencode: "OPENCODE_API_KEY",
    "opencode-go": "OPENCODE_API_KEY",
    "cloudflare-workers-ai": "CLOUDFLARE_API_KEY",
    "cloudflare-ai-gateway": "CLOUDFLARE_API_KEY",
    xiaomi: "XIAOMI_API_KEY",
    "xiaomi-token-plan-cn": "XIAOMI_TOKEN_PLAN_CN_API_KEY",
    "xiaomi-token-plan-ams": "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
    "xiaomi-token-plan-sgp": "XIAOMI_TOKEN_PLAN_SGP_API_KEY"
  };
  const envVar = envMap[provider];
  return envVar ? [envVar] : void 0;
}
function findEnvKeys(provider) {
  const envVars = getApiKeyEnvVars(provider);
  if (!envVars) {
    return void 0;
  }
  const found = envVars.filter((envVar) => Boolean(getEnvValue(envVar)));
  return found.length > 0 ? found : void 0;
}
function getEnvApiKey(provider) {
  const envKeys = findEnvKeys(provider);
  if (envKeys?.[0]) {
    return getEnvValue(envKeys[0]);
  }
  if (provider === "google-vertex") {
    const hasCredentials = hasVertexAdcCredentials();
    const hasProject = Boolean(
      getEnvValue("GOOGLE_CLOUD_PROJECT") || getEnvValue("GCLOUD_PROJECT")
    );
    const hasLocation = Boolean(getEnvValue("GOOGLE_CLOUD_LOCATION"));
    if (hasCredentials && hasProject && hasLocation) {
      return "<authenticated>";
    }
  }
  if (provider === "amazon-bedrock") {
    if (getEnvValue("AWS_PROFILE") || getEnvValue("AWS_ACCESS_KEY_ID") && getEnvValue("AWS_SECRET_ACCESS_KEY") || getEnvValue("AWS_BEARER_TOKEN_BEDROCK") || getEnvValue("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") || getEnvValue("AWS_CONTAINER_CREDENTIALS_FULL_URI") || getEnvValue("AWS_WEB_IDENTITY_TOKEN_FILE")) {
      return "<authenticated>";
    }
  }
  return void 0;
}
export {
  findEnvKeys,
  getEnvApiKey
};
