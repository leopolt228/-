import { At as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-Bj-pdgAt.js";
//#region extensions/github-copilot/provider-policy-api.d.ts
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): {
  levels: ({
    id: "max" | "xhigh";
  } | {
    id: "off";
  } | {
    id: "minimal";
  } | {
    id: "low";
  } | {
    id: "medium";
  } | {
    id: "high";
  })[];
} | null;
//#endregion
export { resolveThinkingProfile };