import { Q as ZodOptional, Z as ZodObject, c as ZodBoolean, ta as $strict } from "./schemas-CL7kuExa.js";
//#region src/config/zod-schema.implicit-mentions.d.ts
declare const ChannelImplicitMentionsSchema: ZodObject<{
  replyToBot: ZodOptional<ZodBoolean>;
  quotedBot: ZodOptional<ZodBoolean>;
  threadParticipation: ZodOptional<ZodBoolean>;
}, $strict>;
//#endregion
export { ChannelImplicitMentionsSchema as t };