// packages/gateway-protocol/src/schema/openclaw.ts
import { Type as Type4 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/primitives.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/client-info.ts
var GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  BROWSER_COPILOT: "openclaw-browser-copilot",
  TUI: "openclaw-tui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  // Native Linux UI uses the same trusted-client admission class as the macOS app.
  LINUX_APP: "openclaw-linux",
  IOS_APP: "openclaw-ios",
  WATCHOS_APP: "openclaw-watchos",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  WORKER: "openclaw-worker",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe"
};
var GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  WORKER: "worker",
  PROBE: "probe",
  TEST: "test"
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));

// packages/gateway-protocol/src/secret-ref-contract.ts
var SINGLE_VALUE_FILE_REF_ID = "value";
var SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
var FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
var FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
var EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";

// packages/gateway-protocol/src/schema/primitives.ts
var ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
var INPUT_PROVENANCE_KIND_VALUES = ["external_user", "inter_session", "internal_system"];
var SESSION_LABEL_MAX_LENGTH = 512;
var NonEmptyString = Type2.String({ minLength: 1 });
var CHAT_SEND_SESSION_KEY_MAX_LENGTH = 512;
var ChatSendSessionKeyString = Type2.String({
  minLength: 1,
  maxLength: CHAT_SEND_SESSION_KEY_MAX_LENGTH
});
var SessionLabelString = Type2.String({
  minLength: 1,
  maxLength: SESSION_LABEL_MAX_LENGTH
});
var InputProvenanceSchema = closedObject({
  kind: Type2.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
  originSessionId: Type2.Optional(Type2.String()),
  sourceSessionKey: Type2.Optional(Type2.String()),
  sourceChannel: Type2.Optional(Type2.String()),
  sourceTool: Type2.Optional(Type2.String())
});
var GatewayClientIdSchema = Type2.Enum(GATEWAY_CLIENT_IDS);
var GatewayClientModeSchema = Type2.Enum(GATEWAY_CLIENT_MODES);
var SecretProviderAliasString = Type2.String({
  pattern: SECRET_PROVIDER_ALIAS_PATTERN.source
});
var EnvSecretRefSchema = closedObject({
  source: Type2.Literal("env"),
  provider: SecretProviderAliasString,
  id: Type2.String({ pattern: ENV_SECRET_REF_ID_RE.source })
});
var FileSecretRefIdSchema = Type2.Unsafe({
  type: "string",
  anyOf: [
    { const: SINGLE_VALUE_FILE_REF_ID },
    {
      allOf: [
        { pattern: FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN },
        { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } }
      ]
    }
  ]
});
var FileSecretRefSchema = closedObject({
  source: Type2.Literal("file"),
  provider: SecretProviderAliasString,
  id: FileSecretRefIdSchema
});
var ExecSecretRefSchema = closedObject({
  source: Type2.Literal("exec"),
  provider: SecretProviderAliasString,
  id: Type2.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN })
});
var SecretRefSchema = Type2.Union([
  EnvSecretRefSchema,
  FileSecretRefSchema,
  ExecSecretRefSchema
]);
var SecretInputSchema = Type2.Union([Type2.String(), SecretRefSchema]);

