import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { h as SecretRef } from "./types.secrets-CNoRpgG4.js";
import { n as PluginManifestRegistry } from "./manifest-registry-C53V9sX9.js";
import { d as SecretRefResolveCache } from "./runtime-shared-CY--Gzyx.js";

//#region src/secrets/resolve.d.ts
type ResolveSecretRefOptions = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  cache?: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
declare function resolveSecretRefValues(refs: SecretRef[], options: ResolveSecretRefOptions): Promise<Map<string, unknown>>;
/** Resolves one SecretRef and requires a non-empty string result. */
declare function resolveSecretRefString(ref: SecretRef, options: ResolveSecretRefOptions): Promise<string>;
//#endregion
export { resolveSecretRefValues as n, resolveSecretRefString as t };