import { r as ProviderThinkingProfile } from "../../provider-thinking.types-DhIiOz1Q.js";
import { At as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/opencode/provider-policy-api.d.ts
declare function resolveThinkingProfile(params: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | {
  readonly levels: [{
    readonly id: "off";
  }, {
    readonly id: "low";
  }, {
    readonly id: "medium";
  }, {
    readonly id: "high";
  }, {
    readonly id: "xhigh";
  }, {
    readonly id: "max";
  }];
  readonly defaultLevel: "medium";
};
//#endregion
export { resolveThinkingProfile };