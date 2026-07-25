// packages/media-core/src/content-length.ts
function parseMediaContentLength(raw) {
  if (raw === null) {
    return null;
  }
  const values = raw.split(",").map((value2) => value2.replace(/^[\t ]+|[\t ]+$/g, ""));
  const value = values[0] ?? "";
  if (!/^\d+$/.test(value) || values.some((candidate) => candidate !== value)) {
    throw new Error(`invalid content-length header: ${raw}`);
  }
  const size = Number(value);
  if (!Number.isSafeInteger(size)) {
    throw new Error(`invalid content-length header: ${raw}`);
  }
  return size;
}
export {
  parseMediaContentLength
};
