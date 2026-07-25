import { _ as MessagePresentationButton, m as MessagePresentation, q as reduceLegacyInteractiveReply } from "./payload-D5rf7DdC.js";
import { a as ChannelPresentationCapabilities } from "./outbound.types-DHcAgJ0o.js";

//#region src/channels/plugins/outbound/presentation-limits.d.ts
/**
 * Adapt a portable presentation to the target channel's advertised capabilities.
 *
 * Unsupported controls are downgraded to text/context fallback blocks where possible, and
 * labels, values, rows, options, styles, disabled state, and text are clipped to channel limits.
 */
declare function adaptMessagePresentationForChannel(params: {
  presentation: MessagePresentation;
  capabilities?: ChannelPresentationCapabilities;
}): MessagePresentation;
/** Return the subset of buttons that can still be rendered under action limits. */
declare function applyPresentationActionLimits(buttons: readonly MessagePresentationButton[], capabilities?: ChannelPresentationCapabilities): MessagePresentationButton[];
/** Resolve an action page size that leaves room for reserved actions on the target channel. */
declare function presentationPageSize(capabilities?: ChannelPresentationCapabilities, reservedActions?: number, maxPageSize?: number): number;
//#endregion
//#region src/channels/plugins/outbound/interactive.d.ts
/** @deprecated Use MessagePresentation helpers for new rendering paths. */
declare const reduceInteractiveReply: typeof reduceLegacyInteractiveReply;
//#endregion
export { presentationPageSize as i, adaptMessagePresentationForChannel as n, applyPresentationActionLimits as r, reduceInteractiveReply as t };