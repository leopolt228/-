import { t as PairingChannel } from "../pairing-store.types-Dnl8wXcu.js";
import { C as ChannelIngressIdentifierKind, D as IngressReasonCode, E as ChannelIngressStateInput, O as ResolvedChannelImplicitMentions, S as ChannelIngressEventInput, T as ChannelIngressState, _ as ResolveStableChannelMessageIngressParams, a as ChannelIngressEventPresetInput, b as AccessGroupMembershipFact, c as ChannelIngressIdentityField, d as ChannelIngressResolverMessageParams, f as ChannelIngressRouteAccess, g as ResolveChannelMessageIngressParams, h as CreateChannelIngressResolverParams, i as ChannelIngressConfigInput, k as resolveChannelImplicitMentions, l as ChannelIngressIdentitySubjectInput, m as ChannelMessageIngressCommandInput, o as ChannelIngressIdentityAlias, p as ChannelIngressRouteDescriptor, r as ChannelIngressCommandPresetInput, s as ChannelIngressIdentityDescriptor, t as ChannelIngressAccessGroupMembershipResolver, u as ChannelIngressResolver, v as ResolvedChannelMessageIngress, w as ChannelIngressPolicyInput, x as ChannelIngressDecision, y as StableChannelIngressIdentityParams } from "../runtime-types-JGdrrCCy.js";

//#region src/channels/message-access/runtime-identity.d.ts
/** Build an identity descriptor for channels with one stable id and optional aliases. */
declare function defineStableChannelIngressIdentity(params?: StableChannelIngressIdentityParams): ChannelIngressIdentityDescriptor;
//#endregion
//#region src/channels/message-access/runtime.d.ts
/**
 * Create a reusable ingress resolver for one channel account and identity
 * descriptor.
 */
declare function createChannelIngressResolver(base: CreateChannelIngressResolverParams): ChannelIngressResolver;
/**
 * Resolve one inbound event using a simple stable subject identity descriptor.
 */
declare function resolveStableChannelMessageIngress(params: ResolveStableChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
/**
 * Collect optional route descriptors while dropping false, null, and undefined
 * entries.
 */
declare function channelIngressRoutes(...routes: Array<ChannelIngressRouteDescriptor | false | null | undefined>): ChannelIngressRouteDescriptor[];
/**
 * Resolve sender, route, command, event, and activation gates for one inbound
 * channel event.
 */
declare function resolveChannelMessageIngress(params: ResolveChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
//#endregion
//#region src/channels/message-access/store-allow-from.d.ts
/**
 * Read pairing-store allowlist entries when a direct-message policy permits
 * store fallback.
 */
declare function readChannelIngressStoreAllowFromForDmPolicy(params: {
  provider: PairingChannel;
  accountId: string;
  dmPolicy?: string | null;
  shouldRead?: boolean | null;
  readStore?: (provider: PairingChannel, accountId: string) => Promise<string[]>;
}): Promise<string[]>;
//#endregion
export { type AccessGroupMembershipFact, type ChannelIngressAccessGroupMembershipResolver, type ChannelIngressCommandPresetInput, type ChannelIngressConfigInput, type ChannelIngressDecision, type ChannelIngressEventInput, type ChannelIngressEventPresetInput, type ChannelIngressIdentifierKind, type ChannelIngressIdentityAlias, type ChannelIngressIdentityDescriptor, type ChannelIngressIdentityField, type ChannelIngressIdentitySubjectInput, type ChannelIngressPolicyInput, type ChannelIngressResolver, type ChannelIngressResolverMessageParams, type ChannelIngressRouteAccess, type ChannelIngressRouteDescriptor, type ChannelIngressState, type ChannelIngressStateInput, type ChannelMessageIngressCommandInput, type CreateChannelIngressResolverParams, type IngressReasonCode, type ResolveChannelMessageIngressParams, type ResolveStableChannelMessageIngressParams, type ResolvedChannelImplicitMentions, type ResolvedChannelMessageIngress, type StableChannelIngressIdentityParams, channelIngressRoutes, createChannelIngressResolver, defineStableChannelIngressIdentity, readChannelIngressStoreAllowFromForDmPolicy, resolveChannelImplicitMentions, resolveChannelMessageIngress, resolveStableChannelMessageIngress };