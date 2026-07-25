// packages/ai/src/host.ts
var inertAiTransportHost = {
  buildModelFetch: () => void 0,
  resolveSecretSentinel: (value) => value,
  redactSecrets: (value) => value,
  redactToolPayloadText: (text) => text,
  resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
  logDebug: () => {
  }
};
var activeAiTransportHost = inertAiTransportHost;
function configureAiTransportHost(host) {
  activeAiTransportHost = { ...inertAiTransportHost, ...host };
}
function getAiTransportHost() {
  return activeAiTransportHost;
}
function resolveAiTransportHeaderSentinels(headers) {
  if (!headers) {
    return void 0;
  }
  const host = getAiTransportHost();
  let resolvedHeaders;
  for (const [name, value] of Object.entries(headers)) {
    const resolved = host.resolveSecretSentinel(value);
    if (resolved !== value) {
      resolvedHeaders ??= { ...headers };
      resolvedHeaders[name] = resolved;
    }
  }
  return resolvedHeaders ?? headers;
}
export {
  configureAiTransportHost,
  getAiTransportHost,
  resolveAiTransportHeaderSentinels
};
