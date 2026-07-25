import { c as SessionEntry } from "./types-D43pE80v.js";
import { C as ExecTarget, S as ExecSecurity, x as ExecMode, y as ExecAsk } from "./exec-approvals-DnrYCu2s.js";
//#region src/agents/exec-defaults.d.ts
/** Session-scoped exec fields that may be carried across an isolated runtime boundary. */
type ExecSessionDefaults = Pick<SessionEntry, "execHost" | "execSecurity" | "execAsk" | "execNode" | "execCwd">;
type ResolvedExecConfig = {
  host?: ExecTarget;
  mode?: ExecMode;
  security?: ExecSecurity;
  ask?: ExecAsk;
  node?: string;
};
type ExecPolicyOverrides = Omit<ResolvedExecConfig, "mode">;
//#endregion
export { ExecSessionDefaults as n, ExecPolicyOverrides as t };