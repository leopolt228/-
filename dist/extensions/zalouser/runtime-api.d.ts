import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { C as MarkdownTableMode } from "../../types.base-DucQBSmL.js";
import { mt as GroupToolPolicyConfig } from "../../types.slack-DFzHb8bG.js";
import { n as isDangerousNameMatchingEnabled } from "../../dangerous-name-matching-dEih0Wf-.js";
import { n as RuntimeEnv } from "../../runtime-DRcp7-j9.js";
import { Kn as PluginRuntime, is as OpenClawPluginToolContext } from "../../types-Bi5Leigi.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dh6XMgGH.js";
import { d as ChannelGroupContext, h as ChannelMessageActionAdapter, k as ChannelStatusIssue, l as ChannelDirectoryEntry, r as ChannelAccountSnapshot, t as BaseProbeResult } from "../../types.core-Di2R8WTy.js";
import { T as sendPayloadWithChunkedTextAndMedia, c as deliverTextOrMediaReply, p as isNumericTargetId, r as ReplyPayload, t as OutboundReplyPayload, v as resolveSendableOutboundReplyParts } from "../../reply-payload-DS9v--Bs.js";
import { t as ChannelPlugin } from "../../types.plugin-BiTsqKvq.js";
import { i as createChannelReplyPipeline } from "../../reply-pipeline-XxZX0Ke-.js";
import { l as resolveInboundMentionDecision } from "../../mention-gating-CZBkroRQ.js";
import { a as AnyAgentTool } from "../../plugin-entry-Bj-pdgAt.js";
import { i as buildChannelConfigSchema } from "../../config-schema-BGWyIwVH.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, i as resolveOpenProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "../../runtime-group-policy-yKBXzcXA.js";
import { r as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-ubX-9dkk.js";
import { n as buildBaseAccountStatusSnapshot } from "../../status-helpers-CziogkZl.js";
import { r as createChannelPairingController } from "../../channel-pairing-Cp-bYNCv.js";
import { t as chunkTextForOutbound } from "../../text-chunking-B9AReq3e.js";
import { l as loadOutboundMediaFromUrl } from "../../outbound-media-mtxT-OiJ.js";
import { f as mergeAllowlist, m as summarizeMapping, n as formatAllowFromLowercase } from "../../allow-from-Bx5cVkDt.js";
import { t as zalouserPlugin } from "../../channel-CXSufUE2.js";
import { t as zalouserSetupPlugin } from "../../channel.setup-CcooUhR0.js";
import { i as createZalouserTool, n as createZalouserSetupWizardProxy, r as zalouserSetupAdapter, t as zalouserSetupWizard } from "../../api-CWYD9Nm_.js";
import { n as isZalouserMutableGroupEntry, t as collectZalouserSecurityAuditFindings } from "../../security-audit-R59v805r.js";

//#region extensions/zalouser/src/runtime.d.ts
declare const setZalouserRuntime: (next: PluginRuntime) => void, getZalouserRuntime: () => PluginRuntime;
//#endregion
export { type AnyAgentTool, type BaseProbeResult, type ChannelAccountSnapshot, type ChannelDirectoryEntry, type ChannelGroupContext, type ChannelMessageActionAdapter, type ChannelPlugin, type ChannelStatusIssue, DEFAULT_ACCOUNT_ID, type GroupToolPolicyConfig, type MarkdownTableMode, type OpenClawConfig, type OpenClawPluginToolContext, type OutboundReplyPayload, type PluginRuntime, type ReplyPayload, type RuntimeEnv, buildBaseAccountStatusSnapshot, buildChannelConfigSchema, chunkTextForOutbound, collectZalouserSecurityAuditFindings, createChannelReplyPipeline as createChannelMessageReplyPipeline, createChannelPairingController, createZalouserSetupWizardProxy, createZalouserTool, deliverTextOrMediaReply, formatAllowFromLowercase, isDangerousNameMatchingEnabled, isNumericTargetId, isZalouserMutableGroupEntry, loadOutboundMediaFromUrl, mergeAllowlist, normalizeAccountId, resolveDefaultGroupPolicy, resolveInboundMentionDecision, resolveOpenProviderRuntimeGroupPolicy, resolvePreferredOpenClawTmpDir, resolveSendableOutboundReplyParts, sendPayloadWithChunkedTextAndMedia, setZalouserRuntime, summarizeMapping, warnMissingProviderGroupPolicyFallbackOnce, zalouserPlugin, zalouserSetupAdapter, zalouserSetupPlugin, zalouserSetupWizard };