import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-D4mGPeue.js";
import "./version-CwNT1gaY.js";
import { n as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext, n as findRegisteredPluginHttpRoute, r as isRegisteredPluginHttpRoutePath, t as findMatchingPluginHttpRoutes } from "./route-match-CjzRe5Nj.js";
import { _ as respondControlUiPluginAuthCookieProbe } from "./http-auth-utils-uJaojXOz.js";
import { i as runWithGatewayUpgradeWorkAdmission, n as shouldEnforceGatewayAuthForPluginPath, r as runWithGatewayHttpWorkAdmission, t as matchedPluginRoutesRequireGatewayAuth } from "./route-auth-07xfDNkB.js";
import { t as resolvePluginRouteRuntimeOperatorScopes } from "./plugin-route-runtime-scopes-JR3ksPns.js";
//#region src/gateway/server/plugins-http.ts
function resolvePluginRoutePathContextForRequest(req, providedPathContext) {
	if (providedPathContext) return providedPathContext;
	return resolvePluginRoutePathContext(new URL(req.url ?? "/", "http://localhost").pathname);
}
function createPluginRouteRuntimeClient(scopes, clientIp) {
	return {
		connId: `plugin-http:${clientIp ?? "unknown"}`,
		...clientIp ? { clientIp } : {},
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes: [...scopes]
		}
	};
}
function writeUpgradeUnauthorized(socket) {
	socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
	socket.destroy();
}
function getMissingPluginRouteRuntimeContext(route, context) {
	if (route.auth !== "gateway") return;
	if (route.gatewayRuntimeScopeSurface === "trusted-operator") return context.gatewayRequestAuth ? void 0 : "caller auth context";
	return context.gatewayRequestOperatorScopes === void 0 ? "caller scope context" : void 0;
}
function canRunPluginHttpRouteWithoutAdmission(route) {
	return route.auth === "gateway" && route.gatewayRuntimeScopeSurface === "trusted-operator" && route.gatewayMethodDispatchAllowed === true;
}
function createPluginRouteRuntimeScope(params) {
	const runtimeClient = createPluginRouteRuntimeClient(params.route.auth !== "gateway" ? [] : params.gatewayRequestAuth?.controlUiPluginGrant ? params.gatewayRequestOperatorScopes : params.route.gatewayRuntimeScopeSurface === "trusted-operator" ? resolvePluginRouteRuntimeOperatorScopes(params.req, params.gatewayRequestAuth, "trusted-operator") : params.gatewayRequestOperatorScopes, params.gatewayRequestClientIp);
	return {
		...params.gatewayRequestContext ? { context: params.gatewayRequestContext } : {},
		client: runtimeClient,
		isWebchatConnect: () => false,
		...params.route.pluginId ? { pluginId: params.route.pluginId } : {},
		...params.route.source ? { pluginSource: params.route.source } : {},
		...params.route.gatewayMethodDispatchAllowed === true ? { gatewayMethodDispatchAllowed: true } : {}
	};
}
function createGatewayPluginRequestHandler(params) {
	const { log } = params;
	return async (req, res, providedPathContext, dispatchContext) => {
		const registry = params.getRouteRegistry?.() ?? params.registry;
		const gatewayRequestContext = params.getGatewayRequestContext?.();
		if ((registry.httpRoutes ?? []).length === 0) return false;
		const pathContext = resolvePluginRoutePathContextForRequest(req, providedPathContext);
		const matchedRoutes = findMatchingPluginHttpRoutes(registry, pathContext);
		if (matchedRoutes.length === 0) return false;
		if (matchedPluginRoutesRequireGatewayAuth(matchedRoutes) && dispatchContext?.gatewayAuthSatisfied !== true) {
			log.warn(`plugin http route blocked without gateway auth (${pathContext.canonicalPath})`);
			return false;
		}
		const firstGatewayRoute = matchedRoutes.find((route) => route.auth === "gateway");
		const presentedGatewayRequestAuth = dispatchContext?.gatewayRequestAuth;
		const presentedControlUiPluginGrants = presentedGatewayRequestAuth?.controlUiPluginGrants;
		const controlUiPluginGrant = presentedControlUiPluginGrants?.find((grant) => grant.pluginId === firstGatewayRoute?.pluginId);
		if (presentedControlUiPluginGrants && (!firstGatewayRoute || !controlUiPluginGrant)) {
			log.warn(`plugin http route blocked for mismatched control ui grant (${pathContext.canonicalPath})`);
			res.statusCode = 401;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Unauthorized");
			return true;
		}
		const gatewayRequestAuth = controlUiPluginGrant ? {
			...presentedGatewayRequestAuth,
			controlUiPluginGrant
		} : presentedGatewayRequestAuth;
		const gatewayRequestOperatorScopes = controlUiPluginGrant ? controlUiPluginGrant.scopes : dispatchContext?.gatewayRequestOperatorScopes;
		for (const route of matchedRoutes) {
			if (controlUiPluginGrant && route.auth === "gateway" && route.pluginId !== controlUiPluginGrant.pluginId) continue;
			const missingRuntimeContext = getMissingPluginRouteRuntimeContext(route, {
				gatewayRequestAuth,
				gatewayRequestOperatorScopes
			});
			if (missingRuntimeContext) {
				log.warn(`plugin http route blocked without ${missingRuntimeContext} (${pathContext.canonicalPath})`);
				return false;
			}
		}
		if (controlUiPluginGrant && respondControlUiPluginAuthCookieProbe(req, res)) return true;
		for (const route of matchedRoutes) {
			if (controlUiPluginGrant && route.auth === "gateway" && route.pluginId !== controlUiPluginGrant.pluginId) continue;
			try {
				const runRoute = async () => await withPluginRuntimeGatewayRequestScope(createPluginRouteRuntimeScope({
					route,
					req,
					gatewayRequestContext,
					gatewayRequestAuth,
					gatewayRequestOperatorScopes,
					gatewayRequestClientIp: dispatchContext?.gatewayRequestClientIp
				}), async () => route.handler(req, res)) !== false;
				if (canRunPluginHttpRouteWithoutAdmission(route) ? await runRoute() : await runWithGatewayHttpWorkAdmission(res, runRoute)) return true;
			} catch (err) {
				log.warn(`plugin http route failed (${route.pluginId ?? "unknown"}): ${String(err)}`);
				if (!res.headersSent) {
					res.statusCode = 500;
					res.setHeader("Content-Type", "text/plain; charset=utf-8");
					res.end("Internal Server Error");
				} else if (!res.writableEnded && !res.destroyed) res.end();
				return true;
			}
		}
		return false;
	};
}
function createGatewayPluginUpgradeHandler(params) {
	const { log } = params;
	return async (req, socket, head, providedPathContext, dispatchContext) => {
		const registry = params.getRouteRegistry?.() ?? params.registry;
		const gatewayRequestContext = params.getGatewayRequestContext?.();
		if ((registry.httpRoutes ?? []).length === 0) return false;
		const pathContext = resolvePluginRoutePathContextForRequest(req, providedPathContext);
		const matchedRoutes = findMatchingPluginHttpRoutes(registry, pathContext).filter((route) => typeof route.handleUpgrade === "function");
		if (matchedRoutes.length === 0) return false;
		if (matchedPluginRoutesRequireGatewayAuth(matchedRoutes) && dispatchContext?.gatewayAuthSatisfied !== true) {
			log.warn(`plugin http upgrade blocked without gateway auth (${pathContext.canonicalPath})`);
			writeUpgradeUnauthorized(socket);
			return true;
		}
		const gatewayRequestAuth = dispatchContext?.gatewayRequestAuth;
		const gatewayRequestOperatorScopes = dispatchContext?.gatewayRequestOperatorScopes;
		for (const route of matchedRoutes) {
			const missingRuntimeContext = getMissingPluginRouteRuntimeContext(route, {
				gatewayRequestAuth,
				gatewayRequestOperatorScopes
			});
			if (missingRuntimeContext) {
				log.warn(`plugin http upgrade blocked without ${missingRuntimeContext} (${pathContext.canonicalPath})`);
				writeUpgradeUnauthorized(socket);
				return true;
			}
		}
		for (const route of matchedRoutes) try {
			if (await runWithGatewayUpgradeWorkAdmission(socket, async () => await withPluginRuntimeGatewayRequestScope(createPluginRouteRuntimeScope({
				route,
				req,
				gatewayRequestContext,
				gatewayRequestAuth,
				gatewayRequestOperatorScopes,
				gatewayRequestClientIp: dispatchContext?.gatewayRequestClientIp
			}), async () => route.handleUpgrade?.(req, socket, head)) !== false)) return true;
		} catch (err) {
			log.warn(`plugin http upgrade failed (${route.pluginId ?? "unknown"}): ${String(err)}`);
			socket.destroy();
			return true;
		}
		return false;
	};
}
//#endregion
export { createGatewayPluginRequestHandler, createGatewayPluginUpgradeHandler, findRegisteredPluginHttpRoute, isProtectedPluginRoutePathFromContext, isRegisteredPluginHttpRoutePath, resolvePluginRoutePathContext, shouldEnforceGatewayAuthForPluginPath };
