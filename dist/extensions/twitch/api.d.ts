import { i as OpenClawConfig } from "../../types.openclaw-DAPZkTyD.js";
import { n as RuntimeEnv } from "../../runtime-DRcp7-j9.js";
import { Kn as PluginRuntime } from "../../types-Bi5Leigi.js";
import { m as WizardPrompter } from "../../setup-wizard-types-D7rWDJqA.js";
import { c as ChannelCapabilities, g as ChannelMessageActionContext, h as ChannelMessageActionAdapter, p as ChannelLogSink, r as ChannelAccountSnapshot, x as ChannelMeta } from "../../types.core-Di2R8WTy.js";
import { t as OutboundDeliveryResult } from "../../deliver-types-CfWn3Ek8.js";
import { n as ChannelOutboundAdapter, r as ChannelOutboundContext } from "../../outbound.types-DHcAgJ0o.js";
import { A as ChannelStatusAdapter, T as ChannelResolveResult, b as ChannelGatewayContext, w as ChannelResolveKind } from "../../types.adapters-Dx2pYKAA.js";
import { t as ChannelPlugin } from "../../types.plugin-BiTsqKvq.js";
import { t as twitchPlugin } from "../../plugin-5VX5-uKL.js";

//#region extensions/twitch/src/runtime.d.ts
declare const setTwitchRuntime: (next: PluginRuntime) => void, getTwitchRuntime: () => PluginRuntime;
//#endregion
export { type ChannelAccountSnapshot, type ChannelCapabilities, type ChannelGatewayContext, type ChannelLogSink, type ChannelMessageActionAdapter, type ChannelMessageActionContext, type ChannelMeta, type ChannelOutboundAdapter, type ChannelOutboundContext, type ChannelPlugin, type ChannelResolveKind, type ChannelResolveResult, type ChannelStatusAdapter, type OpenClawConfig, type OutboundDeliveryResult, type RuntimeEnv, type WizardPrompter, setTwitchRuntime, twitchPlugin };