import { r as matrixSetupAdapter, t as matrixOnboardingAdapter } from "../../setup-surface-C9MDZ7if.js";

//#region extensions/matrix/src/setup-contract.d.ts
declare const singleAccountKeysToMove: ("replyToMode" | "deviceId" | "dm" | "textChunkLimit" | "streaming" | "responsePrefix" | "mediaMaxMb" | "groups" | "actions" | "threadBindings" | "reactionNotifications" | "ackReaction" | "dangerouslyAllowNameMatching" | "allowBots" | "autoJoin" | "ackReactionScope" | "avatarUrl" | "initialSyncLimit" | "encryption" | "allowlistOnly" | "threadReplies" | "startupVerification" | "startupVerificationCooldownHours" | "autoJoinAllowlist" | "rooms")[];
declare const namedAccountPromotionKeys: ("password" | "name" | "deviceId" | "avatarUrl" | "initialSyncLimit" | "encryption" | "homeserver" | "userId" | "accessToken" | "deviceName")[];
declare function resolveSingleAccountPromotionTarget(params: {
  channel: Record<string, unknown>;
}): string;
//#endregion
export { matrixSetupAdapter, matrixOnboardingAdapter as matrixSetupWizard, namedAccountPromotionKeys, resolveSingleAccountPromotionTarget, singleAccountKeysToMove };