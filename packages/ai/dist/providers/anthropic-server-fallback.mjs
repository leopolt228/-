// packages/ai/src/providers/anthropic-server-fallback.ts
var ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-06-01";
var CLAUDE_FABLE_5_FALLBACK_MODEL = "claude-opus-4-8";
var CLAUDE_FABLE_5_FALLBACK_MODEL_COST = {
  input: 5,
  output: 25,
  cacheRead: 0.5,
  cacheWrite: 6.25
};
function buildAnthropicServerSideFallbacks() {
  return [{ model: CLAUDE_FABLE_5_FALLBACK_MODEL }];
}
function readBoundaryModel(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const model = value.model;
  return typeof model === "string" && model.trim() ? model : null;
}
function readAnthropicFallbackBoundary(block) {
  if (!block || typeof block !== "object") {
    return null;
  }
  const record = block;
  if (record.type !== "fallback") {
    return null;
  }
  return {
    fromModel: readBoundaryModel(record.from),
    toModel: readBoundaryModel(record.to)
  };
}
function applyAnthropicFallbackBoundary(params) {
  const { output, boundary } = params;
  const survivors = output.content.filter((block) => block.type === "text");
  for (const survivor of survivors) {
    delete survivor.textSignature;
  }
  output.content.splice(0, output.content.length, ...survivors);
  if (boundary.toModel) {
    output.responseModel = boundary.toModel;
  }
  output.diagnostics = [
    ...output.diagnostics ?? [],
    {
      type: "provider_fallback",
      timestamp: Date.now(),
      details: {
        provider: params.provider,
        fromModel: boundary.fromModel,
        toModel: boundary.toModel
      }
    }
  ];
}
export {
  ANTHROPIC_SERVER_SIDE_FALLBACK_BETA,
  CLAUDE_FABLE_5_FALLBACK_MODEL,
  CLAUDE_FABLE_5_FALLBACK_MODEL_COST,
  applyAnthropicFallbackBoundary,
  buildAnthropicServerSideFallbacks,
  readAnthropicFallbackBoundary
};
