// packages/gateway-protocol/src/schema/snapshot.ts
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

// packages/gateway-protocol/src/schema/snapshot.ts
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
export {
  PresenceEntrySchema,
  SnapshotSchema,
  StateVersionSchema
};
