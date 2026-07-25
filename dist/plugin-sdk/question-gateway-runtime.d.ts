import { i as OpenClawConfig } from "../types.openclaw-DAPZkTyD.js";
import { r as ReplyPayload } from "../reply-payload-Cz6pe8eB.js";
import { m as MessagePresentation } from "../payload-D5rf7DdC.js";

//#region src/infra/question-gateway-resolver.d.ts
type ResolveQuestionOverGatewayResult = {
  status: "answered";
  questionId: string;
  optionValue: string;
} | {
  status: "already-terminal";
  reason: "already-terminal" | "not-found";
};
type ResolveQuestionOverGatewayParams = {
  cfg: OpenClawConfig;
  questionId: string;
  senderId?: string | null;
  gatewayUrl?: string;
  clientDisplayName?: string;
} & ({
  /** Rendered option value carried by the pressed control (reactions). */optionValue: string;
  optionIndex?: never;
} | {
  /** Compact callback index; mapped to the canonical label via question.get. */optionIndex: number;
  optionValue?: never;
});
/** Resolves one rendered option value against the gateway-owned question. */
declare function resolveQuestionOverGateway(params: ResolveQuestionOverGatewayParams): Promise<ResolveQuestionOverGatewayResult>;
//#endregion
//#region src/infra/question-reaction-runtime.d.ts
type QuestionReactionBinding = {
  questionId: string;
  optionValues: string[];
};
declare function readAskUserQuestionId(payload: Pick<ReplyPayload, "channelData">): string | undefined;
declare function readQuestionReactionBinding(payload: Pick<ReplyPayload, "channelData">): QuestionReactionBinding | undefined;
declare function resolveQuestionReactionIndex(reaction: string): number | undefined;
declare function prepareQuestionReactionPayloadForDelivery(params: {
  payload: ReplyPayload;
  presentation?: MessagePresentation;
}): ReplyPayload | null;
declare function resolveQuestionReactionOverGateway(params: ResolveQuestionOverGatewayParams): Promise<ResolveQuestionOverGatewayResult | null>;
//#endregion
//#region src/plugin-sdk/question-gateway-runtime.d.ts
declare const questionGatewayRuntime: {
  resolveOption: typeof resolveQuestionOverGateway;
  reactionEmojis: readonly ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
  prepareReactionPayloadForDelivery: typeof prepareQuestionReactionPayloadForDelivery;
  readAskUserQuestionId: typeof readAskUserQuestionId;
  readReactionBinding: typeof readQuestionReactionBinding;
  resolveReactionIndex: typeof resolveQuestionReactionIndex;
  resolveReaction: typeof resolveQuestionReactionOverGateway;
  registerChannelDelivery: (params: {
    questionId: string;
    deliveryId: string;
    finalize: (statusLine: string) => void | Promise<void>;
  }) => void;
};
//#endregion
export { questionGatewayRuntime };