import { t as buildMutableAllowEntryDetector } from "./channel-policy-DtbLL_f5.js";
//#region extensions/discord/src/security-doctor.ts
const isDiscordMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:\d+|<@!?\d+>|(?:discord|user|pk):.+)$/ });
//#endregion
export { isDiscordMutableAllowEntry as t };