// packages/gateway-protocol/src/schema/wizard.ts
import { Type as Type3 } from "typebox";
var WizardRunStatusSchema = Type3.Union([
  Type3.Literal("running"),
  Type3.Literal("done"),
  Type3.Literal("cancelled"),
  Type3.Literal("error")
]);
var WizardStartParamsSchema = closedObject({
  mode: Type3.Optional(Type3.Union([Type3.Literal("local"), Type3.Literal("remote")])),
  workspace: Type3.Optional(Type3.String()),
  // "setup" (default) runs full onboarding; "channels" runs the guided
  // channel-setup flow (openclaw channels add) over the same step protocol.
  flow: Type3.Optional(Type3.Union([Type3.Literal("setup"), Type3.Literal("channels")])),
  // Preselected channel id for flow "channels" (e.g. "telegram").
  channel: Type3.Optional(NonEmptyString)
});
var WizardAnswerSchema = closedObject({
  stepId: NonEmptyString,
  value: Type3.Optional(Type3.Unknown())
});
var WizardNextParamsSchema = closedObject({
  sessionId: NonEmptyString,
  answer: Type3.Optional(WizardAnswerSchema)
});
var WizardSessionIdParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var WizardStepOptionSchema = closedObject({
  value: Type3.Unknown(),
  label: NonEmptyString,
  hint: Type3.Optional(Type3.String())
});
var WizardDeviceCodeSchema = closedObject({
  code: NonEmptyString,
  expiresInMinutes: Type3.Optional(Type3.Integer({ minimum: 1, maximum: 1440 })),
  message: Type3.Optional(Type3.String())
});
var WizardStepSchema = closedObject({
  id: NonEmptyString,
  type: Type3.Union([
    Type3.Literal("note"),
    Type3.Literal("select"),
    Type3.Literal("text"),
    Type3.Literal("confirm"),
    Type3.Literal("multiselect"),
    Type3.Literal("progress"),
    Type3.Literal("action")
  ]),
  title: Type3.Optional(Type3.String()),
  message: Type3.Optional(Type3.String()),
  format: Type3.Optional(Type3.Union([Type3.Literal("plain")])),
  options: Type3.Optional(Type3.Array(WizardStepOptionSchema)),
  initialValue: Type3.Optional(Type3.Unknown()),
  placeholder: Type3.Optional(Type3.String()),
  sensitive: Type3.Optional(Type3.Boolean()),
  executor: Type3.Optional(Type3.Union([Type3.Literal("gateway"), Type3.Literal("client")])),
  externalUrl: Type3.Optional(Type3.String()),
  deviceCode: Type3.Optional(WizardDeviceCodeSchema)
});
var WizardConfiguredAccountSchema = closedObject({
  channel: NonEmptyString,
  accountId: NonEmptyString
});
var WizardResultFields = {
  done: Type3.Boolean(),
  step: Type3.Optional(WizardStepSchema),
  status: Type3.Optional(WizardRunStatusSchema),
  error: Type3.Optional(Type3.String()),
  // What the flow actually configured; set on the terminal result of
  // wizard.start flow "channels" sessions so clients run channel-specific
  // completion (e.g. WhatsApp QR linking for the right account) from the
  // real outcome rather than the preselection.
  channels: Type3.Optional(Type3.Array(NonEmptyString)),
  accounts: Type3.Optional(Type3.Array(WizardConfiguredAccountSchema))
};
var WizardNextResultSchema = closedObject(WizardResultFields);
var WizardStartResultSchema = closedObject({
  sessionId: NonEmptyString,
  ...WizardResultFields
});
var WizardStatusResultSchema = closedObject({
  status: WizardRunStatusSchema,
  error: Type3.Optional(Type3.String())
});

