// packages/media-core/src/file-name.ts
import path from "node:path";
function basenameFromAnyPath(value) {
  return path.win32.basename(path.posix.basename(value));
}
function extnameFromAnyPath(value) {
  return path.extname(basenameFromAnyPath(value));
}
function nameFromAnyPath(value) {
  const base = basenameFromAnyPath(value);
  const ext = path.extname(base);
  return path.basename(base, ext);
}
export {
  basenameFromAnyPath,
  extnameFromAnyPath,
  nameFromAnyPath
};
