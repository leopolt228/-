// packages/gateway-protocol/src/schema/sessions.ts
import { Type as Type8 } from "typebox";

// packages/gateway-protocol/src/session-icon.ts
var SESSION_AGENT_ATTENTION_ICON_IDS = [
  "hand",
  "key",
  "alert",
  "flag",
  "lock",
  "hourglass"
];
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var SVG_NUMBER_SOURCE = "[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][-+]?\\d+)?";
var SVG_NUMBER_RE = new RegExp(`^${SVG_NUMBER_SOURCE}$`);
var SVG_TRANSFORM_RE = new RegExp(`^([a-z]+)\\s*\\(([^)]*)\\)`);

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/frames.ts
import { Type as Type4 } from "typebox";

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

// packages/gateway-protocol/src/schema/snapshot.ts
import { Type as Type3 } from "typebox";
var PresenceEntrySchema = closedObject({
  host: Type3.Optional(NonEmptyString),
  ip: Type3.Optional(NonEmptyString),
  version: Type3.Optional(NonEmptyString),
  platform: Type3.Optional(NonEmptyString),
  deviceFamily: Type3.Optional(NonEmptyString),
  modelIdentifier: Type3.Optional(NonEmptyString),
  mode: Type3.Optional(NonEmptyString),
  lastInputSeconds: Type3.Optional(Type3.Integer({ minimum: 0 })),
  reason: Type3.Optional(NonEmptyString),
  tags: Type3.Optional(Type3.Array(NonEmptyString)),
  text: Type3.Optional(Type3.String()),
  ts: Type3.Integer({ minimum: 0 }),
  deviceId: Type3.Optional(NonEmptyString),
  roles: Type3.Optional(Type3.Array(NonEmptyString)),
  scopes: Type3.Optional(Type3.Array(NonEmptyString)),
  instanceId: Type3.Optional(NonEmptyString),
  user: Type3.Optional(
    closedObject({
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */
      id: NonEmptyString,
      email: Type3.Optional(NonEmptyString),
      name: Type3.Optional(NonEmptyString),
      avatarUrl: Type3.Optional(NonEmptyString)
    })
  ),
  /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
  watchedSessions: Type3.Optional(Type3.Array(NonEmptyString))
});
var HealthSessionSummarySchema = closedObject({
  path: Type3.String(),
  count: Type3.Integer({ minimum: 0 }),
  recent: Type3.Array(
    closedObject({
      key: Type3.String(),
      updatedAt: Type3.Union([Type3.Integer({ minimum: 0 }), Type3.Null()]),
      age: Type3.Union([Type3.Integer({ minimum: 0 }), Type3.Null()])
    })
  )
});
var HealthSnapshotSchema = closedObject({
  // Every field is optional because hello snapshots use an empty object until
  // the asynchronous health producer has populated the cache.
  ok: Type3.Optional(Type3.Literal(true)),
  ts: Type3.Optional(Type3.Integer({ minimum: 0 })),
  durationMs: Type3.Optional(Type3.Integer({ minimum: 0 })),
  eventLoop: Type3.Optional(
    closedObject({
      degraded: Type3.Boolean(),
      reasons: Type3.Array(
        Type3.Union([
          Type3.Literal("event_loop_delay"),
          Type3.Literal("event_loop_utilization"),
          Type3.Literal("cpu")
        ])
      ),
      intervalMs: Type3.Number({ minimum: 0 }),
      delayP99Ms: Type3.Number({ minimum: 0 }),
      delayMaxMs: Type3.Number({ minimum: 0 }),
      utilization: Type3.Number({ minimum: 0 }),
      cpuCoreRatio: Type3.Number({ minimum: 0 })
    })
  ),
  plugins: Type3.Optional(
    closedObject({
      loaded: Type3.Array(Type3.String()),
      errors: Type3.Array(
        closedObject({
          id: Type3.String(),
          origin: Type3.String(),
          activated: Type3.Boolean(),
          activationSource: Type3.Optional(Type3.String()),
          activationReason: Type3.Optional(Type3.String()),
          failurePhase: Type3.Optional(Type3.String()),
          error: Type3.String()
        })
      ),
      unavailable: Type3.Optional(
        Type3.Array(
          closedObject({
            id: Type3.String(),
            state: Type3.Literal("configured-unavailable"),
            diagnostic: closedObject({
              kind: Type3.Literal("plugin-verification"),
              reason: Type3.String(),
              detail: Type3.String()
            })
          })
        )
      )
    })
  ),
  contextEngines: Type3.Optional(
    closedObject({
      quarantined: Type3.Array(
        closedObject({
          engineId: Type3.String(),
          owner: Type3.Optional(Type3.String()),
          operation: Type3.String(),
          reason: Type3.String(),
          failedAt: Type3.Integer({ minimum: 0 })
        })
      )
    })
  ),
  deliveryQueues: Type3.Optional(
    closedObject({
      failed: Type3.Array(
        closedObject({
          queueName: Type3.String(),
          count: Type3.Integer({ minimum: 0 }),
          oldestFailedAt: Type3.Optional(Type3.Integer({ minimum: 0 }))
        })
      )
    })
  ),
  modelPricing: Type3.Optional(
    closedObject({
      state: Type3.Union([Type3.Literal("ok"), Type3.Literal("degraded"), Type3.Literal("disabled")]),
      sources: Type3.Array(
        closedObject({
          source: Type3.Union([
            Type3.Literal("openrouter"),
            Type3.Literal("litellm"),
            Type3.Literal("bootstrap"),
            Type3.Literal("refresh")
          ]),
          state: Type3.Union([Type3.Literal("ok"), Type3.Literal("degraded")]),
          lastFailureAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
          detail: Type3.Optional(Type3.String())
        })
      ),
      lastFailureAt: Type3.Optional(Type3.Integer({ minimum: 0 })),
      detail: Type3.Optional(Type3.String())
    })
  ),
  configReload: Type3.Optional(
    closedObject({
      hotReloadStatus: Type3.Union([Type3.Literal("active"), Type3.Literal("disabled")])
    })
  ),
  // Channel plugins own their nested account/probe summaries, so this is the
  // one provider-contributed bag that deliberately remains unknown.
  channels: Type3.Optional(Type3.Record(Type3.String(), Type3.Unknown())),
  channelOrder: Type3.Optional(Type3.Array(Type3.String())),
  channelLabels: Type3.Optional(Type3.Record(Type3.String(), Type3.String())),
  heartbeatSeconds: Type3.Optional(Type3.Integer({ minimum: 0 })),
  defaultAgentId: Type3.Optional(Type3.String()),
  agents: Type3.Optional(
    Type3.Array(
      closedObject({
        agentId: Type3.String(),
        name: Type3.Optional(Type3.String()),
        isDefault: Type3.Boolean(),
        heartbeat: closedObject({
          enabled: Type3.Boolean(),
          every: Type3.String(),
          everyMs: Type3.Union([Type3.Integer({ minimum: 0 }), Type3.Null()]),
          prompt: Type3.String(),
          target: Type3.String(),
          model: Type3.Optional(Type3.String()),
          ackMaxChars: Type3.Integer({ minimum: 0 })
        }),
        sessions: HealthSessionSummarySchema
      })
    )
  ),
  sessions: Type3.Optional(HealthSessionSummarySchema)
});
var SessionDefaultsSchema = closedObject({
  defaultAgentId: NonEmptyString,
  mainKey: NonEmptyString,
  mainSessionKey: NonEmptyString,
  scope: Type3.Optional(NonEmptyString)
});
var StateVersionSchema = closedObject({
  presence: Type3.Integer({ minimum: 0 }),
  health: Type3.Integer({ minimum: 0 })
});
var SnapshotSchema = closedObject({
  presence: Type3.Array(PresenceEntrySchema),
  health: HealthSnapshotSchema,
  stateVersion: StateVersionSchema,
  uptimeMs: Type3.Integer({ minimum: 0 }),
  /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type3.Optional(Type3.Union([NonEmptyString, Type3.Null()])),
  configPath: Type3.Optional(NonEmptyString),
  stateDir: Type3.Optional(NonEmptyString),
  sessionDefaults: Type3.Optional(SessionDefaultsSchema),
  authMode: Type3.Optional(
    Type3.Union([
      Type3.Literal("none"),
      Type3.Literal("token"),
      Type3.Literal("password"),
      Type3.Literal("trusted-proxy")
    ])
  ),
  updateAvailable: Type3.Optional(
    Type3.Object({
      currentVersion: NonEmptyString,
      latestVersion: NonEmptyString,
      channel: NonEmptyString
    })
  )
});

