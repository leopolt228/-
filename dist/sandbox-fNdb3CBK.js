import { r as getRuntimeConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import "./constants-DE6YR1VD.js";
import "./tool-policy-i1tw_WVy.js";
import "./config-ZQnZeh2f.js";
import "./runtime-status-BGFSWROK.js";
import "./sanitize-env-vars-I5Vtt7ek.js";
import { _ as removeBrowserRegistryEntry, g as readRegistry, h as readBrowserRegistry, v as removeRegistryEntry, x as resolveSandboxAgentId } from "./docker-HvYVm0Rf.js";
import { M as dockerSandboxBackendManager, o as getSandboxBackendManager, r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-Bt-RmqRU.js";
import "./context-BGxLoANr.js";
//#region src/agents/sandbox/manage.ts
/**
* CLI-facing sandbox management helpers.
*
* Lists and removes registered runtime and browser containers using backend manager status.
*/
function toBrowserDockerRuntimeEntry(entry) {
	return {
		...entry,
		backendId: "docker",
		runtimeLabel: entry.containerName,
		configLabelKind: "BrowserImage"
	};
}
/** Lists registered sandbox containers with live backend status and config-label match state. */
async function listSandboxContainers() {
	const config = getRuntimeConfig();
	const registry = await readRegistry();
	const results = [];
	for (const entry of registry.entries) {
		const manager = getSandboxBackendManager(entry.backendId ?? "docker");
		if (!manager) {
			results.push({
				...entry,
				running: false,
				imageMatch: true
			});
			continue;
		}
		const agentId = resolveSandboxAgentId(entry.sessionKey);
		const runtime = await manager.describeRuntime({
			entry,
			config,
			agentId
		});
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
/** Lists registered browser sandbox containers with live Docker status. */
async function listSandboxBrowsers() {
	const config = getRuntimeConfig();
	const registry = await readBrowserRegistry();
	const results = [];
	for (const entry of registry.entries) {
		const agentId = resolveSandboxAgentId(entry.sessionKey);
		const runtime = await dockerSandboxBackendManager.describeRuntime({
			entry: toBrowserDockerRuntimeEntry(entry),
			config,
			agentId
		});
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
/** Removes one sandbox container from its backend and registry. */
async function removeSandboxContainer(containerName) {
	const config = getRuntimeConfig();
	const entry = (await readRegistry()).entries.find((item) => item.containerName === containerName);
	if (entry) await getSandboxBackendManager(entry.backendId ?? "docker")?.removeRuntime({
		entry,
		config,
		agentId: resolveSandboxAgentId(entry.sessionKey)
	});
	await removeRegistryEntry(containerName);
}
/** Removes one browser sandbox container, registry entry, and any in-process bridge server. */
async function removeSandboxBrowserContainer(containerName) {
	const config = getRuntimeConfig();
	const entry = (await readBrowserRegistry()).entries.find((item) => item.containerName === containerName);
	await stopCachedBrowserBridgesForContainer(containerName);
	if (entry) await dockerSandboxBackendManager.removeRuntime({
		entry: toBrowserDockerRuntimeEntry(entry),
		config
	});
	await removeBrowserRegistryEntry(containerName);
}
//#endregion
export { removeSandboxContainer as i, listSandboxContainers as n, removeSandboxBrowserContainer as r, listSandboxBrowsers as t };
