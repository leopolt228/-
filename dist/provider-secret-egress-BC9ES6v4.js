import { g as registerSecretValueForRedaction } from "./redact-DNq_HeDt.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-Bqpoo9x7.js";
import { i as getModelProviderRequestTransport, n as attachModelProviderRequestTransport } from "./provider-request-config-DrrUROfX.js";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";
//#region src/secrets/sentinel.ts
const SECRET_SENTINEL_PREFIX = "oc-sent-v2.";
const SECRET_SENTINEL_SUFFIX = ".end";
const SECRET_SENTINEL_SOURCE = "oc-sent-v2\\.[A-Za-z0-9_-]+\\.end";
const SECRET_SENTINEL_CIPHER = "aes-256-gcm";
const SECRET_SENTINEL_NONCE_BYTES = 12;
const SECRET_SENTINEL_SCOPE_BYTES = 8;
const SECRET_SENTINEL_HEADER_BYTES = 36;
const SECRET_SENTINEL_PATTERN = new RegExp(SECRET_SENTINEL_SOURCE, "g");
const secretSentinelKeys = randomBytes(64);
const secretSentinelCipherKey = secretSentinelKeys.subarray(0, 32);
const secretSentinelNonceKey = secretSentinelKeys.subarray(32);
function secretSentinelsEnabled(env = process.env) {
	const configured = env.OPENCLAW_SECRET_SENTINELS?.trim().toLowerCase();
	return configured !== "off" && configured !== "0" && configured !== "false";
}
function looksLikeSecretSentinel(value) {
	return new RegExp(`^${SECRET_SENTINEL_SOURCE}$`).test(value);
}
function containsSecretSentinel(value) {
	return value.includes(SECRET_SENTINEL_PREFIX);
}
function secretSentinelScope(label) {
	return createHash("sha256").update(label).digest().subarray(0, SECRET_SENTINEL_SCOPE_BYTES);
}
/** Seals a secret into authenticated ciphertext that only this process can resolve. */
function mintSecretSentinel(value, meta) {
	registerSecretValueForRedaction(value);
	if (!secretSentinelsEnabled()) return value;
	const scope = secretSentinelScope(meta.label);
	const nonce = createHmac("sha256", secretSentinelNonceKey).update(scope).update(value).digest().subarray(0, SECRET_SENTINEL_NONCE_BYTES);
	const cipher = createCipheriv(SECRET_SENTINEL_CIPHER, secretSentinelCipherKey, nonce);
	cipher.setAAD(scope);
	const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
	const sealed = Buffer.concat([
		scope,
		nonce,
		cipher.getAuthTag(),
		ciphertext
	]);
	return `${SECRET_SENTINEL_PREFIX}${sealed.toString("base64url")}${SECRET_SENTINEL_SUFFIX}`;
}
/** Opens a process-local sentinel and rejects malformed or tampered values. */
function resolveSecretSentinel(sentinel) {
	if (!looksLikeSecretSentinel(sentinel)) return;
	try {
		const encoded = sentinel.slice(11, -4);
		const sealed = Buffer.from(encoded, "base64url");
		if (sealed.length < SECRET_SENTINEL_HEADER_BYTES) return;
		const scope = sealed.subarray(0, SECRET_SENTINEL_SCOPE_BYTES);
		const nonce = sealed.subarray(SECRET_SENTINEL_SCOPE_BYTES, 20);
		const tag = sealed.subarray(20, 36);
		const ciphertext = sealed.subarray(SECRET_SENTINEL_HEADER_BYTES);
		const decipher = createDecipheriv(SECRET_SENTINEL_CIPHER, secretSentinelCipherKey, nonce);
		decipher.setAAD(scope);
		decipher.setAuthTag(tag);
		const value = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
		registerSecretValueForRedaction(value);
		return value;
	} catch {
		return;
	}
}
/** Swaps every known sentinel substring and reports unknown sentinel-shaped values. */
function swapSecretSentinelsInText(text) {
	if (!containsSecretSentinel(text)) return {
		text,
		unknown: []
	};
	const unknown = /* @__PURE__ */ new Set();
	return {
		text: text.replace(new RegExp(SECRET_SENTINEL_SOURCE, "g"), (sentinel) => {
			const value = resolveSecretSentinel(sentinel);
			if (value === void 0) {
				unknown.add(sentinel);
				return sentinel;
			}
			return value;
		}),
		unknown: [...unknown]
	};
}
//#endregion
//#region src/agents/provider-secret-egress.ts
function protectRuntimeAuthValue(params) {
	if (!params.value) return params.value;
	return looksLikeSecretSentinel(params.value) ? params.value : mintSecretSentinel(params.value, { label: `model-auth:${params.provider}:${params.label}` });
}
/** Re-sentinels credentials returned by a provider auth exchange. */
function protectPreparedProviderRuntimeAuth(params) {
	const { preparedAuth } = params;
	if (!preparedAuth) return;
	const protect = (value, label) => !value || isNonSecretApiKeyMarker(value) ? value : protectRuntimeAuthValue({
		value,
		provider: params.provider,
		label
	});
	const request = preparedAuth.request;
	const headers = request?.headers ? Object.fromEntries(Object.entries(request.headers).map(([name, value]) => [name, protect(value, `runtime-header:${name.toLowerCase()}`)])) : void 0;
	const auth = request?.auth;
	const protectedAuth = auth?.mode === "authorization-bearer" ? {
		...auth,
		token: protect(auth.token, "runtime-bearer")
	} : auth?.mode === "header" ? {
		...auth,
		value: protect(auth.value, `runtime-auth-header:${auth.headerName.toLowerCase()}`)
	} : auth;
	return {
		...preparedAuth,
		apiKey: protect(preparedAuth.apiKey, "runtime-api-key"),
		...request ? { request: {
			...request,
			...headers ? { headers } : {},
			...protectedAuth ? { auth: protectedAuth } : {}
		} } : {}
	};
}
function unwrapSecretSentinelsForProviderEgress(value, boundary) {
	const swapped = swapSecretSentinelsInText(value);
	const unknown = swapped.unknown[0];
	if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing ${boundary}`);
	return swapped.text;
}
function unwrapHeaderSentinelsForProviderEgress(input, boundary) {
	let headers;
	for (const [name, value] of Object.entries(input)) {
		if (typeof value !== "string") continue;
		const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
		if (resolved !== value) {
			headers ??= { ...input };
			headers[name] = resolved;
		}
	}
	return headers ? headers : input;
}
function unwrapHeadersInitSentinelsForProviderEgress(input, boundary) {
	if (!input) return input;
	const headers = new Headers(input);
	let changed = false;
	for (const [name, value] of headers) {
		const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
		if (resolved !== value) {
			headers.set(name, resolved);
			changed = true;
		}
	}
	return changed ? headers : input;
}
function unwrapRequestTransportSentinelsForProviderEgress(request, boundary) {
	if (!request) return request;
	const headers = request.headers ? unwrapHeaderSentinelsForProviderEgress(request.headers, boundary) : request.headers;
	let auth = request.auth;
	if (auth?.mode === "authorization-bearer") {
		const token = unwrapSecretSentinelsForProviderEgress(auth.token, boundary);
		if (token !== auth.token) auth = {
			...auth,
			token
		};
	} else if (auth?.mode === "header") {
		const value = unwrapSecretSentinelsForProviderEgress(auth.value, boundary);
		if (value !== auth.value) auth = {
			...auth,
			value
		};
	}
	if (headers === request.headers && auth === request.auth) return request;
	return {
		...request,
		...headers ? { headers } : {},
		...auth ? { auth } : {}
	};
}
function unwrapModelHeaderSentinelsForProviderEgress(model, boundary) {
	const headers = model.headers ? unwrapHeaderSentinelsForProviderEgress(model.headers, boundary) : model.headers;
	const request = getModelProviderRequestTransport(model);
	const unwrappedRequest = unwrapRequestTransportSentinelsForProviderEgress(request, boundary);
	if (headers === model.headers && unwrappedRequest === request) return model;
	const next = headers === model.headers ? { ...model } : {
		...model,
		headers
	};
	return unwrappedRequest === request ? next : attachModelProviderRequestTransport(next, unwrappedRequest);
}
//#endregion
export { unwrapSecretSentinelsForProviderEgress as a, looksLikeSecretSentinel as c, swapSecretSentinelsInText as d, unwrapModelHeaderSentinelsForProviderEgress as i, mintSecretSentinel as l, unwrapHeaderSentinelsForProviderEgress as n, SECRET_SENTINEL_PATTERN as o, unwrapHeadersInitSentinelsForProviderEgress as r, containsSecretSentinel as s, protectPreparedProviderRuntimeAuth as t, resolveSecretSentinel as u };
