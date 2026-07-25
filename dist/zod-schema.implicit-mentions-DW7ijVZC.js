import { At as boolean, Tn as object } from "./schemas-CBJjibl3.js";
//#region src/config/zod-schema.implicit-mentions.ts
const ChannelImplicitMentionsSchema = object({
	replyToBot: boolean().optional(),
	quotedBot: boolean().optional(),
	threadParticipation: boolean().optional()
}).strict();
//#endregion
export { ChannelImplicitMentionsSchema as t };
