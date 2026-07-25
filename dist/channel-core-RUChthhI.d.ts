import { r as ChannelConfigUiHint } from "./types.config-D1pSqbn8.js";
import { o as createChannelPluginBase$1 } from "./core-BpLT9wB2.js";

//#region src/plugin-sdk/channel-config-ui-hints.d.ts
type HintMap = Record<string, ChannelConfigUiHint>;
declare function createChannelConfigUiHints(params: {
  channelLabel: string;
  dmPolicy?: {
    channelKey: string;
    includeLegacyNestedPolicy?: boolean;
    legacyNestedPolicyOrder?: "before" | "after";
  };
  configWrites?: boolean;
  mentionPatterns?: {
    targetDescription: string;
    policyTargetDescription?: string;
    policyNote?: string;
    denyNote?: string;
  };
  nativeCommands?: boolean;
  implicitMentions?: boolean;
  progress?: {
    includeCommentary?: boolean;
    commentaryOrder?: "before-command" | "after-command";
  };
  retry?: boolean;
}): HintMap;
//#endregion
//#region src/plugin-sdk/channel-core.d.ts
/** Creates a channel plugin base while keeping the public import on this SDK subpath. */
declare const createChannelPluginBase: typeof createChannelPluginBase$1;
//#endregion
export { createChannelConfigUiHints as n, createChannelPluginBase as t };