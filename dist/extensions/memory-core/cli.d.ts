import { t as MemoryCoreRuntimeHost } from "../../runtime-host-BLwpIu7s.js";
import { Command } from "commander";

//#region extensions/memory-core/src/cli.d.ts
declare function registerMemoryCli(program: Command, hostOptions?: MemoryCoreRuntimeHost): void;
//#endregion
export { registerMemoryCli };