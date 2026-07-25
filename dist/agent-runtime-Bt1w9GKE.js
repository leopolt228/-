import "./agent-scope-CrBA-6Gx.js";
import "./agent-scope-config-S7z_Yn4H.js";
import "./provider-auth-aliases-DqR_mVNH.js";
import "./model-selection-shared-CPPxIJAX.js";
import "./codex-plugin-diagnostics-CV4VBWUf.js";
import "./model-auth-markers-Bqpoo9x7.js";
import "./model-catalog-Be-bQQxa.js";
import "./common-C39GdgQ7.js";
import "./model-thinking-default-Bn7kjmzP.js";
import "./model-selection-Dx2ArePR.js";
import { n as loadPreparedModelCatalog, t as getPreparedModelCatalogSnapshot } from "./prepared-model-catalog-CoGiwhz3.js";
import "./auth-profiles-D9OcwMed.js";
import "./model-auth-919iJVmy.js";
import "./embedded-agent-utils-qZ6fWrY1.js";
import "./identity-DV846zOa.js";
import "./tts-CtDDp0V8.js";
import "./identity-avatar-DgE4vqpk.js";
import "./agent-command-Bxu-rIfM.js";
//#region src/plugin-sdk/agent-runtime.ts
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
async function loadModelCatalog(params = {}) {
	const { agentId, agentDir, cacheOnly, config, env, readOnly, workspaceDir } = params;
	const preparedParams = {
		...agentId ? { agentId } : {},
		...agentDir ? { agentDir } : {},
		...config ? { config } : {},
		...env ? { env } : {},
		...readOnly !== void 0 ? { readOnly } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
	if (cacheOnly) return getPreparedModelCatalogSnapshot(preparedParams)?.entries ?? [];
	return await loadPreparedModelCatalog(preparedParams);
}
//#endregion
export { loadModelCatalog as t };
