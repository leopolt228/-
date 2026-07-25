import { r as formatErrorMessage } from "./errors-DdbcjW1Y.js";
import { a as logWarn } from "./logger-DT9z6GgH.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-CLDhuP4F.js";
import { g as updateMcpAppModelContext } from "./agent-bundle-mcp-manager-api-ChkvrkDs.js";
import { o as buildMcpAppSandboxPath } from "./mcp-ui-resource-B0LrcA_c.js";
import { i as errorShape } from "./error-codes-DKVDGU7l.js";
import { a as resolveMcpAppActiveView, i as requireMcpAppInteraction, n as executeMcpAppOperation, s as withMcpAppActiveView, t as McpAppViewExpiredError } from "./mcp-app-operations-DgdBtUr6.js";
import { t as createMcpAppStandaloneTicket } from "./mcp-app-standalone-DyLgs_kj.js";
//#region src/gateway/server-methods/mcp-app.ts
function requireString(params, key) {
	const value = params[key];
	if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required`);
	return value.trim();
}
function optionalCursor(params) {
	const cursor = params.cursor;
	return typeof cursor === "string" && cursor.trim() ? { cursor: cursor.trim() } : void 0;
}
async function runOperation(params, operation) {
	return await executeMcpAppOperation(await resolveMcpAppActiveView({
		sessionKey: requireString(params, "sessionKey"),
		viewId: requireString(params, "viewId")
	}), operation);
}
async function handle(respond, operation) {
	try {
		respond(true, await operation());
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error), error instanceof McpAppViewExpiredError ? { details: { code: GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED } } : void 0));
	}
}
const mcpAppHandlers = {
	"mcp.app.view": async ({ respond, params, context }) => {
		await handle(respond, async () => {
			const active = await resolveMcpAppActiveView({
				sessionKey: requireString(params, "sessionKey"),
				viewId: requireString(params, "viewId"),
				cfg: context.getRuntimeConfig()
			});
			return await withMcpAppActiveView(active, "read", async () => {
				const { view } = active;
				let interactive = false;
				try {
					await requireMcpAppInteraction(view);
					interactive = true;
				} catch {}
				const updateModelContextSupported = interactive && active.runtime.mcpAppModelContextRevoked !== true;
				const sandboxPort = context.getMcpAppSandboxPort?.() ?? await context.ensureSandboxHostPort?.();
				if (sandboxPort === void 0) throw new Error("MCP App sandbox listener is unavailable; restart the Gateway");
				const configuredOrigin = context.getRuntimeConfig().mcp?.apps?.sandboxOrigin;
				let standalone = void 0;
				try {
					standalone = createMcpAppStandaloneTicket({
						sessionKey: requireString(params, "sessionKey"),
						view
					});
				} catch (error) {
					logWarn(`mcp-app: standalone ticket unavailable: ${formatErrorMessage(error)}`);
				}
				return {
					sandboxUrl: buildMcpAppSandboxPath(view.csp),
					sandboxPort,
					...configuredOrigin ? { sandboxOrigin: new URL(configuredOrigin).origin } : {},
					html: view.html,
					...view.csp ? { csp: view.csp } : {},
					toolInput: view.toolInput,
					toolResult: view.toolResult,
					...standalone ? {
						standaloneUrl: standalone.url,
						standaloneExpiresAtMs: standalone.expiresAtMs
					} : {},
					messageSupported: interactive,
					updateModelContextSupported
				};
			});
		});
	},
	"mcp.app.updateModelContext": async ({ respond, params }) => {
		await handle(respond, async () => {
			const active = await resolveMcpAppActiveView({
				sessionKey: requireString(params, "sessionKey"),
				viewId: requireString(params, "viewId")
			});
			return await withMcpAppActiveView(active, "read", async () => {
				await requireMcpAppInteraction(active.view);
				updateMcpAppModelContext(active.runtime, active.view, params);
				return {};
			});
		});
	},
	"mcp.app.callTool": async ({ respond, params }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "tools/call",
			params: {
				name: requireString(params, "toolName"),
				arguments: params.arguments ?? {}
			}
		}));
	},
	"mcp.app.listTools": async ({ respond, params }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "tools/list",
			params: optionalCursor(params) ?? {}
		}));
	},
	"mcp.app.listResources": async ({ respond, params }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "resources/list",
			params: optionalCursor(params) ?? {}
		}));
	},
	"mcp.app.listResourceTemplates": async ({ respond, params }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "resources/templates/list",
			params: optionalCursor(params) ?? {}
		}));
	},
	"mcp.app.readResource": async ({ respond, params }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "resources/read",
			params: { uri: requireString(params, "uri") }
		}));
	}
};
//#endregion
export { mcpAppHandlers };
