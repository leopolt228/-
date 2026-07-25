import { c as resolveDefaultAgentId } from "../../agent-scope-config-S7z_Yn4H.js";
import "../../agent-runtime-Bt1w9GKE.js";
import { a as memoryAgentPredicate, n as MEMORY_TABLE_NAME, o as quoteLanceSqlString, r as hasAgentScopeColumn, t as MEMORY_AGENT_ID_COLUMN } from "../../lancedb-schema-DX2uM3rj.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region extensions/memory-lancedb/doctor-contract-api.ts
function resolveMemoryLanceDbPluginRoot(moduleUrl) {
	const artifactDir = path.dirname(fileURLToPath(moduleUrl));
	return path.basename(artifactDir) === "dist" ? path.dirname(artifactDir) : artifactDir;
}
const DEFAULT_PLUGIN_ROOT = resolveMemoryLanceDbPluginRoot(import.meta.url);
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function resolveHome(env) {
	return env.HOME?.trim() || os.homedir();
}
function resolveConfiguredDbPath(config, env, pluginRoot) {
	const pluginConfig = asRecord(config.plugins?.entries?.["memory-lancedb"]?.config);
	const configured = typeof pluginConfig?.dbPath === "string" ? pluginConfig.dbPath.trim() : "";
	if (!configured) return path.join(resolveHome(env), ".openclaw", "memory", "lancedb");
	if (configured.includes("://")) return configured;
	if (configured.startsWith("~")) return path.resolve(configured.replace(/^~(?=$|[\\/])/, resolveHome(env)));
	return path.resolve(pluginRoot, configured);
}
function resolveStorageOptions(config, env) {
	const rawOptions = asRecord(asRecord(config.plugins?.entries?.["memory-lancedb"]?.config)?.storageOptions);
	if (!rawOptions) return;
	return Object.fromEntries(Object.entries(rawOptions).map(([key, value]) => {
		if (typeof value !== "string") throw new Error(`memory-lancedb storageOptions.${key} must be a string`);
		return [key, value.replace(/\$\{([^}]+)\}/g, (_match, envName) => {
			const resolved = env[envName];
			if (!resolved) throw new Error(`Environment variable ${envName} is not set`);
			return resolved;
		})];
	}));
}
async function openMemoryTable(params) {
	const dbPath = resolveConfiguredDbPath(params.config, params.env, params.pluginRoot);
	if (!dbPath.includes("://") && !fs.existsSync(dbPath)) return {
		connection: null,
		table: null,
		dbPath
	};
	const lancedb = await import("@lancedb/lancedb");
	const storageOptions = resolveStorageOptions(params.config, params.env);
	const connection = await lancedb.connect(dbPath, storageOptions ? { storageOptions } : {});
	return {
		connection,
		table: (await connection.tableNames()).includes("memories") ? await connection.openTable(MEMORY_TABLE_NAME) : null,
		dbPath
	};
}
function createMemoryLanceDbStateMigrations(pluginRoot = DEFAULT_PLUGIN_ROOT) {
	return [{
		id: "memory-lancedb-agent-scope",
		label: "Memory LanceDB per-agent isolation",
		async detectLegacyState(params) {
			const opened = await openMemoryTable({
				...params,
				pluginRoot
			});
			try {
				if (!opened.table || hasAgentScopeColumn(await opened.table.schema())) return null;
				const defaultAgentId = resolveDefaultAgentId(params.config);
				const count = await opened.table.countRows();
				return { preview: [`- Memory LanceDB: assign ${count} legacy ${count === 1 ? "row" : "rows"} at ${opened.dbPath} to default agent ${defaultAgentId}`] };
			} finally {
				opened.table?.close();
				opened.connection?.close();
			}
		},
		async migrateLegacyState(params) {
			const opened = await openMemoryTable({
				...params,
				pluginRoot
			});
			try {
				if (!opened.table || hasAgentScopeColumn(await opened.table.schema())) return {
					changes: [],
					warnings: []
				};
				const defaultAgentId = resolveDefaultAgentId(params.config);
				const rowCount = await opened.table.countRows();
				await opened.table.addColumns([{
					name: MEMORY_AGENT_ID_COLUMN,
					valueSql: quoteLanceSqlString(defaultAgentId)
				}]);
				if (!hasAgentScopeColumn(await opened.table.schema()) || await opened.table.countRows(memoryAgentPredicate(defaultAgentId)) !== rowCount) throw new Error("LanceDB agent-scope migration verification failed");
				return {
					changes: [`Assigned ${rowCount} legacy Memory LanceDB ${rowCount === 1 ? "row" : "rows"} to default agent ${defaultAgentId}`],
					warnings: []
				};
			} finally {
				opened.table?.close();
				opened.connection?.close();
			}
		}
	}];
}
const stateMigrations = createMemoryLanceDbStateMigrations();
//#endregion
export { createMemoryLanceDbStateMigrations, resolveMemoryLanceDbPluginRoot, stateMigrations };
