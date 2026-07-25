import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { r as ReplyPayload } from "./reply-payload-Cz6pe8eB.js";
import { n as GetReplyOptions } from "./types-BBQnzy9U.js";
import { i as MsgContext } from "./templating-CzGprbNA.js";

//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: MsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
export { getReplyFromConfig as t };