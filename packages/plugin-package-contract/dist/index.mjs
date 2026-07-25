// packages/plugin-package-contract/src/index.ts
var EXTERNAL_CODE_PLUGIN_REQUIRED_FIELD_PATHS = [
  "openclaw.compat.pluginApi",
  "openclaw.build.openclawVersion"
];
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : void 0;
}
function readOpenClawBlock(packageJson) {
  const root = isRecord(packageJson) ? packageJson : void 0;
  const openclaw = isRecord(root?.openclaw) ? root.openclaw : void 0;
  const compat = isRecord(openclaw?.compat) ? openclaw.compat : void 0;
  const build = isRecord(openclaw?.build) ? openclaw.build : void 0;
  const install = isRecord(openclaw?.install) ? openclaw.install : void 0;
  return { root, openclaw, compat, build, install };
}
function normalizeExternalPluginCompatibility(packageJson) {
  const { root, compat, build, install } = readOpenClawBlock(packageJson);
  const version = normalizeOptionalString(root?.version);
  const minHostVersion = normalizeOptionalString(install?.minHostVersion);
  const compatibility = {};
  const pluginApi = normalizeOptionalString(compat?.pluginApi);
  if (pluginApi) {
    compatibility.pluginApiRange = pluginApi;
  }
  const minGatewayVersion = normalizeOptionalString(compat?.minGatewayVersion) ?? minHostVersion;
  if (minGatewayVersion) {
    compatibility.minGatewayVersion = minGatewayVersion;
  }
  const builtWithOpenClawVersion = normalizeOptionalString(build?.openclawVersion) ?? version;
  if (builtWithOpenClawVersion) {
    compatibility.builtWithOpenClawVersion = builtWithOpenClawVersion;
  }
  const pluginSdkVersion = normalizeOptionalString(build?.pluginSdkVersion);
  if (pluginSdkVersion) {
    compatibility.pluginSdkVersion = pluginSdkVersion;
  }
  return Object.keys(compatibility).length > 0 ? compatibility : void 0;
}
function listMissingExternalCodePluginFieldPaths(packageJson) {
  const { compat, build } = readOpenClawBlock(packageJson);
  const missing = [];
  if (!normalizeOptionalString(compat?.pluginApi)) {
    missing.push("openclaw.compat.pluginApi");
  }
  if (!normalizeOptionalString(build?.openclawVersion)) {
    missing.push("openclaw.build.openclawVersion");
  }
  return missing;
}
function validateExternalCodePluginPackageJson(packageJson) {
  const issues = listMissingExternalCodePluginFieldPaths(packageJson).map((fieldPath) => ({
    fieldPath,
    message: `${fieldPath} is required for external code plugin packages.`
  }));
  return {
    compatibility: normalizeExternalPluginCompatibility(packageJson),
    issues
  };
}
export {
  EXTERNAL_CODE_PLUGIN_REQUIRED_FIELD_PATHS,
  listMissingExternalCodePluginFieldPaths,
  normalizeExternalPluginCompatibility,
  validateExternalCodePluginPackageJson
};
