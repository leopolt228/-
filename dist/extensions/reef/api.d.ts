import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { S as MessageReceipt, f as ChannelMessageSendTextContext } from "../../types-Dx3rJUBE.js";
import { n as ChannelOutboundAdapter } from "../../outbound.types-DHcAgJ0o.js";
import { a as ReefIngressMessage, c as RelayFriend, i as ReefDependencies, n as ReefAccount, o as ReefKeys, t as InboxEntry } from "../../types-CFVozuYA.js";
import { a as ReefInboxConnection, i as ReefFriendManager, n as createConfiguredGuard, o as ReefTransportClient, s as WebSocketLike, t as ReefMessageFlow } from "../../flow-BwtPgHJy.js";
import { t as reefPlugin } from "../../channel-BDoazTkp.js";
//#region extensions/reef/src/outbound.d.ts
declare const reefOutboundAdapter: ChannelOutboundAdapter;
declare const reefMessageAdapter: {
  readonly id: "reef";
  readonly durableFinal: {
    readonly capabilities: {
      readonly text: true;
      readonly replyTo: true;
      readonly thread: true;
    };
  };
  readonly send: {
    readonly text: (ctx: ChannelMessageSendTextContext<OpenClawConfig>) => Promise<{
      receipt: MessageReceipt;
      messageId: string;
    }>;
  };
  readonly receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
} & {
  receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
};
//#endregion
export { type InboxEntry, type ReefAccount, type ReefDependencies, ReefFriendManager, ReefInboxConnection, type ReefIngressMessage, type ReefKeys, ReefMessageFlow, ReefTransportClient, type RelayFriend, type WebSocketLike, createConfiguredGuard, reefMessageAdapter, reefOutboundAdapter, reefPlugin };