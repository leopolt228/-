import { n as SecretDefaults, t as ResolverContext } from "../../runtime-shared-CY--Gzyx.js";
import { n as SecretTargetRegistryEntry } from "../../target-registry-types-B2S7Q-Ng.js";
//#region extensions/discord/src/secret-config-contract.d.ts
declare const secretTargetRegistryEntries: SecretTargetRegistryEntry[];
declare function collectRuntimeConfigAssignments(params: {
  config: {
    channels?: Record<string, unknown>;
  };
  defaults?: SecretDefaults;
  context: ResolverContext;
}): void;
//#endregion
export { collectRuntimeConfigAssignments, secretTargetRegistryEntries };