// packages/gateway-client/src/websocket-data.ts
import { Buffer } from "node:buffer";
function rawDataToString(data) {
  if (Array.isArray(data)) {
    return Buffer.concat(data).toString("utf8");
  }
  return data instanceof ArrayBuffer ? Buffer.from(data).toString("utf8") : data.toString("utf8");
}
export {
  rawDataToString
};