// packages/gateway-protocol/src/schema/frames.ts
var TickEventSchema = closedObject({
  ts: Type4.Integer({ minimum: 0 })
});
var ShutdownEventSchema = closedObject({
  reason: NonEmptyString,
  restartExpectedMs: Type4.Optional(Type4.Integer({ minimum: 0 }))
});
var ConnectParamsSchema = closedObject({
  minProtocol: Type4.Integer({ minimum: 1 }),
  maxProtocol: Type4.Integer({ minimum: 1 }),
  client: closedObject({
    id: GatewayClientIdSchema,
    displayName: Type4.Optional(NonEmptyString),
    version: NonEmptyString,
    platform: NonEmptyString,
    deviceFamily: Type4.Optional(NonEmptyString),
    modelIdentifier: Type4.Optional(NonEmptyString),
    mode: GatewayClientModeSchema,
    instanceId: Type4.Optional(NonEmptyString)
  }),
  caps: Type4.Optional(Type4.Array(NonEmptyString, { default: [] })),
  commands: Type4.Optional(Type4.Array(NonEmptyString)),
  permissions: Type4.Optional(Type4.Record(NonEmptyString, Type4.Boolean())),
  pathEnv: Type4.Optional(Type4.String()),
  role: Type4.Optional(NonEmptyString),
  scopes: Type4.Optional(Type4.Array(NonEmptyString)),
  device: Type4.Optional(
    closedObject({
      id: NonEmptyString,
      publicKey: NonEmptyString,
      signature: NonEmptyString,
      signedAt: Type4.Integer({ minimum: 0 }),
      nonce: NonEmptyString
    })
  ),
  auth: Type4.Optional(
    closedObject({
      token: Type4.Optional(Type4.String()),
      bootstrapToken: Type4.Optional(Type4.String()),
      deviceToken: Type4.Optional(Type4.String()),
      password: Type4.Optional(Type4.String()),
      approvalRuntimeToken: Type4.Optional(Type4.String()),
      agentRuntimeIdentityToken: Type4.Optional(Type4.String())
    })
  ),
  locale: Type4.Optional(Type4.String()),
  userAgent: Type4.Optional(Type4.String())
});
var HelloOkSchema = closedObject({
  type: Type4.Literal("hello-ok"),
  protocol: Type4.Integer({ minimum: 1 }),
  server: closedObject({
    version: NonEmptyString,
    connId: NonEmptyString
  }),
  features: closedObject({
    methods: Type4.Array(NonEmptyString),
    events: Type4.Array(NonEmptyString),
    capabilities: Type4.Optional(Type4.Array(NonEmptyString))
  }),
  snapshot: SnapshotSchema,
  // Additive: plugin-declared Control UI tabs (surface "tab" descriptors).
  controlUiTabs: Type4.Optional(
    Type4.Array(
      closedObject({
        pluginId: NonEmptyString,
        id: NonEmptyString,
        label: NonEmptyString,
        description: Type4.Optional(Type4.String()),
        icon: Type4.Optional(Type4.String()),
        path: Type4.Optional(Type4.String()),
        requiresGatewayAuth: Type4.Optional(Type4.Boolean()),
        group: Type4.Optional(Type4.Union([Type4.Literal("control"), Type4.Literal("agent")])),
        order: Type4.Optional(Type4.Number())
      })
    )
  ),
  pluginSurfaceUrls: Type4.Optional(Type4.Record(NonEmptyString, NonEmptyString)),
  auth: closedObject({
    deviceToken: Type4.Optional(NonEmptyString),
    role: NonEmptyString,
    scopes: Type4.Array(NonEmptyString),
    issuedAtMs: Type4.Optional(Type4.Integer({ minimum: 0 })),
    deviceTokens: Type4.Optional(
      Type4.Array(
        closedObject({
          deviceToken: NonEmptyString,
          role: NonEmptyString,
          scopes: Type4.Array(NonEmptyString),
          issuedAtMs: Type4.Integer({ minimum: 0 })
        })
      )
    )
  }),
  policy: closedObject({
    maxPayload: Type4.Integer({ minimum: 1 }),
    maxBufferedBytes: Type4.Integer({ minimum: 1 }),
    tickIntervalMs: Type4.Integer({ minimum: 1 })
  })
});
var ErrorShapeSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type4.Optional(Type4.Unknown()),
  retryable: Type4.Optional(Type4.Boolean()),
  retryAfterMs: Type4.Optional(Type4.Integer({ minimum: 0 }))
});
var RequestFrameSchema = closedObject({
  type: Type4.Literal("req"),
  id: NonEmptyString,
  method: NonEmptyString,
  params: Type4.Optional(Type4.Unknown())
});
var ResponseFrameSchema = closedObject({
  type: Type4.Literal("res"),
  id: NonEmptyString,
  ok: Type4.Boolean(),
  payload: Type4.Optional(Type4.Unknown()),
  error: Type4.Optional(ErrorShapeSchema)
});
var EventFrameSchema = closedObject({
  type: Type4.Literal("event"),
  event: NonEmptyString,
  payload: Type4.Optional(Type4.Unknown()),
  seq: Type4.Optional(Type4.Integer({ minimum: 0 })),
  stateVersion: Type4.Optional(StateVersionSchema)
});
var GatewayFrameSchema = Type4.Union(
  [RequestFrameSchema, ResponseFrameSchema, EventFrameSchema],
  { discriminator: "type" }
);

