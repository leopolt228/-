import { r as GroupKeyResolution } from "./types-D43pE80v.js";
import { i as MsgContext } from "./templating-CzGprbNA.js";
import { t as InboundLastRouteUpdate } from "./session.types-L1yuQd4o.js";

//#region src/channels/session.d.ts
declare function recordInboundSession(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}): Promise<void>;
//#endregion
export { recordInboundSession as t };