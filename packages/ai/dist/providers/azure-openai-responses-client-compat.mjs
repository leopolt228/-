// packages/ai/src/providers/azure-openai-responses-client-compat.ts
function isTraditionalAzureOpenAIHost(hostname) {
  return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) {
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    return false;
  }
  if (isTraditionalAzureOpenAIHost(url.hostname)) {
    return false;
  }
  const hostname = url.hostname.toLowerCase();
  const isFoundryHost = hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".api.cognitive.microsoft.com");
  if (!isFoundryHost) {
    return false;
  }
  const normalizedPath = url.pathname.replace(/\/+$/, "");
  return normalizedPath === "/openai/v1" || normalizedPath.endsWith("/openai/v1");
}
export {
  isOpenAICompatibleAzureResponsesBaseUrl,
  isTraditionalAzureOpenAIHost
};
