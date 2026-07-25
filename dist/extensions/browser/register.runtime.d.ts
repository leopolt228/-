import { A as OpenClawPluginSecurityAuditContext } from "../../plugin-entry-Bj-pdgAt.js";
import { E as createBrowserTool, b as runBrowserProxyCommand, r as handleBrowserGatewayRequest, t as createBrowserPluginService } from "../../plugin-service-lH9IA_Pd.js";

//#region extensions/browser/src/security-audit.d.ts
/** Collects Browser plugin security audit findings for the current config/env. */
declare function collectBrowserSecurityAuditFindings(ctx: OpenClawPluginSecurityAuditContext): {
  checkId: string;
  severity: "warn" | "critical";
  title: string;
  detail: string;
  remediation?: string;
}[];
//#endregion
export { collectBrowserSecurityAuditFindings, createBrowserPluginService, createBrowserTool, handleBrowserGatewayRequest, runBrowserProxyCommand };