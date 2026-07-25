// packages/model-catalog-core/src/model-catalog-types.ts
var MODEL_CATALOG_APIS = [
  "openai-completions",
  "openai-responses",
  "openai-chatgpt-responses",
  "anthropic-messages",
  "google-generative-ai",
  "google-vertex",
  "github-copilot",
  "bedrock-converse-stream",
  "ollama",
  "azure-openai-responses"
];
var MODEL_CATALOG_THINKING_FORMATS = [
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "qwen",
  "qwen-chat-template",
  "zai"
];
function isModelCatalogThinkingFormat(value) {
  return MODEL_CATALOG_THINKING_FORMATS.includes(value);
}
var MODEL_CATALOG_THINKING_LEVELS = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
];
export {
  MODEL_CATALOG_APIS,
  MODEL_CATALOG_THINKING_FORMATS,
  MODEL_CATALOG_THINKING_LEVELS,
  isModelCatalogThinkingFormat
};
