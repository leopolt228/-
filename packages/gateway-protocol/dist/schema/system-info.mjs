// packages/gateway-protocol/src/schema/system-info.ts
import { Type as Type2 } from "typebox";

// packages/gateway-protocol/src/schema/closed-object.ts
import { Type } from "typebox";
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}

// packages/gateway-protocol/src/schema/system-info.ts
var SystemInfoParamsSchema = closedObject({});
var SystemInfoResultSchema = closedObject({
  machineName: Type2.String(),
  hostname: Type2.String(),
  platform: Type2.String(),
  release: Type2.String(),
  arch: Type2.String(),
  osLabel: Type2.String(),
  lanAddress: Type2.Optional(Type2.String()),
  port: Type2.Optional(Type2.Integer()),
  nodeVersion: Type2.String(),
  pid: Type2.Integer(),
  /** Process-start identity for invalidating work that cannot survive a Gateway restart. */
  processInstanceId: Type2.Optional(Type2.String({ minLength: 1 })),
  uptimeMs: Type2.Integer(),
  cpuCount: Type2.Integer(),
  cpuModel: Type2.Optional(Type2.String()),
  loadAverage: Type2.Optional(Type2.Tuple([Type2.Number(), Type2.Number(), Type2.Number()])),
  memoryTotalBytes: Type2.Integer(),
  memoryFreeBytes: Type2.Integer(),
  diskTotalBytes: Type2.Optional(Type2.Integer()),
  diskAvailableBytes: Type2.Optional(Type2.Integer()),
  diskPath: Type2.Optional(Type2.String())
});
export {
  SystemInfoParamsSchema,
  SystemInfoResultSchema
};
