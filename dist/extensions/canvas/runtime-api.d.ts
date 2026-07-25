import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { n as RuntimeEnv } from "../../runtime-DRcp7-j9.js";
import { y as NormalizedPluginNodeCapabilityUrl } from "../../types-CzbSjEqY.js";
import { d as HostedPluginSurfaceUrlParams } from "../../gateway-runtime-DYI5mwmM.js";
import { Duplex } from "node:stream";
import { WebSocketServer } from "ws";
import { IncomingMessage, ServerResponse } from "node:http";
import chokidar from "chokidar";
import { Command } from "commander";

//#region extensions/canvas/src/config.d.ts
/** Host-server configuration for Canvas and A2UI assets. */
type CanvasHostConfig = {
  enabled?: boolean;
  root?: string;
  port?: number;
  liveReload?: boolean;
};
/** Canvas plugin configuration shape. */
type CanvasPluginConfig = {
  host?: CanvasHostConfig;
};
type CanvasPluginConfigSchema = {
  parse: (value: unknown) => CanvasPluginConfig;
  uiHints: Record<string, {
    label: string;
    help?: string;
    advanced?: boolean;
  }>;
};
/** Parses raw Canvas plugin config into a typed, normalized shape. */
declare function parseCanvasPluginConfig(value: unknown): CanvasPluginConfig;
/** Returns whether the bundled Canvas plugin is effectively enabled. */
declare function isCanvasPluginEnabled(config?: OpenClawConfig): boolean;
/** Resolves Canvas host config from plugin config or root config. */
declare function resolveCanvasHostConfig(params: {
  config?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
}): CanvasHostConfig;
/** Returns whether the Canvas hosted route/server surface should be active. */
declare function isCanvasHostEnabled(config?: OpenClawConfig): boolean;
/** Config schema metadata for Canvas plugin settings. */
declare const canvasConfigSchema: CanvasPluginConfigSchema;
//#endregion
//#region extensions/canvas/src/host/a2ui-shared.d.ts
/**
 * Shared A2UI/Canvas host paths and live-reload injection helpers.
 */
