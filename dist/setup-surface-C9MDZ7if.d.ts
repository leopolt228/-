import { r as ChannelSetupWizardAdapter } from "./setup-wizard-types-D7rWDJqA.js";
import { k as ChannelSetupAdapter } from "./types.adapters-Dx2pYKAA.js";
//#region extensions/matrix/src/setup-core.d.ts
type MatrixSetupWizardModule = {
  matrixSetupWizard: ChannelSetupWizardAdapter;
};
declare function createMatrixSetupWizardProxy(loadWizardModule: () => Promise<MatrixSetupWizardModule>): ChannelSetupWizardAdapter;
declare const matrixSetupAdapter: ChannelSetupAdapter;
//#endregion
//#region extensions/matrix/src/onboarding.d.ts
declare const matrixOnboardingAdapter: ChannelSetupWizardAdapter;
//#endregion
export { createMatrixSetupWizardProxy as n, matrixSetupAdapter as r, matrixOnboardingAdapter as t };