//#region src/secrets/resolve-errors.ts
/** Error for failures that affect an entire configured secret provider. */
var SecretProviderResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "provider";
		this.name = "SecretProviderResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
	}
};
/** Error for failures limited to one SecretRef id under a provider. */
var SecretRefResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "ref";
		this.name = "SecretRefResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
		this.refId = params.refId;
	}
};
/** Type guard for provider-scoped secret resolution failures. */
function isProviderScopedSecretResolutionError(value) {
	return value instanceof SecretProviderResolutionError;
}
function isSecretResolutionError(value) {
	return value instanceof SecretProviderResolutionError || value instanceof SecretRefResolutionError;
}
/** Redacted reason suitable for warnings and status output. */
function describeSecretResolutionError(value) {
	if (value instanceof SecretProviderResolutionError) return value.code === "SECRET_PROVIDER_UNAVAILABLE" ? "secret provider failed" : void 0;
	if (!(value instanceof SecretRefResolutionError)) return;
	switch (value.code) {
		case "SECRET_REF_NOT_FOUND": return "secret reference was not found";
		case "SECRET_REF_POLICY_DENIED": return "secret provider policy denied resolution";
		case "SECRET_REF_PROVIDER_ERROR": return "secret provider failed";
		case "SECRET_REF_PROVIDER_CONTRACT": return "secret provider response violated its contract";
		case "SECRET_REF_INVALID": return;
	}
}
function providerResolutionError(params) {
	return new SecretProviderResolutionError({
		...params,
		code: params.code ?? "SECRET_PROVIDER_UNAVAILABLE"
	});
}
function refResolutionError(params) {
	return new SecretRefResolutionError(params);
}
/** Returns whether one SecretRef failed because its configured value is absent. */
function isMissingSecretRefResolutionError(params) {
	const refId = params.ref.id.trim();
	return params.error instanceof SecretRefResolutionError && params.error.code === "SECRET_REF_NOT_FOUND" && params.error.source === params.ref.source && params.error.provider === params.ref.provider && params.error.refId === refId;
}
//#endregion
export { providerResolutionError as a, isSecretResolutionError as i, isMissingSecretRefResolutionError as n, refResolutionError as o, isProviderScopedSecretResolutionError as r, describeSecretResolutionError as t };
