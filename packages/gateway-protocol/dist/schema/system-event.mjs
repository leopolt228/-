// packages/gateway-protocol/src/schema/system-event.ts
import { Type as Type2 } from "typebox";

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

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/system-event.ts
var SystemEventParamsSchema = closedObject({
  text: Type2.String(),
  idempotencyKey: Type2.Optional(Type2.String({ minLength: 1 })),
  sessionKey: Type2.Optional(Type2.String()),
  wake: Type2.Optional(Type2.Boolean()),
  deviceId: Type2.Optional(Type2.String()),
  instanceId: Type2.Optional(Type2.String()),
  host: Type2.Optional(Type2.String()),
  ip: Type2.Optional(Type2.String()),
  mode: Type2.Optional(Type2.String()),
  version: Type2.Optional(Type2.String()),
  platform: Type2.Optional(Type2.String()),
  deviceFamily: Type2.Optional(Type2.String()),
  modelIdentifier: Type2.Optional(Type2.String()),
  lastInputSeconds: Type2.Optional(Type2.Number()),
  reason: Type2.Optional(Type2.String()),
  roles: Type2.Optional(Type2.Array(Type2.String())),
  scopes: Type2.Optional(Type2.Array(Type2.String())),
  tags: Type2.Optional(Type2.Array(Type2.String()))
});
var validateSystemEventParams = lazyCompile(SystemEventParamsSchema);
export {
  validateSystemEventParams
};
