// packages/normalization-core/src/json-coercion.ts
function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return void 0;
  }
}
export {
  safeParseJson
};
