import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, f as normalizeStringifiedOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { C as resolveExpiresAtMsFromDurationMs, P as timestampMsToIsoString, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-Crk_c9KW.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { h as normalizeUniqueTrimmedStringList, l as normalizeStringEntries, p as normalizeUniqueStringEntries, v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { O as normalizeCommandDescriptorName, k as sanitizeCommandDescriptorDescription } from "./argv-D4LdWdQQ.js";
import { t as sanitizeForLog } from "./ansi-BEaQ2G9r.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { l as withTimeout } from "./fs-safe-Dy0g6QwA.js";
import { t as createSubsystemLogger } from "./subsystem-Dogzi5wG.js";
import "./utils-K2PjeLaV.js";
import "./number-coercion-IpMOa8nH.js";
import { n as computeBackoff, s as sleepWithAbort } from "./src-DKBD8PDy.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import { i as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./ids-retRJEzF.js";
import { n as defaultSlotIdForKey, r as hasKind } from "./slots-CqNa_aqs.js";
import { $ as executeSqliteQueryTakeFirstSync, O as resolveOpenClawStateSqlitePath, Q as executeSqliteQuerySync, a as openOpenClawStateDatabase, c as runOpenClawStateWriteTransaction, et as getNodeSqliteKysely, j as normalizeSqliteNumber } from "./openclaw-state-db-DkOMT2fb.js";
import { t as isSqliteLockError } from "./sqlite-transaction-DCHi8Wi-.js";
import "./agent-scope-CrBA-6Gx.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-Drrs61Fd.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-S7z_Yn4H.js";
import { t as isStringOption } from "./string-readers-A0wspDGq.js";
import { t as validateJsonSchemaValue } from "./schema-validator-fsGhGcGu.js";
import { _ as getPluginCompatRecord } from "./installed-plugin-index-DlWmC2dq.js";
import { z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cq9SwNpx.js";
import { d as normalizeChannelMeta } from "./bundled-CX_lU3gw.js";
import { S as registerEmbeddingProvider, b as getRegisteredEmbeddingProvider } from "./gateway-startup-plugin-ids-DDW1RRDk.js";
import { s as validateWorkerProviderContract } from "./worker-provider-registry--meupQ0q.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { n as getProcessStartTime } from "./pid-alive-3LhI2apQ.js";
import { a as NODE_EXEC_APPROVALS_COMMANDS, d as NODE_SYSTEM_NOTIFY_COMMAND, f as NODE_SYSTEM_RUN_COMMANDS } from "./node-commands-CLCBg3iU.js";
import { t as normalizePluginGatewayMethodScope } from "./gateway-method-policy-BQVhuE4m.js";
import { c as isOperatorScope } from "./operator-scopes-BHrNTqoH.js";
import { f as runOpenClawAgentWriteTransaction, u as openOpenClawAgentDatabase } from "./openclaw-agent-db-BZ3-lIlN.js";
import { a as registerAgentHarness, r as getRegisteredAgentHarness } from "./registry-D03pg4Q5.js";
import { r as listChatChannels } from "./chat-meta-SinBir5u.js";
import { t as buildPluginApi } from "./api-builder-BOlccqi0.js";
import { i as registerDetachedTaskLifecycleRuntime, n as getDetachedTaskLifecycleRuntimeRegistration } from "./detached-task-runtime-state-BrJUgd0A.js";
import { a as validatePluginCommandDefinition, c as clearPluginCommandsForPlugin, f as pluginCommands, i as registerPluginCommand, t as isReservedCommandName } from "./command-registration-eT0Xvf3Q.js";
import { A as clearPluginRunContext, B as isPluginRegistryActivated, F as registerPluginSessionSchedulerJob, I as setPluginRunContext, L as buildPluginAgentTurnPrepareContext, M as getPluginRunContext, N as getPluginSessionSchedulerJobGeneration, O as createEmptyPluginRegistry, R as normalizePluginHostHookId, V as isPluginRegistryRetired, c as getActivePluginRegistry, j as deletePluginSessionSchedulerJob, p as getActivePluginSessionExtensionRegistry } from "./runtime-BapEso0o.js";
import { l as emitAgentEvent } from "./agent-events-Dg0sI2pr.js";
import { a as registerRegistryPluginInteractiveHandler, n as clearPluginInteractiveHandlersForPlugin } from "./interactive-registry-DYMqCNCz.js";
import { f as registerMemoryCapability, h as registerMemoryPromptSupplement, m as registerMemoryPromptPreparation, p as registerMemoryCorpusSupplement } from "./memory-state-BkKwMbMM.js";
import { c as validateOptionalPluginStoreTtlMs, d as validatePluginStorePositiveInteger, l as validatePluginStoreKey, n as createPluginStateKeyedStore, r as createPluginStateSyncKeyedStore, s as serializePluginStoreJson, t as createCorePluginStateSyncKeyedStore, u as validatePluginStoreNamespace } from "./plugin-state-store-DtRrl2QK.js";
import { n as detectMime, t as FILE_TYPE_SNIFF_MAX_BYTES, u as normalizeMimeType } from "./mime-De36NoRj.js";
import { t as resolvePathFromInput } from "./path-policy-CDBBvjVI.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-DYtv0bRr.js";
import { At as updateResolvedSessionEntry, Ot as resolveSessionEntryAccessTarget } from "./session-accessor-Mu3lv_Tl.js";
import { i as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DYDkUiW3.js";
import "./message-channel-CkiwT4Uh.js";
import { T as isAgentHarnessSessionKeyOwnedBy, u as normalizeSessionEntrySlotKey, w as isAgentHarnessSessionKey } from "./store-DDuGv_UJ.js";
import { t as extractDeliveryInfo } from "./delivery-info-CPEyH8DP.js";
import { i as readRecordValue, n as copyRecordEntries, r as isRecordWithoutThrowing, t as copyArrayEntries } from "./safe-record-Cx9ufCqd.js";
import { r as createPluginGatewayMethodDescriptor } from "./registry-CnDSDSlE.js";
import { n as normalizePluginHttpPath, t as findOverlappingPluginHttpRoute } from "./http-route-overlap--iFT7z_9.js";
import { a as isDeprecatedPluginHookName, i as isConversationHookName, o as isPluginHookName, r as DEPRECATED_PLUGIN_HOOKS, s as isPromptInjectionHookName } from "./types-BBjFssGr.js";
import { f as registerInternalHook, h as unregisterInternalHook } from "./internal-hooks-X7hqWd1k.js";
import "./with-timeout-mEMkfIw9.js";
import { r as createChannelIngressDrain } from "./ingress-drain-CcUB4x_c.js";
import { n as createChannelIngressQueue } from "./ingress-queue-CRq_mALB.js";
import "./backoff-CCtTkmwj.js";
import { t as PluginStateLeaseError } from "./plugin-state-lease.types-C0g0-ID5.js";
import { i as withPluginRuntimePluginScope, r as withPluginRuntimePluginIdScope } from "./gateway-request-scope-CiIBNuZX.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import * as fsPromises from "node:fs/promises";
import { lstat } from "node:fs/promises";
//#region src/plugins/compaction-provider.ts
const COMPACTION_PROVIDER_REGISTRY_STATE = Symbol.for("openclaw.compactionProviderRegistryState");
function getCompactionProviderRegistryState() {
	const globalState = globalThis;
	if (!globalState[COMPACTION_PROVIDER_REGISTRY_STATE]) globalState[COMPACTION_PROVIDER_REGISTRY_STATE] = { providers: /* @__PURE__ */ new Map() };
	return globalState[COMPACTION_PROVIDER_REGISTRY_STATE];
}
/**
* Register a compaction provider implementation.
* Pass `ownerPluginId` so the loader can snapshot/restore correctly.
*/
function registerCompactionProvider(provider, options) {
	getCompactionProviderRegistryState().providers.set(provider.id, {
		provider,
		ownerPluginId: options?.ownerPluginId
	});
}
/** Return the provider for the given id, or undefined. */
function getCompactionProvider(id) {
	return getCompactionProviderRegistryState().providers.get(id)?.provider;
}
/** Return the registered entry (provider + owner) for the given id. */
function getRegisteredCompactionProvider(id) {
	return getCompactionProviderRegistryState().providers.get(id);
}
/** List all registered entries with owner metadata (for snapshot/restore). */
function listRegisteredCompactionProviders() {
	return Array.from(getCompactionProviderRegistryState().providers.values());
}
/** Clear all compaction providers. Used by clearPluginLoaderCache() and reload. */
function clearCompactionProviders() {
	getCompactionProviderRegistryState().providers.clear();
}
/** Restore from a snapshot, replacing all current entries. */
function restoreRegisteredCompactionProviders(entries) {
	const map = getCompactionProviderRegistryState().providers;
	map.clear();
	for (const entry of entries) map.set(entry.provider.id, entry);
}
//#endregion
//#region src/plugins/memory-embedding-providers.ts
const MEMORY_EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.memoryEmbeddingProviders");
function getMemoryEmbeddingProviders() {
	const globalStore = globalThis;
	const existing = globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY] = created;
	return created;
}
/** Registers a memory embedding provider adapter for the current process. */
function registerMemoryEmbeddingProvider(adapter, options) {
	getMemoryEmbeddingProviders().set(adapter.id, {
		adapter,
		ownerPluginId: options?.ownerPluginId
	});
}
/** Returns a registered memory embedding provider entry. */
function getRegisteredMemoryEmbeddingProvider(id) {
	return getMemoryEmbeddingProviders().get(id);
}
/** Returns only the memory embedding provider adapter. */
function getMemoryEmbeddingProvider(id) {
	return getMemoryEmbeddingProviders().get(id)?.adapter;
}
/** Lists registered memory embedding provider entries. */
function listRegisteredMemoryEmbeddingProviders() {
	return Array.from(getMemoryEmbeddingProviders().values());
}
/** Lists registered memory embedding provider adapters. */
function listMemoryEmbeddingProviders() {
	return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}
/** Replaces registered memory embedding providers while preserving metadata. */
function restoreRegisteredMemoryEmbeddingProviders(entries) {
	getMemoryEmbeddingProviders().clear();
	for (const entry of entries) registerMemoryEmbeddingProvider(entry.adapter, { ownerPluginId: entry.ownerPluginId });
}
/** Clears registered memory embedding providers. */
function clearMemoryEmbeddingProviders() {
	getMemoryEmbeddingProviders().clear();
}
//#endregion
//#region src/agents/code-mode-json.ts
function toCodeModeJsonSafe(value) {
	if (value === void 0) return null;
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? null : JSON.parse(serialized);
	} catch {
		if (value instanceof Error) return {
			name: value.name,
			message: value.message
		};
		if (value === null) return null;
		switch (typeof value) {
			case "string":
			case "number":
			case "boolean": return value;
			case "bigint":
			case "symbol":
			case "function": return String(value);
			default: return Object.prototype.toString.call(value);
		}
	}
}
//#endregion
//#region src/agents/code-mode-namespaces.ts
/**
* Registry and runtime projection for code-mode namespaces. Plugins register
* namespaced tool scopes here; code mode receives descriptors, virtual API
* files, and a guarded invocation runtime.
*/
const FORBIDDEN_NAMESPACE_PATH_SEGMENTS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const NAMESPACE_PATH_KEY_SEPARATOR = "\0";
const CODE_MODE_NAMESPACE_TOOL_CALL = Symbol.for("openclaw.codeMode.namespaceToolCall");
const RESERVED_NAMESPACE_GLOBALS = /* @__PURE__ */ new Set([
	"ALL_TOOLS",
	"agents",
	"API",
	"Array",
	"Boolean",
	"Date",
	"Error",
	"globalThis",
	"log",
	"json",
	"JSON",
	"Map",
	"Math",
	"MCP",
	"namespaces",
	"Number",
	"Object",
	"Promise",
	"phase",
	"Set",
	"String",
	"text",
	"tools",
	"yield_control"
]);
const CODE_MODE_NAMESPACE_REGISTRY_KEY = Symbol.for("openclaw.codeMode.namespaces");
const globalWithRegistry = globalThis;
const registryState = globalWithRegistry[CODE_MODE_NAMESPACE_REGISTRY_KEY] ?? (globalWithRegistry[CODE_MODE_NAMESPACE_REGISTRY_KEY] = { registrations: /* @__PURE__ */ new Map() });
function createCodeModeNamespaceCatalogTool(catalogId, toolName, input) {
	const normalizedCatalogId = catalogId.trim();
	const normalizedToolName = toolName.trim();
	if (!normalizedCatalogId) throw new Error("Code mode namespace catalogId must be non-empty.");
	if (!normalizedToolName) throw new Error("Code mode namespace toolName must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		catalogId: normalizedCatalogId,
		toolName: normalizedToolName,
		...input ? { input } : {}
	};
}
function createCodeModeNamespaceLocalFunction(toolName, input) {
	const normalizedToolName = toolName.trim();
	if (!normalizedToolName) throw new Error("Code mode namespace local function name must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		toolName: normalizedToolName,
		local: true,
		input
	};
}
function isCodeModeNamespaceToolCall(value) {
	const record = isRecord(value) ? value : void 0;
	return record?.[CODE_MODE_NAMESPACE_TOOL_CALL] === true && typeof record.toolName === "string" && record.toolName.trim().length > 0;
}
/** Lists registered namespaces in deterministic id order. */
function listCodeModeNamespaces() {
	return [...registryState.registrations.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
/** Clears all namespace registrations for isolated tests. */
function clearCodeModeNamespacesForTest() {
	registryState.registrations.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.codeModeNamespacesTestApi")] = {
	clearCodeModeNamespacesForTest,
	listCodeModeNamespaces
};
/** Clears namespace registrations owned by one plugin. */
function clearCodeModeNamespacesForPlugin(pluginId) {
	const normalized = pluginId.trim();
	for (const registration of registryState.registrations.values()) if (registration.pluginId === normalized) registryState.registrations.delete(registration.id);
}
function promptForRegistration(registration, ctx) {
	const prompt = typeof registration.prompt === "function" ? registration.prompt(ctx) : registration.prompt;
	return typeof prompt === "string" && prompt.trim() ? prompt.trim() : void 0;
}
function registrationHasVisibleRequiredTools(registration, catalog) {
	const ownedVisibleToolNames = new Set(catalog.filter((entry) => entry.sourceName === registration.pluginId).map((entry) => entry.name));
	return registration.requiredToolNames.every((toolName) => ownedVisibleToolNames.has(toolName));
}
function filterRegistrationsByVisibleTools(catalog) {
	return listCodeModeNamespaces().filter((registration) => registrationHasVisibleRequiredTools(registration, catalog));
}
function toIdentifier(value, fallback) {
	const words = value.trim().split(/[^A-Za-z0-9]+/u).map((word) => word.trim()).filter(Boolean);
	const safe = (words.length === 0 ? fallback : words.map((word, index) => index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)).join("")).replace(/^[^A-Za-z_$]+/u, "").replace(/[^A-Za-z0-9_$]/gu, "");
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(safe) ? safe : fallback;
}
function uniqueIdentifier(base, used) {
	let candidate = base;
	let index = 2;
	while (used.has(candidate) || RESERVED_NAMESPACE_GLOBALS.has(candidate) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(candidate)) {
		candidate = `${base}${index}`;
		index += 1;
	}
	used.add(candidate);
	return candidate;
}
function readSchemaRecord(schema) {
	return isRecord(schema) ? schema : void 0;
}
function readSchemaProperties(schema) {
	const record = readSchemaRecord(schema);
	return isRecord(record?.properties) ? record.properties : {};
}
function readSchemaString(schema, key) {
	const value = readSchemaRecord(schema)?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readRequiredKeys(schema) {
	const record = readSchemaRecord(schema);
	return Array.isArray(record?.required) ? record.required.filter((entry) => typeof entry === "string") : [];
}
function orderedSchemaKeys(schema) {
	const required = readRequiredKeys(schema);
	const properties = Object.keys(readSchemaProperties(schema));
	return [.../* @__PURE__ */ new Set([...required, ...properties])];
}
function applySchemaDefaults(schema, input) {
	const result = { ...input };
	for (const [key, descriptor] of Object.entries(readSchemaProperties(schema))) {
		if (!isRecord(descriptor) || !("default" in descriptor) || result[key] !== void 0) continue;
		result[key] = descriptor.default;
	}
	return result;
}
function mapMcpNamespaceInput(schema, args) {
	if (args.length > 1) throw new Error("MCP namespace tools accept one object argument.");
	const firstArg = args[0];
	const result = firstArg === void 0 ? {} : isRecord(firstArg) ? { ...firstArg } : {};
	if (firstArg !== void 0 && !isRecord(firstArg)) throw new Error("MCP namespace tools accept one object argument.");
	const withDefaults = applySchemaDefaults(schema, result);
	const missing = readRequiredKeys(schema).filter((key) => withDefaults[key] === void 0);
	if (missing.length > 0) throw new Error(`Missing required MCP namespace argument${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
	return withDefaults;
}
function escapeDocComment(value) {
	return value.replace(/\*\//gu, "* /").trim();
}
function indent(lines, prefix) {
	return lines.map((line) => `${prefix}${line}`);
}
function renderDocComment(summary, params) {
	const lines = [];
	const docLines = normalizeDocLines(summary);
	if (docLines.length === 0 && params.length === 0) return lines;
	lines.push("/**");
	for (const line of docLines) lines.push(` * ${escapeDocComment(line)}`);
	if (docLines.length > 0 && params.length > 0) lines.push(" *");
	for (const param of params) {
		const description = collapseDocText(param.description);
		if (description) lines.push(` * @param ${param.name}${param.required ? "" : "?"} ${escapeDocComment(description)}`);
	}
	lines.push(" */");
	return lines;
}
function normalizeDocLines(value) {
	if (!value) return [];
	return value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).slice(0, 12);
}
function collapseDocText(value) {
	return normalizeDocLines(value).join(" ");
}
function schemaType(schema) {
	const record = readSchemaRecord(schema);
	if (!record) return "unknown";
	const enumValues = Array.isArray(record.enum) ? record.enum.filter((entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") : [];
	if (enumValues.length > 0 && enumValues.length <= 16) return enumValues.map((entry) => JSON.stringify(entry)).join(" | ");
	const oneOf = Array.isArray(record.oneOf) ? record.oneOf : void 0;
	const anyOf = Array.isArray(record.anyOf) ? record.anyOf : void 0;
	const union = oneOf ?? anyOf;
	if (union && union.length > 0 && union.length <= 8) return union.map((entry) => schemaType(entry)).join(" | ");
	const type = record.type;
	if (Array.isArray(type)) return type.map((entry) => schemaType({
		...record,
		type: entry
	})).join(" | ");
	switch (type) {
		case "string": return "string";
		case "integer":
		case "number": return "number";
		case "boolean": return "boolean";
		case "array": return `${schemaType(record.items)}[]`;
		case "object": return renderInlineObjectType(record);
		case "null": return "null";
		default: return Object.keys(readSchemaProperties(schema)).length > 0 ? renderInlineObjectType(record) : "unknown";
	}
}
function tsPropertyName(name) {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(name) ? name : JSON.stringify(name);
}
function renderInlineObjectType(schema) {
	const properties = readSchemaProperties(schema);
	const keys = Object.keys(properties);
	if (keys.length === 0) return "Record<string, unknown>";
	const required = new Set(readRequiredKeys(schema));
	return `{ ${keys.map((key) => `${tsPropertyName(key)}${required.has(key) ? "" : "?"}: ${schemaType(properties[key])}`).join("; ")} }`;
}
function buildMcpParamDocs(schema) {
	const required = new Set(readRequiredKeys(schema));
	return orderedSchemaKeys(schema).map((key) => {
		const descriptor = readSchemaProperties(schema)[key];
		const doc = {
			name: key,
			required: required.has(key),
			type: schemaType(descriptor)
		};
		const description = readSchemaString(descriptor, "description");
		if (description) doc.description = description;
		if (isRecord(descriptor) && "default" in descriptor) doc.defaultValue = descriptor.default;
		return doc;
	});
}
function renderMcpInputType(params) {
	if (params.length === 0) return ["input?: Record<string, never>"];
	const lines = ["input: {"];
	for (const param of params) {
		if (param.description || param.defaultValue !== void 0) {
			const description = collapseDocText(param.description);
			const suffix = param.defaultValue === void 0 ? "" : ` Default: ${JSON.stringify(param.defaultValue)}.`;
			lines.push(`  /** ${escapeDocComment(`${description}${suffix}`.trim())} */`);
		}
		lines.push(`  ${tsPropertyName(param.name)}${param.required ? "" : "?"}: ${param.type};`);
	}
	lines.push("}");
	return lines;
}
function renderMcpToolSignature(tool, functionName = tool.path.at(-1) ?? tool.method) {
	const lines = renderDocComment(tool.description, tool.params);
	lines.push(`function ${functionName}(`);
	lines.push(...indent(renderMcpInputType(tool.params), "  "));
	lines.push("): Promise<McpToolResult>;");
	return lines;
}
function renderMcpServerHeader(server, tools) {
	const lines = [
		"type McpApiHeader = { header: string; tools?: unknown[]; schemas?: Record<string, unknown> };",
		"",
		"type McpToolResult = {",
		"  content?: unknown[];",
		"  structuredContent?: unknown;",
		"  isError?: boolean;",
		"  [key: string]: unknown;",
		"};",
		"",
		`declare namespace MCP.${server.identifier} {`,
		"  /** Return this TypeScript-style API header. */",
		"  function $api(toolName?: string, options?: { schema?: boolean }): Promise<McpApiHeader>;"
	];
	const topLevelTools = tools.filter((tool) => tool.path.length === 1);
	const nestedTools = tools.filter((tool) => tool.path.length > 1);
	for (const tool of topLevelTools) {
		lines.push("");
		lines.push(...indent(renderMcpToolSignature(tool), "  "));
	}
	const nestedGroups = /* @__PURE__ */ new Map();
	for (const tool of nestedTools) {
		const groupName = tool.path[0] ?? "tools";
		nestedGroups.set(groupName, [...nestedGroups.get(groupName) ?? [], tool]);
	}
	for (const [groupName, groupTools] of [...nestedGroups.entries()].toSorted((a, b) => a[0].localeCompare(b[0]))) {
		lines.push("");
		lines.push(`  namespace ${groupName} {`);
		for (const tool of groupTools) {
			lines.push("");
			lines.push(...indent(renderMcpToolSignature(tool, tool.path.at(-1) ?? tool.method), "    "));
		}
		lines.push("  }");
	}
	lines.push("}");
	return lines.join("\n");
}
function renderMcpRootHeader(servers) {
	return [
		"type McpApiHeader = { header: string; servers?: unknown[] };",
		"",
		"declare const MCP: {",
		"  /** List visible MCP servers and request server-specific headers. */",
		"  $api(): Promise<McpApiHeader>;",
		...servers.map((server) => `  readonly ${server.identifier}: typeof MCP.${server.identifier};`),
		"};"
	].join("\n");
}
function renderMcpRootFile(servers) {
	return [
		...servers.map((server) => `/// <reference path="./${server.identifier}.d.ts" />`),
		"",
		renderMcpRootHeader(servers)
	].join("\n");
}
function buildMcpApiResponse(params) {
	const [selector, options] = params.args;
	const includeSchema = isRecord(options) && options.schema === true;
	if (!params.server) return {
		kind: "mcp_api",
		scope: "root",
		header: renderMcpRootHeader(params.servers),
		servers: params.servers.map((server) => ({
			identifier: server.identifier,
			serverName: server.serverName,
			toolCount: server.tools.length
		})),
		note: "Call MCP.<server>.$api() for a TypeScript-style header, then call tools with one object argument matching the shown input type."
	};
	const selected = typeof selector === "string" && selector.trim() ? params.server.tools.filter((tool) => tool.method === selector.trim() || tool.path.join(".") === selector.trim() || tool.mcpTool === selector.trim()) : params.server.tools;
	return {
		kind: "mcp_api",
		scope: selected.length === 1 ? "tool" : "server",
		server: {
			identifier: params.server.identifier,
			serverName: params.server.serverName
		},
		header: renderMcpServerHeader(params.server, selected),
		tools: selected.map((tool) => ({
			method: tool.method,
			path: tool.path,
			mcpTool: tool.mcpTool,
			operation: tool.operation,
			description: tool.description
		})),
		...includeSchema ? { schemas: Object.fromEntries(selected.map((tool) => [tool.method, tool.parameters])) } : {},
		note: "Call MCP tools with one object argument, for example MCP.server.tool({ requiredField: value })."
	};
}
function scopeAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		const next = current[segment];
		if (!isRecord(next)) {
			const object = Object.create(null);
			current[segment] = object;
			current = object;
			continue;
		}
		current = next;
	}
	return current;
}
function toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier) {
	const existing = usedToolIdentifiers.get(serverIdentifier);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Set([
		"$api",
		"resources",
		"prompts"
	]);
	usedToolIdentifiers.set(serverIdentifier, created);
	return created;
}
function createMcpNamespaceModel(catalog) {
	const mcpEntries = catalog.filter((entry) => entry.source === "mcp" && entry.id && entry.mcp);
	if (mcpEntries.length === 0) return;
	const serverNames = /* @__PURE__ */ new Map();
	const usedServerIdentifiers = /* @__PURE__ */ new Set();
	for (const entry of mcpEntries) {
		const safeServerName = entry.mcp?.safeServerName ?? entry.sourceName ?? "mcp";
		if (serverNames.has(safeServerName)) continue;
		serverNames.set(safeServerName, uniqueIdentifier(toIdentifier(safeServerName, "server"), usedServerIdentifiers));
	}
	const usedToolIdentifiers = /* @__PURE__ */ new Map();
	const root = Object.create(null);
	const serverDocs = /* @__PURE__ */ new Map();
	for (const entry of mcpEntries.toSorted((a, b) => (a.id ?? "").localeCompare(b.id ?? ""))) {
		const mcp = entry.mcp;
		if (!mcp || !entry.id) continue;
		const serverIdentifier = serverNames.get(mcp.safeServerName) ?? uniqueIdentifier("server", usedServerIdentifiers);
		const serverScope = scopeAtPath(root, [serverIdentifier]);
		serverScope.$serverName = mcp.serverName;
		let serverDoc = serverDocs.get(serverIdentifier);
		if (!serverDoc) {
			serverDoc = {
				identifier: serverIdentifier,
				serverName: mcp.serverName,
				tools: []
			};
			serverDocs.set(serverIdentifier, serverDoc);
		}
		const path = mcp.operation === "resources_list" ? ["resources", "list"] : mcp.operation === "resources_read" ? ["resources", "read"] : mcp.operation === "prompts_list" ? ["prompts", "list"] : mcp.operation === "prompts_get" ? ["prompts", "get"] : [uniqueIdentifier(toIdentifier(mcp.toolName, "tool"), toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier))];
		const parent = scopeAtPath(serverScope, path.slice(0, -1));
		parent[path.at(-1) ?? "tool"] = createCodeModeNamespaceCatalogTool(entry.id, entry.name, (args) => mapMcpNamespaceInput(entry.parameters, args));
		serverDoc.tools.push({
			method: path.join("."),
			path,
			mcpTool: mcp.toolName,
			operation: mcp.operation,
			description: entry.description,
			parameters: entry.parameters,
			params: buildMcpParamDocs(entry.parameters)
		});
	}
	const docs = [...serverDocs.values()].map((server) => Object.assign({}, server, { tools: server.tools.toSorted((a, b) => a.method.localeCompare(b.method)) }));
	root.$api = createCodeModeNamespaceLocalFunction("$api", (args) => buildMcpApiResponse({
		servers: docs,
		args
	}));
	for (const server of docs) {
		const serverScope = scopeAtPath(root, [server.identifier]);
		serverScope.$api = createCodeModeNamespaceLocalFunction("$api", (args) => buildMcpApiResponse({
			servers: docs,
			server,
			args
		}));
	}
	return {
		root,
		docs
	};
}
function createMcpNamespaceScope(catalog) {
	return createMcpNamespaceModel(catalog)?.root;
}
const SWARM_AGENTS_API_CONTENT = `type AgentJsonSchema = Record<string, unknown>;

interface AgentRunOptions {
  label?: string;
  model?: string;
  thinking?: string;
  fastMode?: boolean | "auto";
  agentId?: string;
  schema?: AgentJsonSchema;
  phase?: string;
}

interface AgentsApi {
  run(prompt: string, options?: AgentRunOptions & { schema?: undefined }): Promise<string>;
  run<T>(prompt: string, options: AgentRunOptions & { schema: AgentJsonSchema }): Promise<T>;
}

/** Spawn collector agents concurrently. */
declare const agents: Readonly<AgentsApi>;
/** Publish a phase heading for this swarm. */
declare function phase(title: string): void;
/** Publish a progress note for this swarm. */
declare function log(message: string): void;

// Fan-out: const reports = await Promise.all(prompts.map((prompt) => agents.run(prompt)));
// Gate: while (!ready) { ready = await agents.run("Check readiness") === "ready"; }
// Cycle: for (let pass = 0; pass < 3; pass++) draft = await agents.run("Improve: " + draft);
// Schema: const fact = await agents.run<{ answer: string }>("Research", { schema: { type: "object", properties: { answer: { type: "string" } }, required: ["answer"] } });
`;
/** Builds virtual API declaration files for visible guest and MCP namespace tools. */
function createCodeModeApiVirtualFiles(catalog = []) {
	const files = [{
		path: "agents.d.ts",
		description: "Swarm collector globals and orchestration idioms.",
		content: SWARM_AGENTS_API_CONTENT,
		bytes: Buffer.byteLength(SWARM_AGENTS_API_CONTENT, "utf8")
	}];
	const model = createMcpNamespaceModel(catalog);
	if (!model) return files;
	const rootContent = renderMcpRootFile(model.docs);
	files.push({
		path: "mcp/index.d.ts",
		description: "Root MCP namespace declaration and server list.",
		content: rootContent,
		bytes: Buffer.byteLength(rootContent, "utf8")
	});
	for (const server of model.docs) {
		const content = renderMcpServerHeader(server, server.tools);
		files.push({
			path: `mcp/${server.identifier}.d.ts`,
			description: `MCP server declaration for ${server.serverName}.`,
			content,
			bytes: Buffer.byteLength(content, "utf8")
		});
	}
	return files;
}
function createMcpNamespaceEntry(catalog) {
	const scope = createMcpNamespaceScope(catalog);
	if (!scope) return;
	const callablePaths = /* @__PURE__ */ new Set();
	return {
		registration: {
			id: "mcp",
			pluginId: "bundle-mcp",
			globalName: "MCP",
			requiredToolNames: [],
			description: "MCP server tools grouped by server.",
			createScope: () => scope
		},
		callablePaths,
		scope,
		descriptor: {
			id: "mcp",
			globalName: "MCP",
			description: "MCP server tools grouped by server.",
			scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths)
		}
	};
}
function describeMcpNamespaceForPrompt(catalog) {
	const scope = createMcpNamespaceScope(catalog);
	if (!scope) return [];
	const servers = Object.entries(scope).filter(([, value]) => isRecord(value) && typeof value.$serverName === "string").map(([key]) => key).toSorted();
	if (servers.length === 0) return [];
	return [
		"- MCP: MCP server tools grouped by server.",
		`Read API files such as mcp/index.d.ts and mcp/<server>.d.ts for TypeScript-style MCP headers; visible servers: ${servers.join(", ")}.`,
		"Call MCP tools as MCP.<server>.<tool>({ ...input }) with one object argument matching the header."
	];
}
/** Builds system-prompt text describing visible code-mode namespace globals. */
function describeCodeModeNamespacesForPrompt(ctx, catalog) {
	if (!catalog) return "";
	const registrations = filterRegistrationsByVisibleTools(catalog);
	const mcpPrompt = describeMcpNamespaceForPrompt(catalog);
	if (registrations.length === 0 && mcpPrompt.length === 0) return "";
	const lines = ["Registered namespace globals are available in code mode:"];
	lines.push(...mcpPrompt);
	for (const registration of registrations) {
		const description = registration.description?.trim();
		lines.push(description ? `- ${registration.globalName}: ${description}` : `- ${registration.globalName}`);
		const prompt = promptForRegistration(registration, ctx);
		if (prompt) lines.push(prompt);
	}
	return lines.join("\n");
}
function assertNamespacePathSegment(segment) {
	if (!segment || segment.includes(NAMESPACE_PATH_KEY_SEPARATOR) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(segment)) throw new Error(`Invalid code mode namespace path segment: ${segment || "(empty)"}`);
}
function namespacePathKey(path) {
	return path.join(NAMESPACE_PATH_KEY_SEPARATOR);
}
function serializeNamespaceScopeValue(value, path = [], stack = /* @__PURE__ */ new WeakSet(), callablePaths = /* @__PURE__ */ new Set()) {
	if (isCodeModeNamespaceToolCall(value)) {
		callablePaths.add(namespacePathKey(path));
		return {
			kind: "function",
			path
		};
	}
	if (typeof value === "function") throw new Error(`Code mode namespace function at ${path.join(".") || "(root)"} must be created with createCodeModeNamespaceTool.`);
	if (value === null || typeof value !== "object") return {
		kind: "value",
		value: toCodeModeJsonSafe(value)
	};
	if (stack.has(value)) throw new Error(`Circular code mode namespace scope at ${path.join(".") || "(root)"}.`);
	stack.add(value);
	try {
		if (Array.isArray(value)) return {
			kind: "array",
			items: value.map((item, index) => serializeNamespaceScopeValue(item, [...path, String(index)], stack, callablePaths))
		};
		const entries = [];
		for (const [key, child] of Object.entries(value)) {
			assertNamespacePathSegment(key);
			entries.push([key, serializeNamespaceScopeValue(child, [...path, key], stack, callablePaths)]);
		}
		return {
			kind: "object",
			entries
		};
	} finally {
		stack.delete(value);
	}
}
function resolveNamespacePath(scope, path) {
	let current = scope;
	let parent = void 0;
	for (const segment of path) {
		assertNamespacePathSegment(segment);
		parent = current;
		if (!isRecord(current) && !Array.isArray(current)) return {
			target: void 0,
			parent
		};
		current = current[segment];
	}
	return {
		target: current,
		parent
	};
}
function readScope(value, id) {
	if (!isRecord(value)) throw new Error(`Code mode namespace "${id}" createScope must return an object.`);
	return value;
}
/** Creates the runtime descriptor/invocation layer for visible namespaces. */
async function createCodeModeNamespaceRuntime(ctx, catalog = []) {
	const entries = [];
	const mcpEntry = createMcpNamespaceEntry(catalog);
	if (mcpEntry) entries.push(mcpEntry);
	for (const registration of listCodeModeNamespaces()) {
		if (!registrationHasVisibleRequiredTools(registration, catalog)) continue;
		const scope = readScope(await registration.createScope(ctx), registration.id);
		const callablePaths = /* @__PURE__ */ new Set();
		entries.push({
			registration,
			callablePaths,
			scope,
			descriptor: {
				id: registration.id,
				globalName: registration.globalName,
				...registration.description?.trim() ? { description: registration.description.trim() } : {},
				scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths)
			}
		});
	}
	const byId = new Map(entries.map((entry) => [entry.registration.id, entry]));
	return {
		descriptors: entries.map((entry) => entry.descriptor),
		async invoke(namespaceId, path, args, executeTool) {
			const entry = byId.get(namespaceId);
			if (!entry) throw new Error(`Unknown code mode namespace: ${namespaceId}`);
			for (const segment of path) assertNamespacePathSegment(segment);
			if (!entry.callablePaths.has(namespacePathKey(path))) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const { target } = resolveNamespacePath(entry.scope, path);
			if (!isCodeModeNamespaceToolCall(target)) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const input = target.input ? await target.input(args) : args[0] ?? {};
			if (target.local) return toCodeModeJsonSafe(input);
			if (!target.catalogId && !entry.registration.requiredToolNames.includes(target.toolName)) throw new Error(`Code mode namespace path targets undeclared tool: ${target.toolName}`);
			return toCodeModeJsonSafe(await executeTool({
				pluginId: entry.registration.pluginId,
				toolName: target.toolName,
				...target.catalogId ? { catalogId: target.catalogId } : {},
				input,
				namespaceId,
				path: [...path]
			}));
		}
	};
}
//#endregion
//#region src/plugin-state/runtime-health-store.ts
const currentProcessToken = randomUUID();
function hasValidEnvelope(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.processId === "number" && Number.isInteger(record.processId) && record.processId > 0 && typeof record.processToken === "string" && record.processToken.length > 0 && (record.processStartTime === null || typeof record.processStartTime === "number" && Number.isFinite(record.processStartTime) && record.processStartTime >= 0) && typeof record.failedAtMs === "number" && Number.isFinite(record.failedAtMs);
}
/** Builds the common health envelope for records owned by this process. */
function createRuntimeHealthRecordEnvelope(failedAt) {
	return {
		processId: process.pid,
		processToken: currentProcessToken,
		processStartTime: getProcessStartTime(process.pid),
		failedAtMs: failedAt.getTime()
	};
}
function processLooksLive(record) {
	if (record.processId === process.pid) return record.processToken === currentProcessToken;
	const currentStartTime = getProcessStartTime(record.processId);
	return currentStartTime !== null && currentStartTime === record.processStartTime;
}
/** Opens a SQLite-backed health record namespace shared across runtime processes. */
function createRuntimeHealthStore(options) {
	const openStore = () => createCorePluginStateSyncKeyedStore({
		ownerId: options.ownerId,
		namespace: options.namespace,
		maxEntries: options.maxEntries,
		...options.ttlMs != null ? { defaultTtlMs: options.ttlMs } : {}
	});
	const normalize = (value) => hasValidEnvelope(value) ? options.normalizeRecord(value) : void 0;
	return {
		register(key, record) {
			openStore().register(key, record);
		},
		list() {
			try {
				const byGroup = /* @__PURE__ */ new Map();
				for (const entry of openStore().entries()) {
					const record = normalize(entry.value);
					if (!record || !processLooksLive(record)) continue;
					const groupKey = options.displayKey(record);
					const existing = byGroup.get(groupKey);
					if (!existing || (options.pick === "latest" ? record.failedAtMs > existing.failedAtMs : record.failedAtMs < existing.failedAtMs)) byGroup.set(groupKey, record);
				}
				return [...byGroup.values()];
			} catch {
				return [];
			}
		},
		clearForProcess(processId, matches) {
			try {
				const store = openStore();
				for (const entry of store.entries()) {
					const record = normalize(entry.value);
					if (record?.processId === processId && (!matches || matches(record))) store.delete(entry.key);
				}
			} catch {}
		}
	};
}
//#endregion
//#region src/context-engine/quarantine-health.ts
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
const quarantineStore = createRuntimeHealthStore({
	ownerId: "core:context-engine-quarantine-health",
	namespace: "runtime-quarantines",
	maxEntries: 64,
	normalizeRecord: (value) => {
		if (!isNonEmptyString(value.engineId) || !isNonEmptyString(value.operation) || !isNonEmptyString(value.reason)) return;
		return {
			engineId: value.engineId,
			operation: value.operation,
			reason: value.reason,
			failedAtMs: value.failedAtMs,
			processId: value.processId,
			processToken: value.processToken,
			processStartTime: value.processStartTime,
			...isNonEmptyString(value.owner) ? { owner: value.owner } : {}
		};
	},
	displayKey: (record) => record.engineId,
	pick: "earliest"
});
function recordKey(record) {
	return JSON.stringify([record.engineId, record.processId]);
}
function recordPersistedContextEngineQuarantine(quarantine) {
	const record = {
		engineId: quarantine.engineId,
		operation: quarantine.operation,
		reason: quarantine.reason,
		...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
		...quarantine.owner ? { owner: quarantine.owner } : {}
	};
	quarantineStore.register(recordKey(record), record);
}
function listPersistedContextEngineQuarantines() {
	return quarantineStore.list().map((record) => {
		const quarantine = {
			engineId: record.engineId,
			operation: record.operation,
			reason: record.reason,
			failedAt: new Date(record.failedAtMs)
		};
		if (record.owner) quarantine.owner = record.owner;
		return quarantine;
	});
}
function clearPersistedContextEngineQuarantineForProcess(engineId, processId) {
	quarantineStore.clearForProcess(processId, engineId === void 0 ? void 0 : (record) => record.engineId === engineId);
}
//#endregion
//#region src/context-engine/registry.ts
const LEGACY_SESSION_KEY_COMPAT = Symbol.for("openclaw.contextEngine.sessionKeyCompat");
const RESOLVED_CONTEXT_ENGINE_METADATA = /* @__PURE__ */ new WeakMap();
const RUNTIME_QUARANTINE_PROXY_STATE = /* @__PURE__ */ new WeakMap();
const SESSION_KEY_COMPAT_METHODS = [
	"bootstrap",
	"maintain",
	"ingest",
	"ingestBatch",
	"afterTurn",
	"assemble",
	"compact"
];
const LEGACY_COMPAT_METHOD_KEYS = {
	bootstrap: [
		"sessionKey",
		"runtimeSettings",
		"sessionTarget",
		"runtimeContext"
	],
	maintain: [
		"sessionKey",
		"runtimeSettings",
		"sessionTarget",
		"runtimeContext"
	],
	ingest: ["sessionKey"],
	ingestBatch: ["sessionKey"],
	afterTurn: [
		"sessionKey",
		"runtimeSettings",
		"sessionTarget",
		"runtimeContext"
	],
	assemble: [
		"sessionKey",
		"prompt",
		"runtimeSettings"
	],
	compact: [
		"sessionKey",
		"runtimeSettings",
		"sessionTarget",
		"runtimeContext"
	]
};
function isSessionKeyCompatMethodName(value) {
	return isStringOption(value, SESSION_KEY_COMPAT_METHODS);
}
function hasOwnLegacyCompatKey(params, key) {
	return params !== null && typeof params === "object" && Object.hasOwn(params, key);
}
function withoutLegacyCompatKeys(params, keys) {
	const legacyParams = { ...params };
	for (const key of keys) delete legacyParams[key];
	return legacyParams;
}
function issueRejectsLegacyCompatKeyStrictly(issue, key) {
	if (!issue || typeof issue !== "object") return false;
	const issueRecord = issue;
	if (issueRecord.code === "unrecognized_keys" && Array.isArray(issueRecord.keys) && issueRecord.keys.some((issueKey) => issueKey === key)) return true;
	return isLegacyCompatErrorForKey(issueRecord.message, key);
}
function* iterateErrorChain(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current !== void 0 && current !== null && !seen.has(current)) {
		yield current;
		seen.add(current);
		if (typeof current !== "object") break;
		current = current.cause;
	}
}
const LEGACY_UNKNOWN_FIELD_PATTERNS = {
	sessionKey: [
		/\bunrecognized key(?:\(s\)|s)? in object:.*['"`]sessionKey['"`]/i,
		/\badditional propert(?:y|ies)\b.*['"`]sessionKey['"`]/i,
		/\bmust not have additional propert(?:y|ies)\b.*['"`]sessionKey['"`]/i,
		/\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionKey['"`]/i,
		/\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionKey['"`]/i,
		/['"`]sessionKey['"`].*\b(?:was|is)\s+not allowed\b/i,
		/"code"\s*:\s*"unrecognized_keys"[^]*"sessionKey"/i
	],
	prompt: [
		/\bunrecognized key(?:\(s\)|s)? in object:.*['"`]prompt['"`]/i,
		/\badditional propert(?:y|ies)\b.*['"`]prompt['"`]/i,
		/\bmust not have additional propert(?:y|ies)\b.*['"`]prompt['"`]/i,
		/\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]prompt['"`]/i,
		/\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]prompt['"`]/i,
		/['"`]prompt['"`].*\b(?:was|is)\s+not allowed\b/i,
		/"code"\s*:\s*"unrecognized_keys"[^]*"prompt"/i
	],
	runtimeSettings: [
		/\bunrecognized key(?:\(s\)|s)? in object:.*['"`]runtimeSettings['"`]/i,
		/\badditional propert(?:y|ies)\b.*['"`]runtimeSettings['"`]/i,
		/\bmust not have additional propert(?:y|ies)\b.*['"`]runtimeSettings['"`]/i,
		/\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeSettings['"`]/i,
		/\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeSettings['"`]/i,
		/['"`]runtimeSettings['"`].*\b(?:was|is)\s+not allowed\b/i,
		/"code"\s*:\s*"unrecognized_keys"[^]*"runtimeSettings"/i
	],
	sessionTarget: [
		/\bunrecognized key(?:\(s\)|s)? in object:.*['"`]sessionTarget['"`]/i,
		/\badditional propert(?:y|ies)\b.*['"`]sessionTarget['"`]/i,
		/\bmust not have additional propert(?:y|ies)\b.*['"`]sessionTarget['"`]/i,
		/\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionTarget['"`]/i,
		/\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionTarget['"`]/i,
		/['"`]sessionTarget['"`].*\b(?:was|is)\s+not allowed\b/i,
		/"code"\s*:\s*"unrecognized_keys"[^]*"sessionTarget"/i
	],
	runtimeContext: [
		/\bunrecognized key(?:\(s\)|s)? in object:.*['"`]runtimeContext['"`]/i,
		/\badditional propert(?:y|ies)\b.*['"`]runtimeContext['"`]/i,
		/\bmust not have additional propert(?:y|ies)\b.*['"`]runtimeContext['"`]/i,
		/\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeContext['"`]/i,
		/\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeContext['"`]/i,
		/['"`]runtimeContext['"`].*\b(?:was|is)\s+not allowed\b/i,
		/"code"\s*:\s*"unrecognized_keys"[^]*"runtimeContext"/i
	]
};
function isLegacyCompatUnknownFieldValidationMessage(message, key) {
	return LEGACY_UNKNOWN_FIELD_PATTERNS[key].some((pattern) => pattern.test(message));
}
function isLegacyCompatErrorForKey(error, key) {
	for (const candidate of iterateErrorChain(error)) {
		if (Array.isArray(candidate)) {
			if (candidate.some((entry) => issueRejectsLegacyCompatKeyStrictly(entry, key))) return true;
			continue;
		}
		if (typeof candidate === "string") {
			if (isLegacyCompatUnknownFieldValidationMessage(candidate, key)) return true;
			continue;
		}
		if (!candidate || typeof candidate !== "object") continue;
		const issueContainer = candidate;
		if (Array.isArray(issueContainer.issues) && issueContainer.issues.some((issue) => issueRejectsLegacyCompatKeyStrictly(issue, key))) return true;
		if (Array.isArray(issueContainer.errors) && issueContainer.errors.some((issue) => issueRejectsLegacyCompatKeyStrictly(issue, key))) return true;
		if (typeof issueContainer.message === "string" && isLegacyCompatUnknownFieldValidationMessage(issueContainer.message, key)) return true;
	}
	return false;
}
function detectRejectedLegacyCompatKeys(error, allowedKeys) {
	const rejectedKeys = /* @__PURE__ */ new Set();
	for (const key of allowedKeys) if (isLegacyCompatErrorForKey(error, key)) rejectedKeys.add(key);
	return rejectedKeys;
}
async function invokeWithLegacyCompat(method, params, allowedKeys, opts) {
	const activeRejectedKeys = new Set(opts?.rejectedKeys ?? []);
	const availableKeys = allowedKeys.filter((key) => hasOwnLegacyCompatKey(params, key));
	if (availableKeys.length === 0) return await method(params);
	let currentParams = activeRejectedKeys.size > 0 ? withoutLegacyCompatKeys(params, activeRejectedKeys) : params;
	try {
		return await method(currentParams);
	} catch (error) {
		let currentError = error;
		while (true) {
			const rejectedKeys = detectRejectedLegacyCompatKeys(currentError, availableKeys);
			let learnedNewKey = false;
			for (const key of rejectedKeys) if (!activeRejectedKeys.has(key)) {
				activeRejectedKeys.add(key);
				learnedNewKey = true;
			}
			if (!learnedNewKey) throw currentError;
			opts?.onLegacyModeDetected?.();
			opts?.onLegacyKeysDetected?.(rejectedKeys);
			currentParams = withoutLegacyCompatKeys(params, activeRejectedKeys);
			try {
				return await method(currentParams);
			} catch (retryError) {
				currentError = retryError;
			}
		}
	}
}
function wrapContextEngineWithSessionKeyCompat(engine) {
	if (engine[LEGACY_SESSION_KEY_COMPAT]) return engine;
	const rejectedKeys = /* @__PURE__ */ new Set();
	return new Proxy(engine, { get(target, property, receiver) {
		if (property === LEGACY_SESSION_KEY_COMPAT) return true;
		const value = Reflect.get(target, property, receiver);
		if (typeof value !== "function") return value;
		if (!isSessionKeyCompatMethodName(property)) return value.bind(target);
		return (params) => {
			const method = value.bind(target);
			const allowedKeys = LEGACY_COMPAT_METHOD_KEYS[property];
			return invokeWithLegacyCompat(method, params, allowedKeys, {
				onLegacyKeysDetected: (keys) => {
					for (const key of keys) rejectedKeys.add(key);
				},
				rejectedKeys
			});
		};
	} });
}
function wrapResolvedContextEngine(engine, metadata) {
	const compatWrapped = wrapContextEngineWithSessionKeyCompat(engine);
	const wrapped = metadata.defaultEngineId && metadata.factoryCtx && metadata.engineId !== metadata.defaultEngineId ? wrapContextEngineWithRuntimeQuarantine({
		engine: compatWrapped,
		engineId: metadata.engineId,
		owner: metadata.owner,
		defaultEngineId: metadata.defaultEngineId,
		factoryCtx: metadata.factoryCtx
	}) : compatWrapped;
	RESOLVED_CONTEXT_ENGINE_METADATA.set(wrapped, metadata);
	return wrapped;
}
const CONTEXT_ENGINE_REGISTRY_STATE = Symbol.for("openclaw.contextEngineRegistryState");
const CORE_CONTEXT_ENGINE_OWNER = "core";
const contextEngineRegistryState = resolveGlobalSingleton(CONTEXT_ENGINE_REGISTRY_STATE, () => ({
	engines: /* @__PURE__ */ new Map(),
	quarantinedEngines: /* @__PURE__ */ new Map()
}));
function getContextEngineRegistryState() {
	return contextEngineRegistryState;
}
function requireContextEngineOwner(owner) {
	const normalizedOwner = owner.trim();
	if (!normalizedOwner) throw new Error(`registerContextEngineForOwner: owner must be a non-empty string, got ${JSON.stringify(owner)}`);
	return normalizedOwner;
}
function formatContextEngineError(error) {
	return error instanceof Error ? error.message : String(error);
}
function recordContextEngineQuarantine(params) {
	const registryState = getContextEngineRegistryState();
	const existing = registryState.quarantinedEngines.get(params.engineId);
	if (existing) return existing;
	const quarantine = {
		engineId: params.engineId,
		operation: params.operation,
		reason: formatContextEngineError(params.error),
		failedAt: /* @__PURE__ */ new Date(),
		...params.owner ? { owner: params.owner } : {}
	};
	registryState.quarantinedEngines.set(params.engineId, quarantine);
	try {
		recordPersistedContextEngineQuarantine(quarantine);
	} catch {}
	const ownerSuffix = params.owner ? ` owner=${sanitizeForLog(params.owner)}` : "";
	console.error(`[context-engine] Context engine "${sanitizeForLog(params.engineId)}"${ownerSuffix} failed during ${sanitizeForLog(params.operation)}: ${sanitizeForLog(quarantine.reason)}; quarantining it for this process and falling back to default engine "${params.defaultEngineId}".`);
	return quarantine;
}
function getContextEngineQuarantine(engineId) {
	return getContextEngineRegistryState().quarantinedEngines.get(engineId);
}
function listContextEngineQuarantines() {
	const quarantines = [];
	for (const entry of getContextEngineRegistryState().quarantinedEngines.values()) {
		const quarantine = {
			engineId: entry.engineId,
			operation: entry.operation,
			reason: entry.reason,
			failedAt: new Date(entry.failedAt)
		};
		if (entry.owner) quarantine.owner = entry.owner;
		quarantines.push(quarantine);
	}
	const seenEngineIds = new Set(quarantines.map((entry) => entry.engineId));
	for (const entry of listPersistedContextEngineQuarantines()) {
		if (seenEngineIds.has(entry.engineId)) continue;
		quarantines.push(entry);
		seenEngineIds.add(entry.engineId);
	}
	return quarantines;
}
function clearContextEngineRuntimeQuarantine(engineId) {
	const quarantinedEngines = getContextEngineRegistryState().quarantinedEngines;
	if (engineId === void 0) {
		quarantinedEngines.clear();
		clearPersistedContextEngineQuarantineForProcess(void 0, process.pid);
		return;
	}
	quarantinedEngines.delete(engineId);
	clearPersistedContextEngineQuarantineForProcess(engineId, process.pid);
}
/**
* Register a context engine implementation under an explicit trusted owner.
*/
function registerContextEngineForOwner(id, factory, owner, opts) {
	const normalizedOwner = requireContextEngineOwner(owner);
	const lifecycle = opts?.lifecycle ?? "runtime";
	const registry = getContextEngineRegistryState().engines;
	const existing = registry.get(id);
	if (id === defaultSlotIdForKey("contextEngine") && normalizedOwner !== CORE_CONTEXT_ENGINE_OWNER) return {
		ok: false,
		existingOwner: CORE_CONTEXT_ENGINE_OWNER
	};
	if (existing && existing.owner !== normalizedOwner) return {
		ok: false,
		existingOwner: existing.owner
	};
	if (existing?.lifecycle === "runtime" && lifecycle === "readOnlyDiscovery") return { ok: true };
	if (existing && opts?.allowSameOwnerRefresh !== true) return {
		ok: false,
		existingOwner: existing.owner
	};
	registry.set(id, {
		factory,
		owner: normalizedOwner,
		lifecycle
	});
	if (lifecycle === "runtime") clearContextEngineRuntimeQuarantine(id);
	return { ok: true };
}
/** Returns registration metadata so callers can distinguish discovery snapshots from runtime entries. */
function getContextEngineRegistration(id) {
	return getContextEngineRegistryState().engines.get(id);
}
/**
* List all registered engine ids.
*/
function listContextEngineIds() {
	return [...getContextEngineRegistryState().engines.keys()];
}
function clearContextEnginesForOwner(owner) {
	const normalizedOwner = requireContextEngineOwner(owner);
	const registry = getContextEngineRegistryState().engines;
	for (const [id, entry] of registry.entries()) if (entry.owner === normalizedOwner) {
		registry.delete(id);
		clearContextEngineRuntimeQuarantine(id);
	}
}
/**
* Return the trusted plugin id that registered a resolved context engine.
*/
function resolveContextEngineOwnerPluginId(engine) {
	if (!engine) return;
	const owner = resolveEffectiveContextEngineMetadata(engine)?.owner;
	if (!owner?.startsWith("plugin:")) return;
	return owner.slice(7).trim() || void 0;
}
function resolveEffectiveContextEngineMetadata(engine) {
	const quarantineState = RUNTIME_QUARANTINE_PROXY_STATE.get(engine);
	if (quarantineState && getContextEngineQuarantine(quarantineState.engineId)) {
		const fallbackEngine = quarantineState.getResolvedFallbackEngine();
		return (fallbackEngine ? RESOLVED_CONTEXT_ENGINE_METADATA.get(fallbackEngine) : void 0) ?? { owner: CORE_CONTEXT_ENGINE_OWNER };
	}
	return RESOLVED_CONTEXT_ENGINE_METADATA.get(engine);
}
function describeResolvedContextEngineContractError(engineId, engine) {
	if (!engine || typeof engine !== "object") return `Context engine "${engineId}" factory returned ${JSON.stringify(engine)} instead of a ContextEngine object.`;
	const candidate = engine;
	const issues = [];
	const info = candidate.info;
	if (!info || typeof info !== "object") issues.push("missing info");
	else {
		const infoRecord = info;
		if (!(typeof infoRecord.id === "string" ? infoRecord.id.trim() : "")) issues.push("missing info.id");
		if (typeof infoRecord.name !== "string" || !infoRecord.name.trim()) issues.push("missing info.name");
	}
	if (typeof candidate.ingest !== "function") issues.push("missing ingest()");
	if (typeof candidate.assemble !== "function") issues.push("missing assemble()");
	if (typeof candidate.compact !== "function") issues.push("missing compact()");
	if (issues.length === 0) return null;
	return `Context engine "${engineId}" factory returned an invalid ContextEngine: ${issues.join(", ")}.`;
}
const GUARDED_CONTEXT_ENGINE_METHODS = /* @__PURE__ */ new Set([
	"bootstrap",
	"maintain",
	"ingest",
	"ingestBatch",
	"afterTurn",
	"assemble",
	"compact",
	"prepareSubagentSpawn",
	"onSubagentEnded"
]);
function contextEngineFallbackResult(methodName) {
	switch (methodName) {
		case "bootstrap": return {
			bootstrapped: false,
			reason: "context engine downgraded to legacy"
		};
		case "maintain": return {
			changed: false,
			bytesFreed: 0,
			rewrittenEntries: 0,
			reason: "context engine downgraded to legacy"
		};
		case "ingest": return { ingested: false };
		case "ingestBatch": return { ingestedCount: 0 };
		case "afterTurn":
		case "prepareSubagentSpawn":
		case "onSubagentEnded": return;
		case "assemble":
		case "compact": throw new Error(`No legacy fallback result for ${methodName}`);
	}
}
function contextEngineAbortSignal(methodParams) {
	if (!methodParams || typeof methodParams !== "object") return;
	const signal = methodParams.abortSignal;
	if (signal && typeof signal === "object" && "aborted" in signal) return signal;
}
function contextEngineAbortError(methodParams) {
	const signal = contextEngineAbortSignal(methodParams);
	if (!signal?.aborted) return;
	const reason = signal.reason;
	if (reason instanceof Error) return reason;
	return createAbortError(typeof reason === "string" && reason ? reason : "Context engine operation aborted.");
}
function isContextEngineAbortRejection(error, methodParams) {
	const signal = contextEngineAbortSignal(methodParams);
	if (!signal?.aborted) return false;
	if (error === signal.reason) return true;
	if (error instanceof Error) {
		const message = error.message.toLowerCase();
		return error.name === "AbortError" || message.includes("abort") || message.includes("cancelled") || message.includes("canceled");
	}
	return typeof error === "string" && /abort|cancelled|canceled/iu.test(error);
}
async function invokeFallbackContextEngineMethod(params) {
	const fallbackEngine = await params.getFallbackEngine();
	const fallbackMethod = fallbackEngine[params.methodName];
	if (typeof fallbackMethod === "function") return await fallbackMethod.call(fallbackEngine, params.methodParams);
	return contextEngineFallbackResult(params.methodName);
}
function wrapContextEngineWithRuntimeQuarantine(params) {
	let fallbackEnginePromise;
	let resolvedFallbackEngine;
	const getFallbackEngine = () => {
		fallbackEnginePromise ??= resolveDefaultContextEngine(params.defaultEngineId, params.factoryCtx).then((engine) => {
			resolvedFallbackEngine = engine;
			return engine;
		});
		return fallbackEnginePromise;
	};
	const fallbackInfo = () => {
		return resolvedFallbackEngine?.info ?? {
			id: params.defaultEngineId,
			name: params.defaultEngineId === "legacy" ? "Legacy Context Engine" : `${params.defaultEngineId} Context Engine`
		};
	};
	const isQuarantined = () => Boolean(getContextEngineQuarantine(params.engineId));
	const proxy = new Proxy(params.engine, { get(target, property, receiver) {
		if (property === "info" && isQuarantined()) return fallbackInfo();
		const value = Reflect.get(target, property, receiver);
		if (typeof value !== "function" || !GUARDED_CONTEXT_ENGINE_METHODS.has(property)) return typeof value === "function" ? value.bind(target) : value;
		const methodName = property;
		return async (methodParams) => {
			const aborted = contextEngineAbortError(methodParams);
			if (aborted) throw aborted;
			if (isQuarantined()) return await invokeFallbackContextEngineMethod({
				getFallbackEngine,
				methodName,
				methodParams
			});
			try {
				return await value.call(target, methodParams);
			} catch (error) {
				if (isContextEngineAbortRejection(error, methodParams)) throw error;
				recordContextEngineQuarantine({
					engineId: params.engineId,
					owner: params.owner,
					operation: methodName,
					error,
					defaultEngineId: params.defaultEngineId
				});
				if (methodName === "compact" || methodName === "prepareSubagentSpawn") throw error;
				try {
					return await invokeFallbackContextEngineMethod({
						getFallbackEngine,
						methodName,
						methodParams
					});
				} catch {
					throw error;
				}
			}
		};
	} });
	RUNTIME_QUARANTINE_PROXY_STATE.set(proxy, {
		engineId: params.engineId,
		getResolvedFallbackEngine: () => resolvedFallbackEngine
	});
	return proxy;
}
/**
* Resolve which ContextEngine to use based on plugin slot configuration.
*
* Resolution order:
*   1. `config.plugins.slots.contextEngine` (explicit slot override)
*   2. Default slot value ("legacy")
*
* When `config` is provided it is forwarded to the factory as part of a
* {@link ContextEngineFactoryContext}. Additional runtime paths can be
* supplied via `options`. Existing no-arg factories continue to work
* because JavaScript permits extra arguments at call sites.
*
* Non-default engines that fail (unregistered, factory throw, or contract
* violation) are logged and silently replaced by the default engine.
* Throws only when the default engine itself cannot be resolved.
*/
async function resolveContextEngine(config, options) {
	const slotValue = config?.plugins?.slots?.contextEngine;
	const engineId = typeof slotValue === "string" && slotValue.trim() ? slotValue.trim() : defaultSlotIdForKey("contextEngine");
	const defaultEngineId = defaultSlotIdForKey("contextEngine");
	const isDefaultEngine = engineId === defaultEngineId;
	const factoryCtx = {
		config,
		agentDir: options?.agentDir,
		workspaceDir: options?.workspaceDir
	};
	if (!isDefaultEngine ? getContextEngineQuarantine(engineId) : void 0) return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	const entry = getContextEngineRegistryState().engines.get(engineId);
	if (!entry) {
		if (isDefaultEngine) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
		recordContextEngineQuarantine({
			engineId,
			operation: "resolve",
			error: "not registered",
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	if (!isDefaultEngine && entry.lifecycle === "readOnlyDiscovery") {
		console.warn(`[context-engine] Context engine "${engineId}" owner=${entry.owner} is registered for read-only discovery only; falling back to default engine "${defaultEngineId}" without quarantine until runtime activation registers it.`);
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	let engine;
	try {
		engine = await entry.factory(factoryCtx);
	} catch (factoryError) {
		if (isDefaultEngine) throw factoryError;
		recordContextEngineQuarantine({
			engineId,
			owner: entry.owner,
			operation: "factory",
			error: factoryError,
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	let contractError;
	try {
		contractError = describeResolvedContextEngineContractError(engineId, engine);
	} catch (validationError) {
		if (isDefaultEngine) throw validationError;
		recordContextEngineQuarantine({
			engineId,
			owner: entry.owner,
			operation: "contract-validation",
			error: validationError,
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	if (contractError) {
		if (isDefaultEngine) throw new Error(contractError);
		recordContextEngineQuarantine({
			engineId,
			owner: entry.owner,
			operation: "contract-validation",
			error: contractError,
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	return wrapResolvedContextEngine(engine, {
		owner: entry.owner,
		engineId,
		defaultEngineId,
		factoryCtx
	});
}
/**
* Resolve the default context engine as a last-resort fallback.
*
* This helper is intentionally strict: if the default engine itself fails,
* there is no further fallback and the error must propagate.
*/
async function resolveDefaultContextEngine(defaultEngineId, factoryCtx) {
	const defaultEntry = getContextEngineRegistryState().engines.get(defaultEngineId);
	if (!defaultEntry) throw new Error(`[context-engine] fallback failed: default engine "${defaultEngineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
	const engine = await defaultEntry.factory(factoryCtx);
	const contractError = describeResolvedContextEngineContractError(defaultEngineId, engine);
	if (contractError) throw new Error(`[context-engine] ${contractError}`);
	return wrapResolvedContextEngine(engine, {
		owner: defaultEntry.owner,
		engineId: defaultEngineId
	});
}
//#endregion
//#region src/plugins/agent-event-emission.ts
const HOST_OWNED_AGENT_EVENT_STREAMS = /* @__PURE__ */ new Set([
	"lifecycle",
	"tool",
	"assistant",
	"error",
	"item",
	"plan",
	"approval",
	"command_output",
	"patch",
	"compaction",
	"thinking",
	"model"
]);
function isPluginOwnedAgentEventStream(pluginId, stream) {
	return stream === pluginId || stream.startsWith(`${pluginId}.`);
}
function normalizePluginEventData(params) {
	if (params.data && typeof params.data === "object" && !Array.isArray(params.data)) return {
		...params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
	return {
		value: params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
}
function emitPluginAgentEvent(params) {
	const runId = normalizeOptionalString(params.event.runId);
	const sessionKey = normalizeOptionalString(params.event.sessionKey);
	const stream = normalizeOptionalString(params.event.stream);
	if (!runId || !stream) return {
		emitted: false,
		reason: "runId and stream are required"
	};
	if (!isPluginJsonValue(params.event.data)) return {
		emitted: false,
		reason: "event data must be JSON-compatible"
	};
	if (params.origin !== "bundled" && HOST_OWNED_AGENT_EVENT_STREAMS.has(stream)) return {
		emitted: false,
		reason: `stream ${stream} is reserved for bundled plugins`
	};
	if (params.origin !== "bundled" && !isPluginOwnedAgentEventStream(params.pluginId, stream)) return {
		emitted: false,
		reason: `stream ${stream} must be scoped to plugin ${params.pluginId}`
	};
	emitAgentEvent({
		runId,
		stream,
		...sessionKey ? { sessionKey } : {},
		data: normalizePluginEventData({
			pluginId: params.pluginId,
			pluginName: params.pluginName,
			data: params.event.data
		})
	});
	return {
		emitted: true,
		stream
	};
}
//#endregion
//#region src/plugins/host-hook-attachments.ts
const DEFAULT_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;
/** Filesystem adapter used by attachment MIME probes and tests. */
const attachmentProbeFs = { open: (...args) => fsPromises.open(...args) };
const MAX_ATTACHMENT_FILES = 10;
const loadSendMessage = createLazyRuntimeModule(() => import("./message-DfptLn0C.js").then((module) => module.sendMessage));
const loadGetChannelPlugin = createLazyRuntimeModule(() => import("./plugins-B002eaXp.js").then((module) => module.getChannelPlugin));
function captionFormatToParseMode(captionFormat) {
	if (captionFormat === "html") return "HTML";
}
function escapeHtmlText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function normalizeOptionalThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return normalizeOptionalString(value);
}
async function readMimeSniffBuffer(filePath, size) {
	let handle;
	try {
		handle = await attachmentProbeFs.open(filePath, "r");
		const length = Math.min(Math.max(0, size), FILE_TYPE_SNIFF_MAX_BYTES);
		const buffer = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buffer, 0, length, 0);
		return buffer.subarray(0, bytesRead);
	} catch (error) {
		return { error: `attachment file MIME read failed for ${filePath}: ${formatErrorMessage(error)}` };
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
/** Resolves portable attachment delivery options while honoring shipped channel-specific hints. */
function resolveAttachmentDelivery(params) {
	const fallbackParseMode = captionFormatToParseMode(params.captionFormat);
	const channel = params.channel.trim().toLowerCase();
	const hints = params.channelHints;
	const legacyTelegram = channel === "telegram" ? hints?.telegram : void 0;
	const legacySlack = channel === "slack" ? hints?.slack : void 0;
	const parseMode = hints?.parseMode ?? legacyTelegram?.parseMode ?? (channel === "telegram" && params.captionFormat === "plain" ? "HTML" : fallbackParseMode);
	const escapePlainHtmlCaption = params.captionFormat === "plain" && parseMode === "HTML";
	const silent = hints?.silent ?? legacyTelegram?.disableNotification;
	const forceDocumentMime = normalizeMimeType(hints?.forceDocumentMime ?? legacyTelegram?.forceDocumentMime);
	const threadId = normalizeOptionalThreadId(hints?.threadId) ?? normalizeOptionalString(legacySlack?.threadTs);
	return {
		...parseMode ? { parseMode } : {},
		...escapePlainHtmlCaption ? { escapePlainHtmlCaption: true } : {},
		...silent !== void 0 ? { silent } : {},
		...forceDocumentMime ? { forceDocumentMime } : {},
		...threadId !== void 0 ? { threadId } : {}
	};
}
async function validateAttachmentFiles(files, maxBytes, options) {
	if (files.length > MAX_ATTACHMENT_FILES) return { error: `at most ${MAX_ATTACHMENT_FILES} attachment files are allowed` };
	const paths = [];
	let totalBytes = 0;
	for (const file of files) {
		if (!file || typeof file !== "object" || Array.isArray(file)) return { error: "attachment file entry must be an object" };
		const filePath = normalizeOptionalString(file.path);
		if (!filePath) return { error: "attachment file path is required" };
		const resolvedPath = resolveAttachmentFilePath({
			filePath,
			config: options?.config,
			sessionKey: options?.sessionKey
		});
		const info = await lstat(resolvedPath).catch(() => void 0);
		if (info?.isSymbolicLink()) return { error: `attachment file symlinks are not allowed: ${resolvedPath}` };
		if (!info?.isFile()) return { error: `attachment file not found: ${resolvedPath}` };
		if (info.size > maxBytes) return { error: `attachment file exceeds ${maxBytes} bytes: ${resolvedPath}` };
		if (options?.forceDocumentMime) {
			const fileBuffer = await readMimeSniffBuffer(resolvedPath, info.size);
			if (!Buffer.isBuffer(fileBuffer)) return fileBuffer;
			let detectedMime;
			try {
				detectedMime = normalizeMimeType(await detectMime({ buffer: fileBuffer }));
			} catch (error) {
				return { error: `attachment file MIME detection failed for ${filePath}: ` + formatErrorMessage(error) };
			}
			if (detectedMime !== options.forceDocumentMime) return { error: `attachment file MIME mismatch for ${resolvedPath}: expected ${options.forceDocumentMime}, got ${detectedMime ?? "unknown"}` };
		}
		totalBytes += info.size;
		if (totalBytes > maxBytes) return { error: `attachment files exceed ${maxBytes} bytes total` };
		paths.push(resolvedPath);
	}
	return paths;
}
function resolveAttachmentFilePath(params) {
	const workspaceDir = params.sessionKey && params.config ? resolveAgentWorkspaceDir(params.config, resolveAgentIdFromSessionKey(params.sessionKey)) : void 0;
	return resolvePathFromInput(params.filePath, resolveWorkspaceRoot(workspaceDir));
}
/** Resolves the thread id used when delivering a plugin session attachment. */
function resolveSessionAttachmentThreadId(params) {
	return normalizeOptionalThreadId(params.hintThreadId) ?? normalizeOptionalThreadId(params.explicitThreadId) ?? normalizeOptionalThreadId(params.fallbackThreadId) ?? normalizeOptionalThreadId(params.deliveryThreadId);
}
/** Sends a bundled-plugin session attachment through the session's active delivery route. */
async function sendPluginSessionAttachment(params) {
	if (params.origin !== "bundled") return {
		ok: false,
		error: "session attachments are restricted to bundled plugins"
	};
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return {
		ok: false,
		error: "sessionKey is required"
	};
	if (!Array.isArray(params.files) || params.files.length === 0) return {
		ok: false,
		error: "at least one attachment file is required"
	};
	const maxBytes = typeof params.maxBytes === "number" && Number.isFinite(params.maxBytes) ? Math.min(DEFAULT_ATTACHMENT_MAX_BYTES, Math.max(1, Math.floor(params.maxBytes))) : DEFAULT_ATTACHMENT_MAX_BYTES;
	const { deliveryContext, threadId } = extractDeliveryInfo(sessionKey, { cfg: params.config });
	if (!deliveryContext?.channel || !deliveryContext.to) return {
		ok: false,
		error: `session has no active delivery route: ${sessionKey}`
	};
	const normalizedChannel = normalizeMessageChannel(deliveryContext.channel);
	try {
		if ((normalizedChannel && isDeliverableMessageChannel(normalizedChannel) ? (await loadGetChannelPlugin())(normalizedChannel) : void 0)?.outbound?.deliveryMode === "gateway") return {
			ok: false,
			error: `session attachments require direct outbound delivery for channel ${deliveryContext.channel}; channel uses gateway delivery`
		};
	} catch (error) {
		return {
			ok: false,
			error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
		};
	}
	const rawText = normalizeOptionalString(params.text) ?? "";
	const resolvedDelivery = resolveAttachmentDelivery({
		channel: deliveryContext.channel,
		captionFormat: params.captionFormat,
		channelHints: params.channelHints
	});
	const validated = await validateAttachmentFiles(params.files, maxBytes, {
		forceDocumentMime: resolvedDelivery.forceDocumentMime,
		config: params.config,
		sessionKey
	});
	if (!Array.isArray(validated)) return {
		ok: false,
		error: validated.error
	};
	const resolvedThreadId = resolveSessionAttachmentThreadId({
		deliveryThreadId: deliveryContext.threadId,
		explicitThreadId: params.threadId,
		fallbackThreadId: threadId,
		hintThreadId: resolvedDelivery.threadId
	});
	let result;
	try {
		result = await (await loadSendMessage())({
			to: deliveryContext.to,
			content: resolvedDelivery.escapePlainHtmlCaption ? escapeHtmlText(rawText) : rawText,
			channel: deliveryContext.channel,
			accountId: deliveryContext.accountId,
			threadId: resolvedThreadId,
			requesterSessionKey: sessionKey,
			mediaUrls: validated,
			forceDocument: resolvedDelivery.forceDocumentMime ? true : params.forceDocument,
			bestEffort: false,
			cfg: params.config,
			...resolvedDelivery.parseMode ? { parseMode: resolvedDelivery.parseMode } : {},
			...resolvedDelivery.silent !== void 0 ? { silent: resolvedDelivery.silent } : {}
		});
	} catch (error) {
		return {
			ok: false,
			error: `attachment delivery failed: ${formatErrorMessage(error)}`
		};
	}
	if (!result.result) return {
		ok: false,
		error: "attachment delivery failed: no delivery result returned"
	};
	return {
		ok: true,
		channel: result.channel,
		deliveredTo: deliveryContext.to,
		count: validated.length
	};
}
//#endregion
//#region src/plugins/host-hook-scheduled-turns.ts
const log$1 = createSubsystemLogger("plugins/host-scheduled-turns");
const PLUGIN_CRON_NAME_PREFIX = "plugin:";
const PLUGIN_CRON_TAG_MARKER = ":tag:";
function resolveSchedule(params) {
	const cron = normalizeOptionalString(params.cron);
	if (cron) {
		const tz = normalizeOptionalString(params.tz);
		return {
			kind: "cron",
			expr: cron,
			...tz ? { tz } : {}
		};
	}
	if ("delayMs" in params) {
		if (!Number.isFinite(params.delayMs) || params.delayMs < 0) return;
		const at = timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(params.delayMs))));
		if (!at) return;
		return {
			kind: "at",
			at
		};
	}
	const rawAt = params.at;
	const at = rawAt instanceof Date ? rawAt : new Date(rawAt);
	if (!Number.isFinite(at.getTime())) return;
	return {
		kind: "at",
		at: at.toISOString()
	};
}
function resolveSessionEventDeliveryMode(deliveryMode) {
	if (deliveryMode === void 0) return;
	if (deliveryMode === "none" || deliveryMode === "announce") return deliveryMode;
}
function formatScheduleLogContext(params) {
	const parts = [`pluginId=${params.pluginId}`];
	if (params.sessionKey) parts.push(`sessionKey=${params.sessionKey}`);
	if (params.name) parts.push(`name=${params.name}`);
	if (params.jobId) parts.push(`jobId=${params.jobId}`);
	return parts.join(" ");
}
async function removeScheduledSessionTurn(params) {
	try {
		return didCronCleanupJob(await params.cron.remove(params.jobId));
	} catch (error) {
		log$1.warn(`plugin session turn cleanup failed (${formatScheduleLogContext(params)}): ${formatErrorMessage(error)}`);
		return false;
	}
}
function didCronRemoveJob(value) {
	return isCronRemoveResult(value) && value.ok && value.removed;
}
function didCronCleanupJob(value) {
	return isCronRemoveResult(value) && value.ok;
}
const PLUGIN_CRON_RESERVED_DELIMITER = ":";
function resolvePluginSessionTurnTag(value) {
	const tag = normalizeOptionalString(value);
	if (!tag) return { invalid: false };
	if (tag.includes(PLUGIN_CRON_RESERVED_DELIMITER)) return { invalid: true };
	return {
		tag,
		invalid: false
	};
}
function buildPluginSchedulerCronName(params) {
	const uniqueId = params.uniqueId ?? randomUUID();
	if (!params.tag) return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}:${params.sessionKey}:${uniqueId}`;
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:${uniqueId}`;
}
function buildPluginSchedulerTagPrefix(params) {
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:`;
}
function isCronRemoveResult(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value) && typeof value.ok === "boolean" && typeof value.removed === "boolean";
}
async function listAllCronJobsForPluginTagCleanup(cron, query) {
	const jobs = [];
	let offset = 0;
	for (;;) {
		const listResult = await cron.listPage({
			includeDisabled: true,
			limit: 200,
			query,
			sortBy: "name",
			sortDir: "asc",
			...offset > 0 ? { offset } : {}
		});
		jobs.push(...listResult.jobs);
		if (!listResult.hasMore) return jobs;
		if (listResult.nextOffset === null || listResult.nextOffset <= offset) return jobs;
		offset = listResult.nextOffset;
	}
}
async function schedulePluginSessionTurn(params) {
	if (params.origin !== "bundled") return;
	const sessionKey = normalizeOptionalString(params.schedule.sessionKey);
	const message = normalizeOptionalString(params.schedule.message);
	if (!sessionKey || !message) return;
	const cronSchedule = resolveSchedule(params.schedule);
	if (!cronSchedule) return;
	const rawDeliveryMode = params.schedule.deliveryMode;
	const deliveryMode = resolveSessionEventDeliveryMode(rawDeliveryMode);
	const scheduleName = normalizeOptionalString(params.schedule.name);
	if (rawDeliveryMode !== void 0 && !deliveryMode) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): unsupported deliveryMode`);
		return;
	}
	if (cronSchedule.kind === "cron" && params.schedule.deleteAfterRun === true) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): deleteAfterRun requires a one-shot schedule`);
		return;
	}
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.schedule.tag);
	if (invalidTag) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): tag contains reserved delimiter ":"`);
		return;
	}
	const cronDeliveryMode = deliveryMode ?? "announce";
	if (params.shouldCommit && !params.shouldCommit()) return;
	if (!params.cron) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): cron service unavailable`);
		return;
	}
	const cron = params.cron;
	const cronJobName = buildPluginSchedulerCronName({
		pluginId: params.pluginId,
		sessionKey,
		...tag !== void 0 ? { tag } : {},
		...scheduleName ? { uniqueId: scheduleName } : {}
	});
	const cronPayload = {
		kind: "agentTurn",
		message
	};
	let result;
	try {
		result = await cron.add({
			name: cronJobName,
			enabled: true,
			schedule: cronSchedule,
			sessionTarget: `session:${sessionKey}`,
			payload: cronPayload,
			...params.schedule.agentId ? { agentId: params.schedule.agentId } : {},
			deleteAfterRun: params.schedule.deleteAfterRun ?? cronSchedule.kind === "at",
			wakeMode: "now",
			delivery: {
				mode: cronDeliveryMode,
				...cronDeliveryMode === "announce" ? { channel: "last" } : {}
			}
		});
	} catch (error) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})}): ${formatErrorMessage(error)}`);
		return;
	}
	const jobId = result.id;
	if (!jobId) return;
	if (params.shouldCommit && !params.shouldCommit()) {
		if (!await removeScheduledSessionTurn({
			cron,
			jobId,
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})) log$1.warn(`plugin session turn scheduling rollback failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName,
			jobId
		})}): failed to remove stale scheduled session turn`);
		return;
	}
	return registerPluginSessionSchedulerJob({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		ownerRegistry: params.ownerRegistry,
		job: {
			id: jobId,
			sessionKey,
			kind: "session-turn",
			cleanup: async () => {
				if (!await removeScheduledSessionTurn({
					cron,
					jobId,
					pluginId: params.pluginId,
					sessionKey,
					name: cronJobName
				})) throw new Error(`failed to remove scheduled session turn: ${jobId}`);
			}
		}
	});
}
async function unschedulePluginSessionTurnsByTag(params) {
	if (params.origin !== "bundled") return {
		removed: 0,
		failed: 0
	};
	const sessionKey = normalizeOptionalString(params.request.sessionKey);
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.request.tag);
	if (!sessionKey || !tag || invalidTag) return {
		removed: 0,
		failed: 0
	};
	if (!params.cron) {
		log$1.warn("plugin session turn untag-list failed: cron service unavailable");
		return {
			removed: 0,
			failed: 1
		};
	}
	const cron = params.cron;
	const namePrefix = buildPluginSchedulerTagPrefix({
		pluginId: params.pluginId,
		tag,
		sessionKey
	});
	let jobs;
	try {
		jobs = await listAllCronJobsForPluginTagCleanup(cron, namePrefix);
	} catch (error) {
		log$1.warn(`plugin session turn untag-list failed: ${formatErrorMessage(error)}`);
		return {
			removed: 0,
			failed: 1
		};
	}
	const candidates = jobs.filter((job) => {
		return job.name.startsWith(namePrefix) && job.sessionTarget === `session:${sessionKey}`;
	});
	let removed = 0;
	let failed = 0;
	for (const job of candidates) {
		const id = job.id.trim();
		if (!id) continue;
		try {
			if (didCronRemoveJob(await cron.remove(id))) {
				removed += 1;
				deletePluginSessionSchedulerJob({
					pluginId: params.pluginId,
					jobId: id,
					sessionKey
				});
			} else failed += 1;
		} catch (error) {
			log$1.warn(`plugin session turn untag-remove failed: id=${id} error=${formatErrorMessage(error)}`);
			failed += 1;
		}
	}
	return {
		removed,
		failed
	};
}
//#endregion
//#region src/plugins/host-hook-state.ts
const log = createSubsystemLogger("plugins/host-hook-state");
const PROJECTION_FAILED = Symbol("plugin-session-extension-projection-failed");
const MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH = 32 * 1024;
const MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH = 512;
const MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION = 32;
function normalizeNamespace(value) {
	return value.trim();
}
function copyJsonValue(value) {
	return structuredClone(value);
}
function isPluginNextTurnInjectionPlacement(value) {
	return value === "prepend_context" || value === "append_context";
}
function isPluginNextTurnInjectionRecord(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && typeof candidate.pluginId === "string" && typeof candidate.text === "string" && typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt) && isPluginNextTurnInjectionPlacement(candidate.placement) && (candidate.ttlMs === void 0 || typeof candidate.ttlMs === "number" && Number.isFinite(candidate.ttlMs) && candidate.ttlMs >= 0) && (candidate.idempotencyKey === void 0 || typeof candidate.idempotencyKey === "string");
}
function isExpired(entry, now) {
	if (!isPluginNextTurnInjectionRecord(entry)) return true;
	return typeof entry.ttlMs === "number" && entry.ttlMs >= 0 && now - entry.createdAt > entry.ttlMs;
}
function isPluginPromptInjectionEnabled(cfg, pluginId) {
	return (cfg.plugins?.entries?.[pluginId])?.hooks?.allowPromptInjection !== false;
}
function toPluginNextTurnInjectionRecord(params) {
	return {
		id: params.injection.idempotencyKey?.trim() || randomUUID(),
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		text: params.injection.text,
		idempotencyKey: params.injection.idempotencyKey?.trim() || void 0,
		placement: params.injection.placement ?? "prepend_context",
		ttlMs: params.injection.ttlMs,
		createdAt: params.now,
		metadata: params.injection.metadata
	};
}
async function enqueuePluginNextTurnInjection(params) {
	if (typeof params.injection.sessionKey !== "string") return {
		enqueued: false,
		id: "",
		sessionKey: ""
	};
	const sessionKey = params.injection.sessionKey.trim();
	if (!sessionKey) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (typeof params.injection.text !== "string") return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const text = params.injection.text.trim();
	if (!text) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (text.length > MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.metadata !== void 0 && !isPluginJsonValue(params.injection.metadata)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.idempotencyKey !== void 0 && (typeof params.injection.idempotencyKey !== "string" || params.injection.idempotencyKey.trim().length === 0 || params.injection.idempotencyKey.length > MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.placement !== void 0 && !isPluginNextTurnInjectionPlacement(params.injection.placement)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.ttlMs !== void 0 && (!Number.isFinite(params.injection.ttlMs) || params.injection.ttlMs < 0)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const now = params.now ?? Date.now();
	const record = toPluginNextTurnInjectionRecord({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		injection: {
			...params.injection,
			sessionKey,
			text
		},
		now
	});
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey
	}, (entry) => {
		let enqueued = false;
		let resultId = record.id;
		const injections = { ...entry.pluginNextTurnInjections };
		const rawExisting = injections[params.pluginId];
		const existing = (Array.isArray(rawExisting) ? [...rawExisting] : []).filter((candidate) => !isExpired(candidate, now));
		const duplicate = record.idempotencyKey ? existing.find((candidate) => candidate.idempotencyKey === record.idempotencyKey) : void 0;
		if (duplicate) {
			resultId = duplicate.id;
			injections[params.pluginId] = existing;
			entry.pluginNextTurnInjections = injections;
			return {
				enqueued,
				id: resultId
			};
		}
		if (existing.length >= MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION) {
			injections[params.pluginId] = existing;
			entry.pluginNextTurnInjections = injections;
			return {
				enqueued,
				id: resultId
			};
		}
		injections[params.pluginId] = [...existing, record];
		entry.pluginNextTurnInjections = injections;
		entry.updatedAt = now;
		enqueued = true;
		return {
			enqueued,
			id: resultId
		};
	});
	if (!updated.found) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	return {
		...updated.result,
		sessionKey: updated.canonicalKey
	};
}
async function drainPluginNextTurnInjections(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return [];
	const target = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey
	});
	if (!target.entry) return [];
	if (!target.entry.pluginNextTurnInjections || Object.keys(target.entry.pluginNextTurnInjections).length === 0) return [];
	const now = params.now ?? Date.now();
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey
	}, (entry) => {
		if (!entry?.pluginNextTurnInjections) return [];
		const activePluginIds = new Set((getActivePluginRegistry()?.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id));
		const drained = [];
		for (const [pluginId, entries] of Object.entries(entry.pluginNextTurnInjections)) {
			if (!activePluginIds.has(pluginId) || !isPluginPromptInjectionEnabled(params.cfg, pluginId)) continue;
			if (!Array.isArray(entries)) continue;
			const liveEntries = entries.filter((candidate) => !isExpired(candidate, now));
			drained.push(...liveEntries);
		}
		drained.sort((left, right) => left.createdAt - right.createdAt);
		delete entry.pluginNextTurnInjections;
		if (drained.length > 0) entry.updatedAt = now;
		return drained;
	});
	return updated.found ? updated.result : [];
}
async function drainPluginNextTurnInjectionContext(params) {
	const queuedInjections = await drainPluginNextTurnInjections(params);
	return {
		queuedInjections,
		...buildPluginAgentTurnPrepareContext({ queuedInjections })
	};
}
function getPluginSessionExtensionStateSync(params) {
	const pluginId = params.pluginId.trim();
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!pluginId || !sessionKey) return;
	const value = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey
	}).entry?.pluginExtensions?.[pluginId];
	return value ? copyJsonValue(value) : void 0;
}
async function patchPluginSessionExtension(params) {
	const namespace = normalizeNamespace(params.namespace);
	const pluginId = params.pluginId.trim();
	if (!pluginId || !namespace) return {
		ok: false,
		error: "pluginId and namespace are required"
	};
	if (params.unset === true && params.value !== void 0) return {
		ok: false,
		error: "plugin session extension cannot specify both unset and value"
	};
	if (params.value !== void 0 && !isPluginJsonValue(params.value)) return {
		ok: false,
		error: "plugin session extension value must be JSON-compatible"
	};
	if (params.unset !== true && params.value === void 0) return {
		ok: false,
		error: "plugin session extension value is required unless unset is true"
	};
	const nextPluginValue = params.value;
	const registration = (getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? []).find((entry) => entry.pluginId === pluginId && entry.extension.namespace === namespace);
	if (!registration) return {
		ok: false,
		error: `unknown plugin session extension: ${pluginId}/${namespace}`
	};
	const rawSlotKey = normalizeOptionalString(registration.extension.sessionEntrySlotKey);
	const normalizedSlotKey = rawSlotKey ? normalizeSessionEntrySlotKey(rawSlotKey) : void 0;
	if (normalizedSlotKey?.ok === false) log.warn(`plugin session extension slot promotion skipped for ${pluginId}/${namespace}: ${normalizedSlotKey.error}`);
	const slotKey = normalizedSlotKey?.ok === true ? normalizedSlotKey.key : void 0;
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	}, (entry, context) => {
		const entryRecord = entry;
		const pluginExtensions = { ...entry.pluginExtensions };
		const pluginState = { ...pluginExtensions[pluginId] };
		if (params.unset === true) delete pluginState[namespace];
		else pluginState[namespace] = copyJsonValue(nextPluginValue);
		if (Object.keys(pluginState).length > 0) pluginExtensions[pluginId] = pluginState;
		else delete pluginExtensions[pluginId];
		if (Object.keys(pluginExtensions).length > 0) entry.pluginExtensions = pluginExtensions;
		else delete entry.pluginExtensions;
		const storedSlotKeys = { ...entry.pluginExtensionSlotKeys };
		const pluginSlotKeys = { ...storedSlotKeys[pluginId] };
		const previousSlotKey = normalizeSessionEntrySlotKey(pluginSlotKeys[namespace]);
		if (previousSlotKey.ok && previousSlotKey.key !== slotKey) delete entryRecord[previousSlotKey.key];
		if (slotKey && params.unset !== true) pluginSlotKeys[namespace] = slotKey;
		else delete pluginSlotKeys[namespace];
		if (Object.keys(pluginSlotKeys).length > 0) storedSlotKeys[pluginId] = pluginSlotKeys;
		else delete storedSlotKeys[pluginId];
		if (Object.keys(storedSlotKeys).length > 0) entry.pluginExtensionSlotKeys = storedSlotKeys;
		else delete entry.pluginExtensionSlotKeys;
		if (slotKey) {
			const projected = projectSessionExtensionValueForSlot({
				registration,
				sessionKey: context.canonicalKey,
				sessionId: entry.sessionId,
				nextValue: params.unset === true ? void 0 : nextPluginValue
			});
			if (projected === void 0) delete entryRecord[slotKey];
			else entryRecord[slotKey] = projected;
		}
		entry.updatedAt = Date.now();
		return pluginState[namespace];
	});
	if (!updated.found) return {
		ok: false,
		error: `unknown session key: ${params.sessionKey}`
	};
	return {
		ok: true,
		key: updated.canonicalKey,
		value: updated.result
	};
}
/**
* Resolve the value that should be mirrored to `SessionEntry[slotKey]` for a
* promoted session-extension namespace. Failures are swallowed so a
* misbehaving projector cannot block the primary patch from being persisted.
*/
function projectSessionExtensionValueForSlot(params) {
	if (params.nextValue === void 0) return;
	const projected = projectSessionExtensionValue({
		pluginId: params.registration.pluginId,
		namespace: params.registration.extension.namespace,
		project: params.registration.extension.project,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		state: params.nextValue
	});
	if (projected === PROJECTION_FAILED) return;
	if (isPromiseLike(projected)) {
		discardUnexpectedPromiseProjection(projected);
		return;
	}
	if (projected === void 0 || !isPluginJsonValue(projected)) return;
	return copyJsonValue(projected);
}
function collectPluginSessionExtensionProjections(params) {
	const extensions = getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? [];
	if (extensions.length === 0) return [];
	const projections = [];
	for (const registration of extensions) {
		const state = params.entry.pluginExtensions?.[registration.pluginId]?.[registration.extension.namespace];
		if (state === void 0) continue;
		const projected = projectSessionExtensionValue({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			project: registration.extension.project,
			sessionKey: params.sessionKey,
			sessionId: params.entry.sessionId,
			state
		});
		if (projected === PROJECTION_FAILED) continue;
		if (isPromiseLike(projected)) {
			discardUnexpectedPromiseProjection(projected);
			continue;
		}
		if (projected !== void 0 && isPluginJsonValue(projected)) projections.push({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			value: copyJsonValue(projected)
		});
	}
	return projections;
}
function isPromiseLike(value) {
	return Boolean(value && typeof value.then === "function");
}
function discardUnexpectedPromiseProjection(value) {
	Promise.resolve(value).catch(() => void 0);
}
function projectSessionExtensionValue(params) {
	try {
		return params.project ? params.project({
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			state: params.state
		}) : params.state;
	} catch (error) {
		log.warn(`plugin session extension projection failed: plugin=${params.pluginId} namespace=${params.namespace} error=${String(error)}`);
		return PROJECTION_FAILED;
	}
}
function projectPluginSessionExtensionsSync(params) {
	return collectPluginSessionExtensionProjections(params);
}
//#endregion
//#region packages/media-generation-core/src/string.ts
/** Return unique trimmed strings while preserving first-seen order. */
function uniqueTrimmedStrings(values) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const value of values) {
		const normalized = normalizeOptionalString(value);
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		result.push(normalized);
	}
	return result;
}
//#endregion
//#region packages/media-generation-core/src/catalog.ts
/** Return unique configured models with default model first when present. */
function uniqueModels(provider) {
	return uniqueTrimmedStrings([provider.defaultModel, ...provider.models ?? []]);
}
/** Synthesize static catalog entries from provider metadata. */
function synthesizeMediaGenerationCatalogEntries(params) {
	const defaultModel = uniqueTrimmedStrings([params.provider.defaultModel])[0];
	return uniqueModels(params.provider).map((model) => {
		const modelCatalogEntry = params.provider.catalogByModel?.[model];
		const entry = {
			kind: params.kind,
			provider: params.provider.id,
			model,
			source: "static",
			capabilities: modelCatalogEntry?.capabilities ?? params.provider.capabilities
		};
		if (params.provider.label) entry.label = params.provider.label;
		if (model === defaultModel) entry.default = true;
		const modes = modelCatalogEntry?.modes ?? params.modes;
		if (modes) entry.modes = modes;
		return entry;
	});
}
/** Return unique model ids exposed by a media generation provider. */
function listMediaGenerationProviderModels(provider) {
	return uniqueModels(provider);
}
//#endregion
//#region packages/speech-core/voice-models.ts
function normalizeString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeLowercaseString(value) {
	return normalizeString(value)?.toLowerCase();
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function parseVoiceModelRef(value) {
	const parsed = typeof value === "string" ? parseModelCatalogRef(value) : null;
	return parsed ? {
		provider: parsed.provider,
		model: parsed.modelId
	} : void 0;
}
function sameProvider(left, right) {
	const normalizedLeft = normalizeLowercaseString(left);
	return Boolean(normalizedLeft && normalizedLeft === normalizeLowercaseString(right));
}
/** Match provider ids case-insensitively across canonical id and aliases. */
function providerMatchesId(provider, providerId) {
	return sameProvider(provider.id, providerId) || (provider.aliases ?? []).some((alias) => sameProvider(alias, providerId));
}
/** Find the provider metadata for a configured provider id or alias. */
function findVoiceModelProvider(params) {
	return params.providers.find((provider) => providerMatchesId(provider, params.providerId));
}
/** Return true when a provider advertises the requested model. */
function voiceProviderSupportsModel(provider, model) {
	if (!provider) return false;
	const normalizedModel = normalizeString(model);
	return [provider.defaultModel, ...provider.models ?? []].some((candidate) => normalizeString(candidate) === normalizedModel);
}
/** Parse primary/fallback voice model refs from config. */
function resolveVoiceModelRefs(config) {
	const voiceModel = config;
	if (typeof voiceModel === "string") {
		const parsed = parseVoiceModelRef(voiceModel);
		return parsed ? [parsed] : [];
	}
	if (typeof voiceModel !== "object" || voiceModel === null || Array.isArray(voiceModel)) return [];
	const timeoutMs = normalizeTimeoutMs(voiceModel.timeoutMs);
	const refs = [];
	const addRef = (value) => {
		const parsed = parseVoiceModelRef(value);
		if (parsed) refs.push({
			...parsed,
			...timeoutMs === void 0 ? {} : { timeoutMs }
		});
	};
	addRef(voiceModel.primary);
	if (Array.isArray(voiceModel.fallbacks)) for (const fallback of voiceModel.fallbacks) addRef(fallback);
	return refs;
}
/** Resolve configured voice model refs that are supported by known providers. */
function resolveSupportedVoiceModelRefs(params) {
	return resolveVoiceModelRefs(params.config).flatMap((ref) => {
		const provider = findVoiceModelProvider({
			providers: params.providers,
			providerId: ref.provider
		});
		if (!provider || params.providerId && !providerMatchesId(provider, params.providerId)) return [];
		return voiceProviderSupportsModel(provider, ref.model) ? [{
			...ref,
			provider: provider.id
		}] : [];
	});
}
/** Build ordered provider candidates from primary provider plus voice-model fallbacks. */
function resolveVoiceProviderCandidates(params) {
	const primary = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const candidates = [];
	const seenProviders = /* @__PURE__ */ new Set();
	const addCandidate = (candidate) => {
		candidates.push(candidate);
		seenProviders.add(candidate.provider);
	};
	const refs = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers
	});
	const primaryRefs = refs.filter((ref) => ref.provider === primary);
	for (const voiceModel of primaryRefs) addCandidate({
		provider: primary,
		voiceModel
	});
	if (primaryRefs.length === 0) addCandidate({ provider: primary });
	for (const voiceModel of refs) if (voiceModel.provider !== primary) addCandidate({
		provider: voiceModel.provider,
		voiceModel
	});
	for (const provider of params.providers) if (!seenProviders.has(provider.id)) addCandidate({ provider: provider.id });
	return candidates;
}
/** Resolve only the primary provider candidate for direct synthesis paths. */
function resolvePrimaryVoiceProviderCandidate(params) {
	const provider = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const voiceModel = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers,
		providerId: provider
	})[0];
	return voiceModel ? {
		provider,
		voiceModel
	} : { provider };
}
/** Read provider config by configured id, canonical id, or alias. */
function getVoiceProviderConfig(params) {
	const candidates = [
		normalizeString(params.configuredProviderId),
		params.provider.id,
		...params.provider.aliases ?? []
	].filter((key) => Boolean(key));
	const configuredKeys = Object.keys(params.providerConfigs);
	for (const candidate of candidates) {
		if (Object.hasOwn(params.providerConfigs, candidate)) return params.providerConfigs[candidate] ?? {};
		const normalizedCandidate = normalizeLowercaseString(candidate);
		const matchingKey = configuredKeys.find((key) => normalizeLowercaseString(key) === normalizedCandidate);
		if (matchingKey) return params.providerConfigs[matchingKey] ?? {};
	}
	return {};
}
/** Convert provider metadata into static voice catalog entries. */
function synthesizeVoiceModelCatalogEntries(params) {
	const seen = /* @__PURE__ */ new Set();
	return [params.provider.defaultModel, ...params.provider.models ?? []].flatMap((entry) => {
		const model = normalizeString(entry);
		if (!model || seen.has(model)) return [];
		seen.add(model);
		return [model];
	}).map((model) => {
		const entry = {
			kind: "voice",
			provider: params.provider.id,
			model,
			source: "static",
			capabilities: params.capabilities
		};
		if (params.provider.label) entry.label = params.provider.label;
		if (model === params.provider.defaultModel) entry.default = true;
		if (params.modes) entry.modes = params.modes;
		return entry;
	});
}
//#endregion
//#region src/plugins/provider-catalog-result.ts
const MODEL_PROVIDER_CONFIG_KEYS = [
	"baseUrl",
	"apiKey",
	"auth",
	"api",
	"contextWindow",
	"contextTokens",
	"maxTokens",
	"timeoutSeconds",
	"region",
	"injectNumCtxForOpenAICompat",
	"params",
	"agentRuntime",
	"localService",
	"headers",
	"authHeader",
	"request"
];
const MODEL_DEFINITION_CONFIG_KEYS = [
	"api",
	"baseUrl",
	"reasoning",
	"input",
	"cost",
	"contextWindow",
	"contextTokens",
	"maxTokens",
	"thinkingLevelMap",
	"params",
	"agentRuntime",
	"headers",
	"compat",
	"mediaInput",
	"metadataSource"
];
/** Copies provider config data out of a provider catalog result. */
function copyProviderCatalogResultProjection(result) {
	const provider = copyProviderCatalogProviderConfig(readRecordValue(result, "provider"));
	if (provider) return {
		kind: "provider",
		provider
	};
	const providers = copyRecordEntries(readRecordValue(result, "providers")).flatMap(([providerId, providerConfig]) => {
		const copied = copyProviderCatalogProviderConfig(providerConfig);
		return copied ? [[providerId, copied]] : [];
	});
	return providers.length > 0 ? {
		kind: "providers",
		providers
	} : { kind: "empty" };
}
/** Copies provider catalog result entries, using providerId for single-provider results. */
function copyProviderCatalogResultEntries(params) {
	const projection = copyProviderCatalogResultProjection(params.result);
	if (projection.kind === "provider") return [[params.providerId, projection.provider]];
	return projection.kind === "providers" ? projection.providers : [];
}
/** Copies model definitions from provider catalog provider config. */
function copyProviderCatalogModels(providerConfig) {
	return copyArrayEntries(readRecordValue(providerConfig, "models")).flatMap((entry) => {
		const copied = copyProviderCatalogModel(entry);
		return copied ? [copied] : [];
	});
}
function copyProviderCatalogModel(model) {
	if (!isRecordWithoutThrowing(model)) return;
	const id = readRecordValue(model, "id");
	const name = readRecordValue(model, "name");
	if (typeof id !== "string") return;
	const copied = {
		id,
		name: typeof name === "string" ? name : id
	};
	for (const key of MODEL_DEFINITION_CONFIG_KEYS) {
		const value = readRecordValue(model, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
/** Copies the supported provider config fields from a provider catalog result. */
function copyProviderCatalogProviderConfig(providerConfig) {
	if (!isRecordWithoutThrowing(providerConfig)) return;
	const baseUrl = readRecordValue(providerConfig, "baseUrl");
	if (typeof baseUrl !== "string") return;
	const copied = {
		baseUrl,
		models: copyProviderCatalogModels(providerConfig)
	};
	for (const key of MODEL_PROVIDER_CONFIG_KEYS) {
		if (key === "baseUrl") continue;
		const value = readRecordValue(providerConfig, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
//#endregion
//#region src/plugins/provider-catalog-unified-text.ts
/** Projects plugin provider catalog results into unified text-model catalog rows. */
function projectProviderCatalogResultToUnifiedTextRows(params) {
	const rows = [];
	for (const [providerId, providerConfig] of copyProviderCatalogResultEntries(params)) for (const model of copyProviderCatalogModels(providerConfig)) {
		const modelId = readRecordValue(model, "id");
		if (typeof modelId !== "string") continue;
		const modelName = readRecordValue(model, "name");
		rows.push({
			kind: "text",
			provider: providerId,
			model: modelId,
			...typeof modelName === "string" && modelName ? { label: modelName } : {},
			source: params.source
		});
	}
	return rows;
}
//#endregion
//#region src/plugins/model-catalog-registration.ts
function mergeCatalogHookResults(source, left, right) {
	const rows = [...left ?? [], ...right ?? []];
	if (rows.length === 0) return null;
	const mergedRows = [];
	for (const row of rows) mergedRows.push({
		...row,
		source
	});
	return mergedRows;
}
function mergeModelCatalogHooks(source, left, right) {
	if (!left) return right;
	if (!right) return left;
	return async (ctx) => {
		const [leftRows, rightRows] = await Promise.all([left(ctx), right(ctx)]);
		return mergeCatalogHookResults(source, leftRows, rightRows);
	};
}
/** Creates handlers that register plugin model catalog providers into a registry. */
function createModelCatalogRegistrationHandlers(params) {
	const registerModelCatalogProvider = (record, provider) => {
		const providerId = normalizeOptionalString(provider.provider) ?? "";
		if (!providerId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "model catalog provider registration missing provider"
			});
			return;
		}
		if (!provider.kinds || provider.kinds.length === 0) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider "${providerId}" registration missing kinds`
			});
			return;
		}
		const existing = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId !== record.id);
		if (existing) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider already registered: ${providerId} (${existing.pluginId})`
			});
			return;
		}
		const normalizedKinds = uniqueValues(provider.kinds);
		const samePluginOverlapping = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId === record.id && entry.provider.kinds.some((kind) => normalizedKinds.includes(kind)));
		if (samePluginOverlapping) {
			samePluginOverlapping.provider = {
				...samePluginOverlapping.provider,
				...provider,
				provider: providerId,
				kinds: uniqueValues([...samePluginOverlapping.provider.kinds, ...normalizedKinds]),
				staticCatalog: mergeModelCatalogHooks("static", samePluginOverlapping.provider.staticCatalog, provider.staticCatalog),
				liveCatalog: mergeModelCatalogHooks("live", samePluginOverlapping.provider.liveCatalog, provider.liveCatalog)
			};
			return;
		}
		params.registry.modelCatalogProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				provider: providerId,
				kinds: normalizedKinds
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSynthesizedTextModelCatalogProvider = (registration) => {
		if (!registration.provider.catalog && !registration.provider.staticCatalog) return;
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: ["text"],
			...registration.provider.staticCatalog ? { staticCatalog: async (ctx) => projectProviderCatalogResultToUnifiedTextRows({
				providerId: registration.provider.id,
				result: await registration.provider.staticCatalog.run(ctx),
				source: "static"
			}) } : {},
			...registration.provider.catalog ? { liveCatalog: async (ctx) => projectProviderCatalogResultToUnifiedTextRows({
				providerId: registration.provider.id,
				result: await registration.provider.catalog.run(ctx),
				source: "live"
			}) } : {}
		});
	};
	const registerSynthesizedMediaModelCatalogProvider = (registration) => {
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: [registration.kind],
			staticCatalog: () => synthesizeMediaGenerationCatalogEntries({
				kind: registration.kind,
				provider: registration.provider
			})
		});
	};
	const registerSynthesizedVoiceModelCatalogProvider = (registration) => {
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: ["voice"],
			staticCatalog: () => synthesizeVoiceModelCatalogEntries({
				provider: registration.provider,
				capabilities: registration.capabilities,
				modes: registration.modes
			})
		});
	};
	return {
		registerModelCatalogProvider,
		registerSynthesizedTextModelCatalogProvider,
		registerSynthesizedMediaModelCatalogProvider,
		registerSynthesizedVoiceModelCatalogProvider
	};
}
//#endregion
//#region src/plugins/registry-state.ts
/** Decode the public mode once so domain registrars do not repeat string checks. */
function resolvePluginRegistrationCapabilities(mode) {
	return {
		capabilityHandlers: mode === "full" || mode === "discovery" || mode === "tool-discovery",
		setupRuntimeHandlers: mode === "setup-runtime",
		runtimeChannel: mode !== "setup-only" && mode !== "tool-discovery"
	};
}
function normalizeHookTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveTypedHookTimeoutMs(params) {
	return normalizeHookTimeoutMs(params.policy?.timeouts?.[params.hookName]) ?? normalizeHookTimeoutMs(params.policy?.timeoutMs) ?? normalizeHookTimeoutMs(params.opts?.timeoutMs);
}
function createPluginRegistryState(registryParams) {
	const registry = createEmptyPluginRegistry();
	const coreGatewayMethodNames = Array.from(/* @__PURE__ */ new Set([...registryParams.coreGatewayMethodNames ?? [], ...Object.keys(registryParams.coreGatewayHandlers ?? {})])).toSorted();
	registry.coreGatewayMethodNames = coreGatewayMethodNames;
	const pushDiagnostic = (diagnostic) => {
		registry.diagnostics.push(diagnostic);
	};
	const modelCatalogRegistrars = createModelCatalogRegistrationHandlers({
		registry,
		pushDiagnostic
	});
	return {
		registry,
		registryParams,
		coreGatewayMethods: new Set(coreGatewayMethodNames),
		getHostCronService: () => registryParams.hostServices?.cron,
		pluginHookRollback: /* @__PURE__ */ new Map(),
		pluginsWithChannelRegistrationConflict: /* @__PURE__ */ new Set(),
		pluginSideEffectGuards: /* @__PURE__ */ new Map(),
		pushDiagnostic,
		...modelCatalogRegistrars
	};
}
//#endregion
//#region src/plugins/registry-api.ts
function normalizeLogger(logger) {
	return {
		info: logger.info,
		warn: logger.warn,
		error: logger.error,
		debug: logger.debug
	};
}
function resolvePluginPath(input, rootDir) {
	const trimmed = input.trim();
	if (!trimmed || path.isAbsolute(trimmed) || trimmed.startsWith("~")) return resolveUserPath(input);
	return rootDir ? path.resolve(rootDir, trimmed) : resolveUserPath(input);
}
function createPluginApiFactory(state, registrars, runtimeResolver) {
	const { registry, registryParams, getHostCronService, pluginSideEffectGuards, pushDiagnostic } = state;
	const { registerTool, registerHook, registerHttpRoute, registerHostedMediaResolver, registerMcpServerConnectionResolver, registerProvider, registerWorkerProvider, registerModelCatalogProvider, registerEmbeddingProvider, registerAgentHarness, registerDetachedTaskRuntime, registerSpeechProvider, registerRealtimeTranscriptionProvider, registerRealtimeVoiceProvider, registerMediaUnderstandingProvider, registerTranscriptSourceProvider, registerImageGenerationProvider, registerVideoGenerationProvider, registerMusicGenerationProvider, registerWebFetchProvider, registerWebSearchProvider, registerMigrationProvider, registerGatewayMethod, registerSessionCatalog, registerService, registerGatewayDiscoveryService, registerCliBackend, registerTextTransforms, registerReload, registerNodeHostCommand, registerNodeInvokePolicy, registerSecurityAuditCollector, registerInteractiveHandler, registerConversationBindingResolvedHandler, registerCommand, registerContextEngine, registerCompactionProvider, registerCodexAppServerExtensionFactory, registerAgentToolResultMiddleware, registerSessionExtension, registerTrustedToolPolicy, registerToolMetadata, registerControlUiDescriptor, registerRuntimeLifecycle, registerAgentEventSubscription, registerSessionSchedulerJob, registerSessionAction, registerTypedHook, registerMemoryCapability, registerMemoryPromptSupplement, registerMemoryPromptPreparation, registerMemoryCorpusSupplement, registerMemoryEmbeddingProvider, registerCli, registerChannel } = registrars;
	const { resolvePluginRuntime, setPluginRuntimeRecord } = runtimeResolver;
	const createPluginSideEffectGuard = (pluginId) => {
		const guard = { active: true };
		const guards = pluginSideEffectGuards.get(pluginId) ?? /* @__PURE__ */ new Set();
		guards.add(guard);
		pluginSideEffectGuards.set(pluginId, guards);
		return guard;
	};
	const deactivatePluginSideEffectGuards = (pluginId) => {
		const guards = pluginSideEffectGuards.get(pluginId);
		if (!guards) return;
		for (const guard of guards) guard.active = false;
		pluginSideEffectGuards.delete(pluginId);
	};
	const createApi = (record, params) => {
		const registrationMode = params.registrationMode ?? "full";
		const registrationCapabilities = resolvePluginRegistrationCapabilities(registrationMode);
		setPluginRuntimeRecord(record);
		const sideEffectGuard = createPluginSideEffectGuard(record.id);
		const isLoadedRecordInRegistry = () => registry.plugins.some((plugin) => plugin.id === record.id && plugin.status === "loaded");
		const isLoadedRecordInLiveRegistry = () => sideEffectGuard.active && isPluginRegistryActivated(registry) && !isPluginRegistryRetired(registry) && isLoadedRecordInRegistry();
		const isActivatingLoadedRecord = () => registryParams.activateGlobalSideEffects !== false && record.enabled && record.status === "loaded" && !registry.plugins.some((plugin) => plugin.id === record.id);
		const shouldCommitWorkflowSideEffect = () => sideEffectGuard.active && !isPluginRegistryRetired(registry) && (isActivatingLoadedRecord() || isPluginRegistryActivated(registry) && isLoadedRecordInRegistry());
		return buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			rootDir: record.rootDir,
			registrationMode,
			config: params.config,
			pluginConfig: params.pluginConfig,
			runtime: resolvePluginRuntime(record.id),
			logger: normalizeLogger(registryParams.logger),
			resolvePath: (input) => resolvePluginPath(input, record.rootDir),
			handlers: {
				...registrationCapabilities.capabilityHandlers ? {
					registerTool: (tool, opts) => registerTool(record, tool, opts),
					registerHook: (events, handler, opts) => registerHook(record, events, handler, opts, params.config, params.pluginConfig),
					registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
					registerHostedMediaResolver: (resolver) => registerHostedMediaResolver(record, resolver),
					registerMcpServerConnectionResolver: (resolver) => registerMcpServerConnectionResolver(record, resolver),
					registerProvider: (provider) => registerProvider(record, provider),
					registerWorkerProvider: (provider) => registerWorkerProvider(record, provider),
					registerModelCatalogProvider: (provider) => registerModelCatalogProvider(record, provider),
					registerEmbeddingProvider: (provider) => registerEmbeddingProvider(record, provider),
					registerAgentHarness: (harness) => registerAgentHarness(record, harness),
					registerDetachedTaskRuntime: (runtime) => registerDetachedTaskRuntime(record, runtime),
					registerSpeechProvider: (provider) => registerSpeechProvider(record, provider),
					registerRealtimeTranscriptionProvider: (provider) => registerRealtimeTranscriptionProvider(record, provider),
					registerRealtimeVoiceProvider: (provider) => registerRealtimeVoiceProvider(record, provider),
					registerMediaUnderstandingProvider: (provider) => registerMediaUnderstandingProvider(record, provider),
					registerTranscriptSourceProvider: (provider) => registerTranscriptSourceProvider(record, provider),
					registerImageGenerationProvider: (provider) => registerImageGenerationProvider(record, provider),
					registerVideoGenerationProvider: (provider) => registerVideoGenerationProvider(record, provider),
					registerMusicGenerationProvider: (provider) => registerMusicGenerationProvider(record, provider),
					registerWebFetchProvider: (provider) => registerWebFetchProvider(record, provider),
					registerWebSearchProvider: (provider) => registerWebSearchProvider(record, provider),
					registerMigrationProvider: (provider) => registerMigrationProvider(record, provider),
					registerGatewayMethod: (method, handler, opts) => registerGatewayMethod(record, method, handler, opts),
					registerSessionCatalog: (provider) => registerSessionCatalog(record, provider),
					registerService: (service) => registerService(record, service),
					registerGatewayDiscoveryService: (service) => registerGatewayDiscoveryService(record, service),
					registerCliBackend: (backend) => registerCliBackend(record, backend),
					registerTextTransforms: (transforms) => registerTextTransforms(record, transforms),
					registerReload: (registration) => registerReload(record, registration),
					registerNodeHostCommand: (command) => registerNodeHostCommand(record, command),
					registerNodeInvokePolicy: (policy) => registerNodeInvokePolicy(record, policy, params.pluginConfig),
					registerSecurityAuditCollector: (collector) => registerSecurityAuditCollector(record, collector),
					registerInteractiveHandler: (registration) => registerInteractiveHandler(record, registration),
					onConversationBindingResolved: (handler) => registerConversationBindingResolvedHandler(record, handler),
					registerCommand: (command) => registerCommand(record, command),
					registerContextEngine: (id, factory) => registerContextEngine(record, id, factory, registrationMode),
					registerCompactionProvider: (provider) => registerCompactionProvider(record, provider),
					registerCodexAppServerExtensionFactory: (factory) => {
						registerCodexAppServerExtensionFactory(record, factory);
					},
					registerAgentToolResultMiddleware: (handler, options) => {
						registerAgentToolResultMiddleware(record, handler, options, params.hookPolicy);
					},
					registerSessionExtension: (extension) => registerSessionExtension(record, extension),
					enqueueNextTurnInjection: (injection) => {
						if (params.hookPolicy?.allowPromptInjection === false) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: `next-turn injection blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
							});
							return Promise.resolve({
								enqueued: false,
								id: "",
								sessionKey: injection.sessionKey
							});
						}
						return enqueuePluginNextTurnInjection({
							cfg: registryParams.runtime.config.current(),
							pluginId: record.id,
							pluginName: record.name,
							injection
						});
					},
					registerTrustedToolPolicy: (policy) => registerTrustedToolPolicy(record, policy),
					registerToolMetadata: (metadata) => registerToolMetadata(record, metadata),
					registerControlUiDescriptor: (descriptor) => registerControlUiDescriptor(record, descriptor),
					registerRuntimeLifecycle: (lifecycle) => registerRuntimeLifecycle(record, lifecycle),
					registerAgentEventSubscription: (subscription) => registerAgentEventSubscription(record, subscription),
					emitAgentEvent: (event) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							emitted: false,
							reason: "global side effects disabled"
						};
						if (!shouldCommitWorkflowSideEffect()) return {
							emitted: false,
							reason: "plugin is not loaded"
						};
						return emitPluginAgentEvent({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							event
						});
					},
					setRunContext: (patch) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? setPluginRunContext({
						pluginId: record.id,
						patch
					}) : false,
					getRunContext: (get) => getPluginRunContext({
						pluginId: record.id,
						get
					}),
					clearRunContext: (paramsLocal) => {
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return;
						clearPluginRunContext({
							pluginId: record.id,
							runId: paramsLocal.runId,
							namespace: paramsLocal.namespace
						});
					},
					registerSessionSchedulerJob: (job) => registerSessionSchedulerJob(record, job),
					registerSessionAction: (action) => registerSessionAction(record, action),
					sendSessionAttachment: async (attachment) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							ok: false,
							error: "global side effects disabled"
						};
						try {
							if (!isLoadedRecordInLiveRegistry()) return {
								ok: false,
								error: "plugin is not loaded"
							};
							const runtimeConfig = registryParams.runtime.config?.current?.() ?? params.config;
							return await sendPluginSessionAttachment({
								...attachment,
								config: runtimeConfig,
								origin: record.origin
							});
						} catch (error) {
							return {
								ok: false,
								error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
							};
						}
					},
					scheduleSessionTurn: async (schedule) => {
						if (registryParams.activateGlobalSideEffects === false) return;
						await Promise.resolve();
						return schedulePluginSessionTurn({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							schedule,
							cron: getHostCronService(),
							shouldCommit: isLoadedRecordInLiveRegistry,
							ownerRegistry: registry
						});
					},
					unscheduleSessionTurnsByTag: async (request) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							removed: 0,
							failed: 0
						};
						await Promise.resolve();
						if (!isLoadedRecordInLiveRegistry()) return {
							removed: 0,
							failed: 0
						};
						return unschedulePluginSessionTurnsByTag({
							pluginId: record.id,
							origin: record.origin,
							cron: getHostCronService(),
							request
						});
					},
					registerMemoryCapability: (capability) => registerMemoryCapability(record, capability),
					registerMemoryPromptSupplement: (builder) => registerMemoryPromptSupplement(record, builder),
					registerMemoryPromptPreparation: (prepare) => registerMemoryPromptPreparation(record, prepare),
					registerMemoryCorpusSupplement: (supplement) => registerMemoryCorpusSupplement(record, supplement),
					registerMemoryEmbeddingProvider: (adapter) => registerMemoryEmbeddingProvider(record, adapter),
					on: (hookName, handler, opts) => registerTypedHook(record, hookName, handler, opts, params.hookPolicy)
				} : {},
				...registrationCapabilities.setupRuntimeHandlers ? {
					registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
					registerGatewayMethod: (method, handler, opts) => registerGatewayMethod(record, method, handler, opts),
					registerSessionCatalog: (provider) => registerSessionCatalog(record, provider)
				} : {},
				registerCli: (registrar, opts) => registerCli(record, registrar, opts),
				registerChannel: (registration) => registerChannel(record, registration, registrationMode)
			}
		});
	};
	return {
		createApi,
		deactivatePluginSideEffectGuards
	};
}
//#endregion
//#region src/plugins/registry-registrars-capabilities.ts
function createCapabilityRegistrars(state) {
	const { registry, pushDiagnostic } = state;
	const registerDetachedTaskRuntime = (record, runtime) => {
		const existing = getDetachedTaskLifecycleRuntimeRegistration();
		if (existing && existing.pluginId !== record.id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `detached task runtime already registered by ${existing.pluginId}`
			});
			return;
		}
		registerDetachedTaskLifecycleRuntime(record.id, runtime);
	};
	const registerInteractiveHandler = (record, registration) => {
		const result = registerRegistryPluginInteractiveHandler(record.id, registration, {
			pluginName: record.name,
			pluginRoot: record.rootDir
		});
		if (!result.ok) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: result.error ?? "interactive handler registration failed"
			});
			return;
		}
		registry.interactiveHandlers.push({
			...registration,
			pluginId: record.id,
			pluginName: record.name,
			pluginRoot: record.rootDir
		});
	};
	const registerContextEngine = (record, id, factory, registrationMode) => {
		const normalizedId = normalizeOptionalString(id) ?? "";
		if (!normalizedId) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "context engine registration missing id"
			});
			return;
		}
		if (typeof factory !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `context engine "${normalizedId}" registration missing factory`
			});
			return;
		}
		if (normalizedId === defaultSlotIdForKey("contextEngine")) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `context engine id reserved by core: ${normalizedId}`
			});
			return;
		}
		const result = registerContextEngineForOwner(normalizedId, factory, `plugin:${record.id}`, {
			allowSameOwnerRefresh: true,
			lifecycle: registrationMode === "full" ? "runtime" : "readOnlyDiscovery"
		});
		if (!result.ok) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `context engine already registered: ${normalizedId} (${result.existingOwner})`
			});
			return;
		}
		if (!record.contextEngineIds?.includes(normalizedId)) record.contextEngineIds = [...record.contextEngineIds ?? [], normalizedId];
	};
	const registerCompactionProvider$1 = (record, provider) => {
		const id = normalizeOptionalString(provider?.id);
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "compaction provider registration missing id"
			});
			return;
		}
		if (typeof provider?.summarize !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `compaction provider "${id}" registration missing summarize`
			});
			return;
		}
		const existing = getRegisteredCompactionProvider(id);
		if (existing) {
			const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `compaction provider already registered: ${id}${ownerDetail}`
			});
			return;
		}
		registerCompactionProvider(provider, { ownerPluginId: record.id });
	};
	return {
		registerDetachedTaskRuntime,
		registerInteractiveHandler,
		registerContextEngine,
		registerCompactionProvider: registerCompactionProvider$1
	};
}
//#endregion
//#region src/plugins/tool-contracts.ts
function normalizePluginToolContractNames(contracts) {
	return normalizePluginToolNames(contracts?.tools);
}
function normalizePluginToolNames(names) {
	const normalized = /* @__PURE__ */ new Set();
	for (const name of names ?? []) {
		const trimmed = name.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return [...normalized];
}
function findUndeclaredPluginToolNames(params) {
	const declared = new Set(normalizePluginToolNames(params.declaredNames));
	return normalizePluginToolNames(params.toolNames).filter((name) => !declared.has(name));
}
//#endregion
//#region src/plugins/registry-registrars-host.ts
const controlUiSurfaces = /* @__PURE__ */ new Set([
	"session",
	"tool",
	"run",
	"settings",
	"tab"
]);
function normalizeHostHookString(value) {
	return typeof value === "string" ? normalizePluginHostHookId(value) : "";
}
function normalizeOptionalHostHookString(value) {
	if (value === void 0) return;
	if (typeof value !== "string") return "";
	return value.trim();
}
function normalizeHostHookStringList(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return null;
	const normalized = value.map((item) => normalizeOptionalHostHookString(item));
	if (normalized.some((item) => !item)) return null;
	return normalized;
}
function createHostRegistrars(state) {
	const { registry, registryParams, pushDiagnostic } = state;
	const validateSessionActionSchema = (record, id, schema) => {
		if (schema === void 0) return true;
		if (!isPluginJsonValue(schema)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action schema must be JSON-compatible: ${id}`
			});
			return false;
		}
		if (typeof schema !== "boolean" && (!schema || typeof schema !== "object" || Array.isArray(schema))) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action schema must be a JSON schema object or boolean: ${id}`
			});
			return false;
		}
		try {
			validateJsonSchemaValue({
				schema,
				cacheKey: `plugin-session-action-registration:${record.id}:${id}`,
				value: void 0
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action schema is not valid JSON Schema: ${id}: ${message}`
			});
			return false;
		}
		return true;
	};
	const registerSessionExtension = (record, extension) => {
		const namespace = normalizeHostHookString(extension.namespace);
		const description = normalizeHostHookString(extension.description);
		const project = extension.project;
		let normalizedSessionEntrySlotKey;
		let invalidMessage;
		if (!namespace || !description) invalidMessage = "session extension registration requires namespace and description";
		else if (project !== void 0 && typeof project !== "function") invalidMessage = "session extension projector must be a function";
		else if (project?.constructor?.name === "AsyncFunction") invalidMessage = "session extension projector must be synchronous";
		else if (extension.cleanup !== void 0 && typeof extension.cleanup !== "function") invalidMessage = "session extension cleanup must be a function";
		else if (extension.sessionEntrySlotKey !== void 0) {
			const slotKey = normalizeSessionEntrySlotKey(extension.sessionEntrySlotKey);
			if (!slotKey.ok) invalidMessage = slotKey.error;
			else normalizedSessionEntrySlotKey = slotKey.key;
		}
		if (invalidMessage) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: invalidMessage
			});
			return;
		}
		if (registry.sessionExtensions.find((entry) => entry.pluginId === record.id && entry.extension.namespace === namespace)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session extension already registered: ${namespace}`
			});
			return;
		}
		if (normalizedSessionEntrySlotKey) {
			if (registry.sessionExtensions.find((entry) => {
				const existingSlotKey = entry.extension.sessionEntrySlotKey;
				if (existingSlotKey === void 0) return false;
				const normalizedExistingSlotKey = normalizeSessionEntrySlotKey(existingSlotKey);
				return normalizedExistingSlotKey.ok && normalizedExistingSlotKey.key === normalizedSessionEntrySlotKey;
			})) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `sessionEntrySlotKey already registered: ${normalizedSessionEntrySlotKey}`
				});
				return;
			}
		}
		registry.sessionExtensions.push({
			pluginId: record.id,
			pluginName: record.name,
			extension: {
				...extension,
				namespace,
				description,
				...normalizedSessionEntrySlotKey ? { sessionEntrySlotKey: normalizedSessionEntrySlotKey } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerTrustedToolPolicy = (record, policy) => {
		if (!policy || typeof policy !== "object") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "trusted tool policy registration requires id, description, and evaluate()"
			});
			return;
		}
		const id = normalizeHostHookString(policy.id);
		const description = normalizeHostHookString(policy.description);
		if (!id || !description || typeof policy.evaluate !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "trusted tool policy registration requires id, description, and evaluate()"
			});
			return;
		}
		if (record.origin !== "bundled" && !(record.contracts?.trustedToolPolicies ?? []).includes(id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.trustedToolPolicies for: ${id}`
			});
			return;
		}
		if (record.origin !== "bundled" && !(record.enabled && record.explicitlyEnabled === true)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must be explicitly enabled to register trusted tool policy: ${id}`
			});
			return;
		}
		const policies = registry.trustedToolPolicies;
		const existing = policies.find((entry) => entry.pluginId === record.id && entry.policy.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `trusted tool policy already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		const registration = {
			pluginId: record.id,
			pluginName: record.name,
			policy: {
				...policy,
				id,
				description
			},
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		};
		if (record.origin === "bundled") {
			const firstInstalledPolicyIndex = policies.findIndex((entry) => entry.origin !== "bundled");
			if (firstInstalledPolicyIndex === -1) policies.push(registration);
			else policies.splice(firstInstalledPolicyIndex, 0, registration);
			return;
		}
		policies.push(registration);
	};
	const registerToolMetadata = (record, metadata) => {
		const toolName = normalizeHostHookString(metadata.toolName);
		if (!toolName) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "tool metadata registration missing toolName"
			});
			return;
		}
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames: normalizePluginToolContractNames(record.contracts),
			toolNames: [toolName]
		});
		if (undeclared.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.tools for tool metadata: ${undeclared.join(", ")}`
			});
			return;
		}
		const existing = registry.toolMetadata.find((entry) => entry.pluginId === record.id && entry.metadata.toolName === toolName);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `tool metadata already registered: ${toolName} (${existing.pluginId})`
			});
			return;
		}
		const displayName = normalizeOptionalHostHookString(metadata.displayName);
		const description = normalizeOptionalHostHookString(metadata.description);
		const tags = normalizeHostHookStringList(metadata.tags);
		if (displayName === "" || description === "" || tags === null || metadata.risk !== void 0 && ![
			"low",
			"medium",
			"high"
		].includes(metadata.risk)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `tool metadata registration has invalid metadata: ${toolName}`
			});
			return;
		}
		registry.toolMetadata.push({
			pluginId: record.id,
			pluginName: record.name,
			metadata: {
				...metadata,
				toolName,
				...displayName !== void 0 ? { displayName } : {},
				...description !== void 0 ? { description } : {},
				...tags !== void 0 ? { tags } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerControlUiDescriptor = (record, descriptor) => {
		const legacyDescriptor = descriptor;
		const id = normalizeHostHookString(descriptor.id);
		const label = normalizeHostHookString(descriptor.label ?? legacyDescriptor.name);
		const description = normalizeOptionalHostHookString(descriptor.description);
		const placement = normalizeOptionalHostHookString(descriptor.placement);
		const requiredScopes = normalizeHostHookStringList(descriptor.requiredScopes);
		const surface = typeof descriptor.surface === "string" ? descriptor.surface : "session";
		if (!id || !label || !controlUiSurfaces.has(surface) || description === "" || placement === "" || requiredScopes === null) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "control UI descriptor registration requires id, surface, label, and valid optional fields"
			});
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `control UI descriptor requiredScopes contains unknown operator scope: ${unknownScope}`
				});
				return;
			}
		}
		if (descriptor.schema !== void 0 && !isPluginJsonValue(descriptor.schema)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `control UI descriptor schema must be JSON-compatible: ${id}`
			});
			return;
		}
		if (registry.controlUiDescriptors.find((entry) => entry.pluginId === record.id && entry.descriptor.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `control UI descriptor already registered: ${id}`
			});
			return;
		}
		const icon = normalizeOptionalHostHookString(descriptor.icon);
		const tabPath = normalizeOptionalHostHookString(descriptor.path);
		if (!(tabPath === void 0 || tabPath.startsWith("/") && !tabPath.startsWith("//") && !tabPath.startsWith("/\\"))) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `control UI descriptor path must be a gateway-local absolute path: ${id}`
			});
			return;
		}
		const group = descriptor.group === "control" || descriptor.group === "agent" ? descriptor.group : void 0;
		const order = typeof descriptor.order === "number" && Number.isFinite(descriptor.order) ? descriptor.order : void 0;
		registry.controlUiDescriptors.push({
			pluginId: record.id,
			pluginName: record.name,
			descriptor: {
				...descriptor,
				id,
				surface,
				label,
				...description !== void 0 ? { description } : {},
				...placement !== void 0 ? { placement } : {},
				...requiredScopes !== void 0 ? { requiredScopes } : {},
				icon,
				path: tabPath,
				group,
				order
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerRuntimeLifecycle = (record, lifecycle) => {
		const id = normalizePluginHostHookId(lifecycle.id);
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "runtime lifecycle registration missing id"
			});
			return;
		}
		if (registry.runtimeLifecycles.find((entry) => entry.pluginId === record.id && entry.lifecycle.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `runtime lifecycle already registered: ${id}`
			});
			return;
		}
		if (lifecycle.cleanup !== void 0 && typeof lifecycle.cleanup !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `runtime lifecycle cleanup must be a function: ${id}`
			});
			return;
		}
		registry.runtimeLifecycles.push({
			pluginId: record.id,
			pluginName: record.name,
			lifecycle: {
				...lifecycle,
				id
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerAgentEventSubscription = (record, subscription) => {
		const id = normalizePluginHostHookId(subscription.id);
		if (!id || typeof subscription.handle !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent event subscription registration requires id and handle"
			});
			return;
		}
		const streams = normalizeHostHookStringList(subscription.streams);
		if (streams === null) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent event subscription streams must be an array of strings: ${id}`
			});
			return;
		}
		if (registry.agentEventSubscriptions.find((entry) => entry.pluginId === record.id && entry.subscription.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent event subscription already registered: ${id}`
			});
			return;
		}
		registry.agentEventSubscriptions.push({
			pluginId: record.id,
			pluginName: record.name,
			subscription: {
				...subscription,
				id,
				...streams !== void 0 ? { streams } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSessionSchedulerJob = (record, job) => {
		const jobId = normalizeHostHookString(job.id);
		const sessionKey = normalizeHostHookString(job.sessionKey);
		const kind = normalizeHostHookString(job.kind);
		if (jobId && registry.sessionSchedulerJobs.some((entry) => entry.pluginId === record.id && entry.job.id === jobId)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session scheduler job already registered: ${jobId}`
			});
			return;
		}
		if (!jobId || !sessionKey || !kind) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session scheduler job registration requires unique id, sessionKey, and kind"
			});
			return;
		}
		if (job.cleanup !== void 0 && typeof job.cleanup !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session scheduler job cleanup must be a function: ${jobId}`
			});
			return;
		}
		if (registryParams.activateGlobalSideEffects === false) {
			registry.sessionSchedulerJobs.push({
				pluginId: record.id,
				pluginName: record.name,
				job: {
					...job,
					id: jobId,
					sessionKey,
					kind
				},
				source: record.source,
				rootDir: record.rootDir
			});
			return {
				id: jobId,
				pluginId: record.id,
				sessionKey,
				kind
			};
		}
		const handle = registerPluginSessionSchedulerJob({
			pluginId: record.id,
			pluginName: record.name,
			ownerRegistry: registry,
			job: {
				...job,
				id: jobId,
				sessionKey,
				kind
			}
		});
		if (!handle) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session scheduler job registration requires unique id, sessionKey, and kind"
			});
			return;
		}
		registry.sessionSchedulerJobs.push({
			pluginId: record.id,
			pluginName: record.name,
			job: {
				...job,
				id: handle.id,
				sessionKey: handle.sessionKey,
				kind: handle.kind
			},
			generation: getPluginSessionSchedulerJobGeneration({
				pluginId: record.id,
				jobId: handle.id,
				sessionKey: handle.sessionKey
			}),
			source: record.source,
			rootDir: record.rootDir
		});
		return handle;
	};
	const registerSessionAction = (record, action) => {
		const id = normalizeHostHookString(action.id);
		const description = normalizeOptionalHostHookString(action.description);
		const requiredScopes = normalizeHostHookStringList(action.requiredScopes);
		if (!id || description === "" || requiredScopes === null || typeof action.handler !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session action registration requires id, handler, and valid optional fields"
			});
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `session action requiredScopes contains unknown operator scope: ${unknownScope}`
				});
				return;
			}
		}
		if (!validateSessionActionSchema(record, id, action.schema)) return;
		if (registry.sessionActions.find((entry) => entry.pluginId === record.id && entry.action.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action already registered: ${id}`
			});
			return;
		}
		registry.sessionActions.push({
			pluginId: record.id,
			pluginName: record.name,
			action: {
				...action,
				id,
				...description !== void 0 ? { description } : {},
				...requiredScopes !== void 0 ? { requiredScopes } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerConversationBindingResolvedHandler = (record, handler) => {
		registry.conversationBindingResolvedHandlers.push({
			pluginId: record.id,
			pluginName: record.name,
			pluginRoot: record.rootDir,
			handler,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerSessionExtension,
		registerTrustedToolPolicy,
		registerToolMetadata,
		registerControlUiDescriptor,
		registerRuntimeLifecycle,
		registerAgentEventSubscription,
		registerSessionSchedulerJob,
		registerSessionAction,
		registerConversationBindingResolvedHandler
	};
}
//#endregion
//#region src/plugins/registry-registrars-memory.ts
function createMemoryRegistrars(state) {
	const { registry, pushDiagnostic } = state;
	const requireMemorySlot = (record, surface) => {
		if (!hasKind(record.kind, "memory")) throw new Error(`only memory plugins can register a memory ${surface}`);
		if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `dual-kind plugin not selected for memory slot; skipping memory ${surface} registration`
			});
			return false;
		}
		return true;
	};
	const registerMemoryCapability$1 = (record, capability) => {
		if (requireMemorySlot(record, "capability")) registerMemoryCapability(record.id, capability);
	};
	const registerMemoryPromptSupplement$1 = (record, builder) => {
		if (typeof builder !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "memory prompt supplement registration missing builder"
			});
			return;
		}
		registerMemoryPromptSupplement(record.id, builder);
	};
	const registerMemoryPromptPreparation$1 = (record, prepare) => {
		if (typeof prepare !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "memory prompt preparation registration missing prepare function"
			});
			return;
		}
		registerMemoryPromptPreparation(record.id, prepare);
	};
	const registerMemoryCorpusSupplement$1 = (record, supplement) => {
		registerMemoryCorpusSupplement(record.id, supplement);
	};
	const registerMemoryEmbeddingProvider$1 = (record, adapter) => {
		if (hasKind(record.kind, "memory")) {
			if (!requireMemorySlot(record, "embedding provider")) return;
		} else if (!(record.contracts?.memoryEmbeddingProviders ?? []).includes(adapter.id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must own memory slot or declare contracts.memoryEmbeddingProviders for adapter: ${adapter.id}`
			});
			return;
		}
		const existing = getRegisteredMemoryEmbeddingProvider(adapter.id);
		if (existing) {
			const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `memory embedding provider already registered: ${adapter.id}${ownerDetail}`
			});
			return;
		}
		registerMemoryEmbeddingProvider(adapter, { ownerPluginId: record.id });
		registry.memoryEmbeddingProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: adapter,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerMemoryCapability: registerMemoryCapability$1,
		registerMemoryPromptSupplement: registerMemoryPromptSupplement$1,
		registerMemoryPromptPreparation: registerMemoryPromptPreparation$1,
		registerMemoryCorpusSupplement: registerMemoryCorpusSupplement$1,
		registerMemoryEmbeddingProvider: registerMemoryEmbeddingProvider$1
	};
}
//#endregion
//#region src/plugins/validation-diagnostics.ts
/** Pushes a normalized plugin validation diagnostic. */
function pushPluginValidationDiagnostic(params) {
	params.pushDiagnostic({
		level: params.level,
		pluginId: params.pluginId,
		source: params.source,
		message: params.message
	});
}
//#endregion
//#region src/plugins/channel-validation.ts
function resolveBundledChannelMeta(id) {
	return listChatChannels().find((meta) => meta?.id === id) ?? resolveGeneratedBundledChannelMeta(id);
}
function resolveGeneratedBundledChannelMeta(id) {
	const channel = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === id && entry.configurable !== false);
	const label = normalizeOptionalString(channel?.label);
	if (!channel || !label) return;
	return {
		id,
		label,
		selectionLabel: label,
		docsPath: `/channels/${id}`,
		blurb: normalizeOptionalString(channel.description) ?? ""
	};
}
function collectMissingChannelMetaFields(meta) {
	const missing = [];
	if (!normalizeOptionalString(meta?.label)) missing.push("label");
	if (!normalizeOptionalString(meta?.selectionLabel)) missing.push("selectionLabel");
	if (!normalizeOptionalString(meta?.docsPath)) missing.push("docsPath");
	if (typeof meta?.blurb !== "string") missing.push("blurb");
	return missing;
}
/** Validates and normalizes a channel plugin registration before runtime catalog insertion. */
function normalizeRegisteredChannelPlugin(params) {
	const id = normalizeOptionalString(params.plugin?.id) ?? normalizeStringifiedOptionalString(params.plugin?.id) ?? "";
	if (!id) {
		pushPluginValidationDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "channel registration missing id",
			pushDiagnostic: params.pushDiagnostic
		});
		return null;
	}
	if (typeof params.plugin.config?.listAccountIds !== "function" || typeof params.plugin.config?.resolveAccount !== "function") {
		pushPluginValidationDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: `channel "${id}" registration missing required config helpers`,
			pushDiagnostic: params.pushDiagnostic
		});
		return null;
	}
	const rawMeta = params.plugin.meta;
	const rawMetaId = normalizeOptionalString(rawMeta?.id);
	if (rawMetaId && rawMetaId !== id) pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" meta.id mismatch ("${rawMetaId}"); using registered channel id`,
		pushDiagnostic: params.pushDiagnostic
	});
	const missingFields = collectMissingChannelMetaFields(rawMeta);
	if (missingFields.length > 0) pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" registered incomplete metadata; filled missing ${missingFields.join(", ")}`,
		pushDiagnostic: params.pushDiagnostic
	});
	return {
		...params.plugin,
		id,
		meta: normalizeChannelMeta({
			id,
			meta: rawMeta,
			existing: resolveBundledChannelMeta(id)
		})
	};
}
//#endregion
//#region src/plugins/registry-registrars-network.ts
const GATEWAY_METHOD_DISPATCH_CONTRACT = "authenticated-request";
function adaptPluginGatewayMethodHandler(handler) {
	return async (opts) => {
		let responded = false;
		const respond = (ok, payload, error, meta) => {
			responded = true;
			opts.respond(ok, payload, error, meta);
		};
		const result = await handler({
			...opts,
			respond
		});
		if (!responded && result !== void 0) respond(true, result);
	};
}
function createNetworkRegistrars(state) {
	const { registry, coreGatewayMethods, pluginsWithChannelRegistrationConflict, pushDiagnostic } = state;
	const registerGatewayMethod = (record, method, handler, opts) => {
		const trimmed = method.trim();
		if (!trimmed) return;
		if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `gateway method already registered: ${trimmed}`
			});
			return;
		}
		const wrappedHandler = adaptPluginGatewayMethodHandler(handler);
		registry.gatewayHandlers[trimmed] = wrappedHandler;
		const normalizedScope = normalizePluginGatewayMethodScope(trimmed, opts?.scope);
		if (normalizedScope.coercedToReservedAdmin) pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `gateway method scope coerced to operator.admin for reserved core namespace: ${trimmed}`
		});
		registry.gatewayMethodDescriptors.push(createPluginGatewayMethodDescriptor({
			pluginId: record.id,
			name: trimmed,
			handler: wrappedHandler,
			scope: normalizedScope.scope
		}));
	};
	const registerSessionCatalog = (record, provider) => {
		const id = provider.id.trim();
		const label = provider.label.trim();
		if (!id || !label) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session catalog requires non-empty id and label"
			});
			return;
		}
		const existing = registry.sessionCatalogs.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session catalog already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		registry.sessionCatalogs.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				id,
				label
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const describeHttpRouteOwner = (entry) => {
		return `${normalizeOptionalString(entry.pluginId) || "unknown-plugin"} (${normalizeOptionalString(entry.source) || "unknown-source"})`;
	};
	const canDispatchGatewayMethodsFromHttpRoute = (record) => (record.contracts?.gatewayMethodDispatch ?? []).includes(GATEWAY_METHOD_DISPATCH_CONTRACT);
	const registerHttpRoute = (record, params) => {
		const normalizedPath = normalizePluginHttpPath(params.path);
		if (!normalizedPath) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "http route registration missing path"
			});
			return;
		}
		if (params.auth !== "gateway" && params.auth !== "plugin") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `http route registration missing or invalid auth: ${normalizedPath}`
			});
			return;
		}
		const match = params.match ?? "exact";
		const overlappingRoute = findOverlappingPluginHttpRoute(registry.httpRoutes, {
			path: normalizedPath,
			match
		});
		if (overlappingRoute && overlappingRoute.auth !== params.auth) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `http route overlap rejected: ${normalizedPath} (${match}, ${params.auth}) overlaps ${overlappingRoute.path} (${overlappingRoute.match}, ${overlappingRoute.auth}) owned by ${describeHttpRouteOwner(overlappingRoute)}`
			});
			return;
		}
		const existingIndex = registry.httpRoutes.findIndex((entry) => entry.path === normalizedPath && entry.match === match);
		const registration = {
			pluginId: record.id,
			path: normalizedPath,
			handler: params.handler,
			...params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {},
			auth: params.auth,
			match,
			...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
			...canDispatchGatewayMethodsFromHttpRoute(record) ? { gatewayMethodDispatchAllowed: true } : {},
			...params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {},
			source: record.source
		};
		if (existingIndex >= 0) {
			const existing = registry.httpRoutes[existingIndex];
			if (!existing) return;
			if (!params.replaceExisting && existing.pluginId !== record.id) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `http route already registered: ${normalizedPath} (${match}) by ${describeHttpRouteOwner(existing)}`
				});
				return;
			}
			if (existing.pluginId && existing.pluginId !== record.id) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `http route replacement rejected: ${normalizedPath} (${match}) owned by ${describeHttpRouteOwner(existing)}`
				});
				return;
			}
			registry.httpRoutes[existingIndex] = registration;
			return;
		}
		record.httpRoutes += 1;
		registry.httpRoutes.push(registration);
	};
	const registerHostedMediaResolver = (record, resolver) => {
		if (typeof resolver !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "hosted media resolver registration missing resolver"
			});
			return;
		}
		registry.hostedMediaResolvers.push({
			pluginId: record.id,
			pluginName: record.name,
			resolver,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerMcpServerConnectionResolver = (record, resolver) => {
		const serverName = normalizeOptionalString(resolver?.serverName);
		if (!serverName || typeof resolver.resolve !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "MCP server connection resolver registration missing serverName or resolve"
			});
			return;
		}
		const existingIndex = registry.mcpServerConnectionResolvers.findIndex((entry) => entry.resolver.serverName === serverName);
		const registration = {
			pluginId: record.id,
			pluginName: record.name,
			resolver: {
				serverName,
				resolve: resolver.resolve
			},
			source: record.source,
			rootDir: record.rootDir
		};
		if (existingIndex >= 0) {
			const existing = registry.mcpServerConnectionResolvers[existingIndex];
			if (existing && existing.pluginId !== record.id) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `MCP server connection resolver for "${serverName}" rejected: already registered by plugin "${existing.pluginId}"`
				});
				return;
			}
			registry.mcpServerConnectionResolvers[existingIndex] = registration;
			return;
		}
		registry.mcpServerConnectionResolvers.push(registration);
	};
	const registerChannel = (record, registration, mode = "full") => {
		if (record.origin === "workspace" && !record.enabled) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `channel registration rejected for disabled workspace plugin: ${record.id}`
			});
			return;
		}
		const registrationCapabilities = resolvePluginRegistrationCapabilities(mode);
		const normalized = typeof registration.plugin === "object" ? registration : { plugin: registration };
		const plugin = normalizeRegisteredChannelPlugin({
			pluginId: record.id,
			source: record.source,
			plugin: normalized.plugin,
			pushDiagnostic
		});
		if (!plugin) return;
		const id = plugin.id;
		const existingRuntime = registry.channels.find((entry) => entry.plugin.id === id);
		if (registrationCapabilities.runtimeChannel && existingRuntime) {
			if (existingRuntime.pluginId === record.id) {
				existingRuntime.plugin = plugin;
				existingRuntime.pluginName = record.name;
				existingRuntime.origin = record.origin;
				existingRuntime.source = record.source;
				existingRuntime.rootDir = record.rootDir;
				const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
				if (existingSetup) {
					existingSetup.plugin = plugin;
					existingSetup.pluginName = record.name;
					existingSetup.origin = record.origin;
					existingSetup.source = record.source;
					existingSetup.enabled = record.enabled;
					existingSetup.rootDir = record.rootDir;
				}
				return;
			}
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `channel already registered: ${id} (${existingRuntime.pluginId})`
			});
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
		if (existingSetup) {
			if (existingSetup.pluginId === record.id) {
				existingSetup.plugin = plugin;
				existingSetup.pluginName = record.name;
				existingSetup.origin = record.origin;
				existingSetup.source = record.source;
				existingSetup.enabled = record.enabled;
				existingSetup.rootDir = record.rootDir;
				return;
			}
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `channel setup already registered: ${id} (${existingSetup.pluginId})`
			});
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		if (!record.channelIds.includes(id)) record.channelIds.push(id);
		registry.channelSetups.push({
			pluginId: record.id,
			pluginName: record.name,
			plugin,
			origin: record.origin,
			source: record.source,
			enabled: record.enabled,
			rootDir: record.rootDir
		});
		if (!registrationCapabilities.runtimeChannel) return;
		registry.channels.push({
			pluginId: record.id,
			pluginName: record.name,
			plugin,
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerGatewayMethod,
		registerSessionCatalog,
		registerHttpRoute,
		registerHostedMediaResolver,
		registerMcpServerConnectionResolver,
		registerChannel
	};
}
//#endregion
//#region src/plugins/registry-registrars-operations.ts
function isOfficialCodexPluginRecord(record) {
	if (record.id !== "codex" || record.origin !== "global") return false;
	if (record.packageName === "@openclaw/codex") return true;
	return path.normalize(record.rootDir ?? record.source).split(path.sep).join("/").includes("/node_modules/@openclaw/codex");
}
function canClaimReservedCommandOwnership(record) {
	return record.origin === "bundled" || isOfficialCodexPluginRecord(record);
}
function createOperationRegistrars(state) {
	const { registry, registryParams, pushDiagnostic } = state;
	const registerCli = (record, registrar, opts) => {
		const normalizeCommandRoot = (raw, source) => {
			const normalized = normalizeCommandDescriptorName(raw);
			if (!normalized) pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `invalid cli ${source} name: ${JSON.stringify(raw.trim())}`
			});
			return normalized;
		};
		const parentPath = (opts?.parentPath ?? []).map((segment) => normalizeCommandRoot(segment, "command"));
		if (parentPath.some((segment) => segment === null)) return;
		const normalizedParentPath = parentPath;
		const descriptors = (opts?.descriptors ?? []).map((descriptor) => {
			const name = normalizeCommandRoot(descriptor.name, "descriptor");
			const description = sanitizeCommandDescriptorDescription(descriptor.description);
			return name && description ? {
				name,
				description,
				hasSubcommands: descriptor.hasSubcommands
			} : null;
		}).filter((descriptor) => descriptor !== null);
		const commands = [...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)].map((command) => normalizeCommandRoot(command, "command")).filter((command) => command !== null);
		if (commands.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "cli registration missing explicit commands metadata"
			});
			return;
		}
		const serializeCommandPath = (command) => [...normalizedParentPath, command].join(" ");
		const commandPaths = commands.map(serializeCommandPath);
		const commandPathSet = new Set(commandPaths);
		const existing = registry.cliRegistrars.find((entry) => entry.commands.map((command) => [...entry.parentPath ?? [], command].join(" ")).some((commandPath) => commandPathSet.has(commandPath)));
		if (existing) {
			const existingCommandPaths = new Set(existing.commands.map((command) => [...existing.parentPath ?? [], command].join(" ")));
			const overlap = commandPaths.find((commandPath) => existingCommandPaths.has(commandPath));
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `cli command already registered: ${overlap ?? commands[0]} (${existing.pluginId})`
			});
			return;
		}
		record.cliCommands.push(...commandPaths);
		registry.cliRegistrars.push({
			pluginId: record.id,
			pluginName: record.name,
			register: registrar,
			parentPath: normalizedParentPath,
			commands,
			descriptors,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerReload = (record, registration) => {
		const normalized = {
			restartPrefixes: normalizeStringEntries(registration.restartPrefixes),
			hotPrefixes: normalizeStringEntries(registration.hotPrefixes),
			noopPrefixes: normalizeStringEntries(registration.noopPrefixes)
		};
		if ((normalized.restartPrefixes?.length ?? 0) === 0 && (normalized.hotPrefixes?.length ?? 0) === 0 && (normalized.noopPrefixes?.length ?? 0) === 0) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "reload registration missing prefixes"
			});
			return;
		}
		registry.reloads.push({
			pluginId: record.id,
			pluginName: record.name,
			registration: normalized,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const reservedNodeHostCommands = /* @__PURE__ */ new Set([
		...NODE_SYSTEM_RUN_COMMANDS,
		...NODE_EXEC_APPROVALS_COMMANDS,
		NODE_SYSTEM_NOTIFY_COMMAND
	]);
	const registerNodeHostCommand = (record, nodeCommand) => {
		const command = nodeCommand.command.trim();
		if (!command) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "node host command registration missing command"
			});
			return;
		}
		const bundledSystemNotify = record.origin === "bundled" && command === "system.notify";
		if (reservedNodeHostCommands.has(command) && !bundledSystemNotify) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node host command reserved by core: ${command}`
			});
			return;
		}
		const existing = registry.nodeHostCommands.find((entry) => entry.command.command === command);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node host command already registered: ${command} (${existing.pluginId})`
			});
			return;
		}
		registry.nodeHostCommands.push({
			pluginId: record.id,
			pluginName: record.name,
			command: {
				...nodeCommand,
				command,
				cap: normalizeOptionalString(nodeCommand.cap)
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerNodeInvokePolicy = (record, policy, pluginConfig) => {
		const commands = normalizeUniqueStringEntries(Array.isArray(policy.commands) ? policy.commands : []);
		if (commands.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "node invoke policy registration missing commands"
			});
			return;
		}
		if (typeof policy.handle !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node invoke policy registration missing handler: ${commands.join(", ")}`
			});
			return;
		}
		for (const command of commands) {
			const existing = registry.nodeInvokePolicies.find((entry) => entry.policy.commands.includes(command));
			if (existing) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `node invoke policy already registered for ${command} (${existing.pluginId})`
				});
				return;
			}
		}
		registry.nodeInvokePolicies.push({
			pluginId: record.id,
			pluginName: record.name,
			policy: {
				...policy,
				commands
			},
			pluginConfig,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSecurityAuditCollector = (record, collector) => {
		registry.securityAuditCollectors.push({
			pluginId: record.id,
			pluginName: record.name,
			collector,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerService = (record, service) => {
		const id = service.id.trim();
		if (!id) return;
		const existing = registry.services.find((entry) => entry.service.id === id);
		if (existing) {
			if (existing.pluginId === record.id) return;
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `service already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		record.services.push(id);
		registry.services.push({
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			origin: record.origin,
			trustedOfficialInstall: record.trustedOfficialInstall,
			rootDir: record.rootDir
		});
	};
	const registerGatewayDiscoveryService = (record, service) => {
		const id = service.id.trim();
		if (!id) return;
		const existing = registry.gatewayDiscoveryServices.find((entry) => entry.service.id === id);
		if (existing) {
			if (existing.pluginId === record.id) return;
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `gateway discovery service already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		record.gatewayDiscoveryServiceIds.push(id);
		registry.gatewayDiscoveryServices.push({
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCommand = (record, command) => {
		const name = command.name.trim();
		if (!name) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "command registration missing name"
			});
			return;
		}
		const allowReservedCommandNames = command.ownership === "reserved";
		if (allowReservedCommandNames && !canClaimReservedCommandOwnership(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `only bundled plugins can claim reserved command ownership: ${name}`
			});
			return;
		}
		if (allowReservedCommandNames && !isReservedCommandName(name)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `reserved command ownership requires a reserved command name: ${name}`
			});
			return;
		}
		if (allowReservedCommandNames && record.id !== normalizeLowercaseStringOrEmpty(name)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `command registration failed: Reserved command ownership requires plugin id "${record.id}" to match reserved command name "${normalizeLowercaseStringOrEmpty(name)}"`
			});
			return;
		}
		if (!registryParams.activateGlobalSideEffects) {
			const validationError = validatePluginCommandDefinition(command, { allowReservedCommandNames });
			if (validationError) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `command registration failed: ${validationError}`
				});
				return;
			}
		} else {
			const { ownership: _ownership, ...commandForRegistration } = command;
			const result = registerPluginCommand(record.id, allowReservedCommandNames ? commandForRegistration : command, {
				pluginName: record.name,
				pluginRoot: record.rootDir,
				allowReservedCommandNames,
				allowOwnerStatusExposure: canClaimReservedCommandOwnership(record)
			});
			if (!result.ok) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `command registration failed: ${result.error}`
				});
				return;
			}
			if (allowReservedCommandNames) {
				const registeredCommand = pluginCommands.get(`/${name.toLowerCase()}`);
				if (registeredCommand?.pluginId === record.id) registeredCommand.ownership = "reserved";
			}
		}
		record.commands.push(name);
		registry.commands.push({
			pluginId: record.id,
			pluginName: record.name,
			command,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerCli,
		registerReload,
		registerNodeHostCommand,
		registerNodeInvokePolicy,
		registerSecurityAuditCollector,
		registerService,
		registerGatewayDiscoveryService,
		registerCommand
	};
}
//#endregion
//#region src/plugins/provider-validation.ts
/** Validates and normalizes provider plugin definitions before registry registration. */
function normalizeTextList(values) {
	const normalized = normalizeUniqueTrimmedStringList(values);
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeOnboardingScopes(values) {
	const normalized = Array.from(new Set((values ?? []).filter((value) => value === "text-inference" || value === "image-generation" || value === "music-generation")));
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeProviderOAuthProfileIdRepairs(values) {
	if (!Array.isArray(values)) return;
	const normalized = values.map((value) => {
		const legacyProfileId = normalizeOptionalString(value?.legacyProfileId);
		const promptLabel = normalizeOptionalString(value?.promptLabel);
		if (!legacyProfileId && !promptLabel) return null;
		return {
			...legacyProfileId ? { legacyProfileId } : {},
			...promptLabel ? { promptLabel } : {}
		};
	}).filter((value) => value !== null);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveWizardMethodId(params) {
	if (!params.methodId) return;
	if (params.auth.some((method) => method.id === params.methodId)) return params.methodId;
	pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `provider "${params.providerId}" ${params.metadataKind} method "${params.methodId}" not found; falling back to available methods`,
		pushDiagnostic: params.pushDiagnostic
	});
}
function buildNormalizedModelAllowlist(modelAllowlist) {
	if (!modelAllowlist) return;
	const allowedKeys = normalizeTextList(modelAllowlist.allowedKeys);
	const initialSelections = normalizeTextList(modelAllowlist.initialSelections);
	const loadCatalog = modelAllowlist.loadCatalog === true;
	const message = normalizeOptionalString(modelAllowlist.message);
	if (!allowedKeys && !initialSelections && !loadCatalog && !message) return;
	return {
		...allowedKeys ? { allowedKeys } : {},
		...initialSelections ? { initialSelections } : {},
		...loadCatalog ? { loadCatalog } : {},
		...message ? { message } : {}
	};
}
function buildNormalizedWizardSetup(params) {
	const choiceId = normalizeOptionalString(params.setup.choiceId);
	const choiceLabel = normalizeOptionalString(params.setup.choiceLabel);
	const choiceHint = normalizeOptionalString(params.setup.choiceHint);
	const groupId = normalizeOptionalString(params.setup.groupId);
	const groupLabel = normalizeOptionalString(params.setup.groupLabel);
	const groupHint = normalizeOptionalString(params.setup.groupHint);
	const onboardingScopes = normalizeOnboardingScopes(params.setup.onboardingScopes);
	const modelAllowlist = buildNormalizedModelAllowlist(params.setup.modelAllowlist);
	return {
		...choiceId ? { choiceId } : {},
		...choiceLabel ? { choiceLabel } : {},
		...choiceHint ? { choiceHint } : {},
		...typeof params.setup.assistantPriority === "number" && Number.isFinite(params.setup.assistantPriority) ? { assistantPriority: params.setup.assistantPriority } : {},
		...params.setup.assistantVisibility === "manual-only" || params.setup.assistantVisibility === "visible" ? { assistantVisibility: params.setup.assistantVisibility } : {},
		...params.setup.onboardingFeatured === true ? { onboardingFeatured: true } : {},
		...groupId ? { groupId } : {},
		...groupLabel ? { groupLabel } : {},
		...groupHint ? { groupHint } : {},
		...params.methodId ? { methodId: params.methodId } : {},
		...onboardingScopes ? { onboardingScopes } : {},
		...modelAllowlist ? { modelAllowlist } : {}
	};
}
function buildNormalizedModelPicker(modelPicker, methodId) {
	const label = normalizeOptionalString(modelPicker.label);
	const hint = normalizeOptionalString(modelPicker.hint);
	return {
		...label ? { label } : {},
		...hint ? { hint } : {},
		...methodId ? { methodId } : {}
	};
}
function normalizeProviderWizardSetup(params) {
	const hasAuthMethods = params.auth.length > 0;
	if (!params.setup) return;
	if (!hasAuthMethods) {
		pushPluginValidationDiagnostic({
			level: "warn",
			pluginId: params.pluginId,
			source: params.source,
			message: `provider "${params.providerId}" setup metadata ignored because it has no auth methods`,
			pushDiagnostic: params.pushDiagnostic
		});
		return;
	}
	const methodId = resolveWizardMethodId({
		providerId: params.providerId,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.auth,
		methodId: normalizeOptionalString(params.setup.methodId),
		metadataKind: "setup",
		pushDiagnostic: params.pushDiagnostic
	});
	return buildNormalizedWizardSetup({
		setup: params.setup,
		methodId
	});
}
function normalizeProviderAuthMethods(params) {
	const seenMethodIds = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const method of params.auth) {
		const methodId = normalizeOptionalString(method.id);
		if (!methodId) {
			pushPluginValidationDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method missing id`,
				pushDiagnostic: params.pushDiagnostic
			});
			continue;
		}
		if (seenMethodIds.has(methodId)) {
			pushPluginValidationDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method duplicated id "${methodId}"`,
				pushDiagnostic: params.pushDiagnostic
			});
			continue;
		}
		seenMethodIds.add(methodId);
		const wizardSetup = method.wizard;
		const wizard = wizardSetup ? normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: [{
				...method,
				id: methodId
			}],
			setup: wizardSetup,
			pushDiagnostic: params.pushDiagnostic
		}) : void 0;
		normalized.push({
			...method,
			id: methodId,
			label: normalizeOptionalString(method.label) ?? methodId,
			...normalizeOptionalString(method.hint) ? { hint: normalizeOptionalString(method.hint) } : {},
			...wizard ? { wizard } : {}
		});
	}
	return normalized;
}
function normalizeProviderWizard(params) {
	if (!params.wizard) return;
	const hasAuthMethods = params.auth.length > 0;
	const normalizeSetup = () => {
		const setup = params.wizard?.setup;
		if (!setup) return;
		return normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			setup,
			pushDiagnostic: params.pushDiagnostic
		});
	};
	const normalizeModelPicker = () => {
		const modelPicker = params.wizard?.modelPicker;
		if (!modelPicker) return;
		if (!hasAuthMethods) {
			pushPluginValidationDiagnostic({
				level: "warn",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" model-picker metadata ignored because it has no auth methods`,
				pushDiagnostic: params.pushDiagnostic
			});
			return;
		}
		return buildNormalizedModelPicker(modelPicker, resolveWizardMethodId({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			methodId: normalizeOptionalString(modelPicker.methodId),
			metadataKind: "model-picker",
			pushDiagnostic: params.pushDiagnostic
		}));
	};
	const setup = normalizeSetup();
	const modelPicker = normalizeModelPicker();
	if (!setup && !modelPicker) return;
	return {
		...setup ? { setup } : {},
		...modelPicker ? { modelPicker } : {}
	};
}
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
/** Returns a normalized provider plugin plus validation diagnostics for registry insertion. */
function normalizeRegisteredProvider(params) {
	const id = normalizeOptionalString(params.provider.id);
	if (!id) {
		pushPluginValidationDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "provider registration missing id",
			pushDiagnostic: params.pushDiagnostic
		});
		return null;
	}
	const auth = normalizeProviderAuthMethods({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.provider.auth ?? [],
		pushDiagnostic: params.pushDiagnostic
	});
	const docsPath = normalizeOptionalString(params.provider.docsPath);
	const aliases = normalizeTextList(params.provider.aliases);
	const deprecatedProfileIds = normalizeTextList(params.provider.deprecatedProfileIds);
	const oauthProfileIdRepairs = normalizeProviderOAuthProfileIdRepairs(params.provider.oauthProfileIdRepairs);
	const envVars = normalizeTextList(params.provider.envVars);
	const wizard = normalizeProviderWizard({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth,
		wizard: params.provider.wizard,
		pushDiagnostic: params.pushDiagnostic
	});
	const catalog = params.provider.catalog;
	const { wizard: _ignoredWizard, docsPath: _ignoredDocsPath, aliases: _ignoredAliases, envVars: _ignoredEnvVars, catalog: _ignoredCatalog, ...restProvider } = params.provider;
	return {
		...restProvider,
		id,
		label: normalizeOptionalString(params.provider.label) ?? id,
		...docsPath ? { docsPath } : {},
		...aliases ? { aliases } : {},
		...deprecatedProfileIds ? { deprecatedProfileIds } : {},
		...oauthProfileIdRepairs ? { oauthProfileIdRepairs } : {},
		...envVars ? { envVars } : {},
		auth,
		...catalog ? { catalog } : {},
		...wizard ? { wizard } : {}
	};
}
//#endregion
//#region src/plugins/registry-registrars-providers.ts
function createProviderRegistrars(state) {
	const { registry, registryParams, pushDiagnostic, registerSynthesizedTextModelCatalogProvider, registerSynthesizedMediaModelCatalogProvider, registerSynthesizedVoiceModelCatalogProvider } = state;
	const registerProvider = (record, provider) => {
		const normalizedProvider = normalizeRegisteredProvider({
			pluginId: record.id,
			source: record.source,
			provider,
			pushDiagnostic
		});
		if (!normalizedProvider) return;
		const id = normalizedProvider.id;
		const existing = registry.providers.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `provider already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		if (!record.providerIds.includes(id)) record.providerIds.push(id);
		registry.providers.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: normalizedProvider,
			source: record.source,
			rootDir: record.rootDir
		});
		registerSynthesizedTextModelCatalogProvider({
			record,
			provider: normalizedProvider
		});
	};
	const registerAgentHarness$1 = (record, harness) => {
		const id = normalizeOptionalString(harness?.id) ?? "";
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent harness registration missing id"
			});
			return;
		}
		if (typeof harness.supports !== "function" || typeof harness.runAttempt !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent harness "${id}" registration missing required runtime methods`
			});
			return;
		}
		const existing = registryParams.activateGlobalSideEffects === false ? registry.agentHarnesses.find((entry) => entry.harness.id === id) : getRegisteredAgentHarness(id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent harness already registered: ${id}${ownerDetail}`
			});
			return;
		}
		const normalizedHarness = {
			...harness,
			id,
			pluginId: harness.pluginId ?? record.id
		};
		if (registryParams.activateGlobalSideEffects !== false) registerAgentHarness(normalizedHarness, { ownerPluginId: record.id });
		record.agentHarnessIds.push(id);
		registry.agentHarnesses.push({
			pluginId: record.id,
			pluginName: record.name,
			harness: normalizedHarness,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCliBackend = (record, backend) => {
		const id = backend.id.trim();
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "cli backend registration missing id"
			});
			return;
		}
		const existing = registry.cliBackends.find((entry) => entry.backend.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `cli backend already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		registry.cliBackends.push({
			pluginId: record.id,
			pluginName: record.name,
			backend: {
				...backend,
				id
			},
			source: record.source,
			rootDir: record.rootDir
		});
		record.cliBackendIds.push(id);
	};
	const registerTextTransforms = (record, transforms) => {
		if ((!transforms.input || transforms.input.length === 0) && (!transforms.output || transforms.output.length === 0)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "text transform registration has no input or output replacements"
			});
			return;
		}
		registry.textTransforms.push({
			pluginId: record.id,
			pluginName: record.name,
			transforms,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerEmbeddingProvider$1 = (record, adapter) => {
		const id = adapter.id.trim();
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "embedding provider registration missing id"
			});
			return;
		}
		if (!(record.contracts?.embeddingProviders ?? []).includes(id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.embeddingProviders for adapter: ${id}`
			});
			return;
		}
		const existing = registryParams.activateGlobalSideEffects === false ? registry.embeddingProviders.find((entry) => entry.provider.id === id) : getRegisteredEmbeddingProvider(id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `embedding provider already registered: ${id}${ownerDetail}`
			});
			return;
		}
		if (registryParams.activateGlobalSideEffects !== false) registerEmbeddingProvider(adapter, { ownerPluginId: record.id });
		registry.embeddingProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: adapter,
			source: record.source,
			rootDir: record.rootDir
		});
		if (!record.embeddingProviderIds.includes(id)) record.embeddingProviderIds.push(id);
	};
	const registerUniqueProviderLike = (params) => {
		const id = params.provider.id.trim();
		const { record, kindLabel } = params;
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `${kindLabel} registration missing id`
			});
			return false;
		}
		const existing = params.registrations.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `${kindLabel} already registered: ${id} (${existing.pluginId})`
			});
			return false;
		}
		if (!params.ownedIds.includes(id)) params.ownedIds.push(id);
		params.registrations.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: params.provider,
			source: record.source,
			rootDir: record.rootDir
		});
		return true;
	};
	const registerWorkerProvider = (record, provider) => {
		const reject = (message) => pushDiagnostic({
			level: "error",
			pluginId: record.id,
			source: record.source,
			message
		});
		const validation = validateWorkerProviderContract(provider, record.contracts?.workerProviders ?? []);
		if (!validation.ok) {
			reject(validation.message);
			return;
		}
		const { id } = validation;
		const existing = registry.workerProviders.get(id);
		if (existing) {
			reject(`worker provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		registry.workerProviders.set(id, {
			pluginId: record.id,
			pluginName: record.name,
			provider,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSpeechProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "speech provider",
			registrations: registry.speechProviders,
			ownedIds: record.speechProviderIds
		})) registerSynthesizedVoiceModelCatalogProvider({
			record,
			provider,
			capabilities: { tts: true },
			modes: ["tts"]
		});
	};
	const registerRealtimeTranscriptionProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "realtime transcription provider",
			registrations: registry.realtimeTranscriptionProviders,
			ownedIds: record.realtimeTranscriptionProviderIds
		})) registerSynthesizedVoiceModelCatalogProvider({
			record,
			provider,
			capabilities: { realtime_transcription: true },
			modes: ["realtime_transcription"]
		});
	};
	const registerRealtimeVoiceProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "realtime voice provider",
			registrations: registry.realtimeVoiceProviders,
			ownedIds: record.realtimeVoiceProviderIds
		})) registerSynthesizedVoiceModelCatalogProvider({
			record,
			provider,
			capabilities: { realtime_voice: true },
			modes: ["realtime_voice"]
		});
	};
	const registerMediaUnderstandingProvider = (record, provider) => registerUniqueProviderLike({
		record,
		provider,
		kindLabel: "media provider",
		registrations: registry.mediaUnderstandingProviders,
		ownedIds: record.mediaUnderstandingProviderIds
	});
	const registerTranscriptSourceProvider = (record, provider) => registerUniqueProviderLike({
		record,
		provider,
		kindLabel: "transcripts source provider",
		registrations: registry.transcriptSourceProviders,
		ownedIds: record.transcriptSourceProviderIds
	});
	const registerImageGenerationProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "image-generation provider",
			registrations: registry.imageGenerationProviders,
			ownedIds: record.imageGenerationProviderIds
		})) registerSynthesizedMediaModelCatalogProvider({
			record,
			kind: "image_generation",
			provider
		});
	};
	const registerVideoGenerationProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "video-generation provider",
			registrations: registry.videoGenerationProviders,
			ownedIds: record.videoGenerationProviderIds
		})) registerSynthesizedMediaModelCatalogProvider({
			record,
			kind: "video_generation",
			provider
		});
	};
	const registerMusicGenerationProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "music-generation provider",
			registrations: registry.musicGenerationProviders,
			ownedIds: record.musicGenerationProviderIds
		})) registerSynthesizedMediaModelCatalogProvider({
			record,
			kind: "music_generation",
			provider
		});
	};
	const registerWebFetchProvider = (record, provider) => registerUniqueProviderLike({
		record,
		provider,
		kindLabel: "web fetch provider",
		registrations: registry.webFetchProviders,
		ownedIds: record.webFetchProviderIds
	});
	const registerWebSearchProvider = (record, provider) => registerUniqueProviderLike({
		record,
		provider,
		kindLabel: "web search provider",
		registrations: registry.webSearchProviders,
		ownedIds: record.webSearchProviderIds
	});
	const registerMigrationProvider = (record, provider) => registerUniqueProviderLike({
		record,
		provider,
		kindLabel: "migration provider",
		registrations: registry.migrationProviders,
		ownedIds: record.migrationProviderIds
	});
	return {
		registerProvider,
		registerAgentHarness: registerAgentHarness$1,
		registerCliBackend,
		registerTextTransforms,
		registerEmbeddingProvider: registerEmbeddingProvider$1,
		registerWorkerProvider,
		registerSpeechProvider,
		registerRealtimeTranscriptionProvider,
		registerRealtimeVoiceProvider,
		registerMediaUnderstandingProvider,
		registerTranscriptSourceProvider,
		registerImageGenerationProvider,
		registerVideoGenerationProvider,
		registerMusicGenerationProvider,
		registerWebFetchProvider,
		registerWebSearchProvider,
		registerMigrationProvider
	};
}
//#endregion
//#region src/plugins/agent-tool-result-middleware.ts
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES = ["openclaw", "codex"];
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET = new Set(AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES);
function normalizeAgentToolResultMiddlewareRuntime(runtime) {
	const normalized = runtime.trim().toLowerCase();
	return AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET.has(normalized) ? normalized : void 0;
}
function normalizeAgentToolResultMiddlewareRuntimes(options) {
	const requested = options?.runtimes;
	if (!requested) return [...AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES];
	const normalized = [];
	for (const runtime of requested) {
		const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
		if (!value) continue;
		if (!normalized.includes(value)) normalized.push(value);
	}
	return normalized;
}
function normalizeAgentToolResultMiddlewareRuntimeIds(runtimes) {
	const normalized = [];
	for (const runtime of runtimes ?? []) {
		const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
		if (value && !normalized.includes(value)) normalized.push(value);
	}
	return normalized;
}
function listAgentToolResultMiddlewares(runtime) {
	return getActivePluginRegistry()?.agentToolResultMiddlewares?.filter((entry) => entry.runtimes.includes(runtime)).map((entry) => entry.handler) ?? [];
}
/** Lists active Codex app-server extension factories from the plugin registry. */
function listCodexAppServerExtensionFactories() {
	return getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? [];
}
//#endregion
//#region src/plugins/registry-registrars-tools-hooks.ts
const LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT = getPluginCompatRecord("legacy-deactivate-hook-alias");
const LEGACY_SUBAGENT_SPAWNING_HOOK_COMPAT = getPluginCompatRecord("legacy-subagent-spawning-hook");
const activePluginHookRegistrations = resolveGlobalSingleton(Symbol.for("openclaw.activePluginHookRegistrations"), () => /* @__PURE__ */ new Map());
function formatLegacyDeactivateHookAliasDiagnostic() {
	const removeAfter = LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT.removeAfter ?? "a future breaking release";
	return `typed hook "deactivate" is deprecated (${LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT.code}); use "gateway_stop". This compatibility alias will be removed after ${removeAfter}.`;
}
function formatDeprecatedTypedHookDiagnostic(hookName) {
	if (!isDeprecatedPluginHookName(hookName) || hookName === "deactivate") return;
	const deprecation = DEPRECATED_PLUGIN_HOOKS[hookName];
	const compat = hookName === "subagent_spawning" ? LEGACY_SUBAGENT_SPAWNING_HOOK_COMPAT : void 0;
	const removeAfter = compat?.removeAfter ?? deprecation.removeAfter ?? "a future breaking release";
	return `typed hook "${hookName}" is deprecated (${compat?.code ?? "deprecated-plugin-hook"}); ${deprecation.reason} Use ${deprecation.replacement}. This compatibility hook will be removed after ${removeAfter}.`;
}
function canRegisterInstalledTrustedHook(record) {
	return record.origin === "bundled" || record.enabled && record.explicitlyEnabled === true;
}
function createToolHookRegistrars(state) {
	const { registry, registryParams, pluginHookRollback, pluginsWithChannelRegistrationConflict, pushDiagnostic } = state;
	const registerCodexAppServerExtensionFactory = (record, factory) => {
		if (record.origin !== "bundled") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "only bundled plugins can register Codex app-server extension factories"
			});
			return;
		}
		if (!(record.contracts?.embeddedExtensionFactories ?? []).includes("codex-app-server")) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must declare contracts.embeddedExtensionFactories: [\"codex-app-server\"] to register Codex app-server extension factories"
			});
			return;
		}
		if (typeof factory !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "codex app-server extension factory must be a function"
			});
			return;
		}
		if (registry.codexAppServerExtensionFactories.some((entry) => entry.pluginId === record.id && entry.rawFactory === factory)) return;
		const safeFactory = async (codex) => {
			try {
				await factory(codex);
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				registryParams.logger.warn(`[plugins] codex app-server extension factory failed for ${record.id}: ${detail}`);
			}
		};
		registry.codexAppServerExtensionFactories.push({
			pluginId: record.id,
			pluginName: record.name,
			rawFactory: factory,
			factory: safeFactory,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerAgentToolResultMiddleware = (record, handler, options, policy) => {
		if (typeof handler !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent tool result middleware must be a function"
			});
			return;
		}
		const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
		if (runtimes.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent tool result middleware must target at least one supported runtime"
			});
			return;
		}
		const declared = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
		const missing = runtimes.filter((runtime) => !declared.includes(runtime));
		if (missing.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.agentToolResultMiddleware for: ${missing.join(", ")}`
			});
			return;
		}
		if (!canRegisterInstalledTrustedHook(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must be explicitly enabled to register agent tool result middleware"
			});
			return;
		}
		const existing = registry.agentToolResultMiddlewares.find((entry) => entry.pluginId === record.id && entry.rawHandler === handler);
		if (existing) {
			existing.runtimes = uniqueValues([...existing.runtimes, ...runtimes]);
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName: "after_tool_call",
			policy
		});
		const safeHandler = async (event, ctx) => {
			try {
				return await withTimeout(Promise.resolve(handler(event, ctx)), timeoutMs ?? 0, `agent tool result middleware for ${record.id}`);
			} catch (error) {
				registryParams.logger.warn(`[plugins] agent tool result middleware failed for ${record.id}`);
				throw error;
			}
		};
		registry.agentToolResultMiddlewares.push({
			pluginId: record.id,
			pluginName: record.name,
			rawHandler: handler,
			handler: safeHandler,
			runtimes,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerTool = (record, tool, opts) => {
		if (pluginsWithChannelRegistrationConflict.has(record.id)) return;
		const declaredNames = normalizePluginToolContractNames(record.contracts);
		if (declaredNames.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must declare contracts.tools before registering agent tools"
			});
			return;
		}
		const names = [...opts?.names ?? [], ...opts?.name ? [opts.name] : []];
		const optional = opts?.optional === true;
		const factory = typeof tool === "function" ? tool : (_ctx) => tool;
		if (typeof tool !== "function") names.push(tool.name);
		const normalized = normalizePluginToolNames(names);
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames,
			toolNames: normalized
		});
		if (undeclared.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.tools for: ${undeclared.join(", ")}`
			});
			return;
		}
		if (normalized.length > 0) record.toolNames.push(...normalized);
		registry.tools.push({
			pluginId: record.id,
			pluginName: record.name,
			factory,
			names: normalized,
			declaredNames,
			optional,
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerHook = (record, events, handler, opts, config, pluginConfig) => {
		const normalizedEvents = normalizeStringEntries(Array.isArray(events) ? events : [events]);
		const entry = opts?.entry ?? null;
		const hookName = entry?.hook.name ?? opts?.name?.trim();
		if (!hookName) throw new Error("hook registration missing name");
		const existingHook = registry.hooks.find((entryLocal) => entryLocal.entry.hook.name === hookName);
		if (existingHook) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `hook already registered: ${hookName} (${existingHook.pluginId})`
			});
			return;
		}
		const description = entry?.hook.description ?? opts?.description ?? "";
		const hookEntry = entry ? {
			...entry,
			hook: {
				...entry.hook,
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id
			},
			metadata: {
				...entry.metadata,
				events: normalizedEvents
			}
		} : {
			hook: {
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id,
				filePath: record.source,
				baseDir: path.dirname(record.source),
				handlerPath: record.source
			},
			frontmatter: {},
			metadata: { events: normalizedEvents },
			invocation: { enabled: true }
		};
		record.hookNames.push(hookName);
		registry.hooks.push({
			pluginId: record.id,
			entry: hookEntry,
			events: normalizedEvents,
			source: record.source
		});
		const hookSystemEnabled = config?.hooks?.internal?.enabled !== false;
		if (!registryParams.activateGlobalSideEffects || !hookSystemEnabled || opts?.register === false) return;
		const previousRegistrations = activePluginHookRegistrations.get(hookName) ?? [];
		for (const registration of previousRegistrations) unregisterInternalHook(registration.event, registration.handler);
		const nextRegistrations = [];
		for (const event of normalizedEvents) {
			const wrappedHandler = async (evt) => {
				const context = evt.context;
				const hadPluginConfig = Object.hasOwn(context, "pluginConfig");
				const previousPluginConfig = context.pluginConfig;
				context.pluginConfig = pluginConfig;
				try {
					return await handler({
						...evt,
						context
					});
				} finally {
					if (hadPluginConfig) context.pluginConfig = previousPluginConfig;
					else delete context.pluginConfig;
				}
			};
			registerInternalHook(event, wrappedHandler);
			nextRegistrations.push({
				event,
				handler: wrappedHandler
			});
		}
		activePluginHookRegistrations.set(hookName, nextRegistrations);
		const rollbackEntries = pluginHookRollback.get(record.id) ?? [];
		rollbackEntries.push({
			name: hookName,
			previousRegistrations: [...previousRegistrations]
		});
		pluginHookRollback.set(record.id, rollbackEntries);
	};
	const registerTypedHook = (record, hookName, handler, opts, policy) => {
		if (!isPluginHookName(hookName)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `unknown typed hook "${String(hookName)}" ignored`
			});
			return;
		}
		const effectiveHookName = hookName === "deactivate" ? "gateway_stop" : hookName;
		if (hookName === "deactivate") pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: formatLegacyDeactivateHookAliasDiagnostic()
		});
		else {
			const diagnostic = formatDeprecatedTypedHookDiagnostic(hookName);
			if (diagnostic) pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: diagnostic
			});
		}
		const effectiveHandler = handler;
		if (policy?.allowPromptInjection === false && isPromptInjectionHookName(effectiveHookName)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `typed hook "${effectiveHookName}" blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
			});
			return;
		}
		if (isConversationHookName(effectiveHookName)) {
			const explicitConversationAccess = policy?.allowConversationAccess;
			if (record.origin !== "bundled" && explicitConversationAccess !== true) {
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: `typed hook "${effectiveHookName}" blocked because non-bundled plugins must set plugins.entries.${record.id}.hooks.allowConversationAccess=true`
				});
				return;
			}
			if (record.origin === "bundled" && explicitConversationAccess === false) {
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: `typed hook "${effectiveHookName}" blocked by plugins.entries.${record.id}.hooks.allowConversationAccess=false`
				});
				return;
			}
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName: effectiveHookName,
			opts,
			policy
		});
		record.hookCount += 1;
		registry.typedHooks.push({
			pluginId: record.id,
			hookName: effectiveHookName,
			handler: effectiveHandler,
			priority: opts?.priority,
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			source: record.source
		});
	};
	const rollbackHooks = (pluginId) => {
		const hookRollbackEntries = pluginHookRollback.get(pluginId) ?? [];
		for (const entry of hookRollbackEntries.toReversed()) {
			const activeRegistrations = activePluginHookRegistrations.get(entry.name) ?? [];
			for (const registration of activeRegistrations) unregisterInternalHook(registration.event, registration.handler);
			if (entry.previousRegistrations.length === 0) {
				activePluginHookRegistrations.delete(entry.name);
				continue;
			}
			for (const registration of entry.previousRegistrations) registerInternalHook(registration.event, registration.handler);
			activePluginHookRegistrations.set(entry.name, [...entry.previousRegistrations]);
		}
		pluginHookRollback.delete(pluginId);
	};
	return {
		registerCodexAppServerExtensionFactory,
		registerAgentToolResultMiddleware,
		registerTool,
		registerHook,
		registerTypedHook,
		rollbackHooks
	};
}
//#endregion
//#region src/plugins/registry-registrars.ts
/** Compose domain registrars over one explicit mutable registry state. */
function createPluginRegistrars(state) {
	return {
		...createCapabilityRegistrars(state),
		...createToolHookRegistrars(state),
		...createNetworkRegistrars(state),
		...createProviderRegistrars(state),
		...createOperationRegistrars(state),
		...createHostRegistrars(state),
		...createMemoryRegistrars(state),
		registerModelCatalogProvider: state.registerModelCatalogProvider
	};
}
//#endregion
//#region src/plugin-state/plugin-blob-store.types.ts
var PluginBlobStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginBlobStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/plugin-state/plugin-blob-store.sqlite.ts
const MAX_PLUGIN_BLOB_BYTES_PER_ENTRY = 100 * 1024 * 1024;
const MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN = 512 * 1024 * 1024;
const MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN = 5e4;
function createError(params) {
	return new PluginBlobStoreError(params.message, {
		code: params.code,
		operation: params.operation,
		path: resolveOpenClawStateSqlitePath(params.env ?? process.env),
		cause: params.cause
	});
}
function wrapError(error, operation, fallbackCode, message, env) {
	return error instanceof PluginBlobStoreError ? error : createError({
		code: fallbackCode,
		operation,
		message,
		env,
		cause: error
	});
}
function openDatabase(operation, env) {
	try {
		return openOpenClawStateDatabase(env ? { env } : {});
	} catch (error) {
		throw wrapError(error, operation, "PLUGIN_BLOB_OPEN_FAILED", "Failed to open plugin blob store.", env);
	}
}
function kysely(db) {
	return getNodeSqliteKysely(db);
}
function selectLiveBlob(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"blob",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])));
}
function blobKeyExists(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select("entry_key").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key)) !== void 0;
}
function selectLiveInfo(db, params) {
	return executeSqliteQuerySync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
}
function selectExpiredKeyInfo(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key).where("expires_at", "is not", null).where("expires_at", "<=", params.now));
}
function selectLiveDescriptors(db, params) {
	let query = kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"namespace",
		"created_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]));
	if (params.namespace !== void 0) query = query.where("namespace", "=", params.namespace);
	if (params.excludeKey !== void 0) query = query.where("entry_key", "!=", params.excludeKey);
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
}
function selectStoredDescriptors(db, params) {
	let query = kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"namespace",
		"created_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId);
	if (params.namespace !== void 0) query = query.where("namespace", "=", params.namespace);
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
}
function selectStoredKeyDescriptor(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"namespace",
		"created_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
}
function deleteKey(db, params) {
	const result = executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
	return Number(result.numAffectedRows ?? 0);
}
function deleteKeys(db, params) {
	const batchSize = 500;
	for (let offset = 0; offset < params.keys.length; offset += batchSize) {
		const keys = params.keys.slice(offset, offset + batchSize);
		executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", keys));
	}
}
function deleteExpiredNamespace(db, params) {
	const result = executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", params.now));
	return Number(result.numAffectedRows ?? 0);
}
function totalBytes(rows) {
	return rows.reduce((total, row) => total + Number(row.size_bytes), 0);
}
function limitError$1(message, env) {
	return createError({
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register",
		message,
		env
	});
}
function assertProjectedLimits(params) {
	const namespaceRows = selectStoredDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace
	});
	const pluginRows = selectStoredDescriptors(params.db, { pluginId: params.write.pluginId });
	const previousBytes = params.existing ? Number(params.existing.size_bytes) : 0;
	const rowDelta = params.existing ? 0 : 1;
	if (namespaceRows.length + rowDelta > params.write.maxEntries) throw limitError$1("Plugin blob namespace reached its stored row limit.", params.write.env);
	if (totalBytes(namespaceRows) - previousBytes + params.write.bytes.byteLength > params.write.maxBytesPerNamespace) throw limitError$1("Plugin blob namespace reached its stored byte limit.", params.write.env);
	if (pluginRows.length + rowDelta > 5e4) throw limitError$1("Plugin blob store reached its per-plugin row limit.", params.write.env);
	if (totalBytes(pluginRows) - previousBytes + params.write.bytes.byteLength > 536870912) throw limitError$1("Plugin blob store reached its per-plugin byte limit.", params.write.env);
}
function deleteOldestUntilWithinLimits(params) {
	const namespaceRows = selectStoredDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace
	});
	let namespaceCount = namespaceRows.length;
	let namespaceBytes = totalBytes(namespaceRows);
	const namespaceKeysToDelete = [];
	const namespaceCandidates = selectLiveDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		now: params.now,
		excludeKey: params.write.key
	});
	for (const row of namespaceCandidates) {
		if (namespaceCount <= params.write.maxEntries && namespaceBytes <= params.write.maxBytesPerNamespace) break;
		namespaceKeysToDelete.push(row.entry_key);
		namespaceCount -= 1;
		namespaceBytes -= Number(row.size_bytes);
	}
	if (namespaceCount > params.write.maxEntries || namespaceBytes > params.write.maxBytesPerNamespace) throw limitError$1("Plugin blob namespace cannot satisfy its configured limits.", params.write.env);
	deleteKeys(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		keys: namespaceKeysToDelete
	});
	const pluginRows = selectStoredDescriptors(params.db, { pluginId: params.write.pluginId });
	let pluginCount = pluginRows.length;
	let pluginBytes = totalBytes(pluginRows);
	const liveNamespaceCandidates = selectLiveDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		now: params.now,
		excludeKey: params.write.key
	});
	const pluginKeysToDelete = [];
	for (const row of liveNamespaceCandidates) {
		if (pluginCount <= 5e4 && pluginBytes <= 536870912) break;
		pluginKeysToDelete.push(row.entry_key);
		pluginCount -= 1;
		pluginBytes -= Number(row.size_bytes);
	}
	if (pluginCount > 5e4 || pluginBytes > 536870912) throw limitError$1("Plugin blob store cannot satisfy its per-plugin limits.", params.write.env);
	deleteKeys(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		keys: pluginKeysToDelete
	});
}
function upsertBlob(db, params, now) {
	const expiresAt = (() => {
		if (params.ttlMs === void 0) return null;
		const resolved = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: now });
		if (resolved === void 0) throw createError({
			code: "PLUGIN_BLOB_INVALID_INPUT",
			operation: "register",
			message: "Plugin blob ttlMs cannot produce a valid expiry timestamp.",
			env: params.env
		});
		return resolved;
	})();
	const row = {
		plugin_id: params.pluginId,
		namespace: params.namespace,
		entry_key: params.key,
		metadata_json: params.metadataJson,
		blob: params.bytes,
		created_at: now,
		expires_at: expiresAt
	};
	executeSqliteQuerySync(db, kysely(db).insertInto("plugin_blob_entries").values(row).onConflict((conflict) => conflict.columns([
		"plugin_id",
		"namespace",
		"entry_key"
	]).doUpdateSet({
		metadata_json: (eb) => eb.ref("excluded.metadata_json"),
		blob: (eb) => eb.ref("excluded.blob"),
		created_at: (eb) => eb.ref("excluded.created_at"),
		expires_at: (eb) => eb.ref("excluded.expires_at")
	})));
}
function writeBlob(params, ifAbsent) {
	try {
		openDatabase("register", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const now = Date.now();
			if (ifAbsent && blobKeyExists(db, params)) return false;
			const existing = selectStoredKeyDescriptor(db, params);
			if (params.overflowPolicy === "reject-new") assertProjectedLimits({
				db,
				write: params,
				existing
			});
			upsertBlob(db, params, now);
			if (params.overflowPolicy === "evict-oldest") deleteOldestUntilWithinLimits({
				db,
				write: params,
				now
			});
			return true;
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "register", "PLUGIN_BLOB_WRITE_FAILED", "Failed to register plugin blob entry.", params.env);
	}
}
function pluginBlobRegister(params) {
	writeBlob(params, false);
}
function pluginBlobRegisterIfAbsent(params) {
	return writeBlob(params, true);
}
function pluginBlobLookup(params) {
	try {
		const { db } = openDatabase("lookup", params.env);
		return selectLiveBlob(db, {
			...params,
			now: Date.now()
		});
	} catch (error) {
		throw wrapError(error, "lookup", "PLUGIN_BLOB_READ_FAILED", "Failed to read plugin blob entry.", params.env);
	}
}
function pluginBlobEntries(params) {
	try {
		const { db } = openDatabase("entries", params.env);
		return selectLiveInfo(db, {
			...params,
			now: Date.now()
		});
	} catch (error) {
		throw wrapError(error, "entries", "PLUGIN_BLOB_READ_FAILED", "Failed to list plugin blob entries.", params.env);
	}
}
function pluginBlobDelete(params) {
	try {
		openDatabase("delete", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => deleteKey(db, params) > 0, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "delete", "PLUGIN_BLOB_WRITE_FAILED", "Failed to delete plugin blob entry.", params.env);
	}
}
function pluginBlobDeleteExpiredKey(params) {
	try {
		openDatabase("sweep", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const row = selectExpiredKeyInfo(db, {
				...params,
				now: Date.now()
			});
			if (!row) return;
			params.validateMetadataJson(row.metadata_json);
			deleteKey(db, params);
			return row;
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "sweep", "PLUGIN_BLOB_WRITE_FAILED", "Failed to delete expired plugin blob.", params.env);
	}
}
function pluginBlobDeleteExpired(params) {
	try {
		openDatabase("sweep", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const now = Date.now();
			const rows = executeSqliteQuerySync(db, kysely(db).selectFrom("plugin_blob_entries").select([
				"entry_key",
				"metadata_json",
				"created_at",
				"expires_at"
			]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", now).orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
			for (const row of rows) params.validateMetadataJson(row.metadata_json);
			deleteExpiredNamespace(db, {
				...params,
				now
			});
			return rows;
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "sweep", "PLUGIN_BLOB_WRITE_FAILED", "Failed to delete expired plugin blobs.", params.env);
	}
}
function pluginBlobClear(params) {
	try {
		openDatabase("clear", params.env);
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace));
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "clear", "PLUGIN_BLOB_WRITE_FAILED", "Failed to clear plugin blob entries.", params.env);
	}
}
//#endregion
//#region src/plugin-state/plugin-blob-store.ts
const namespaceOptionSignatures = /* @__PURE__ */ new Map();
function invalidInput$2(message, operation = "register") {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_INVALID_INPUT",
		operation
	});
}
function limitError(message) {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register"
	});
}
const validationErrors = (operation) => ({
	invalid: (message) => invalidInput$2(message, operation),
	limit: (message) => limitError(message)
});
function validateNamespace(value) {
	return validatePluginStoreNamespace({
		value,
		label: "plugin blob",
		errors: validationErrors("open")
	});
}
function validateKey(value, operation) {
	return validatePluginStoreKey({
		value,
		label: "plugin blob",
		errors: validationErrors(operation)
	});
}
function validatePositiveLimit(value, label, maximum) {
	const normalized = validatePluginStorePositiveInteger({
		value,
		label,
		errors: validationErrors("open")
	});
	if (normalized > maximum) throw invalidInput$2(`${label} must be <= ${maximum}`, "open");
	return normalized;
}
function validateOverflowPolicy(value) {
	if (value === void 0 || value === "evict-oldest") return "evict-oldest";
	if (value === "reject-new") return value;
	throw invalidInput$2("plugin blob overflowPolicy must be evict-oldest or reject-new", "open");
}
function validateTtl(value, operation) {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin blob ttlMs",
		errors: validationErrors(operation)
	});
}
function assertConsistentOptions(pluginId, namespace, signature) {
	const key = `${pluginId}\0${namespace}`;
	const existing = namespaceOptionSignatures.get(key);
	if (!existing) {
		namespaceOptionSignatures.set(key, signature);
		return;
	}
	if (existing.maxEntries !== signature.maxEntries || existing.maxBytesPerEntry !== signature.maxBytesPerEntry || existing.maxBytesPerNamespace !== signature.maxBytesPerNamespace || existing.overflowPolicy !== signature.overflowPolicy || existing.defaultTtlMs !== signature.defaultTtlMs) throw invalidInput$2(`plugin blob namespace ${namespace} for ${pluginId} was reopened with incompatible options`, "open");
}
function prepareBlob(params) {
	const key = validateKey(params.key, "register");
	if (!(params.bytes instanceof Uint8Array)) throw invalidInput$2("plugin blob bytes must be a Uint8Array");
	if (params.bytes.byteLength > params.maxBytesPerEntry) throw limitError(`plugin blob entry exceeds the configured ${params.maxBytesPerEntry} byte limit`);
	const metadataJson = serializePluginStoreJson({
		value: params.metadata,
		label: "plugin blob metadata",
		errors: validationErrors("register")
	});
	const ttlMs = validateTtl(params.opts?.ttlMs, "register") ?? params.defaultTtlMs;
	return {
		key,
		bytes: Uint8Array.from(params.bytes),
		metadataJson,
		...ttlMs !== void 0 ? { ttlMs } : {}
	};
}
function parseMetadata(raw, operation, env) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new PluginBlobStoreError("Plugin blob entry contains corrupt metadata JSON.", {
			code: "PLUGIN_BLOB_CORRUPT",
			operation,
			path: resolveOpenClawStateSqlitePath(env ?? process.env),
			cause: error
		});
	}
}
function storedInfoToEntryInfo(row, operation, env) {
	const expiresAt = normalizeSqliteNumber(row.expires_at);
	return {
		key: row.entry_key,
		metadata: parseMetadata(row.metadata_json, operation, env),
		sizeBytes: Number(row.size_bytes),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		...expiresAt != null ? { expiresAt } : {}
	};
}
function storedEntryToEntry(row, env) {
	return {
		...storedInfoToEntryInfo(row, "lookup", env),
		bytes: Uint8Array.from(row.blob)
	};
}
function createPluginBlobStoreInternal(pluginId, options, env) {
	if (pluginId.startsWith("core:")) throw invalidInput$2("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	const namespace = validateNamespace(options.namespace);
	const maxEntries = validatePositiveLimit(options.maxEntries, "plugin blob maxEntries", MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN);
	const maxBytesPerEntry = validatePositiveLimit(options.maxBytesPerEntry, "plugin blob maxBytesPerEntry", MAX_PLUGIN_BLOB_BYTES_PER_ENTRY);
	const maxBytesPerNamespace = validatePositiveLimit(options.maxBytesPerNamespace, "plugin blob maxBytesPerNamespace", MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN);
	if (maxBytesPerEntry > maxBytesPerNamespace) throw invalidInput$2("plugin blob maxBytesPerEntry must not exceed maxBytesPerNamespace", "open");
	const overflowPolicy = validateOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateTtl(options.defaultTtlMs, "open");
	assertConsistentOptions(pluginId, namespace, {
		maxEntries,
		maxBytesPerEntry,
		maxBytesPerNamespace,
		overflowPolicy,
		defaultTtlMs
	});
	const writeParams = (blob) => ({
		pluginId,
		namespace,
		key: blob.key,
		bytes: blob.bytes,
		metadataJson: blob.metadataJson,
		maxEntries,
		maxBytesPerNamespace,
		overflowPolicy,
		...blob.ttlMs !== void 0 ? { ttlMs: blob.ttlMs } : {},
		...env ? { env } : {}
	});
	return {
		async register(key, bytes, metadata, opts) {
			const blob = prepareBlob({
				key,
				bytes,
				metadata,
				maxBytesPerEntry,
				defaultTtlMs,
				opts
			});
			pluginBlobRegister(writeParams(blob));
		},
		async registerIfAbsent(key, bytes, metadata, opts) {
			const blob = prepareBlob({
				key,
				bytes,
				metadata,
				maxBytesPerEntry,
				defaultTtlMs,
				opts
			});
			return pluginBlobRegisterIfAbsent(writeParams(blob));
		},
		async lookup(key) {
			const row = pluginBlobLookup({
				pluginId,
				namespace,
				key: validateKey(key, "lookup"),
				...env ? { env } : {}
			});
			return row ? storedEntryToEntry(row, env) : void 0;
		},
		async entries() {
			return pluginBlobEntries({
				pluginId,
				namespace,
				...env ? { env } : {}
			}).map((row) => storedInfoToEntryInfo(row, "entries", env));
		},
		async delete(key) {
			return pluginBlobDelete({
				pluginId,
				namespace,
				key: validateKey(key, "delete"),
				...env ? { env } : {}
			});
		},
		async deleteExpiredKey(key) {
			const row = pluginBlobDeleteExpiredKey({
				pluginId,
				namespace,
				key: validateKey(key, "sweep"),
				validateMetadataJson: (raw) => {
					parseMetadata(raw, "sweep", env);
				},
				...env ? { env } : {}
			});
			return row ? storedInfoToEntryInfo(row, "sweep", env) : void 0;
		},
		async deleteExpired() {
			return pluginBlobDeleteExpired({
				pluginId,
				namespace,
				validateMetadataJson: (raw) => {
					parseMetadata(raw, "sweep", env);
				},
				...env ? { env } : {}
			}).map((row) => storedInfoToEntryInfo(row, "sweep", env));
		},
		async clear() {
			pluginBlobClear({
				pluginId,
				namespace,
				...env ? { env } : {}
			});
		}
	};
}
/** Opens an async blob namespace for a non-core plugin id. */
function createPluginBlobStore(pluginId, options) {
	return createPluginBlobStoreInternal(pluginId, options);
}
//#endregion
//#region src/state/openclaw-state-lease.ts
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
const ACQUIRE_BACKOFF = {
	initialMs: 25,
	maxMs: 250,
	factor: 1.5,
	jitter: .25
};
const MIN_LEASE_MS$1 = 1e3;
const LEASE_DB_BUSY_TIMEOUT_MS = 0;
const RELEASE_RETRY_TIMEOUT_MS = 2e3;
function leaseError$1(code, message, cause) {
	return new OpenClawStateLeaseError(message, {
		code,
		...cause === void 0 ? {} : { cause }
	});
}
function invalidInput$1(message) {
	return leaseError$1("OPENCLAW_STATE_LEASE_INVALID_INPUT", message);
}
function validateDuration$1(value, label, minimum, maximum) {
	if (!Number.isInteger(value) || value < minimum || value > maximum) throw invalidInput$1(`${label} must be an integer between ${minimum} and ${maximum}`);
	return value;
}
function validateNonEmptyString(value, label) {
	if (typeof value !== "string" || !value.trim() || value.includes("\0")) throw invalidInput$1(`${label} must be a non-empty string without NUL bytes`);
	return value;
}
function validateOptions$1(options) {
	if (typeof options !== "object" || options === null || Array.isArray(options)) throw invalidInput$1("state lease options must be an object");
	if (options.signal !== void 0 && !(options.signal instanceof AbortSignal)) throw invalidInput$1("state lease signal must be an AbortSignal");
	const database = options.database;
	if (typeof database !== "object" || database === null || Array.isArray(database)) throw invalidInput$1("state lease database must be an object");
	if (database.scope !== "shared" && database.scope !== "agent") throw invalidInput$1("state lease database scope must be shared or agent");
	if (database.scope === "agent") validateNonEmptyString(database.agentId, "state lease agent database agentId");
	const leaseLabel = options.leaseLabel === void 0 ? "state lease" : validateNonEmptyString(options.leaseLabel, "state lease label");
	const operationLabel = options.operationLabel === void 0 ? "state.lease" : validateNonEmptyString(options.operationLabel, "state lease operationLabel");
	return {
		scope: validateNonEmptyString(options.scope, `${leaseLabel} scope`),
		key: validateNonEmptyString(options.key, `${leaseLabel} key`),
		database,
		leaseMs: validateDuration$1(options.leaseMs, `${leaseLabel} leaseMs`, MIN_LEASE_MS$1, MAX_TIMER_TIMEOUT_MS),
		waitMs: validateDuration$1(options.waitMs, `${leaseLabel} waitMs`, 0, MAX_TIMER_TIMEOUT_MS),
		signal: options.signal,
		leaseLabel,
		operationLabel
	};
}
function readBusyTimeout(database) {
	const row = database.prepare("PRAGMA busy_timeout").get();
	const value = row?.busy_timeout ?? row?.timeout;
	return typeof value === "bigint" ? Number(value) : Number(value ?? 0);
}
function withBusyTimeout(database, busyTimeoutMs, run) {
	const previousBusyTimeoutMs = readBusyTimeout(database);
	if (previousBusyTimeoutMs === busyTimeoutMs) return run();
	database.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}`);
	try {
		return run();
	} finally {
		if (database.isOpen) database.exec(`PRAGMA busy_timeout = ${previousBusyTimeoutMs}`);
	}
}
function withLeaseWriteTransaction(database, operationLabel, operation, busyTimeoutMs = LEASE_DB_BUSY_TIMEOUT_MS) {
	if (database.scope === "shared") {
		const stateDatabase = openOpenClawStateDatabase(database.options);
		const run = () => runOpenClawStateWriteTransaction(({ db }) => operation(db, getNodeSqliteKysely(db)), database.options, {
			operationLabel,
			busyTimeoutMs
		});
		return withBusyTimeout(stateDatabase.db, busyTimeoutMs, run);
	}
	const agentDatabase = openOpenClawAgentDatabase({ agentId: database.agentId });
	const run = () => runOpenClawAgentWriteTransaction(({ db }) => operation(db, getNodeSqliteKysely(db)), { agentId: database.agentId }, {
		operationLabel,
		busyTimeoutMs
	});
	return withBusyTimeout(agentDatabase.db, busyTimeoutMs, run);
}
function withLeaseRead(database, operation) {
	const sqlite = database.scope === "shared" ? openOpenClawStateDatabase(database.options).db : openOpenClawAgentDatabase({ agentId: database.agentId }).db;
	return operation(sqlite, getNodeSqliteKysely(sqlite));
}
function tryAcquire(params) {
	return withLeaseWriteTransaction(params.database, params.operationLabel, (db, kysely) => {
		const now = Date.now();
		executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", params.scope).where("lease_key", "=", params.key).where("expires_at", "<=", now));
		const expiresAt = now + params.leaseMs;
		return executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
			scope: params.scope,
			lease_key: params.key,
			owner: params.owner,
			expires_at: expiresAt,
			heartbeat_at: now,
			payload_json: null,
			created_at: now,
			updated_at: now
		}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doNothing())).numAffectedRows === 1n ? expiresAt : void 0;
	});
}
function renew(params) {
	return withLeaseWriteTransaction(params.database, params.operationLabel, (db, kysely) => {
		const now = Date.now();
		const expiresAt = now + params.leaseMs;
		if (executeSqliteQuerySync(db, kysely.updateTable("state_leases").set({
			expires_at: expiresAt,
			heartbeat_at: now,
			updated_at: now
		}).where("scope", "=", params.scope).where("lease_key", "=", params.key).where("owner", "=", params.owner).where("expires_at", ">", now)).numAffectedRows !== 1n) throw leaseError$1("OPENCLAW_STATE_LEASE_LOST", `${params.leaseLabel} ${params.scope}/${params.key} was lost`);
		return expiresAt;
	});
}
function assertLeaseOwnedInDatabase(database, kysely, params) {
	const now = Date.now();
	if (!executeSqliteQueryTakeFirstSync(database, kysely.selectFrom("state_leases").select("owner").where("scope", "=", params.scope).where("lease_key", "=", params.key).where("owner", "=", params.owner).where("expires_at", ">", now))) throw leaseError$1("OPENCLAW_STATE_LEASE_LOST", `${params.leaseLabel} ${params.scope}/${params.key} was lost`);
}
function verifyLeaseOwnership(params) {
	try {
		if (params.transaction) {
			assertLeaseOwnedInDatabase(params.transaction, getNodeSqliteKysely(params.transaction), params);
			return;
		}
		if (!params.database) throw new Error("state lease ownership check requires a database");
		withLeaseRead(params.database, (db, kysely) => assertLeaseOwnedInDatabase(db, kysely, params));
	} catch (error) {
		if (error instanceof OpenClawStateLeaseError) throw error;
		throw leaseError$1("OPENCLAW_STATE_LEASE_STORAGE_FAILED", `failed to verify ${params.leaseLabel} ${params.scope}/${params.key}`, error);
	}
}
function release(params) {
	withLeaseWriteTransaction(params.database, params.operationLabel, (db, kysely) => {
		executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", params.scope).where("lease_key", "=", params.key).where("owner", "=", params.owner));
	});
}
async function releaseBestEffort(params) {
	const deadline = performance.now() + RELEASE_RETRY_TIMEOUT_MS;
	let attempt = 0;
	while (true) try {
		release(params);
		return;
	} catch (error) {
		if (!isSqliteLockError(error)) return;
		const now = performance.now();
		if (now >= deadline) return;
		attempt += 1;
		await sleepWithAbort(Math.min(deadline - now, computeBackoff(ACQUIRE_BACKOFF, attempt)));
	}
}
function abortError(signal, label, leaseLabel) {
	return leaseError$1("OPENCLAW_STATE_LEASE_ABORTED", `${leaseLabel} ${label} was aborted`, signal.reason);
}
/** Run one trusted operation under a host-owned SQLite lease. */
async function withOpenClawStateLease(options, run) {
	const validated = validateOptions$1(options);
	if (validated.signal?.aborted) throw abortError(validated.signal, "acquisition", validated.leaseLabel);
	const owner = randomUUID();
	const deadline = performance.now() + validated.waitMs;
	let attempt = 0;
	let confirmedExpiresAt;
	while (confirmedExpiresAt === void 0) {
		if (validated.signal?.aborted) throw abortError(validated.signal, "acquisition", validated.leaseLabel);
		try {
			confirmedExpiresAt = tryAcquire({
				database: validated.database,
				operationLabel: validated.operationLabel,
				scope: validated.scope,
				key: validated.key,
				owner,
				leaseMs: validated.leaseMs,
				leaseLabel: validated.leaseLabel
			});
		} catch (error) {
			if (error instanceof OpenClawStateLeaseError) throw error;
			if (!isSqliteLockError(error)) throw leaseError$1("OPENCLAW_STATE_LEASE_STORAGE_FAILED", `failed to acquire ${validated.leaseLabel} ${validated.scope}/${validated.key}`, error);
		}
		const now = performance.now();
		if (confirmedExpiresAt !== void 0) {
			if (validated.signal?.aborted || validated.waitMs > 0 && now >= deadline) {
				await releaseBestEffort({
					database: validated.database,
					operationLabel: validated.operationLabel,
					scope: validated.scope,
					key: validated.key,
					owner,
					leaseLabel: validated.leaseLabel
				});
				if (validated.signal?.aborted) throw abortError(validated.signal, "acquisition", validated.leaseLabel);
				throw leaseError$1("OPENCLAW_STATE_LEASE_TIMEOUT", `timed out waiting for ${validated.leaseLabel} ${validated.scope}/${validated.key}`);
			}
			break;
		}
		if (now >= deadline) throw leaseError$1("OPENCLAW_STATE_LEASE_TIMEOUT", `timed out waiting for ${validated.leaseLabel} ${validated.scope}/${validated.key}`);
		attempt += 1;
		const delayMs = Math.min(deadline - now, computeBackoff(ACQUIRE_BACKOFF, attempt));
		try {
			await sleepWithAbort(delayMs, validated.signal);
		} catch (error) {
			if (validated.signal?.aborted) throw abortError(validated.signal, "acquisition", validated.leaseLabel);
			throw error;
		}
	}
	const identity = {
		scope: validated.scope,
		key: validated.key,
		owner,
		leaseLabel: validated.leaseLabel
	};
	const leaseLost = new AbortController();
	const operationSignal = validated.signal ? AbortSignal.any([validated.signal, leaseLost.signal]) : leaseLost.signal;
	const heartbeatMs = Math.max(250, Math.min(3e4, Math.floor(validated.leaseMs / 3)));
	let expiryTimer;
	const abortLost = (cause) => {
		if (!leaseLost.signal.aborted) leaseLost.abort(cause instanceof OpenClawStateLeaseError ? cause : leaseError$1("OPENCLAW_STATE_LEASE_LOST", `${validated.leaseLabel} ${validated.scope}/${validated.key} expired`, cause));
	};
	const scheduleExpiry = () => {
		if (expiryTimer) clearTimeout(expiryTimer);
		expiryTimer = setTimeout(() => abortLost(), Math.max(1, (confirmedExpiresAt ?? Date.now()) - Date.now()));
		expiryTimer.unref?.();
	};
	scheduleExpiry();
	const heartbeat = setInterval(() => {
		try {
			confirmedExpiresAt = renew({
				...identity,
				database: validated.database,
				operationLabel: validated.operationLabel,
				leaseMs: validated.leaseMs
			});
			scheduleExpiry();
		} catch (error) {
			if (error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_LOST") abortLost(error);
			else if (confirmedExpiresAt !== void 0 && Date.now() >= confirmedExpiresAt) abortLost(error);
		}
	}, heartbeatMs);
	heartbeat.unref?.();
	const assertOperationOwned = () => {
		if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
		if (validated.signal?.aborted) throw abortError(validated.signal, "operation", validated.leaseLabel);
		verifyLeaseOwnership({
			...identity,
			database: validated.database
		});
	};
	const assertOperationOwnedInTransaction = (database) => {
		if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
		if (validated.signal?.aborted) throw abortError(validated.signal, "operation", validated.leaseLabel);
		verifyLeaseOwnership({
			...identity,
			transaction: database
		});
	};
	try {
		let result;
		try {
			if (validated.signal?.aborted) throw abortError(validated.signal, "operation", validated.leaseLabel);
			assertOperationOwned();
			result = await run({
				signal: operationSignal,
				assertOwned: assertOperationOwned,
				assertOwnedInTransaction: assertOperationOwnedInTransaction
			});
		} catch (error) {
			if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
			if (validated.signal?.aborted) throw abortError(validated.signal, "operation", validated.leaseLabel);
			throw error;
		}
		if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
		if (validated.signal?.aborted) throw abortError(validated.signal, "operation", validated.leaseLabel);
		verifyLeaseOwnership({
			...identity,
			database: validated.database
		});
		return result;
	} finally {
		clearInterval(heartbeat);
		if (expiryTimer) clearTimeout(expiryTimer);
		await releaseBestEffort({
			...identity,
			database: validated.database,
			operationLabel: validated.operationLabel
		});
	}
}
//#endregion
//#region src/plugin-state/plugin-state-lease.ts
const MIN_LEASE_MS = 1e3;
function leaseError(code, message, cause) {
	return new PluginStateLeaseError(message, {
		code,
		...cause === void 0 ? {} : { cause }
	});
}
function invalidInput(message) {
	return leaseError("PLUGIN_STATE_LEASE_INVALID_INPUT", message);
}
function validateDuration(value, label, minimum, maximum) {
	if (!Number.isInteger(value) || value < minimum || value > maximum) throw invalidInput(`${label} must be an integer between ${minimum} and ${maximum}`);
	return value;
}
function validatePluginId(pluginId) {
	const normalized = pluginId.trim();
	if (!normalized || normalized.startsWith("core:") || normalized.includes("\0")) throw invalidInput("plugin lease requires a non-core plugin id");
	return normalized;
}
function validateOptions(pluginId, options) {
	if (typeof options !== "object" || options === null || Array.isArray(options)) throw invalidInput("plugin lease options must be an object");
	if (typeof options.namespace !== "string") throw invalidInput("plugin lease namespace must be a string");
	if (typeof options.key !== "string") throw invalidInput("plugin lease key must be a string");
	if (options.signal !== void 0 && !(options.signal instanceof AbortSignal)) throw invalidInput("plugin lease signal must be an AbortSignal");
	const errors = {
		invalid: (message) => invalidInput(message),
		limit: (message) => invalidInput(message)
	};
	const namespace = validatePluginStoreNamespace({
		value: options.namespace,
		label: "plugin lease",
		errors
	});
	const key = validatePluginStoreKey({
		value: options.key,
		label: "plugin lease",
		errors
	});
	const leaseMs = validateDuration(options.leaseMs, "plugin lease leaseMs", MIN_LEASE_MS, MAX_TIMER_TIMEOUT_MS);
	const waitMs = validateDuration(options.waitMs, "plugin lease waitMs", 0, MAX_TIMER_TIMEOUT_MS);
	const database = options.database;
	if (typeof database !== "object" || database === null || Array.isArray(database)) throw invalidInput("plugin lease database must be an object");
	if (database.scope !== "shared" && database.scope !== "agent") throw invalidInput("plugin lease database scope must be shared or agent");
	if (database.scope === "agent") {
		if (typeof database.agentId !== "string" || !database.agentId.trim()) throw invalidInput("plugin lease agent database requires a string agentId");
	}
	return {
		scope: `plugin:${validatePluginId(pluginId)}:${namespace}`,
		key,
		leaseMs,
		waitMs,
		database,
		signal: options.signal
	};
}
function mapErrorCode(code) {
	switch (code) {
		case "OPENCLAW_STATE_LEASE_INVALID_INPUT": return "PLUGIN_STATE_LEASE_INVALID_INPUT";
		case "OPENCLAW_STATE_LEASE_TIMEOUT": return "PLUGIN_STATE_LEASE_TIMEOUT";
		case "OPENCLAW_STATE_LEASE_ABORTED": return "PLUGIN_STATE_LEASE_ABORTED";
		case "OPENCLAW_STATE_LEASE_LOST": return "PLUGIN_STATE_LEASE_LOST";
		case "OPENCLAW_STATE_LEASE_STORAGE_FAILED": return "PLUGIN_STATE_LEASE_STORAGE_FAILED";
		default: throw new Error(`unsupported OpenClaw state lease error code: ${String(code)}`);
	}
}
function mapLeaseError(error) {
	if (!(error instanceof OpenClawStateLeaseError)) return error;
	return leaseError(mapErrorCode(error.code), error.message, error.cause);
}
function mapLeaseSignal(signal) {
	const controller = new AbortController();
	const forwardAbort = () => controller.abort(mapLeaseError(signal.reason));
	if (signal.aborted) forwardAbort();
	else signal.addEventListener("abort", forwardAbort, { once: true });
	return {
		signal: controller.signal,
		dispose: () => signal.removeEventListener("abort", forwardAbort)
	};
}
/** Run one trusted plugin operation under a host-owned SQLite lease. */
async function withPluginStateLease(pluginId, options, run) {
	const validated = validateOptions(pluginId, options);
	try {
		return await withOpenClawStateLease({
			...validated,
			leaseLabel: "plugin lease",
			operationLabel: "plugin-state.lease"
		}, async (lease) => {
			const mapped = mapLeaseSignal(lease.signal);
			try {
				return await run({
					signal: mapped.signal,
					assertOwned: () => {
						try {
							lease.assertOwned();
						} catch (error) {
							throw mapLeaseError(error);
						}
					}
				});
			} finally {
				mapped.dispose();
			}
		});
	} catch (error) {
		throw mapLeaseError(error);
	}
}
//#endregion
//#region src/plugins/registry-runtime.ts
const PLUGIN_GATEWAY_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"agent",
	"chat.abort",
	"chat.inject",
	"chat.send",
	"message.action",
	"plugins.sessionAction",
	"send",
	"sessions.abort",
	"sessions.compact",
	"sessions.compaction.branch",
	"sessions.compaction.restore",
	"sessions.branches.switch",
	"sessions.rewind",
	"sessions.fork",
	"sessions.create",
	"sessions.delete",
	"sessions.patch",
	"sessions.pluginPatch",
	"sessions.reset",
	"sessions.send",
	"sessions.steer",
	"wake"
]);
const PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"sessions.cleanup",
	"sessions.groups.delete",
	"sessions.groups.rename"
]);
function createPluginRuntimeResolver(state) {
	const { registry, registryParams } = state;
	const pluginRuntimeById = /* @__PURE__ */ new Map();
	const pluginRuntimeRecordById = /* @__PURE__ */ new Map();
	const addPluginRuntimeResolutionContext = (params) => {
		const { error, pluginId, prop } = params;
		if (error instanceof Error && error.message.startsWith("Unable to resolve plugin runtime module") && !error.message.includes("pluginRuntimeContext=")) {
			const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
			const propName = typeof prop === "symbol" ? prop.description ?? prop.toString() : String(prop);
			error.message = [
				error.message,
				`pluginRuntimeContext=pluginId:${pluginId}`,
				`property:${propName}`,
				...record?.source ? [`source:${record.source}`] : []
			].join("; ");
		}
		throw error;
	};
	const resolvePluginRuntime = (pluginId) => {
		const cached = pluginRuntimeById.get(pluginId);
		if (cached) return cached;
		const resolveHarnessRegistration = (harnessId) => {
			const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
			return normalizedHarnessId ? registry.agentHarnesses.find((entry) => normalizeOptionalAgentRuntimeId(entry.harness.id) === normalizedHarnessId) : void 0;
		};
		const resolveHarnessRegistrationForSessionKey = (sessionKey) => registry.agentHarnesses.find((entry) => {
			const rawHarnessId = normalizeOptionalString(entry.harness.id)?.toLowerCase();
			return rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId) && isAgentHarnessSessionKeyOwnedBy(sessionKey, rawHarnessId);
		});
		const assertOwnedHarness = (harnessId, action) => {
			const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
			if (!normalizedHarnessId) throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action}.`);
			const registration = resolveHarnessRegistration(normalizedHarnessId);
			if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${normalizedHarnessId}" before it can ${action}.`);
			if (registration.pluginId !== pluginId) throw new Error(`Agent harness "${normalizedHarnessId}" is owned by plugin "${registration.pluginId}", not "${pluginId}".`);
			return normalizedHarnessId;
		};
		const assertReservedSessionKeyOwned = (sessionKey, action) => {
			const normalizedSessionKey = normalizeOptionalString(sessionKey);
			if (!normalizedSessionKey || !isAgentHarnessSessionKey(normalizedSessionKey)) return;
			const registration = resolveHarnessRegistrationForSessionKey(normalizedSessionKey);
			if (!registration) throw new Error(`Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" because its harness is not registered.`);
			if (registration.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" owned by plugin "${registration.pluginId}".`);
		};
		const resolveLockedSessionHarnessRegistration = (sessionKey, entry, action) => {
			if (entry.modelSelectionLocked !== true) return;
			const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
			if (!harnessId) {
				const pluginOwnerId = normalizeOptionalString(entry.pluginOwnerId);
				if (pluginOwnerId) return { ownerPluginId: pluginOwnerId };
				throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action} locked sessions.`);
			}
			const registration = resolveHarnessRegistration(harnessId);
			if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${harnessId}" before it can ${action} locked sessions.`);
			if (isAgentHarnessSessionKey(sessionKey) && !isAgentHarnessSessionKeyOwnedBy(sessionKey, harnessId)) throw new Error(`Locked session "${sessionKey}" belongs to agent harness "${harnessId}", which does not match its reserved session key.`);
			return {
				ownerPluginId: registration.pluginId,
				harnessId,
				registration
			};
		};
		const assertLockedSessionEntryOwned = (sessionKey, entry, action) => {
			const resolved = resolveLockedSessionHarnessRegistration(sessionKey, entry, action);
			if (!resolved) return;
			if (resolved.ownerPluginId !== pluginId) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${resolved.ownerPluginId}", not "${pluginId}".`);
		};
		const assertSessionEntryOwned = (params) => {
			if (params.entry) {
				assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
				return;
			}
			assertReservedSessionKeyOwned(params.sessionKey, params.action);
		};
		const assertStoredSessionEntryOwned = (params) => {
			const entry = registryParams.runtime.agent.session.getSessionEntry({
				sessionKey: params.sessionKey,
				readConsistency: "latest",
				...params.agentId !== void 0 ? { agentId: params.agentId } : {},
				...params.env !== void 0 ? { env: params.env } : {},
				...params.storePath !== void 0 ? { storePath: params.storePath } : {}
			});
			assertSessionEntryOwned({
				action: params.action,
				entry,
				sessionKey: params.sessionKey
			});
			return entry;
		};
		const resolveStoredSessionExecutionOwner = (params) => {
			const entry = registryParams.runtime.agent.session.getSessionEntry({
				sessionKey: params.sessionKey,
				readConsistency: "latest",
				...params.agentId !== void 0 ? { agentId: params.agentId } : {},
				...params.storePath !== void 0 ? { storePath: params.storePath } : {}
			});
			const locked = entry ? resolveLockedSessionHarnessRegistration(params.sessionKey, entry, params.action) : void 0;
			if (!entry || !locked || locked.ownerPluginId === pluginId) {
				assertSessionEntryOwned({
					action: params.action,
					entry,
					sessionKey: params.sessionKey
				});
				return;
			}
			const registration = "registration" in locked ? locked.registration : void 0;
			if (!registration) throw new Error(`Locked session "${params.sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`);
			if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId)) assertLockedSessionEntryOwned(params.sessionKey, entry, params.action);
			return locked.ownerPluginId;
		};
		const assertSessionIdentitiesOwned = (params) => {
			const agentId = normalizeOptionalString(params.agentId);
			const storePath = normalizeOptionalString(params.storePath);
			const sessionKeys = /* @__PURE__ */ new Set();
			for (const value of params.sessionKeys ?? []) {
				const sessionKey = normalizeOptionalString(value);
				if (sessionKey) sessionKeys.add(sessionKey);
			}
			for (const sessionKey of sessionKeys) assertStoredSessionEntryOwned({
				action: params.action,
				sessionKey,
				...agentId ? { agentId } : {},
				...storePath ? { storePath } : {}
			});
			const sessionIds = /* @__PURE__ */ new Set();
			for (const value of params.sessionIds ?? []) {
				const sessionId = normalizeOptionalString(value);
				if (sessionId) sessionIds.add(sessionId);
			}
			const sessionFiles = /* @__PURE__ */ new Set();
			for (const value of params.sessionFiles ?? []) {
				const sessionFile = normalizeOptionalString(value);
				if (sessionFile) sessionFiles.add(sessionFile);
			}
			if (sessionIds.size === 0 && sessionFiles.size === 0) return;
			const entries = registryParams.runtime.agent.session.listSessionEntries({
				...agentId ? { agentId } : {},
				...storePath ? { storePath } : {}
			});
			for (const { sessionKey, entry } of entries) if (sessionIds.has(entry.sessionId) || (entry.sessionFile ? sessionFiles.has(entry.sessionFile) : false)) assertSessionEntryOwned({
				action: params.action,
				entry,
				sessionKey
			});
		};
		const resolveRunSessionExecutionOwner = (params) => {
			const target = params.sessionTarget;
			const targetSessionKey = normalizeOptionalString(target?.sessionKey);
			const directSessionKey = normalizeOptionalString(params.sessionKey);
			if (targetSessionKey && directSessionKey && targetSessionKey !== directSessionKey) throw new Error("Delegated agent execution requires one exact session key.");
			const sessionKey = targetSessionKey ?? directSessionKey;
			const storePath = normalizeOptionalString(target?.storePath);
			const agentId = normalizeOptionalString(target?.agentId ?? params.agentId);
			const entry = sessionKey ? registryParams.runtime.agent.session.getSessionEntry({
				sessionKey,
				readConsistency: "latest",
				...agentId ? { agentId } : {},
				...storePath ? { storePath } : {}
			}) : void 0;
			const targetSessionId = normalizeOptionalString(target?.sessionId);
			const targetAgentId = normalizeOptionalString(target?.agentId);
			const directSessionId = normalizeOptionalString(params.sessionId);
			const directAgentId = normalizeOptionalString(params.agentId);
			const sessionFile = normalizeOptionalString(params.sessionFile);
			if (target) {
				if (!(targetSessionKey === sessionKey && Boolean(storePath) && Boolean(entry) && targetSessionId === entry?.sessionId && directSessionId === entry?.sessionId && targetAgentId === directAgentId && (!sessionFile || sessionFile === entry?.sessionFile))) throw new Error(`Plugin "${pluginId}" may execute a persisted session only with its exact session target identity.`);
			}
			const locked = sessionKey && entry ? resolveLockedSessionHarnessRegistration(sessionKey, entry, "run") : void 0;
			const ownerPluginId = locked?.ownerPluginId;
			if (locked && entry && sessionKey && ownerPluginId !== pluginId) {
				const registration = "registration" in locked ? locked.registration : void 0;
				if (!registration) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`);
				if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId)) assertLockedSessionEntryOwned(sessionKey, entry, "run");
				const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
				const requestedRuntimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
				const identityMatches = Boolean(target) && targetSessionId === entry.sessionId && directSessionId === entry.sessionId;
				const harnessMatches = params.modelSelectionLocked === true && requestedHarnessId === locked.harnessId && requestedRuntimeOverride === locked.harnessId;
				if (!identityMatches || !harnessMatches) throw new Error(`Plugin "${pluginId}" may execute locked session "${sessionKey}" only with its exact persisted identity and harness.`);
				return ownerPluginId;
			}
			assertSessionIdentitiesOwned({
				action: "run",
				agentId: target?.agentId ?? params.agentId,
				sessionFiles: [params.sessionFile],
				sessionIds: [target?.sessionId ?? params.sessionId],
				sessionKeys: [target?.sessionKey ?? params.sessionKey],
				storePath: target?.storePath
			});
		};
		const assertGatewaySessionRequestOwned = (method, params) => {
			if (PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS.has(method)) throw new Error(`Plugin "${pluginId}" cannot request global session mutation "${method}".`);
			if (!PLUGIN_GATEWAY_SESSION_MUTATION_METHODS.has(method)) return;
			const request = params ?? {};
			const sessionKeys = [
				request.sessionKey,
				request.key,
				request.parentSessionKey
			];
			const sessionIds = [request.sessionId];
			assertSessionIdentitiesOwned({
				action: `request gateway method "${method}" for`,
				agentId: request.agentId,
				sessionIds,
				sessionKeys
			});
			if (method === "sessions.abort" && !sessionKeys.some((value) => normalizeOptionalString(value)) && !sessionIds.some((value) => normalizeOptionalString(value))) throw new Error(`Plugin "${pluginId}" must provide a session key when requesting gateway method "${method}".`);
		};
		const assertStoreEntryOwned = (params) => {
			if (params.entry.modelSelectionLocked === true) {
				assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
				return;
			}
			if (params.before?.modelSelectionLocked === true) {
				assertLockedSessionEntryOwned(params.sessionKey, params.before, params.action);
				return;
			}
			if (isAgentHarnessSessionKey(params.sessionKey) && !params.before) assertReservedSessionKeyOwned(params.sessionKey, params.action);
		};
		let scopedAgentRuntime;
		const runtime = new Proxy(registryParams.runtime, { get(target, prop, receiver) {
			const runWithPluginScope = (run) => {
				const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
				return record?.source ? withPluginRuntimePluginScope({
					pluginId,
					pluginSource: record.source,
					pluginOrigin: record.origin,
					pluginTrustedOfficialInstall: record.trustedOfficialInstall
				}, run) : withPluginRuntimePluginScope({ pluginId }, run);
			};
			const getRuntimeProperty = () => {
				try {
					return Reflect.get(target, prop, receiver);
				} catch (error) {
					return addPluginRuntimeResolutionContext({
						error,
						pluginId,
						prop
					});
				}
			};
			if (prop === "state") {
				const baseState = getRuntimeProperty();
				const assertPluginStateAllowed = (methodName) => {
					const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
					if (record?.origin !== "bundled" && record?.trustedOfficialInstall !== true) throw new Error(`${methodName} is only available for trusted plugins in this release.`);
				};
				return {
					...baseState,
					openBlobStore: (options) => {
						assertPluginStateAllowed("openBlobStore");
						return createPluginBlobStore(pluginId, options);
					},
					openKeyedStore: (options) => {
						assertPluginStateAllowed("openKeyedStore");
						return createPluginStateKeyedStore(pluginId, options);
					},
					openSyncKeyedStore: (options) => {
						assertPluginStateAllowed("openKeyedStore");
						return createPluginStateSyncKeyedStore(pluginId, options);
					},
					withLease: (options, run) => {
						assertPluginStateAllowed("withLease");
						return withPluginStateLease(pluginId, options, run);
					},
					openChannelIngressQueue: (options) => {
						assertPluginStateAllowed("openKeyedStore");
						const stateDir = options?.stateDir ?? baseState.resolveStateDir();
						return createChannelIngressQueue({
							...options,
							channelId: pluginId,
							stateDir
						});
					},
					openChannelIngressDrain: (options) => {
						assertPluginStateAllowed("openChannelIngressDrain");
						const stateDir = options.stateDir ?? baseState.resolveStateDir();
						const queue = options.queue ?? createChannelIngressQueue({
							channelId: pluginId,
							accountId: options.accountId,
							stateDir
						});
						const { queue: _queue, accountId: _accountId, stateDir: _stateDir, ...drainOptions } = options;
						return createChannelIngressDrain({
							...drainOptions,
							queue
						});
					}
				};
			}
			if (prop === "config") {
				const config = getRuntimeProperty();
				return {
					...config,
					current: () => runWithPluginScope(() => config.current()),
					mutateConfigFile: (params) => runWithPluginScope(() => config.mutateConfigFile(params)),
					replaceConfigFile: (params) => runWithPluginScope(() => config.replaceConfigFile(params))
				};
			}
			if (prop === "llm") {
				const llm = getRuntimeProperty();
				return {
					acquireLocalService: (...args) => withPluginRuntimePluginIdScope(pluginId, () => llm.acquireLocalService(...args)),
					complete: (params) => withPluginRuntimePluginIdScope(pluginId, () => llm.complete(params))
				};
			}
			if (prop === "gateway") {
				const gateway = getRuntimeProperty();
				return {
					isAvailable: () => runWithPluginScope(() => gateway.isAvailable()),
					request: async (method, params, options) => await runWithPluginScope(async () => {
						assertGatewaySessionRequestOwned(method, params);
						return await gateway.request(method, params, options);
					})
				};
			}
			if (prop === "nodes") {
				const nodes = getRuntimeProperty();
				return {
					list: (params) => runWithPluginScope(() => nodes.list(params)),
					invoke: (params) => runWithPluginScope(() => nodes.invoke(params))
				};
			}
			if (prop === "agent") {
				if (scopedAgentRuntime) return scopedAgentRuntime;
				const agent = getRuntimeProperty();
				const session = agent.session;
				const scopedSession = {
					resolveStorePath: session.resolveStorePath,
					getSessionEntry: session.getSessionEntry,
					listSessionEntries: session.listSessionEntries,
					createSessionEntry: async (params) => await runWithPluginScope(async () => {
						if ("agentHarnessId" in params.initialEntry === "cliBackendId" in params.initialEntry) throw new Error(`Plugin "${pluginId}" session creation requires exactly one runtime owner.`);
						if ("agentHarnessId" in params.initialEntry) {
							assertOwnedHarness(params.initialEntry.agentHarnessId, "create its sessions");
							assertReservedSessionKeyOwned(params.key, "create");
							return await session.createSessionEntry(params);
						}
						const cliInitial = params.initialEntry;
						const backend = registry.cliBackends.find((entry) => entry.backend.id === cliInitial.cliBackendId);
						if (!backend || backend.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" must own CLI backend "${cliInitial.cliBackendId}" to create its sessions.`);
						if (!params.key.startsWith(`plugin:${pluginId}:`)) throw new Error(`Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`);
						return await session.createSessionEntry({
							...params,
							initialEntry: {
								...cliInitial,
								pluginOwnerId: pluginId
							}
						});
					}),
					patchSessionEntry: async (params) => await runWithPluginScope(async () => {
						assertStoredSessionEntryOwned({
							action: "patch",
							sessionKey: params.sessionKey,
							...params.agentId !== void 0 ? { agentId: params.agentId } : {},
							...params.env !== void 0 ? { env: params.env } : {},
							...params.storePath !== void 0 ? { storePath: params.storePath } : {}
						});
						return await session.patchSessionEntry({
							...params,
							update: async (entry, context) => {
								const patch = await params.update(entry, context);
								if (!patch) return patch;
								const next = params.replaceEntry ? patch : {
									...entry,
									...patch
								};
								assertStoreEntryOwned({
									action: "patch",
									before: context.existingEntry ?? entry,
									entry: next,
									sessionKey: params.sessionKey
								});
								return patch;
							}
						});
					}),
					upsertSessionEntry: async (params) => await runWithPluginScope(async () => {
						const before = assertStoredSessionEntryOwned({
							action: "upsert",
							sessionKey: params.sessionKey,
							...params.agentId !== void 0 ? { agentId: params.agentId } : {},
							...params.env !== void 0 ? { env: params.env } : {},
							...params.storePath !== void 0 ? { storePath: params.storePath } : {}
						});
						assertStoreEntryOwned({
							action: "upsert",
							before,
							entry: params.entry,
							sessionKey: params.sessionKey
						});
						await session.upsertSessionEntry(params);
					}),
					runWithWorkAdmission: async (params, run) => await runWithPluginScope(async () => {
						const resolveCurrentExecutionOwner = () => resolveStoredSessionExecutionOwner({
							action: "admit work on",
							sessionKey: params.sessionKey,
							storePath: params.storePath
						});
						const ownerPluginId = resolveCurrentExecutionOwner();
						return await (ownerPluginId ? resolvePluginRuntime(ownerPluginId).agent.session : session).runWithWorkAdmission(params, async (signal) => {
							if (resolveCurrentExecutionOwner() !== ownerPluginId) throw new Error(`Session "${params.sessionKey}" changed execution ownership while starting work.`);
							return await runWithPluginScope(() => run(signal));
						});
					}),
					updateSessionStoreEntry: async (params) => await runWithPluginScope(async () => {
						assertStoredSessionEntryOwned({
							action: "update",
							sessionKey: params.sessionKey,
							storePath: params.storePath
						});
						return await session.updateSessionStoreEntry({
							...params,
							update: async (entry) => {
								const patch = await params.update(entry);
								if (!patch) return patch;
								assertStoreEntryOwned({
									action: "update",
									before: entry,
									entry: {
										...entry,
										...patch
									},
									sessionKey: params.sessionKey
								});
								return patch;
							}
						});
					})
				};
				const runEmbeddedAgent = async (params) => await runWithPluginScope(async () => {
					const ownerPluginId = resolveRunSessionExecutionOwner(params);
					return ownerPluginId ? await resolvePluginRuntime(ownerPluginId).agent.runEmbeddedAgent(params) : await agent.runEmbeddedAgent(params);
				});
				const scopedAgent = Object.create(Object.getPrototypeOf(agent), Object.getOwnPropertyDescriptors(agent));
				Object.defineProperties(scopedAgent, {
					runEmbeddedAgent: {
						configurable: true,
						enumerable: true,
						value: runEmbeddedAgent
					},
					runEmbeddedPiAgent: {
						configurable: true,
						enumerable: true,
						value: runEmbeddedAgent
					},
					session: {
						configurable: true,
						enumerable: true,
						value: scopedSession
					}
				});
				scopedAgentRuntime = scopedAgent;
				return scopedAgentRuntime;
			}
			if (prop !== "subagent") return getRuntimeProperty();
			const subagent = getRuntimeProperty();
			return {
				run: async (params) => await withPluginRuntimePluginIdScope(pluginId, async () => {
					assertSessionIdentitiesOwned({
						action: "run",
						sessionKeys: [params.sessionKey]
					});
					return await subagent.run(params);
				}),
				waitForRun: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.waitForRun(params)),
				getSessionMessages: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.getSessionMessages(params)),
				deleteSession: async (params) => await withPluginRuntimePluginIdScope(pluginId, async () => {
					assertStoredSessionEntryOwned({
						action: "delete",
						sessionKey: params.sessionKey
					});
					await subagent.deleteSession(params);
				})
			};
		} });
		pluginRuntimeById.set(pluginId, runtime);
		return runtime;
	};
	return {
		resolvePluginRuntime,
		setPluginRuntimeRecord: (record) => {
			pluginRuntimeRecordById.set(record.id, record);
		}
	};
}
//#endregion
//#region src/plugins/registry.ts
/** In-memory plugin registry builder and mutation API for plugin runtime registration. */
/**
* Compose the registry state, domain registrars, scoped runtime, and plugin API.
* Domain modules own validation and mutation; this function owns lifecycle wiring only.
*/
function createPluginRegistry(registryParams) {
	const state = createPluginRegistryState(registryParams);
	const registrars = createPluginRegistrars(state);
	const { createApi, deactivatePluginSideEffectGuards } = createPluginApiFactory(state, registrars, createPluginRuntimeResolver(state));
	const rollbackPluginGlobalSideEffects = (pluginId) => {
		deactivatePluginSideEffectGuards(pluginId);
		if (registryParams.activateGlobalSideEffects === false) return;
		clearPluginCommandsForPlugin(pluginId);
		clearPluginInteractiveHandlersForPlugin(pluginId);
		clearCodeModeNamespacesForPlugin(pluginId);
		clearContextEnginesForOwner(`plugin:${pluginId}`);
		registrars.rollbackHooks(pluginId);
	};
	return {
		registry: state.registry,
		createApi,
		rollbackPluginGlobalSideEffects,
		pushDiagnostic: state.pushDiagnostic,
		registerTool: registrars.registerTool,
		registerChannel: registrars.registerChannel,
		registerHostedMediaResolver: registrars.registerHostedMediaResolver,
		registerMcpServerConnectionResolver: registrars.registerMcpServerConnectionResolver,
		registerProvider: registrars.registerProvider,
		registerWorkerProvider: registrars.registerWorkerProvider,
		registerModelCatalogProvider: registrars.registerModelCatalogProvider,
		registerAgentHarness: registrars.registerAgentHarness,
		registerCliBackend: registrars.registerCliBackend,
		registerTextTransforms: registrars.registerTextTransforms,
		registerEmbeddingProvider: registrars.registerEmbeddingProvider,
		registerSpeechProvider: registrars.registerSpeechProvider,
		registerRealtimeTranscriptionProvider: registrars.registerRealtimeTranscriptionProvider,
		registerRealtimeVoiceProvider: registrars.registerRealtimeVoiceProvider,
		registerMediaUnderstandingProvider: registrars.registerMediaUnderstandingProvider,
		registerTranscriptSourceProvider: registrars.registerTranscriptSourceProvider,
		registerImageGenerationProvider: registrars.registerImageGenerationProvider,
		registerVideoGenerationProvider: registrars.registerVideoGenerationProvider,
		registerMusicGenerationProvider: registrars.registerMusicGenerationProvider,
		registerWebSearchProvider: registrars.registerWebSearchProvider,
		registerMigrationProvider: registrars.registerMigrationProvider,
		registerGatewayMethod: registrars.registerGatewayMethod,
		registerSessionCatalog: registrars.registerSessionCatalog,
		registerCli: registrars.registerCli,
		registerReload: registrars.registerReload,
		registerNodeHostCommand: registrars.registerNodeHostCommand,
		registerSecurityAuditCollector: registrars.registerSecurityAuditCollector,
		registerService: registrars.registerService,
		registerCommand: registrars.registerCommand,
		registerSessionExtension: registrars.registerSessionExtension,
		registerTrustedToolPolicy: registrars.registerTrustedToolPolicy,
		registerToolMetadata: registrars.registerToolMetadata,
		registerControlUiDescriptor: registrars.registerControlUiDescriptor,
		registerRuntimeLifecycle: registrars.registerRuntimeLifecycle,
		registerAgentEventSubscription: registrars.registerAgentEventSubscription,
		registerSessionSchedulerJob: registrars.registerSessionSchedulerJob,
		registerSessionAction: registrars.registerSessionAction,
		registerHook: registrars.registerHook,
		registerTypedHook: registrars.registerTypedHook
	};
}
//#endregion
export { createRuntimeHealthStore as A, registerMemoryEmbeddingProvider as B, projectPluginSessionExtensionsSync as C, resolveContextEngine as D, registerContextEngineForOwner as E, clearMemoryEmbeddingProviders as F, restoreRegisteredCompactionProviders as G, clearCompactionProviders as H, getMemoryEmbeddingProvider as I, getRegisteredMemoryEmbeddingProvider as L, createCodeModeNamespaceRuntime as M, describeCodeModeNamespacesForPrompt as N, resolveContextEngineOwnerPluginId as O, toCodeModeJsonSafe as P, listMemoryEmbeddingProviders as R, patchPluginSessionExtension as S, listContextEngineQuarantines as T, getCompactionProvider as U, restoreRegisteredMemoryEmbeddingProviders as V, listRegisteredCompactionProviders as W, voiceProviderSupportsModel as _, normalizeAgentToolResultMiddlewareRuntimeIds as a, drainPluginNextTurnInjectionContext as b, normalizePluginToolContractNames as c, getVoiceProviderConfig as d, providerMatchesId as f, resolveVoiceProviderCandidates as g, resolveVoiceModelRefs as h, listAgentToolResultMiddlewares as i, createCodeModeApiVirtualFiles as j, createRuntimeHealthRecordEnvelope as k, projectProviderCatalogResultToUnifiedTextRows as l, resolveSupportedVoiceModelRefs as m, withOpenClawStateLease as n, normalizeAgentToolResultMiddlewareRuntimes as o, resolvePrimaryVoiceProviderCandidate as p, listCodexAppServerExtensionFactories as r, findUndeclaredPluginToolNames as s, createPluginRegistry as t, copyProviderCatalogResultProjection as u, listMediaGenerationProviderModels as v, getContextEngineRegistration as w, getPluginSessionExtensionStateSync as x, synthesizeMediaGenerationCatalogEntries as y, listRegisteredMemoryEmbeddingProviders as z };
