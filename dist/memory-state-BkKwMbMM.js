import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/memory-state.ts
/** Registry state for plugin memory runtimes, prompt supplements, and flush planning. */
const log = createSubsystemLogger("plugins/memory-state");
const memoryPluginState = {
	corpusSupplements: [],
	promptPreparations: [],
	promptSupplements: []
};
const preparedMemoryPromptSections = /* @__PURE__ */ new WeakSet();
const activePreparedMemoryPromptSection = new AsyncLocalStorage();
function registerMemoryCorpusSupplement(pluginId, supplement) {
	const next = memoryPluginState.corpusSupplements.filter((registration) => registration.pluginId !== pluginId);
	next.push({
		pluginId,
		supplement
	});
	memoryPluginState.corpusSupplements = next;
}
function registerMemoryCapability(pluginId, capability) {
	const existingCapability = memoryPluginState.capability?.capability;
	const shouldPreserveExisting = existingCapability && Boolean(capability.publicArtifacts) && !capability.promptBuilder && !capability.flushPlanResolver && !capability.runtime;
	memoryPluginState.capability = {
		pluginId,
		capability: {
			...shouldPreserveExisting ? existingCapability : {},
			...capability
		}
	};
}
function getMemoryCapabilityRegistration() {
	return memoryPluginState.capability ? {
		pluginId: memoryPluginState.capability.pluginId,
		capability: { ...memoryPluginState.capability.capability }
	} : void 0;
}
function listMemoryCorpusSupplements() {
	return [...memoryPluginState.corpusSupplements];
}
function registerMemoryPromptSupplement(pluginId, builder) {
	const next = memoryPluginState.promptSupplements.filter((registration) => registration.pluginId !== pluginId);
	next.push({
		pluginId,
		builder
	});
	memoryPluginState.promptSupplements = next;
}
function registerMemoryPromptPreparation(pluginId, prepare) {
	const next = memoryPluginState.promptPreparations.filter((registration) => registration.pluginId !== pluginId);
	next.push({
		pluginId,
		prepare
	});
	memoryPluginState.promptPreparations = next;
}
function buildSynchronousMemoryPromptSection(params) {
	return {
		primary: normalizeMemoryPromptLines(memoryPluginState.capability?.capability.promptBuilder?.(params) ?? []),
		supplements: memoryPluginState.promptSupplements.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).map((registration) => ({
			pluginId: registration.pluginId,
			lines: normalizeMemoryPromptLines(registration.builder(params))
		}))
	};
}
function cloneMemoryPromptSectionParams(params) {
	return {
		availableTools: new Set(params.availableTools),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	};
}
function snapshotMemoryPromptContext(params) {
	return Object.freeze({
		availableTools: Object.freeze([...params.availableTools].toSorted()),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true
	});
}
function preparedMemoryPromptContextMatches(prepared, params) {
	const current = snapshotMemoryPromptContext(params);
	return prepared.context.citationsMode === current.citationsMode && prepared.context.agentId === current.agentId && prepared.context.agentSessionKey === current.agentSessionKey && prepared.context.sandboxed === current.sandboxed && prepared.context.availableTools.length === current.availableTools.length && prepared.context.availableTools.every((tool, index) => tool === current.availableTools[index]);
}
/** Prepare one immutable memory prompt snapshot for a run. */
async function prepareMemoryPromptSection(params) {
	const runParams = cloneMemoryPromptSectionParams(params);
	const context = snapshotMemoryPromptContext(runParams);
	const synchronous = buildSynchronousMemoryPromptSection(cloneMemoryPromptSectionParams(runParams));
	const preparationRegistrations = [...memoryPluginState.promptPreparations];
	const preparedSupplements = await Promise.all(preparationRegistrations.map(async (registration) => ({
		pluginId: registration.pluginId,
		lines: normalizeMemoryPromptLines(await registration.prepare(cloneMemoryPromptSectionParams(runParams)))
	})));
	const lines = Object.freeze([...synchronous.primary, ...[...synchronous.supplements, ...preparedSupplements].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).flatMap((registration) => registration.lines)]);
	const prepared = Object.freeze({
		context,
		lines
	});
	preparedMemoryPromptSections.add(prepared);
	return prepared;
}
/** Keep async preparation run-scoped while a context engine assembles synchronously. */
async function runWithPreparedMemoryPromptSection(params, run) {
	const prepared = await prepareMemoryPromptSection(params);
	return activePreparedMemoryPromptSection.run(prepared, run);
}
function getActivePreparedMemoryPromptSection() {
	return activePreparedMemoryPromptSection.getStore();
}
function buildMemoryPromptSection(params, prepared) {
	if (prepared) {
		if (!preparedMemoryPromptSections.has(prepared) || !preparedMemoryPromptContextMatches(prepared, params)) throw new Error("prepared memory prompt section does not match the current run");
		return [...prepared.lines];
	}
	const synchronous = buildSynchronousMemoryPromptSection(params);
	return [...synchronous.primary, ...synchronous.supplements.flatMap((entry) => entry.lines)];
}
function normalizeMemoryPromptLines(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((line) => typeof line === "string");
}
function listMemoryPromptSupplements() {
	return [...memoryPluginState.promptSupplements];
}
function listMemoryPromptPreparations() {
	return [...memoryPluginState.promptPreparations];
}
function resolveMemoryFlushPlan(params) {
	return memoryPluginState.capability?.capability.flushPlanResolver?.(params) ?? null;
}
function getMemoryRuntime() {
	return memoryPluginState.capability?.capability.runtime;
}
function hasMemoryRuntime() {
	return getMemoryRuntime() !== void 0;
}
function cloneMemoryPublicArtifact(artifact) {
	const agentIds = Array.isArray(artifact.agentIds) ? artifact.agentIds : [];
	return {
		...artifact,
		agentIds: [...agentIds]
	};
}
function isValidMemoryPublicArtifact(artifact) {
	return typeof artifact?.kind === "string" && typeof artifact.workspaceDir === "string" && typeof artifact.relativePath === "string" && typeof artifact.absolutePath === "string" && typeof artifact.contentType === "string";
}
async function listActiveMemoryPublicArtifacts(params) {
	const pluginId = memoryPluginState.capability?.pluginId;
	const listed = await memoryPluginState.capability?.capability.publicArtifacts?.listArtifacts(params) ?? [];
	if (!Array.isArray(listed)) {
		log.warn(`ignoring public memory artifacts from plugin "${pluginId}": not an array`);
		return [];
	}
	const artifacts = listed.filter(isValidMemoryPublicArtifact);
	if (artifacts.length < listed.length) log.warn(`ignoring ${listed.length - artifacts.length} malformed public memory artifact(s) from plugin "${pluginId}": artifacts must include string kind, workspaceDir, relativePath, absolutePath, and contentType`);
	return artifacts.map(cloneMemoryPublicArtifact).toSorted((left, right) => {
		const workspaceOrder = left.workspaceDir.localeCompare(right.workspaceDir);
		if (workspaceOrder !== 0) return workspaceOrder;
		const relativePathOrder = left.relativePath.localeCompare(right.relativePath);
		if (relativePathOrder !== 0) return relativePathOrder;
		const kindOrder = left.kind.localeCompare(right.kind);
		if (kindOrder !== 0) return kindOrder;
		const contentTypeOrder = left.contentType.localeCompare(right.contentType);
		if (contentTypeOrder !== 0) return contentTypeOrder;
		const agentOrder = left.agentIds.join("\0").localeCompare(right.agentIds.join("\0"));
		if (agentOrder !== 0) return agentOrder;
		return left.absolutePath.localeCompare(right.absolutePath);
	});
}
function restoreMemoryPluginState(state) {
	memoryPluginState.capability = state.capability ? {
		pluginId: state.capability.pluginId,
		capability: { ...state.capability.capability }
	} : void 0;
	memoryPluginState.corpusSupplements = [...state.corpusSupplements];
	memoryPluginState.promptPreparations = [...state.promptPreparations];
	memoryPluginState.promptSupplements = [...state.promptSupplements];
}
function clearMemoryPluginState() {
	memoryPluginState.capability = void 0;
	memoryPluginState.corpusSupplements = [];
	memoryPluginState.promptPreparations = [];
	memoryPluginState.promptSupplements = [];
}
//#endregion
export { restoreMemoryPluginState as _, getMemoryRuntime as a, listMemoryCorpusSupplements as c, prepareMemoryPromptSection as d, registerMemoryCapability as f, resolveMemoryFlushPlan as g, registerMemoryPromptSupplement as h, getMemoryCapabilityRegistration as i, listMemoryPromptPreparations as l, registerMemoryPromptPreparation as m, clearMemoryPluginState as n, hasMemoryRuntime as o, registerMemoryCorpusSupplement as p, getActivePreparedMemoryPromptSection as r, listActiveMemoryPublicArtifacts as s, buildMemoryPromptSection as t, listMemoryPromptSupplements as u, runWithPreparedMemoryPromptSection as v };
