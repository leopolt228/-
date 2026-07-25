import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { Nc as ProviderAuthResult } from "../../types-Bi5Leigi.js";
import { n as readClaudeCliCredentialsForSetup } from "../../cli-auth-seam-Bj5lL89Q.js";
//#region extensions/anthropic/cli-migration.d.ts
type ClaudeCliCredential = NonNullable<ReturnType<typeof readClaudeCliCredentialsForSetup>>;
/** Build the config migration result for adopting Claude CLI-backed Anthropic defaults. */
declare function buildAnthropicCliMigrationResult(config: OpenClawConfig, credential?: ClaudeCliCredential | null): ProviderAuthResult;
//#endregion
export { buildAnthropicCliMigrationResult };