// packages/gateway-protocol/src/schema/openclaw.ts
var SystemAgentChatParamsSchema = closedObject({
  sessionId: NonEmptyString,
  message: Type4.Optional(Type4.String()),
  /** Seeds a purpose-specific first greeting for a fresh conversation. */
  welcomeVariant: Type4.Optional(
    Type4.Union([Type4.Literal("onboarding"), Type4.Literal("new-agent")])
  ),
  /** Drop any in-flight approval/wizard state and start the session over. */
  reset: Type4.Optional(Type4.Boolean()),
  /** Host-only regular-agent delegation context. Never model-authored. */
  delegation: Type4.Optional(
    closedObject({
      agentId: Type4.Optional(NonEmptyString),
      sessionKey: Type4.Optional(NonEmptyString),
      turnSourceChannel: Type4.Optional(NonEmptyString),
      turnSourceTo: Type4.Optional(NonEmptyString),
      turnSourceAccountId: Type4.Optional(NonEmptyString),
      turnSourceThreadId: Type4.Optional(Type4.Union([Type4.String(), Type4.Number()]))
    })
  )
});
var SystemAgentChatQuestionSchema = closedObject({
  id: NonEmptyString,
  header: NonEmptyString,
  question: NonEmptyString,
  options: Type4.Array(
    closedObject({
      label: NonEmptyString,
      description: Type4.Optional(Type4.String()),
      recommended: Type4.Optional(Type4.Boolean()),
      /** Message text a client sends when this option is chosen; defaults to label. */
      reply: Type4.Optional(NonEmptyString)
    }),
    { minItems: 2, maxItems: 4 }
  ),
  /** Free-text answers are also accepted for this question. */
  isOther: Type4.Optional(Type4.Boolean())
});
var SystemAgentChatResultSchema = closedObject({
  sessionId: NonEmptyString,
  reply: NonEmptyString,
  /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
  sensitive: Type4.Optional(Type4.Boolean()),
  /** The hosted wizard will consume the next message as its current step answer. */
  wizardInputPending: Type4.Optional(Type4.Boolean()),
  action: Type4.Union([
    Type4.Literal("none"),
    // The user asked to talk to their agent; clients should move to their
    // normal agent chat surface.
    Type4.Literal("open-agent"),
    Type4.Literal("exit")
  ]),
  /** Optional localized-draft intent for an `open-agent` handoff. */
  agentDraft: Type4.Optional(Type4.Literal("hatch")),
  /** Destination agent for a specific `open-agent` handoff. */
  agentId: Type4.Optional(NonEmptyString),
  needsApproval: Type4.Optional(Type4.Boolean()),
  proposalId: Type4.Optional(NonEmptyString),
  question: Type4.Optional(SystemAgentChatQuestionSchema)
});
var SystemAgentChatHistoryParamsSchema = closedObject({
  limit: Type4.Optional(Type4.Integer({ minimum: 1, maximum: 500, default: 100 }))
});
var SystemAgentChatHistoryTurnSchema = closedObject({
  role: Type4.Union([Type4.Literal("user"), Type4.Literal("assistant")]),
  text: Type4.String(),
  at: Type4.Number()
});
var SystemAgentChatHistoryResultSchema = closedObject({
  turns: Type4.Array(SystemAgentChatHistoryTurnSchema)
});
var SystemChangeKindSchema = Type4.Union([
  Type4.Literal("operation"),
  Type4.Literal("config-write"),
  Type4.Literal("external-edit")
]);
var SystemChangeSourceSchema = Type4.Union([
  Type4.Literal("system-agent"),
  Type4.Literal("doctor"),
  Type4.Literal("config-rpc"),
  Type4.Literal("cli"),
  Type4.Literal("plugin-install"),
  Type4.Literal("external"),
  Type4.Literal("unknown")
]);
var SystemChangeEntrySchema = closedObject({
  id: NonEmptyString,
  at: Type4.Number(),
  kind: SystemChangeKindSchema,
  source: SystemChangeSourceSchema,
  summary: Type4.String(),
  changedPaths: Type4.Optional(Type4.Array(Type4.String())),
  invalid: Type4.Optional(Type4.Boolean()),
  opaqueChange: Type4.Optional(Type4.Boolean())
});
var SystemChangesListParamsSchema = closedObject({
  limit: Type4.Optional(Type4.Integer({ minimum: 1, maximum: 200, default: 50 })),
  beforeCursor: Type4.Optional(NonEmptyString)
});
var SystemChangesListResultSchema = closedObject({
  entries: Type4.Array(SystemChangeEntrySchema),
  nextCursor: Type4.Optional(NonEmptyString)
});
var SystemAgentSetupDetectParamsSchema = closedObject({});
var ProviderAutoSetupInferenceKind = Type4.TemplateLiteral("provider-auto:${string}", {
  pattern: "^provider-auto:.+$"
});
var SetupInferenceHttpsUrl = Type4.String({
  minLength: 1,
  maxLength: 2048,
  pattern: "^https://"
});
var SetupInferenceKind = Type4.Union([
  Type4.Literal("existing-model"),
  Type4.Literal("openai-api-key"),
  Type4.Literal("anthropic-api-key"),
  Type4.Literal("claude-cli"),
  Type4.Literal("codex-cli"),
  Type4.Literal("gemini-cli"),
  ProviderAutoSetupInferenceKind
]);
var SetupInferenceStatus = Type4.Union([
  Type4.Literal("ok"),
  Type4.Literal("auth"),
  Type4.Literal("rate_limit"),
  Type4.Literal("billing"),
  Type4.Literal("timeout"),
  Type4.Literal("format"),
  Type4.Literal("unavailable"),
  Type4.Literal("unknown")
]);
var SetupInferenceFailureStatus = Type4.Union([
  Type4.Literal("auth"),
  Type4.Literal("rate_limit"),
  Type4.Literal("billing"),
  Type4.Literal("timeout"),
  Type4.Literal("format"),
  Type4.Literal("unavailable"),
  Type4.Literal("unknown")
]);
var SystemAgentSetupDetectResultSchema = closedObject({
  candidates: Type4.Array(
    closedObject({
      kind: SetupInferenceKind,
      label: NonEmptyString,
      detail: Type4.String(),
      modelRef: NonEmptyString,
      recommended: Type4.Boolean(),
      /** true: verified; false: definitively logged out; absent: unknown. */
      credentials: Type4.Optional(Type4.Boolean()),
      icon: Type4.Optional(SetupInferenceHttpsUrl),
      website: Type4.Optional(SetupInferenceHttpsUrl)
    })
  ),
  unavailableCandidates: Type4.Optional(
    Type4.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        detail: Type4.String(),
        reason: NonEmptyString
      })
    )
  ),
  /** Text-inference key/token methods exposed by the Gateway provider registry. */
  manualProviders: Type4.Array(
    closedObject({
      /** Opaque provider-auth choice sent back during activation. */
      id: NonEmptyString,
      label: NonEmptyString,
      hint: Type4.Optional(Type4.String()),
      icon: Type4.Optional(SetupInferenceHttpsUrl),
      website: Type4.Optional(SetupInferenceHttpsUrl)
    })
  ),
  /** Provider-owned browser and device-code login methods. */
  authOptions: Type4.Optional(
    Type4.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: Type4.Optional(Type4.String()),
        groupLabel: Type4.Optional(Type4.String()),
        icon: Type4.Optional(SetupInferenceHttpsUrl),
        website: Type4.Optional(SetupInferenceHttpsUrl),
        kind: Type4.Union([Type4.Literal("oauth"), Type4.Literal("device-code")]),
        featured: Type4.Boolean()
      })
    )
  ),
  recommendedInstalls: Type4.Optional(
    Type4.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: NonEmptyString,
        website: SetupInferenceHttpsUrl,
        icon: SetupInferenceHttpsUrl
      })
    )
  ),
  workspace: NonEmptyString,
  codexAppServerDetected: Type4.Optional(Type4.Boolean()),
  configuredModel: Type4.Optional(Type4.String()),
  setupComplete: Type4.Boolean()
});
var SystemAgentSetupVerifyParamsSchema = closedObject({});
var SystemAgentSetupVerifyResultSchema = Type4.Union([
  closedObject({
    ok: Type4.Literal(true),
    modelRef: NonEmptyString,
    latencyMs: Type4.Number()
  }),
  closedObject({
    ok: Type4.Literal(false),
    status: SetupInferenceFailureStatus,
    error: NonEmptyString
  })
]);
var SystemAgentSetupActivateParamsSchema = closedObject({
  kind: Type4.Union([
    Type4.Literal("existing-model"),
    Type4.Literal("openai-api-key"),
    Type4.Literal("anthropic-api-key"),
    Type4.Literal("claude-cli"),
    Type4.Literal("codex-cli"),
    Type4.Literal("gemini-cli"),
    ProviderAutoSetupInferenceKind,
    Type4.Literal("api-key")
  ]),
  /** Exact detected model for this route; prevents detect/activate drift. */
  modelRef: Type4.Optional(NonEmptyString),
  /** Manual step only: opaque provider-auth choice returned by detection. */
  authChoice: Type4.Optional(Type4.String()),
  /** Manual step only: the pasted API key or token; masked by clients, never echoed. */
  apiKey: Type4.Optional(Type4.String()),
  workspace: Type4.Optional(Type4.String())
});
var SystemAgentSetupActivateResultSchema = closedObject({
  ok: Type4.Boolean(),
  /** Present on success: the model ref that answered the live test. */
  modelRef: Type4.Optional(Type4.String()),
  latencyMs: Type4.Optional(Type4.Number()),
  /** Human-readable setup summary lines (workspace, model, gateway). */
  lines: Type4.Optional(Type4.Array(Type4.String())),
  /** Present on failure: coarse bucket for client copy + docs links. */
  status: Type4.Optional(SetupInferenceStatus),
  error: Type4.Optional(Type4.String())
});
var SystemAgentSetupAuthStartParamsSchema = closedObject({
  /** Client-generated so cancellation remains possible if the start reply is lost. */
  sessionId: NonEmptyString,
  authChoice: NonEmptyString,
  workspace: Type4.Optional(Type4.String())
});
var SystemAgentSetupAuthStartResultSchema = WizardStartResultSchema;
export {
  SystemAgentChatHistoryParamsSchema,
  SystemAgentChatHistoryResultSchema,
  SystemAgentChatHistoryTurnSchema,
  SystemAgentChatParamsSchema,
  SystemAgentChatQuestionSchema,
  SystemAgentChatResultSchema,
  SystemAgentSetupActivateParamsSchema,
  SystemAgentSetupActivateResultSchema,
  SystemAgentSetupAuthStartParamsSchema,
  SystemAgentSetupAuthStartResultSchema,
  SystemAgentSetupDetectParamsSchema,
  SystemAgentSetupDetectResultSchema,
  SystemAgentSetupVerifyParamsSchema,
  SystemAgentSetupVerifyResultSchema,
  SystemChangeEntrySchema,
  SystemChangeKindSchema,
  SystemChangeSourceSchema,
  SystemChangesListParamsSchema,
  SystemChangesListResultSchema
};