/** Hosted path prefix for bundled A2UI assets. */
declare const A2UI_PATH = "/__openclaw__/a2ui";
/** Hosted path prefix for Canvas document/static assets. */
declare const CANVAS_HOST_PATH = "/__openclaw__/canvas";
/** Hosted WebSocket path for Canvas live reload. */
declare const CANVAS_WS_PATH = "/__openclaw__/ws";
//#endregion
//#region extensions/canvas/src/host/a2ui.d.ts
/** Handles one HTTP request for the hosted A2UI asset surface. */
declare function handleA2uiHttpRequest(req: IncomingMessage, res: ServerResponse, options?: {
  liveReload?: boolean;
}): Promise<boolean>;
//#endregion
//#region extensions/canvas/src/host/server.d.ts
/** Options for Canvas host creation. */
type CanvasHostOpts = {
  runtime: RuntimeEnv;
  rootDir?: string;
  port?: number;
  listenHost?: string;
  allowInTests?: boolean;
  liveReload?: boolean;
  watchFactory?: typeof chokidar.watch;
  webSocketServerClass?: typeof WebSocketServer;
};
/** Options for starting a standalone Canvas host HTTP server. */
type CanvasHostServerOpts = CanvasHostOpts & {
  handler?: CanvasHostHandler;
  ownsHandler?: boolean;
};
/** Running Canvas host server handle. */
type CanvasHostServer = {
  port: number;
  rootDir: string;
  close: () => Promise<void>;
};
/** Options for creating only the Canvas host request handler. */
type CanvasHostHandlerOpts = {
  runtime: RuntimeEnv;
  rootDir?: string;
  basePath?: string;
  allowInTests?: boolean;
  liveReload?: boolean;
  watchFactory?: typeof chokidar.watch;
  webSocketServerClass?: typeof WebSocketServer;
};
/** Canvas host handler for HTTP requests, WebSocket upgrades, and teardown. */
type CanvasHostHandler = {
  rootDir: string;
  basePath: string;
  handleHttpRequest: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
  handleUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => boolean;
  close: () => Promise<void>;
};
/** Creates a Canvas static-file handler with optional live reload. */
declare function createCanvasHostHandler(opts: CanvasHostHandlerOpts): Promise<CanvasHostHandler>;
/** Starts a standalone loopback Canvas host HTTP server. */
declare function startCanvasHost(opts: CanvasHostServerOpts): Promise<CanvasHostServer>;
//#endregion
//#region extensions/canvas/src/cli.d.ts
/** Runtime output surface used by Canvas CLI commands. */
type CanvasCliRuntime = {
  log: (message: string) => void;
  error: (message: string) => void;
  exit: (code: number) => void;
  writeJson: (value: unknown) => void;
};
/** Parent node/gateway options consumed by Canvas CLI commands. */
type CanvasNodesRpcOpts = {
  url?: string;
  token?: string;
  timeout?: string;
  json?: boolean;
  node?: string;
  invokeTimeout?: string;
  target?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  js?: string;
  jsonl?: string;
  text?: string;
  format?: string;
  maxWidth?: string;
  quality?: string;
};
/** Dependency bundle used to keep Canvas CLI commands testable. */
type CanvasCliDependencies = {
  defaultRuntime: CanvasCliRuntime;
  nodesCallOpts: (cmd: Command, defaults?: {
    timeoutMs?: number;
  }) => Command;
  runNodesCommand: (label: string, action: () => Promise<void>) => Promise<void> | void;
  getNodesTheme: () => {
    ok: (value: string) => string;
  };
  parseTimeoutMs: (raw: unknown) => number | undefined;
  resolveNodeId: (opts: CanvasNodesRpcOpts, query: string) => Promise<string>;
  buildNodeInvokeParams: (params: {
    nodeId: string;
    command: string;
    params?: Record<string, unknown>;
    timeoutMs?: number;
  }) => Record<string, unknown>;
  callGatewayCli: (method: string, opts: CanvasNodesRpcOpts, params?: unknown, callOpts?: {
    transportTimeoutMs?: number;
  }) => Promise<unknown>;
  writeBase64ToFile: (filePath: string, base64: string) => Promise<unknown>;
  shortenHomePath: (filePath: string) => string;
};
/** Registers Canvas subcommands under the nodes CLI command group. */
declare function registerNodesCanvasCommands(nodes: Command, deps: CanvasCliDependencies): void;
//#endregion
//#region extensions/canvas/src/cli-helpers.d.ts
type CanvasSnapshotPayload = {
  format: CanvasSnapshotFormat;
  base64: string;
};
type CanvasSnapshotFormat = "png" | "jpg" | "jpeg";
/** Parses the node.invoke canvas.snapshot payload shape. */
declare function parseCanvasSnapshotPayload(value: unknown): CanvasSnapshotPayload;
/** Builds a safe temp path for a Canvas snapshot output file. */
declare function canvasSnapshotTempPath(opts: {
  ext: string;
  tmpDir?: string;
  id?: string;
}): string;
//#endregion
//#region extensions/canvas/src/capability.d.ts
/** Path prefix used for Canvas capability-scoped gateway routes. */
declare const CANVAS_CAPABILITY_PATH_PREFIX = "/__openclaw__/cap";
/** Default Canvas capability token TTL in milliseconds. */
declare const CANVAS_CAPABILITY_TTL_MS: number;
/** Normalized Canvas capability-scoped URL shape. */
type NormalizedCanvasScopedUrl = NormalizedPluginNodeCapabilityUrl;
/** Creates a new opaque Canvas capability token. */
declare function mintCanvasCapabilityToken(): string;
/** Builds a Canvas host URL scoped by the supplied capability token. */
declare function buildCanvasScopedHostUrl(baseUrl: string, capability: string): string | undefined;
/** Normalizes and validates a Canvas capability-scoped URL. */
declare function normalizeCanvasScopedUrl(rawUrl: string): NormalizedCanvasScopedUrl;
//#endregion
//#region extensions/canvas/src/host-url.d.ts
type CanvasHostUrlParams = Omit<HostedPluginSurfaceUrlParams, "port"> & {
  canvasPort?: number;
};
/** Resolves the externally visible Canvas host URL for a gateway/plugin surface. */
declare function resolveCanvasHostUrl(params: CanvasHostUrlParams): string | undefined;
//#endregion
export { A2UI_PATH, CANVAS_CAPABILITY_PATH_PREFIX, CANVAS_CAPABILITY_TTL_MS, CANVAS_HOST_PATH, CANVAS_WS_PATH, type CanvasCliDependencies, type CanvasHostConfig, type CanvasHostHandler, type CanvasHostServer, type CanvasNodesRpcOpts, type CanvasPluginConfig, buildCanvasScopedHostUrl, canvasConfigSchema, canvasSnapshotTempPath, createCanvasHostHandler, handleA2uiHttpRequest, isCanvasHostEnabled, isCanvasPluginEnabled, mintCanvasCapabilityToken, normalizeCanvasScopedUrl, parseCanvasPluginConfig, parseCanvasSnapshotPayload, registerNodesCanvasCommands, resolveCanvasHostConfig, resolveCanvasHostUrl, startCanvasHost };