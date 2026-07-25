import { o as sendMethodNotAllowed } from "./http-common-CjZLtWEF.js";
import { o as boardStore, s as buildBoardWidgetContentSecurityPolicy, t as resolveAuthorizedBoardWidgetView } from "./board-widget-view-BWLCrbN8.js";
//#region src/gateway/board-http.ts
const BOARD_WIDGET_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;
function sendNotFound(res) {
	res.statusCode = 404;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.end("Not Found");
}
function sendUnauthorized(res) {
	res.statusCode = 401;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.end("Unauthorized");
}
function parseBoardWidgetPath(pathname) {
	const match = /^\/__openclaw__\/board\/([^/]+)\/([^/]+)\/index\.html$/.exec(pathname);
	if (!match) return;
	try {
		const sessionKey = decodeURIComponent(match[1]);
		const name = decodeURIComponent(match[2]);
		if (!sessionKey || !BOARD_WIDGET_NAME_PATTERN.test(name)) return;
		return {
			sessionKey,
			name
		};
	} catch {
		return;
	}
}
function handleBoardHttpRequest(req, res, opts = {}) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const pathname = url.pathname;
	if (!pathname.startsWith("/__openclaw__/board/")) return false;
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const path = parseBoardWidgetPath(pathname);
	if (!path) {
		sendNotFound(res);
		return true;
	}
	const ticket = url.searchParams.get("bt");
	if (!ticket) {
		sendUnauthorized(res);
		return true;
	}
	let authorized;
	try {
		authorized = resolveAuthorizedBoardWidgetView(opts.store ?? boardStore, ticket, { nowMs: opts.nowMs });
	} catch {
		sendUnauthorized(res);
		return true;
	}
	if (authorized.sessionKey !== path.sessionKey || authorized.name !== path.name) {
		sendUnauthorized(res);
		return true;
	}
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", buildBoardWidgetContentSecurityPolicy(authorized.document));
	res.setHeader("Cache-Control", "no-cache");
	res.end(authorized.document.html);
	return true;
}
//#endregion
export { handleBoardHttpRequest };
