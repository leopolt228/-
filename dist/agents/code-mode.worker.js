import { o as isRecord } from "../record-coerce-DHZ4bFlT.js";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { parentPort, workerData } from "node:worker_threads";
import { EvalFlags, JSException, QuickJS } from "quickjs-wasi";
//#region src/agents/code-mode-swarm-controller-source.ts
/** Guest-side Swarm helpers injected into the isolated QuickJS controller. */
const CODE_MODE_SWARM_CONTROLLER_SOURCE = String.raw`
  class SwarmAgentError extends Error {
    constructor(runId, status, detail) {
      super("Swarm agent " + runId + " " + status + ": " + detail);
      this.name = "SwarmAgentError";
      this.runId = runId;
      this.status = status;
    }
  }

  function swarmNote(kind, value) {
    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError(kind + " note must be a non-empty string");
    }
    void request("swarmNote", [{ kind, text: value }]).catch(() => {});
  }

  async function runAgent(prompt, options = {}) {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new TypeError("agents.run prompt must be a non-empty string");
    }
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
      throw new TypeError("agents.run options must be an object");
    }
    if (options.phase !== undefined && (typeof options.phase !== "string" || !options.phase.trim())) {
      throw new TypeError("agents.run phase must be a non-empty string");
    }
    if (options.phase !== undefined) swarmNote("phase", options.phase);
    const spawned = await request("agentSpawn", [prompt, options]);
    const completion = await request("agentWait", [spawned.runId]);
    if (!completion || completion.status !== "done") {
      const runId = completion?.runId ?? spawned.runId ?? "unknown";
      const status = completion?.status ?? "failed";
      const detail = completion?.schemaError || completion?.result || "collector returned no result";
      throw new SwarmAgentError(runId, status, detail);
    }
    return options.schema !== undefined ? completion.structured : completion.result;
  }
`;
//#endregion
//#region src/agents/code-mode.worker.ts
/**
* QuickJS worker for Code Mode guest execution and suspended VM snapshots.
*/
const QUICKJS_WASM_PATH = createRequire(import.meta.url).resolve("quickjs-wasi/quickjs.wasm");
let quickJsWasmModulePromise;
var CodeModeWorkerFailure = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "CodeModeWorkerFailure";
		this.code = code;
	}
};
var CodeModeWorkerFailureWithOutput = class extends CodeModeWorkerFailure {
	constructor(code, message, output, options) {
		super(code, message, options);
		this.name = "CodeModeWorkerFailureWithOutput";
		this.output = output;
	}
};
var CodeModeGuestError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "CodeModeGuestError";
	}
};
function isQuickJsInterruptedError(error) {
	return error instanceof JSException && error.message === "interrupted";
}
function getQuickJsWasmModule() {
	quickJsWasmModulePromise ??= readFile(QUICKJS_WASM_PATH).then((bytes) => WebAssembly.compile(bytes));
	return quickJsWasmModulePromise;
}
function formatQuickJsError(name, message, stack) {
	const header = message ? `${name}: ${message}` : name;
	if (!stack || stack.split(/\r?\n/, 1)[0] === header) return header;
	return `${header}\n${stack}`;
}
function errorMessage(error) {
	if (error instanceof JSException) return formatQuickJsError(error.name, error.message, error.stack);
	if (error instanceof Error) return error.message || String(error);
	return String(error);
}
function toJsonSafe(value) {
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
const CONTROLLER_SOURCE = String.raw`
(() => {
  const output = [];
  const pending = new Map();
  const catalog = Array.isArray(globalThis.__openclawCatalog) ? globalThis.__openclawCatalog : [];
  const apiFiles = Array.isArray(globalThis.__openclawApiFiles) ? globalThis.__openclawApiFiles : [];
  const namespaceDescriptors = Array.isArray(globalThis.__openclawNamespaces) ? globalThis.__openclawNamespaces : [];
  const hostRequest = globalThis.__openclawHostRequest;
  delete globalThis.__openclawHostRequest;
  const bridgeSequences = new Map();

  function safe(value) {
    if (value === undefined) return null;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      if (value instanceof Error) {
        return { name: value.name, message: value.message };
      }
      if (value === null) return null;
      const type = typeof value;
      if (type === "string" || type === "number" || type === "boolean") return value;
      return String(value);
    }
  }

  function asText(value) {
    if (typeof value === "string") return value;
    const encoded = JSON.stringify(safe(value));
    return typeof encoded === "string" ? encoded : String(value);
  }

  function request(method, args) {
    const methodName = String(method);
    const sequence = (bridgeSequences.get(methodName) ?? 0) + 1;
    bridgeSequences.set(methodName, sequence);
    const bridgeId = "bridge:" + methodName + ":" + String(sequence);
    const id = String(hostRequest(methodName, JSON.stringify(safe(args ?? [])), bridgeId));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
  }

  ${CODE_MODE_SWARM_CONTROLLER_SOURCE}

  function namespaceFunction(namespaceId, path) {
    const callablePath = Object.freeze((Array.isArray(path) ? path : []).map((entry) => String(entry)));
    return (...args) => request("namespace", [namespaceId, callablePath, args]);
  }

  function deserializeNamespaceValue(namespaceId, value) {
    if (!value || typeof value !== "object") return null;
    if (value.kind === "function") {
      return namespaceFunction(namespaceId, Array.isArray(value.path) ? value.path.slice() : []);
    }
    if (value.kind === "array") {
      return Object.freeze((Array.isArray(value.items) ? value.items : []).map((item) => deserializeNamespaceValue(namespaceId, item)));
    }
    if (value.kind === "object") {
      const object = Object.create(null);
      for (const entry of Array.isArray(value.entries) ? value.entries : []) {
        const key = Array.isArray(entry) && typeof entry[0] === "string" ? entry[0] : "";
        if (!key) continue;
        Object.defineProperty(object, key, {
          value: deserializeNamespaceValue(namespaceId, entry[1]),
          enumerable: true,
        });
      }
      return Object.freeze(object);
    }
    return safe(value.value);
  }

  function settle(id, ok, payload) {
    const entry = pending.get(String(id));
    if (!entry) return false;
    pending.delete(String(id));
    let parsed = null;
    try {
      parsed = JSON.parse(String(payload));
    } catch {
      parsed = String(payload);
    }
    if (ok) {
      entry.resolve(parsed);
    } else {
      const error = new Error(typeof parsed === "string" ? parsed : parsed?.message ?? "nested tool failed");
      entry.reject(error);
    }
    return true;
  }

  const baseTools = Object.create(null);
  Object.defineProperties(baseTools, {
    search: { value: (query, options) => request("search", [query, options]), enumerable: true },
    describe: { value: (id) => request("describe", [id]), enumerable: true },
    call: { value: (id, input) => request("call", [id, input]), enumerable: true },
    callValue: { value: (id, input) => request("callValue", [id, input]), enumerable: true },
  });

  if (globalThis.__openclawSwarmEnabled === true) {
    Object.defineProperties(globalThis, {
      agents: {
        value: Object.freeze({ run: runAgent }),
        enumerable: true,
      },
      phase: { value: (title) => swarmNote("phase", title), enumerable: true },
      log: { value: (message) => swarmNote("log", message), enumerable: true },
    });
  }

  function normalizeApiPath(value) {
    const text = String(value ?? "").trim().replace(/^\/+/, "");
    if (!text || text.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
      throw new Error("invalid API file path");
    }
    return text;
  }

  const apiFileMap = new Map();
  for (const file of apiFiles) {
    if (!file || typeof file !== "object") continue;
    const path = typeof file.path === "string" ? file.path : "";
    const content = typeof file.content === "string" ? file.content : "";
    if (!path || !content) continue;
    apiFileMap.set(path, Object.freeze({
      path,
      content,
      description: typeof file.description === "string" ? file.description : undefined,
      bytes: file.bytes,
    }));
  }
  const api = Object.freeze({
    list: async (prefix = "") => {
      // list takes a directory prefix, so tolerate a trailing slash (API.list("mcp/"))
      // that read's exact-path normalizer would otherwise reject as an empty segment.
      const rawPrefix = prefix == null ? "" : String(prefix).trim().replace(/\/+$/, "");
      const normalizedPrefix = rawPrefix === "" ? "" : normalizeApiPath(rawPrefix);
      const files = [...apiFileMap.values()]
        .filter((file) => !normalizedPrefix || file.path === normalizedPrefix || file.path.startsWith(normalizedPrefix.replace(/\/?$/, "/")))
        .map((file) => Object.freeze({
          path: file.path,
          description: file.description,
          bytes: file.bytes,
        }));
      return { files };
    },
    read: async (path) => {
      const normalizedPath = normalizeApiPath(path);
      const file = apiFileMap.get(normalizedPath);
      if (!file) throw new Error("Unknown API file: " + normalizedPath);
      return file;
    },
  });

  const safeNameCounts = new Map();
  for (const tool of catalog) {
    const name = typeof tool?.name === "string" ? tool.name : "";
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) continue;
    safeNameCounts.set(name, (safeNameCounts.get(name) ?? 0) + 1);
  }
  for (const tool of catalog) {
    const name = typeof tool?.name === "string" ? tool.name : "";
    const id = typeof tool?.id === "string" ? tool.id : "";
    if (!id || safeNameCounts.get(name) !== 1 || Object.prototype.hasOwnProperty.call(baseTools, name)) {
      continue;
    }
    Object.defineProperty(baseTools, name, {
      value: (input) => request("call", [id, input]),
      enumerable: true,
    });
  }

  const namespaceGlobals = Object.create(null);
  for (const descriptor of namespaceDescriptors) {
    const id = typeof descriptor?.id === "string" ? descriptor.id : "";
    const globalName = typeof descriptor?.globalName === "string" ? descriptor.globalName : "";
    if (!id || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(globalName)) continue;
    const scope = deserializeNamespaceValue(id, descriptor.scope);
    Object.defineProperty(namespaceGlobals, globalName, {
      value: scope,
      enumerable: true,
    });
    const existingGlobal = Object.getOwnPropertyDescriptor(globalThis, globalName);
    if (existingGlobal && existingGlobal.configurable === false) continue;
    Object.defineProperty(globalThis, globalName, {
      value: scope,
      enumerable: true,
      configurable: true,
    });
  }

  Object.defineProperties(globalThis, {
    ALL_TOOLS: { value: Object.freeze(catalog.slice()), enumerable: true },
    API: { value: api, enumerable: true },
    namespaces: { value: Object.freeze(namespaceGlobals), enumerable: true },
    tools: { value: Object.freeze(baseTools), enumerable: true },
    text: { value: (value) => output.push({ type: "text", text: asText(value) }), enumerable: true },
    json: { value: (value) => output.push({ type: "json", value: safe(value) }), enumerable: true },
    yield_control: { value: (reason) => request("yield", [reason]), enumerable: true },
    __openclawSettleBridge: { value: settle },
    __openclawTakeOutput: { value: () => output.splice(0) },
  });
})();
`;
function buildUserSource(code) {
	return `globalThis.__openclawResult = (async () => {\n${code}\n})()`;
}
function createHostRequestHandler(params) {
	return (methodHandle, argsHandle, bridgeIdHandle) => {
		if (params.pendingRequests.length >= params.config.maxPendingToolCalls) throw new Error("too many pending code mode tool calls");
		const method = methodHandle.toString();
		if (method !== "search" && method !== "describe" && method !== "call" && method !== "callValue" && method !== "yield" && method !== "namespace" && method !== "agentSpawn" && method !== "agentWait" && method !== "swarmNote") throw new Error("unsupported code mode bridge method");
		let args;
		try {
			args = JSON.parse(argsHandle.toString());
		} catch {
			args = [];
		}
		const requestedId = bridgeIdHandle?.toString() ?? "undefined";
		const id = requestedId === "undefined" ? `bridge:legacy:${randomUUID()}` : requestedId;
		if (!(requestedId === "undefined" ? /^bridge:legacy:[0-9a-f-]+$/u.test(id) : id.startsWith(`bridge:${method}:`) && /^bridge:[A-Za-z]+:[1-9]\d*$/u.test(id))) throw new Error("invalid code mode bridge id");
		if (params.pendingRequests.some((request) => request.id === id)) throw new Error("duplicate code mode bridge id");
		params.pendingRequests.push({
			id,
			method,
			args: Array.isArray(args) ? args : []
		});
		return params.vm.newString(id);
	};
}
async function createVm(params) {
	const startedAt = Date.now();
	let timedOut = false;
	const deadlineReached = () => Date.now() - startedAt >= params.config.timeoutMs;
	const vm = await QuickJS.create({
		wasm: await getQuickJsWasmModule(),
		memoryLimit: params.config.memoryLimitBytes,
		timezoneOffset: 0,
		interruptHandler: () => {
			timedOut = deadlineReached();
			return timedOut;
		}
	});
	vm.hostToHandle(params.catalog).consume((handle) => vm.global.setProp("__openclawCatalog", handle));
	vm.hostToHandle(params.namespaces).consume((handle) => vm.global.setProp("__openclawNamespaces", handle));
	vm.hostToHandle(params.apiFiles).consume((handle) => vm.global.setProp("__openclawApiFiles", handle));
	vm.hostToHandle(params.swarmEnabled).consume((handle) => vm.global.setProp("__openclawSwarmEnabled", handle));
	vm.newFunction("__openclawHostRequest", createHostRequestHandler({
		vm,
		pendingRequests: params.pendingRequests,
		config: params.config
	})).consume((hostRequest) => vm.global.setProp("__openclawHostRequest", hostRequest));
	vm.evalCode(CONTROLLER_SOURCE, "openclaw-code-mode:controller.js").dispose();
	return {
		vm,
		didTimeout: () => timedOut || deadlineReached()
	};
}
async function restoreVm(params) {
	const startedAt = Date.now();
	let timedOut = false;
	const deadlineReached = () => Date.now() - startedAt >= params.config.timeoutMs;
	const snapshot = QuickJS.deserializeSnapshot(params.snapshotBytes);
	const vm = await QuickJS.restore(snapshot, {
		wasm: await getQuickJsWasmModule(),
		memoryLimit: params.config.memoryLimitBytes,
		timezoneOffset: 0,
		interruptHandler: () => {
			timedOut = deadlineReached();
			return timedOut;
		}
	});
	vm.registerHostCallback("__openclawHostRequest", createHostRequestHandler({
		vm,
		pendingRequests: params.pendingRequests,
		config: params.config
	}));
	return {
		vm,
		didTimeout: () => timedOut || deadlineReached()
	};
}
function takeOutput(vm) {
	return vm.global.getProp("__openclawTakeOutput").consume((take) => vm.callFunction(take, vm.undefined).consume((output) => {
		const dumped = vm.dump(output);
		return Array.isArray(dumped) ? dumped : [];
	}));
}
function takeOutputSafely(vm) {
	try {
		return takeOutput(vm);
	} catch {
		return [];
	}
}
function throwWorkerFailureWithOutput(params) {
	const timedOut = params.didTimeout() || isQuickJsInterruptedError(params.error);
	const failureOutput = params.output.length > 0 ? params.output : takeOutputSafely(params.vm);
	if (timedOut) throw new CodeModeWorkerFailureWithOutput("timeout", "code mode timeout exceeded", failureOutput, { cause: params.error });
	if (params.error instanceof CodeModeWorkerFailure) throw new CodeModeWorkerFailureWithOutput(params.error.code, params.error.message, failureOutput, { cause: params.error });
	if (failureOutput.length > 0) throw new CodeModeWorkerFailureWithOutput("internal_error", errorMessage(params.error), failureOutput, { cause: params.error });
	throw params.error;
}
async function readCompletedResult(vm, resultHandle) {
	if (!resultHandle.isPromise) return toJsonSafe(vm.dump(resultHandle));
	const settled = await vm.resolvePromise(resultHandle);
	if ("error" in settled) return settled.error.consume((error) => {
		const dumped = vm.dump(error);
		throw new CodeModeGuestError(dumped instanceof Error ? formatQuickJsError(dumped.name, dumped.message, dumped.stack) : errorMessage(dumped));
	});
	return settled.value.consume((value) => toJsonSafe(vm.dump(value)));
}
function waitingResult(params) {
	const snapshotBytes = QuickJS.serializeSnapshot(params.vm.snapshot());
	if (snapshotBytes.byteLength > params.config.maxSnapshotBytes) throw new CodeModeWorkerFailure("snapshot_limit_exceeded", "code mode snapshot limit exceeded");
	return {
		status: "waiting",
		snapshotBytes,
		pendingRequests: params.pendingRequests,
		output: params.output
	};
}
async function runVmExecution(params) {
	let output = [];
	try {
		params.prepare();
		params.vm.executePendingJobs();
		output = takeOutput(params.vm);
		const resultHandle = params.vm.global.getProp("__openclawResult");
		try {
			if (params.pendingRequests.length > 0) return waitingResult({
				vm: params.vm,
				pendingRequests: params.pendingRequests,
				output,
				config: params.config
			});
			if (resultHandle.isPromise && resultHandle.promiseState === 0) throw new Error("code mode promise is pending without host work");
			return {
				status: "completed",
				value: await readCompletedResult(params.vm, resultHandle),
				output
			};
		} finally {
			resultHandle.dispose();
		}
	} catch (error) {
		return throwWorkerFailureWithOutput({
			error,
			didTimeout: params.didTimeout,
			output,
			vm: params.vm
		});
	} finally {
		params.vm.dispose();
	}
}
async function runExec(input) {
	const pendingRequests = [];
	const { vm, didTimeout } = await createVm({
		catalog: input.catalog,
		apiFiles: input.apiFiles ?? [],
		namespaces: input.namespaces,
		swarmEnabled: input.swarmEnabled === true,
		config: input.config,
		pendingRequests
	});
	return runVmExecution({
		vm,
		didTimeout,
		pendingRequests,
		config: input.config,
		prepare: () => {
			vm.evalCode(buildUserSource(input.source), "openclaw-code-mode:user.js", EvalFlags.ASYNC).dispose();
		}
	});
}
async function runResume(input) {
	const pendingRequests = [];
	const { vm, didTimeout } = await restoreVm({
		snapshotBytes: input.snapshotBytes,
		config: input.config,
		pendingRequests
	});
	return runVmExecution({
		vm,
		didTimeout,
		pendingRequests,
		config: input.config,
		prepare: () => {
			vm.global.getProp("__openclawSettleBridge").consume((settle) => {
				for (const request of input.settledRequests) {
					const id = vm.newString(request.id);
					const payload = vm.newString(JSON.stringify(request.ok ? request.value : request.error));
					try {
						vm.callFunction(settle, vm.undefined, id, request.ok ? vm.true : vm.false, payload).dispose();
					} finally {
						id.dispose();
						payload.dispose();
					}
				}
			});
		}
	});
}
async function main() {
	const input = workerData;
	if (!isRecord(input) || !isRecord(input.config)) return {
		status: "failed",
		error: "invalid code mode worker input",
		code: "invalid_input",
		output: []
	};
	try {
		if (input.kind === "exec" && typeof input.source === "string") return await runExec({
			kind: "exec",
			source: input.source,
			config: input.config,
			catalog: Array.isArray(input.catalog) ? input.catalog : [],
			apiFiles: Array.isArray(input.apiFiles) ? input.apiFiles : [],
			namespaces: Array.isArray(input.namespaces) ? input.namespaces : [],
			swarmEnabled: input.swarmEnabled === true
		});
		if (input.kind === "resume" && input.snapshotBytes instanceof Uint8Array) return await runResume({
			kind: "resume",
			snapshotBytes: input.snapshotBytes,
			config: input.config,
			settledRequests: Array.isArray(input.settledRequests) ? input.settledRequests : []
		});
		return {
			status: "failed",
			error: "invalid code mode worker input",
			code: "invalid_input",
			output: []
		};
	} catch (error) {
		const timedOut = isQuickJsInterruptedError(error);
		return {
			status: "failed",
			error: timedOut ? "code mode timeout exceeded" : errorMessage(error),
			code: timedOut ? "timeout" : error instanceof CodeModeWorkerFailure ? error.code : "internal_error",
			output: error instanceof CodeModeWorkerFailureWithOutput ? error.output : []
		};
	}
}
if (parentPort) Reflect.apply(Reflect.get(parentPort, "postMessage"), parentPort, [await main()]);
//#endregion
export {};
