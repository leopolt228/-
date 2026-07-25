// packages/gateway-protocol/src/schema/since.ts
function withSince(train, schema) {
  Object.assign(schema, { "x-openclaw-since": train });
  return schema;
}
export {
  withSince
};
