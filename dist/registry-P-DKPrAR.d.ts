//#region src/agents/harness/registry.d.ts
/** Calls each registered harness dispose hook during registry shutdown or reload. */
declare function disposeRegisteredAgentHarnesses(): Promise<void>;
//#endregion
export { disposeRegisteredAgentHarnesses as t };