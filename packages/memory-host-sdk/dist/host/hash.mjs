// packages/memory-host-sdk/src/host/hash.ts
import crypto from "node:crypto";
function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
export {
  hashText
};
