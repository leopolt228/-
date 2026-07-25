import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { C as MarkdownTableMode } from "./types.base-DucQBSmL.js";
import { t as OutboundMediaAccess } from "./load-options-63mp15In.js";
import { c as ChunkMode } from "./outbound.types-DHcAgJ0o.js";
import { i as DiscordReplyReference, t as DiscordAllowedMentions } from "./send.shared-B9tglP0k.js";
import { C as RequestClient, v as DiscordSendResult } from "./send.types-BrHT45LA.js";
import { d as DiscordComponentBuildResult, h as DiscordComponentMessageSpec } from "./components-Dnd6Kpc5.js";
//#region extensions/discord/src/send.components.d.ts
type DiscordComponentSendOpts = {
  cfg: OpenClawConfig;
  accountId?: string;
  token?: string;
  rest?: RequestClient;
  silent?: boolean;
  reply?: DiscordReplyReference;
  sessionKey?: string;
  agentId?: string;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  suppressEmbeds?: boolean;
  allowedMentions?: DiscordAllowedMentions; /** Persist the concrete platform send before component bookkeeping can fail. */
  onDeliveryResult?: (result: DiscordSendResult) => Promise<void> | void;
};
declare function registerBuiltDiscordComponentMessage(params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
  ttlMs?: number;
}): void;
declare function sendDiscordComponentMessage(to: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
declare function editDiscordComponentMessage(to: string, messageId: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
//#endregion
export { registerBuiltDiscordComponentMessage as n, sendDiscordComponentMessage as r, editDiscordComponentMessage as t };