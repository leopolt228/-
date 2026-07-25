import { Q as ZodOptional, Z as ZodObject, r as ZodArray, st as ZodString, ta as $strict } from "./schemas-CL7kuExa.js";

//#region src/config/zod-schema.agent-runtime.d.ts
declare const ToolPolicySchema: ZodOptional<ZodObject<{
  allow: ZodOptional<ZodArray<ZodString>>;
  alsoAllow: ZodOptional<ZodArray<ZodString>>;
  deny: ZodOptional<ZodArray<ZodString>>;
}, $strict>>;
//#endregion
export { ToolPolicySchema as t };