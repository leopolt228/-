import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { c as normalizeE164 } from "./utils-K2PjeLaV.js";
import { i as loadConfig } from "./io-CEgS2K9F.js";
import "./config-BOMcY2yX.js";
import { i as handlePortError, n as describePortOwner, r as ensurePortAvailable, t as PortInUseError } from "./ports-BSfVrBR-.js";
import { l as resolveStorePath } from "./paths-BpMRJ7TJ.js";
import { i as saveSessionStore, o as loadSessionStore } from "./store-DDuGv_UJ.js";
import { n as resolveSessionKey, t as deriveSessionKey } from "./session-key-DBDgeX2u.js";
import { t as applyTemplate } from "./templating-CLmjS51i.js";
import { t as createDefaultDeps } from "./deps-BlJhVyB4.js";
//#region src/cli/wait.ts
function waitForever() {
	setInterval(() => {}, 1e6);
	return new Promise(() => {});
}
//#endregion
//#region src/library.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("./reply.runtime.js"));
const loadPromptRuntime = createLazyRuntimeModule(() => import("./prompt-BK0uRMl5.js"));
const loadBinariesRuntime = createLazyRuntimeModule(() => import("./binaries-DrM-E6p7.js"));
const loadExecRuntime = createLazyRuntimeModule(() => import("./exec-DIvreqG5.js"));
const loadWebChannelRuntime = createLazyRuntimeModule(() => import("./runtime-web-channel-plugin-B45evYpg.js"));
const getReplyFromConfig = async (...args) => (await loadReplyRuntime()).getReplyFromConfig(...args);
const promptYesNo = async (...args) => (await loadPromptRuntime()).promptYesNo(...args);
const ensureBinary = async (...args) => (await loadBinariesRuntime()).ensureBinary(...args);
const runExec = async (...args) => (await loadExecRuntime()).runExec(...args);
const runCommandWithTimeout = async (...args) => (await loadExecRuntime()).runCommandWithTimeout(...args);
const monitorWebChannel = async (...args) => (await loadWebChannelRuntime()).monitorWebChannel(...args);
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, saveSessionStore, waitForever };
