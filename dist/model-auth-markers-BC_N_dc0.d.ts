import { g as SecretRefSource } from "./types.secrets-CNoRpgG4.js";

//#region src/agents/model-auth-markers.d.ts
/** @deprecated MiniMax provider-owned marker; do not use from third-party plugins. */
declare const MINIMAX_OAUTH_MARKER = "minimax-oauth";
/** @deprecated Bundled local-provider marker; do not use from third-party plugins. */
declare const CUSTOM_LOCAL_AUTH_MARKER = "custom-local";
/** @deprecated Codex provider-owned marker; do not use from third-party plugins. */
declare const CODEX_APP_SERVER_AUTH_MARKER = "codex-app-server";
/** Marker for a secret-ref-managed credential that is not stored as an env var. */
declare const NON_ENV_SECRETREF_MARKER = "secretref-managed";
/** Return true for recognized env-var API-key placeholders, excluding AWS SDK markers. */
declare function isKnownEnvApiKeyMarker(value: string): boolean;
/** Build the persisted OAuth marker for one provider id. */
declare function resolveOAuthApiKeyMarker(providerId: string): string;
/** Resolve the API-key placeholder for a non-env secret-ref source. */
declare function resolveNonEnvSecretRefApiKeyMarker(_source: SecretRefSource): string;
/** Return true for persisted non-secret placeholders that should not be treated as real keys. */
declare function isNonSecretApiKeyMarker(value: string, opts?: {
  includeEnvVarName?: boolean;
}): boolean;
//#endregion
export { isKnownEnvApiKeyMarker as a, resolveOAuthApiKeyMarker as c, NON_ENV_SECRETREF_MARKER as i, CUSTOM_LOCAL_AUTH_MARKER as n, isNonSecretApiKeyMarker as o, MINIMAX_OAUTH_MARKER as r, resolveNonEnvSecretRefApiKeyMarker as s, CODEX_APP_SERVER_AUTH_MARKER as t };