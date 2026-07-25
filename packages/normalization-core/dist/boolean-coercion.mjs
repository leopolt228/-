// packages/normalization-core/src/boolean-coercion.ts
function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  return void 0;
}
export {
  parseBoolean
};
