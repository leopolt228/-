import { C as ZodEnum, Mi as output, Q as ZodOptional, Y as ZodNumber, Z as ZodObject, c as ZodBoolean, st as ZodString, ta as $strict, v as ZodDefault, x as ZodEmail, xt as ZodUnknown } from "./schemas-CL7kuExa.js";

//#region extensions/reef/src/friend-types.d.ts
declare const ReefAutonomySchema: ZodEnum<{
  "notify-only": "notify-only";
  bounded: "bounded";
  extended: "extended";
}>;
declare const ReefPeerTrustSchema: ZodObject<{
  autonomy: ZodEnum<{
    "notify-only": "notify-only";
    bounded: "bounded";
    extended: "extended";
  }>;
  ed25519PublicKey: ZodString;
  x25519PublicKey: ZodString;
  keyEpoch: ZodNumber;
  safetyNumberChanged: ZodBoolean;
  approvedAt: ZodNumber;
}, $strict>;
declare const ReefPeerIdentitySchema: ZodObject<{
  ed25519PublicKey: ZodString;
  x25519PublicKey: ZodString;
  keyEpoch: ZodNumber;
}, $strict>;
type ReefAutonomy = output<typeof ReefAutonomySchema>;
type ReefPeerIdentity = output<typeof ReefPeerIdentitySchema>;
type ReefPeerTrust = output<typeof ReefPeerTrustSchema>;
//#endregion
//#region extensions/reef/src/config-schema.d.ts
declare const ReefChannelConfigSchema: ZodObject<{
  enabled: ZodDefault<ZodBoolean>;
  relayUrl: ZodDefault<ZodString>;
  handle: ZodOptional<ZodString>;
  email: ZodOptional<ZodEmail>;
  guard: ZodOptional<ZodObject<{
    provider: ZodEnum<{
      openai: "openai";
      anthropic: "anthropic";
    }>;
    pinnedModel: ZodString;
    apiKeyEnv: ZodString;
    policyVersion: ZodString;
    timeoutMs: ZodNumber;
  }, $strict>>;
  stateDir: ZodOptional<ZodString>;
  requestPolicy: ZodDefault<ZodEnum<{
    open: "open";
    "code-only": "code-only";
    "friends-of-friends": "friends-of-friends";
  }>>;
  friends: ZodOptional<ZodUnknown>;
}, $strict>;
type ReefChannelConfig = output<typeof ReefChannelConfigSchema>;
//#endregion
export { ReefPeerTrust as a, ReefPeerIdentity as i, ReefChannelConfigSchema as n, ReefAutonomy as r, ReefChannelConfig as t };