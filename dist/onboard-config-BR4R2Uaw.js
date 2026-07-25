import { r as setConfigValueAtPath } from "./config-paths-DEsSO_sF.js";
//#region src/commands/onboard-config.ts
/** Shared config mutations used by interactive and non-interactive onboarding. */
/** Default tool profile selected during local onboarding. */
const ONBOARDING_DEFAULT_TOOLS_PROFILE = "coding";
/** Applies local gateway/workspace defaults without overwriting explicit user defaults. */
function applyLocalSetupWorkspaceConfig(baseConfig, workspaceDir) {
	return {
		...baseConfig,
		agents: {
			...baseConfig.agents,
			defaults: {
				...baseConfig.agents?.defaults,
				workspace: workspaceDir
			}
		},
		gateway: {
			...baseConfig.gateway,
			mode: "local"
		},
		tools: {
			...baseConfig.tools,
			profile: baseConfig.tools?.profile ?? ONBOARDING_DEFAULT_TOOLS_PROFILE
		}
	};
}
/** Marks default agents to skip bootstrap file creation. */
function applySkipBootstrapConfig(cfg) {
	const next = structuredClone(cfg);
	setConfigValueAtPath(next, [
		"agents",
		"defaults",
		"skipBootstrap"
	], true);
	return next;
}
//#endregion
export { applySkipBootstrapConfig as n, applyLocalSetupWorkspaceConfig as t };
