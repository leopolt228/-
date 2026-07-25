import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Dw9i7sK6.js";
import { a as AuthProfileStore, i as AuthProfileFailureReason, n as AuthProfileBlockedSource, o as OAuthCredential, r as AuthProfileCredential } from "./types-BYLj8dvi.js";
import { t as ProviderAuthEvidence } from "./provider-env-vars-BQGF9x5I.js";

//#region src/agents/auth-profiles/constants.d.ts
/** @deprecated Anthropic provider-owned CLI profile id; do not use from third-party plugins. */
declare const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** @deprecated OpenAI provider-owned CLI profile id; do not use from third-party plugins. */
declare const CODEX_CLI_PROFILE_ID = "openai:codex-cli";
//#endregion
//#region src/agents/auth-profiles/credential-state.d.ts
/** Reason code for why a stored auth credential can or cannot be used. */
type AuthCredentialReasonCode = "ok" | "missing_credential" | "invalid_expires" | "expired" | "unresolved_ref" | "malformed_api_key";
/** Default OAuth access-token refresh margin before expiry. */
declare const DEFAULT_OAUTH_REFRESH_MARGIN_MS: number;
/** Returns true when an OAuth credential has a non-expiring access token. */
declare function hasUsableOAuthCredential(credential: OAuthCredential | undefined, opts?: {
  now?: number;
  refreshMarginMs?: number;
}): boolean;
//#endregion
//#region src/agents/provider-auth-aliases.d.ts
/** Inputs that control plugin metadata and trust scope for auth alias lookup. */
type ProviderAuthAliasLookupParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
};
/** Resolve the provider ID that should be used for credential lookup. */
declare function resolveProviderIdForAuth(provider: string, params?: ProviderAuthAliasLookupParams): string;
//#endregion
//#region src/agents/auth-profiles/order.d.ts
/** Reason a profile is or is not eligible for provider auth. */
type AuthProfileEligibilityReasonCode = AuthCredentialReasonCode | "profile_missing" | "provider_mismatch" | "mode_mismatch";
/** Eligibility decision for one auth profile candidate. */
type AuthProfileEligibility = {
  eligible: boolean;
  reasonCode: AuthProfileEligibilityReasonCode;
};
/** Returns true when a stored credential can authenticate the requested provider. */
/** Resolves whether a profile can be used for a provider right now. */
declare function resolveAuthProfileEligibility(params: {
  cfg?: OpenClawConfig;
  authAliasLookupParams?: ProviderAuthAliasLookupParams;
  store: AuthProfileStore;
  provider: string;
  profileId: string;
  now?: number;
}): AuthProfileEligibility;
type ResolveAuthProfileOrderParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  preferredProfile?: string; /** Model that will consume the profile, for model-scoped cooldowns. */
  forModel?: string; /** Read-only status keeps unresolved refs ordered so availability remains unknown. */
  readinessMode?: "execution" | "read-only";
};
/** Resolves ordered usable auth profile ids for a provider. */
declare function resolveAuthProfileOrder(params: ResolveAuthProfileOrderParams): string[];
//#endregion
//#region src/agents/auth-profiles/oauth.d.ts
type ResolveApiKeyForProfileResult = {
  apiKey: string;
  provider: string;
  email?: string;
  profileId: string;
  profileType: AuthProfileCredential["type"];
  credential?: AuthProfileCredential;
};
type ResolveApiKeyForProfileParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  profileId: string;
  agentDir?: string;
  forceRefresh?: boolean;
};
/** Refresh one OAuth credential and merge provider-returned token fields. */
declare function refreshOAuthCredentialForRuntime(params: {
  credential: OAuthCredential;
}): Promise<OAuthCredential | null>;
/** Resolve a selected auth profile into the provider API key string. */
declare function resolveApiKeyForProfile(params: ResolveApiKeyForProfileParams): Promise<ResolveApiKeyForProfileResult | null>;
//#endregion
//#region src/agents/auth-profiles/profile-list.d.ts
/** Lists auth profile ids whose credential provider matches the requested provider. */
declare function listProfilesForProvider(store: AuthProfileStore, provider: string): string[];
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.d.ts
/** Upserts an auth profile under the store lock, returning null on store write failure. */
declare function upsertAuthProfileWithLock(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
}): Promise<AuthProfileStore | null>;
//#endregion
//#region src/agents/auth-profiles/profiles.d.ts
/** Upserts an auth profile immediately into the local store. */
declare function upsertAuthProfile(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
}): void;
/** Removes all auth profiles and related state for a provider. */
declare function removeProviderAuthProfilesWithLock(params: {
  provider: string;
  agentDir?: string;
}): Promise<AuthProfileStore | null>;
//#endregion
//#region src/agents/auth-profiles/repair.d.ts
/** Suggests a modern OAuth profile id for a legacy provider:default profile. */
declare function suggestOAuthProfileIdForLegacyDefault(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  legacyProfileId: string;
}): string | null;
//#endregion
//#region src/agents/auth-profiles/usage-state.d.ts
/**
 * Check if a profile is currently in cooldown (due to rate limits, overload, or other transient failures).
 */
declare function isProfileInCooldown(store: AuthProfileStore, profileId: string, now?: number, forModel?: string): boolean;
/**
 * Clear expired cooldowns from all profiles in the store.
 *
 * When `cooldownUntil` or `disabledUntil` has passed, the corresponding fields
 * are removed and error counters are reset so the profile gets a fresh start
 * (circuit-breaker half-open -> closed). Without this, a stale `errorCount`
 * causes the *next* transient failure to immediately escalate to a much longer
 * cooldown -- the root cause of profiles appearing "stuck" after rate limits.
 *
 * `cooldownUntil` and `disabledUntil` are handled independently: if a profile
 * has both and only one has expired, only that field is cleared.
 *
 * Mutates the in-memory store; disk persistence happens lazily on the next
 * store write (e.g. `markAuthProfileSuccess` / `markAuthProfileFailure`), which
 * matches the existing save pattern throughout the auth-profiles module.
 *
 * @returns `true` if any profile was modified.
 */
