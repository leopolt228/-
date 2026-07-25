// packages/ai/src/providers/openai-responses-stream-compat.ts
var OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
var AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
var OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
var AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
function isResponsesTextContentPartType(type) {
  return type === OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE || type === AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
}
function isResponsesTextDeltaEventType(type) {
  return type === OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE || type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEventType(type) {
  return type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEvent(event) {
  return isAzureResponsesTextDeltaEventType(event.type) && typeof event.delta === "string";
}
function resolveResponsesMessageSnapshotCollapse(params) {
  const { prior, nextText } = params;
  if (!prior?.text || !nextText || prior.phase !== params.nextPhase) {
    return { kind: "keep" };
  }
  if (nextText.length > prior.text.length && nextText.startsWith(prior.text)) {
    return { kind: "extend", text: nextText };
  }
  return { kind: "keep" };
}
export {
  AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE,
  AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE,
  OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE,
  OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE,
  isAzureResponsesTextDeltaEvent,
  isAzureResponsesTextDeltaEventType,
  isResponsesTextContentPartType,
  isResponsesTextDeltaEventType,
  resolveResponsesMessageSnapshotCollapse
};
