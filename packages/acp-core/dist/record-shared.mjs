// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function asOptionalRecord(value) {
  return isRecord(value) ? value : void 0;
}
export {
  asOptionalRecord as asRecord
};
