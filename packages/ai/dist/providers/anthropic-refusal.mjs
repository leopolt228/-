// packages/ai/src/providers/anthropic-refusal.ts
function readNullableString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readAnthropicRefusalDetails(value) {
  if (!value || typeof value !== "object") {
    return { category: null, explanation: null };
  }
  const details = value;
  return {
    category: readNullableString(details.category),
    explanation: readNullableString(details.explanation)
  };
}
function formatAnthropicRefusalMessage(details) {
  const category = details.category ? ` (category: ${details.category})` : "";
  const explanation = details.explanation ? `: ${details.explanation}` : ".";
  return `Anthropic refusal${category}${explanation}`;
}
function applyAnthropicRefusal(output, stopDetails, provider) {
  const details = readAnthropicRefusalDetails(stopDetails);
  output.stopReason = "error";
  output.errorMessage = formatAnthropicRefusalMessage(details);
  output.diagnostics = [
    ...output.diagnostics ?? [],
    {
      type: "provider_refusal",
      timestamp: Date.now(),
      details: {
        provider,
        category: details.category,
        explanation: details.explanation
      }
    }
  ];
}
export {
  applyAnthropicRefusal
};