declare function clearExpiredCooldowns(store: AuthProfileStore, now?: number): boolean;
//#endregion
//#region src/agents/auth-profiles/usage.d.ts
/**
 * Infer the most likely reason all candidate profiles are currently unavailable.
 *
 * We prefer explicit active `disabledReason` values (for example billing/auth)
 * over generic cooldown buckets, then fall back to failure-count signals.
 */
declare function resolveProfilesUnavailableReason(params: {
  store: AuthProfileStore;
  profileIds: string[];
  now?: number;
}): AuthProfileFailureReason | null;
/** Resolves the display-facing unusable timestamp, honoring provider bypasses. */
declare function resolveProfileUnusableUntilForDisplay(store: AuthProfileStore, profileId: string): number | null;
/** Marks a profile blocked until a provider-reported reset timestamp. */
declare function markAuthProfileBlockedUntil(params: {
  store: AuthProfileStore;
  profileId: string;
  blockedUntil: number;
  source: AuthProfileBlockedSource;
  agentDir?: string;
  runId?: string;
  modelId?: string;
}): Promise<void>;
//#endregion
//#region src/agents/model-auth-env.d.ts
type EnvApiKeyResult = {
  apiKey: string;
  source: string;
};
type EnvApiKeyLookupOptions = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  aliasMap?: Readonly<Record<string, string>>;
  candidateMap?: Readonly<Record<string, readonly string[]>>;
  authEvidenceMap?: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
  setupProviderFallbackRefs?: readonly string[];
  skipSetupProviderFallback?: boolean;
};
/** Resolve an API key or auth-evidence marker for a provider from environment state. */
declare function resolveEnvApiKey(provider: string, env?: NodeJS.ProcessEnv, options?: EnvApiKeyLookupOptions): EnvApiKeyResult | null;
//#endregion
//#region src/agents/model-auth-runtime-shared.d.ts
/** Resolved credential material and provenance for one provider request. */
type ResolvedProviderAuth = {
  apiKey?: string;
  profileId?: string;
  source: string;
  mode: "api-key" | "oauth" | "token" | "aws-sdk";
};
/** Return the AWS credential env var that proves SDK auth is configured. */
declare function resolveAwsSdkEnvVarName(env?: NodeJS.ProcessEnv): string | undefined;
/** Require a normalized API key or throw a provider-auth error. */
declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
//#endregion
//#region src/agents/model-auth.d.ts
type ProviderCredentialPrecedence = "profile-first" | "env-first";
/** Precomputed provider-auth lookup tables reused during one runtime turn. */
type RuntimeProviderAuthLookup = {
  envApiKey: Pick<EnvApiKeyLookupOptions, "aliasMap" | "candidateMap" | "authEvidenceMap" | "skipSetupProviderFallback">;
  setupProviderFallbackRefs?: readonly string[];
  syntheticAuthProviderRefs?: readonly string[];
  syntheticAuthProviderRefsComplete?: boolean;
};
/** Resolves the credential that should be used for one provider request. */
declare function resolveApiKeyForProvider(params: {
  provider: string;
  cfg?: OpenClawConfig;
  profileId?: string;
  preferredProfile?: string;
  store?: AuthProfileStore;
  agentDir?: string;
  workspaceDir?: string;
  /** When true, treat profileId as a user-locked selection that must not be
   *  silently overridden by env/config credentials. */
  lockedProfile?: boolean;
  forceRefresh?: boolean;
  credentialPrecedence?: ProviderCredentialPrecedence; /** Skip implicit profile discovery for a prepared env/config fallback attempt. */
  allowAuthProfileFallback?: boolean; /** Skip plugin setup fallback when the prepared route already excludes it. */
  skipSetupProviderFallback?: boolean;
  modelId?: string;
  modelApi?: string; /** Keep SecretRef-backed model credentials opaque until a sentinel-aware transport boundary. */
  secretSentinels?: boolean;
}): Promise<ResolvedProviderAuth>;
type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
declare function resolveModelAuthMode(provider?: string, cfg?: OpenClawConfig, store?: AuthProfileStore, options?: {
  workspaceDir?: string;
}): ModelAuthMode | undefined;
//#endregion
export { ProviderAuthAliasLookupParams as C, CLAUDE_CLI_PROFILE_ID as D, hasUsableOAuthCredential as E, CODEX_CLI_PROFILE_ID as O, resolveAuthProfileOrder as S, DEFAULT_OAUTH_REFRESH_MARGIN_MS as T, upsertAuthProfileWithLock as _, ResolvedProviderAuth as a, resolveApiKeyForProfile as b, resolveEnvApiKey as c, resolveProfilesUnavailableReason as d, clearExpiredCooldowns as f, upsertAuthProfile as g, removeProviderAuthProfilesWithLock as h, resolveModelAuthMode as i, markAuthProfileBlockedUntil as l, suggestOAuthProfileIdForLegacyDefault as m, RuntimeProviderAuthLookup as n, requireApiKey as o, isProfileInCooldown as p, resolveApiKeyForProvider as r, resolveAwsSdkEnvVarName as s, ModelAuthMode as t, resolveProfileUnusableUntilForDisplay as u, listProfilesForProvider as v, resolveProviderIdForAuth as w, resolveAuthProfileEligibility as x, refreshOAuthCredentialForRuntime as y };