import { E as ReplyToMode } from "./types.base-DucQBSmL.js";
import { i as ReplyThreadingPolicy } from "./types-BBQnzy9U.js";
//#region src/auto-reply/reply/reply-threading.d.ts
/** Build threading policy for batched reply-to mode. */
declare function resolveBatchedReplyThreadingPolicy(mode: ReplyToMode, isBatched: boolean): ReplyThreadingPolicy | undefined;
//#endregion
export { resolveBatchedReplyThreadingPolicy as t };