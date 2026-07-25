// packages/normalization-core/src/result.ts
function ok(value) {
  return { ok: true, value };
}
function err(error) {
  return { ok: false, error };
}
export {
  err,
  ok
};
