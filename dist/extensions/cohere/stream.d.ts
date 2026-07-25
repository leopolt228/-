import { dn as ProviderWrapStreamFnContext } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/cohere/stream.d.ts
declare function createCohereCompletionsWrapper(baseStreamFn: ProviderWrapStreamFnContext["streamFn"]): ProviderWrapStreamFnContext["streamFn"];
//#endregion
export { createCohereCompletionsWrapper };