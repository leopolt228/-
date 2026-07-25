// packages/plugin-sdk/src/plugin-entry.ts
import "zod";
import { Compile as Compile2 } from "typebox/compile";
import { Format } from "typebox/format";
import { Compile } from "typebox/compile";
var MAX_CONFIG_PATH_ARRAY_INDEX = 1e5;
var CANONICAL_ARRAY_INDEX_SEGMENT = /^(0|[1-9]\d*)$/;
function parseConfigPathArrayIndex(segment) {
  if (!CANONICAL_ARRAY_INDEX_SEGMENT.test(segment)) {
    return void 0;
  }
  const index = Number(segment);
  return Number.isSafeInteger(index) && index <= MAX_CONFIG_PATH_ARRAY_INDEX ? index : void 0;
}
var ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
var ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
var ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
var ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
function matchAnsiOscAt(input, index) {
  ansiOscAtIndexRegex.lastIndex = index;
  return ansiOscAtIndexRegex.exec(input)?.[0];
}
function csiIntroducerLength(input, index) {
  const code = input.charCodeAt(index);
  if (code === 155) {
    return 1;
  }
  return code === 27 && input.charCodeAt(index + 1) === 91 ? 2 : 0;
}
function scanAnsiCsiAt(input, index) {
  const introducerLength = csiIntroducerLength(input, index);
  if (introducerLength === 0) {
    return void 0;
  }
  let cursor = index + introducerLength;
  const controls = [];
  let ended = false;
  while (cursor < input.length) {
    const code = input.charCodeAt(cursor);
    if (code === 24 || code === 26) {
      cursor += 1;
      ended = true;
      break;
    }
    if (code === 27 || code === 155) {
      ended = true;
      break;
    }
    if (code <= 31 || code === 127) {
      controls.push(input.charAt(cursor));
      cursor += 1;
      continue;
    }
    if (code >= 32 && code <= 63) {
      cursor += 1;
      continue;
    }
    if (code >= 64 && code <= 126) {
      cursor += 1;
    }
    ended = true;
    break;
  }
  return { controls, ended, value: input.slice(index, cursor) };
}
var ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
var ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`,
  "y"
);
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function hasAnsiIntroducer(input) {
  return input.includes("\x1B") || input.includes("\x9B") || input.includes("\x9D");
}
function stripAnsiInternal(input, options) {
  const output = [];
  let copyStart = 0;
  let index = 0;
  while (index < input.length) {
    const introducerCode = input.charCodeAt(index);
    if (introducerCode !== 27 && introducerCode !== 155 && introducerCode !== 157) {
      index += 1;
      continue;
    }
    const osc = matchAnsiOscAt(input, index);
    if (osc) {
      output.push(input.slice(copyStart, index));
      index += osc.length;
      copyStart = index;
      continue;
    }
    const csi = scanAnsiCsiAt(input, index);
    if (!csi) {
      ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
      const compatibilityMatch2 = options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input) : null;
      if (compatibilityMatch2) {
        output.push(input.slice(copyStart, index));
        index += compatibilityMatch2[0].length;
        copyStart = index;
        continue;
      }
      index += 1;
      continue;
    }
    ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
    const compatibilityMatch = options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input) : null;
    if (!csi.ended && options.preserveIncompleteCsi) {
      break;
    }
    let cursor = index + csi.value.length;
    const canonicalLength = csi.value.length;
    if (csi.controls.length === 0 && compatibilityMatch && compatibilityMatch[0].length > canonicalLength) {
      cursor = index + compatibilityMatch[0].length;
    }
    output.push(input.slice(copyStart, index), ...csi.controls);
    index = cursor;
    copyStart = cursor;
  }
  output.push(input.slice(copyStart));
  return output.join("");
}
function stripAnsi(input) {
  if (!hasAnsiIntroducer(input)) {
    return input;
  }
  return stripAnsiInternal(input, { compatibilityGrammar: false });
}
var rgiEmojiPattern = new RegExp("^\\p{RGI_Emoji}$", "v");
function sanitizeTerminalText(input) {
  const normalized = stripAnsi(input).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
  let sanitized = "";
  for (const char of normalized) {
    const code = char.charCodeAt(0);
    const isControl = code >= 0 && code <= 31 || code >= 127 && code <= 159;
    if (!isControl) {
      sanitized += char;
    }
  }
  return sanitized;
}
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
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) {
    return "";
  }
  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}
var MAX_ALLOWED_VALUES_HINT = 12;
var MAX_ALLOWED_VALUE_CHARS = 160;
function truncateHintText(text, limit) {
  if (text.length <= limit) {
    return text;
  }
  const truncated = truncateUtf16Safe(text, limit);
  return `${truncated}... (+${text.length - truncated.length} chars)`;
}
function safeStringify(value) {
  if (value === void 0) {
    return "";
  }
  try {
    const serialized = JSON.stringify(value);
    if (serialized !== void 0) {
      return serialized;
    }
  } catch {
  }
  return String(value);
}
function toAllowedValueLabel(value) {
  if (typeof value === "string") {
    return JSON.stringify(truncateHintText(value, MAX_ALLOWED_VALUE_CHARS));
  }
  return truncateHintText(safeStringify(value), MAX_ALLOWED_VALUE_CHARS);
}
function toAllowedValueValue(value) {
  if (typeof value === "string") {
    return value;
  }
  return safeStringify(value);
}
function toAllowedValueDedupKey(value) {
  if (value === null) {
    return "null:null";
  }
  const kind = typeof value;
  if (kind === "string") {
    return `string:${value}`;
  }
  return `${kind}:${safeStringify(value)}`;
}
function summarizeAllowedValues(values) {
  if (values.length === 0) {
    return null;
  }
  const deduped = [];
  const seenValues = /* @__PURE__ */ new Set();
  for (const item of values) {
    const dedupeKey = toAllowedValueDedupKey(item);
    if (seenValues.has(dedupeKey)) {
      continue;
    }
    seenValues.add(dedupeKey);
    deduped.push({
      value: toAllowedValueValue(item),
      label: toAllowedValueLabel(item)
    });
  }
  const shown = deduped.slice(0, MAX_ALLOWED_VALUES_HINT);
  const hiddenCount = deduped.length - shown.length;
  const formattedCore = shown.map((entry) => entry.label).join(", ");
  const formatted = hiddenCount > 0 ? `${formattedCore}, ... (+${hiddenCount} more)` : formattedCore;
  return {
    values: shown.map((entry) => entry.value),
    hiddenCount,
    formatted
  };
}
function messageAlreadyIncludesAllowedValues(message) {
  const lower = normalizeLowercaseStringOrEmpty(message);
  return lower.includes("(allowed:") || lower.includes("expected one of");
}
function appendAllowedValuesHint(message, summary) {
  if (messageAlreadyIncludesAllowedValues(message)) {
    return message;
  }
  return `${message} (allowed: ${summary.formatted})`;
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var schemaResourceIds = /* @__PURE__ */ new WeakMap();
var nextSchemaResourceId = 1;
var schemaMapKeywords = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
var schemaValueKeywords = /* @__PURE__ */ new Set([
  "additionalItems",
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties"
]);
var schemaArrayKeywords = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
var schemaCombinatorKeywords = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf"]);
var jsonSchemaTypes = /* @__PURE__ */ new Set([
  "array",
  "boolean",
  "integer",
  "null",
  "number",
  "object",
  "string"
]);
var schemaStringKeywords = /* @__PURE__ */ new Set([
  "$anchor",
  "$comment",
  "$dynamicAnchor",
  "$dynamicRef",
  "$id",
  "$schema",
  "$ref",
  "contentEncoding",
  "contentMediaType",
  "description",
  "format",
  "pattern",
  "title"
]);
var schemaNumberKeywords = /* @__PURE__ */ new Set([
  "exclusiveMaximum",
  "exclusiveMinimum",
  "maximum",
  "minimum",
  "multipleOf"
]);
var schemaIntegerKeywords = /* @__PURE__ */ new Set([
  "maxContains",
  "maxItems",
  "maxLength",
  "maxProperties",
  "minContains",
  "minItems",
  "minLength",
  "minProperties"
]);
var schemaBooleanKeywords = /* @__PURE__ */ new Set(["deprecated", "readOnly", "uniqueItems", "writeOnly"]);
var JSON_POINTER_ARRAY_INDEX_SEGMENT = /^(0|[1-9]\d*)$/;
function schemaTypeIncludes(schema, type) {
  return schema.type === type || Array.isArray(schema.type) && schema.type.includes(type);
}
function schemaResourceRefKey(resourceRoot, ref, baseId) {
  if (!isRecord(resourceRoot)) {
    return `boolean:${String(resourceRoot)}:${baseId ?? ""}:${ref}`;
  }
  let id = schemaResourceIds.get(resourceRoot);
  if (id === void 0) {
    id = nextSchemaResourceId++;
    schemaResourceIds.set(resourceRoot, id);
  }
  return `schema:${id}:${baseId ?? ""}:${ref}`;
}
function normalizeSchemaMap(value) {
  if (!isRecord(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, normalizeJsonSchemaNode(entry)])
  );
}
function compilesUnicodePattern(pattern) {
  try {
    const probe = new RegExp(pattern, "u");
    void probe;
    return true;
  } catch {
    return false;
  }
}
function repairJsonSchemaPatternForUnicodeRegExp(pattern) {
  if (compilesUnicodePattern(pattern)) {
    return pattern;
  }
  const repaired = pattern.replace(/\\([^\\])/g, (match, ch) => {
    if (ch === ":" || ch === "/") {
      return ch;
    }
    return match;
  });
  return compilesUnicodePattern(repaired) ? repaired : pattern;
}
function normalizeSchemaDependencies(value) {
  if (!isRecord(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isStringArray(entry) ? entry : normalizeJsonSchemaNode(entry)
    ])
  );
}
function normalizePatternProperties(value) {
  const normalized = /* @__PURE__ */ new Map();
  for (const [pattern, propertySchema] of Object.entries(value)) {
    const repairedPattern = repairJsonSchemaPatternForUnicodeRegExp(pattern);
    const repairedSchema = normalizeJsonSchemaNode(propertySchema);
    const existingSchema = normalized.get(repairedPattern);
    normalized.set(
      repairedPattern,
      existingSchema === void 0 ? repairedSchema : { allOf: [existingSchema, repairedSchema] }
    );
  }
  return Object.fromEntries(normalized);
}
function expandJsonSchemaTypeArray(schema) {
  const { nullable, type, ...rest } = schema;
  const types = Array.isArray(type) ? [...type] : typeof type === "string" ? [type] : null;
  if (!types) {
    return schema;
  }
  if (nullable === true && !types.includes("null")) {
    types.push("null");
  }
  if (types.length === 1 && !Array.isArray(type)) {
    return schema;
  }
  return {
    anyOf: types.map((entry) => Object.assign({}, rest, { type: entry }))
  };
}
function normalizeAdditionalPropertiesSchema(schema) {
  if (!isRecord(schema.additionalProperties) || isRecord(schema.properties) || isRecord(schema.patternProperties)) {
    return schema;
  }
  const { additionalProperties, ...rest } = schema;
  return {
    ...rest,
    patternProperties: {
      ".*": additionalProperties
    },
    additionalProperties: false
  };
}
function normalizeJsonSchemaNode(schema) {
  if (Array.isArray(schema)) {
    return schema.map((entry) => normalizeJsonSchemaNode(entry));
  }
  if (!isRecord(schema)) {
    return schema;
  }
  const normalizedSchema = normalizeAdditionalPropertiesSchema(expandJsonSchemaTypeArray(schema));
  return Object.fromEntries(
    Object.entries(normalizedSchema).map(([key, value]) => {
      if (key === "$dynamicRef" && normalizedSchema.$ref === void 0) {
        return ["$ref", value];
      }
      if (key === "pattern" && typeof value === "string") {
        return [key, repairJsonSchemaPatternForUnicodeRegExp(value)];
      }
      if (key === "patternProperties" && isRecord(value)) {
        return [key, normalizePatternProperties(value)];
      }
      if (schemaMapKeywords.has(key)) {
        return [key, normalizeSchemaMap(value)];
      }
      if (key === "dependencies") {
        return [key, normalizeSchemaDependencies(value)];
      }
      if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key)) {
        return [key, normalizeJsonSchemaNode(value)];
      }
      return [key, value];
    })
  );
}
function validateTypeKeyword(type, path) {
  if (typeof type === "string") {
    return jsonSchemaTypes.has(type) ? void 0 : `${path}.type: unsupported JSON Schema type`;
  }
  if (Array.isArray(type) && type.length > 0) {
    const invalid = type.find((entry) => typeof entry !== "string" || !jsonSchemaTypes.has(entry));
    if (invalid !== void 0) {
      return `${path}.type: unsupported JSON Schema type`;
    }
    return new Set(type).size === type.length ? void 0 : `${path}.type: expected unique JSON Schema types`;
  }
  return `${path}.type: expected string or non-empty string array`;
}
function decodePointerSegment(segment) {
  let decodedSegment;
  try {
    decodedSegment = decodeURIComponent(segment);
  } catch {
    decodedSegment = segment;
  }
  return decodedSegment.replace(/~1/g, "/").replace(/~0/g, "~");
}
function parseJsonPointerArrayIndex(segment) {
  if (!JSON_POINTER_ARRAY_INDEX_SEGMENT.test(segment)) {
    return void 0;
  }
  const index = Number(segment);
  return Number.isSafeInteger(index) ? index : void 0;
}
function resolveLocalAnchor(schema, anchor, isRoot = true) {
  if (!isRecord(schema)) {
    return void 0;
  }
  if (!isRoot && typeof schema.$id === "string") {
    return void 0;
  }
  if (schema.$anchor === anchor || schema.$dynamicAnchor === anchor) {
    return schema;
  }
  for (const key of schemaMapKeywords) {
    const value = schema[key];
    if (!isRecord(value)) {
      continue;
    }
    for (const entry of Object.values(value)) {
      const resolved = resolveLocalAnchor(entry, anchor, false);
      if (resolved !== void 0) {
        return resolved;
      }
    }
  }
  if (isRecord(schema.dependencies)) {
    for (const entry of Object.values(schema.dependencies)) {
      if (isStringArray(entry)) {
        continue;
      }
      const resolved = resolveLocalAnchor(entry, anchor, false);
      if (resolved !== void 0) {
        return resolved;
      }
    }
  }
  for (const key of schemaValueKeywords) {
    const value = schema[key];
    if (typeof value === "boolean" || isRecord(value)) {
      const resolved = resolveLocalAnchor(value, anchor, false);
      if (resolved !== void 0) {
        return resolved;
      }
      continue;
    }
    if (key === "items" && Array.isArray(value)) {
      for (const entry of value) {
        const resolved = resolveLocalAnchor(entry, anchor, false);
        if (resolved !== void 0) {
          return resolved;
        }
      }
    }
  }
  for (const key of schemaArrayKeywords) {
    const value = schema[key];
    if (!Array.isArray(value)) {
      continue;
    }
    for (const entry of value) {
      const resolved = resolveLocalAnchor(entry, anchor, false);
      if (resolved !== void 0) {
        return resolved;
      }
    }
  }
  return void 0;
}
function resolveLocalRef(resourceRoot, ref, resourceBaseId) {
  if (isRecord(resourceRoot) && typeof resourceRoot.$id === "string" && resourceRoot.$id !== "") {
    if (ref === resourceRoot.$id) {
      return { found: true, schema: resourceRoot, resourceRoot, resourceBaseId };
    }
    if (ref.startsWith(`${resourceRoot.$id}#`)) {
      return resolveLocalRef(resourceRoot, ref.slice(resourceRoot.$id.length), resourceBaseId);
    }
  }
  if (ref === "#") {
    return { found: true, schema: resourceRoot, resourceRoot, resourceBaseId };
  }
  if (ref.startsWith("#/")) {
    let current = resourceRoot;
    let currentResourceRoot = resourceRoot;
    let currentResourceBaseId = resourceBaseId;
    for (const segment of ref.slice(2).split("/").map(decodePointerSegment)) {
      if (Array.isArray(current)) {
        const index = parseJsonPointerArrayIndex(segment);
        if (index === void 0) {
          return { found: false };
        }
        current = current[index];
      } else if (isRecord(current)) {
        current = current[segment];
      } else {
        return { found: false };
      }
      if (isRecord(current) && typeof current.$id === "string") {
        currentResourceRoot = current;
        currentResourceBaseId = resolveSchemaId(current.$id, currentResourceBaseId);
      }
    }
    return typeof current === "boolean" || isRecord(current) ? {
      found: true,
      schema: current,
      resourceRoot: currentResourceRoot,
      resourceBaseId: currentResourceBaseId
    } : { found: false };
  }
  if (ref.startsWith("#")) {
    const resolved = resolveLocalAnchor(resourceRoot, decodeURIComponent(ref.slice(1)));
    return resolved === void 0 ? { found: false } : { found: true, schema: resolved, resourceRoot, resourceBaseId };
  }
  return { found: false };
}
function splitResourceRef(ref) {
  const hashIndex = ref.indexOf("#");
  return hashIndex === -1 ? { resource: ref, fragment: "" } : { resource: ref.slice(0, hashIndex), fragment: ref.slice(hashIndex) };
}
function stripFragment(id) {
  return splitResourceRef(id).resource;
}
function resolveSchemaId(id, baseId) {
  if (!baseId) {
    return stripFragment(id);
  }
  try {
    return stripFragment(new URL(id, baseId).href);
  } catch {
    return stripFragment(id);
  }
}
function resolveSchemaResourceRef(schema, ref, baseId) {
  const refParts = splitResourceRef(ref);
  const resolvedRefResource = refParts.resource === "" ? refParts.resource : resolveSchemaId(refParts.resource, baseId);
  const seen = /* @__PURE__ */ new Set();
  const visit = (current, baseIdLocal) => {
    if (!isRecord(current) || seen.has(current)) {
      return { found: false };
    }
    seen.add(current);
    let currentBaseId = baseIdLocal;
    if (typeof current.$id === "string" && current.$id !== "") {
      const resolvedId = resolveSchemaId(current.$id, baseIdLocal);
      currentBaseId = resolvedId;
      if (resolvedRefResource === resolvedId || refParts.resource === stripFragment(current.$id)) {
        return refParts.fragment ? resolveLocalRef(current, refParts.fragment, currentBaseId) : { found: true, schema: current, resourceRoot: current, resourceBaseId: currentBaseId };
      }
    }
    for (const key of schemaMapKeywords) {
      const value = current[key];
      if (!isRecord(value)) {
        continue;
      }
      for (const entry of Object.values(value)) {
        const resolved = visit(entry, currentBaseId);
        if (resolved.found) {
          return resolved;
        }
      }
    }
    if (isRecord(current.dependencies)) {
      for (const entry of Object.values(current.dependencies)) {
        if (isStringArray(entry)) {
          continue;
        }
        const resolved = visit(entry, currentBaseId);
        if (resolved.found) {
          return resolved;
        }
      }
    }
    for (const key of schemaValueKeywords) {
      const value = current[key];
      if (typeof value === "boolean" || isRecord(value)) {
        const resolved = visit(value, currentBaseId);
        if (resolved.found) {
          return resolved;
        }
        continue;
      }
      if (key === "items" && Array.isArray(value)) {
        for (const entry of value) {
          const resolved = visit(entry, currentBaseId);
          if (resolved.found) {
            return resolved;
          }
        }
      }
    }
    for (const key of schemaArrayKeywords) {
      const value = current[key];
      if (!Array.isArray(value)) {
        continue;
      }
      for (const entry of value) {
        const resolved = visit(entry, currentBaseId);
        if (resolved.found) {
          return resolved;
        }
      }
    }
    return { found: false };
  };
  return visit(schema, void 0);
}
function resolveSchemaRef(root, resourceRoot, ref, baseId) {
  const localTarget = resolveLocalRef(resourceRoot, ref, baseId);
  return localTarget.found ? localTarget : resolveSchemaResourceRef(root, ref, baseId);
}
function normalizeJsonSchemaForTypeBox(schema) {
  return normalizeJsonSchemaNode(schema);
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function hasDuplicateJsonValues(values) {
  const seen = /* @__PURE__ */ new Set();
  for (const value of values) {
    const key = JSON.stringify(value);
    if (seen.has(key)) {
      return true;
    }
    seen.add(key);
  }
  return false;
}
function validateSchemaKeywordShapes(schema, path) {
  for (const key of schemaStringKeywords) {
    const value = schema[key];
    if (value !== void 0 && typeof value !== "string") {
      return `${path}.${key}: expected string`;
    }
  }
  for (const key of schemaNumberKeywords) {
    const value = schema[key];
    if (value !== void 0 && typeof value !== "number") {
      return `${path}.${key}: expected number`;
    }
  }
  for (const key of schemaIntegerKeywords) {
    const value = schema[key];
    if (value !== void 0 && (!Number.isInteger(value) || typeof value === "number" && value < 0)) {
      return `${path}.${key}: expected non-negative integer`;
    }
  }
  for (const key of schemaBooleanKeywords) {
    const value = schema[key];
    if (value !== void 0 && typeof value !== "boolean") {
      return `${path}.${key}: expected boolean`;
    }
  }
  if (schema.multipleOf !== void 0 && typeof schema.multipleOf === "number" && schema.multipleOf <= 0) {
    return `${path}.multipleOf: expected positive number`;
  }
  if (schema.required !== void 0) {
    if (!isStringArray(schema.required)) {
      return `${path}.required: expected string array`;
    }
    if (new Set(schema.required).size !== schema.required.length) {
      return `${path}.required: expected unique string array`;
    }
  }
  if (schema.enum !== void 0) {
    if (!Array.isArray(schema.enum)) {
      return `${path}.enum: expected array`;
    }
    if (schema.enum.length === 0 || hasDuplicateJsonValues(schema.enum)) {
      return `${path}.enum: expected non-empty array with unique values`;
    }
  }
  for (const key of schemaCombinatorKeywords) {
    const value = schema[key];
    if (Array.isArray(value) && value.length === 0) {
      return `${path}.${key}: expected non-empty schema array`;
    }
  }
  if (schema.dependentRequired !== void 0) {
    if (!isRecord(schema.dependentRequired)) {
      return `${path}.dependentRequired: expected string array map`;
    }
    for (const [key, value] of Object.entries(schema.dependentRequired)) {
      if (!isStringArray(value)) {
        return `${path}.dependentRequired.${key}: expected string array`;
      }
    }
  }
  if (schema.dependencies !== void 0) {
    if (!isRecord(schema.dependencies)) {
      return `${path}.dependencies: expected schema or string array map`;
    }
    for (const [key, value] of Object.entries(schema.dependencies)) {
      if (!isStringArray(value) && typeof value !== "boolean" && !isRecord(value)) {
        return `${path}.dependencies.${key}: expected schema or string array`;
      }
    }
  }
  return void 0;
}
function findJsonSchemaNodeError(schema, path, root, resourceRoot, resourceBaseId) {
  if (typeof schema === "boolean") {
    return void 0;
  }
  if (!isRecord(schema)) {
    return `${path}: schema must be an object or boolean`;
  }
  if (Object.hasOwn(schema, "type")) {
    const typeError = validateTypeKeyword(schema.type, path);
    if (typeError) {
      return typeError;
    }
  }
  if (schema.nullable !== void 0) {
    if (typeof schema.nullable !== "boolean") {
      return `${path}.nullable: expected boolean`;
    }
    if (!Object.hasOwn(schema, "type")) {
      return `${path}.nullable: expected type`;
    }
  }
  const keywordError = validateSchemaKeywordShapes(schema, path);
  if (keywordError) {
    return keywordError;
  }
  const currentResourceRoot = typeof schema.$id === "string" ? schema : resourceRoot;
  const currentResourceBaseId = typeof schema.$id === "string" ? resolveSchemaId(schema.$id, resourceBaseId) : resourceBaseId;
  if (typeof schema.$ref === "string") {
    if (!resolveSchemaRef(root, currentResourceRoot, schema.$ref, currentResourceBaseId).found) {
      return `${path}.$ref: unresolved ref`;
    }
  }
  if (typeof schema.$dynamicRef === "string") {
    if (!resolveSchemaRef(root, currentResourceRoot, schema.$dynamicRef, currentResourceBaseId).found) {
      return `${path}.$dynamicRef: unresolved ref`;
    }
  }
  for (const key of schemaMapKeywords) {
    const value = schema[key];
    if (value === void 0) {
      continue;
    }
    if (!isRecord(value)) {
      return `${path}.${key}: expected schema map`;
    }
    for (const [entryKey, entry] of Object.entries(value)) {
      const error2 = findJsonSchemaNodeError(
        entry,
        `${path}.${key}.${entryKey}`,
        root,
        currentResourceRoot,
        currentResourceBaseId
      );
      if (error2) {
        return error2;
      }
    }
  }
  if (isRecord(schema.dependencies)) {
    for (const [key, value] of Object.entries(schema.dependencies)) {
      if (isStringArray(value)) {
        continue;
      }
      const error2 = findJsonSchemaNodeError(
        value,
        `${path}.dependencies.${key}`,
        root,
        currentResourceRoot,
        currentResourceBaseId
      );
      if (error2) {
        return error2;
      }
    }
  }
  for (const key of schemaValueKeywords) {
    const value = schema[key];
    if (value === void 0 || typeof value === "boolean") {
      continue;
    }
    if (Array.isArray(value)) {
      if (key !== "items") {
        return `${path}.${key}: expected schema`;
      }
      for (const [index, entry] of value.entries()) {
        const error3 = findJsonSchemaNodeError(
          entry,
          `${path}.${key}.${index}`,
          root,
          currentResourceRoot,
          currentResourceBaseId
        );
        if (error3) {
          return error3;
        }
      }
      continue;
    }
    const error2 = findJsonSchemaNodeError(
      value,
      `${path}.${key}`,
      root,
      currentResourceRoot,
      currentResourceBaseId
    );
    if (error2) {
      return error2;
    }
  }
  for (const key of schemaArrayKeywords) {
    const value = schema[key];
    if (value === void 0) {
      continue;
    }
    if (!Array.isArray(value)) {
      return `${path}.${key}: expected schema array`;
    }
    for (const [index, entry] of value.entries()) {
      const error2 = findJsonSchemaNodeError(
        entry,
        `${path}.${key}.${index}`,
        root,
        currentResourceRoot,
        currentResourceBaseId
      );
      if (error2) {
        return error2;
      }
    }
  }
  return void 0;
}
function findJsonSchemaShapeError(schema) {
  return findJsonSchemaNodeError(schema, "<schema>", schema, schema, void 0);
}
function cloneDefault(value) {
  if (value === void 0 || value === null) {
    return value;
  }
  return structuredClone(value);
}
function getDefault(schema) {
  if (!isRecord(schema) || !Object.hasOwn(schema, "default")) {
    return void 0;
  }
  return cloneDefault(schema.default);
}
function schemaWithResourceContext(schema, resourceRoot) {
  if (!isRecord(schema) || !isRecord(resourceRoot)) {
    return schema;
  }
  return {
    ...schema,
    ...typeof resourceRoot.$id === "string" && schema.$id === void 0 ? { $id: resourceRoot.$id } : {},
    ...isRecord(resourceRoot.$defs) ? { $defs: resourceRoot.$defs } : {},
    ...isRecord(resourceRoot.definitions) ? { definitions: resourceRoot.definitions } : {}
  };
}
function inlineLocalRefsForMatch(schema, root, resourceRoot, resourceBaseId, resolvingRefs = /* @__PURE__ */ new Set()) {
  if (Array.isArray(schema)) {
    return schema.map(
      (entry) => inlineLocalRefsForMatch(
        entry,
        root,
        resourceRoot,
        resourceBaseId,
        resolvingRefs
      )
    );
  }
  if (!isRecord(schema)) {
    return schema;
  }
  const currentResourceRoot = typeof schema.$id === "string" ? schema : resourceRoot;
  const currentResourceBaseId = typeof schema.$id === "string" ? resolveSchemaId(schema.$id, resourceBaseId) : resourceBaseId;
  if (isRecord(schema) && typeof schema.$ref === "string") {
    const refKey = schemaResourceRefKey(currentResourceRoot, schema.$ref, currentResourceBaseId);
    const target = resolvingRefs.has(refKey) ? { found: false } : resolveSchemaRef(root, currentResourceRoot, schema.$ref, currentResourceBaseId);
    if (target.found) {
      const { $ref: _$ref, ...siblingSchema } = schema;
      resolvingRefs.add(refKey);
      const inlinedTarget = inlineLocalRefsForMatch(
        target.schema,
        root,
        target.resourceRoot,
        target.resourceBaseId,
        resolvingRefs
      );
      resolvingRefs.delete(refKey);
      if (Object.keys(siblingSchema).length === 0) {
        return inlinedTarget;
      }
      return {
        allOf: [
          inlinedTarget,
          inlineLocalRefsForMatch(
            siblingSchema,
            root,
            currentResourceRoot,
            currentResourceBaseId,
            resolvingRefs
          )
        ]
      };
    }
  }
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      if (schemaMapKeywords.has(key) && isRecord(value)) {
        return [
          key,
          Object.fromEntries(
            Object.entries(value).map(([entryKey, entry]) => [
              entryKey,
              inlineLocalRefsForMatch(
                entry,
                root,
                currentResourceRoot,
                currentResourceBaseId,
                resolvingRefs
              )
            ])
          )
        ];
      }
      if (key === "dependencies" && isRecord(value)) {
        return [
          key,
          Object.fromEntries(
            Object.entries(value).map(([entryKey, entry]) => [
              entryKey,
              isStringArray(entry) ? entry : inlineLocalRefsForMatch(
                entry,
                root,
                currentResourceRoot,
                currentResourceBaseId,
                resolvingRefs
              )
            ])
          )
        ];
      }
      if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key)) {
        return [
          key,
          inlineLocalRefsForMatch(
            value,
            root,
            currentResourceRoot,
            currentResourceBaseId,
            resolvingRefs
          )
        ];
      }
      return [key, value];
    })
  );
}
function schemaMatches(schema, value, root, resourceRoot, resourceBaseId) {
  try {
    const matchSchema = inlineLocalRefsForMatch(schema, root, resourceRoot, resourceBaseId);
    return Compile(
      normalizeJsonSchemaForTypeBox(schemaWithResourceContext(matchSchema, resourceRoot))
    ).Check(value);
  } catch {
    return false;
  }
}
function applyObjectPropertyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
  const properties = isRecord(schema.properties) ? schema.properties : {};
  for (const [key, propertySchema] of Object.entries(properties)) {
    const currentValue = value[key];
    const defaultedValue = applySchemaDefaults(
      propertySchema,
      currentValue,
      root,
      resolvingRefs,
      currentResourceRoot,
      currentResourceBaseId
    );
    if (defaultedValue !== currentValue || currentValue === void 0) {
      if (defaultedValue !== void 0) {
        value[key] = defaultedValue;
      }
    }
  }
  const patternMatchedKeys = /* @__PURE__ */ new Set();
  if (isRecord(schema.patternProperties)) {
    for (const [pattern, propertySchema] of Object.entries(schema.patternProperties)) {
      let regex;
      try {
        regex = new RegExp(pattern);
      } catch {
        continue;
      }
      for (const key of Object.keys(value)) {
        if (!regex.test(key)) {
          continue;
        }
        patternMatchedKeys.add(key);
        value[key] = applySchemaDefaults(
          propertySchema,
          value[key],
          root,
          resolvingRefs,
          currentResourceRoot,
          currentResourceBaseId
        );
      }
    }
  }
  if (isRecord(schema.additionalProperties)) {
    const additionalSchema = schema.additionalProperties;
    for (const key of Object.keys(value)) {
      if (Object.hasOwn(properties, key) || patternMatchedKeys.has(key)) {
        continue;
      }
      value[key] = applySchemaDefaults(
        additionalSchema,
        value[key],
        root,
        resolvingRefs,
        currentResourceRoot,
        currentResourceBaseId
      );
    }
  }
  return value;
}
function applyObjectDependencyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
  let nextValue = value;
  if (isRecord(schema.dependencies)) {
    for (const [key, dependencySchema] of Object.entries(schema.dependencies)) {
      if (!Object.hasOwn(nextValue, key) || isStringArray(dependencySchema)) {
        continue;
      }
      nextValue = applySchemaDefaults(
        dependencySchema,
        nextValue,
        root,
        resolvingRefs,
        currentResourceRoot,
        currentResourceBaseId
      );
    }
  }
  if (isRecord(schema.dependentSchemas)) {
    for (const [key, dependentSchema] of Object.entries(schema.dependentSchemas)) {
      if (!Object.hasOwn(nextValue, key)) {
        continue;
      }
      nextValue = applySchemaDefaults(
        dependentSchema,
        nextValue,
        root,
        resolvingRefs,
        currentResourceRoot,
        currentResourceBaseId
      );
    }
  }
  return nextValue;
}
function applyObjectConditionalDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
  if (!(typeof schema.if === "boolean" || isRecord(schema.if))) {
    return value;
  }
  const branch = schemaMatches(
    schema.if,
    value,
    root,
    currentResourceRoot,
    currentResourceBaseId
  ) ? schema.then : schema.else;
  if (!(typeof branch === "boolean" || isRecord(branch))) {
    return value;
  }
  return applySchemaDefaults(
    branch,
    value,
    root,
    resolvingRefs,
    currentResourceRoot,
    currentResourceBaseId
  );
}
function countSchemaNodes(schema, seen = /* @__PURE__ */ new Set()) {
  if (typeof schema === "boolean" || !isRecord(schema) || seen.has(schema)) {
    return 1;
  }
  seen.add(schema);
  let count = 1;
  for (const key of schemaMapKeywords) {
    const value = schema[key];
    if (!isRecord(value)) {
      continue;
    }
    for (const entry of Object.values(value)) {
      count += countSchemaNodes(entry, seen);
    }
  }
  if (isRecord(schema.dependencies)) {
    for (const entry of Object.values(schema.dependencies)) {
      if (!isStringArray(entry)) {
        count += countSchemaNodes(entry, seen);
      }
    }
  }
  for (const key of schemaValueKeywords) {
    const value = schema[key];
    if (typeof value === "boolean" || isRecord(value)) {
      count += countSchemaNodes(value, seen);
      continue;
    }
    if (key === "items" && Array.isArray(value)) {
      for (const entry of value) {
        count += countSchemaNodes(entry, seen);
      }
    }
  }
  for (const key of schemaArrayKeywords) {
    const value = schema[key];
    if (!Array.isArray(value)) {
      continue;
    }
    for (const entry of value) {
      count += countSchemaNodes(entry, seen);
    }
  }
  return count;
}
function applyObjectApplicatorDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
  let nextValue = applyObjectPropertyAndDependencyDefaults(
    schema,
    value,
    root,
    resolvingRefs,
    currentResourceRoot,
    currentResourceBaseId
  );
  nextValue = applyObjectConditionalDefaults(
    schema,
    nextValue,
    root,
    resolvingRefs,
    currentResourceRoot,
    currentResourceBaseId
  );
  return applyObjectPropertyAndDependencyDefaults(
    schema,
    nextValue,
    root,
    resolvingRefs,
    currentResourceRoot,
    currentResourceBaseId
  );
}
function applyObjectPropertyAndDependencyDefaults(schema, value, root, resolvingRefs, currentResourceRoot, currentResourceBaseId) {
  let nextValue = value;
  const maxIterations = countSchemaNodes(schema);
  for (let index = 0; index < maxIterations; index++) {
    const before = JSON.stringify(nextValue);
    nextValue = applyObjectPropertyDefaults(
      schema,
      nextValue,
      root,
      resolvingRefs,
      currentResourceRoot,
      currentResourceBaseId
    );
    nextValue = applyObjectDependencyDefaults(
      schema,
      nextValue,
      root,
      resolvingRefs,
      currentResourceRoot,
      currentResourceBaseId
    );
    if (JSON.stringify(nextValue) === before) {
      break;
    }
  }
  return nextValue;
}
function applySchemaDefaults(schema, valueInput, root = schema, resolvingRefs = /* @__PURE__ */ new Set(), resourceRoot = root, resourceBaseId) {
  let value = valueInput;
  if (value === void 0) {
    const defaultValue = getDefault(schema);
    if (defaultValue !== void 0) {
      value = defaultValue;
    }
  }
  if (!isRecord(schema)) {
    return value;
  }
  const currentResourceRoot = typeof schema.$id === "string" ? schema : resourceRoot;
  const currentResourceBaseId = typeof schema.$id === "string" ? resolveSchemaId(schema.$id, resourceBaseId) : resourceBaseId;
  let nextValue = value;
  const refKey = typeof schema.$ref === "string" ? schemaResourceRefKey(currentResourceRoot, schema.$ref, currentResourceBaseId) : void 0;
  if (typeof schema.$ref === "string" && refKey !== void 0 && !resolvingRefs.has(refKey)) {
    const target = resolveSchemaRef(root, currentResourceRoot, schema.$ref, currentResourceBaseId);
    if (target.found) {
      resolvingRefs.add(refKey);
      nextValue = applySchemaDefaults(
        target.schema,
        nextValue,
        root,
        resolvingRefs,
        target.resourceRoot,
        target.resourceBaseId
      );
      resolvingRefs.delete(refKey);
    }
  }
  const composedSchemas = [...Array.isArray(schema.allOf) ? schema.allOf : []];
  for (const branch of composedSchemas) {
    nextValue = applySchemaDefaults(
      branch,
      nextValue,
      root,
      resolvingRefs,
      currentResourceRoot,
      currentResourceBaseId
    );
  }
  const hasObjectApplicators = isRecord(schema.properties) || isRecord(schema.patternProperties) || isRecord(schema.additionalProperties) || isRecord(schema.dependencies) || isRecord(schema.dependentSchemas) || typeof schema.if === "boolean" || isRecord(schema.if);
  if ((schemaTypeIncludes(schema, "object") || hasObjectApplicators) && isRecord(nextValue)) {
    nextValue = applyObjectApplicatorDefaults(
      schema,
      nextValue,
      root,
      resolvingRefs,
      currentResourceRoot,
      currentResourceBaseId
    );
    return nextValue;
  }
  if ((schemaTypeIncludes(schema, "array") || schema.items !== void 0 || schema.prefixItems !== void 0) && Array.isArray(nextValue)) {
    const tupleSchemas = Array.isArray(schema.prefixItems) ? schema.prefixItems : Array.isArray(schema.items) ? schema.items : null;
    if (tupleSchemas) {
      const result = nextValue.slice();
      for (const [index, itemSchema] of tupleSchemas.entries()) {
        const defaultedValue = applySchemaDefaults(
          itemSchema,
          result[index],
          root,
          resolvingRefs,
          currentResourceRoot,
          currentResourceBaseId
        );
        if (defaultedValue !== void 0) {
          result[index] = defaultedValue;
        }
      }
      const restSchema = isRecord(schema.items) ? schema.items : isRecord(schema.additionalItems) ? schema.additionalItems : null;
      if (restSchema) {
        for (let index = tupleSchemas.length; index < result.length; index++) {
          result[index] = applySchemaDefaults(
            restSchema,
            result[index],
            root,
            resolvingRefs,
            currentResourceRoot,
            currentResourceBaseId
          );
        }
      }
      return result;
    }
    if (!isRecord(schema.items)) {
      return nextValue;
    }
    return nextValue.map(
      (item) => applySchemaDefaults(
        schema.items,
        item,
        root,
        resolvingRefs,
        currentResourceRoot,
        currentResourceBaseId
      )
    );
  }
  return nextValue;
}
function applyJsonSchemaDefaults(schema, value) {
  return applySchemaDefaults(schema, value);
}
var PluginLruCache = class {
  #defaultMaxEntries;
  #maxEntries;
  #entries = /* @__PURE__ */ new Map();
  constructor(defaultMaxEntries) {
    this.#defaultMaxEntries = normalizeMaxEntries(defaultMaxEntries, 1);
    this.#maxEntries = this.#defaultMaxEntries;
  }
  get maxEntries() {
    return this.#maxEntries;
  }
  get size() {
    return this.#entries.size;
  }
  setMaxEntriesForTest(value) {
    this.#maxEntries = typeof value === "number" ? normalizeMaxEntries(value, this.#defaultMaxEntries) : this.#defaultMaxEntries;
    this.#evictOldestEntries();
  }
  clear() {
    this.#entries.clear();
  }
  /** Returns a cached value and refreshes its recency when present. */
  get(cacheKey) {
    const cached = this.getResult(cacheKey);
    return cached.hit ? cached.value : void 0;
  }
  /** Returns a hit/miss result and promotes hits to the newest LRU position. */
  getResult(cacheKey) {
    if (!this.#entries.has(cacheKey)) {
      return { hit: false };
    }
    const cached = this.#entries.get(cacheKey);
    this.#entries.delete(cacheKey);
    this.#entries.set(cacheKey, cached);
    return { hit: true, value: cached };
  }
  /** Stores a value as the newest entry and evicts oldest entries past capacity. */
  set(cacheKey, value) {
    if (this.#entries.has(cacheKey)) {
      this.#entries.delete(cacheKey);
    }
    this.#entries.set(cacheKey, value);
    this.#evictOldestEntries();
  }
  #evictOldestEntries() {
    while (this.#entries.size > this.#maxEntries) {
      const oldestEntry = this.#entries.keys().next();
      if (oldestEntry.done) {
        break;
      }
      this.#entries.delete(oldestEntry.value);
    }
  }
};
function normalizeMaxEntries(value, fallback) {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.max(1, Math.floor(value));
}
var schemaCache = new PluginLruCache(512);
var annotationOnlyFormats = [
  "date-time",
  "date",
  "duration",
  "email",
  "hostname",
  "idn-email",
  "idn-hostname",
  "ipv4",
  "ipv6",
  "iri-reference",
  "iri",
  "json-pointer-uri-fragment",
  "json-pointer",
  "regex",
  "relative-json-pointer",
  "time",
  "uri-reference",
  "uri-template",
  "url",
  "uuid"
];
function fingerprintSchema(schema) {
  return JSON.stringify(schema);
}
function schemaHasDefaults(schema) {
  if (!schema || typeof schema !== "object") {
    return false;
  }
  if (Array.isArray(schema)) {
    return schema.some((item) => schemaHasDefaults(item));
  }
  const record = schema;
  if (Object.hasOwn(record, "default")) {
    return true;
  }
  return Object.values(record).some((value) => schemaHasDefaults(value));
}
function cloneValidationValue(value) {
  if (value === void 0 || value === null) {
    return value;
  }
  return structuredClone(value);
}
function compileSchema(schema) {
  return Compile2(normalizeJsonSchemaForTypeBox(schema));
}
function relaxConditionalRequiredKeywords(schema, insideConditionalBranch = false) {
  if (Array.isArray(schema)) {
    return schema.map(
      (entry) => relaxConditionalRequiredKeywords(entry, insideConditionalBranch)
    );
  }
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  return Object.fromEntries(
    Object.entries(schema).filter(([key]) => !(insideConditionalBranch && key === "required")).map(([key, value]) => [
      key,
      typeof value === "boolean" || value && typeof value === "object" ? relaxConditionalRequiredKeywords(
        value,
        insideConditionalBranch || key === "then" || key === "else"
      ) : value
    ])
  );
}
function withPluginFormatSemantics(callback) {
  const previousFormats = Format.Entries();
  Format.Set("uri", (value) => URL.canParse(value));
  for (const format of annotationOnlyFormats) {
    Format.Set(format, () => true);
  }
  try {
    return callback();
  } finally {
    Format.Clear();
    for (const [format, check] of previousFormats) {
      Format.Set(format, check);
    }
  }
}
function checkSchema(validate, value) {
  return withPluginFormatSemantics(() => {
    if (validate.Check(value)) {
      return null;
    }
    return [...validate.Errors(value)];
  });
}
function applyDefaultsWithPluginFormatSemantics(schema, value) {
  return withPluginFormatSemantics(() => applyJsonSchemaDefaults(schema, value));
}
function isDefaultActivatedConditionalFailure(params) {
  const relaxedConditionalValidator = compileSchema(
    relaxConditionalRequiredKeywords(params.schema)
  );
  if (checkSchema(relaxedConditionalValidator, params.defaultedValue)) {
    return false;
  }
  const originalValidator = compileSchema(params.schema);
  return checkSchema(originalValidator, params.originalValue) === null;
}
function normalizeErrorPath(instancePath) {
  const path = instancePath?.replace(/^\//, "").replace(/\//g, ".");
  return path && path.length > 0 ? path : "<root>";
}
function appendPathSegment(path, segment) {
  const trimmed = segment.trim();
  if (!trimmed) {
    return path;
  }
  if (path === "<root>") {
    return trimmed;
  }
  return `${path}.${trimmed}`;
}
function firstStringParam(value) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (Array.isArray(value)) {
    const first = value.find(
      (entry) => typeof entry === "string" && entry.trim().length > 0
    );
    return first ?? null;
  }
  return null;
}
function resolveMissingProperty(error2) {
  if (error2.keyword !== "required" && error2.keyword !== "dependentRequired" && error2.keyword !== "dependencies") {
    return null;
  }
  return firstStringParam(error2.params?.missingProperty) ?? firstStringParam(error2.params?.requiredProperties) ?? firstStringParam(error2.params?.dependencies);
}
function resolveValidationErrorPath(error2) {
  const basePath = normalizeErrorPath(error2.instancePath);
  const missingProperty = resolveMissingProperty(error2);
  if (!missingProperty) {
    return basePath;
  }
  return appendPathSegment(basePath, missingProperty);
}
function extractAllowedValues(error2) {
  if (error2.keyword === "enum") {
    const allowedValues = error2.params?.allowedValues;
    return Array.isArray(allowedValues) ? allowedValues : null;
  }
  if (error2.keyword === "const") {
    const params = error2.params;
    if (!params || !Object.hasOwn(params, "allowedValue")) {
      return null;
    }
    return [params.allowedValue];
  }
  return null;
}
function getAllowedValuesSummary(error2) {
  const allowedValues = extractAllowedValues(error2);
  if (!allowedValues) {
    return null;
  }
  return summarizeAllowedValues(allowedValues);
}
function resolveAdditionalProperty(error2) {
  if (error2.keyword !== "additionalProperties") {
    return void 0;
  }
  return firstStringParam(error2.params?.additionalProperty) ?? void 0;
}
function resolveAdditionalProperties(error2) {
  if (error2.keyword !== "additionalProperties") {
    return [];
  }
  const additionalProperties = error2.params?.additionalProperties;
  if (Array.isArray(additionalProperties)) {
    return additionalProperties.filter((entry) => typeof entry === "string");
  }
  const additionalProperty = error2.params?.additionalProperty;
  return typeof additionalProperty === "string" ? [additionalProperty] : [];
}
function formatRequiredMessage(error2) {
  const missingProperty = resolveMissingProperty(error2);
  if (!missingProperty) {
    return null;
  }
  return `must have required property '${missingProperty}'`;
}
function formatAdditionalPropertiesMessage(error2) {
  const additionalProperties = resolveAdditionalProperties(error2);
  if (additionalProperties.length === 0) {
    return null;
  }
  const quoted = additionalProperties.map((entry) => `"${entry}"`).join(", ");
  return `must not have additional properties: ${quoted}`;
}
function formatValidationErrorMessage(error2) {
  return formatRequiredMessage(error2) ?? formatAdditionalPropertiesMessage(error2) ?? error2.message ?? "invalid";
}
function formatValidationErrors(errors) {
  if (!errors || errors.length === 0) {
    return [{ path: "<root>", message: "invalid config", text: "<root>: invalid config" }];
  }
  return errors.map((error2) => {
    const path = resolveValidationErrorPath(error2);
    const baseMessage = formatValidationErrorMessage(error2);
    const allowedValuesSummary = getAllowedValuesSummary(error2);
    const additionalProperty = resolveAdditionalProperty(error2);
    const message = allowedValuesSummary ? appendAllowedValuesHint(baseMessage, allowedValuesSummary) : baseMessage;
    const safePath = sanitizeTerminalText(path);
    const safeMessage = sanitizeTerminalText(message);
    return {
      path,
      message,
      text: `${safePath}: ${safeMessage}`,
      ...additionalProperty ? { additionalProperty } : {},
      ...allowedValuesSummary ? {
        allowedValues: allowedValuesSummary.values,
        allowedValuesHiddenCount: allowedValuesSummary.hiddenCount
      } : {}
    };
  });
}
function validateJsonSchemaValue(params) {
  const schemaError = findJsonSchemaShapeError(params.schema);
  if (schemaError) {
    throw new Error(sanitizeTerminalText(`invalid schema: ${schemaError}`));
  }
  const useCache = params.cache !== false;
  if (!useCache) {
    const validate = compileSchema(params.schema);
    const value2 = params.applyDefaults && schemaHasDefaults(params.schema) ? applyDefaultsWithPluginFormatSemantics(params.schema, cloneValidationValue(params.value)) : params.value;
    const errors2 = checkSchema(validate, value2);
    if (!errors2) {
      return { ok: true, value: value2 };
    }
    if (params.applyDefaults && value2 !== params.value && isDefaultActivatedConditionalFailure({
      schema: params.schema,
      originalValue: params.value,
      defaultedValue: value2
    })) {
      return { ok: true, value: value2 };
    }
    return { ok: false, errors: formatValidationErrors(errors2) };
  }
  const cacheKey = params.applyDefaults ? `${params.cacheKey}::defaults` : params.cacheKey;
  let cached = schemaCache.get(cacheKey);
  const schemaFingerprint = !cached || cached.schema !== params.schema ? fingerprintSchema(params.schema) : void 0;
  if (!cached || cached.schema !== params.schema && cached.schemaFingerprint !== schemaFingerprint) {
    const validate = compileSchema(params.schema);
    cached = {
      hasDefaults: params.applyDefaults ? schemaHasDefaults(params.schema) : false,
      validate,
      schema: params.schema,
      schemaFingerprint: schemaFingerprint ?? fingerprintSchema(params.schema)
    };
    schemaCache.set(cacheKey, cached);
  } else if (cached.schema !== params.schema) {
    cached.schema = params.schema;
  }
  const value = params.applyDefaults && cached.hasDefaults ? applyDefaultsWithPluginFormatSemantics(params.schema, cloneValidationValue(params.value)) : params.value;
  const errors = checkSchema(cached.validate, value);
  if (!errors) {
    return { ok: true, value };
  }
  if (params.applyDefaults && value !== params.value && isDefaultActivatedConditionalFailure({
    schema: params.schema,
    originalValue: params.value,
    defaultedValue: value
  })) {
    return { ok: true, value };
  }
  return { ok: false, errors: formatValidationErrors(errors) };
}
function error(message) {
  return { success: false, error: { issues: [{ path: [], message }] } };
}
function cloneIssue(issue) {
  return {
    path: issue.path.filter((segment) => {
      const kind = typeof segment;
      return kind === "string" || kind === "number";
    }),
    message: issue.message
  };
}
function safeParseRuntimeSchema(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) {
    return {
      success: true,
      data: result.data
    };
  }
  return {
    success: false,
    error: { issues: result.error.issues.map((issue) => cloneIssue(issue)) }
  };
}
function normalizeJsonSchema(schema) {
  if (Array.isArray(schema)) {
    return schema.map((item) => normalizeJsonSchema(item));
  }
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const record = { ...schema };
  delete record.$schema;
  for (const [key, value] of Object.entries(record)) {
    record[key] = normalizeJsonSchema(value);
  }
  const propertyNames = record.propertyNames;
  if (propertyNames && typeof propertyNames === "object" && !Array.isArray(propertyNames) && propertyNames.type === "string") {
    delete record.propertyNames;
  }
  if (Array.isArray(record.required) && record.required.length === 0) {
    delete record.required;
  }
  return record;
}
function toIssuePath(path) {
  if (!path || path === "<root>") {
    return [];
  }
  return path.split(".").map((segment) => {
    return parseConfigPathArrayIndex(segment) ?? segment;
  });
}
function safeParseJsonSchema(schema, cacheKey, value) {
  const result = validateJsonSchemaValue({
    schema,
    cacheKey,
    value,
    applyDefaults: true
  });
  if (result.ok) {
    return { success: true, data: result.value };
  }
  return {
    success: false,
    error: {
      issues: result.errors.map((issue) => ({
        path: toIssuePath(issue.path),
        message: issue.message
      }))
    }
  };
}
function buildJsonPluginConfigSchema(schema, options) {
  const safeParse = options?.safeParse ?? ((value) => safeParseJsonSchema(schema, options?.cacheKey ?? "plugin-config-schema:json", value));
  return {
    safeParse,
    ...options?.uiHints ? { uiHints: options.uiHints } : {},
    jsonSchema: normalizeJsonSchema(schema)
  };
}
function buildPluginConfigSchema(schema, options) {
  const schemaWithJson = schema;
  const safeParse = options?.safeParse ?? ((value) => safeParseRuntimeSchema(schema, value));
  if (typeof schemaWithJson.toJSONSchema === "function") {
    return {
      safeParse,
      ...options?.uiHints ? { uiHints: options.uiHints } : {},
      // Normalize generated schema so plugin consumers see a stable draft-07-ish shape.
      jsonSchema: normalizeJsonSchema(
        schemaWithJson.toJSONSchema({
          target: "draft-07",
          io: "input",
          unrepresentable: "any"
        })
      )
    };
  }
  return {
    safeParse,
    ...options?.uiHints ? { uiHints: options.uiHints } : {},
    jsonSchema: {
      type: "object",
      additionalProperties: true
    }
  };
}
function emptyPluginConfigSchema() {
  return {
    safeParse(value) {
      if (value === void 0) {
        return { success: true, data: void 0 };
      }
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return error("expected config object");
      }
      if (Object.keys(value).length > 0) {
        return error("config must be empty");
      }
      return { success: true, data: value };
    },
    jsonSchema: {
      type: "object",
      additionalProperties: false,
      properties: {}
    }
  };
}
function createCachedLazyValueGetter(value, fallback) {
  let resolved = false;
  let cached;
  return () => {
    if (!resolved) {
      const nextValue = typeof value === "function" ? value() : value;
      cached = nextValue ?? fallback;
      resolved = true;
    }
    return cached;
  };
}
var PLUGIN_HOOK_NAMES = [
  "before_model_resolve",
  "agent_turn_prepare",
  "before_prompt_build",
  "before_agent_reply",
  "model_call_started",
  "model_call_ended",
  "llm_input",
  "llm_output",
  "before_agent_finalize",
  "agent_end",
  "before_compaction",
  "after_compaction",
  "before_reset",
  "inbound_claim",
  "channel_pairing_requested",
  "message_received",
  "message_sending",
  "reply_payload_sending",
  "message_sent",
  "before_tool_call",
  "after_tool_call",
  "tool_result_persist",
  "before_message_write",
  "session_start",
  "session_end",
  "subagent_spawning",
  "subagent_delivery_target",
  "subagent_spawned",
  "subagent_progress",
  "subagent_ended",
  "deactivate",
  "gateway_start",
  "gateway_stop",
  "heartbeat_prompt_contribution",
  "cron_reconciled",
  "cron_changed",
  "before_dispatch",
  "reply_dispatch",
  "before_install",
  "before_agent_run",
  "resolve_exec_env"
];
var DEPRECATED_PLUGIN_HOOKS = {
  subagent_spawning: {
    replacement: "`subagent_spawned` for observation; core session bindings for routing",
    reason: "Core prepares thread-bound subagent bindings through channel session-binding adapters before `subagent_spawned` fires.",
    removeAfter: "2026-08-30"
  },
  deactivate: {
    replacement: "`gateway_stop`",
    reason: "`deactivate` is a legacy cleanup hook alias for `gateway_stop`.",
    removeAfter: "2026-08-16"
  }
};
var DEPRECATED_PLUGIN_HOOK_NAMES = Object.keys(
  DEPRECATED_PLUGIN_HOOKS
);
var deprecatedPluginHookNameSet = new Set(DEPRECATED_PLUGIN_HOOK_NAMES);
var pluginHookNameSet = new Set(PLUGIN_HOOK_NAMES);
var PROMPT_INJECTION_HOOK_NAMES = [
  "agent_turn_prepare",
  "before_prompt_build",
  "heartbeat_prompt_contribution"
];
var promptInjectionHookNameSet = new Set(PROMPT_INJECTION_HOOK_NAMES);
var CONVERSATION_HOOK_NAMES = [
  "before_model_resolve",
  "before_agent_reply",
  "llm_input",
  "llm_output",
  "before_agent_finalize",
  "agent_end",
  "before_agent_run"
];
var conversationHookNameSet = new Set(CONVERSATION_HOOK_NAMES);
var WorkerProviderError = class extends Error {
  constructor(message) {
    super(message);
    this.code = "invalid_profile";
    this.name = "WorkerProviderError";
  }
};
function definePluginEntry({
  id,
  name,
  description,
  kind,
  configSchema = emptyPluginConfigSchema,
  reload,
  nodeHostCommands,
  securityAuditCollectors,
  register
}) {
  const getConfigSchema = createCachedLazyValueGetter(configSchema);
  return {
    id,
    name,
    description,
    ...kind ? { kind } : {},
    ...reload ? { reload } : {},
    ...nodeHostCommands ? { nodeHostCommands } : {},
    ...securityAuditCollectors ? { securityAuditCollectors } : {},
    get configSchema() {
      return getConfigSchema();
    },
    register
  };
}
export {
  WorkerProviderError,
  buildJsonPluginConfigSchema,
  buildPluginConfigSchema,
  definePluginEntry,
  emptyPluginConfigSchema
};
