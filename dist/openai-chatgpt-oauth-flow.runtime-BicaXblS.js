import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { a as oauthErrorHtml, d as withOAuthLoginAbort, n as createOAuthLoginCancelledError, o as oauthSuccessHtml, s as parseOAuthAuthorizationInput, u as throwIfOAuthLoginAborted } from "./provider-oauth-runtime-B7glaskV.js";
import { n as resolveCodexAuthIdentity } from "./openai-chatgpt-auth-identity-DPlQMe5m.js";
import "./openai-chatgpt-oauth-abort.runtime.js";
import { n as resolveOpenAICallbackHost, r as resolveOpenAIRedirectUri, t as createOpenAIAuthorizationFlow } from "./openai-chatgpt-oauth-authorization.runtime.js";
import "./openai-chatgpt-oauth-page.runtime.js";
import { n as refreshOpenAIAccessToken, t as exchangeOpenAIAuthorizationCode } from "./openai-chatgpt-oauth-token.runtime.js";
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.ts
/**
* OpenAI Codex (ChatGPT OAuth) flow
*
* NOTE: This module uses Node.js crypto and http for the OAuth callback.
* It is only intended for CLI use, not browser environments.
*/
const CALLBACK_PORT = 1455;
const CALLBACK_HOST = resolveOpenAICallbackHost();
const REDIRECT_URI = resolveOpenAIRedirectUri(CALLBACK_HOST);
const MANUAL_PROMPT_FALLBACK_MS = 15e3;
const loadNodeOAuthModules = createLazyRuntimeModule(() => import("node:http").then((http) => ({ http })));
function loadNodeOAuthRuntime() {
	if (typeof process === "undefined" || !process.versions?.node && !process.versions?.bun) return Promise.reject(/* @__PURE__ */ new Error("OpenAI Codex OAuth is only available in Node.js environments"));
	return loadNodeOAuthModules();
}
function waitForManualPromptFallback(signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(createOAuthLoginCancelledError());
			return;
		}
		const cleanup = () => {
			signal?.removeEventListener("abort", abort);
		};
		const abort = () => {
			clearTimeout(timeout);
			cleanup();
			reject(createOAuthLoginCancelledError());
		};
		const timeout = setTimeout(() => {
			cleanup();
			resolve(null);
		}, MANUAL_PROMPT_FALLBACK_MS);
		signal?.addEventListener("abort", abort, { once: true });
		timeout.unref?.();
	});
}
async function promptForAuthorizationCode(onPrompt, state) {
	const parsed = parseOAuthAuthorizationInput(await onPrompt({ message: "Paste the authorization code (or full redirect URL):" }));
	if (parsed.state && parsed.state !== state) throw new Error("State mismatch");
	return parsed.code;
}
function sendOAuthHtmlResponse(res, statusCode, html) {
	res.statusCode = statusCode;
	res.setHeader("Connection", "close");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.end(html);
}
async function startLocalOAuthServer(state) {
	const { http } = await loadNodeOAuthRuntime();
	let settleWait;
	const waitForCodePromise = new Promise((resolve) => {
		let settled = false;
		settleWait = (value) => {
			if (settled) return;
			settled = true;
			resolve(value);
		};
	});
	const server = http.createServer((req, res) => {
		try {
			const url = new URL(req.url || "", "http://localhost");
			if (url.pathname !== "/auth/callback") {
				sendOAuthHtmlResponse(res, 404, oauthErrorHtml("Callback route not found."));
				return;
			}
			if (url.searchParams.get("state") !== state) {
				sendOAuthHtmlResponse(res, 400, oauthErrorHtml("State mismatch."));
				return;
			}
			const code = url.searchParams.get("code");
			if (!code) {
				sendOAuthHtmlResponse(res, 400, oauthErrorHtml("Missing authorization code."));
				return;
			}
			sendOAuthHtmlResponse(res, 200, oauthSuccessHtml("OpenAI authentication completed. You can close this window."));
			settleWait?.({ code });
		} catch {
			sendOAuthHtmlResponse(res, 500, oauthErrorHtml("Internal error while processing OAuth callback."));
		}
	});
	return new Promise((resolve) => {
		server.listen(CALLBACK_PORT, CALLBACK_HOST, () => {
			resolve({
				close: () => server.close(),
				cancelWait: () => {
					settleWait?.(null);
				},
				waitForCode: () => waitForCodePromise
			});
		}).on("error", () => {
			settleWait?.(null);
			resolve({
				close: () => {
					try {
						server.close();
					} catch {}
				},
				cancelWait: () => {},
				waitForCode: async () => null
			});
		});
	});
}
function getAccountId(accessToken) {
	const accountId = resolveCodexAuthIdentity({ accessToken }).accountId;
	return typeof accountId === "string" && accountId.length > 0 ? accountId : null;
}
/**
* Login with OpenAI Codex OAuth
*
* @param options.onAuth - Called with URL and instructions when auth starts
* @param options.onPrompt - Called to prompt user for manual code paste (fallback if no onManualCodeInput)
* @param options.onProgress - Optional progress messages
* @param options.onManualCodeInput - Optional promise that resolves with user-pasted code.
*                                    Races with browser callback - whichever completes first wins.
*                                    Useful for showing paste input immediately alongside browser flow.
* @param options.originator - OAuth originator parameter (defaults to "openclaw")
*/
async function loginOpenAICodex(options) {
	throwIfOAuthLoginAborted(options.signal);
	const { verifier, redirectUri, state, url } = await createOpenAIAuthorizationFlow(options.originator ?? "openclaw", REDIRECT_URI);
	const server = await startLocalOAuthServer(state);
	let code;
	try {
		throwIfOAuthLoginAborted(options.signal);
		await options.onAuth({
			url,
			instructions: "A browser window should open. Complete login to finish."
		});
		throwIfOAuthLoginAborted(options.signal);
		if (options.onManualCodeInput) {
			let manualCode;
			let manualError;
			const manualPromise = options.onManualCodeInput().then((input) => {
				manualCode = input;
				server.cancelWait();
			}).catch((err) => {
				manualError = err instanceof Error ? err : new Error(String(err));
				server.cancelWait();
			});
			const result = await withOAuthLoginAbort(server.waitForCode(), options.signal, server.cancelWait);
			if (manualError) throw manualError;
			if (result?.code) code = result.code;
			else if (manualCode) {
				const parsed = parseOAuthAuthorizationInput(manualCode);
				if (parsed.state && parsed.state !== state) throw new Error("State mismatch");
				code = parsed.code;
			}
			if (!code) {
				await withOAuthLoginAbort(manualPromise, options.signal, server.cancelWait);
				if (manualError) throw toLintErrorObject(manualError, "Non-Error thrown");
				if (manualCode) {
					const parsed = parseOAuthAuthorizationInput(manualCode);
					if (parsed.state && parsed.state !== state) throw new Error("State mismatch");
					code = parsed.code;
				}
			}
		} else {
			const callbackPromise = server.waitForCode();
			const result = await withOAuthLoginAbort(Promise.race([callbackPromise, waitForManualPromptFallback(options.signal)]), options.signal, server.cancelWait);
			if (result?.code) code = result.code;
			else {
				const promptCodePromise = promptForAuthorizationCode(options.onPrompt, state).then((promptCode) => {
					server.cancelWait();
					return promptCode;
				});
				code = await withOAuthLoginAbort(Promise.race([callbackPromise.then((callback) => callback?.code), promptCodePromise]), options.signal, server.cancelWait);
			}
		}
		if (!code) code = await withOAuthLoginAbort(promptForAuthorizationCode(options.onPrompt, state), options.signal, server.cancelWait);
		if (!code) throw new Error("Missing authorization code");
		const tokenResult = await exchangeOpenAIAuthorizationCode(code, verifier, redirectUri, { signal: options.signal });
		if (tokenResult.type !== "success") throw new Error(tokenResult.message);
		const accountId = getAccountId(tokenResult.access);
		if (!accountId) throw new Error("Failed to extract accountId from token");
		return {
			access: tokenResult.access,
			refresh: tokenResult.refresh,
			expires: tokenResult.expires,
			accountId
		};
	} finally {
		server.close();
	}
}
/**
* Refresh OpenAI Codex OAuth token
*/
async function refreshOpenAICodexToken(refreshToken) {
	const result = await refreshOpenAIAccessToken(refreshToken);
	if (result.type !== "success") throw new Error(result.message);
	const accountId = getAccountId(result.access);
	if (!accountId) throw new Error("Failed to extract accountId from token");
	return {
		access: result.access,
		refresh: result.refresh,
		expires: result.expires,
		accountId
	};
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { refreshOpenAICodexToken as n, loginOpenAICodex as t };
