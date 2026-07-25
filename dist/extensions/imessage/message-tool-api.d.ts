import { h as ChannelMessageActionAdapter } from "../../types.core-Di2R8WTy.js";
import { Type } from "typebox";

//#region extensions/imessage/src/message-tool-api.d.ts
declare function describeIMessageMessageTool({
  cfg,
  accountId,
  currentChannelId
}: Parameters<NonNullable<ChannelMessageActionAdapter["describeMessageTool"]>>[0]): {
  schema?: {
    properties: {
      pollOptionText: Type.TOptional<Type.TString>;
    };
    actions: "poll-vote"[];
    visibility: "all-configured";
  } | undefined;
  actions: ("permissions" | "timeout" | "search" | "reply" | "edit" | "read" | "poll" | "reactions" | "sticker" | "unsend" | "sendWithEffect" | "renameGroup" | "setGroupIcon" | "addParticipant" | "removeParticipant" | "leaveGroup" | "sendAttachment" | "broadcast" | "send" | "poll-vote" | "react" | "delete" | "pin" | "unpin" | "list-pins" | "thread-create" | "thread-list" | "thread-reply" | "sticker-search" | "member-info" | "role-info" | "emoji-list" | "emoji-upload" | "sticker-upload" | "role-add" | "role-remove" | "channel-info" | "channel-list" | "channel-create" | "channel-edit" | "channel-delete" | "channel-move" | "category-create" | "category-edit" | "category-delete" | "topic-create" | "topic-edit" | "voice-status" | "event-list" | "event-create" | "kick" | "ban" | "set-profile" | "set-presence" | "download-file" | "upload-file")[];
} | null;
//#endregion
export { describeIMessageMessageTool as describeMessageTool };