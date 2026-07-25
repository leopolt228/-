import { i as OpenClawConfig } from "./types.openclaw-DAPZkTyD.js";
import { t as BaseProbeResult } from "./types.core-Di2R8WTy.js";
import { S as MessageReceipt } from "./types-Dx3rJUBE.js";
import { r as tryReadSecretFileSync } from "./secret-file-Dzca8kyz.js";
//#region extensions/line/src/types.d.ts
type LineTokenSource = "config" | "env" | "file" | "none";
type LineCredentialStatus = "available" | "configured_unavailable" | "missing";
type LineCredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
interface LineThreadBindingsConfig {
  enabled?: boolean;
  idleHours?: number;
  maxAgeHours?: number;
  spawnSessions?: boolean;
  defaultSpawnContext?: "isolated" | "fork";
}
interface LineAccountBaseConfig {
  enabled?: boolean;
  channelAccessToken?: string;
  channelSecret?: string;
  tokenFile?: string;
  secretFile?: string;
  name?: string;
  allowFrom?: Array<string | number>;
  groupAllowFrom?: Array<string | number>;
  dmPolicy?: "open" | "allowlist" | "pairing" | "disabled";
  groupPolicy?: "open" | "allowlist" | "disabled";
  responsePrefix?: string;
  mediaMaxMb?: number;
  webhookPath?: string;
  threadBindings?: LineThreadBindingsConfig;
  groups?: Record<string, LineGroupConfig>;
}
interface LineConfig extends LineAccountBaseConfig {
  accounts?: Record<string, LineAccountConfig>;
  defaultAccount?: string;
}
interface LineAccountConfig extends LineAccountBaseConfig {}
interface LineGroupConfig {
  enabled?: boolean;
  allowFrom?: Array<string | number>;
  requireMention?: boolean;
  systemPrompt?: string;
  skills?: string[];
}
interface ResolvedLineAccount {
  accountId: string;
  name?: string;
  enabled: boolean;
  channelAccessToken: string;
  channelSecret: string;
  tokenSource: LineTokenSource;
  signingSecretSource?: LineTokenSource;
  tokenStatus?: LineCredentialStatus;
  signingSecretStatus?: LineCredentialStatus;
  credentialDiagnostics?: LineCredentialUnavailableDiagnostic[];
  config: LineConfig & LineAccountConfig;
}
interface LineSendResult {
  messageId: string;
  chatId: string;
  receipt: MessageReceipt;
}
type LineProbeResult = BaseProbeResult<string> & {
  bot?: {
    displayName?: string;
    userId?: string;
    basicId?: string;
    pictureUrl?: string;
  };
};
type LineFlexMessagePayload = {
  altText: string;
  contents: unknown;
};
type LineTemplateMessagePayload = {
  type: "confirm";
  text: string;
  confirmLabel: string;
  confirmData: string;
  cancelLabel: string;
  cancelData: string;
  altText?: string;
} | {
  type: "buttons";
  title?: string;
  text: string;
  actions: Array<{
    type: "message" | "uri" | "postback";
    label: string;
    data?: string;
    uri?: string;
  }>;
  thumbnailImageUrl?: string;
  altText?: string;
} | {
  type: "carousel";
  columns: Array<{
    title?: string;
    text: string;
    thumbnailImageUrl?: string;
    actions: Array<{
      type: "message" | "uri" | "postback";
      label: string;
      data?: string;
      uri?: string;
    }>;
  }>;
  altText?: string;
};
type LineChannelData = {
  quickReplies?: string[];
  mediaKind?: "image" | "video" | "audio";
  previewImageUrl?: string;
  durationMs?: number;
  trackingId?: string;
  location?: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  flexMessage?: LineFlexMessagePayload;
  templateMessage?: LineTemplateMessagePayload;
};
//#endregion
//#region extensions/line/src/accounts.d.ts
declare function resolveLineAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedLineAccount;
declare function listLineAccountIds(cfg: OpenClawConfig): string[];
declare function resolveDefaultLineAccountId(cfg: OpenClawConfig): string;
declare function normalizeAccountId(accountId: string | undefined): string;
//#endregion
export { LineChannelData as a, LineProbeResult as c, ResolvedLineAccount as d, resolveLineAccount as i, LineSendResult as l, normalizeAccountId as n, LineConfig as o, resolveDefaultLineAccountId as r, LineGroupConfig as s, listLineAccountIds as t, LineTemplateMessagePayload as u };