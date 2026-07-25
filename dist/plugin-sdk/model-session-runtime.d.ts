import { c as SessionEntry } from "../types-D43pE80v.js";
import { a as resolveAgentMaxConcurrent, i as isModelSelectionLocked, n as ModelSelectionLockedError, o as resolveChannelModelOverride, r as applyModelOverrideToSessionEntry, t as MODEL_SELECTION_LOCKED_MESSAGE } from "../model-overrides-JrjN6Jyh.js";

//#region src/agents/session-runtime-compat.d.ts
/** Persisted runtime fields used to recover session runtime compatibility. */
type SessionRuntimeCompatEntry = Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
declare function resolvePersistedSessionRuntimeId(entry?: SessionRuntimeCompatEntry): string | undefined;
//#endregion
export { MODEL_SELECTION_LOCKED_MESSAGE, ModelSelectionLockedError, applyModelOverrideToSessionEntry, isModelSelectionLocked, resolveAgentMaxConcurrent, resolveChannelModelOverride, resolvePersistedSessionRuntimeId };