// packages/gateway-protocol/src/schema/plugins.ts
import { Type as Type5 } from "typebox";
var PluginJsonValueSchema = Type5.Unknown();
var PluginControlUiDescriptorSchema = closedObject({
  id: NonEmptyString,
  pluginId: NonEmptyString,
  pluginName: Type5.Optional(NonEmptyString),
  surface: Type5.Union([
    Type5.Literal("session"),
    Type5.Literal("tool"),
    Type5.Literal("run"),
    Type5.Literal("settings")
  ]),
  label: NonEmptyString,
  description: Type5.Optional(Type5.String()),
  placement: Type5.Optional(Type5.String()),
  schema: Type5.Optional(PluginJsonValueSchema),
  requiredScopes: Type5.Optional(Type5.Array(NonEmptyString))
});
var PluginsUiDescriptorsParamsSchema = closedObject({});
var PluginsUiDescriptorsResultSchema = closedObject({
  ok: Type5.Literal(true),
  descriptors: Type5.Array(PluginControlUiDescriptorSchema)
});
var PluginsSessionActionParamsSchema = closedObject({
  pluginId: NonEmptyString,
  actionId: NonEmptyString,
  sessionKey: Type5.Optional(NonEmptyString),
  payload: Type5.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionSuccessResultSchema = closedObject({
  ok: Type5.Literal(true),
  result: Type5.Optional(PluginJsonValueSchema),
  continueAgent: Type5.Optional(Type5.Boolean()),
  reply: Type5.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionFailureResultSchema = closedObject({
  ok: Type5.Literal(false),
  error: Type5.String(),
  code: Type5.Optional(Type5.String()),
  details: Type5.Optional(PluginJsonValueSchema)
});
var PluginsSessionActionResultSchema = Type5.Union([
  PluginsSessionActionSuccessResultSchema,
  PluginsSessionActionFailureResultSchema
]);
var PluginCatalogClawHubInstallSchema = closedObject({
  source: Type5.Literal("clawhub"),
  packageName: NonEmptyString
});
var PluginCatalogOfficialInstallSchema = closedObject({
  source: Type5.Literal("official"),
  pluginId: NonEmptyString
});
var PluginCatalogInstallActionSchema = Type5.Union([
  PluginCatalogClawHubInstallSchema,
  PluginCatalogOfficialInstallSchema
]);
var PluginCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  packageName: Type5.Optional(NonEmptyString),
  description: Type5.Optional(Type5.String()),
  version: Type5.Optional(NonEmptyString),
  kind: Type5.Optional(Type5.Array(NonEmptyString)),
  origin: Type5.Optional(NonEmptyString),
  installed: Type5.Boolean(),
  enabled: Type5.Boolean(),
  state: Type5.Union([
    Type5.Literal("enabled"),
    Type5.Literal("disabled"),
    Type5.Literal("not-installed"),
    Type5.Literal("error")
  ]),
  featured: Type5.Optional(Type5.Boolean()),
  featuredAt: Type5.Optional(Type5.Integer({ minimum: 0 })),
  order: Type5.Optional(Type5.Number()),
  /** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
  hasIcon: Type5.Optional(Type5.Boolean()),
  install: Type5.Optional(PluginCatalogInstallActionSchema),
  error: Type5.Optional(Type5.String()),
  /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
  category: Type5.Optional(NonEmptyString),
  /** True when the plugin has an install record and can be removed via plugins.uninstall. */
  removable: Type5.Optional(Type5.Boolean())
});
var PluginsListParamsSchema = closedObject({});
var PluginsListResultSchema = closedObject({
  plugins: Type5.Array(PluginCatalogEntrySchema),
  diagnostics: Type5.Array(Type5.Unknown()),
  mutationAllowed: Type5.Boolean()
});
var PluginsSearchParamsSchema = closedObject({
  query: NonEmptyString,
  limit: Type5.Optional(Type5.Integer({ minimum: 1, maximum: 100 }))
});
var PluginSearchPackageSchema = closedObject({
  name: NonEmptyString,
  displayName: NonEmptyString,
  family: Type5.Union([Type5.Literal("code-plugin"), Type5.Literal("bundle-plugin")]),
  channel: Type5.Union([
    Type5.Literal("official"),
    Type5.Literal("community"),
    Type5.Literal("private")
  ]),
  isOfficial: Type5.Boolean(),
  summary: Type5.Optional(Type5.String()),
  latestVersion: Type5.Optional(NonEmptyString),
  runtimeId: Type5.Optional(NonEmptyString),
  downloads: Type5.Optional(Type5.Number({ minimum: 0 })),
  verificationTier: Type5.Optional(NonEmptyString)
});
var PluginSearchResultEntrySchema = closedObject({
  score: Type5.Number(),
  package: PluginSearchPackageSchema
});
var PluginsSearchResultSchema = closedObject({
  results: Type5.Array(PluginSearchResultEntrySchema)
});
var PluginsInstallParamsSchema = Type5.Union([
  closedObject({
    source: Type5.Literal("clawhub"),
    packageName: NonEmptyString,
    version: Type5.Optional(NonEmptyString),
    acknowledgeClawHubRisk: Type5.Optional(Type5.Boolean())
  }),
  closedObject({
    source: Type5.Literal("official"),
    pluginId: NonEmptyString
  })
]);
var PluginsInstallResultSchema = closedObject({
  ok: Type5.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type5.Literal(true),
  warnings: Type5.Optional(Type5.Array(Type5.String()))
});
var PluginsRefreshParamsSchema = closedObject({});
var PluginsRefreshResultSchema = closedObject({
  ok: Type5.Literal(true)
});
var PluginsUninstallParamsSchema = closedObject({
  pluginId: NonEmptyString
});
var PluginsUninstallResultSchema = closedObject({
  ok: Type5.Literal(true),
  pluginId: NonEmptyString,
  restartRequired: Type5.Literal(true),
  removed: Type5.Array(Type5.String()),
  warnings: Type5.Optional(Type5.Array(Type5.String()))
});
var PluginsSetEnabledParamsSchema = closedObject({
  pluginId: NonEmptyString,
  enabled: Type5.Boolean()
});
var PluginsSetEnabledResultSchema = closedObject({
  ok: Type5.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type5.Boolean(),
  warnings: Type5.Optional(Type5.Array(Type5.String()))
});

// packages/gateway-protocol/src/schema/sessions-create.ts
import { Type as Type7 } from "typebox";

// packages/gateway-protocol/src/schema/logs-chat.ts
import { Type as Type6 } from "typebox";
var LogsTailParamsSchema = closedObject({
  cursor: Type6.Optional(Type6.Integer({ minimum: 0 })),
  limit: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 5e3 })),
  maxBytes: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 1e6 }))
});
var LogsTailResultSchema = closedObject({
  file: NonEmptyString,
  cursor: Type6.Integer({ minimum: 0 }),
  size: Type6.Integer({ minimum: 0 }),
  lines: Type6.Array(Type6.String()),
  truncated: Type6.Optional(Type6.Boolean()),
  reset: Type6.Optional(Type6.Boolean())
});
var ChatHistoryParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type6.Optional(NonEmptyString),
  limit: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 1e3 })),
  offset: Type6.Optional(Type6.Integer({ minimum: 0 })),
  messageId: Type6.Optional(NonEmptyString),
  sessionId: Type6.Optional(NonEmptyString),
  maxChars: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 5e5 }))
});
var ChatMetadataParamsSchema = closedObject({
  agentId: Type6.Optional(NonEmptyString)
});
var ChatToolTitlesParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type6.Optional(NonEmptyString),
  items: Type6.Array(
    closedObject({
      id: Type6.String({ minLength: 1, maxLength: 64 }),
      name: Type6.String({ minLength: 1, maxLength: 200 }),
      input: Type6.String({ minLength: 1, maxLength: 4e3 })
    }),
    { minItems: 1, maxItems: 24 }
  )
});
var ChatToolTitlesResultSchema = closedObject({
  titles: Type6.Record(Type6.String(), Type6.String()),
  disabled: Type6.Optional(Type6.Boolean())
});
var ChatMessageGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type6.Optional(NonEmptyString),
  messageId: NonEmptyString,
  maxChars: Type6.Optional(Type6.Integer({ minimum: 1, maximum: 2e6 }))
});
var ChatMessageGetResultSchema = closedObject({
  ok: Type6.Boolean(),
  message: Type6.Optional(Type6.Unknown()),
  unavailableReason: Type6.Optional(
    Type6.Union([Type6.Literal("not_found"), Type6.Literal("oversized"), Type6.Literal("not_visible")])
  )
});
var ChatAttachmentsSchema = Type6.Array(Type6.Unknown());
var RunToolBindingsSchema = Type6.Record(
  Type6.String({ minLength: 1, maxLength: 128 }),
  Type6.Unknown(),
  { maxProperties: 16 }
);
var ChatSendParamsSchema = closedObject({
  sessionKey: ChatSendSessionKeyString,
  agentId: Type6.Optional(NonEmptyString),
  sessionId: Type6.Optional(NonEmptyString),
  message: Type6.String(),
  thinking: Type6.Optional(Type6.String()),
  fastMode: Type6.Optional(Type6.Union([Type6.Boolean(), Type6.Literal("auto")])),
  // One-turn override for auto fast-mode cutoff seconds.
  fastAutoOnSeconds: Type6.Optional(Type6.Integer({ minimum: 1 })),
  // One-turn override for active-run queue admission.
  queueMode: Type6.Optional(Type6.String({ enum: ["steer", "followup", "collect", "interrupt"] })),
  deliver: Type6.Optional(Type6.Boolean()),
  originatingChannel: Type6.Optional(Type6.String()),
  originatingTo: Type6.Optional(Type6.String()),
  originatingAccountId: Type6.Optional(Type6.String()),
  originatingThreadId: Type6.Optional(Type6.String()),
  // Transcript id of the message this send replies to; the Gateway hydrates
  // channel-agnostic reply context metadata from session history.
  replyToId: Type6.Optional(NonEmptyString),
  attachments: Type6.Optional(ChatAttachmentsSchema),
  toolBindings: Type6.Optional(RunToolBindingsSchema),
  timeoutMs: Type6.Optional(Type6.Integer({ minimum: 0 })),
  systemInputProvenance: Type6.Optional(InputProvenanceSchema),
  systemProvenanceReceipt: Type6.Optional(Type6.String()),
  suppressCommandInterpretation: Type6.Optional(Type6.Boolean()),
  expectedSessionRoutingContract: Type6.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString
});
var ChatAbortParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type6.Optional(NonEmptyString),
  runId: Type6.Optional(NonEmptyString),
  preserveSideRuns: Type6.Optional(Type6.Boolean())
});
var ChatInjectParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type6.Optional(NonEmptyString),
  message: NonEmptyString,
  label: Type6.Optional(Type6.String({ maxLength: 100 }))
});
var ChatEventBaseSchema = {
  runId: NonEmptyString,
  sessionKey: NonEmptyString,
  agentId: Type6.Optional(NonEmptyString),
  spawnedBy: Type6.Optional(NonEmptyString),
  seq: Type6.Integer({ minimum: 0 })
};
var ChatEventErrorKindSchema = Type6.Union([
  Type6.Literal("refusal"),
  Type6.Literal("timeout"),
  Type6.Literal("rate_limit"),
  Type6.Literal("context_length"),
  Type6.Literal("unknown")
]);
var ChatDeltaEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type6.Literal("delta"),
  message: Type6.Optional(Type6.Unknown()),
  deltaText: Type6.String(),
  replace: Type6.Optional(Type6.Boolean()),
  usage: Type6.Optional(Type6.Unknown())
});
var ChatFinalEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type6.Literal("final"),
  message: Type6.Optional(Type6.Unknown()),
  usage: Type6.Optional(Type6.Unknown()),
  stopReason: Type6.Optional(Type6.String()),
  yielded: Type6.Optional(Type6.Literal(true))
});
var ChatAbortedEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type6.Literal("aborted"),
  message: Type6.Optional(Type6.Unknown()),
  errorMessage: Type6.Optional(Type6.String()),
  stopReason: Type6.Optional(Type6.String())
});
var ChatErrorEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type6.Literal("error"),
  message: Type6.Optional(Type6.Unknown()),
  errorMessage: Type6.Optional(Type6.String()),
  errorKind: Type6.Optional(ChatEventErrorKindSchema),
  usage: Type6.Optional(Type6.Unknown()),
  stopReason: Type6.Optional(Type6.String())
});
var ChatEventSchema = Type6.Union([
  ChatDeltaEventSchema,
  ChatFinalEventSchema,
  ChatAbortedEventSchema,
  ChatErrorEventSchema
]);

