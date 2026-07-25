import { n as zalouserSetupAdapter } from "./setup-core-B5t44UwN.js";
import { t as createZalouserPluginBase } from "./shared-BpLPNaMa.js";
import { t as zalouserSetupWizard } from "./setup-surface-zK0X2n9q.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setup: zalouserSetupAdapter
}) };
//#endregion
export { zalouserSetupPlugin as t };
