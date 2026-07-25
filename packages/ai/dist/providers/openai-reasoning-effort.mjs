// packages/normalization-core/src/string-coerce.ts
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}

// packages/normalization-core/src/string-normalization.ts
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
function uniqueValues(values) {
  return [...new Set(values)];
}
function uniqueStrings(values) {
  return uniqueValues(values);
}

// packages/ai/src/providers/openai-reasoning-effort.ts
var GPT_5_REASONING_EFFORTS = ["minimal", "low", "medium", "high"];
var GPT_51_REASONING_EFFORTS = ["none", "low", "medium", "high"];
var GPT_52_REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh"];
var GPT_56_REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh", "max"];
var GPT_CODEX_REASONING_EFFORTS = ["low", "medium", "high", "xhigh"];
var GPT_PRO_REASONING_EFFORTS = ["medium", "high", "xhigh"];
var GPT_5_PRO_REASONING_EFFORTS = ["high"];
var GPT_51_CODEX_MAX_REASONING_EFFORTS = ["none", "medium", "high", "xhigh"];
var GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
var GENERIC_REASONING_EFFORTS = ["low", "medium", "high"];
var CANONICAL_REASONING_EFFORTS = /* @__PURE__ */ new Set([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "off"
]);
function normalizeModelId(id) {
  return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
function isOpenAIGpt54MiniModel(model) {
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  return /^gpt-5\.4-mini(?:-|$)/u.test(id);
}
function isOpenAIGpt55Model(model) {
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  const name = normalizeModelId(typeof model.name === "string" ? model.name : void 0);
  return /^gpt-5\.5(?:-|$)/u.test(id) || /^gpt-5\.5(?:\s|\(|-|$)/u.test(name);
}
function isOpenAIGpt56Model(model) {
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  const name = normalizeModelId(typeof model.name === "string" ? model.name : void 0);
  return /^gpt-5\.6(?:-|$)/u.test(id) || /^gpt-5\.6(?:\s|\(|-|$)/u.test(name);
}
function normalizeOpenAIReasoningEffort(effort) {
  const trimmed = effort.trim();
  const folded = trimmed.toLowerCase();
  return CANONICAL_REASONING_EFFORTS.has(folded) ? folded : trimmed;
}
function readCompatReasoningEfforts(compat) {
  if (!compat || typeof compat !== "object") {
    return void 0;
  }
  if (compat.supportsReasoningEffort === false) {
    return [];
  }
  const raw = compat.supportedReasoningEfforts;
  if (!Array.isArray(raw)) {
    return void 0;
  }
  const supported = uniqueStrings(
    normalizeStringEntries(raw.filter((value) => typeof value === "string"))
  );
  return supported.length > 0 ? supported : void 0;
}
function isDisabledReasoningEffort(effort) {
  return effort === "none" || effort === "off";
}
function resolveOpenAISupportedReasoningEfforts(model) {
  const compatEfforts = readCompatReasoningEfforts(model.compat);
  if (compatEfforts) {
    return compatEfforts;
  }
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  if (/^gpt-5\.6(?:-|$)/u.test(id)) {
    return GPT_56_REASONING_EFFORTS;
  }
  if (id === "gpt-5.1-codex-mini") {
    return GPT_51_CODEX_MINI_REASONING_EFFORTS;
  }
  if (id === "gpt-5.1-codex-max") {
    return GPT_51_CODEX_MAX_REASONING_EFFORTS;
  }
  if (/^gpt-5(?:\.\d+)?-codex(?:-|$)/u.test(id)) {
    return GPT_CODEX_REASONING_EFFORTS;
  }
  if (id === "gpt-5-pro") {
    return GPT_5_PRO_REASONING_EFFORTS;
  }
  if (/^gpt-5\.[2-9](?:\.\d+)?-pro(?:-|$)/u.test(id)) {
    return GPT_PRO_REASONING_EFFORTS;
  }
  if (/^gpt-5\.[2-9](?:\.\d+)?(?:-|$)/u.test(id)) {
    return GPT_52_REASONING_EFFORTS;
  }
  if (/^gpt-5\.1(?:-|$)/u.test(id)) {
    return GPT_51_REASONING_EFFORTS;
  }
  if (/^gpt-5(?:-|$)/u.test(id)) {
    return GPT_5_REASONING_EFFORTS;
  }
  return GENERIC_REASONING_EFFORTS;
}
function supportsOpenAITemperature(model) {
  const compat = model.compat;
  if (compat && typeof compat === "object") {
    const declared = compat.supportsTemperature;
    if (typeof declared === "boolean") {
      return declared;
    }
  }
  const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
  return !/^gpt-5\.6(?:-|$)/u.test(id);
}
function supportsOpenAIReasoningEffort(model, effort) {
  return resolveOpenAISupportedReasoningEfforts(model).includes(
    normalizeOpenAIReasoningEffort(effort)
  );
}
function resolveOpenAIReasoningEffortForModel(params) {
  const requested = normalizeOpenAIReasoningEffort(params.effort);
  const mapped = params.fallbackMap?.[requested] ?? (params.fallbackMap && CANONICAL_REASONING_EFFORTS.has(requested) ? Object.entries(params.fallbackMap).find(
    ([effort]) => normalizeOpenAIReasoningEffort(effort) === requested
  )?.[1] : void 0);
  const normalized = mapped === void 0 ? requested : mapped.trim();
  const supported = resolveOpenAISupportedReasoningEfforts(params.model);
  if (supported.includes(normalized)) {
    return normalized;
  }
  if (requested === "off" && supported.includes("none")) {
    return "none";
  }
  if (isDisabledReasoningEffort(requested) || isDisabledReasoningEffort(normalized)) {
    return void 0;
  }
  if (requested === "minimal" && supported.includes("low")) {
    return "low";
  }
  if ((requested === "minimal" || requested === "low") && supported.includes("medium")) {
    return "medium";
  }
  if (requested === "xhigh" && supported.includes("high")) {
    return "high";
  }
  if (requested === "max" && supported.includes("xhigh")) {
    return "xhigh";
  }
  return supported.find(
    (effort) => !isDisabledReasoningEffort(normalizeOpenAIReasoningEffort(effort))
  );
}
export {
  isOpenAIGpt54MiniModel,
  isOpenAIGpt55Model,
  isOpenAIGpt56Model,
  normalizeOpenAIReasoningEffort,
  resolveOpenAIReasoningEffortForModel,
  resolveOpenAISupportedReasoningEfforts,
  supportsOpenAIReasoningEffort,
  supportsOpenAITemperature
};
