import { i as OpenClawConfig, qt as TelegramAccountConfig$1 } from "./types.openclaw-DAPZkTyD.js";
import { v as GroupPolicy } from "./types.base-DucQBSmL.js";
import { r as ReplyPayload } from "./reply-payload-Cz6pe8eB.js";
import { l as ExecApprovalRequest } from "./exec-approvals-DnrYCu2s.js";
import { h as ChannelMessageActionAdapter } from "./types.core-Di2R8WTy.js";
import { n as MonitorTelegramOpts } from "./runtime-DYokv61c.js";
//#region extensions/telegram/src/bot-access.d.ts
type NormalizedAllowFrom = {
  entries: string[];
  hasWildcard: boolean;
  hasEntries: boolean;
  invalidEntries: string[];
};
//#endregion
//#region extensions/telegram/src/group-access.d.ts
declare const resolveTelegramRuntimeGroupPolicy: (params: {
  providerConfigPresent: boolean;
  groupPolicy?: TelegramAccountConfig$1["groupPolicy"];
  defaultGroupPolicy?: TelegramAccountConfig$1["groupPolicy"];
}) => {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
//#endregion
//#region extensions/telegram/src/exec-approval-forwarding.d.ts
declare function shouldSuppressTelegramExecApprovalForwardingFallback(params: {
  cfg: OpenClawConfig;
  target: {
    channel: string;
    accountId?: string | null;
  };
  request: ExecApprovalRequest;
}): boolean;
declare function buildTelegramExecApprovalPendingPayload(params: {
  request: ExecApprovalRequest;
  nowMs: number;
}): ReplyPayload;
//#endregion
//#region extensions/telegram/src/channel-actions.d.ts
declare const telegramMessageActions: ChannelMessageActionAdapter;
//#endregion
//#region extensions/telegram/src/monitor.d.ts
declare function monitorTelegramProvider(opts?: MonitorTelegramOpts): Promise<void>;
//#endregion
//#region extensions/telegram/src/poll-visibility.d.ts
declare function resolveTelegramPollVisibility(params: {
  pollAnonymous?: boolean;
  pollPublic?: boolean;
}): boolean | undefined;
//#endregion
//#region extensions/telegram/runtime-api.d.ts
type TelegramAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["telegram"]>;
type TelegramActionConfig = NonNullable<TelegramAccountConfig["actions"]>;
type TelegramNetworkConfig = NonNullable<TelegramAccountConfig["network"]>;
//#endregion
export { monitorTelegramProvider as a, shouldSuppressTelegramExecApprovalForwardingFallback as c, resolveTelegramPollVisibility as i, resolveTelegramRuntimeGroupPolicy as l, TelegramActionConfig as n, telegramMessageActions as o, TelegramNetworkConfig as r, buildTelegramExecApprovalPendingPayload as s, TelegramAccountConfig as t, NormalizedAllowFrom as u };