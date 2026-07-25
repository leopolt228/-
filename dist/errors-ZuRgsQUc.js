import { s as configureAcpErrorRedactor } from "./errors-C7_LR8fF.js";
import "./src-Bg3_o3L-.js";
import { c as redactSensitiveText } from "./redact-DNq_HeDt.js";
//#region src/acp/runtime/errors.ts
/** ACP runtime error exports wired to OpenClaw secret redaction. */
configureAcpErrorRedactor(redactSensitiveText);
//#endregion
export {};
