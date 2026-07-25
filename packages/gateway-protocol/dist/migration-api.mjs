// packages/gateway-protocol/src/protocol-validator.ts
import { Compile } from "typebox/compile";
// @__NO_SIDE_EFFECTS__
function lazyCompile(schema, precheck) {
  let compiled;
  let errors = null;
  const getCompiled = () => {
    compiled ??= Compile(schema);
    return compiled;
  };
  const validate = ((data) => {
    const precheckError = precheck?.(data);
    if (precheckError) {
      errors = [precheckError];
      return false;
    }
    const current = getCompiled();
    const valid = current.Check(data);
    errors = valid ? null : [...current.Errors(data)];
    return valid;
  });
  Object.defineProperties(validate, {
    errors: {
      configurable: true,
      enumerable: true,
      get: () => errors,
      set: (nextErrors) => {
        errors = nextErrors ?? null;
      }
    },
    schema: {
      configurable: true,
      enumerable: true,
      get: () => schema
    }
  });
  return validate;
}

// packages/gateway-protocol/src/schema/migrations.ts
import { Type as Type3 } from "typebox";

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

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

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

// packages/gateway-protocol/src/schema/migrations.ts
var MAX_MEMORY_MIGRATION_ITEMS = 2e3;
var MemoryMigrationPlanFingerprintSchema = Type3.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
});
var MemoryMigrationItemStatusSchema = Type3.Union([
  Type3.Literal("planned"),
  Type3.Literal("migrated"),
  Type3.Literal("skipped"),
  Type3.Literal("warning"),
  Type3.Literal("conflict"),
  Type3.Literal("error")
]);
var MemoryMigrationItemSchema = Type3.Object(
  {
    id: NonEmptyString,
    status: MemoryMigrationItemStatusSchema,
    source: Type3.Optional(NonEmptyString),
    target: Type3.Optional(NonEmptyString),
    message: Type3.Optional(Type3.String()),
    reason: Type3.Optional(Type3.String()),
    details: Type3.Optional(Type3.Record(Type3.String(), Type3.Unknown()))
  },
  { additionalProperties: false }
);
var MemoryMigrationSummarySchema = Type3.Object(
  {
    total: Type3.Integer({ minimum: 0 }),
    planned: Type3.Integer({ minimum: 0 }),
    migrated: Type3.Integer({ minimum: 0 }),
    skipped: Type3.Integer({ minimum: 0 }),
    conflicts: Type3.Integer({ minimum: 0 }),
    errors: Type3.Integer({ minimum: 0 }),
    sensitive: Type3.Integer({ minimum: 0 })
  },
  { additionalProperties: false }
);
var MemoryMigrationProviderPlanSchema = Type3.Object(
  {
    providerId: NonEmptyString,
    label: NonEmptyString,
    description: Type3.Optional(Type3.String()),
    planFingerprint: Type3.Optional(MemoryMigrationPlanFingerprintSchema),
    found: Type3.Boolean(),
    source: Type3.Optional(NonEmptyString),
    target: Type3.Optional(NonEmptyString),
    confidence: Type3.Optional(
      Type3.Union([Type3.Literal("low"), Type3.Literal("medium"), Type3.Literal("high")])
    ),
    message: Type3.Optional(Type3.String()),
    error: Type3.Optional(Type3.String()),
    summary: MemoryMigrationSummarySchema,
    items: Type3.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type3.Optional(Type3.Array(Type3.String()))
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanParamsSchema = Type3.Object(
  {
    agentId: NonEmptyString,
    overwrite: Type3.Optional(Type3.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryPlanResultSchema = Type3.Object(
  {
    agentId: NonEmptyString,
    workspace: NonEmptyString,
    providers: Type3.Array(MemoryMigrationProviderPlanSchema)
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyParamsSchema = Type3.Object(
  {
    idempotencyKey: NonEmptyString,
    agentId: NonEmptyString,
    providerId: NonEmptyString,
    planFingerprint: MemoryMigrationPlanFingerprintSchema,
    itemIds: Type3.Array(NonEmptyString, {
      minItems: 1,
      uniqueItems: true,
      maxItems: MAX_MEMORY_MIGRATION_ITEMS
    }),
    overwrite: Type3.Optional(Type3.Boolean())
  },
  { additionalProperties: false }
);
var MigrationsMemoryApplyResultSchema = Type3.Object(
  {
    providerId: NonEmptyString,
    source: NonEmptyString,
    target: Type3.Optional(NonEmptyString),
    summary: MemoryMigrationSummarySchema,
    items: Type3.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type3.Optional(Type3.Array(Type3.String())),
    backupPath: Type3.Optional(NonEmptyString),
    reportDir: Type3.Optional(NonEmptyString)
  },
  { additionalProperties: false }
);
var MigrationProtocolSchemas = {
  MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
  MemoryMigrationItem: MemoryMigrationItemSchema,
  MemoryMigrationSummary: MemoryMigrationSummarySchema,
  MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
  MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
  MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
  MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryApplyResult: MigrationsMemoryApplyResultSchema
};

// packages/gateway-protocol/src/migration-api.ts
var validateMigrationsMemoryPlanParams = lazyCompile(MigrationsMemoryPlanParamsSchema);
var validateMigrationsMemoryApplyParams = lazyCompile(MigrationsMemoryApplyParamsSchema);
export {
  MAX_MEMORY_MIGRATION_ITEMS,
  MigrationProtocolSchemas,
  MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryPlanParamsSchema,
  validateMigrationsMemoryApplyParams,
  validateMigrationsMemoryPlanParams
};
