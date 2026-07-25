import { C as OpenClawPluginNodeHostCommand, g as OpenClawPluginApi, k as OpenClawPluginSecurityAuditCollector } from "../../plugin-entry-Bj-pdgAt.js";

//#region extensions/browser/plugin-registration.d.ts
/** Browser plugin reload policy. */
declare const browserPluginReload: {
  restartPrefixes: string[];
  hotPrefixes: string[];
};
/** Node-host command descriptors exposed by the Browser plugin. */
declare const browserPluginNodeHostCommands: OpenClawPluginNodeHostCommand[];
/** Security audit collectors contributed by the Browser plugin. */
declare const browserSecurityAuditCollectors: OpenClawPluginSecurityAuditCollector[];
/** Register Browser tool factories, CLI, gateway methods, services, and audits. */
declare function registerBrowserPlugin(api: OpenClawPluginApi): void;
//#endregion
export { browserPluginNodeHostCommands, browserPluginReload, browserSecurityAuditCollectors, registerBrowserPlugin };