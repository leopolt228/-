import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { d as AgentToolResult } from "./types-Dedz4oTJ.js";
import { g as ChannelMessageActionContext } from "./types.core-Di2R8WTy.js";
//#region extensions/discord/src/actions/runtime.d.ts
type ConversationReadInvocationOrigin = NonNullable<ChannelMessageActionContext["conversationReadOrigin"]>;
declare function handleDiscordAction(params: Record<string, unknown>, cfg: OpenClawConfig, options?: {
  mediaAccess?: {
    localRoots?: readonly string[];
    readFile?: (filePath: string) => Promise<Buffer>;
    workspaceDir?: string;
  };
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  conversationReadOrigin?: ConversationReadInvocationOrigin;
  readContext?: {
    requesterAccountId?: string | null;
    currentChannelProvider?: string | null;
    currentChannelId?: string | null;
  };
}): Promise<AgentToolResult<unknown>>;
//#endregion
export { handleDiscordAction as t };