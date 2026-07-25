import { is as OpenClawPluginToolContext } from "./types-Bi5Leigi.js";
import { n as ChannelSetupWizard } from "./setup-wizard-types-D7rWDJqA.js";
import { k as ChannelSetupAdapter } from "./types.adapters-Dx2pYKAA.js";
import { a as AnyAgentTool } from "./plugin-entry-Bj-pdgAt.js";
//#region extensions/zalouser/src/tool.d.ts
type ZalouserToolContext = Pick<OpenClawPluginToolContext, "deliveryContext">;
declare function createZalouserTool(context?: ZalouserToolContext): AnyAgentTool;
//#endregion
//#region extensions/zalouser/src/setup-core.d.ts
declare const zalouserSetupAdapter: ChannelSetupAdapter;
declare function createZalouserSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
//#endregion
//#region extensions/zalouser/src/setup-surface.d.ts
declare const zalouserSetupWizard: ChannelSetupWizard;
//#endregion
export { createZalouserTool as i, createZalouserSetupWizardProxy as n, zalouserSetupAdapter as r, zalouserSetupWizard as t };