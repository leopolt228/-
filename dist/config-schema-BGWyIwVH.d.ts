import { C as ZodEnum, Mi as output, Q as ZodOptional, Y as ZodNumber, Z as ZodObject, bt as ZodUnion, c as ZodBoolean, it as ZodRecord, ji as input, mt as ZodType, na as $strip, r as ZodArray, ra as Extend, st as ZodString, ta as $strict, zr as $RefinementCtx } from "./schemas-CL7kuExa.js";
import { i as ZodRawShape } from "./compat-DH4qSBjp.js";
import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";
import { n as ChannelConfigSchema, r as ChannelConfigUiHint } from "./types.config-D1pSqbn8.js";

//#region src/channels/plugins/config-schema.d.ts
type ExtendableZodObject = ZodType & {
  extend: (shape: Record<string, ZodType>) => ZodType;
};
/** Optional allowlist array used by channel config schema builders. */
declare const AllowFromListSchema: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
/** Canonical per-group/room channel policy shape. */
declare const ChannelGroupEntrySchema: ZodObject<{
  requireMention: ZodOptional<ZodBoolean>;
  tools: ZodOptional<ZodObject<{
    allow: ZodOptional<ZodArray<ZodString>>;
    alsoAllow: ZodOptional<ZodArray<ZodString>>;
    deny: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>;
  toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    allow: ZodOptional<ZodArray<ZodString>>;
    alsoAllow: ZodOptional<ZodArray<ZodString>>;
    deny: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>>>;
  skills: ZodOptional<ZodArray<ZodString>>;
  enabled: ZodOptional<ZodBoolean>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  systemPrompt: ZodOptional<ZodString>;
}, $strict>;
type ChannelGroupEntryField = keyof typeof ChannelGroupEntrySchema.shape;
/** Extend the canonical group/room policy shape with channel-owned fields. */
declare function buildGroupEntrySchema<T extends ZodRawShape = Record<never, never>, const TOmit extends readonly ChannelGroupEntryField[] = []>(extraShape?: T, options?: {
  omit?: TOmit;
}): ZodObject<Omit<{
  requireMention: ZodOptional<ZodBoolean>;
  tools: ZodOptional<ZodObject<{
    allow: ZodOptional<ZodArray<ZodString>>;
    alsoAllow: ZodOptional<ZodArray<ZodString>>;
    deny: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>;
  toolsBySender: ZodOptional<ZodRecord<ZodString, ZodOptional<ZodObject<{
    allow: ZodOptional<ZodArray<ZodString>>;
    alsoAllow: ZodOptional<ZodArray<ZodString>>;
    deny: ZodOptional<ZodArray<ZodString>>;
  }, $strict>>>>;
  skills: ZodOptional<ZodArray<ZodString>>;
  enabled: ZodOptional<ZodBoolean>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
  systemPrompt: ZodOptional<ZodString>;
}, TOmit[number]> & T extends infer T_1 ? { -readonly [P in keyof T_1]: T_1[P] } : never, $strict>;
/** Build the common nested DM config block used by channel account schemas. */
declare function buildNestedDmConfigSchema(extraShape?: ZodRawShape): ZodOptional<ZodObject<{
  enabled: ZodOptional<ZodBoolean>;
  policy: ZodOptional<ZodEnum<{
    open: "open";
    disabled: "disabled";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>;
  allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
}, $strip>>;
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(accountSchema: T): T;
type MultiAccountSchemaBaseOptions<TAccount extends ZodType, TOptional extends boolean> = {
  accountSchema?: TAccount;
  accountsMode?: "record" | "catchall";
  optionalAccount?: TOptional;
};
type MultiAccountRefinement<T extends ZodObject> = (value: output<T>, ctx: $RefinementCtx) => void | Promise<void>;
type MultiAccountSchemaOptions<T extends ZodObject, TAccount extends ZodType, TOptional extends boolean> = (MultiAccountSchemaBaseOptions<TAccount, TOptional> & {
  refine?: undefined;
}) | (MultiAccountSchemaBaseOptions<T, TOptional> & {
  refine: MultiAccountRefinement<T>;
});
type OptionalAccountValue<T, TOptional extends boolean> = TOptional extends true ? T | undefined : T;
type MultiAccountEnvelopeShape<TAccount extends ZodType, TOptional extends boolean> = {
  accounts: ZodOptional<ZodType<Record<string, OptionalAccountValue<output<TAccount>, TOptional>>, Record<string, OptionalAccountValue<input<TAccount>, TOptional>>>>;
  defaultAccount: ZodOptional<ZodString>;
};
type MultiAccountChannelSchema<T extends ZodObject, TAccount extends ZodType, TOptional extends boolean> = ZodObject<Extend<T["shape"], MultiAccountEnvelopeShape<TAccount, TOptional>>>;
/** Add the standard accounts/defaultAccount envelope and optional shared account/root refinement. */
declare function buildMultiAccountChannelSchema<T extends ZodObject, TAccount extends ZodType = T, TOptional extends boolean = false>(baseSchema: T, options?: MultiAccountSchemaOptions<T, TAccount, TOptional>): MultiAccountChannelSchema<T, TAccount, TOptional>;
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<string, ChannelConfigUiHint>; /** Select input mode when transforms must expose accepted config values to editors. */
  jsonSchemaMode?: "input" | "output";
};
type BuildJsonChannelConfigSchemaOptions = {
  cacheKey?: string;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigSchema["runtime"];
};
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
declare function buildJsonChannelConfigSchema(schema: JsonSchemaObject, options?: BuildJsonChannelConfigSchemaOptions): ChannelConfigSchema;
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(schema: ZodType, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
/** Return a channel config schema for channels that intentionally accept no config keys. */
declare function emptyChannelConfigSchema(): ChannelConfigSchema;
//#endregion
export { buildGroupEntrySchema as a, buildNestedDmConfigSchema as c, buildChannelConfigSchema as i, emptyChannelConfigSchema as l, ChannelGroupEntrySchema as n, buildJsonChannelConfigSchema as o, buildCatchallMultiAccountChannelSchema as r, buildMultiAccountChannelSchema as s, AllowFromListSchema as t };