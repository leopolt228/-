import { t as getProviderEnvVars } from "../../provider-env-vars-BX8unNjx.js";
import { n as listMemoryEmbeddingProviders } from "../../memory-embedding-provider-runtime-C8U8ZwXj.js";
import { t as DEFAULT_LOCAL_MODEL } from "../../embedding-defaults-BP3wPc9o.js";
import "../../memory-core-host-embedding-registry-KdLBY3BW.js";
import { t as hasConfiguredMemorySecretInput } from "../../secret-input-BxM5UYg1.js";
import { t as checkQmdBinaryAvailability } from "../../engine-qmd-M1vAwevo.js";
import "../../memory-core-host-engine-qmd-B1m1U0B5.js";
import { n as resolveMemoryFtsState, r as resolveMemoryVectorState, t as resolveMemoryCacheSummary } from "../../status-format-ExS6-yQO.js";
import "../../memory-core-host-status-C_IY4Tnv.js";
import "../../provider-env-vars-B2eYCC7j.js";
import { u as configureMemoryCoreDreamingState } from "../../dreaming-state-B_O8tXV-.js";
import { b as removeGroundedShortTermCandidates, s as auditShortTermPromotionArtifacts, u as loadShortTermPromotionDreamingStats, x as repairShortTermPromotionArtifacts } from "../../short-term-promotion-DpDDtSH8.js";
import { a as createEmbeddingProvider, t as MemoryIndexManager } from "../../manager-v0TOigDy.js";
import { r as getMemorySearchManager } from "../../memory-D8aUiFpz.js";
import { n as memoryRuntime } from "../../runtime-provider-CS6YFfWj.js";
import { n as repairDreamingArtifacts, t as auditDreamingArtifacts } from "../../dreaming-repair-D0YllrHl.js";
//#region extensions/memory-core/src/memory/provider-adapters.ts
function getBuiltinMemoryEmbeddingProviderAdapter(id) {
	return listMemoryEmbeddingProviders().find((adapter) => adapter.id === id);
}
function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId) {
	const adapter = getBuiltinMemoryEmbeddingProviderAdapter(providerId);
	if (!adapter) return null;
	const authProviderId = adapter.authProviderId ?? adapter.id;
	return {
		providerId: adapter.id,
		authProviderId,
		envVars: getProviderEnvVars(authProviderId),
		transport: adapter.transport === "local" ? "local" : "remote",
		autoSelectPriority: adapter.autoSelectPriority
	};
}
function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata() {
	return listMemoryEmbeddingProviders().filter((adapter) => typeof adapter.autoSelectPriority === "number").toSorted((a, b) => (a.autoSelectPriority ?? 0) - (b.autoSelectPriority ?? 0)).map((adapter) => {
		const authProviderId = adapter.authProviderId ?? adapter.id;
		return {
			providerId: adapter.id,
			authProviderId,
			envVars: getProviderEnvVars(authProviderId),
			transport: adapter.transport === "local" ? "local" : "remote",
			autoSelectPriority: adapter.autoSelectPriority
		};
	});
}
//#endregion
export { DEFAULT_LOCAL_MODEL, MemoryIndexManager, auditDreamingArtifacts, auditShortTermPromotionArtifacts, checkQmdBinaryAvailability, configureMemoryCoreDreamingState, createEmbeddingProvider, getBuiltinMemoryEmbeddingProviderDoctorMetadata, getMemorySearchManager, hasConfiguredMemorySecretInput, listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata, loadShortTermPromotionDreamingStats, memoryRuntime, removeGroundedShortTermCandidates, repairDreamingArtifacts, repairShortTermPromotionArtifacts, resolveMemoryCacheSummary, resolveMemoryFtsState, resolveMemoryVectorState };
