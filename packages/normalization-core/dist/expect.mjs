// packages/normalization-core/src/expect.ts
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}
function first(values) {
  return values.at(0);
}
function last(values) {
  return values.at(-1);
}
export {
  expectDefined,
  first,
  last
};
