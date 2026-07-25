// packages/gateway-protocol/src/schema/channels.ts
import { Type as Type3 } from "typebox";

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

// packages/gateway-protocol/src/schema/channels.ts
var TalkModeParamsSchema = closedObject({
  enabled: Type3.Boolean(),
  phase: Type3.Optional(Type3.String())
});
var TalkConfigParamsSchema = closedObject({
  includeSecrets: Type3.Optional(Type3.Boolean())
});
var TalkSpeakParamsSchema = closedObject({
  text: NonEmptyString,
  voiceId: Type3.Optional(Type3.String()),
  modelId: Type3.Optional(Type3.String()),
  outputFormat: Type3.Optional(Type3.String()),
  speed: Type3.Optional(Type3.Number()),
  rateWpm: Type3.Optional(Type3.Integer({ minimum: 1 })),
  stability: Type3.Optional(Type3.Number()),
  similarity: Type3.Optional(Type3.Number()),
  style: Type3.Optional(Type3.Number()),
  speakerBoost: Type3.Optional(Type3.Boolean()),
  seed: Type3.Optional(Type3.Integer({ minimum: 0 })),
  normalize: Type3.Optional(Type3.String()),
  language: Type3.Optional(Type3.String()),
  latencyTier: Type3.Optional(Type3.Integer({ minimum: 0 }))
});
var TtsSpeakParamsSchema = closedObject({
  text: NonEmptyString
});
var TalkModeSchema = Type3.Union([
  Type3.Literal("realtime"),
  Type3.Literal("stt-tts"),
  Type3.Literal("transcription")
]);
var TalkTransportSchema = Type3.Union([
  Type3.Literal("webrtc"),
  Type3.Literal("provider-websocket"),
  Type3.Literal("gateway-relay"),
  Type3.Literal("managed-room")
]);
var TalkBrainSchema = Type3.Union([
  Type3.Literal("agent-consult"),
  Type3.Literal("direct-tools"),
  Type3.Literal("none")
]);
var TalkAgentControlModeSchema = Type3.Union([
  Type3.Literal("status"),
  Type3.Literal("steer"),
  Type3.Literal("cancel"),
  Type3.Literal("followup")
]);
var TalkEventTypeSchema = Type3.Union([
  Type3.Literal("session.started"),
  Type3.Literal("session.ready"),
  Type3.Literal("session.closed"),
  Type3.Literal("session.error"),
  Type3.Literal("session.replaced"),
  Type3.Literal("turn.started"),
  Type3.Literal("turn.ended"),
  Type3.Literal("turn.cancelled"),
  Type3.Literal("capture.started"),
  Type3.Literal("capture.stopped"),
  Type3.Literal("capture.cancelled"),
  Type3.Literal("capture.once"),
  Type3.Literal("input.audio.delta"),
  Type3.Literal("input.audio.committed"),
  Type3.Literal("transcript.delta"),
  Type3.Literal("transcript.done"),
  Type3.Literal("output.text.delta"),
  Type3.Literal("output.text.done"),
  Type3.Literal("output.audio.started"),
  Type3.Literal("output.audio.delta"),
  Type3.Literal("output.audio.done"),
  Type3.Literal("tool.call"),
  Type3.Literal("tool.progress"),
  Type3.Literal("tool.result"),
  Type3.Literal("tool.error"),
  Type3.Literal("usage.metrics"),
  Type3.Literal("latency.metrics"),
  Type3.Literal("health.changed")
]);
var TURN_SCOPED_TALK_EVENT_TYPES = [
  "turn.started",
  "turn.ended",
  "turn.cancelled",
  "input.audio.delta",
  "input.audio.committed",
  "transcript.delta",
  "transcript.done",
  "output.text.delta",
  "output.text.done",
  "output.audio.started",
  "output.audio.delta",
  "output.audio.done",
  "tool.call",
  "tool.progress",
  "tool.result",
  "tool.error"
];
var CAPTURE_SCOPED_TALK_EVENT_TYPES = [
  "capture.started",
  "capture.stopped",
  "capture.cancelled",
  "capture.once"
];
function requireJsonSchemaProperties(properties) {
  const conditionalRequirementKey = ["th", "en"].join("");
  return Object.fromEntries([[conditionalRequirementKey, { required: properties }]]);
}
var TalkEventSchema = Type3.Object(
  {
    id: NonEmptyString,
    type: TalkEventTypeSchema,
    sessionId: NonEmptyString,
    turnId: Type3.Optional(Type3.String()),
    captureId: Type3.Optional(Type3.String()),
    seq: Type3.Integer({ minimum: 1 }),
    timestamp: NonEmptyString,
    mode: TalkModeSchema,
    transport: TalkTransportSchema,
    brain: TalkBrainSchema,
    provider: Type3.Optional(Type3.String()),
    final: Type3.Optional(Type3.Boolean()),
    callId: Type3.Optional(Type3.String()),
    itemId: Type3.Optional(Type3.String()),
    parentId: Type3.Optional(Type3.String()),
    payload: Type3.Unknown()
  },
  {
    additionalProperties: false,
    allOf: [
      {
        if: {
          properties: { type: { enum: TURN_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"]
        },
        ...requireJsonSchemaProperties(["turnId"])
      },
      {
        if: {
          properties: { type: { enum: CAPTURE_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"]
        },
        ...requireJsonSchemaProperties(["captureId"])
      }
    ]
  }
);
var VoiceIdString = Type3.String({ pattern: "^[A-Za-z0-9_-]{1,128}$" });
var TalkClientCreateParamsSchema = closedObject({
  sessionKey: Type3.Optional(NonEmptyString),
  voiceSessionId: Type3.Optional(VoiceIdString),
  provider: Type3.Optional(Type3.String()),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  vadThreshold: Type3.Optional(Type3.Number()),
  silenceDurationMs: Type3.Optional(Type3.Integer({ minimum: 1 })),
  prefixPaddingMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  reasoningEffort: Type3.Optional(Type3.String()),
  mode: Type3.Optional(TalkModeSchema),
  transport: Type3.Optional(TalkTransportSchema),
  brain: Type3.Optional(TalkBrainSchema),
  capabilities: Type3.Optional(
    Type3.Array(Type3.Union([Type3.Literal("camera-frame"), Type3.Literal("voice-transcript")]), {
      uniqueItems: true
    })
  )
});
var TalkClientToolCallParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: Type3.Optional(VoiceIdString),
  callId: NonEmptyString,
  name: NonEmptyString,
  args: Type3.Optional(Type3.Unknown()),
  relaySessionId: Type3.Optional(NonEmptyString)
});
var TalkClientTranscriptParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString,
  entryId: VoiceIdString,
  role: Type3.Union([Type3.Literal("user"), Type3.Literal("assistant")]),
  text: NonEmptyString,
  timestamp: Type3.Optional(Type3.Number())
});
var TalkClientCloseParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  voiceSessionId: VoiceIdString
});
var TalkClientMutationResultSchema = closedObject({
  ok: Type3.Literal(true)
});
var TalkClientToolCallResultSchema = closedObject({
  runId: NonEmptyString,
  idempotencyKey: NonEmptyString
});
var TalkClientSteerParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  text: NonEmptyString,
  mode: Type3.Optional(TalkAgentControlModeSchema)
});
var TalkAgentControlResultSchema = closedObject({
  ok: Type3.Boolean(),
  mode: TalkAgentControlModeSchema,
  sessionKey: NonEmptyString,
  sessionId: Type3.Optional(NonEmptyString),
  active: Type3.Boolean(),
  queued: Type3.Optional(Type3.Boolean()),
  aborted: Type3.Optional(Type3.Boolean()),
  target: Type3.Optional(Type3.Union([Type3.Literal("embedded_run"), Type3.Literal("reply_run")])),
  reason: Type3.Optional(Type3.String()),
  message: Type3.String(),
  speak: Type3.Boolean(),
  show: Type3.Boolean(),
  suppress: Type3.Boolean(),
  providerResult: Type3.Optional(
    closedObject({
      status: Type3.Literal("cancelled"),
      message: Type3.String()
    })
  ),
  enqueuedAtMs: Type3.Optional(Type3.Number()),
  deliveredAtMs: Type3.Optional(Type3.Number())
});
var TalkSessionJoinParamsSchema = closedObject({
  sessionId: NonEmptyString,
  token: NonEmptyString
});
var TalkSessionCreateParamsSchema = closedObject({
  sessionKey: Type3.Optional(Type3.String()),
  spawnedBy: Type3.Optional(NonEmptyString),
  provider: Type3.Optional(Type3.String()),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  language: Type3.Optional(Type3.String({ pattern: "^[a-z]{2}$" })),
  vadThreshold: Type3.Optional(Type3.Number()),
  silenceDurationMs: Type3.Optional(Type3.Integer({ minimum: 1 })),
  prefixPaddingMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  reasoningEffort: Type3.Optional(Type3.String()),
  mode: Type3.Optional(TalkModeSchema),
  transport: Type3.Optional(TalkTransportSchema),
  brain: Type3.Optional(TalkBrainSchema),
  ttlMs: Type3.Optional(Type3.Integer({ minimum: 1e3, maximum: 36e5 }))
});
var TalkSessionAppendAudioParamsSchema = closedObject({
  sessionId: NonEmptyString,
  audioBase64: NonEmptyString,
  timestamp: Type3.Optional(Type3.Number())
});
var TalkSessionTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type3.Optional(Type3.String())
});
var TalkSessionCancelTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type3.Optional(Type3.String()),
  reason: Type3.Optional(Type3.String())
});
var TalkSessionCancelOutputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type3.Optional(Type3.String()),
  reason: Type3.Optional(Type3.String())
});
var TalkSessionSubmitToolResultParamsSchema = closedObject({
  sessionId: NonEmptyString,
  callId: NonEmptyString,
  result: Type3.Unknown(),
  options: Type3.Optional(
    closedObject({
      suppressResponse: Type3.Optional(Type3.Boolean()),
      willContinue: Type3.Optional(Type3.Boolean())
    })
  )
});
var TalkSessionSteerParamsSchema = closedObject({
  sessionId: NonEmptyString,
  sessionKey: Type3.Optional(NonEmptyString),
  text: NonEmptyString,
  mode: Type3.Optional(TalkAgentControlModeSchema)
});
var TalkSessionCloseParamsSchema = closedObject({
  sessionId: NonEmptyString
});
var TalkSessionManagedRoomStateSchema = closedObject({
  activeClientId: Type3.Optional(Type3.String()),
  activeTurnId: Type3.Optional(Type3.String()),
  recentTalkEvents: Type3.Array(TalkEventSchema)
});
var TalkSessionManagedRoomRecordSchema = closedObject({
  id: NonEmptyString,
  roomId: NonEmptyString,
  roomUrl: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: Type3.Optional(Type3.String()),
  channel: Type3.Optional(Type3.String()),
  target: Type3.Optional(Type3.String()),
  provider: Type3.Optional(Type3.String()),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  createdAt: Type3.Number(),
  expiresAt: Type3.Number(),
  room: TalkSessionManagedRoomStateSchema
});
var TalkCatalogParamsSchema = closedObject({});
var TalkCatalogProviderSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  configured: Type3.Boolean(),
  aliases: Type3.Optional(Type3.Array(NonEmptyString)),
  models: Type3.Optional(Type3.Array(Type3.String())),
  voices: Type3.Optional(Type3.Array(Type3.String())),
  defaultModel: Type3.Optional(Type3.String()),
  modes: Type3.Optional(Type3.Array(TalkModeSchema)),
  transports: Type3.Optional(Type3.Array(TalkTransportSchema)),
  brains: Type3.Optional(Type3.Array(TalkBrainSchema)),
  inputAudioFormats: Type3.Optional(
    Type3.Array(
      closedObject({
        encoding: Type3.Union([Type3.Literal("pcm16"), Type3.Literal("g711_ulaw")]),
        sampleRateHz: Type3.Integer({ minimum: 1 }),
        channels: Type3.Integer({ minimum: 1 })
      })
    )
  ),
  outputAudioFormats: Type3.Optional(
    Type3.Array(
      closedObject({
        encoding: Type3.Union([Type3.Literal("pcm16"), Type3.Literal("g711_ulaw")]),
        sampleRateHz: Type3.Integer({ minimum: 1 }),
        channels: Type3.Integer({ minimum: 1 })
      })
    )
  ),
  supportsBrowserSession: Type3.Optional(Type3.Boolean()),
  supportsBargeIn: Type3.Optional(Type3.Boolean()),
  supportsToolCalls: Type3.Optional(Type3.Boolean()),
  supportsVideoFrames: Type3.Optional(Type3.Boolean()),
  supportsSessionResumption: Type3.Optional(Type3.Boolean())
});
var TalkCatalogProviderGroupSchema = closedObject({
  ready: Type3.Optional(Type3.Boolean()),
  activeProvider: Type3.Optional(Type3.String()),
  providers: Type3.Array(TalkCatalogProviderSchema)
});
var TalkCatalogResultSchema = closedObject({
  modes: Type3.Array(TalkModeSchema),
  transports: Type3.Array(TalkTransportSchema),
  brains: Type3.Array(TalkBrainSchema),
  speech: TalkCatalogProviderGroupSchema,
  transcription: TalkCatalogProviderGroupSchema,
  realtime: TalkCatalogProviderGroupSchema
});
var BrowserRealtimeAudioContractSchema = closedObject({
  inputEncoding: Type3.Union([Type3.Literal("pcm16"), Type3.Literal("g711_ulaw")]),
  inputSampleRateHz: Type3.Integer({ minimum: 1 }),
  outputEncoding: Type3.Union([Type3.Literal("pcm16"), Type3.Literal("g711_ulaw")]),
  outputSampleRateHz: Type3.Integer({ minimum: 1 })
});
var TalkSessionCreateResultSchema = closedObject({
  sessionId: NonEmptyString,
  provider: Type3.Optional(Type3.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  relaySessionId: Type3.Optional(NonEmptyString),
  transcriptionSessionId: Type3.Optional(NonEmptyString),
  handoffId: Type3.Optional(NonEmptyString),
  roomId: Type3.Optional(NonEmptyString),
  roomUrl: Type3.Optional(NonEmptyString),
  token: Type3.Optional(NonEmptyString),
  audio: Type3.Optional(Type3.Unknown()),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  expiresAt: Type3.Optional(Type3.Number())
});
var TalkSessionTurnResultSchema = closedObject({
  ok: Type3.Boolean(),
  turnId: Type3.Optional(Type3.String()),
  events: Type3.Optional(Type3.Array(TalkEventSchema))
});
var TalkSessionJoinResultSchema = TalkSessionManagedRoomRecordSchema;
var TalkSessionOkResultSchema = closedObject({
  ok: Type3.Boolean()
});
var BrowserRealtimeWebRtcSdpSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type3.Literal("webrtc"),
  voiceSessionId: NonEmptyString,
  clientSecret: NonEmptyString,
  offerUrl: Type3.Optional(Type3.String()),
  offerHeaders: Type3.Optional(Type3.Record(Type3.String(), Type3.String())),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  expiresAt: Type3.Optional(Type3.Number())
});
var BrowserRealtimeJsonPcmWebSocketSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type3.Literal("provider-websocket"),
  voiceSessionId: NonEmptyString,
  protocol: NonEmptyString,
  clientSecret: NonEmptyString,
  websocketUrl: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  initialMessage: Type3.Optional(Type3.Unknown()),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  expiresAt: Type3.Optional(Type3.Number())
});
var BrowserRealtimeGatewayRelaySessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type3.Literal("gateway-relay"),
  // Server-owned: older gateways omit it and clients derive it from relaySessionId.
  voiceSessionId: Type3.Optional(NonEmptyString),
  relaySessionId: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  expiresAt: Type3.Optional(Type3.Number())
});
var BrowserRealtimeManagedRoomSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type3.Literal("managed-room"),
  // Server-owned rooms carry no client voice bookkeeping yet.
  voiceSessionId: Type3.Optional(NonEmptyString),
  roomUrl: NonEmptyString,
  token: Type3.Optional(Type3.String()),
  model: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  expiresAt: Type3.Optional(Type3.Number())
});
var TalkClientCreateResultSchema = Type3.Union([
  BrowserRealtimeWebRtcSdpSessionSchema,
  BrowserRealtimeJsonPcmWebSocketSessionSchema,
  BrowserRealtimeGatewayRelaySessionSchema,
  BrowserRealtimeManagedRoomSessionSchema
]);
var talkProviderFieldSchemas = {
  apiKey: Type3.Optional(SecretInputSchema)
};
var TalkProviderConfigSchema = Type3.Object(talkProviderFieldSchemas, {
  additionalProperties: true
});
var TalkRealtimeConfigSchema = closedObject({
  provider: Type3.Optional(Type3.String()),
  providers: Type3.Optional(Type3.Record(Type3.String(), TalkProviderConfigSchema)),
  model: Type3.Optional(Type3.String()),
  speakerVoice: Type3.Optional(Type3.String()),
  speakerVoiceId: Type3.Optional(Type3.String()),
  voice: Type3.Optional(Type3.String()),
  instructions: Type3.Optional(Type3.String()),
  mode: Type3.Optional(TalkModeSchema),
  transport: Type3.Optional(TalkTransportSchema),
  vadThreshold: Type3.Optional(Type3.Number({ minimum: 0, maximum: 1 })),
  silenceDurationMs: Type3.Optional(Type3.Integer({ minimum: 1 })),
  prefixPaddingMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  reasoningEffort: Type3.Optional(Type3.String({ minLength: 1 })),
  brain: Type3.Optional(TalkBrainSchema),
  consultRouting: Type3.Optional(
    Type3.Union([Type3.Literal("provider-direct"), Type3.Literal("force-agent-consult")])
  )
});
var ResolvedTalkConfigSchema = closedObject({
  provider: Type3.String(),
  config: TalkProviderConfigSchema
});
var TalkConfigSchema = closedObject({
  provider: Type3.Optional(Type3.String()),
  providers: Type3.Optional(Type3.Record(Type3.String(), TalkProviderConfigSchema)),
  realtime: Type3.Optional(TalkRealtimeConfigSchema),
  resolved: Type3.Optional(ResolvedTalkConfigSchema),
  consultThinkingLevel: Type3.Optional(Type3.String()),
  consultFastMode: Type3.Optional(Type3.Boolean()),
  speechLocale: Type3.Optional(Type3.String()),
  interruptOnSpeech: Type3.Optional(Type3.Boolean()),
  silenceTimeoutMs: Type3.Optional(Type3.Integer({ minimum: 1 }))
});
var TalkConfigResultSchema = closedObject({
  config: closedObject({
    talk: Type3.Optional(TalkConfigSchema),
    session: Type3.Optional(
      closedObject({
        mainKey: Type3.Optional(Type3.String())
      })
    ),
    ui: Type3.Optional(
      closedObject({
        seamColor: Type3.Optional(Type3.String())
      })
    )
  })
});
var TalkSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type3.Optional(Type3.String()),
  voiceCompatible: Type3.Optional(Type3.Boolean()),
  mimeType: Type3.Optional(Type3.String()),
  fileExtension: Type3.Optional(Type3.String())
});
var TtsSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type3.Optional(Type3.String()),
  mimeType: Type3.Optional(Type3.String()),
  fileExtension: Type3.Optional(Type3.String())
});
var ChannelsStatusParamsSchema = closedObject({
  probe: Type3.Optional(Type3.Boolean()),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  channel: Type3.Optional(NonEmptyString)
});
var ChannelAccountSnapshotSchema = Type3.Object(
  {
    accountId: NonEmptyString,
    name: Type3.Optional(Type3.String()),
    enabled: Type3.Optional(Type3.Boolean()),
    configured: Type3.Optional(Type3.Boolean()),
    linked: Type3.Optional(Type3.Boolean()),
    running: Type3.Optional(Type3.Boolean()),
    connected: Type3.Optional(Type3.Boolean()),
    reconnectAttempts: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastConnectedAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastError: Type3.Optional(Type3.String()),
    healthState: Type3.Optional(Type3.String()),
    lastStartAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastStopAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastInboundAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastOutboundAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastTransportActivityAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    busy: Type3.Optional(Type3.Boolean()),
    activeRuns: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastRunActivityAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    lastProbeAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
    mode: Type3.Optional(Type3.String()),
    dmPolicy: Type3.Optional(Type3.String()),
    allowFrom: Type3.Optional(Type3.Array(Type3.String())),
    tokenSource: Type3.Optional(Type3.String()),
    botTokenSource: Type3.Optional(Type3.String()),
    appTokenSource: Type3.Optional(Type3.String()),
    baseUrl: Type3.Optional(Type3.String()),
    allowUnmentionedGroups: Type3.Optional(Type3.Boolean()),
    cliPath: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
    dbPath: Type3.Optional(Type3.Union([Type3.String(), Type3.Null()])),
    port: Type3.Optional(Type3.Union([Type3.Integer({ minimum: 0 }), Type3.Null()])),
    probe: Type3.Optional(Type3.Unknown()),
    audit: Type3.Optional(Type3.Unknown()),
    application: Type3.Optional(Type3.Unknown())
  },
  { additionalProperties: true }
);
var ChannelUiMetaSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  detailLabel: NonEmptyString,
  systemImage: Type3.Optional(Type3.String())
});
var ChannelEventLoopHealthSchema = closedObject({
  degraded: Type3.Boolean(),
  reasons: Type3.Array(
    Type3.Union([
      Type3.Literal("event_loop_delay"),
      Type3.Literal("event_loop_utilization"),
      Type3.Literal("cpu")
    ])
  ),
  intervalMs: Type3.Integer({ minimum: 0 }),
  delayP99Ms: Type3.Number({ minimum: 0 }),
  delayMaxMs: Type3.Number({ minimum: 0 }),
  utilization: Type3.Number({ minimum: 0 }),
  cpuCoreRatio: Type3.Number({ minimum: 0 })
});
var ChannelsStatusResultSchema = closedObject({
  ts: Type3.Integer({ minimum: 0 }),
  channelOrder: Type3.Array(NonEmptyString),
  channelLabels: Type3.Record(NonEmptyString, NonEmptyString),
  channelDetailLabels: Type3.Optional(Type3.Record(NonEmptyString, NonEmptyString)),
  channelSystemImages: Type3.Optional(Type3.Record(NonEmptyString, NonEmptyString)),
  channelMeta: Type3.Optional(Type3.Array(ChannelUiMetaSchema)),
  channels: Type3.Record(NonEmptyString, Type3.Unknown()),
  channelAccounts: Type3.Record(NonEmptyString, Type3.Array(ChannelAccountSnapshotSchema)),
  channelDefaultAccountId: Type3.Record(NonEmptyString, NonEmptyString),
  eventLoop: Type3.Optional(ChannelEventLoopHealthSchema),
  partial: Type3.Optional(Type3.Boolean()),
  warnings: Type3.Optional(Type3.Array(Type3.String()))
});
var ChannelsLogoutParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type3.Optional(Type3.String())
});
var ChannelsStopParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type3.Optional(Type3.String())
});
var ChannelsStartParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type3.Optional(Type3.String())
});
var WebLoginStartParamsSchema = closedObject({
  force: Type3.Optional(Type3.Boolean()),
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  verbose: Type3.Optional(Type3.Boolean()),
  accountId: Type3.Optional(Type3.String())
});
var QrDataUrlSchema = Type3.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,"
});
var WebLoginWaitParamsSchema = closedObject({
  timeoutMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  accountId: Type3.Optional(Type3.String()),
  currentQrDataUrl: Type3.Optional(QrDataUrlSchema)
});
export {
  ChannelsLogoutParamsSchema,
  ChannelsStartParamsSchema,
  ChannelsStatusParamsSchema,
  ChannelsStatusResultSchema,
  ChannelsStopParamsSchema,
  TalkAgentControlResultSchema,
  TalkCatalogParamsSchema,
  TalkCatalogResultSchema,
  TalkClientCloseParamsSchema,
  TalkClientCreateParamsSchema,
  TalkClientCreateResultSchema,
  TalkClientMutationResultSchema,
  TalkClientSteerParamsSchema,
  TalkClientToolCallParamsSchema,
  TalkClientToolCallResultSchema,
  TalkClientTranscriptParamsSchema,
  TalkConfigParamsSchema,
  TalkConfigResultSchema,
  TalkEventSchema,
  TalkModeParamsSchema,
  TalkSessionAppendAudioParamsSchema,
  TalkSessionCancelOutputParamsSchema,
  TalkSessionCancelTurnParamsSchema,
  TalkSessionCloseParamsSchema,
  TalkSessionCreateParamsSchema,
  TalkSessionCreateResultSchema,
  TalkSessionJoinParamsSchema,
  TalkSessionJoinResultSchema,
  TalkSessionOkResultSchema,
  TalkSessionSteerParamsSchema,
  TalkSessionSubmitToolResultParamsSchema,
  TalkSessionTurnParamsSchema,
  TalkSessionTurnResultSchema,
  TalkSpeakParamsSchema,
  TalkSpeakResultSchema,
  TtsSpeakParamsSchema,
  TtsSpeakResultSchema,
  WebLoginStartParamsSchema,
  WebLoginWaitParamsSchema
};