// packages/gateway-protocol/src/schema/sessions-create.ts
var SessionsCreateParamsSchema = closedObject({
  key: Type7.Optional(NonEmptyString),
  agentId: Type7.Optional(NonEmptyString),
  label: Type7.Optional(SessionLabelString),
  model: Type7.Optional(NonEmptyString),
  thinkingLevel: Type7.Optional(NonEmptyString),
  catalogId: Type7.Optional(NonEmptyString),
  parentSessionKey: Type7.Optional(NonEmptyString),
  fork: Type7.Optional(
    Type7.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." })
  ),
  emitCommandHooks: Type7.Optional(Type7.Boolean()),
  succeedsParent: Type7.Optional(
    Type7.Boolean({
      description: "When sessions.create creates a distinct child, whether that child succeeds its parent and emits the parent's terminal session_end. Requires parentSessionKey and emitCommandHooks. False keeps the parent active; omission preserves legacy behavior."
    })
  ),
  task: Type7.Optional(Type7.String()),
  message: Type7.Optional(Type7.String()),
  attachments: Type7.Optional(ChatAttachmentsSchema),
  worktree: Type7.Optional(Type7.Boolean()),
  worktreeBaseRef: Type7.Optional(
    Type7.String({
      minLength: 1,
      description: "Base ref for the new managed worktree branch. Requires worktree=true."
    })
  ),
  worktreeName: Type7.Optional(
    Type7.String({
      pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
      description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true."
    })
  ),
  execNode: Type7.Optional(
    Type7.String({
      minLength: 1,
      description: "Bind session exec to host=node with this node id/name. Requires operator.admin."
    })
  ),
  cwd: Type7.Optional(
    Type7.String({
      minLength: 1,
      description: "Absolute source directory for a managed worktree, or the working directory on execNode. Requires operator.admin."
    })
  )
});

