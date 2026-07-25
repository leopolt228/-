import { s as normalizeSortedUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { f as safeRealpathSync, i as isPathInside } from "./path-DILYn_gk.js";
import { n as discoverOpenClawPlugins } from "./discovery-Bhd5Zo0N.js";
import { o as resolveCompatibilityHostVersion } from "./version-CeFj_iGk.js";
import { r as hasKind } from "./slots-CqNa_aqs.js";
import { n as loadPluginManifestRegistry } from "./manifest-registry-DkJa8Tn0.js";
import "./path-safety-DYp8wadK.js";
import { r as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-DjVucfOz.js";
import { c as normalizePluginsConfig, l as resolveEffectiveEnableState, u as resolveEffectivePluginActivationState } from "./config-state-rO7K73Ka.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { t as describePluginInstallSource } from "./install-source-info-DxaUUQf7.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/compat/registry.ts
const CHANNEL_RUNTIME_SDK_SURFACE = ["openclaw/plugin-sdk/channel", "runtime"].join("-");
const DEPRECATED_PLUGIN_SDK_SUBPATH_RECORDS = [
	{
		code: "plugin-sdk-self-hosted-provider-setup-subpath",
		subpath: "self-hosted-provider-setup",
		owner: "provider",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/provider-setup`"
	},
	{
		code: "plugin-sdk-runtime-logger-subpath",
		subpath: "runtime-logger",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/runtime`"
	},
	{
		code: "plugin-sdk-runtime-secret-resolution-subpath",
		subpath: "runtime-secret-resolution",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/runtime` and `openclaw/plugin-sdk/secret-ref-runtime`"
	},
	{
		code: "plugin-sdk-setup-adapter-runtime-subpath",
		subpath: "setup-adapter-runtime",
		owner: "setup",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/setup-runtime`"
	},
	{
		code: "plugin-sdk-channel-streaming-subpath",
		subpath: "channel-streaming",
		owner: "channel",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-config-runtime-subpath",
		subpath: "config-runtime",
		owner: "config",
		removeAfter: "2026-09-01",
		replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`"
	},
	{
		code: "plugin-sdk-config-types-subpath",
		subpath: "config-types",
		owner: "config",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/config-contracts`"
	},
	{
		code: "plugin-sdk-config-schema-subpath",
		subpath: "config-schema",
		owner: "config",
		removeAfter: "2026-07-30",
		replacement: "plugin-local schemas with `openclaw/plugin-sdk/json-schema-runtime` for JSON Schema validation"
	},
	{
		code: "plugin-sdk-reply-dedupe-subpath",
		subpath: "reply-dedupe",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/reply-runtime`"
	},
	{
		code: "plugin-sdk-inbound-reply-dispatch-subpath",
		subpath: "inbound-reply-dispatch",
		owner: "channel",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-reply-pipeline-subpath",
		subpath: "channel-reply-pipeline",
		owner: "channel",
		removeAfter: "2026-09-01",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-reply-options-runtime-subpath",
		subpath: "channel-reply-options-runtime",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-outbound-send-deps-subpath",
		subpath: "outbound-send-deps",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-outbound-runtime-subpath",
		subpath: "outbound-runtime",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-infra-runtime-subpath",
		subpath: "infra-runtime",
		owner: "sdk",
		removeAfter: "2026-09-01",
		replacement: "focused subpaths including `openclaw/plugin-sdk/delivery-queue-runtime`, `openclaw/plugin-sdk/diagnostic-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/exec-approvals-runtime`, `openclaw/plugin-sdk/fetch-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`"
	},
	{
		code: "plugin-sdk-text-runtime-subpath",
		subpath: "text-runtime",
		owner: "sdk",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`"
	},
	{
		code: "plugin-sdk-channel-secret-runtime-subpath",
		subpath: "channel-secret-runtime",
		owner: "channel",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`"
	},
	{
		code: "plugin-sdk-agent-config-primitives-subpath",
		subpath: "agent-config-primitives",
		owner: "config",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/channel-config-schema`"
	},
	{
		code: "plugin-sdk-direct-dm-subpath",
		subpath: "direct-dm",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-inbound`"
	},
	{
		code: "plugin-sdk-direct-dm-access-subpath",
		subpath: "direct-dm-access",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-inbound`"
	},
	{
		code: "plugin-sdk-mattermost-subpath",
		subpath: "mattermost",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/command-auth`, `openclaw/plugin-sdk/channel-plugin-common`, and `openclaw/plugin-sdk/reply-history`"
	},
	{
		code: "plugin-sdk-matrix-subpath",
		subpath: "matrix",
		owner: "channel",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/run-command`"
	},
	{
		code: "plugin-sdk-channel-envelope-subpath",
		subpath: "channel-envelope",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-inbound`"
	},
	{
		code: "plugin-sdk-channel-inbound-roots-subpath",
		subpath: "channel-inbound-roots",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-inbound`"
	},
	{
		code: "plugin-sdk-channel-logging-subpath",
		subpath: "channel-logging",
		owner: "channel",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-location-subpath",
		subpath: "channel-location",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-inbound`"
	},
	{
		code: "plugin-sdk-channel-lifecycle-subpath",
		subpath: "channel-lifecycle",
		owner: "channel",
		removeAfter: "2026-09-01",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-message-subpath",
		subpath: "channel-message",
		owner: "channel",
		removeAfter: "2026-09-01",
		replacement: "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`"
	},
	{
		code: "plugin-sdk-channel-message-runtime-subpath",
		subpath: "channel-message-runtime",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-pairing-paths-subpath",
		subpath: "channel-pairing-paths",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/channel-pairing`"
	},
	{
		code: "plugin-sdk-group-access-subpath",
		subpath: "group-access",
		owner: "channel",
		removeAfter: "2026-08-15",
		replacement: "`openclaw/plugin-sdk/channel-ingress-runtime`"
	},
	{
		code: "plugin-sdk-media-generation-runtime-shared-subpath",
		subpath: "media-generation-runtime-shared",
		owner: "provider",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/media-generation-runtime`"
	},
	{
		code: "plugin-sdk-music-generation-core-subpath",
		subpath: "music-generation-core",
		owner: "provider",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/music-generation` for public types and assets; plugin-owned provider runtime helpers for provider registration"
	},
	{
		code: "plugin-sdk-memory-core-subpath",
		subpath: "memory-core",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "memory capability registration through the injected plugin API and host-prepared prompts from `openclaw/plugin-sdk/core`"
	},
	{
		code: "plugin-sdk-memory-core-engine-runtime-subpath",
		subpath: "memory-core-engine-runtime",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/memory-host-search` for active search-manager lifecycle operations"
	},
	{
		code: "plugin-sdk-memory-core-host-multimodal-subpath",
		subpath: "memory-core-host-multimodal",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/memory-core-host-engine-embeddings`"
	},
	{
		code: "plugin-sdk-memory-core-host-query-subpath",
		subpath: "memory-core-host-query",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/memory-core-host-engine-qmd`"
	},
	{
		code: "plugin-sdk-memory-core-host-events-subpath",
		subpath: "memory-core-host-events",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/memory-host-events`"
	},
	{
		code: "plugin-sdk-memory-host-files-subpath",
		subpath: "memory-host-files",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/memory-core-host-runtime-files`"
	},
	{
		code: "plugin-sdk-memory-host-status-subpath",
		subpath: "memory-host-status",
		owner: "sdk",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/memory-core-host-status`"
	},
	{
		code: "plugin-sdk-provider-auth-login-subpath",
		subpath: "provider-auth-login",
		owner: "provider",
		removeAfter: "2026-07-30",
		replacement: "provider auth hooks built with `openclaw/plugin-sdk/provider-auth`"
	},
	{
		code: "plugin-sdk-provider-zai-endpoint-subpath",
		subpath: "provider-zai-endpoint",
		owner: "provider",
		removeAfter: "2026-07-30",
		replacement: "plugin-owned endpoint detection using `openclaw/plugin-sdk/provider-http` for generic transport helpers"
	},
	{
		code: "plugin-sdk-telegram-command-config-subpath",
		subpath: "telegram-command-config",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "plugin-local Telegram command config (no public SDK import replacement)"
	},
	{
		code: "plugin-sdk-webhook-path-subpath",
		subpath: "webhook-path",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/webhook-ingress`"
	},
	{
		code: "plugin-sdk-zalouser-subpath",
		subpath: "zalouser",
		owner: "channel",
		removeAfter: "2026-07-30",
		replacement: "`openclaw/plugin-sdk/command-auth`"
	},
	{
		code: "plugin-sdk-zod-subpath",
		subpath: "zod",
		owner: "sdk",
		removeAfter: "2026-08-15",
		replacement: "the direct `zod` package import"
	},
	{
		code: "plugin-sdk-agent-dir-compat-subpath",
		subpath: "agent-dir-compat",
		owner: "agent-runtime",
		removeAfter: "2026-07-30",
		replacement: "`resolveAgentDir` or `resolveDefaultAgentDir` from `openclaw/plugin-sdk/agent-harness-runtime`"
	}
].map(({ code, subpath, owner, removeAfter, replacement }) => {
	const record = {
		code,
		status: removeAfter <= "2026-07-30" ? "removed" : "deprecated",
		owner,
		introduced: "2026-07-06",
		deprecated: "2026-07-06",
		warningStarts: "2026-07-06",
		removeAfter,
		replacement,
		docsPath: "/plugins/sdk-migration",
		surfaces: [`openclaw/plugin-sdk/${subpath}`],
		diagnostics: ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
	if (removeAfter <= "2026-07-30") return Object.assign(record, { releaseNote: `The deprecated public \`openclaw/plugin-sdk/${subpath}\` subpath was removed in the July 2026 compatibility sweep.` });
	return record;
});
const UNUSED_PUBLIC_PLUGIN_SDK_SUBPATHS = [
	"command-gating",
	"lmstudio",
	"lmstudio-runtime",
	"secret-provider-integration",
	"skills-runtime"
];
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATHS = [
	"access-groups",
	"account-resolution-runtime",
	"acp-binding-resolve-runtime",
	"acp-binding-runtime",
	"acp-runtime",
	"acp-runtime-backend",
	"agent-core",
	"agent-harness-exec-review-runtime",
	"agent-harness-task-runtime",
	"agent-harness-tool-runtime",
	"agent-media-payload",
	"agent-sessions",
	"approval-reaction-runtime",
	"approval-reference-runtime",
	"async-lock-runtime",
	"browser-config",
	"bundled-channel-config-schema",
	"channel-activity-runtime",
	"channel-config-writes",
	"channel-mention-gating",
	"channel-route",
	"channel-secret-tts-runtime",
	"channel-targets",
	"chat-channel-ids",
	"cli-backend",
	"cli-runtime",
	"codex-mcp-projection",
	"command-status-runtime",
	"command-surface",
	"concurrency-runtime",
	"context-visibility-runtime",
	"conversation-binding-runtime",
	"cron-store-runtime",
	"dangerous-name-runtime",
	"delivery-queue-runtime",
	"direct-dm-guard-policy",
	"directory-config-runtime",
	"document-extractor",
	"embedding-providers",
	"exec-approvals-runtime",
	"expect-runtime",
	"fetch-runtime",
	"file-access-runtime",
	"file-lock",
	"global-singleton",
	"group-activation",
	"heartbeat-runtime",
	"host-runtime",
	"html-entity-runtime",
	"image-generation",
	"image-generation-core",
	"image-generation-runtime",
	"inline-image-data-url-runtime",
	"json-schema-runtime",
	"json-unsafe-integers",
	"keyed-async-queue",
	"llm",
	"markdown-table-runtime",
	"media-generation-runtime",
	"media-understanding",
	"memory-core-host-embedding-registry",
	"memory-core-host-engine-embeddings",
	"memory-core-host-engine-qmd",
	"memory-core-host-engine-storage",
	"memory-core-host-runtime-cli",
	"memory-core-host-runtime-core",
	"memory-core-host-runtime-files",
	"memory-core-host-secret",
	"memory-core-host-status",
	"memory-host-core",
	"memory-host-events",
	"memory-host-markdown",
	"memory-host-search",
	"message-tool-delivery-hints",
	"migration",
	"migration-runtime",
	"music-generation",
	"node-host",
	"number-runtime",
	"outbound-media",
	"pair-loop-guard-runtime",
	"plugin-config-runtime",
	"plugin-state-runtime",
	"poll-runtime",
	"process-runtime",
	"provider-auth-api-key",
	"provider-auth-login-flow-runtime",
	"provider-auth-result",
	"provider-auth-runtime",
	"provider-catalog-live-runtime",
	"provider-catalog-shared",
	"provider-entry",
	"provider-env-vars",
	"provider-http",
	"provider-model-shared",
	"provider-model-types",
	"provider-oauth-runtime",
	"provider-onboard",
	"provider-selection-runtime",
	"provider-setup",
	"provider-stream",
	"provider-stream-family",
	"provider-stream-shared",
	"provider-tools",
	"provider-transport-runtime",
	"provider-usage",
	"provider-web-fetch",
	"provider-web-fetch-contract",
	"provider-web-search",
	"provider-web-search-config-contract",
	"provider-web-search-contract",
	"qa-runner-runtime",
	"realtime-bootstrap-context",
	"realtime-transcription",
	"realtime-voice",
	"reply-reference",
	"request-url",
	"response-limit-runtime",
	"retry-runtime",
	"runtime-doctor",
	"runtime-fetch",
	"sandbox",
	"secret-file-runtime",
	"secure-random-runtime",
	"session-binding-runtime",
	"session-catalog",
	"session-key-runtime",
	"session-transcript-hit",
	"session-transcript-runtime",
	"session-visibility",
	"simple-completion-runtime",
	"speech",
	"speech-core",
	"sqlite-runtime",
	"ssrf-dispatcher",
	"string-normalization-runtime",
	"system-event-runtime",
	"talk-config-runtime",
	"target-resolver-runtime",
	"text-autolink-runtime",
	"text-utility-runtime",
	"thread-bindings-runtime",
	"thread-bindings-session-runtime",
	"time-runtime",
	"tool-payload",
	"tool-plugin",
	"tool-results",
	"transcripts",
	"transport-ready-runtime",
	"tts-runtime",
	"types",
	"video-generation",
	"video-generation-core",
	"video-generation-runtime",
	"web-content-extractor",
	"webhook-targets",
	"windows-spawn"
];
const DOCUMENTED_PUBLIC_PLUGIN_SDK_REPLACEMENTS = {
	"agent-media-payload": {
		replacement: "typed outbound payload planning via `openclaw/plugin-sdk/channel-outbound`; retain the facade for operator-supplied local-media root resolution until a focused public seam exists",
		docsPath: "/plugins/sdk-channel-plugins"
	},
	"media-understanding": {
		replacement: "`api.registerMediaUnderstandingProvider(...)` with provider-owned request helpers and types from `openclaw/plugin-sdk/plugin-entry`",
		docsPath: "/plugins/architecture"
	},
	"memory-host-core": {
		replacement: "host-prepared memory prompts via `openclaw/plugin-sdk/core` and memory capability registration through the injected plugin API; retain the facade for companion-plugin public-artifact discovery until a focused read seam exists",
		docsPath: "/plugins/architecture-internals#context-engine-plugins"
	},
	"plugin-config-runtime": {
		replacement: "`api.pluginConfig`, runtime tool context config, and focused `config-contracts`, `runtime-config-snapshot`, or `config-mutation` subpaths",
		docsPath: "/plugins/sdk-runtime"
	}
};
const BLOCKED_PUBLIC_PLUGIN_SDK_DEMOTIONS = /* @__PURE__ */ new Set([
	"agent-media-payload",
	"media-understanding",
	"memory-host-core",
	"plugin-config-runtime",
	"tool-plugin"
]);
const UNUSED_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS = UNUSED_PUBLIC_PLUGIN_SDK_SUBPATHS.map((subpath) => ({
	code: `plugin-sdk-${subpath}-unused-subpath`,
	status: "removed",
	owner: "sdk",
	introduced: "2026-07-15",
	deprecated: "2026-07-15",
	warningStarts: "2026-07-15",
	removeAfter: "2026-07-30",
	replacement: "none needed — no known consumers; the subpath is removed without successor",
	docsPath: "/plugins/sdk-migration",
	surfaces: [`openclaw/plugin-sdk/${subpath}`],
	diagnostics: ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"],
	tests: ["src/plugins/compat/registry.test.ts"],
	releaseNote: `The unused public \`openclaw/plugin-sdk/${subpath}\` subpath was removed without a successor after the external-use corpus found no consumers.`
}));
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS = BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATHS.map((subpath) => {
	const documented = DOCUMENTED_PUBLIC_PLUGIN_SDK_REPLACEMENTS[subpath];
	const removalBlocked = BLOCKED_PUBLIC_PLUGIN_SDK_DEMOTIONS.has(subpath);
	const record = {
		code: `plugin-sdk-${subpath}-public-demotion`,
		status: removalBlocked ? "removal-pending" : "removed",
		owner: "sdk",
		introduced: "2026-07-15",
		deprecated: "2026-07-15",
		warningStarts: "2026-07-15",
		removeAfter: "2026-07-30",
		replacement: removalBlocked ? subpath === "tool-plugin" ? "retain the public subpath until plugin authoring has a nonexecuting static metadata replacement for `defineToolPlugin`" : `${documented?.replacement ?? "define and document a public replacement"}; retain the public subpath until the 2026-07-30 window closes and official plugin consumers migrate` : "subpath becomes internal (private-local-only); no external successor — no known external consumers",
		docsPath: removalBlocked ? subpath === "tool-plugin" ? "/plugins/tool-plugins" : documented?.docsPath ?? "/plugins/sdk-migration" : "/plugins/sdk-migration",
		surfaces: [`openclaw/plugin-sdk/${subpath}`],
		diagnostics: ["registry-backed public SDK demotion window; no external runtime import warning"],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
	if (!removalBlocked) return Object.assign(record, { releaseNote: `The public export for \`openclaw/plugin-sdk/${subpath}\` was removed; the module remains available to bundled plugins as a private-local-only subpath.` });
	return record;
});
const PLUGIN_COMPAT_RECORDS = [
	...DEPRECATED_PLUGIN_SDK_SUBPATH_RECORDS,
	...UNUSED_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS,
	...BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS,
	{
		code: "removed-global-api-provider-publication",
		status: "removed",
		owner: "sdk",
		introduced: "2026-05-27",
		replacement: "provider plugins via `api.registerProvider(...)`; host/runtime code registers against its lifecycle-owned `ApiRegistry`",
		docsPath: "/plugins/sdk-migration#process-global-api-provider-publication",
		surfaces: ["openclaw/plugin-sdk/llm registerApiProvider", "openclaw/plugin-sdk/llm unregisterApiProviders"],
		diagnostics: ["plugin SDK compatibility registry and migration guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The process-global API-provider publication facade was removed; provider plugins now publish through their lifecycle-owned registration, and host runtimes register directly on their prepared ApiRegistry."
	},
	{
		code: "legacy-before-agent-start",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-24",
		warningStarts: "2026-04-24",
		removeAfter: "2026-07-24",
		replacement: "`before_model_resolve` and `before_prompt_build` hooks",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"plugin hooks",
			"plugins inspect",
			"status diagnostics"
		],
		diagnostics: ["plugin compatibility notice"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "Legacy `before_agent_start` hook compatibility was removed; plugins must use `before_model_resolve` and `before_prompt_build`."
	},
	{
		code: "legacy-deactivate-hook-alias",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-05-16",
		deprecated: "2026-05-16",
		warningStarts: "2026-05-16",
		removeAfter: "2026-08-16",
		replacement: "`gateway_stop` hook",
		docsPath: "/plugins/hooks#upcoming-deprecations",
		surfaces: ["api.on(\"deactivate\", ...)", "plugin typed hook registration"],
		diagnostics: ["plugin runtime compatibility warning"],
		tests: ["src/plugins/loader.test.ts"],
		releaseNote: "`api.on(\"deactivate\", ...)` remains wired as a deprecated compatibility alias while plugins migrate to `gateway_stop`."
	},
	{
		code: "legacy-subagent-spawning-hook",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-05-30",
		deprecated: "2026-05-30",
		warningStarts: "2026-05-30",
		removeAfter: "2026-08-30",
		replacement: "`subagent_spawned` for post-launch observation; core session-binding adapters for thread routing",
		docsPath: "/plugins/hooks#upcoming-deprecations",
		surfaces: [
			"api.on(\"subagent_spawning\", ...)",
			"PluginHookSubagentSpawningEvent",
			"PluginHookSubagentSpawningResult",
			"SubagentLifecycleHookRunner.runSubagentSpawning"
		],
		diagnostics: ["plugin runtime compatibility warning"],
		tests: ["src/plugins/loader.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "`api.on(\"subagent_spawning\", ...)` remains wired only for older plugins; core now owns thread-bound subagent routing."
	},
	{
		code: "hook-only-plugin-shape",
		status: "active",
		owner: "sdk",
		introduced: "2026-04-24",
		replacement: "explicit capability registration",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"plugin shape inspection",
			"plugins inspect",
			"status diagnostics"
		],
		diagnostics: ["plugin compatibility notice"],
		tests: ["src/plugins/status.test.ts", "src/plugins/contracts/shape.contract.test.ts"]
	},
	{
		code: "deprecated-memory-embedding-provider-api",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-05-21",
		deprecated: "2026-05-21",
		warningStarts: "2026-05-21",
		removeAfter: "2026-08-21",
		replacement: "`api.registerEmbeddingProvider(...)` and `contracts.embeddingProviders`",
		docsPath: "/plugins/sdk-migration#memory-embedding-provider-api",
		surfaces: [
			"api.registerMemoryEmbeddingProvider(...)",
			"contracts.memoryEmbeddingProviders",
			"openclaw/plugin-sdk/memory-core-host-engine-embeddings registerMemoryEmbeddingProvider",
			"plugins inspect compatibility notices"
		],
		diagnostics: ["plugin compatibility notice", "plugin SDK package guardrail"],
		tests: [
			"src/plugins/status.test.ts",
			"src/plugins/compat/registry.test.ts",
			"src/plugins/contracts/plugin-sdk-package-contract-guardrails.test.ts"
		],
		releaseNote: "Memory-specific embedding provider registration remains wired as a deprecated compatibility path while providers migrate to the generic embedding provider contract."
	},
	{
		code: "deprecated-session-store-beta5-api",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-05-21",
		deprecated: "2026-07-12",
		warningStarts: "2026-07-12",
		removeAfter: "2026-10-12",
		replacement: "`getSessionEntry(...)`, `listSessionEntries(...)`, and row-level session mutations",
		docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis",
		surfaces: [
			"openclaw/plugin-sdk/session-store-runtime loadSessionStore",
			"openclaw/plugin-sdk/session-store-runtime updateSessionStore",
			"openclaw/plugin-sdk/session-store-runtime resolveSessionFilePath",
			"openclaw/plugin-sdk/session-store-runtime resolveSessionStoreEntry"
		],
		diagnostics: ["plugin SDK deprecation"],
		tests: ["src/plugin-sdk/session-store-runtime.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "The beta.5 session-store import set remains available for official plugins released with v2026.7.1-beta.5 while they migrate to row-level session access."
	},
	{
		code: "removed-session-transcript-file-api",
		status: "removed",
		owner: "sdk",
		introduced: "2026-07-01",
		replacement: "session identity (`sessionKey`/`sessionId`), `SessionTranscriptUpdate.target`, and Gateway/runtime session helpers",
		docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis",
		surfaces: [
			"saveSessionStore",
			"resolveSessionTranscriptPathInDir",
			"resolveAndPersistSessionFile",
			"readLatestAssistantTextFromSessionTranscript",
			"SessionTranscriptUpdate.sessionFile",
			"sessionFiles",
			"transcriptPath",
			"sessionFile",
			"plugins inspect compatibility notices"
		],
		diagnostics: ["plugin compatibility notice"],
		tests: ["src/plugins/status.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Session/transcript file APIs were removed with the SQLite session storage flip; plugins now use session identity and Gateway/runtime session helpers."
	},
	{
		code: "legacy-root-sdk-import",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-24",
		warningStarts: "2026-04-24",
		removeAfter: "2026-07-24",
		replacement: "focused `openclaw/plugin-sdk/<subpath>` imports",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk", "openclaw/plugin-sdk/compat"],
		diagnostics: ["OPENCLAW_PLUGIN_SDK_COMPAT_DEPRECATED"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by legacy-root-sdk-import were removed in the July 2026 sweep."
	},
	{
		code: "hook.before_tool_call.terminal-block-approval",
		status: "active",
		owner: "agent-runtime",
		introduced: "2026-04-29",
		docsPath: "/plugins/hooks",
		surfaces: ["before_tool_call block result", "before_tool_call approval result"],
		diagnostics: ["hook runner contract probe"],
		tests: ["src/plugins/hooks.security.test.ts", "src/agents/agent-tools.before-tool-call.e2e.test.ts"]
	},
	{
		code: "hook.llm-observer.privacy-payload",
		status: "active",
		owner: "agent-runtime",
		introduced: "2026-04-29",
		docsPath: "/plugins/hooks",
		surfaces: [
			"llm_input",
			"llm_output",
			"agent_end",
			"allowConversationAccess"
		],
		diagnostics: ["conversation access hook contract probe"],
		tests: ["src/agents/cli-runner.reliability.test.ts", "src/config/schema.help.quality.test.ts"]
	},
	{
		code: "api.capture.runtime-registrars",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-29",
		docsPath: "/plugins/architecture-internals",
		surfaces: [
			"createCapturedPluginRegistration",
			"capturePluginRegistration",
			"OpenClawPluginApi"
		],
		diagnostics: ["runtime registration capture contract probe"],
		tests: ["src/plugins/captured-registration.test.ts"]
	},
	{
		code: "channel.runtime.envelope-config-metadata",
		status: "active",
		owner: "channel",
		introduced: "2026-04-29",
		docsPath: "/plugins/sdk-channel-plugins",
		surfaces: [
			"api.registerChannel",
			"channel setup metadata",
			"channel message envelope"
		],
		diagnostics: ["channel runtime contract probe"],
		tests: ["src/plugin-sdk/channel-entry-contract.test.ts", "src/plugins/captured-registration.test.ts"]
	},
	{
		code: "whatsapp-web-inbound-flat-message-aliases",
		status: "deprecated",
		owner: "channel",
		introduced: "2026-05-30",
		deprecated: "2026-05-30",
		warningStarts: "2026-05-30",
		removeAfter: "2026-08-30",
		replacement: "WhatsApp `WebInboundCallbackMessage` nested contexts: `event`, `payload`, `quote`, `group`, and `platform`",
		docsPath: "/plugins/compatibility",
		surfaces: [
			"@openclaw/whatsapp WebInboundMessage flat fields",
			"WhatsApp monitorWebInbox onMessage callback",
			"WhatsApp monitorWebChannel listenerFactory injected messages"
		],
		diagnostics: ["TypeScript deprecated WebInboundMessage flat field annotations"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "WhatsApp WebInboundMessage flat fields remain wired as deprecated aliases while callbacks migrate to nested inbound contexts."
	},
	{
		code: "whatsapp-web-inbound-admission-top-level-fields",
		status: "deprecated",
		owner: "channel",
		introduced: "2026-06-14",
		deprecated: "2026-06-14",
		warningStarts: "2026-06-14",
		removeAfter: "2026-08-30",
		replacement: "WhatsApp `WebInboundMessage.admission` fields: `conversation.id`, `accountId`, `ingress.decision`, and `conversation.kind`",
		docsPath: "/plugins/compatibility",
		surfaces: [
			"@openclaw/whatsapp WebInboundMessage top-level admission fields",
			"WhatsApp monitorWebInbox onMessage callback",
			"WhatsApp monitorWebChannel listenerFactory injected messages"
		],
		diagnostics: ["TypeScript deprecated WebInboundMessage admission field annotations"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "WhatsApp WebInboundMessage top-level admission fields remain available while callbacks migrate to the admission envelope."
	},
	{
		code: "bundled-channel-sdk-compat-facades",
		status: "active",
		owner: "sdk",
		introduced: "2026-04-28",
		replacement: "generic channel SDK subpaths or plugin-local `api.ts` / `runtime-api.ts` barrels for new plugins",
		docsPath: "/plugins/sdk-overview",
		surfaces: ["openclaw/plugin-sdk/discord component message helpers", "openclaw/plugin-sdk/telegram-account resolveTelegramAccount"],
		diagnostics: ["plugin SDK compatibility registry"],
		tests: [
			"src/plugin-sdk/discord.test.ts",
			"src/plugin-sdk/telegram-account.test.ts",
			"src/plugins/contracts/plugin-sdk-package-contract-guardrails.test.ts"
		]
	},
	{
		code: "bundled-channel-config-schema-legacy",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-28",
		deprecated: "2026-04-28",
		warningStarts: "2026-04-28",
		removeAfter: "2026-07-28",
		replacement: "`openclaw/plugin-sdk/bundled-channel-config-schema` for maintained bundled plugins; plugin-local schemas for third-party plugins",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk/channel-config-schema-legacy"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by bundled-channel-config-schema-legacy were removed in the July 2026 sweep."
	},
	{
		code: "plugin-sdk-testing-barrel",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-28",
		deprecated: "2026-04-28",
		warningStarts: "2026-04-28",
		removeAfter: "2026-07-28",
		replacement: "focused `openclaw/plugin-sdk/*` test subpaths such as `plugin-test-runtime`, `channel-test-helpers`, `test-env`, and `test-fixtures`",
		docsPath: "/plugins/sdk-migration#private-testing-barrel",
		surfaces: ["openclaw/plugin-sdk/testing"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The testing subpath was private-local-only and pack-excluded in shipped stables v2026.6.5 and v2026.7.1, so it was safely removed before its removeAfter date."
	},
	{
		code: "channel-route-key-aliases",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-28",
		deprecated: "2026-04-28",
		warningStarts: "2026-04-28",
		removeAfter: "2026-07-28",
		replacement: "`channelRouteDedupeKey` and `channelRouteCompactKey`",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk/channel-route channelRouteIdentityKey", "openclaw/plugin-sdk/channel-route channelRouteKey"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by channel-route-key-aliases were removed in the July 2026 sweep."
	},
	{
		code: "channel-explicit-target-parser",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-04-28",
		deprecated: "2026-05-23",
		warningStarts: "2026-05-23",
		removeAfter: "2026-08-23",
		replacement: "`messaging.targetResolver` for target normalization and `messaging.resolveOutboundSessionRoute` for session/thread identity",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"ChannelMessagingAdapter.parseExplicitTarget",
			"openclaw/plugin-sdk/channel-route ChannelRouteExplicitTarget",
			"openclaw/plugin-sdk/channel-route ChannelRouteExplicitTargetParser",
			"openclaw/plugin-sdk/channel-route resolveChannelRouteTargetWithParser"
		],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/channels/plugins/contracts/test-helpers/surface-contract-suite.ts", "src/plugins/compat/registry.test.ts"]
	},
	{
		code: "channel-messaging-targets-subpath",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-04-28",
		deprecated: "2026-05-23",
		warningStarts: "2026-05-23",
		removeAfter: "2026-08-23",
		replacement: "`openclaw/plugin-sdk/channel-targets`",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk/messaging-targets"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"]
	},
	{
		code: "bundled-plugin-allowlist",
		status: "active",
		owner: "config",
		introduced: "2026-04-24",
		replacement: "manifest-owned plugin enablement and scoped load plans",
		docsPath: "/plugins/architecture",
		surfaces: [
			"plugins.allow",
			"bundled provider startup",
			"plugins status"
		],
		diagnostics: ["plugin status report"],
		tests: ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"]
	},
	{
		code: "bundled-plugin-enablement",
		status: "active",
		owner: "config",
		introduced: "2026-04-24",
		replacement: "manifest-owned plugin defaults and scoped load plans",
		docsPath: "/plugins/architecture",
		surfaces: [
			"plugins.entries",
			"bundled provider startup",
			"plugins status"
		],
		diagnostics: ["plugin status report"],
		tests: ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"]
	},
	{
		code: "bundled-plugin-vitest-defaults",
		status: "active",
		owner: "config",
		introduced: "2026-04-24",
		replacement: "explicit test plugin config fixtures",
		docsPath: "/plugins/architecture",
		surfaces: ["Vitest plugin defaults", "bundled provider tests"],
		diagnostics: ["test-only compatibility path"],
		tests: ["src/plugins/config-state.test.ts"]
	},
	{
		code: "provider-auth-env-vars",
		status: "removed",
		owner: "setup",
		introduced: "2026-04-24",
		deprecated: "2026-04-24",
		warningStarts: "2026-04-24",
		removeAfter: "2026-07-24",
		replacement: "`setup.providers[].envVars` and `providerAuthChoices`",
		docsPath: "/plugins/manifest",
		surfaces: ["openclaw.plugin.json providerAuthEnvVars", "provider setup"],
		diagnostics: ["manifest compatibility diagnostic"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-auth-env-vars were removed in the July 2026 sweep."
	},
	{
		code: "channel-env-vars",
		status: "removed",
		owner: "channel",
		introduced: "2026-04-24",
		deprecated: "2026-04-24",
		warningStarts: "2026-04-24",
		removeAfter: "2026-07-24",
		replacement: "`channelConfigs.<id>.schema` and setup descriptors",
		docsPath: "/plugins/manifest",
		surfaces: ["openclaw.plugin.json channelEnvVars", "channel setup"],
		diagnostics: ["manifest compatibility diagnostic"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by channel-env-vars were removed in the July 2026 sweep."
	},
	{
		code: "activation-agent-harness-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-24",
		replacement: "top-level `cliBackends[]` for CLI aliases and future `agentRuntime` ownership metadata",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onAgentHarnesses", "activation planner"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/activation-planner.test.ts"]
	},
	{
		code: "activation-provider-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-24",
		replacement: "`providers[]` manifest ownership",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onProviders", "activation planner"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/activation-planner.test.ts"]
	},
	{
		code: "activation-channel-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-24",
		replacement: "`channels[]` manifest ownership",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onChannels", "activation planner"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/activation-planner.test.ts"]
	},
	{
		code: "activation-command-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-24",
		replacement: "`commandAliases` or command contribution metadata",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onCommands", "activation planner"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/activation-planner.test.ts"]
	},
	{
		code: "activation-route-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-24",
		replacement: "HTTP route contribution metadata",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onRoutes", "activation planner"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/activation-planner.test.ts"]
	},
	{
		code: "activation-config-path-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-27",
		replacement: "manifest contribution ownership for root config surfaces",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onConfigPaths", "startup plugin selection"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/channel-plugin-ids.test.ts"]
	},
	{
		code: "activation-capability-hint",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-24",
		replacement: "manifest contribution ownership",
		docsPath: "/plugins/manifest",
		surfaces: ["activation.onCapabilities", "activation planner"],
		diagnostics: ["activation plan compat reason"],
		tests: ["src/plugins/activation-planner.test.ts"]
	},
	{
		code: "embedded-harness-config-alias",
		status: "removed",
		owner: "agent-runtime",
		introduced: "2026-04-24",
		deprecated: "2026-04-25",
		warningStarts: "2026-04-25",
		removeAfter: "2026-07-25",
		replacement: "`agentRuntime` config naming",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: ["agents.defaults.embeddedHarness", "model/provider runtime selection"],
		diagnostics: ["agent runtime config compatibility"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by embedded-harness-config-alias were removed in the July 2026 sweep."
	},
	{
		code: "agent-harness-sdk-alias",
		status: "removal-pending",
		owner: "agent-runtime",
		introduced: "2026-04-24",
		deprecated: "2026-04-25",
		warningStarts: "2026-04-25",
		removeAfter: "2026-07-25",
		replacement: "`openclaw/plugin-sdk/agent-runtime`; retain the public aliases until the shipped SDK contract has a replacement window backed by external-usage proof",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: ["openclaw/plugin-sdk/agent-harness", "openclaw/plugin-sdk/agent-harness-runtime"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts"]
	},
	{
		code: "embedded-pi-agent-sdk-aliases",
		status: "deprecated",
		owner: "agent-runtime",
		introduced: "2026-05-21",
		deprecated: "2026-05-21",
		warningStarts: "2026-05-21",
		removeAfter: "2026-08-21",
		replacement: "`runEmbeddedAgent` and `EmbeddedAgent*` SDK/runtime names",
		docsPath: "/plugins/sdk-runtime",
		surfaces: [
			"api.runtime.agent.runEmbeddedPiAgent",
			"openclaw/extension-api runEmbeddedPiAgent",
			"openclaw/plugin-sdk/agent-harness-runtime EmbeddedPi* aliases"
		],
		diagnostics: ["plugin SDK compatibility registry"],
		tests: ["src/plugins/runtime/index.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"],
		releaseNote: "Legacy `runEmbeddedPiAgent` and `EmbeddedPi*` plugin aliases remain as deprecated SDK compatibility only."
	},
	{
		code: "agent-harness-id-alias",
		status: "removed",
		owner: "agent-runtime",
		introduced: "2026-04-24",
		deprecated: "2026-04-25",
		warningStarts: "2026-04-25",
		removeAfter: "2026-07-25",
		replacement: "`agentRuntime` ids and policy metadata",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: ["manifest/catalog execution policy", "runtime selection"],
		diagnostics: ["agent runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by agent-harness-id-alias were removed in the July 2026 sweep."
	},
	{
		code: "generated-bundled-channel-config-fallback",
		status: "active",
		owner: "channel",
		introduced: "2026-04-24",
		replacement: "manifest registry `channelConfigs` metadata",
		docsPath: "/plugins/manifest",
		surfaces: ["generated bundled channel config metadata", "channel config validation"],
		diagnostics: ["channel config metadata fallback"],
		tests: ["src/plugins/contracts/config-footprint-guardrails.test.ts"]
	},
	{
		code: "disable-persisted-plugin-registry-env",
		status: "removed",
		owner: "config",
		introduced: "2026-04-25",
		deprecated: "2026-04-25",
		warningStarts: "2026-04-25",
		removeAfter: "2026-07-25",
		replacement: "`openclaw plugins registry --refresh` and `openclaw doctor --fix`",
		docsPath: "/cli/plugins#registry",
		surfaces: ["OPENCLAW_DISABLE_PERSISTED_PLUGIN_REGISTRY", "plugin registry reads"],
		diagnostics: ["persisted-registry-disabled"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by disable-persisted-plugin-registry-env were removed in the July 2026 sweep."
	},
	{
		code: "plugin-registry-install-migration-env",
		status: "removed",
		owner: "config",
		introduced: "2026-04-25",
		deprecated: "2026-04-25",
		warningStarts: "2026-04-25",
		removeAfter: "2026-07-25",
		replacement: "`openclaw plugins registry --refresh` and `openclaw doctor --fix`",
		docsPath: "/cli/plugins#registry",
		surfaces: [
			"OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION",
			"OPENCLAW_FORCE_PLUGIN_REGISTRY_MIGRATION",
			"package postinstall plugin registry migration"
		],
		diagnostics: ["postinstall migration skip", "postinstall migration force deprecation warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-registry-install-migration-env were removed in the July 2026 sweep."
	},
	{
		code: "plugin-install-config-ledger",
		status: "removed",
		owner: "config",
		introduced: "2026-04-25",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "shared SQLite `installed_plugin_index` install ledger",
		docsPath: "/cli/plugins#registry",
		surfaces: ["plugins.installs authored config", "plugin install/update migration"],
		diagnostics: ["config write migration warning", "doctor registry migration"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-install-config-ledger were removed in the July 2026 sweep."
	},
	{
		code: "bundled-plugin-load-path-aliases",
		status: "removed",
		owner: "config",
		introduced: "2026-04-25",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "packaged bundled plugins resolved through the persisted plugin registry",
		docsPath: "/cli/plugins#registry",
		surfaces: ["plugins.load.paths entries pointing at bundled plugin source/dist paths"],
		diagnostics: ["doctor bundled plugin load-path warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by bundled-plugin-load-path-aliases were removed in the July 2026 sweep."
	},
	{
		code: "plugin-owned-web-search-config",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-26",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`plugins.entries.<plugin>.config.webSearch`",
		docsPath: "/tools/web",
		surfaces: ["tools.web.search.apiKey", "tools.web.search.<provider>"],
		diagnostics: ["doctor legacy web-search config migration"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-owned-web-search-config were removed in the July 2026 sweep."
	},
	{
		code: "plugin-owned-web-fetch-config",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-26",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`plugins.entries.firecrawl.config.webFetch`",
		docsPath: "/tools/web-fetch",
		surfaces: ["tools.web.fetch.firecrawl"],
		diagnostics: ["doctor legacy web-fetch config migration"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-owned-web-fetch-config were removed in the July 2026 sweep."
	},
	{
		code: "plugin-owned-x-search-config",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-26",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`plugins.entries.xai.config.webSearch.apiKey`",
		docsPath: "/tools/grok-search",
		surfaces: ["tools.web.x_search.apiKey"],
		diagnostics: ["doctor legacy x_search config migration"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-owned-x-search-config were removed in the July 2026 sweep."
	},
	{
		code: "plugin-activate-entrypoint-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`register(api)` plugin entrypoint",
		docsPath: "/plugins/sdk-entrypoints",
		surfaces: ["plugin module `activate(api)`", "plugin loader registration"],
		diagnostics: ["loader compatibility path"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-activate-entrypoint-alias were removed in the July 2026 sweep."
	},
	{
		code: "setup-runtime-fallback",
		status: "active",
		owner: "setup",
		introduced: "2026-04-24",
		replacement: "`setup.requiresRuntime: false` with complete setup descriptors",
		docsPath: "/plugins/manifest#setup-reference",
		surfaces: ["setup-api runtime fallback", "setup.requiresRuntime omitted"],
		diagnostics: ["setup registry runtime diagnostic"],
		tests: ["src/plugins/setup-registry.test.ts", "src/plugins/setup-registry.runtime.test.ts"]
	},
	{
		code: "provider-discovery-hook-alias",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`catalog.run(...)` provider catalog hook",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["provider plugin `discovery` hook", "provider catalog resolution"],
		diagnostics: ["provider validation warning when catalog and discovery both register"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-discovery-hook-alias were removed in the July 2026 sweep."
	},
	{
		code: "channel-exposure-legacy-aliases",
		status: "removed",
		owner: "channel",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`openclaw.channel.exposure` metadata",
		docsPath: "/plugins/sdk-setup",
		surfaces: ["openclaw.channel.showConfigured", "openclaw.channel.showInSetup"],
		diagnostics: ["channel exposure compatibility path"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by channel-exposure-legacy-aliases were removed in the July 2026 sweep."
	},
	{
		code: "channel-runtime-sdk-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "focused channel SDK subpaths, especially `openclaw/plugin-sdk/channel-runtime-context`",
		docsPath: "/plugins/sdk-migration",
		surfaces: [CHANNEL_RUNTIME_SDK_SURFACE],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by channel-runtime-sdk-alias were removed in the July 2026 sweep."
	},
	{
		code: "command-auth-status-builders",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`openclaw/plugin-sdk/command-status`",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"openclaw/plugin-sdk/command-auth buildCommandsMessage",
			"openclaw/plugin-sdk/command-auth buildCommandsMessagePaginated",
			"openclaw/plugin-sdk/command-auth buildHelpMessage"
		],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by command-auth-status-builders were removed in the July 2026 sweep."
	},
	{
		code: "clawdbot-config-type-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`OpenClawConfig`",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk `ClawdbotConfig` type export"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by clawdbot-config-type-alias were removed in the July 2026 sweep."
	},
	{
		code: "openclaw-schema-type-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-26",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`OpenClawConfig` from `openclaw/plugin-sdk/config-schema`",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk `OpenClawSchemaType` type export"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by openclaw-schema-type-alias were removed in the July 2026 sweep."
	},
	{
		code: "legacy-extension-api-import",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "injected `api.runtime.*` helpers or focused `openclaw/plugin-sdk/<subpath>` imports",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/extension-api"],
		diagnostics: ["OPENCLAW_EXTENSION_API_DEPRECATED"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by legacy-extension-api-import were removed in the July 2026 sweep."
	},
	{
		code: "memory-split-registration",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`api.registerMemoryCapability({ promptBuilder, flushPlanResolver, runtime })`",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"api.registerMemoryPromptSection",
			"api.registerMemoryFlushPlan",
			"api.registerMemoryRuntime",
			"src/plugins/memory-state split registration helpers"
		],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by memory-split-registration were removed in the July 2026 sweep."
	},
	{
		code: "provider-static-capabilities-bag",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "explicit provider hooks such as `buildReplayPolicy`, `normalizeToolSchemas`, and `wrapStreamFn`",
		docsPath: "/plugins/sdk-provider-plugins",
		surfaces: ["ProviderPlugin.capabilities", "ProviderCapabilities"],
		diagnostics: ["provider validation warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-static-capabilities-bag were removed in the July 2026 sweep."
	},
	{
		code: "provider-discovery-type-aliases",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`ProviderCatalogOrder`, `ProviderCatalogContext`, `ProviderCatalogResult`, and `ProviderPluginCatalog`",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"ProviderDiscoveryOrder",
			"ProviderDiscoveryContext",
			"ProviderDiscoveryResult",
			"ProviderPluginDiscovery"
		],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-discovery-type-aliases were removed in the July 2026 sweep."
	},
	{
		code: "provider-thinking-policy-hooks",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`resolveThinkingProfile`",
		docsPath: "/plugins/sdk-provider-plugins",
		surfaces: [
			"ProviderPlugin.isBinaryThinking",
			"ProviderPlugin.supportsXHighThinking",
			"ProviderPlugin.resolveDefaultThinkingLevel"
		],
		diagnostics: ["provider runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-thinking-policy-hooks were removed in the July 2026 sweep."
	},
	{
		code: "provider-external-oauth-profiles-hook",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`contracts.externalAuthProviders` plus `resolveExternalAuthProfiles`",
		docsPath: "/plugins/sdk-provider-plugins",
		surfaces: ["ProviderPlugin.resolveExternalOAuthProfiles"],
		diagnostics: ["provider external auth fallback warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-external-oauth-profiles-hook were removed in the July 2026 sweep."
	},
	{
		code: "agent-tool-result-harness-alias",
		status: "removed",
		owner: "agent-runtime",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`runtime` and `runtimes` agent tool-result middleware fields",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: [
			"AgentToolResultMiddlewareHarness",
			"AgentToolResultMiddlewareContext.harness",
			"AgentToolResultMiddlewareOptions.harnesses",
			"normalizeAgentToolResultMiddlewareHarnesses"
		],
		diagnostics: ["agent runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by agent-tool-result-harness-alias were removed in the July 2026 sweep."
	},
	{
		code: "runtime-config-load-write",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-27",
		deprecated: "2026-04-27",
		warningStarts: "2026-04-27",
		removeAfter: "2026-07-27",
		replacement: "`api.runtime.config.current()`, passed config values, `mutateConfigFile(...)`, or `replaceConfigFile(...)`",
		docsPath: "/plugins/sdk-runtime#config-loading-and-writes",
		surfaces: ["api.runtime.config.loadConfig", "api.runtime.config.writeConfigFile"],
		diagnostics: [
			"plugin runtime compatibility warning",
			"deprecated API usage guard",
			"runtime channel config boundary guard"
		],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by runtime-config-load-write were removed in the July 2026 sweep."
	},
	{
		code: "runtime-taskflow-legacy-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`api.runtime.tasks.managedFlows` for managed mutations or `api.runtime.tasks.flows` for DTO reads",
		docsPath: "/plugins/sdk-runtime",
		surfaces: ["api.runtime.taskFlow", "api.runtime.tasks.flow"],
		diagnostics: ["plugin runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by runtime-taskflow-legacy-alias were removed in the July 2026 sweep."
	},
	{
		code: "runtime-subagent-get-session-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`api.runtime.subagent.getSessionMessages`",
		docsPath: "/plugins/sdk-runtime",
		surfaces: ["api.runtime.subagent.getSession"],
		diagnostics: ["plugin runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by runtime-subagent-get-session-alias were removed in the July 2026 sweep."
	},
	{
		code: "runtime-stt-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`api.runtime.mediaUnderstanding.transcribeAudioFile`",
		docsPath: "/plugins/sdk-runtime",
		surfaces: ["api.runtime.stt.transcribeAudioFile"],
		diagnostics: ["plugin runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by runtime-stt-alias were removed in the July 2026 sweep."
	},
	{
		code: "runtime-inbound-envelope-alias",
		status: "removed",
		owner: "channel",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`BodyForAgent` plus structured user-context blocks",
		docsPath: "/plugins/sdk-runtime",
		surfaces: ["api.runtime.channel.reply.formatInboundEnvelope"],
		diagnostics: ["channel runtime compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by runtime-inbound-envelope-alias were removed in the July 2026 sweep."
	},
	{
		code: "channel-native-message-schema-helpers",
		status: "removed",
		owner: "channel",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "semantic `presentation` capabilities",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk/channel-actions createMessageToolButtonsSchema", "openclaw/plugin-sdk/channel-actions createMessageToolCardSchema"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by channel-native-message-schema-helpers were removed in the July 2026 sweep."
	},
	{
		code: "channel-mention-gating-legacy-helpers",
		status: "removed",
		owner: "channel",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "`resolveInboundMentionDecision({ facts, policy })`",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"openclaw/plugin-sdk/channel-inbound resolveMentionGating",
			"openclaw/plugin-sdk/channel-inbound resolveMentionGatingWithBypass",
			"openclaw/plugin-sdk/channel-mention-gating resolveMentionGating",
			"openclaw/plugin-sdk/channel-mention-gating resolveMentionGatingWithBypass"
		],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by channel-mention-gating-legacy-helpers were removed in the July 2026 sweep."
	},
	{
		code: "provider-web-search-core-wrapper",
		status: "removed",
		owner: "provider",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "provider-owned `createTool(...)` on the returned `WebSearchProviderPlugin`",
		docsPath: "/plugins/sdk-provider-plugins",
		surfaces: ["openclaw/plugin-sdk/provider-web-search createPluginBackedWebSearchProvider"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by provider-web-search-core-wrapper were removed in the July 2026 sweep."
	},
	{
		code: "approval-capability-approvals-alias",
		status: "removed",
		owner: "channel",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "top-level `delivery`, `nativeRuntime`, `render`, and `native` approval capability fields",
		docsPath: "/plugins/sdk-channel-plugins",
		surfaces: ["createChannelApprovalCapability({ approvals })"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by approval-capability-approvals-alias were removed in the July 2026 sweep."
	},
	{
		code: "plugin-sdk-test-utils-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-24",
		deprecated: "2026-04-26",
		warningStarts: "2026-04-26",
		removeAfter: "2026-07-26",
		replacement: "focused `openclaw/plugin-sdk/*` test subpaths",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk/test-utils"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated compatibility surfaces tracked by plugin-sdk-test-utils-alias were removed in the July 2026 sweep."
	}
];
const pluginCompatRecordByCode = new Map(PLUGIN_COMPAT_RECORDS.map((record) => [record.code, record]));
function listPluginCompatRecords() {
	return PLUGIN_COMPAT_RECORDS;
}
function getPluginCompatRecord(code) {
	const record = pluginCompatRecordByCode.get(code);
	if (!record) throw new Error(`Unknown plugin compatibility code: ${code}`);
	return record;
}
//#endregion
//#region src/plugins/installed-plugin-index-hash.ts
function hashString(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
/** Hashes JSON-serializable data with SHA-256. */
function hashJson(value) {
	return hashString(JSON.stringify(value));
}
/** Safely hashes a file, optionally recording required-file diagnostics. */
function safeHashFile(params) {
	try {
		return crypto.createHash("sha256").update(fs.readFileSync(params.filePath)).digest("hex");
	} catch (err) {
		if (params.required) params.diagnostics.push({
			level: "warn",
			...params.pluginId ? { pluginId: params.pluginId } : {},
			source: params.filePath,
			message: `installed plugin index could not hash ${params.filePath}: ${err instanceof Error ? err.message : String(err)}`
		});
		return;
	}
}
/** Reads a safe file signature for installed plugin index freshness checks. */
function safeFileSignature(filePath) {
	try {
		const stat = fs.statSync(filePath);
		if (!stat.isFile()) return;
		return {
			size: stat.size,
			mtimeMs: stat.mtimeMs,
			ctimeMs: stat.ctimeMs
		};
	} catch {
		return;
	}
}
/** Compares current file metadata with a stored installed-plugin file signature. */
function fileSignatureMatches(filePath, signature) {
	if (!signature) return;
	if (typeof signature.ctimeMs !== "number") return;
	const current = safeFileSignature(filePath);
	if (!current) return false;
	return current.size === signature.size && current.mtimeMs === signature.mtimeMs && current.ctimeMs === signature.ctimeMs;
}
//#endregion
//#region src/plugins/installed-plugin-index-policy.ts
/** Hashes plugin compat registry state that can affect installed index validity. */
function resolveCompatRegistryVersion() {
	return hashJson(listPluginCompatRecords().map((record) => ({
		code: record.code,
		status: record.status,
		deprecated: record.deprecated,
		warningStarts: record.warningStarts,
		removeAfter: record.removeAfter,
		replacement: record.replacement
	})));
}
/** Hashes config policy inputs that can change installed plugin activation. */
function resolveInstalledPluginIndexPolicyHash(config) {
	const normalized = normalizePluginsConfig(config?.plugins);
	const channelPolicy = {};
	const channels = config?.channels;
	if (channels && typeof channels === "object" && !Array.isArray(channels)) {
		for (const [channelId, value] of Object.entries(channels)) if (value && typeof value === "object" && !Array.isArray(value)) {
			const enabled = value.enabled;
			if (typeof enabled === "boolean") channelPolicy[channelId] = enabled;
		}
	}
	return hashJson({
		plugins: {
			enabled: normalized.enabled,
			allow: normalized.allow,
			deny: normalized.deny,
			slots: normalized.slots,
			entries: Object.fromEntries(Object.entries(normalized.entries).flatMap(([pluginId, entry]) => typeof entry.enabled === "boolean" ? [[pluginId, entry.enabled]] : []).toSorted(([left], [right]) => left.localeCompare(right)))
		},
		channels: Object.fromEntries(Object.entries(channelPolicy).toSorted(([left], [right]) => left.localeCompare(right)))
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-install-records.ts
function setInstallStringField(target, key, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (normalized) target[key] = normalized;
}
function setInstallNumberField(target, key, value) {
	if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) target[key] = value;
}
function setInstallBooleanField(target, key, value) {
	if (typeof value === "boolean") target[key] = value;
}
function setInstallStringArrayField(target, key, value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
	if (normalized.length > 0) target[key] = normalized;
}
function normalizeInstallRecord(record) {
	if (!record) return;
	const normalized = { source: record.source };
	setInstallStringField(normalized, "spec", record.spec);
	setInstallStringField(normalized, "sourcePath", record.sourcePath);
	setInstallStringField(normalized, "installPath", record.installPath);
	setInstallStringField(normalized, "version", record.version);
	setInstallStringField(normalized, "resolvedName", record.resolvedName);
	setInstallStringField(normalized, "resolvedVersion", record.resolvedVersion);
	setInstallStringField(normalized, "resolvedSpec", record.resolvedSpec);
	setInstallStringField(normalized, "integrity", record.integrity);
	setInstallStringField(normalized, "shasum", record.shasum);
	setInstallStringField(normalized, "resolvedAt", record.resolvedAt);
	setInstallStringField(normalized, "installedAt", record.installedAt);
	setInstallStringField(normalized, "clawhubUrl", record.clawhubUrl);
	setInstallStringField(normalized, "clawhubPackage", record.clawhubPackage);
	setInstallStringField(normalized, "clawhubFamily", record.clawhubFamily);
	setInstallStringField(normalized, "clawhubChannel", record.clawhubChannel);
	setInstallStringField(normalized, "clawhubTrustDisposition", record.clawhubTrustDisposition);
	setInstallStringField(normalized, "clawhubTrustScanStatus", record.clawhubTrustScanStatus);
	setInstallStringField(normalized, "clawhubTrustModerationState", record.clawhubTrustModerationState);
	setInstallStringArrayField(normalized, "clawhubTrustReasons", record.clawhubTrustReasons);
	setInstallBooleanField(normalized, "clawhubTrustPending", record.clawhubTrustPending);
	setInstallBooleanField(normalized, "clawhubTrustStale", record.clawhubTrustStale);
	setInstallStringField(normalized, "clawhubTrustCheckedAt", record.clawhubTrustCheckedAt);
	setInstallStringField(normalized, "clawhubTrustAcknowledgedAt", record.clawhubTrustAcknowledgedAt);
	setInstallStringField(normalized, "artifactKind", record.artifactKind);
	setInstallStringField(normalized, "artifactFormat", record.artifactFormat);
	setInstallStringField(normalized, "npmIntegrity", record.npmIntegrity);
	setInstallStringField(normalized, "npmShasum", record.npmShasum);
	setInstallStringField(normalized, "npmTarballName", record.npmTarballName);
	setInstallStringField(normalized, "clawpackSha256", record.clawpackSha256);
	setInstallNumberField(normalized, "clawpackSpecVersion", record.clawpackSpecVersion);
	setInstallStringField(normalized, "clawpackManifestSha256", record.clawpackManifestSha256);
	setInstallNumberField(normalized, "clawpackSize", record.clawpackSize);
	setInstallStringField(normalized, "gitUrl", record.gitUrl);
	setInstallStringField(normalized, "gitRef", record.gitRef);
	setInstallStringField(normalized, "gitCommit", record.gitCommit);
	setInstallStringField(normalized, "marketplaceName", record.marketplaceName);
	setInstallStringField(normalized, "marketplaceSource", record.marketplaceSource);
	setInstallStringField(normalized, "marketplacePlugin", record.marketplacePlugin);
	return normalized;
}
function restoreInstallRecord(record) {
	if (!record?.source) return;
	return structuredClone(record);
}
/** Normalizes raw plugin install records into index-safe install record metadata. */
function normalizeInstallRecordMap(records) {
	const normalized = {};
	for (const [pluginId, record] of Object.entries(records ?? {}).toSorted(([left], [right]) => left.localeCompare(right))) {
		const installRecord = normalizeInstallRecord(record);
		if (installRecord) normalized[pluginId] = installRecord;
	}
	return normalized;
}
function restoreInstallRecordMap(records) {
	const restored = {};
	for (const [pluginId, record] of Object.entries(records ?? {}).toSorted(([left], [right]) => left.localeCompare(right))) {
		const installRecord = restoreInstallRecord(record);
		if (installRecord) restored[pluginId] = installRecord;
	}
	return restored;
}
/** Extracts raw plugin install records from either current or legacy installed-index shapes. */
function extractPluginInstallRecordsFromInstalledPluginIndex(index) {
	if (index && Object.hasOwn(index, "installRecords")) return restoreInstallRecordMap(index.installRecords);
	const records = {};
	for (const plugin of index?.plugins ?? []) {
		const record = restoreInstallRecord(plugin.installRecord);
		if (record) records[plugin.pluginId] = record;
	}
	return records;
}
//#endregion
//#region src/plugins/installed-plugin-index-manifest.ts
/** True when a Claude bundle record omits its optional manifest file. */
function hasOptionalMissingPluginManifestFile(record) {
	return record.format === "bundle" && record.bundleFormat === "claude" && !fs.existsSync(record.manifestPath);
}
//#endregion
//#region src/plugins/installed-plugin-index-record-builder.ts
/** Builds installed-index records from normalized plugin manifest registry entries. */
function buildStartupInfo(record) {
	return {
		sidecar: record.activation?.onStartup === true,
		memory: hasKind(record.kind, "memory"),
		deferConfiguredChannelFullLoadUntilAfterListen: record.startupDeferConfiguredChannelFullLoadUntilAfterListen === true,
		agentHarnesses: normalizeSortedUniqueStringEntries([...record.activation?.onAgentHarnesses ?? [], ...record.cliBackends ?? []]),
		configPaths: normalizeSortedUniqueStringEntries(record.activation?.onConfigPaths)
	};
}
function buildContributionInfo(record) {
	const contracts = Object.fromEntries(Object.entries(record.contracts ?? {}).map(([key, values]) => [key, normalizeSortedUniqueStringEntries(values)]));
	return {
		channels: normalizeSortedUniqueStringEntries(record.channels),
		channelConfigs: normalizeSortedUniqueStringEntries(Object.keys(record.channelConfigs ?? {})),
		providers: normalizeSortedUniqueStringEntries(record.providers),
		modelCatalogProviders: normalizeSortedUniqueStringEntries([
			...Object.keys(record.modelCatalog?.providers ?? {}),
			...Object.keys(record.modelCatalog?.aliases ?? {}),
			...(record.modelCatalog?.suppressions ?? []).map((entry) => entry.provider)
		]),
		modelSupportPrefixes: normalizeSortedUniqueStringEntries(record.modelSupport?.modelPrefixes),
		modelSupportPatterns: normalizeSortedUniqueStringEntries(record.modelSupport?.modelPatterns),
		autoEnableProviderIds: normalizeSortedUniqueStringEntries(record.autoEnableWhenConfiguredProviders),
		commandAliases: normalizeSortedUniqueStringEntries(record.commandAliases?.map((alias) => alias.name)),
		contracts
	};
}
/** Collects compatibility codes implied by a manifest's legacy or activation surfaces. */
function collectPluginManifestCompatCodes(record) {
	const codes = [];
	if (record.activation?.onProviders?.length) codes.push("activation-provider-hint");
	if (record.activation?.onAgentHarnesses?.length) codes.push("activation-agent-harness-hint");
	if (record.activation?.onChannels?.length) codes.push("activation-channel-hint");
	if (record.activation?.onCommands?.length) codes.push("activation-command-hint");
	if (record.activation?.onRoutes?.length) codes.push("activation-route-hint");
	if (record.activation?.onConfigPaths?.length) codes.push("activation-config-path-hint");
	if (record.activation?.onCapabilities?.length) codes.push("activation-capability-hint");
	return normalizeSortedUniqueStringEntries(codes);
}
function resolvePackageJsonPath(candidate, realpathCache) {
	if (!candidate?.packageDir) return;
	const packageDir = safeRealpathSync(candidate.packageDir, realpathCache) ?? path.resolve(candidate.packageDir);
	const packageJsonPath = path.join(packageDir, "package.json");
	const rootDir = candidate.rootDir === candidate.packageDir ? packageDir : safeRealpathSync(candidate.rootDir, realpathCache) ?? path.resolve(candidate.rootDir);
	const packageJsonRealPath = safeRealpathSync(packageJsonPath, realpathCache);
	return packageJsonRealPath && isPathInside(rootDir, packageJsonRealPath) ? packageJsonPath : void 0;
}
function resolvePackageJsonRelativePath(rootDir, packageJsonPath, realpathCache) {
	const resolvedRootDir = rootDir === path.dirname(packageJsonPath) ? path.dirname(packageJsonPath) : safeRealpathSync(rootDir, realpathCache) ?? path.resolve(rootDir);
	return (path.relative(resolvedRootDir, packageJsonPath) || "package.json").split(path.sep).join("/");
}
function resolvePackageJsonRecord(params) {
	if (!params.candidate?.packageDir || !params.packageJsonPath) return;
	const hash = safeHashFile({
		filePath: params.packageJsonPath,
		pluginId: params.pluginId,
		diagnostics: params.diagnostics,
		required: false
	});
	if (!hash) return;
	const fileSignature = safeFileSignature(params.packageJsonPath);
	return {
		path: resolvePackageJsonRelativePath(params.candidate.rootDir, params.packageJsonPath, params.realpathCache),
		hash,
		...fileSignature ? { fileSignature } : {}
	};
}
function describePackageInstallSource(candidate) {
	const install = candidate?.packageManifest?.install;
	if (!install) return;
	return describePluginInstallSource(install, { expectedPackageName: candidate?.packageName });
}
function normalizeStringField(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	return normalized ? normalized : void 0;
}
function normalizePackageChannel(channel) {
	const id = normalizeStringField(channel?.id);
	if (!id) return;
	return {
		...structuredClone(channel),
		id
	};
}
function hashManifestlessBundleRecord(record) {
	return hashJson({
		id: record.id,
		name: record.name,
		description: record.description,
		version: record.version,
		format: record.format,
		bundleFormat: record.bundleFormat,
		bundleCapabilities: record.bundleCapabilities ?? [],
		skills: record.skills ?? [],
		settingsFiles: record.settingsFiles ?? [],
		hooks: record.hooks ?? []
	});
}
function resolveManifestHash(params) {
	if (hasOptionalMissingPluginManifestFile(params.record)) return hashManifestlessBundleRecord(params.record);
	const hash = safeHashFile({
		filePath: params.record.manifestPath,
		pluginId: params.record.id,
		diagnostics: params.diagnostics,
		required: true
	});
	if (hash) return hash;
	return "";
}
function buildCandidateLookup(candidates) {
	const byRootDir = /* @__PURE__ */ new Map();
	for (const candidate of candidates) byRootDir.set(candidate.rootDir, candidate);
	return byRootDir;
}
function buildInstalledPluginIndexRecords(params) {
	const candidateByRootDir = buildCandidateLookup(params.candidates);
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	const realpathCache = /* @__PURE__ */ new Map();
	return params.registry.plugins.map((record) => {
		const candidate = candidateByRootDir.get(record.rootDir);
		const packageJsonPath = resolvePackageJsonPath(candidate, realpathCache);
		const installRecord = params.installRecords[record.id];
		const packageInstall = describePackageInstallSource(candidate);
		const packageChannel = normalizePackageChannel(record.packageChannel ?? candidate?.packageManifest?.channel);
		const manifestHash = resolveManifestHash({
			record,
			diagnostics: params.diagnostics
		});
		const manifestFile = hasOptionalMissingPluginManifestFile(record) ? void 0 : safeFileSignature(record.manifestPath);
		const packageJson = resolvePackageJsonRecord({
			candidate,
			packageJsonPath,
			diagnostics: params.diagnostics,
			pluginId: record.id,
			realpathCache
		});
		const enabled = resolveEffectiveEnableState({
			id: record.id,
			origin: record.origin,
			config: normalizedConfig,
			rootConfig: params.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
		}).enabled;
		const indexRecord = {
			pluginId: record.id,
			manifestPath: record.manifestPath,
			manifestHash,
			...manifestFile ? { manifestFile } : {},
			source: record.source,
			rootDir: record.rootDir,
			origin: record.origin,
			enabled,
			startup: buildStartupInfo(record),
			contributions: buildContributionInfo(record),
			compat: collectPluginManifestCompatCodes(record)
		};
		if (record.format && record.format !== "openclaw") indexRecord.format = record.format;
		if (record.bundleFormat) indexRecord.bundleFormat = record.bundleFormat;
		if (record.enabledByDefault === true) indexRecord.enabledByDefault = true;
		if (record.enabledByDefaultOnPlatforms?.length) indexRecord.enabledByDefaultOnPlatforms = [...record.enabledByDefaultOnPlatforms];
		if (record.syntheticAuthRefs?.length) indexRecord.syntheticAuthRefs = [...record.syntheticAuthRefs];
		if (record.setupSource) indexRecord.setupSource = record.setupSource;
		if (candidate?.packageName) indexRecord.packageName = candidate.packageName;
		if (candidate?.packageVersion) indexRecord.packageVersion = candidate.packageVersion;
		if (installRecord) indexRecord.installRecordHash = hashJson(installRecord);
		if (packageInstall) indexRecord.packageInstall = packageInstall;
		if (packageChannel) indexRecord.packageChannel = packageChannel;
		if (candidate?.packageManifest?.build) indexRecord.packageBuild = structuredClone(candidate.packageManifest.build);
		if (packageJson) indexRecord.packageJson = packageJson;
		return indexRecord;
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-registry.ts
/** Resolves discovery candidates and manifest registry for installed plugin index loading. */
function resolveInstalledPluginIndexRegistry(params) {
	if (params.candidates) return {
		candidates: params.candidates,
		registry: loadPluginManifestRegistry({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			installRecords: params.installRecords
		})
	};
	const normalized = normalizePluginsConfig(params.config?.plugins);
	const installRecords = params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
	const discovery = params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalized.loadPaths,
		env: params.env,
		installRecords
	});
	return {
		candidates: discovery.candidates,
		discovery,
		registry: loadPluginManifestRegistry({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			candidates: discovery.candidates,
			diagnostics: discovery.diagnostics,
			installRecords
		})
	};
}
//#endregion
//#region src/plugins/installed-plugin-index-types.ts
const INSTALLED_PLUGIN_INDEX_WARNING = "DO NOT EDIT. This file is generated by OpenClaw from plugin manifests, install records, and config policy. Use `openclaw plugins registry --refresh`, `openclaw plugins install/update/uninstall`, or `openclaw plugins enable/disable` instead.";
//#endregion
//#region src/plugins/installed-plugin-index-config-path-scope.ts
/** Compat code marking install records that need config-path activation metadata. */
const CONFIG_PATH_ACTIVATION_COMPAT_CODE = "activation-config-path-hint";
function recordUsesConfigPathActivation(plugin) {
	return plugin.compat.includes(CONFIG_PATH_ACTIVATION_COMPAT_CODE);
}
/** True when an index still has config-path activation records missing startup metadata. */
function hasMissingConfigPathActivationMetadata(index) {
	return index.plugins.some((plugin) => recordUsesConfigPathActivation(plugin) && plugin.startup.configPaths === void 0);
}
/** True when a record migrated config-path activation startup metadata. */
function hasConfigPathActivationMetadataMigration(params) {
	return recordUsesConfigPathActivation(params.previous) && params.previous.startup.configPaths === void 0 && params.current.startup.configPaths !== void 0;
}
//#endregion
//#region src/plugins/installed-plugin-index-invalidation.ts
function diffInstalledPluginIndexInvalidationReasons(previous, current) {
	const reasons = /* @__PURE__ */ new Set();
	if (previous.version !== current.version) reasons.add("missing");
	if (previous.hostContractVersion !== current.hostContractVersion) reasons.add("host-contract-changed");
	if (previous.compatRegistryVersion !== current.compatRegistryVersion) reasons.add("compat-registry-changed");
	if (previous.migrationVersion !== current.migrationVersion) reasons.add("migration");
	if (previous.policyHash !== current.policyHash) reasons.add("policy-changed");
	if (hashJson(previous.installRecords ?? {}) !== hashJson(current.installRecords ?? {})) reasons.add("source-changed");
	const previousByPluginId = new Map(previous.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const currentByPluginId = new Map(current.plugins.map((plugin) => [plugin.pluginId, plugin]));
	for (const [pluginId, previousPlugin] of previousByPluginId) {
		const currentPlugin = currentByPluginId.get(pluginId);
		if (!currentPlugin) {
			reasons.add("source-changed");
			continue;
		}
		if (previousPlugin.rootDir !== currentPlugin.rootDir || previousPlugin.manifestPath !== currentPlugin.manifestPath || previousPlugin.installRecordHash !== currentPlugin.installRecordHash) reasons.add("source-changed");
		if (previousPlugin.enabled !== currentPlugin.enabled) reasons.add("policy-changed");
		if (hasConfigPathActivationMetadataMigration({
			previous: previousPlugin,
			current: currentPlugin
		})) reasons.add("migration");
		if (previousPlugin.manifestHash !== currentPlugin.manifestHash) reasons.add("stale-manifest");
		if (previousPlugin.packageVersion !== currentPlugin.packageVersion || previousPlugin.packageJson?.path !== currentPlugin.packageJson?.path || previousPlugin.packageJson?.hash !== currentPlugin.packageJson?.hash) reasons.add("stale-package");
	}
	for (const pluginId of currentByPluginId.keys()) if (!previousByPluginId.has(pluginId)) {
		if (currentByPluginId.get(pluginId)?.enabled === false) continue;
		reasons.add("source-changed");
	}
	return Array.from(reasons).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/installed-plugin-index.ts
function buildInstalledPluginIndex(params) {
	const env = params.env ?? process.env;
	const { candidates, registry, discovery } = resolveInstalledPluginIndexRegistry(params);
	const diagnostics = [...registry.diagnostics ?? []];
	const generatedAtMs = (params.now?.() ?? /* @__PURE__ */ new Date()).getTime();
	const installRecords = normalizeInstallRecordMap(params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({
		env,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.pluginIndexFilePath ? { filePath: params.pluginIndexFilePath } : {}
	}));
	const plugins = buildInstalledPluginIndexRecords({
		candidates,
		registry,
		config: params.config,
		diagnostics,
		installRecords
	});
	return {
		index: {
			version: 1,
			warning: INSTALLED_PLUGIN_INDEX_WARNING,
			hostContractVersion: resolveCompatibilityHostVersion(env),
			compatRegistryVersion: resolveCompatRegistryVersion(),
			migrationVersion: 1,
			policyHash: resolveInstalledPluginIndexPolicyHash(params.config),
			generatedAtMs,
			...params.refreshReason ? { refreshReason: params.refreshReason } : {},
			installRecords,
			plugins,
			diagnostics
		},
		discovery
	};
}
function loadInstalledPluginIndex(params = {}) {
	return buildInstalledPluginIndex(params).index;
}
function loadInstalledPluginIndexWithDiscovery(params = {}) {
	return buildInstalledPluginIndex(params);
}
function refreshInstalledPluginIndex(params) {
	return buildInstalledPluginIndex({
		...params,
		refreshReason: params.reason
	}).index;
}
function getInstalledPluginRecord(index, pluginId) {
	return index.plugins.find((plugin) => plugin.pluginId === pluginId);
}
function isInstalledPluginEnabled(index, pluginId, config) {
	const record = getInstalledPluginRecord(index, pluginId);
	if (!record) return false;
	if (!config) return record.enabled;
	const normalizedConfig = normalizePluginsConfig(config?.plugins);
	const state = resolveEffectivePluginActivationState({
		id: record.pluginId,
		origin: record.origin,
		config: normalizedConfig,
		rootConfig: config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
	});
	return state.enabled && (record.enabled || state.explicitlyEnabled);
}
//#endregion
export { getPluginCompatRecord as _, refreshInstalledPluginIndex as a, hasMissingConfigPathActivationMetadata as c, hasOptionalMissingPluginManifestFile as d, extractPluginInstallRecordsFromInstalledPluginIndex as f, hashJson as g, fileSignatureMatches as h, loadInstalledPluginIndexWithDiscovery as i, INSTALLED_PLUGIN_INDEX_WARNING as l, resolveInstalledPluginIndexPolicyHash as m, isInstalledPluginEnabled as n, diffInstalledPluginIndexInvalidationReasons as o, resolveCompatRegistryVersion as p, loadInstalledPluginIndex as r, CONFIG_PATH_ACTIVATION_COMPAT_CODE as s, getInstalledPluginRecord as t, collectPluginManifestCompatCodes as u };
