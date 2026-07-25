import { i as OpenClawConfig, p as PluginInstallRecord } from "./types.openclaw-DAPZkTyD.js";
import { _ as PluginDiagnostic, i as PluginDiscoveryResult, l as PluginPackageChannel, o as OpenClawPackageBuild, r as PluginCandidate, t as PluginManifestRecord, u as PluginPackageInstall } from "./manifest-registry-C53V9sX9.js";

//#region src/plugins/compat/registry.d.ts
declare const PLUGIN_COMPAT_RECORDS: readonly [...({
  code: "plugin-sdk-self-hosted-provider-setup-subpath" | "plugin-sdk-runtime-logger-subpath" | "plugin-sdk-runtime-secret-resolution-subpath" | "plugin-sdk-setup-adapter-runtime-subpath" | "plugin-sdk-channel-streaming-subpath" | "plugin-sdk-config-runtime-subpath" | "plugin-sdk-config-types-subpath" | "plugin-sdk-config-schema-subpath" | "plugin-sdk-reply-dedupe-subpath" | "plugin-sdk-inbound-reply-dispatch-subpath" | "plugin-sdk-channel-reply-pipeline-subpath" | "plugin-sdk-channel-reply-options-runtime-subpath" | "plugin-sdk-outbound-send-deps-subpath" | "plugin-sdk-outbound-runtime-subpath" | "plugin-sdk-infra-runtime-subpath" | "plugin-sdk-text-runtime-subpath" | "plugin-sdk-channel-secret-runtime-subpath" | "plugin-sdk-agent-config-primitives-subpath" | "plugin-sdk-direct-dm-subpath" | "plugin-sdk-direct-dm-access-subpath" | "plugin-sdk-mattermost-subpath" | "plugin-sdk-matrix-subpath" | "plugin-sdk-channel-envelope-subpath" | "plugin-sdk-channel-inbound-roots-subpath" | "plugin-sdk-channel-logging-subpath" | "plugin-sdk-channel-location-subpath" | "plugin-sdk-channel-lifecycle-subpath" | "plugin-sdk-channel-message-subpath" | "plugin-sdk-channel-message-runtime-subpath" | "plugin-sdk-channel-pairing-paths-subpath" | "plugin-sdk-group-access-subpath" | "plugin-sdk-media-generation-runtime-shared-subpath" | "plugin-sdk-music-generation-core-subpath" | "plugin-sdk-memory-core-subpath" | "plugin-sdk-memory-core-engine-runtime-subpath" | "plugin-sdk-memory-core-host-multimodal-subpath" | "plugin-sdk-memory-core-host-query-subpath" | "plugin-sdk-memory-core-host-events-subpath" | "plugin-sdk-memory-host-files-subpath" | "plugin-sdk-memory-host-status-subpath" | "plugin-sdk-provider-auth-login-subpath" | "plugin-sdk-provider-zai-endpoint-subpath" | "plugin-sdk-telegram-command-config-subpath" | "plugin-sdk-webhook-path-subpath" | "plugin-sdk-zalouser-subpath" | "plugin-sdk-zod-subpath" | "plugin-sdk-agent-dir-compat-subpath";
  status: "deprecated" | "removed";
  owner: "provider" | "channel" | "setup" | "config" | "agent-runtime" | "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  removeAfter: "2026-07-30" | "2026-08-15" | "2026-09-01";
  replacement: "`openclaw/plugin-sdk/provider-setup`" | "`openclaw/plugin-sdk/runtime`" | "`openclaw/plugin-sdk/runtime` and `openclaw/plugin-sdk/secret-ref-runtime`" | "`openclaw/plugin-sdk/setup-runtime`" | "`openclaw/plugin-sdk/channel-outbound`" | "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`" | "`openclaw/plugin-sdk/config-contracts`" | "plugin-local schemas with `openclaw/plugin-sdk/json-schema-runtime` for JSON Schema validation" | "`openclaw/plugin-sdk/reply-runtime`" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "focused subpaths including `openclaw/plugin-sdk/delivery-queue-runtime`, `openclaw/plugin-sdk/diagnostic-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/exec-approvals-runtime`, `openclaw/plugin-sdk/fetch-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`" | "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`" | "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`" | "`openclaw/plugin-sdk/channel-config-schema`" | "`openclaw/plugin-sdk/channel-inbound`" | "`openclaw/plugin-sdk/command-auth`, `openclaw/plugin-sdk/channel-plugin-common`, and `openclaw/plugin-sdk/reply-history`" | "`openclaw/plugin-sdk/run-command`" | "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`" | "`openclaw/plugin-sdk/channel-pairing`" | "`openclaw/plugin-sdk/channel-ingress-runtime`" | "`openclaw/plugin-sdk/media-generation-runtime`" | "`openclaw/plugin-sdk/music-generation` for public types and assets; plugin-owned provider runtime helpers for provider registration" | "memory capability registration through the injected plugin API and host-prepared prompts from `openclaw/plugin-sdk/core`" | "`openclaw/plugin-sdk/memory-host-search` for active search-manager lifecycle operations" | "`openclaw/plugin-sdk/memory-core-host-engine-embeddings`" | "`openclaw/plugin-sdk/memory-core-host-engine-qmd`" | "`openclaw/plugin-sdk/memory-host-events`" | "`openclaw/plugin-sdk/memory-core-host-runtime-files`" | "`openclaw/plugin-sdk/memory-core-host-status`" | "provider auth hooks built with `openclaw/plugin-sdk/provider-auth`" | "plugin-owned endpoint detection using `openclaw/plugin-sdk/provider-http` for generic transport helpers" | "plugin-local Telegram command config (no public SDK import replacement)" | "`openclaw/plugin-sdk/webhook-ingress`" | "`openclaw/plugin-sdk/command-auth`" | "the direct `zod` package import" | "`resolveAgentDir` or `resolveDefaultAgentDir` from `openclaw/plugin-sdk/agent-harness-runtime`";
  docsPath: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  code: "plugin-sdk-command-gating-unused-subpath" | "plugin-sdk-lmstudio-unused-subpath" | "plugin-sdk-lmstudio-runtime-unused-subpath" | "plugin-sdk-secret-provider-integration-unused-subpath" | "plugin-sdk-skills-runtime-unused-subpath";
  status: "removed";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  removeAfter: string;
  replacement: string;
  docsPath: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
  releaseNote: string;
} | {
  code: "plugin-sdk-node-host-public-demotion" | "plugin-sdk-llm-public-demotion" | "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-sandbox-public-demotion" | "plugin-sdk-access-groups-public-demotion" | "plugin-sdk-account-resolution-runtime-public-demotion" | "plugin-sdk-acp-binding-resolve-runtime-public-demotion" | "plugin-sdk-acp-binding-runtime-public-demotion" | "plugin-sdk-acp-runtime-public-demotion" | "plugin-sdk-acp-runtime-backend-public-demotion" | "plugin-sdk-agent-core-public-demotion" | "plugin-sdk-agent-harness-exec-review-runtime-public-demotion" | "plugin-sdk-agent-harness-task-runtime-public-demotion" | "plugin-sdk-agent-harness-tool-runtime-public-demotion" | "plugin-sdk-agent-media-payload-public-demotion" | "plugin-sdk-agent-sessions-public-demotion" | "plugin-sdk-approval-reaction-runtime-public-demotion" | "plugin-sdk-approval-reference-runtime-public-demotion" | "plugin-sdk-async-lock-runtime-public-demotion" | "plugin-sdk-browser-config-public-demotion" | "plugin-sdk-bundled-channel-config-schema-public-demotion" | "plugin-sdk-channel-activity-runtime-public-demotion" | "plugin-sdk-channel-config-writes-public-demotion" | "plugin-sdk-channel-mention-gating-public-demotion" | "plugin-sdk-channel-route-public-demotion" | "plugin-sdk-channel-secret-tts-runtime-public-demotion" | "plugin-sdk-channel-targets-public-demotion" | "plugin-sdk-chat-channel-ids-public-demotion" | "plugin-sdk-cli-backend-public-demotion" | "plugin-sdk-cli-runtime-public-demotion" | "plugin-sdk-codex-mcp-projection-public-demotion" | "plugin-sdk-command-status-runtime-public-demotion" | "plugin-sdk-command-surface-public-demotion" | "plugin-sdk-concurrency-runtime-public-demotion" | "plugin-sdk-context-visibility-runtime-public-demotion" | "plugin-sdk-conversation-binding-runtime-public-demotion" | "plugin-sdk-cron-store-runtime-public-demotion" | "plugin-sdk-dangerous-name-runtime-public-demotion" | "plugin-sdk-delivery-queue-runtime-public-demotion" | "plugin-sdk-direct-dm-guard-policy-public-demotion" | "plugin-sdk-directory-config-runtime-public-demotion" | "plugin-sdk-document-extractor-public-demotion" | "plugin-sdk-embedding-providers-public-demotion" | "plugin-sdk-exec-approvals-runtime-public-demotion" | "plugin-sdk-expect-runtime-public-demotion" | "plugin-sdk-fetch-runtime-public-demotion" | "plugin-sdk-file-access-runtime-public-demotion" | "plugin-sdk-file-lock-public-demotion" | "plugin-sdk-global-singleton-public-demotion" | "plugin-sdk-group-activation-public-demotion" | "plugin-sdk-heartbeat-runtime-public-demotion" | "plugin-sdk-host-runtime-public-demotion" | "plugin-sdk-html-entity-runtime-public-demotion" | "plugin-sdk-image-generation-public-demotion" | "plugin-sdk-image-generation-core-public-demotion" | "plugin-sdk-image-generation-runtime-public-demotion" | "plugin-sdk-inline-image-data-url-runtime-public-demotion" | "plugin-sdk-json-schema-runtime-public-demotion" | "plugin-sdk-json-unsafe-integers-public-demotion" | "plugin-sdk-keyed-async-queue-public-demotion" | "plugin-sdk-markdown-table-runtime-public-demotion" | "plugin-sdk-media-generation-runtime-public-demotion" | "plugin-sdk-memory-core-host-embedding-registry-public-demotion" | "plugin-sdk-memory-core-host-engine-embeddings-public-demotion" | "plugin-sdk-memory-core-host-engine-qmd-public-demotion" | "plugin-sdk-memory-core-host-engine-storage-public-demotion" | "plugin-sdk-memory-core-host-runtime-cli-public-demotion" | "plugin-sdk-memory-core-host-runtime-core-public-demotion" | "plugin-sdk-memory-core-host-runtime-files-public-demotion" | "plugin-sdk-memory-core-host-secret-public-demotion" | "plugin-sdk-memory-core-host-status-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-memory-host-events-public-demotion" | "plugin-sdk-memory-host-markdown-public-demotion" | "plugin-sdk-memory-host-search-public-demotion" | "plugin-sdk-message-tool-delivery-hints-public-demotion" | "plugin-sdk-migration-public-demotion" | "plugin-sdk-migration-runtime-public-demotion" | "plugin-sdk-music-generation-public-demotion" | "plugin-sdk-number-runtime-public-demotion" | "plugin-sdk-outbound-media-public-demotion" | "plugin-sdk-pair-loop-guard-runtime-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-plugin-state-runtime-public-demotion" | "plugin-sdk-poll-runtime-public-demotion" | "plugin-sdk-process-runtime-public-demotion" | "plugin-sdk-provider-auth-api-key-public-demotion" | "plugin-sdk-provider-auth-login-flow-runtime-public-demotion" | "plugin-sdk-provider-auth-result-public-demotion" | "plugin-sdk-provider-auth-runtime-public-demotion" | "plugin-sdk-provider-catalog-live-runtime-public-demotion" | "plugin-sdk-provider-catalog-shared-public-demotion" | "plugin-sdk-provider-entry-public-demotion" | "plugin-sdk-provider-env-vars-public-demotion" | "plugin-sdk-provider-http-public-demotion" | "plugin-sdk-provider-model-shared-public-demotion" | "plugin-sdk-provider-model-types-public-demotion" | "plugin-sdk-provider-oauth-runtime-public-demotion" | "plugin-sdk-provider-onboard-public-demotion" | "plugin-sdk-provider-selection-runtime-public-demotion" | "plugin-sdk-provider-setup-public-demotion" | "plugin-sdk-provider-stream-public-demotion" | "plugin-sdk-provider-stream-family-public-demotion" | "plugin-sdk-provider-stream-shared-public-demotion" | "plugin-sdk-provider-tools-public-demotion" | "plugin-sdk-provider-transport-runtime-public-demotion" | "plugin-sdk-provider-usage-public-demotion" | "plugin-sdk-provider-web-fetch-public-demotion" | "plugin-sdk-provider-web-fetch-contract-public-demotion" | "plugin-sdk-provider-web-search-public-demotion" | "plugin-sdk-provider-web-search-config-contract-public-demotion" | "plugin-sdk-provider-web-search-contract-public-demotion" | "plugin-sdk-qa-runner-runtime-public-demotion" | "plugin-sdk-realtime-bootstrap-context-public-demotion" | "plugin-sdk-realtime-transcription-public-demotion" | "plugin-sdk-realtime-voice-public-demotion" | "plugin-sdk-reply-reference-public-demotion" | "plugin-sdk-request-url-public-demotion" | "plugin-sdk-response-limit-runtime-public-demotion" | "plugin-sdk-retry-runtime-public-demotion" | "plugin-sdk-runtime-doctor-public-demotion" | "plugin-sdk-runtime-fetch-public-demotion" | "plugin-sdk-secret-file-runtime-public-demotion" | "plugin-sdk-secure-random-runtime-public-demotion" | "plugin-sdk-session-binding-runtime-public-demotion" | "plugin-sdk-session-catalog-public-demotion" | "plugin-sdk-session-key-runtime-public-demotion" | "plugin-sdk-session-transcript-hit-public-demotion" | "plugin-sdk-session-transcript-runtime-public-demotion" | "plugin-sdk-session-visibility-public-demotion" | "plugin-sdk-simple-completion-runtime-public-demotion" | "plugin-sdk-speech-public-demotion" | "plugin-sdk-speech-core-public-demotion" | "plugin-sdk-sqlite-runtime-public-demotion" | "plugin-sdk-ssrf-dispatcher-public-demotion" | "plugin-sdk-string-normalization-runtime-public-demotion" | "plugin-sdk-system-event-runtime-public-demotion" | "plugin-sdk-talk-config-runtime-public-demotion" | "plugin-sdk-target-resolver-runtime-public-demotion" | "plugin-sdk-text-autolink-runtime-public-demotion" | "plugin-sdk-text-utility-runtime-public-demotion" | "plugin-sdk-thread-bindings-runtime-public-demotion" | "plugin-sdk-thread-bindings-session-runtime-public-demotion" | "plugin-sdk-time-runtime-public-demotion" | "plugin-sdk-tool-payload-public-demotion" | "plugin-sdk-tool-plugin-public-demotion" | "plugin-sdk-tool-results-public-demotion" | "plugin-sdk-transcripts-public-demotion" | "plugin-sdk-transport-ready-runtime-public-demotion" | "plugin-sdk-tts-runtime-public-demotion" | "plugin-sdk-types-public-demotion" | "plugin-sdk-video-generation-public-demotion" | "plugin-sdk-video-generation-core-public-demotion" | "plugin-sdk-video-generation-runtime-public-demotion" | "plugin-sdk-web-content-extractor-public-demotion" | "plugin-sdk-webhook-targets-public-demotion" | "plugin-sdk-windows-spawn-public-demotion";
  status: "removed" | "removal-pending";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  removeAfter: string;
  replacement: string;
  docsPath: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
})[], {
  readonly code: "removed-global-api-provider-publication";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-27";
  readonly replacement: "provider plugins via `api.registerProvider(...)`; host/runtime code registers against its lifecycle-owned `ApiRegistry`";
  readonly docsPath: "/plugins/sdk-migration#process-global-api-provider-publication";
  readonly surfaces: readonly ["openclaw/plugin-sdk/llm registerApiProvider", "openclaw/plugin-sdk/llm unregisterApiProviders"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The process-global API-provider publication facade was removed; provider plugins now publish through their lifecycle-owned registration, and host runtimes register directly on their prepared ApiRegistry.";
}, {
  readonly code: "legacy-before-agent-start";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-24";
  readonly warningStarts: "2026-04-24";
  readonly removeAfter: "2026-07-24";
  readonly replacement: "`before_model_resolve` and `before_prompt_build` hooks";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["plugin hooks", "plugins inspect", "status diagnostics"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Legacy `before_agent_start` hook compatibility was removed; plugins must use `before_model_resolve` and `before_prompt_build`.";
}, {
  readonly code: "legacy-deactivate-hook-alias";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-16";
  readonly deprecated: "2026-05-16";
  readonly warningStarts: "2026-05-16";
  readonly removeAfter: "2026-08-16";
  readonly replacement: "`gateway_stop` hook";
  readonly docsPath: "/plugins/hooks#upcoming-deprecations";
  readonly surfaces: readonly ["api.on(\"deactivate\", ...)", "plugin typed hook registration"];
  readonly diagnostics: readonly ["plugin runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/loader.test.ts"];
  readonly releaseNote: "`api.on(\"deactivate\", ...)` remains wired as a deprecated compatibility alias while plugins migrate to `gateway_stop`.";
}, {
  readonly code: "legacy-subagent-spawning-hook";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-30";
  readonly deprecated: "2026-05-30";
  readonly warningStarts: "2026-05-30";
  readonly removeAfter: "2026-08-30";
  readonly replacement: "`subagent_spawned` for post-launch observation; core session-binding adapters for thread routing";
  readonly docsPath: "/plugins/hooks#upcoming-deprecations";
  readonly surfaces: readonly ["api.on(\"subagent_spawning\", ...)", "PluginHookSubagentSpawningEvent", "PluginHookSubagentSpawningResult", "SubagentLifecycleHookRunner.runSubagentSpawning"];
  readonly diagnostics: readonly ["plugin runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/loader.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "`api.on(\"subagent_spawning\", ...)` remains wired only for older plugins; core now owns thread-bound subagent routing.";
}, {
  readonly code: "hook-only-plugin-shape";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly replacement: "explicit capability registration";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["plugin shape inspection", "plugins inspect", "status diagnostics"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/contracts/shape.contract.test.ts"];
}, {
  readonly code: "deprecated-memory-embedding-provider-api";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly deprecated: "2026-05-21";
  readonly warningStarts: "2026-05-21";
  readonly removeAfter: "2026-08-21";
  readonly replacement: "`api.registerEmbeddingProvider(...)` and `contracts.embeddingProviders`";
  readonly docsPath: "/plugins/sdk-migration#memory-embedding-provider-api";
  readonly surfaces: readonly ["api.registerMemoryEmbeddingProvider(...)", "contracts.memoryEmbeddingProviders", "openclaw/plugin-sdk/memory-core-host-engine-embeddings registerMemoryEmbeddingProvider", "plugins inspect compatibility notices"];
  readonly diagnostics: readonly ["plugin compatibility notice", "plugin SDK package guardrail"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-package-contract-guardrails.test.ts"];
  readonly releaseNote: "Memory-specific embedding provider registration remains wired as a deprecated compatibility path while providers migrate to the generic embedding provider contract.";
}, {
  readonly code: "deprecated-session-store-beta5-api";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly deprecated: "2026-07-12";
  readonly warningStarts: "2026-07-12";
  readonly removeAfter: "2026-10-12";
  readonly replacement: "`getSessionEntry(...)`, `listSessionEntries(...)`, and row-level session mutations";
  readonly docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime loadSessionStore", "openclaw/plugin-sdk/session-store-runtime updateSessionStore", "openclaw/plugin-sdk/session-store-runtime resolveSessionFilePath", "openclaw/plugin-sdk/session-store-runtime resolveSessionStoreEntry"];
  readonly diagnostics: readonly ["plugin SDK deprecation"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The beta.5 session-store import set remains available for official plugins released with v2026.7.1-beta.5 while they migrate to row-level session access.";
}, {
  readonly code: "removed-session-transcript-file-api";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-07-01";
  readonly replacement: "session identity (`sessionKey`/`sessionId`), `SessionTranscriptUpdate.target`, and Gateway/runtime session helpers";
  readonly docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["saveSessionStore", "resolveSessionTranscriptPathInDir", "resolveAndPersistSessionFile", "readLatestAssistantTextFromSessionTranscript", "SessionTranscriptUpdate.sessionFile", "sessionFiles", "transcriptPath", "sessionFile", "plugins inspect compatibility notices"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Session/transcript file APIs were removed with the SQLite session storage flip; plugins now use session identity and Gateway/runtime session helpers.";
}, {
  readonly code: "legacy-root-sdk-import";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-24";
  readonly warningStarts: "2026-04-24";
  readonly removeAfter: "2026-07-24";
  readonly replacement: "focused `openclaw/plugin-sdk/<subpath>` imports";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk", "openclaw/plugin-sdk/compat"];
  readonly diagnostics: readonly ["OPENCLAW_PLUGIN_SDK_COMPAT_DEPRECATED"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by legacy-root-sdk-import were removed in the July 2026 sweep.";
}, {
  readonly code: "hook.before_tool_call.terminal-block-approval";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["before_tool_call block result", "before_tool_call approval result"];
  readonly diagnostics: readonly ["hook runner contract probe"];
  readonly tests: readonly ["src/plugins/hooks.security.test.ts", "src/agents/agent-tools.before-tool-call.e2e.test.ts"];
}, {
  readonly code: "hook.llm-observer.privacy-payload";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["llm_input", "llm_output", "agent_end", "allowConversationAccess"];
  readonly diagnostics: readonly ["conversation access hook contract probe"];
  readonly tests: readonly ["src/agents/cli-runner.reliability.test.ts", "src/config/schema.help.quality.test.ts"];
}, {
  readonly code: "api.capture.runtime-registrars";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/architecture-internals";
  readonly surfaces: readonly ["createCapturedPluginRegistration", "capturePluginRegistration", "OpenClawPluginApi"];
  readonly diagnostics: readonly ["runtime registration capture contract probe"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "channel.runtime.envelope-config-metadata";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/sdk-channel-plugins";
  readonly surfaces: readonly ["api.registerChannel", "channel setup metadata", "channel message envelope"];
  readonly diagnostics: readonly ["channel runtime contract probe"];
  readonly tests: readonly ["src/plugin-sdk/channel-entry-contract.test.ts", "src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "whatsapp-web-inbound-flat-message-aliases";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-05-30";
  readonly deprecated: "2026-05-30";
  readonly warningStarts: "2026-05-30";
  readonly removeAfter: "2026-08-30";
  readonly replacement: "WhatsApp `WebInboundCallbackMessage` nested contexts: `event`, `payload`, `quote`, `group`, and `platform`";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["@openclaw/whatsapp WebInboundMessage flat fields", "WhatsApp monitorWebInbox onMessage callback", "WhatsApp monitorWebChannel listenerFactory injected messages"];
  readonly diagnostics: readonly ["TypeScript deprecated WebInboundMessage flat field annotations"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "WhatsApp WebInboundMessage flat fields remain wired as deprecated aliases while callbacks migrate to nested inbound contexts.";
}, {
  readonly code: "whatsapp-web-inbound-admission-top-level-fields";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-06-14";
  readonly deprecated: "2026-06-14";
  readonly warningStarts: "2026-06-14";
  readonly removeAfter: "2026-08-30";
  readonly replacement: "WhatsApp `WebInboundMessage.admission` fields: `conversation.id`, `accountId`, `ingress.decision`, and `conversation.kind`";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["@openclaw/whatsapp WebInboundMessage top-level admission fields", "WhatsApp monitorWebInbox onMessage callback", "WhatsApp monitorWebChannel listenerFactory injected messages"];
  readonly diagnostics: readonly ["TypeScript deprecated WebInboundMessage admission field annotations"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "WhatsApp WebInboundMessage top-level admission fields remain available while callbacks migrate to the admission envelope.";
}, {
  readonly code: "bundled-channel-sdk-compat-facades";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly replacement: "generic channel SDK subpaths or plugin-local `api.ts` / `runtime-api.ts` barrels for new plugins";
  readonly docsPath: "/plugins/sdk-overview";
  readonly surfaces: readonly ["openclaw/plugin-sdk/discord component message helpers", "openclaw/plugin-sdk/telegram-account resolveTelegramAccount"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry"];
  readonly tests: readonly ["src/plugin-sdk/discord.test.ts", "src/plugin-sdk/telegram-account.test.ts", "src/plugins/contracts/plugin-sdk-package-contract-guardrails.test.ts"];
}, {
  readonly code: "bundled-channel-config-schema-legacy";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-04-28";
  readonly warningStarts: "2026-04-28";
  readonly removeAfter: "2026-07-28";
  readonly replacement: "`openclaw/plugin-sdk/bundled-channel-config-schema` for maintained bundled plugins; plugin-local schemas for third-party plugins";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/channel-config-schema-legacy"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by bundled-channel-config-schema-legacy were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-sdk-testing-barrel";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-04-28";
  readonly warningStarts: "2026-04-28";
  readonly removeAfter: "2026-07-28";
  readonly replacement: "focused `openclaw/plugin-sdk/*` test subpaths such as `plugin-test-runtime`, `channel-test-helpers`, `test-env`, and `test-fixtures`";
  readonly docsPath: "/plugins/sdk-migration#private-testing-barrel";
  readonly surfaces: readonly ["openclaw/plugin-sdk/testing"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The testing subpath was private-local-only and pack-excluded in shipped stables v2026.6.5 and v2026.7.1, so it was safely removed before its removeAfter date.";
}, {
  readonly code: "channel-route-key-aliases";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-04-28";
  readonly warningStarts: "2026-04-28";
  readonly removeAfter: "2026-07-28";
  readonly replacement: "`channelRouteDedupeKey` and `channelRouteCompactKey`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/channel-route channelRouteIdentityKey", "openclaw/plugin-sdk/channel-route channelRouteKey"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by channel-route-key-aliases were removed in the July 2026 sweep.";
}, {
  readonly code: "channel-explicit-target-parser";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-05-23";
  readonly warningStarts: "2026-05-23";
  readonly removeAfter: "2026-08-23";
  readonly replacement: "`messaging.targetResolver` for target normalization and `messaging.resolveOutboundSessionRoute` for session/thread identity";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["ChannelMessagingAdapter.parseExplicitTarget", "openclaw/plugin-sdk/channel-route ChannelRouteExplicitTarget", "openclaw/plugin-sdk/channel-route ChannelRouteExplicitTargetParser", "openclaw/plugin-sdk/channel-route resolveChannelRouteTargetWithParser"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/channels/plugins/contracts/test-helpers/surface-contract-suite.ts", "src/plugins/compat/registry.test.ts"];
}, {
  readonly code: "channel-messaging-targets-subpath";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-05-23";
  readonly warningStarts: "2026-05-23";
  readonly removeAfter: "2026-08-23";
  readonly replacement: "`openclaw/plugin-sdk/channel-targets`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/messaging-targets"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
}, {
  readonly code: "bundled-plugin-allowlist";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest-owned plugin enablement and scoped load plans";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["plugins.allow", "bundled provider startup", "plugins status"];
  readonly diagnostics: readonly ["plugin status report"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"];
}, {
  readonly code: "bundled-plugin-enablement";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest-owned plugin defaults and scoped load plans";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["plugins.entries", "bundled provider startup", "plugins status"];
  readonly diagnostics: readonly ["plugin status report"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"];
}, {
  readonly code: "bundled-plugin-vitest-defaults";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "explicit test plugin config fixtures";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["Vitest plugin defaults", "bundled provider tests"];
  readonly diagnostics: readonly ["test-only compatibility path"];
  readonly tests: readonly ["src/plugins/config-state.test.ts"];
}, {
  readonly code: "provider-auth-env-vars";
  readonly status: "removed";
  readonly owner: "setup";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-24";
  readonly warningStarts: "2026-04-24";
  readonly removeAfter: "2026-07-24";
  readonly replacement: "`setup.providers[].envVars` and `providerAuthChoices`";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["openclaw.plugin.json providerAuthEnvVars", "provider setup"];
  readonly diagnostics: readonly ["manifest compatibility diagnostic"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-auth-env-vars were removed in the July 2026 sweep.";
}, {
  readonly code: "channel-env-vars";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-24";
  readonly warningStarts: "2026-04-24";
  readonly removeAfter: "2026-07-24";
  readonly replacement: "`channelConfigs.<id>.schema` and setup descriptors";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["openclaw.plugin.json channelEnvVars", "channel setup"];
  readonly diagnostics: readonly ["manifest compatibility diagnostic"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by channel-env-vars were removed in the July 2026 sweep.";
}, {
  readonly code: "activation-agent-harness-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "top-level `cliBackends[]` for CLI aliases and future `agentRuntime` ownership metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onAgentHarnesses", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-provider-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "`providers[]` manifest ownership";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onProviders", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-channel-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "`channels[]` manifest ownership";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onChannels", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-command-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "`commandAliases` or command contribution metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onCommands", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-route-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "HTTP route contribution metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onRoutes", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-config-path-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-27";
  readonly replacement: "manifest contribution ownership for root config surfaces";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onConfigPaths", "startup plugin selection"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/channel-plugin-ids.test.ts"];
}, {
  readonly code: "activation-capability-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest contribution ownership";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onCapabilities", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "embedded-harness-config-alias";
  readonly status: "removed";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly removeAfter: "2026-07-25";
  readonly replacement: "`agentRuntime` config naming";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["agents.defaults.embeddedHarness", "model/provider runtime selection"];
  readonly diagnostics: readonly ["agent runtime config compatibility"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by embedded-harness-config-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "agent-harness-sdk-alias";
  readonly status: "removal-pending";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly removeAfter: "2026-07-25";
  readonly replacement: "`openclaw/plugin-sdk/agent-runtime`; retain the public aliases until the shipped SDK contract has a replacement window backed by external-usage proof";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness", "openclaw/plugin-sdk/agent-harness-runtime"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
}, {
  readonly code: "embedded-pi-agent-sdk-aliases";
  readonly status: "deprecated";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-05-21";
  readonly deprecated: "2026-05-21";
  readonly warningStarts: "2026-05-21";
  readonly removeAfter: "2026-08-21";
  readonly replacement: "`runEmbeddedAgent` and `EmbeddedAgent*` SDK/runtime names";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.agent.runEmbeddedPiAgent", "openclaw/extension-api runEmbeddedPiAgent", "openclaw/plugin-sdk/agent-harness-runtime EmbeddedPi* aliases"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry"];
  readonly tests: readonly ["src/plugins/runtime/index.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "Legacy `runEmbeddedPiAgent` and `EmbeddedPi*` plugin aliases remain as deprecated SDK compatibility only.";
}, {
  readonly code: "agent-harness-id-alias";
  readonly status: "removed";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly removeAfter: "2026-07-25";
  readonly replacement: "`agentRuntime` ids and policy metadata";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["manifest/catalog execution policy", "runtime selection"];
  readonly diagnostics: readonly ["agent runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by agent-harness-id-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "generated-bundled-channel-config-fallback";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest registry `channelConfigs` metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["generated bundled channel config metadata", "channel config validation"];
  readonly diagnostics: readonly ["channel config metadata fallback"];
  readonly tests: readonly ["src/plugins/contracts/config-footprint-guardrails.test.ts"];
}, {
  readonly code: "disable-persisted-plugin-registry-env";
  readonly status: "removed";
  readonly owner: "config";
  readonly introduced: "2026-04-25";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly removeAfter: "2026-07-25";
  readonly replacement: "`openclaw plugins registry --refresh` and `openclaw doctor --fix`";
  readonly docsPath: "/cli/plugins#registry";
  readonly surfaces: readonly ["OPENCLAW_DISABLE_PERSISTED_PLUGIN_REGISTRY", "plugin registry reads"];
  readonly diagnostics: readonly ["persisted-registry-disabled"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by disable-persisted-plugin-registry-env were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-registry-install-migration-env";
  readonly status: "removed";
  readonly owner: "config";
  readonly introduced: "2026-04-25";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly removeAfter: "2026-07-25";
  readonly replacement: "`openclaw plugins registry --refresh` and `openclaw doctor --fix`";
  readonly docsPath: "/cli/plugins#registry";
  readonly surfaces: readonly ["OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION", "OPENCLAW_FORCE_PLUGIN_REGISTRY_MIGRATION", "package postinstall plugin registry migration"];
  readonly diagnostics: readonly ["postinstall migration skip", "postinstall migration force deprecation warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-registry-install-migration-env were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-install-config-ledger";
  readonly status: "removed";
  readonly owner: "config";
  readonly introduced: "2026-04-25";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "shared SQLite `installed_plugin_index` install ledger";
  readonly docsPath: "/cli/plugins#registry";
  readonly surfaces: readonly ["plugins.installs authored config", "plugin install/update migration"];
  readonly diagnostics: readonly ["config write migration warning", "doctor registry migration"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-install-config-ledger were removed in the July 2026 sweep.";
}, {
  readonly code: "bundled-plugin-load-path-aliases";
  readonly status: "removed";
  readonly owner: "config";
  readonly introduced: "2026-04-25";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "packaged bundled plugins resolved through the persisted plugin registry";
  readonly docsPath: "/cli/plugins#registry";
  readonly surfaces: readonly ["plugins.load.paths entries pointing at bundled plugin source/dist paths"];
  readonly diagnostics: readonly ["doctor bundled plugin load-path warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by bundled-plugin-load-path-aliases were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-owned-web-search-config";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-26";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`plugins.entries.<plugin>.config.webSearch`";
  readonly docsPath: "/tools/web";
  readonly surfaces: readonly ["tools.web.search.apiKey", "tools.web.search.<provider>"];
  readonly diagnostics: readonly ["doctor legacy web-search config migration"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-owned-web-search-config were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-owned-web-fetch-config";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-26";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`plugins.entries.firecrawl.config.webFetch`";
  readonly docsPath: "/tools/web-fetch";
  readonly surfaces: readonly ["tools.web.fetch.firecrawl"];
  readonly diagnostics: readonly ["doctor legacy web-fetch config migration"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-owned-web-fetch-config were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-owned-x-search-config";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-26";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`plugins.entries.xai.config.webSearch.apiKey`";
  readonly docsPath: "/tools/grok-search";
  readonly surfaces: readonly ["tools.web.x_search.apiKey"];
  readonly diagnostics: readonly ["doctor legacy x_search config migration"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-owned-x-search-config were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-activate-entrypoint-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`register(api)` plugin entrypoint";
  readonly docsPath: "/plugins/sdk-entrypoints";
  readonly surfaces: readonly ["plugin module `activate(api)`", "plugin loader registration"];
  readonly diagnostics: readonly ["loader compatibility path"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-activate-entrypoint-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "setup-runtime-fallback";
  readonly status: "active";
  readonly owner: "setup";
  readonly introduced: "2026-04-24";
  readonly replacement: "`setup.requiresRuntime: false` with complete setup descriptors";
  readonly docsPath: "/plugins/manifest#setup-reference";
  readonly surfaces: readonly ["setup-api runtime fallback", "setup.requiresRuntime omitted"];
  readonly diagnostics: readonly ["setup registry runtime diagnostic"];
  readonly tests: readonly ["src/plugins/setup-registry.test.ts", "src/plugins/setup-registry.runtime.test.ts"];
}, {
  readonly code: "provider-discovery-hook-alias";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`catalog.run(...)` provider catalog hook";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["provider plugin `discovery` hook", "provider catalog resolution"];
  readonly diagnostics: readonly ["provider validation warning when catalog and discovery both register"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-discovery-hook-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "channel-exposure-legacy-aliases";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`openclaw.channel.exposure` metadata";
  readonly docsPath: "/plugins/sdk-setup";
  readonly surfaces: readonly ["openclaw.channel.showConfigured", "openclaw.channel.showInSetup"];
  readonly diagnostics: readonly ["channel exposure compatibility path"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by channel-exposure-legacy-aliases were removed in the July 2026 sweep.";
}, {
  readonly code: "channel-runtime-sdk-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "focused channel SDK subpaths, especially `openclaw/plugin-sdk/channel-runtime-context`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly [string];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by channel-runtime-sdk-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "command-auth-status-builders";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`openclaw/plugin-sdk/command-status`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/command-auth buildCommandsMessage", "openclaw/plugin-sdk/command-auth buildCommandsMessagePaginated", "openclaw/plugin-sdk/command-auth buildHelpMessage"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by command-auth-status-builders were removed in the July 2026 sweep.";
}, {
  readonly code: "clawdbot-config-type-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`OpenClawConfig`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk `ClawdbotConfig` type export"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by clawdbot-config-type-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "openclaw-schema-type-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-26";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`OpenClawConfig` from `openclaw/plugin-sdk/config-schema`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk `OpenClawSchemaType` type export"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by openclaw-schema-type-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "legacy-extension-api-import";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "injected `api.runtime.*` helpers or focused `openclaw/plugin-sdk/<subpath>` imports";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/extension-api"];
  readonly diagnostics: readonly ["OPENCLAW_EXTENSION_API_DEPRECATED"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by legacy-extension-api-import were removed in the July 2026 sweep.";
}, {
  readonly code: "memory-split-registration";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`api.registerMemoryCapability({ promptBuilder, flushPlanResolver, runtime })`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["api.registerMemoryPromptSection", "api.registerMemoryFlushPlan", "api.registerMemoryRuntime", "src/plugins/memory-state split registration helpers"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by memory-split-registration were removed in the July 2026 sweep.";
}, {
  readonly code: "provider-static-capabilities-bag";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "explicit provider hooks such as `buildReplayPolicy`, `normalizeToolSchemas`, and `wrapStreamFn`";
  readonly docsPath: "/plugins/sdk-provider-plugins";
  readonly surfaces: readonly ["ProviderPlugin.capabilities", "ProviderCapabilities"];
  readonly diagnostics: readonly ["provider validation warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-static-capabilities-bag were removed in the July 2026 sweep.";
}, {
  readonly code: "provider-discovery-type-aliases";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`ProviderCatalogOrder`, `ProviderCatalogContext`, `ProviderCatalogResult`, and `ProviderPluginCatalog`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["ProviderDiscoveryOrder", "ProviderDiscoveryContext", "ProviderDiscoveryResult", "ProviderPluginDiscovery"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-discovery-type-aliases were removed in the July 2026 sweep.";
}, {
  readonly code: "provider-thinking-policy-hooks";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`resolveThinkingProfile`";
  readonly docsPath: "/plugins/sdk-provider-plugins";
  readonly surfaces: readonly ["ProviderPlugin.isBinaryThinking", "ProviderPlugin.supportsXHighThinking", "ProviderPlugin.resolveDefaultThinkingLevel"];
  readonly diagnostics: readonly ["provider runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-thinking-policy-hooks were removed in the July 2026 sweep.";
}, {
  readonly code: "provider-external-oauth-profiles-hook";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`contracts.externalAuthProviders` plus `resolveExternalAuthProfiles`";
  readonly docsPath: "/plugins/sdk-provider-plugins";
  readonly surfaces: readonly ["ProviderPlugin.resolveExternalOAuthProfiles"];
  readonly diagnostics: readonly ["provider external auth fallback warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-external-oauth-profiles-hook were removed in the July 2026 sweep.";
}, {
  readonly code: "agent-tool-result-harness-alias";
  readonly status: "removed";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`runtime` and `runtimes` agent tool-result middleware fields";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["AgentToolResultMiddlewareHarness", "AgentToolResultMiddlewareContext.harness", "AgentToolResultMiddlewareOptions.harnesses", "normalizeAgentToolResultMiddlewareHarnesses"];
  readonly diagnostics: readonly ["agent runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by agent-tool-result-harness-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "runtime-config-load-write";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-27";
  readonly deprecated: "2026-04-27";
  readonly warningStarts: "2026-04-27";
  readonly removeAfter: "2026-07-27";
  readonly replacement: "`api.runtime.config.current()`, passed config values, `mutateConfigFile(...)`, or `replaceConfigFile(...)`";
  readonly docsPath: "/plugins/sdk-runtime#config-loading-and-writes";
  readonly surfaces: readonly ["api.runtime.config.loadConfig", "api.runtime.config.writeConfigFile"];
  readonly diagnostics: readonly ["plugin runtime compatibility warning", "deprecated API usage guard", "runtime channel config boundary guard"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by runtime-config-load-write were removed in the July 2026 sweep.";
}, {
  readonly code: "runtime-taskflow-legacy-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`api.runtime.tasks.managedFlows` for managed mutations or `api.runtime.tasks.flows` for DTO reads";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.taskFlow", "api.runtime.tasks.flow"];
  readonly diagnostics: readonly ["plugin runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by runtime-taskflow-legacy-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "runtime-subagent-get-session-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`api.runtime.subagent.getSessionMessages`";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.subagent.getSession"];
  readonly diagnostics: readonly ["plugin runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by runtime-subagent-get-session-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "runtime-stt-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`api.runtime.mediaUnderstanding.transcribeAudioFile`";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.stt.transcribeAudioFile"];
  readonly diagnostics: readonly ["plugin runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by runtime-stt-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "runtime-inbound-envelope-alias";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`BodyForAgent` plus structured user-context blocks";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.channel.reply.formatInboundEnvelope"];
  readonly diagnostics: readonly ["channel runtime compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by runtime-inbound-envelope-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "channel-native-message-schema-helpers";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "semantic `presentation` capabilities";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/channel-actions createMessageToolButtonsSchema", "openclaw/plugin-sdk/channel-actions createMessageToolCardSchema"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by channel-native-message-schema-helpers were removed in the July 2026 sweep.";
}, {
  readonly code: "channel-mention-gating-legacy-helpers";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "`resolveInboundMentionDecision({ facts, policy })`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/channel-inbound resolveMentionGating", "openclaw/plugin-sdk/channel-inbound resolveMentionGatingWithBypass", "openclaw/plugin-sdk/channel-mention-gating resolveMentionGating", "openclaw/plugin-sdk/channel-mention-gating resolveMentionGatingWithBypass"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by channel-mention-gating-legacy-helpers were removed in the July 2026 sweep.";
}, {
  readonly code: "provider-web-search-core-wrapper";
  readonly status: "removed";
  readonly owner: "provider";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "provider-owned `createTool(...)` on the returned `WebSearchProviderPlugin`";
  readonly docsPath: "/plugins/sdk-provider-plugins";
  readonly surfaces: readonly ["openclaw/plugin-sdk/provider-web-search createPluginBackedWebSearchProvider"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by provider-web-search-core-wrapper were removed in the July 2026 sweep.";
}, {
  readonly code: "approval-capability-approvals-alias";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "top-level `delivery`, `nativeRuntime`, `render`, and `native` approval capability fields";
  readonly docsPath: "/plugins/sdk-channel-plugins";
  readonly surfaces: readonly ["createChannelApprovalCapability({ approvals })"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by approval-capability-approvals-alias were removed in the July 2026 sweep.";
}, {
  readonly code: "plugin-sdk-test-utils-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-26";
  readonly warningStarts: "2026-04-26";
  readonly removeAfter: "2026-07-26";
  readonly replacement: "focused `openclaw/plugin-sdk/*` test subpaths";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/test-utils"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated compatibility surfaces tracked by plugin-sdk-test-utils-alias were removed in the July 2026 sweep.";
}];
type PluginCompatCode = (typeof PLUGIN_COMPAT_RECORDS)[number]["code"];
//#endregion
//#region src/infra/npm-registry-spec.d.ts
/**
 * Parsed registry-only npm spec accepted by plugin install flows.
 * Selectors are limited to exact versions and dist-tags; URL/git/file specs
 * are rejected before they can execute on the gateway host.
 */
type ParsedRegistryNpmSpec = {
  name: string;
  raw: string;
  selector?: string;
  selectorKind: "none" | "exact-version" | "tag";
  selectorIsPrerelease: boolean;
};
//#endregion
//#region src/plugins/install-source-info.d.ts
/** Warning emitted while describing plugin package install source metadata. */
type PluginInstallSourceWarning = "invalid-clawhub-spec" | "invalid-npm-spec" | "invalid-default-choice" | "default-choice-missing-source" | "clawhub-spec-floating" | "npm-integrity-without-source" | "npm-spec-floating" | "npm-spec-missing-integrity" | "npm-spec-package-name-mismatch";
/** Pinning state for npm plugin install metadata. */
type PluginInstallNpmPinState = "exact-with-integrity" | "exact-without-integrity" | "floating-with-integrity" | "floating-without-integrity";
/** Parsed npm install source metadata for a plugin package. */
type PluginInstallNpmSourceInfo = {
  spec: string;
  packageName: string;
  expectedPackageName?: string;
  selector?: string;
  selectorKind: ParsedRegistryNpmSpec["selectorKind"];
  exactVersion: boolean;
  expectedIntegrity?: string;
  pinState: PluginInstallNpmPinState;
};
/** Parsed local install source metadata for a plugin package. */
type PluginInstallLocalSourceInfo = {
  path: string;
};
/** Parsed ClawHub install source metadata for a plugin package. */
type PluginInstallClawHubSourceInfo = {
  spec: string;
  packageName: string;
  version?: string;
  exactVersion: boolean;
};
/** Parsed plugin install sources plus validation warnings. */
type PluginInstallSourceInfo = {
  defaultChoice?: PluginPackageInstall["defaultChoice"];
  clawhub?: PluginInstallClawHubSourceInfo;
  npm?: PluginInstallNpmSourceInfo;
  local?: PluginInstallLocalSourceInfo;
  warnings: readonly PluginInstallSourceWarning[];
};
//#endregion
//#region src/plugins/installed-plugin-index-hash.d.ts
/** File metadata signature used to skip unchanged installed plugin files. */
type InstalledPluginFileSignature = {
  size: number;
  mtimeMs: number;
  ctimeMs?: number;
};
//#endregion
//#region src/plugins/installed-plugin-index-types.d.ts
/** Schema version for installed plugin index files. */
declare const INSTALLED_PLUGIN_INDEX_VERSION = 1;
declare const INSTALLED_PLUGIN_INDEX_MIGRATION_VERSION = 1;
type InstalledPluginIndexRefreshReason = "missing" | "stale-manifest" | "stale-package" | "source-changed" | "policy-changed" | "migration" | "host-contract-changed" | "compat-registry-changed" | "manual";
type InstalledPluginStartupInfo = {
  sidecar: boolean;
  memory: boolean;
  deferConfiguredChannelFullLoadUntilAfterListen: boolean;
  agentHarnesses: readonly string[];
  /**
   * Manifest activation.onConfigPaths copied into the installed index for
   * pre-manifest startup scoping. Missing on older persisted index files.
   */
  configPaths?: readonly string[];
};
type InstalledPluginContributionInfo = {
  channels: readonly string[];
  channelConfigs: readonly string[];
  providers: readonly string[];
  modelCatalogProviders: readonly string[];
  modelSupportPrefixes: readonly string[];
  modelSupportPatterns: readonly string[];
  autoEnableProviderIds: readonly string[];
  commandAliases: readonly string[];
  contracts: Readonly<Record<string, readonly string[]>>;
};
type InstalledPluginInstallRecordInfo = Pick<PluginInstallRecord, "source" | "spec" | "sourcePath" | "installPath" | "version" | "resolvedName" | "resolvedVersion" | "resolvedSpec" | "integrity" | "shasum" | "resolvedAt" | "installedAt" | "clawhubUrl" | "clawhubPackage" | "clawhubFamily" | "clawhubChannel" | "clawhubTrustDisposition" | "clawhubTrustScanStatus" | "clawhubTrustModerationState" | "clawhubTrustReasons" | "clawhubTrustPending" | "clawhubTrustStale" | "clawhubTrustCheckedAt" | "clawhubTrustAcknowledgedAt" | "artifactKind" | "artifactFormat" | "npmIntegrity" | "npmShasum" | "npmTarballName" | "clawpackSha256" | "clawpackSpecVersion" | "clawpackManifestSha256" | "clawpackSize" | "gitUrl" | "gitRef" | "gitCommit" | "marketplaceName" | "marketplaceSource" | "marketplacePlugin">;
type InstalledPluginPackageChannelInfo = PluginPackageChannel;
/** One manifest-backed plugin entry in the generated installed plugin index. */
type InstalledPluginIndexRecord = {
  pluginId: string;
  packageName?: string;
  packageVersion?: string;
  /**
   * Legacy embedded install record accepted when reading earlier index files.
   * New index writes keep install records in InstalledPluginIndex.installRecords.
   */
  installRecord?: InstalledPluginInstallRecordInfo; /** Hash of the top-level installRecords entry; used to detect source-changed invalidation. */
  installRecordHash?: string;
  /**
   * Package-authored openclaw.install metadata. This describes catalog/package
   * install intent and must not be treated as the durable install record.
   */
  packageInstall?: PluginInstallSourceInfo;
  packageChannel?: InstalledPluginPackageChannelInfo;
  packageBuild?: OpenClawPackageBuild;
  manifestPath: string;
  manifestHash: string;
  manifestFile?: InstalledPluginFileSignature;
  format?: PluginManifestRecord["format"];
  bundleFormat?: PluginManifestRecord["bundleFormat"];
  source?: string;
  setupSource?: string;
  packageJson?: {
    path: string;
    hash: string;
    fileSignature?: InstalledPluginFileSignature;
  };
  rootDir: string;
  origin: PluginManifestRecord["origin"];
  enabled: boolean;
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: readonly string[];
  syntheticAuthRefs?: readonly string[];
  startup: InstalledPluginStartupInfo;
  contributions?: InstalledPluginContributionInfo;
  compat: readonly PluginCompatCode[];
};
/** Full installed-index payload used by control-plane plugin registry loading. */
type InstalledPluginIndex = {
  version: typeof INSTALLED_PLUGIN_INDEX_VERSION;
  warning?: string;
  hostContractVersion: string;
  compatRegistryVersion: string;
  migrationVersion: typeof INSTALLED_PLUGIN_INDEX_MIGRATION_VERSION;
  policyHash: string;
  generatedAtMs: number;
  refreshReason?: InstalledPluginIndexRefreshReason;
  installRecords: Readonly<Record<string, InstalledPluginInstallRecordInfo>>;
  plugins: readonly InstalledPluginIndexRecord[];
  diagnostics: readonly PluginDiagnostic[];
};
type LoadInstalledPluginIndexParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  pluginIndexFilePath?: string;
  installRecords?: Record<string, PluginInstallRecord>;
  candidates?: PluginCandidate[];
  diagnostics?: PluginDiagnostic[];
  discovery?: PluginDiscoveryResult;
  now?: () => Date;
};
//#endregion
export { PluginCompatCode as a, PluginInstallSourceInfo as i, InstalledPluginIndexRefreshReason as n, LoadInstalledPluginIndexParams as r, InstalledPluginIndex as t };