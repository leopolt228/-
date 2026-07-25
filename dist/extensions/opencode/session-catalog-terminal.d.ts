import { Kn as PluginRuntime } from "../../types-Bi5Leigi.js";
import { s as SessionCatalogTerminalPlan } from "../../session-catalog-CJbA4_oS.js";
import { C as OpenClawPluginNodeHostCommand } from "../../plugin-entry-Bj-pdgAt.js";
import { t as OpenCodeSessionPage } from "../../session-catalog-CcdDSIi-.js";

//#region extensions/opencode/session-catalog-terminal.d.ts
type OpenCodeTerminalDependencies = {
  parseNodeSessionPage: (value: unknown) => OpenCodeSessionPage;
  unwrapNodePayload: (value: unknown) => unknown;
};
declare function createOpenCodeTerminalNodeHostCommand(isAvailable: NonNullable<OpenClawPluginNodeHostCommand["isAvailable"]>): OpenClawPluginNodeHostCommand;
declare function openOpenCodeCatalogTerminal(params: {
  runtime: PluginRuntime;
  hostId: string;
  threadId: string;
} & OpenCodeTerminalDependencies): Promise<SessionCatalogTerminalPlan>;
//#endregion
export { createOpenCodeTerminalNodeHostCommand, openOpenCodeCatalogTerminal };