// packages/gateway-protocol/src/schema/sessions.ts
var SessionCompactionCheckpointReasonSchema = Type8.Union([
  Type8.Literal("manual"),
  Type8.Literal("auto-threshold"),
  Type8.Literal("overflow-retry"),
  Type8.Literal("timeout-retry")
]);
var SessionOperationEventSchema = closedObject({
  operationId: NonEmptyString,
  operation: Type8.Literal("compact"),
  phase: Type8.Union([Type8.Literal("start"), Type8.Literal("end")]),
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  ts: Type8.Integer({ minimum: 0 }),
  completed: Type8.Optional(Type8.Boolean()),
  reason: Type8.Optional(Type8.String())
});
var SessionCompactionTranscriptReferenceSchema = closedObject({
  sessionId: NonEmptyString,
  sessionFile: Type8.Optional(NonEmptyString),
  leafId: Type8.Optional(NonEmptyString),
  entryId: Type8.Optional(NonEmptyString)
});
var SessionCompactionCheckpointSchema = closedObject({
  checkpointId: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  createdAt: Type8.Integer({ minimum: 0 }),
  reason: SessionCompactionCheckpointReasonSchema,
  tokensBefore: Type8.Optional(Type8.Integer({ minimum: 0 })),
  tokensAfter: Type8.Optional(Type8.Integer({ minimum: 0 })),
  summary: Type8.Optional(Type8.String()),
  firstKeptEntryId: Type8.Optional(NonEmptyString),
  preCompaction: SessionCompactionTranscriptReferenceSchema,
  postCompaction: SessionCompactionTranscriptReferenceSchema
});
var SessionFileKindSchema = Type8.Union([Type8.Literal("modified"), Type8.Literal("read")]);
var SessionFileRelevanceSchema = Type8.Union([
  Type8.Literal("modified"),
  Type8.Literal("read"),
  Type8.Literal("mixed")
]);
var SessionFileHashSchema = Type8.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var SessionFileEntrySchema = closedObject({
  path: NonEmptyString,
  workspacePath: Type8.Optional(NonEmptyString),
  name: NonEmptyString,
  kind: SessionFileKindSchema,
  missing: Type8.Boolean(),
  size: Type8.Optional(Type8.Integer({ minimum: 0 })),
  updatedAtMs: Type8.Optional(Type8.Integer({ minimum: 0 })),
  content: Type8.Optional(Type8.String()),
  hash: Type8.Optional(SessionFileHashSchema)
});
var SessionFileBrowserEntrySchema = closedObject({
  path: Type8.String(),
  name: NonEmptyString,
  kind: Type8.Union([Type8.Literal("file"), Type8.Literal("directory")]),
  sessionKind: Type8.Optional(SessionFileRelevanceSchema),
  size: Type8.Optional(Type8.Integer({ minimum: 0 })),
  updatedAtMs: Type8.Optional(Type8.Integer({ minimum: 0 }))
});
var SessionFileBrowserResultSchema = closedObject({
  path: Type8.String(),
  parentPath: Type8.Optional(Type8.String()),
  search: Type8.Optional(Type8.String()),
  entries: Type8.Array(SessionFileBrowserEntrySchema),
  truncated: Type8.Optional(Type8.Boolean())
});
var SessionsFilesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  path: Type8.Optional(Type8.String()),
  search: Type8.Optional(Type8.String())
});
var SessionsFilesListResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type8.Optional(NonEmptyString),
  files: Type8.Array(SessionFileEntrySchema),
  browser: Type8.Optional(SessionFileBrowserResultSchema)
});
var SessionsFilesGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsFilesGetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type8.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesSetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  content: Type8.String(),
  expectedHash: SessionFileHashSchema
});
var SessionsFilesSetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type8.Optional(NonEmptyString),
  file: SessionFileEntrySchema
});
var SessionsFilesRevealParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsFilesRevealResultSchema = closedObject({
  ok: Type8.Boolean(),
  path: Type8.Optional(NonEmptyString),
  error: Type8.Optional(NonEmptyString)
});
var SessionDiffFileStatusSchema = Type8.Union([
  Type8.Literal("added"),
  Type8.Literal("modified"),
  Type8.Literal("deleted"),
  Type8.Literal("renamed")
]);
var SessionDiffFileSchema = closedObject({
  path: NonEmptyString,
  oldPath: Type8.Optional(NonEmptyString),
  status: SessionDiffFileStatusSchema,
  additions: Type8.Integer({ minimum: 0 }),
  deletions: Type8.Integer({ minimum: 0 }),
  binary: Type8.Optional(Type8.Boolean()),
  untracked: Type8.Optional(Type8.Boolean()),
  /** Per-file unified patch text; absent for binary or oversized files. */
  patch: Type8.Optional(Type8.String()),
  truncated: Type8.Optional(Type8.Boolean())
});
var SessionsDiffParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsDiffResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type8.Optional(NonEmptyString),
  branch: Type8.Optional(NonEmptyString),
  /** Display label of the diff base: the default branch name or "HEAD". */
  baseRef: Type8.Optional(NonEmptyString),
  files: Type8.Array(SessionDiffFileSchema),
  additions: Type8.Integer({ minimum: 0 }),
  deletions: Type8.Integer({ minimum: 0 }),
  truncated: Type8.Optional(Type8.Boolean()),
  unavailableReason: Type8.Optional(
    Type8.Union([Type8.Literal("unknown_session"), Type8.Literal("not_git")])
  )
});
var SessionsListParamsSchema = closedObject({
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
  limit: Type8.Optional(Type8.Integer({ minimum: 1 })),
  offset: Type8.Optional(Type8.Integer({ minimum: 0 })),
  activeMinutes: Type8.Optional(Type8.Integer({ minimum: 1 })),
  /** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
  requireLastInteraction: Type8.Optional(Type8.Boolean()),
  sortBy: Type8.Optional(Type8.Union([Type8.Literal("updatedAt"), Type8.Literal("lastInteractionAt")])),
  includeGlobal: Type8.Optional(Type8.Boolean()),
  includeUnknown: Type8.Optional(Type8.Boolean()),
  /** Limit agent-scoped rows to agents currently present in config. */
  configuredAgentsOnly: Type8.Optional(Type8.Boolean()),
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type8.Optional(Type8.Boolean()),
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type8.Optional(Type8.Boolean()),
  label: Type8.Optional(SessionLabelString),
  spawnedBy: Type8.Optional(NonEmptyString),
  agentId: Type8.Optional(NonEmptyString),
  search: Type8.Optional(Type8.String()),
  /** True lists archived sessions; false or omitted lists active sessions. */
  archived: Type8.Optional(Type8.Boolean())
});
var SessionsSearchParamsSchema = closedObject({
  agentId: Type8.Optional(NonEmptyString),
  sessionKeys: Type8.Optional(Type8.Array(NonEmptyString, { minItems: 1, maxItems: 200 })),
  query: Type8.String({ minLength: 1, maxLength: 4096 }),
  limit: Type8.Optional(Type8.Integer({ minimum: 1, maximum: 25 }))
});
var SessionsSearchHitSchema = closedObject({
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  messageId: NonEmptyString,
  role: Type8.Union([Type8.Literal("user"), Type8.Literal("assistant")]),
  timestamp: Type8.Integer({ minimum: 0 }),
  snippet: Type8.String(),
  score: Type8.Number()
});
var SessionsSearchResultSchema = closedObject({
  results: Type8.Array(SessionsSearchHitSchema),
  indexing: Type8.Optional(Type8.Boolean()),
  truncated: Type8.Optional(Type8.Boolean())
});
var SessionsCleanupParamsSchema = closedObject({
  agent: Type8.Optional(NonEmptyString),
  allAgents: Type8.Optional(Type8.Boolean()),
  enforce: Type8.Optional(Type8.Boolean()),
  activeKey: Type8.Optional(NonEmptyString),
  fixMissing: Type8.Optional(Type8.Boolean()),
  fixDmScope: Type8.Optional(Type8.Boolean())
});
var SessionsPreviewParamsSchema = closedObject({
  keys: Type8.Array(NonEmptyString, { minItems: 1 }),
  limit: Type8.Optional(Type8.Integer({ minimum: 1 })),
  maxChars: Type8.Optional(Type8.Integer({ minimum: 20 }))
});
var SessionsDescribeParamsSchema = closedObject({
  key: NonEmptyString,
  includeDerivedTitles: Type8.Optional(Type8.Boolean()),
  includeLastMessage: Type8.Optional(Type8.Boolean())
});
var SessionsResolveParamsSchema = closedObject({
  key: Type8.Optional(NonEmptyString),
  sessionId: Type8.Optional(NonEmptyString),
  label: Type8.Optional(SessionLabelString),
  agentId: Type8.Optional(NonEmptyString),
  spawnedBy: Type8.Optional(NonEmptyString),
  includeGlobal: Type8.Optional(Type8.Boolean()),
  includeUnknown: Type8.Optional(Type8.Boolean()),
  /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type8.Optional(Type8.Boolean())
});
var SessionWorktreeInfoSchema = closedObject({
  id: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString
});
var SessionsCreateResultSchema = Type8.Object(
  {
    ok: Type8.Literal(true),
    key: NonEmptyString,
    sessionId: Type8.Optional(NonEmptyString),
    entry: Type8.Optional(Type8.Record(Type8.String(), Type8.Unknown())),
    runStarted: Type8.Optional(Type8.Boolean()),
    runError: Type8.Optional(ErrorShapeSchema),
    worktree: Type8.Optional(SessionWorktreeInfoSchema)
  },
  { additionalProperties: true }
);
var SessionsSendParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  message: Type8.String(),
  thinking: Type8.Optional(Type8.String()),
  attachments: Type8.Optional(Type8.Array(Type8.Unknown())),
  timeoutMs: Type8.Optional(Type8.Integer({ minimum: 0 })),
  idempotencyKey: Type8.Optional(NonEmptyString)
});
var SessionsMessagesSubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  /** Opt in to sanitized durable approval events for this session and its descendants. */
  includeApprovals: Type8.Optional(Type8.Literal(true))
});
var SessionsMessagesUnsubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsAbortParamsSchema = closedObject({
  key: Type8.Optional(NonEmptyString),
  runId: Type8.Optional(NonEmptyString),
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsPatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  label: Type8.Optional(Type8.Union([SessionLabelString, Type8.Null()])),
  /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type8.Optional(Type8.Union([SessionLabelString, Type8.Null()])),
  icon: Type8.Optional(
    Type8.Union([NonEmptyString, Type8.Null()], {
      description: "Sidebar icon: one emoji, name:<id>, or svg:<svg ...>...</svg>."
    })
  ),
  statusNote: Type8.Optional(
    Type8.Union([Type8.String({ maxLength: 120 }), Type8.Null()], {
      description: "Short expiring sidebar status note; null clears it and any declared attention."
    })
  ),
  attention: Type8.Optional(
    Type8.Union([Type8.String({ enum: [...SESSION_AGENT_ATTENTION_ICON_IDS] }), Type8.Null()])
  ),
  ttlMinutes: Type8.Optional(Type8.Integer({ minimum: 1, maximum: 120 })),
  archived: Type8.Optional(Type8.Boolean()),
  pinned: Type8.Optional(Type8.Boolean()),
  unread: Type8.Optional(
    Type8.Boolean({ description: "Set true to mark unread; false records the session as read." })
  ),
  thinkingLevel: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  fastMode: Type8.Optional(Type8.Union([Type8.Boolean(), Type8.Literal("auto"), Type8.Null()])),
  verboseLevel: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  traceLevel: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  reasoningLevel: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  responseUsage: Type8.Optional(
    Type8.Union([
      Type8.Literal("off"),
      Type8.Literal("tokens"),
      Type8.Literal("full"),
      // Backward compat with older clients/stores.
      Type8.Literal("on"),
      Type8.Null()
    ])
  ),
  elevatedLevel: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  execHost: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  execSecurity: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  execAsk: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  execNode: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  model: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  spawnedBy: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  spawnedWorkspaceDir: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  spawnedCwd: Type8.Optional(Type8.Union([NonEmptyString, Type8.Null()])),
  spawnDepth: Type8.Optional(Type8.Union([Type8.Integer({ minimum: 0 }), Type8.Null()])),
  subagentRole: Type8.Optional(
    Type8.Union([Type8.Literal("orchestrator"), Type8.Literal("leaf"), Type8.Null()])
  ),
  subagentControlScope: Type8.Optional(
    Type8.Union([Type8.Literal("children"), Type8.Literal("none"), Type8.Null()])
  ),
  inheritedToolAllow: Type8.Optional(Type8.Union([Type8.Array(NonEmptyString), Type8.Null()])),
  inheritedToolDeny: Type8.Optional(Type8.Union([Type8.Array(NonEmptyString), Type8.Null()])),
  sendPolicy: Type8.Optional(Type8.Union([Type8.Literal("allow"), Type8.Literal("deny"), Type8.Null()])),
  groupActivation: Type8.Optional(
    Type8.Union([Type8.Literal("mention"), Type8.Literal("always"), Type8.Null()])
  )
});
var SessionsPluginPatchParamsSchema = closedObject({
  key: NonEmptyString,
  pluginId: NonEmptyString,
  namespace: NonEmptyString,
  value: Type8.Optional(PluginJsonValueSchema),
  unset: Type8.Optional(Type8.Boolean())
});
var SessionsPluginPatchResultSchema = closedObject({
  ok: Type8.Literal(true),
  key: NonEmptyString,
  value: Type8.Optional(PluginJsonValueSchema)
});
var SessionsResetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  reason: Type8.Optional(Type8.Union([Type8.Literal("new"), Type8.Literal("reset")]))
});
var SessionsDeleteParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  deleteTranscript: Type8.Optional(Type8.Boolean()),
  // Internal compare-and-delete guard for lifecycle-owned cleanup.
  expectedSessionId: Type8.Optional(NonEmptyString),
  expectedLifecycleRevision: Type8.Optional(NonEmptyString),
  expectedSessionUpdatedAt: Type8.Optional(Type8.Number({ minimum: 0 })),
  // Internal control: when false, still unbind thread bindings but skip hook emission.
  emitLifecycleHooks: Type8.Optional(Type8.Boolean()),
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type8.Optional(Type8.Boolean())
});
var SessionsGroupsListParamsSchema = closedObject({});
var SessionGroupSchema = closedObject({
  name: SessionLabelString,
  position: Type8.Integer({ minimum: 0 })
});
var SessionsGroupsListResultSchema = closedObject({
  groups: Type8.Array(SessionGroupSchema)
});
var SessionsGroupsPutParamsSchema = closedObject({
  names: Type8.Array(SessionLabelString, { maxItems: 200 })
});
var SessionsGroupsRenameParamsSchema = closedObject({
  name: SessionLabelString,
  to: SessionLabelString
});
var SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
var SessionsGroupsMutationResultSchema = closedObject({
  ok: Type8.Literal(true),
  groups: Type8.Array(SessionGroupSchema),
  updatedSessions: Type8.Optional(Type8.Integer({ minimum: 0 }))
});
var SessionsCompactParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  maxLines: Type8.Optional(Type8.Integer({ minimum: 1 }))
});
var SessionsCompactionListParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsCompactionGetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionBranchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsCompactionRestoreParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  checkpointId: NonEmptyString
});
var SessionsRewindParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsForkParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  entryId: NonEmptyString
});
var SessionsRewindResultSchema = closedObject({
  editorText: Type8.Optional(Type8.String())
});
var SessionsForkResultSchema = closedObject({
  sessionKey: NonEmptyString,
  editorText: Type8.Optional(Type8.String())
});
var SessionBranchSchema = closedObject({
  leafEntryId: NonEmptyString,
  headline: Type8.String(),
  messageCount: Type8.Integer({ minimum: 0 }),
  updatedAt: Type8.Optional(NonEmptyString),
  active: Type8.Boolean()
});
var SessionsBranchesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString)
});
var SessionsBranchesListResultSchema = closedObject({
  branches: Type8.Array(SessionBranchSchema)
});
var SessionsBranchesSwitchParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type8.Optional(NonEmptyString),
  leafEntryId: NonEmptyString
});
var SessionsBranchesSwitchResultSchema = closedObject({});
var SessionsCompactionListResultSchema = closedObject({
  ok: Type8.Literal(true),
  key: NonEmptyString,
  checkpoints: Type8.Array(SessionCompactionCheckpointSchema)
});
var SessionsCompactionGetResultSchema = closedObject({
  ok: Type8.Literal(true),
  key: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema
});
var SessionsCompactionBranchResultSchema = closedObject({
  ok: Type8.Literal(true),
  sourceKey: NonEmptyString,
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type8.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type8.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsCompactionRestoreResultSchema = closedObject({
  ok: Type8.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type8.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type8.Integer({ minimum: 0 })
    },
    { additionalProperties: true }
  )
});
var SessionsUsageParamsSchema = closedObject({
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
  key: Type8.Optional(NonEmptyString),
  /** Agent scope for list-style usage queries. */
  agentId: Type8.Optional(NonEmptyString),
  /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type8.Optional(Type8.Literal("all")),
  /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type8.Optional(Type8.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** End date for range filter (YYYY-MM-DD). */
  endDate: Type8.Optional(Type8.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type8.Optional(
    Type8.Union([Type8.Literal("utc"), Type8.Literal("gateway"), Type8.Literal("specific")])
  ),
  /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type8.Optional(
    Type8.Union([
      Type8.Literal("7d"),
      Type8.Literal("30d"),
      Type8.Literal("90d"),
      Type8.Literal("1y"),
      Type8.Literal("all")
    ])
  ),
  /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type8.Optional(Type8.Union([Type8.Literal("instance"), Type8.Literal("family")])),
  /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type8.Optional(
    Type8.Boolean({
      deprecated: true,
      description: "Deprecated alias for groupBy: family."
    })
  ),
  /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type8.Optional(
    Type8.String({
      pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
      deprecated: true,
      description: "Deprecated compatibility fallback; use timeZone."
    })
  ),
  /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
  timeZone: Type8.Optional(NonEmptyString),
  /** Maximum sessions to return (default 50). */
  limit: Type8.Optional(Type8.Integer({ minimum: 1 })),
  /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type8.Optional(Type8.Boolean())
});
export {
  SessionBranchSchema,
  SessionCompactionCheckpointSchema,
  SessionDiffFileSchema,
  SessionDiffFileStatusSchema,
  SessionFileBrowserEntrySchema,
  SessionFileBrowserResultSchema,
  SessionFileEntrySchema,
  SessionFileKindSchema,
  SessionFileRelevanceSchema,
  SessionGroupSchema,
  SessionOperationEventSchema,
  SessionWorktreeInfoSchema,
  SessionsAbortParamsSchema,
  SessionsBranchesListParamsSchema,
  SessionsBranchesListResultSchema,
  SessionsBranchesSwitchParamsSchema,
  SessionsBranchesSwitchResultSchema,
  SessionsCleanupParamsSchema,
  SessionsCompactParamsSchema,
  SessionsCompactionBranchParamsSchema,
  SessionsCompactionBranchResultSchema,
  SessionsCompactionGetParamsSchema,
  SessionsCompactionGetResultSchema,
  SessionsCompactionListParamsSchema,
  SessionsCompactionListResultSchema,
  SessionsCompactionRestoreParamsSchema,
  SessionsCompactionRestoreResultSchema,
  SessionsCreateParamsSchema,
  SessionsCreateResultSchema,
  SessionsDeleteParamsSchema,
  SessionsDescribeParamsSchema,
  SessionsDiffParamsSchema,
  SessionsDiffResultSchema,
  SessionsFilesGetParamsSchema,
  SessionsFilesGetResultSchema,
  SessionsFilesListParamsSchema,
  SessionsFilesListResultSchema,
  SessionsFilesRevealParamsSchema,
  SessionsFilesRevealResultSchema,
  SessionsFilesSetParamsSchema,
  SessionsFilesSetResultSchema,
  SessionsForkParamsSchema,
  SessionsForkResultSchema,
  SessionsGroupsDeleteParamsSchema,
  SessionsGroupsListParamsSchema,
  SessionsGroupsListResultSchema,
  SessionsGroupsMutationResultSchema,
  SessionsGroupsPutParamsSchema,
  SessionsGroupsRenameParamsSchema,
  SessionsListParamsSchema,
  SessionsMessagesSubscribeParamsSchema,
  SessionsMessagesUnsubscribeParamsSchema,
  SessionsPatchParamsSchema,
  SessionsPluginPatchParamsSchema,
  SessionsPluginPatchResultSchema,
  SessionsPreviewParamsSchema,
  SessionsResetParamsSchema,
  SessionsResolveParamsSchema,
  SessionsRewindParamsSchema,
  SessionsRewindResultSchema,
  SessionsSearchHitSchema,
  SessionsSearchParamsSchema,
  SessionsSearchResultSchema,
  SessionsSendParamsSchema,
  SessionsUsageParamsSchema
};
