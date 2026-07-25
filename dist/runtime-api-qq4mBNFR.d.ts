import { Kn as PluginRuntime } from "./types-Bi5Leigi.js";
//#region extensions/msteams/src/runtime.d.ts
declare const setMSTeamsRuntime: (next: PluginRuntime) => void, getMSTeamsRuntime: () => PluginRuntime, getOptionalMSTeamsRuntime: () => PluginRuntime | null;
//#endregion
export { setMSTeamsRuntime as t };