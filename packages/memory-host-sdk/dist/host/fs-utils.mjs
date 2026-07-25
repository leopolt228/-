// packages/memory-host-sdk/src/host/fs-utils.ts
import { configureFsSafePython } from "@openclaw/fs-safe/config";
import { root } from "@openclaw/fs-safe/root";
import { isPathInside, isPathInsideWithRealpath } from "@openclaw/fs-safe/path";
import {
  assertNoSymlinkParents,
  readRegularFile,
  statRegularFile
} from "@openclaw/fs-safe/advanced";
import { walkDirectory } from "@openclaw/fs-safe/walk";
var hasPythonModeOverride = process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;
if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
}
function isFileMissingError(err) {
  return Boolean(
    err && typeof err === "object" && "code" in err && (err.code === "ENOENT" || err.code === "ENOTDIR" || err.code === "not-found")
  );
}
export {
  assertNoSymlinkParents,
  isFileMissingError,
  isPathInside,
  isPathInsideWithRealpath,
  readRegularFile,
  root,
  statRegularFile,
  walkDirectory
};
