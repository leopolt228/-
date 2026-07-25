// packages/ai/src/providers/azure-deployment-map.ts
function parseAzureDeploymentNameMap(value) {
  const map = /* @__PURE__ */ new Map();
  if (!value) {
    return map;
  }
  for (const entry of value.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const modelId = trimmed.slice(0, separator).trim();
    const deploymentName = trimmed.slice(separator + 1).trim();
    if (!modelId || !deploymentName) {
      continue;
    }
    map.set(modelId, deploymentName);
  }
  return map;
}
var cachedDeploymentLookup;
function getDeploymentLookup(source) {
  const cached = cachedDeploymentLookup;
  if (cached && cached.source === source) {
    return cached;
  }
  const exact = parseAzureDeploymentNameMap(source);
  const folded = /* @__PURE__ */ new Map();
  for (const [modelId, deploymentName] of exact) {
    folded.set(modelId.toLowerCase(), deploymentName);
  }
  cachedDeploymentLookup = { source, exact, folded };
  return cachedDeploymentLookup;
}
function resolveAzureDeploymentNameFromMap(params) {
  const { exact, folded } = getDeploymentLookup(params.deploymentMap);
  return exact.get(params.modelId) ?? folded.get(params.modelId.toLowerCase()) ?? params.modelId;
}
export {
  parseAzureDeploymentNameMap,
  resolveAzureDeploymentNameFromMap
};
