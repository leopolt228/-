var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

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

// packages/ai/src/providers/clean-for-gemini.ts
var GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
  "patternProperties",
  "additionalProperties",
  "$schema",
  "$id",
  "$ref",
  "$defs",
  "definitions",
  // Non-standard (OpenAPI) keyword; Claude validators reject it.
  "examples",
  // Cloud Code Assist appears to validate tool schemas more strictly/quirkily than
  // draft 2020-12 in practice; these constraints frequently trigger 400s.
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
  "multipleOf",
  "pattern",
  "format",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
  // JSON Schema composition keywords not supported by OpenAPI 3.0 subset.
  // `const` is handled separately (converted to enum) in the cleaning loop,
  // but `not` has no safe equivalent and must be stripped.
  "not"
]);
var SCHEMA_META_KEYS = ["description", "title", "default"];
function copySchemaMeta(from, to) {
  for (const key of SCHEMA_META_KEYS) {
    if (key in from && from[key] !== void 0) {
      to[key] = from[key];
    }
  }
}
function stringifyGeminiEnumValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  return void 0;
}
function cleanGeminiEnumValues(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  const values = value.flatMap((entry) => {
    const stringified = stringifyGeminiEnumValue(entry);
    return stringified === void 0 ? [] : [stringified];
  });
  const unique = [...new Set(values)];
  return unique.length > 0 ? unique : void 0;
}
function tryFlattenLiteralAnyOf(variants) {
  if (variants.length === 0) {
    return null;
  }
  const allValues = [];
  let commonType = null;
  for (const variant of variants) {
    if (!variant || typeof variant !== "object") {
      return null;
    }
    const v = variant;
    let literalValue;
    if ("const" in v) {
      literalValue = v.const;
    } else if (Array.isArray(v.enum) && v.enum.length === 1) {
      literalValue = v.enum[0];
    } else {
      return null;
    }
    const variantType = typeof v.type === "string" ? v.type : null;
    if (!variantType) {
      return null;
    }
    if (commonType === null) {
      commonType = variantType;
    } else if (commonType !== variantType) {
      return null;
    }
    allValues.push(literalValue);
  }
  if (commonType && allValues.length > 0) {
    return { type: commonType, enum: allValues };
  }
  return null;
}
function isNullSchema(variant) {
  if (!variant || typeof variant !== "object" || Array.isArray(variant)) {
    return false;
  }
  const record = variant;
  if ("const" in record && record.const === null) {
    return true;
  }
  if (Array.isArray(record.enum) && record.enum.length === 1) {
    return record.enum[0] === null;
  }
  const typeValue = record.type;
  if (typeValue === "null") {
    return true;
  }
  if (Array.isArray(typeValue) && typeValue.length === 1 && typeValue[0] === "null") {
    return true;
  }
  return false;
}
function stripNullVariants(variants) {
  if (variants.length === 0) {
    return { variants, stripped: false };
  }
  const nonNull = variants.filter((variant) => !isNullSchema(variant));
  return {
    variants: nonNull,
    stripped: nonNull.length !== variants.length
  };
}
function extendSchemaDefs(defs, schema) {
  const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
  const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
  if (!defsEntry && !legacyDefsEntry) {
    return defs;
  }
  const next = defs ? new Map(defs) : /* @__PURE__ */ new Map();
  if (defsEntry) {
    for (const [key, value] of Object.entries(defsEntry)) {
      next.set(key, value);
    }
  }
  if (legacyDefsEntry) {
    for (const [key, value] of Object.entries(legacyDefsEntry)) {
      next.set(key, value);
    }
  }
  return next;
}
function decodeJsonPointerSegment(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function tryResolveLocalRef(ref, defs) {
  if (!defs) {
    return void 0;
  }
  const match = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
  if (!match) {
    return void 0;
  }
  const name = decodeJsonPointerSegment(match[1] ?? "");
  if (!name) {
    return void 0;
  }
  return defs.get(name);
}
function simplifyUnionVariants(params) {
  const { obj, variants } = params;
  const { variants: nonNullVariants, stripped } = stripNullVariants(variants);
  const flattened = tryFlattenLiteralAnyOf(nonNullVariants);
  if (flattened) {
    const result = {
      type: flattened.type,
      enum: flattened.enum
    };
    copySchemaMeta(obj, result);
    return { variants: nonNullVariants, simplified: result };
  }
  if (stripped && nonNullVariants.length === 1) {
    const lone = nonNullVariants[0];
    if (lone && typeof lone === "object" && !Array.isArray(lone)) {
      const result = {
        ...lone
      };
      copySchemaMeta(obj, result);
      return { variants: nonNullVariants, simplified: result };
    }
    return { variants: nonNullVariants, simplified: lone };
  }
  return { variants: stripped ? nonNullVariants : variants };
}
function sanitizeRequiredFields(schema) {
  if (!Array.isArray(schema.required)) {
    return schema;
  }
  if (!schema.properties || typeof schema.properties !== "object" || Array.isArray(schema.properties)) {
    if (schema.type === "object") {
      delete schema.required;
    }
    return schema;
  }
  const properties = schema.properties;
  const required = schema.required.filter(
    (key) => typeof key === "string" && Object.hasOwn(properties, key)
  );
  if (required.length > 0) {
    schema.required = required;
  } else {
    delete schema.required;
  }
  return schema;
}
function cleanSchemaForGeminiWithDefs(schema, defs, refStack) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map((item) => cleanSchemaForGeminiWithDefs(item, defs, refStack));
  }
  const obj = schema;
  const nextDefs = extendSchemaDefs(defs, obj);
  const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
  if (refValue) {
    if (refStack?.has(refValue)) {
      return {};
    }
    const resolved = tryResolveLocalRef(refValue, nextDefs);
    if (resolved) {
      const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
      nextRefStack.add(refValue);
      const cleaned2 = cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack);
      if (!cleaned2 || typeof cleaned2 !== "object" || Array.isArray(cleaned2)) {
        return cleaned2;
      }
      const result2 = {
        ...cleaned2
      };
      copySchemaMeta(obj, result2);
      return result2;
    }
    const result = {};
    copySchemaMeta(obj, result);
    return result;
  }
  const hasAnyOf = "anyOf" in obj && Array.isArray(obj.anyOf);
  const hasOneOf = "oneOf" in obj && Array.isArray(obj.oneOf);
  let cleanedAnyOf = hasAnyOf ? obj.anyOf.map(
    (variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)
  ) : void 0;
  let cleanedOneOf = hasOneOf ? obj.oneOf.map(
    (variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)
  ) : void 0;
  if (hasAnyOf) {
    const simplified = simplifyUnionVariants({ obj, variants: cleanedAnyOf ?? [] });
    cleanedAnyOf = simplified.variants;
    if ("simplified" in simplified) {
      return simplified.simplified;
    }
  }
  if (hasOneOf) {
    const simplified = simplifyUnionVariants({ obj, variants: cleanedOneOf ?? [] });
    cleanedOneOf = simplified.variants;
    if ("simplified" in simplified) {
      return simplified.simplified;
    }
  }
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) {
      continue;
    }
    if (key === "const") {
      const enumValues = cleanGeminiEnumValues([value]);
      if (enumValues) {
        cleaned.enum = enumValues;
      }
      continue;
    }
    if (key === "enum") {
      const enumValues = cleanGeminiEnumValues(value);
      if (enumValues) {
        cleaned.enum = enumValues;
      }
      continue;
    }
    if (key === "required" && Array.isArray(value) && value.length === 0) {
      continue;
    }
    if (key === "type" && (hasAnyOf || hasOneOf)) {
      continue;
    }
    if (key === "type" && Array.isArray(value) && value.every((entry) => typeof entry === "string")) {
      const types = value.filter((entry) => entry !== "null");
      cleaned.type = types.length === 1 ? types[0] : types;
      continue;
    }
    if (key === "properties") {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const props = value;
        cleaned[key] = Object.fromEntries(
          Object.entries(props).map(([k, v]) => [
            k,
            cleanSchemaForGeminiWithDefs(v, nextDefs, refStack)
          ])
        );
      } else {
        cleaned[key] = {};
      }
    } else if (key === "items" && value) {
      if (Array.isArray(value)) {
        cleaned[key] = value.map(
          (entry) => cleanSchemaForGeminiWithDefs(entry, nextDefs, refStack)
        );
      } else if (typeof value === "object") {
        cleaned[key] = cleanSchemaForGeminiWithDefs(value, nextDefs, refStack);
      } else {
        cleaned[key] = value;
      }
    } else if (key === "anyOf" && Array.isArray(value)) {
      cleaned[key] = cleanedAnyOf ?? value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
    } else if (key === "oneOf" && Array.isArray(value)) {
      cleaned[key] = cleanedOneOf ?? value.map((variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack));
    } else if (key === "allOf" && Array.isArray(value)) {
      cleaned[key] = value.map(
        (variant) => cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack)
      );
    } else {
      cleaned[key] = value;
    }
  }
  if (cleaned.anyOf && Array.isArray(cleaned.anyOf)) {
    const flattened = flattenUnionFallback(cleaned, cleaned.anyOf);
    if (flattened) {
      return sanitizeRequiredFields(flattened);
    }
  }
  if (cleaned.oneOf && Array.isArray(cleaned.oneOf)) {
    const flattened = flattenUnionFallback(cleaned, cleaned.oneOf);
    if (flattened) {
      return sanitizeRequiredFields(flattened);
    }
  }
  return sanitizeRequiredFields(cleaned);
}
function flattenUnionFallback(obj, variants) {
  const objects = variants.filter(
    (v) => Boolean(v) && typeof v === "object"
  );
  if (objects.length === 0) {
    return void 0;
  }
  const types = new Set(objects.map((v) => v.type).filter(Boolean));
  if (objects.length === 1) {
    const merged2 = { ...objects[0] };
    copySchemaMeta(obj, merged2);
    return merged2;
  }
  if (types.size === 1) {
    const merged2 = { type: Array.from(types)[0] };
    copySchemaMeta(obj, merged2);
    return merged2;
  }
  const first = objects[0];
  if (first?.type) {
    const merged2 = { type: first.type };
    copySchemaMeta(obj, merged2);
    return merged2;
  }
  const merged = {};
  copySchemaMeta(obj, merged);
  return merged;
}
function cleanSchemaForGemini(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(cleanSchemaForGemini);
  }
  const defs = extendSchemaDefs(void 0, schema);
  return cleanSchemaForGeminiWithDefs(schema, defs, void 0);
}

// packages/ai/src/providers/schema-keyword-strip.ts
function stripUnsupportedSchemaKeywords(schema, unsupportedKeywords) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords));
  }
  const obj = schema;
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (unsupportedKeywords.has(key)) {
      continue;
    }
    if (key === "properties" && value && typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = Object.fromEntries(
        Object.entries(value).map(([childKey, childValue]) => [
          childKey,
          stripUnsupportedSchemaKeywords(childValue, unsupportedKeywords)
        ])
      );
      continue;
    }
    if (key === "items" && value && typeof value === "object") {
      cleaned[key] = Array.isArray(value) ? value.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords)) : stripUnsupportedSchemaKeywords(value, unsupportedKeywords);
      continue;
    }
    if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
      cleaned[key] = value.map(
        (entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords)
      );
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

// packages/ai/src/providers/agent-tools-parameter-schema.ts
function extractToolSchemaModelCompat(modelOrCompat) {
  if (!modelOrCompat || typeof modelOrCompat !== "object") {
    return void 0;
  }
  if ("compat" in modelOrCompat) {
    const compat = modelOrCompat.compat;
    return compat && typeof compat === "object" ? compat : void 0;
  }
  return modelOrCompat;
}
function resolveUnsupportedToolSchemaKeywords(modelOrCompat) {
  const keywords = extractToolSchemaModelCompat(modelOrCompat)?.unsupportedToolSchemaKeywords ?? [];
  return new Set(
    normalizeStringEntries(
      keywords.filter((keyword) => typeof keyword === "string")
    )
  );
}
function shouldOmitEmptyArrayItems(modelOrCompat) {
  return extractToolSchemaModelCompat(modelOrCompat)?.omitEmptyArrayItems === true;
}
var MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
var toolParameterSchemaCache = /* @__PURE__ */ new WeakMap();
function resolveToolParameterSchemaCacheKey(options) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
  const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
  const toolSchemaProfile = normalizeLowercaseStringOrEmpty(
    options?.modelCompat?.toolSchemaProfile
  );
  const unsupportedKeywords = Array.from(
    resolveUnsupportedToolSchemaKeywords(options?.modelCompat)
  ).toSorted();
  const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
  return JSON.stringify([
    normalizedProvider,
    normalizedModelId,
    toolSchemaProfile,
    unsupportedKeywords,
    omitEmptyArrayItems
  ]);
}
function getCachedToolParameterSchema(schema, key) {
  return toolParameterSchemaCache.get(schema)?.find((entry) => entry.key === key)?.value;
}
function rememberCachedToolParameterSchema(schema, key, value) {
  const entries = toolParameterSchemaCache.get(schema) ?? [];
  toolParameterSchemaCache.set(
    schema,
    [{ key, value }, ...entries.filter((entry) => entry.key !== key)].slice(
      0,
      MAX_TOOL_PARAMETER_SCHEMA_CACHE_ENTRIES_PER_SCHEMA
    )
  );
  return value;
}
function isGeminiModelId(modelId) {
  return /(?:^|[/:])gemini(?:$|[-/:.])/.test(modelId);
}
function extractEnumValues(schema) {
  if (!schema || typeof schema !== "object") {
    return void 0;
  }
  const record = schema;
  if (Array.isArray(record.enum)) {
    return record.enum;
  }
  if ("const" in record) {
    return [record.const];
  }
  const variants = Array.isArray(record.anyOf) ? record.anyOf : Array.isArray(record.oneOf) ? record.oneOf : null;
  if (variants) {
    const values = variants.flatMap((variant) => {
      const extracted = extractEnumValues(variant);
      return extracted ?? [];
    });
    return values.length > 0 ? values : void 0;
  }
  return void 0;
}
function mergePropertySchemas(existing, incoming) {
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  const existingEnum = extractEnumValues(existing);
  const incomingEnum = extractEnumValues(incoming);
  if (existingEnum || incomingEnum) {
    const values = uniqueValues([...existingEnum ?? [], ...incomingEnum ?? []]);
    const merged = {};
    for (const source of [existing, incoming]) {
      if (!source || typeof source !== "object") {
        continue;
      }
      const record = source;
      for (const key of ["title", "description", "default"]) {
        if (!(key in merged) && key in record) {
          merged[key] = record[key];
        }
      }
    }
    const types = new Set(values.map((value) => typeof value));
    if (types.size === 1) {
      merged.type = Array.from(types)[0];
    }
    merged.enum = values;
    return merged;
  }
  return existing;
}
function setOwnSchemaProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });
}
function hasTopLevelArrayKeyword(schemaRecord, key) {
  return Array.isArray(schemaRecord[key]);
}
function getFlattenableVariantKey(schemaRecord) {
  if (hasTopLevelArrayKeyword(schemaRecord, "anyOf")) {
    return "anyOf";
  }
  if (hasTopLevelArrayKeyword(schemaRecord, "oneOf")) {
    return "oneOf";
  }
  return null;
}
function getTopLevelConditionalKey(schemaRecord) {
  return getFlattenableVariantKey(schemaRecord) ?? (hasTopLevelArrayKeyword(schemaRecord, "allOf") ? "allOf" : null);
}
function hasTopLevelObjectSchema(schemaRecord, conditionalKey) {
  return schemaRecord.type === "object" && isRecord(schemaRecord.properties) && conditionalKey === null;
}
function isObjectLikeSchemaMissingType(schemaRecord, conditionalKey) {
  return !("type" in schemaRecord) && (isRecord(schemaRecord.properties) || Array.isArray(schemaRecord.required)) && conditionalKey === null;
}
function isTypedObjectSchemaMissingValidProperties(schemaRecord, conditionalKey) {
  return schemaRecord.type === "object" && !isRecord(schemaRecord.properties) && conditionalKey === null;
}
function isTrulyEmptySchema(schemaRecord) {
  return Object.keys(schemaRecord).length === 0;
}
function normalizeArraySchemasMissingItems(schema) {
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const nextSchema = { ...schema };
  if (nextSchema.type === "array" && nextSchema.items === void 0) {
    nextSchema.items = {};
    changed = true;
  }
  const normalizeSchemaValue = (key) => {
    if (!(key in nextSchema)) {
      return;
    }
    const value = nextSchema[key];
    if (Array.isArray(value)) {
      const normalized2 = value.map(normalizeArraySchemasMissingItems);
      if (normalized2.some((entry, index) => entry !== value[index])) {
        nextSchema[key] = normalized2;
        changed = true;
      }
      return;
    }
    const normalized = normalizeArraySchemasMissingItems(value);
    if (normalized !== value) {
      nextSchema[key] = normalized;
      changed = true;
    }
  };
  for (const key of [
    "items",
    "contains",
    "additionalProperties",
    "propertyNames",
    "not",
    "if",
    "then",
    "else"
  ]) {
    normalizeSchemaValue(key);
  }
  for (const key of ["anyOf", "oneOf", "allOf", "prefixItems"]) {
    normalizeSchemaValue(key);
  }
  for (const key of [
    "properties",
    "patternProperties",
    "dependentSchemas",
    "$defs",
    "definitions"
  ]) {
    const value = nextSchema[key];
    if (!isRecord(value)) {
      continue;
    }
    let entriesChanged = false;
    const normalizedEntries = Object.entries(value).map(
      ([entryKey, entryValue]) => {
        const normalizedEntryValue = normalizeArraySchemasMissingItems(entryValue);
        if (normalizedEntryValue !== entryValue) {
          entriesChanged = true;
        }
        return [entryKey, normalizedEntryValue];
      }
    );
    if (entriesChanged) {
      nextSchema[key] = Object.fromEntries(normalizedEntries);
      changed = true;
    }
  }
  return changed ? nextSchema : schema;
}
function schemaAllowsArrayType(schema) {
  const type = schema.type;
  return type === "array" || Array.isArray(type) && type.includes("array");
}
var ARRAY_ITEMS_SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then"
]);
var ARRAY_ITEMS_SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
var ARRAY_ITEMS_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
function stripEmptyArrayItemsFromArraySchemas(schema) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const entries2 = schema.map((entry) => {
      const next = stripEmptyArrayItemsFromArraySchemas(entry);
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? entries2 : schema;
  }
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const entries = Object.entries(schema).flatMap(([key, value]) => {
    if (key === "items" && schemaAllowsArrayType(schema) && isRecord(value) && isTrulyEmptySchema(value)) {
      changed = true;
      return [];
    }
    if (ARRAY_ITEMS_SCHEMA_OBJECT_KEYS.has(key)) {
      const next = stripEmptyArrayItemsFromArraySchemas(value);
      changed ||= next !== value;
      return [[key, next]];
    }
    if (ARRAY_ITEMS_SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      const next = stripEmptyArrayItemsFromArraySchemas(value);
      changed ||= next !== value;
      return [[key, next]];
    }
    if (ARRAY_ITEMS_SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
      let mapChanged = false;
      const next = Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => {
          const entryNext = stripEmptyArrayItemsFromArraySchemas(entryValue);
          mapChanged ||= entryNext !== entryValue;
          return [entryKey, entryNext];
        })
      );
      changed ||= mapChanged;
      return [[key, mapChanged ? next : value]];
    }
    return [[key, value]];
  });
  return changed ? Object.fromEntries(entries) : schema;
}
function copySchemaMeta2(from, to) {
  for (const key of ["title", "description", "default"]) {
    if (key in from && from[key] !== void 0) {
      to[key] = from[key];
    }
  }
}
function extendSchemaDefs2(defs, schema) {
  const defsEntry = schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs) ? schema.$defs : void 0;
  const legacyDefsEntry = schema.definitions && typeof schema.definitions === "object" && !Array.isArray(schema.definitions) ? schema.definitions : void 0;
  if (!defsEntry && !legacyDefsEntry) {
    return defs;
  }
  const next = defs ? {
    $defs: new Map(defs.$defs),
    definitions: new Map(defs.definitions)
  } : {
    $defs: /* @__PURE__ */ new Map(),
    definitions: /* @__PURE__ */ new Map()
  };
  if (defsEntry) {
    for (const [key, value] of Object.entries(defsEntry)) {
      next.$defs.set(key, value);
    }
  }
  if (legacyDefsEntry) {
    for (const [key, value] of Object.entries(legacyDefsEntry)) {
      next.definitions.set(key, value);
    }
  }
  return next;
}
function decodeJsonPointerSegment2(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function resolveJsonPointerPath(value, segments) {
  let current = value;
  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    const key = decodeJsonPointerSegment2(segment);
    if (Array.isArray(current)) {
      const index = /^(?:0|[1-9]\d*)$/.test(key) ? Number(key) : -1;
      if (index < 0 || index >= current.length) {
        return void 0;
      }
      current = current[index];
      continue;
    }
    const record = current;
    if (!Object.hasOwn(record, key)) {
      return void 0;
    }
    current = record[key];
  }
  return current;
}
function resolveLocalJsonPointer(rootDocument, ref) {
  if (!ref.startsWith("#/")) {
    return void 0;
  }
  return resolveJsonPointerPath(rootDocument, ref.slice(2).split("/"));
}
var SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
var SCHEMA_OBJECT_KEYS = /* @__PURE__ */ new Set([
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then"
]);
var SCHEMA_ARRAY_KEYS = /* @__PURE__ */ new Set(["allOf", "anyOf", "items", "oneOf", "prefixItems"]);
var SCHEMA_LITERAL_KEYS = /* @__PURE__ */ new Set(["const", "default", "enum", "examples"]);
function tryResolveLocalRef2(ref, defs, rootDocument) {
  const match = ref.match(/^#\/(\$defs|definitions)\/([^/]+)(?:\/(.*))?$/);
  if (match && defs) {
    const namespace = match[1] === "$defs" ? defs.$defs : defs.definitions;
    const name = decodeJsonPointerSegment2(match[2] ?? "");
    const resolved = name ? namespace.get(name) : void 0;
    if (resolved !== void 0) {
      const remainingPath = match[3] ? match[3].split("/") : [];
      return resolveJsonPointerPath(resolved, remainingPath);
    }
  }
  return resolveLocalJsonPointer(rootDocument, ref);
}
function inlineLocalSchemaRefsWithDefs(schema, defs, refStack, state, rootDocument) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(
      (entry) => inlineLocalSchemaRefsWithDefs(entry, defs, refStack, state, rootDocument)
    );
  }
  const obj = schema;
  const nextDefs = extendSchemaDefs2(defs, obj);
  const refValue = typeof obj.$ref === "string" ? obj.$ref : void 0;
  if (refValue) {
    if (refStack?.has(refValue)) {
      return {};
    }
    const resolved = tryResolveLocalRef2(refValue, nextDefs, rootDocument);
    if (resolved === void 0) {
      if (refValue.startsWith("#/")) {
        state.unresolvedLocalRefs = true;
      }
      return { ...obj };
    }
    const nextRefStack = refStack ? new Set(refStack) : /* @__PURE__ */ new Set();
    nextRefStack.add(refValue);
    const inlined = inlineLocalSchemaRefsWithDefs(
      resolved,
      nextDefs,
      nextRefStack,
      state,
      rootDocument
    );
    if (!inlined || typeof inlined !== "object" || Array.isArray(inlined)) {
      return inlined;
    }
    const result2 = { ...inlined };
    copySchemaMeta2(obj, result2);
    if (obj.nullable === true) {
      result2.nullable = true;
    }
    return result2;
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$defs" || key === "definitions" || key === "components") {
      continue;
    }
    if (SCHEMA_LITERAL_KEYS.has(key)) {
      setOwnSchemaProperty(result, key, value);
      continue;
    }
    if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
      setOwnSchemaProperty(
        result,
        key,
        Object.fromEntries(
          Object.entries(value).map(([entryKey, entryValue]) => [
            entryKey,
            inlineLocalSchemaRefsWithDefs(entryValue, nextDefs, refStack, state, rootDocument)
          ])
        )
      );
      continue;
    }
    if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) {
      setOwnSchemaProperty(
        result,
        key,
        inlineLocalSchemaRefsWithDefs(value, nextDefs, refStack, state, rootDocument)
      );
      continue;
    }
    if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      setOwnSchemaProperty(
        result,
        key,
        value.map(
          (entry) => inlineLocalSchemaRefsWithDefs(entry, nextDefs, refStack, state, rootDocument)
        )
      );
      continue;
    }
    setOwnSchemaProperty(result, key, value);
  }
  if (state.unresolvedLocalRefs) {
    if ("$defs" in obj) {
      result.$defs = obj.$defs;
    }
    if ("definitions" in obj) {
      result.definitions = obj.definitions;
    }
    if ("components" in obj) {
      result.components = obj.components;
    }
  }
  return result;
}
function inlineLocalToolSchemaRefs(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const defs = extendSchemaDefs2(void 0, schema);
  return inlineLocalSchemaRefsWithDefs(
    schema,
    defs,
    void 0,
    {
      unresolvedLocalRefs: false
    },
    schema
  );
}
var OPENAPI_SCHEMA_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
  "discriminator",
  "externalDocs",
  "readOnly",
  "writeOnly",
  "xml",
  "example"
]);
function appendNullSchemaType(type) {
  if (type === "null") {
    return type;
  }
  if (typeof type === "string") {
    return [type, "null"];
  }
  if (Array.isArray(type)) {
    return type.includes("null") ? type : [...type, "null"];
  }
  return type;
}
function isNullSchemaLike(schema) {
  if (!isRecord(schema)) {
    return false;
  }
  if (schema.type === "null") {
    return true;
  }
  if (Array.isArray(schema.type) && schema.type.includes("null")) {
    return true;
  }
  if ("const" in schema && schema.const === null) {
    return true;
  }
  return Array.isArray(schema.enum) && schema.enum.includes(null);
}
function hasOpenApiComposition(schema) {
  return ["allOf", "anyOf", "oneOf"].some((key) => Array.isArray(schema[key]));
}
function schemaCompositionAlreadyAllowsNull(schema) {
  return Array.isArray(schema.anyOf) && schema.anyOf.some(isNullSchemaLike) || Array.isArray(schema.oneOf) && schema.oneOf.some(isNullSchemaLike);
}
function wrapNullableComposedSchema(schema) {
  if (schemaCompositionAlreadyAllowsNull(schema)) {
    return schema;
  }
  const wrapped = {
    anyOf: [schema, { type: "null" }]
  };
  copySchemaMeta2(schema, wrapped);
  return wrapped;
}
function normalizeOpenApiSchemaKeywords(schema) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const normalized2 = schema.map((entry) => {
      const next = normalizeOpenApiSchemaKeywords(entry);
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? normalized2 : schema;
  }
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const nullable = schema.nullable === true;
  const normalized = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "nullable" || OPENAPI_SCHEMA_ANNOTATION_KEYS.has(key)) {
      changed = true;
      continue;
    }
    if (SCHEMA_LITERAL_KEYS.has(key)) {
      normalized[key] = value;
      continue;
    }
    if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) {
      let mapChanged = false;
      const next = Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => {
          const nextEntry = normalizeOpenApiSchemaKeywords(entryValue);
          mapChanged ||= nextEntry !== entryValue;
          return [entryKey, nextEntry];
        })
      );
      normalized[key] = mapChanged ? next : value;
      changed ||= mapChanged;
      continue;
    }
    if (key === "components") {
      normalized[key] = value;
      continue;
    }
    if (SCHEMA_OBJECT_KEYS.has(key) && isRecord(value)) {
      const next = normalizeOpenApiSchemaKeywords(value);
      normalized[key] = next;
      changed ||= next !== value;
      continue;
    }
    if (SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      const next = value.map(normalizeOpenApiSchemaKeywords);
      normalized[key] = next;
      changed ||= next.some((entry, index) => entry !== value[index]);
      continue;
    }
    normalized[key] = value;
  }
  if (nullable) {
    if (hasOpenApiComposition(normalized)) {
      return wrapNullableComposedSchema(normalized);
    }
    if ("type" in normalized) {
      const nextType = appendNullSchemaType(normalized.type);
      if (nextType !== normalized.type) {
        normalized.type = nextType;
      }
    }
    if (Array.isArray(normalized.enum) && !normalized.enum.includes(null)) {
      normalized.enum = [...normalized.enum, null];
    }
  }
  return changed || nullable ? normalized : schema;
}
function normalizeToolParameterSchemaUncached(schema, options) {
  const inlinedSchema = normalizeOpenApiSchemaKeywords(inlineLocalToolSchemaRefs(schema));
  const schemaRecord = inlinedSchema && typeof inlinedSchema === "object" ? inlinedSchema : void 0;
  if (!schemaRecord) {
    return inlinedSchema;
  }
  const normalizedProvider = normalizeLowercaseStringOrEmpty(options?.modelProvider);
  const normalizedModelId = normalizeLowercaseStringOrEmpty(options?.modelId);
  const normalizedToolSchemaProfile = normalizeLowercaseStringOrEmpty(
    options?.modelCompat?.toolSchemaProfile
  );
  const isGeminiProvider = normalizedProvider.includes("google") || normalizedProvider.includes("gemini") || isGeminiModelId(normalizedModelId) || normalizedToolSchemaProfile === "gemini";
  const isAnthropicProvider = normalizedProvider.includes("anthropic");
  const unsupportedToolSchemaKeywords = resolveUnsupportedToolSchemaKeywords(options?.modelCompat);
  const omitEmptyArrayItems = shouldOmitEmptyArrayItems(options?.modelCompat);
  function applyProviderCleaning(s) {
    const normalizedSchema = normalizeArraySchemasMissingItems(s);
    const arrayItemsCompatibleSchema = omitEmptyArrayItems ? stripEmptyArrayItemsFromArraySchemas(normalizedSchema) : normalizedSchema;
    if (isGeminiProvider && !isAnthropicProvider) {
      const geminiCompatibleSchema = cleanSchemaForGemini(arrayItemsCompatibleSchema);
      return unsupportedToolSchemaKeywords.size > 0 ? stripUnsupportedSchemaKeywords(
        geminiCompatibleSchema,
        unsupportedToolSchemaKeywords
      ) : geminiCompatibleSchema;
    }
    if (unsupportedToolSchemaKeywords.size > 0) {
      return stripUnsupportedSchemaKeywords(
        arrayItemsCompatibleSchema,
        unsupportedToolSchemaKeywords
      );
    }
    return arrayItemsCompatibleSchema;
  }
  const conditionalKey = getTopLevelConditionalKey(schemaRecord);
  const flattenableVariantKey = getFlattenableVariantKey(schemaRecord);
  if (hasTopLevelObjectSchema(schemaRecord, conditionalKey)) {
    return applyProviderCleaning(schemaRecord);
  }
  if (isObjectLikeSchemaMissingType(schemaRecord, conditionalKey)) {
    return applyProviderCleaning({
      ...schemaRecord,
      type: "object",
      properties: isRecord(schemaRecord.properties) ? schemaRecord.properties : {}
    });
  }
  if (isTypedObjectSchemaMissingValidProperties(schemaRecord, conditionalKey)) {
    return applyProviderCleaning({ ...schemaRecord, properties: {} });
  }
  if (!flattenableVariantKey) {
    if (isTrulyEmptySchema(schemaRecord)) {
      return applyProviderCleaning({ type: "object", properties: {} });
    }
    if (conditionalKey === "allOf") {
      return applyProviderCleaning(inlinedSchema);
    }
    return applyProviderCleaning(inlinedSchema);
  }
  const variants = schemaRecord[flattenableVariantKey];
  const mergedProperties = {};
  const requiredCounts = /* @__PURE__ */ new Map();
  let objectVariants = 0;
  for (const entry of variants) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const props = entry.properties;
    if (!props || typeof props !== "object") {
      continue;
    }
    objectVariants += 1;
    for (const [key, value] of Object.entries(props)) {
      if (!(key in mergedProperties)) {
        mergedProperties[key] = value;
        continue;
      }
      mergedProperties[key] = mergePropertySchemas(mergedProperties[key], value);
    }
    const required = Array.isArray(entry.required) ? entry.required : [];
    for (const key of required) {
      if (typeof key !== "string") {
        continue;
      }
      requiredCounts.set(key, (requiredCounts.get(key) ?? 0) + 1);
    }
  }
  const baseRequired = Array.isArray(schemaRecord.required) ? schemaRecord.required.filter((key) => typeof key === "string") : void 0;
  const mergedRequired = baseRequired && baseRequired.length > 0 ? baseRequired : objectVariants > 0 ? Array.from(requiredCounts.entries()).filter(([, count]) => count === objectVariants).map(([key]) => key) : void 0;
  const nextSchema = { ...schemaRecord };
  const flattenedSchema = {
    type: "object",
    ...typeof nextSchema.title === "string" ? { title: nextSchema.title } : {},
    ...typeof nextSchema.description === "string" ? { description: nextSchema.description } : {},
    properties: Object.keys(mergedProperties).length > 0 ? mergedProperties : schemaRecord.properties ?? {},
    ...mergedRequired && mergedRequired.length > 0 ? { required: mergedRequired } : {},
    additionalProperties: "additionalProperties" in schemaRecord ? schemaRecord.additionalProperties : true
  };
  return applyProviderCleaning(flattenedSchema);
}
function normalizeToolParameterSchema(schema, options) {
  if (!schema || typeof schema !== "object") {
    return normalizeToolParameterSchemaUncached(schema, options);
  }
  const cacheKey = resolveToolParameterSchemaCacheKey(options);
  const cached = getCachedToolParameterSchema(schema, cacheKey);
  if (cached) {
    return cached;
  }
  return rememberCachedToolParameterSchema(
    schema,
    cacheKey,
    normalizeToolParameterSchemaUncached(schema, options)
  );
}

// packages/ai/src/providers/azure-deployment-map.ts
function parseAzureDeploymentNameMap(value) {
  const map = /* @__PURE__ */ new Map();
  if (!value) {
    return map;
  }
  for (const entry of value.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const modelId = trimmed.slice(0, separator).trim();
    const deploymentName = trimmed.slice(separator + 1).trim();
    if (!modelId || !deploymentName) {
      continue;
    }
    map.set(modelId, deploymentName);
  }
  return map;
}
var cachedDeploymentLookup;
function getDeploymentLookup(source) {
  const cached = cachedDeploymentLookup;
  if (cached && cached.source === source) {
    return cached;
  }
  const exact = parseAzureDeploymentNameMap(source);
  const folded = /* @__PURE__ */ new Map();
  for (const [modelId, deploymentName] of exact) {
    folded.set(modelId.toLowerCase(), deploymentName);
  }
  cachedDeploymentLookup = { source, exact, folded };
  return cachedDeploymentLookup;
}
function resolveAzureDeploymentNameFromMap(params) {
  const { exact, folded } = getDeploymentLookup(params.deploymentMap);
  return exact.get(params.modelId) ?? folded.get(params.modelId.toLowerCase()) ?? params.modelId;
}

// packages/ai/src/providers/azure-openai-responses-client-compat.ts
function isTraditionalAzureOpenAIHost(hostname) {
  return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) {
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    return false;
  }
  if (isTraditionalAzureOpenAIHost(url.hostname)) {
    return false;
  }
  const hostname = url.hostname.toLowerCase();
  const isFoundryHost = hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".api.cognitive.microsoft.com");
  if (!isFoundryHost) {
    return false;
  }
  const normalizedPath = url.pathname.replace(/\/+$/, "");
  return normalizedPath === "/openai/v1" || normalizedPath.endsWith("/openai/v1");
}

// packages/ai/src/providers/openai-completions.ts
import OpenAI from "openai";

// packages/ai/src/env-api-keys.ts
var existsSync = null;
var homedir = null;
var join = null;
var dynamicImport = (specifier) => import(specifier);
var NODE_FS_SPECIFIER = "node:fs";
var NODE_OS_SPECIFIER = "node:os";
var NODE_PATH_SPECIFIER = "node:path";
function loadNodeBuiltinModule(specifier) {
  const getBuiltinModule = typeof process !== "undefined" ? process : void 0;
  if (typeof getBuiltinModule?.getBuiltinModule === "function") {
    return getBuiltinModule.getBuiltinModule(specifier);
  }
  if (typeof __require === "function") {
    return __require(specifier);
  }
  return null;
}
function loadNodeHelpersSync() {
  try {
    const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
    const osModule = loadNodeBuiltinModule(NODE_OS_SPECIFIER);
    const pathModule = loadNodeBuiltinModule(NODE_PATH_SPECIFIER);
    existsSync ??= fsModule?.existsSync ?? null;
    homedir ??= osModule?.homedir ?? null;
    join ??= pathModule?.join ?? null;
    if (!existsSync || !homedir || !join) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
if (typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) {
  if (!loadNodeHelpersSync()) {
    void dynamicImport(NODE_FS_SPECIFIER).then((m) => {
      existsSync = m.existsSync;
    });
    void dynamicImport(NODE_OS_SPECIFIER).then((m) => {
      homedir = m.homedir;
    });
    void dynamicImport(NODE_PATH_SPECIFIER).then((m) => {
      join = m.join;
    });
  }
}
var procEnvCache = null;
function getProcessEnv() {
  return typeof process === "undefined" ? void 0 : process.env;
}
function getProcEnv(key) {
  if (typeof process === "undefined" || !process.versions?.bun) {
    return void 0;
  }
  const env = getProcessEnv();
  if (!env) {
    return void 0;
  }
  if (Object.keys(env).length > 0) {
    return void 0;
  }
  if (procEnvCache === null) {
    procEnvCache = /* @__PURE__ */ new Map();
    try {
      const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
      if (!fsModule) {
        return void 0;
      }
      const data = fsModule.readFileSync("/proc/self/environ", "utf-8");
      for (const entry of data.split("\0")) {
        const idx = entry.indexOf("=");
        if (idx > 0) {
          procEnvCache.set(entry.slice(0, idx), entry.slice(idx + 1));
        }
      }
    } catch {
    }
  }
  return procEnvCache.get(key);
}
function getEnvValue(key) {
  return (getProcessEnv()?.[key] || getProcEnv(key))?.trim() || void 0;
}
var cachedVertexAdcCredentialsExists = null;
function hasVertexAdcCredentials() {
  if (cachedVertexAdcCredentialsExists === null) {
    if (!existsSync || !homedir || !join) {
      const isNode = typeof process !== "undefined" && (process.versions?.node || process.versions?.bun);
      if (!isNode || !loadNodeHelpersSync()) {
        return false;
      }
    }
    const nodeExistsSync = existsSync;
    const nodeHomedir = homedir;
    const nodeJoin = join;
    if (!nodeExistsSync || !nodeHomedir || !nodeJoin) {
      return false;
    }
    const gacPath = getEnvValue("GOOGLE_APPLICATION_CREDENTIALS");
    if (gacPath) {
      cachedVertexAdcCredentialsExists = nodeExistsSync(gacPath) ? true : null;
    } else {
      cachedVertexAdcCredentialsExists = nodeExistsSync(
        nodeJoin(nodeHomedir(), ".config", "gcloud", "application_default_credentials.json")
      ) ? true : null;
    }
  }
  return cachedVertexAdcCredentialsExists === true;
}
function getApiKeyEnvVars(provider) {
  if (provider === "github-copilot") {
    return ["COPILOT_GITHUB_TOKEN"];
  }
  if (provider === "anthropic") {
    return ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"];
  }
  if (provider === "moonshot") {
    return ["MOONSHOT_API_KEY", "KIMI_API_KEY"];
  }
  if (provider === "kimi" || provider === "kimi-coding") {
    return ["KIMI_API_KEY", "KIMICODE_API_KEY"];
  }
  const envMap = {
    openai: "OPENAI_API_KEY",
    meta: "MODEL_API_KEY",
    "azure-openai-responses": "AZURE_OPENAI_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    google: "GEMINI_API_KEY",
    "google-vertex": "GOOGLE_CLOUD_API_KEY",
    groq: "GROQ_API_KEY",
    cerebras: "CEREBRAS_API_KEY",
    xai: "XAI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    "vercel-ai-gateway": "AI_GATEWAY_API_KEY",
    zai: "ZAI_API_KEY",
    mistral: "MISTRAL_API_KEY",
    minimax: "MINIMAX_API_KEY",
    "minimax-cn": "MINIMAX_CN_API_KEY",
    moonshotai: "MOONSHOT_API_KEY",
    "moonshotai-cn": "MOONSHOT_API_KEY",
    huggingface: "HF_TOKEN",
    fireworks: "FIREWORKS_API_KEY",
    together: "TOGETHER_API_KEY",
    opencode: "OPENCODE_API_KEY",
    "opencode-go": "OPENCODE_API_KEY",
    "cloudflare-workers-ai": "CLOUDFLARE_API_KEY",
    "cloudflare-ai-gateway": "CLOUDFLARE_API_KEY",
    xiaomi: "XIAOMI_API_KEY",
    "xiaomi-token-plan-cn": "XIAOMI_TOKEN_PLAN_CN_API_KEY",
    "xiaomi-token-plan-ams": "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
    "xiaomi-token-plan-sgp": "XIAOMI_TOKEN_PLAN_SGP_API_KEY"
  };
  const envVar = envMap[provider];
  return envVar ? [envVar] : void 0;
}
function findEnvKeys(provider) {
  const envVars = getApiKeyEnvVars(provider);
  if (!envVars) {
    return void 0;
  }
  const found = envVars.filter((envVar) => Boolean(getEnvValue(envVar)));
  return found.length > 0 ? found : void 0;
}
function getEnvApiKey(provider) {
  const envKeys = findEnvKeys(provider);
  if (envKeys?.[0]) {
    return getEnvValue(envKeys[0]);
  }
  if (provider === "google-vertex") {
    const hasCredentials = hasVertexAdcCredentials();
    const hasProject = Boolean(
      getEnvValue("GOOGLE_CLOUD_PROJECT") || getEnvValue("GCLOUD_PROJECT")
    );
    const hasLocation = Boolean(getEnvValue("GOOGLE_CLOUD_LOCATION"));
    if (hasCredentials && hasProject && hasLocation) {
      return "<authenticated>";
    }
  }
  if (provider === "amazon-bedrock") {
    if (getEnvValue("AWS_PROFILE") || getEnvValue("AWS_ACCESS_KEY_ID") && getEnvValue("AWS_SECRET_ACCESS_KEY") || getEnvValue("AWS_BEARER_TOKEN_BEDROCK") || getEnvValue("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") || getEnvValue("AWS_CONTAINER_CREDENTIALS_FULL_URI") || getEnvValue("AWS_WEB_IDENTITY_TOKEN_FILE")) {
      return "<authenticated>";
    }
  }
  return void 0;
}

// packages/ai/src/host.ts
var inertAiTransportHost = {
  buildModelFetch: () => void 0,
  resolveSecretSentinel: (value) => value,
  redactSecrets: (value) => value,
  redactToolPayloadText: (text) => text,
  resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
  logDebug: () => {
  }
};
var activeAiTransportHost = inertAiTransportHost;
function getAiTransportHost() {
  return activeAiTransportHost;
}

// packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
  const normalized = modelId?.trim().toLowerCase() ?? "";
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
function resolveClaudeModelIdentity(ref) {
  const configuredCanonicalModelId = typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0;
  const normalized = normalizeClaudeModelId(configuredCanonicalModelId ?? ref.id);
  const match = /(?:^|[-/])claude-/.exec(normalized);
  return match ? normalized.slice((match.index ?? 0) + (match[0].startsWith("claude-") ? 0 : 1)) : normalized;
}
function resolveClaudeFable5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function resolveClaudeMythos5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-mythos-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function requiresClaudeMandatoryAdaptiveThinking(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
function resolveClaudeSonnet5ModelIdentity(ref) {
  const normalized = resolveClaudeModelIdentity(ref);
  const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
  if (!match) {
    return void 0;
  }
  return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
function supportsClaudeNativeMaxEffort(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(
    modelId
  );
}
function supportsClaudeNativeXhighEffort(ref) {
  const modelId = resolveClaudeModelIdentity(ref);
  return /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8)|sonnet-5)(?=$|[^a-z0-9])/.test(modelId);
}
function resolveClaudeNativeThinkingLevelMap(ref) {
  if (ref.thinkingLevelMap !== void 0) {
    return ref.thinkingLevelMap;
  }
  if (!supportsClaudeNativeMaxEffort(ref)) {
    return void 0;
  }
  return {
    xhigh: supportsClaudeNativeXhighEffort(ref) ? "xhigh" : null,
    max: "max"
  };
}

// packages/llm-core/src/utils/event-stream.ts
var EventStream = class {
  constructor(isComplete, extractResult) {
    this.queue = [];
    this.waiting = [];
    this.done = false;
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    const resolvers = [];
    this.finalResultPromise = new Promise((resolve) => {
      resolvers.push(resolve);
    });
    const resolveFinalResult = resolvers.at(0);
    if (!resolveFinalResult) {
      throw new Error("event stream result promise did not initialize its resolver");
    }
    this.resolveFinalResult = resolveFinalResult;
  }
  push(event) {
    if (this.done) {
      return;
    }
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.shift();
    if (waiter) {
      waiter({ value: event, done: false });
    } else {
      this.queue.push(event);
    }
  }
  end(result) {
    this.done = true;
    if (result !== void 0) {
      this.resolveFinalResult(result);
    }
    while (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      if (!waiter) {
        break;
      }
      waiter({ value: void 0, done: true });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (this.queue.length > 0) {
        for (const event of this.queue.splice(0, 1)) {
          yield event;
        }
      } else if (this.done) {
        return;
      } else {
        const result = await new Promise((resolve) => {
          this.waiting.push(resolve);
        });
        if (result.done) {
          return;
        }
        yield result.value;
      }
    }
  }
  result() {
    return this.finalResultPromise;
  }
};
var AssistantMessageEventStream = class extends EventStream {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") {
          return event.message;
        } else if (event.type === "error") {
          return event.error;
        }
        throw new Error("Unexpected event type for final result");
      }
    );
  }
};

// packages/llm-core/src/validation.ts
import { Compile } from "typebox/compile";
var MAX_JSON_COERCE_LENGTH = 64 * 1024;

// packages/ai/src/model-utils.ts
function calculateCost(model, usage) {
  const cacheWrite1h = Math.min(usage.cacheWrite, Math.max(0, usage.cacheWrite1h ?? 0));
  const cacheWrite5m = usage.cacheWrite - cacheWrite1h;
  usage.cost.input = model.cost.input / 1e6 * usage.input;
  usage.cost.output = model.cost.output / 1e6 * usage.output;
  usage.cost.cacheRead = model.cost.cacheRead / 1e6 * usage.cacheRead;
  usage.cost.cacheWrite = (model.cost.cacheWrite * cacheWrite5m + model.cost.input * 2 * cacheWrite1h) / 1e6;
  usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
  return usage.cost;
}
function applyProviderReportedUsageCost(usage, reportedCost) {
  if (typeof reportedCost !== "number" || !Number.isFinite(reportedCost) || reportedCost < 0) {
    return;
  }
  usage.cost.total = reportedCost;
  usage.cost.totalOrigin = "provider-billed";
}
var EXTENDED_THINKING_LEVELS = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
];
function resolveThinkingLevelMap(model) {
  return model.api === "anthropic-messages" ? resolveClaudeNativeThinkingLevelMap(model) ?? model.thinkingLevelMap : model.thinkingLevelMap;
}
function getSupportedThinkingLevels(model) {
  const mandatoryAdaptiveContract = model.api === "anthropic-messages" && requiresClaudeMandatoryAdaptiveThinking(model);
  if (!model.reasoning && !mandatoryAdaptiveContract) {
    return ["off"];
  }
  const thinkingLevelMap = resolveThinkingLevelMap(model);
  return EXTENDED_THINKING_LEVELS.filter((level) => {
    const mapped = thinkingLevelMap?.[level];
    if (mapped === null) {
      return false;
    }
    if (level === "xhigh" || level === "max") {
      return mapped !== void 0;
    }
    return true;
  });
}
function clampThinkingLevel(model, level) {
  const availableLevels = getSupportedThinkingLevels(model);
  if (availableLevels.includes(level)) {
    return level;
  }
  const requestedIndex = EXTENDED_THINKING_LEVELS.indexOf(level);
  if (requestedIndex === -1) {
    return availableLevels[0] ?? "off";
  }
  const thinkingLevelMap = resolveThinkingLevelMap(model);
  if ((level === "xhigh" || level === "max") && thinkingLevelMap?.[level] === null) {
    for (const candidate of EXTENDED_THINKING_LEVELS.slice(0, requestedIndex).toReversed()) {
      if (availableLevels.includes(candidate)) {
        return candidate;
      }
    }
  }
  for (const candidate of EXTENDED_THINKING_LEVELS.slice(requestedIndex)) {
    if (availableLevels.includes(candidate)) {
      return candidate;
    }
  }
  for (const candidate of EXTENDED_THINKING_LEVELS.slice(0, requestedIndex).toReversed()) {
    if (availableLevels.includes(candidate)) {
      return candidate;
    }
  }
  return availableLevels[0] ?? "off";
}

// packages/ai/src/utils/headers.ts
function headersToRecord(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
}

// packages/ai/src/utils/json-parse.ts
import { parse as partialParse } from "partial-json";
var VALID_JSON_ESCAPES = /* @__PURE__ */ new Set(['"', "\\", "/", "b", "f", "n", "r", "t", "u"]);
var JSON_CONTROL_ESCAPES = /* @__PURE__ */ new Set(["b", "f", "n", "r", "t"]);
function isControlCharacter(char) {
  const codePoint = char.codePointAt(0);
  return codePoint !== void 0 && codePoint >= 0 && codePoint <= 31;
}
function escapeControlCharacter(char) {
  switch (char) {
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`;
  }
}
function repairJson(json) {
  let repaired = "";
  let inString = false;
  let stringValuePrefix = "";
  for (let index = 0; index < json.length; index++) {
    const char = json.charAt(index);
    if (!inString) {
      repaired += char;
      if (char === '"') {
        inString = true;
        stringValuePrefix = "";
      }
      continue;
    }
    if (char === '"') {
      repaired += char;
      inString = false;
      stringValuePrefix = "";
      continue;
    }
    if (char === "\\") {
      const nextChar = json.charAt(index + 1);
      if (!nextChar) {
        repaired += "\\\\";
        continue;
      }
      if (nextChar === "u") {
        const unicodeDigits = json.slice(index + 2, index + 6);
        if (/^[0-9a-fA-F]{4}$/.test(unicodeDigits)) {
          repaired += `\\u${unicodeDigits}`;
          stringValuePrefix += `\\u${unicodeDigits}`;
          index += 5;
          continue;
        }
        repaired += "\\\\";
        stringValuePrefix += "\\";
        continue;
      }
      if (JSON_CONTROL_ESCAPES.has(nextChar) && looksLikeWindowsPathPrefix(stringValuePrefix)) {
        repaired += "\\\\";
        stringValuePrefix += "\\";
        continue;
      }
      if (VALID_JSON_ESCAPES.has(nextChar)) {
        repaired += `\\${nextChar}`;
        stringValuePrefix += nextChar === "\\" ? "\\" : `\\${nextChar}`;
        index += 1;
        continue;
      }
      repaired += "\\\\";
      stringValuePrefix += "\\";
      continue;
    }
    repaired += isControlCharacter(char) ? escapeControlCharacter(char) : char;
    stringValuePrefix += char;
  }
  return repaired;
}
function parseJsonWithRepair(json) {
  return JSON.parse(repairJson(json));
}
function looksLikeWindowsPathPrefix(prefix) {
  const tail = prefix.slice(-160);
  return /(?:^|[^A-Za-z0-9])[A-Za-z]:(?:[\\/][^"\\/:*?<>|\r\n]*)*$/.test(tail);
}
function asStreamingJsonRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function parseStreamingJson(partialJson) {
  if (!partialJson || partialJson.trim() === "") {
    return {};
  }
  try {
    return asStreamingJsonRecord(parseJsonWithRepair(partialJson));
  } catch {
    try {
      return asStreamingJsonRecord(partialParse(partialJson));
    } catch {
      try {
        return asStreamingJsonRecord(partialParse(repairJson(partialJson)));
      } catch {
        return {};
      }
    }
  }
}

// packages/ai/src/utils/provider-error.ts
var MAX_ERROR_BODY_LENGTH = 4e3;
function stringify(value) {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
function readStatus(error) {
  for (const value of [
    error.status,
    error.statusCode,
    error.response?.status,
    error.response?.statusCode
  ]) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return void 0;
}
function readBody(error) {
  for (const value of [error.body, error.error, error.response?.body, error.response?.data]) {
    if (value === void 0 || value === null) {
      continue;
    }
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
      continue;
    }
    const body = (typeof value === "string" ? value : stringify(value)).trim();
    if (body.length > 0) {
      return body.length <= MAX_ERROR_BODY_LENGTH ? body : `${body.slice(0, MAX_ERROR_BODY_LENGTH)}... [truncated]`;
    }
  }
  return void 0;
}
function formatProviderError(error) {
  if (!(error instanceof Error)) {
    return stringify(error);
  }
  const httpError = error;
  const status = readStatus(httpError);
  const body = readBody(httpError);
  if (status === void 0 || body === void 0 || error.message.includes(body)) {
    return error.message;
  }
  return `${status}: ${body}`;
}

// packages/markdown-core/src/fences.ts
function scanFenceSpans(buffer, state) {
  const spans = [];
  const startsAtLineStart = state?.atLineStart ?? true;
  let open = state?.open ? { ...state.open, start: 0 } : void 0;
  let offset = 0;
  while (offset <= buffer.length) {
    const nextNewline = buffer.indexOf("\n", offset);
    const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
    const line = buffer.slice(offset, lineEnd).replace(/\r$/, "");
    const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (match && (offset > 0 || startsAtLineStart)) {
      const [, indent, marker, trailing] = match;
      if (indent === void 0 || marker === void 0 || trailing === void 0) {
        if (nextNewline === -1) {
          break;
        }
        offset = nextNewline + 1;
        continue;
      }
      const markerChar = marker.charAt(0);
      const markerLen = marker.length;
      if (!open) {
        open = {
          start: offset,
          markerChar,
          markerLen,
          openLine: line,
          marker,
          indent
        };
      } else if (open.markerChar === markerChar && markerLen >= open.markerLen && /^[ \t]*$/.test(trailing)) {
        const end = lineEnd;
        spans.push({
          start: open.start,
          end,
          openLine: open.openLine,
          marker: open.marker,
          indent: open.indent
        });
        open = void 0;
      }
    }
    if (nextNewline === -1) {
      break;
    }
    offset = nextNewline + 1;
  }
  if (open) {
    spans.push({
      start: open.start,
      end: buffer.length,
      openLine: open.openLine,
      marker: open.marker,
      indent: open.indent
    });
  }
  const atLineStart = buffer.length === 0 ? startsAtLineStart : buffer.endsWith("\n");
  const nextState = {
    atLineStart,
    ...open ? {
      open: {
        markerChar: open.markerChar,
        markerLen: open.markerLen,
        openLine: open.openLine,
        marker: open.marker,
        indent: open.indent
      }
    } : {}
  };
  return { spans, state: nextState };
}

// packages/markdown-core/src/code-spans.ts
function createInlineCodeState() {
  return { open: false, ticks: 0 };
}
function buildCodeSpanIndex(text, inlineState, fenceState) {
  const { spans: fenceSpans, state: nextFenceState } = scanFenceSpans(text, fenceState);
  const startState = inlineState ? { open: inlineState.open, ticks: inlineState.ticks } : createInlineCodeState();
  const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(
    text,
    fenceSpans,
    startState
  );
  return {
    inlineState: nextInlineState,
    fenceState: nextFenceState,
    isInside: (index) => isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans)
  };
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
  const spans = [];
  let open = initialState.open;
  let ticks = initialState.ticks;
  let openStart = open ? 0 : -1;
  let i = 0;
  while (i < text.length) {
    const fence = findFenceSpanAtInclusive(fenceSpans, i);
    if (fence) {
      i = fence.end;
      continue;
    }
    if (text[i] !== "`") {
      i += 1;
      continue;
    }
    const runStart = i;
    let runLength = 0;
    while (i < text.length && text[i] === "`") {
      runLength += 1;
      i += 1;
    }
    if (!open) {
      open = true;
      ticks = runLength;
      openStart = runStart;
      continue;
    }
    if (runLength === ticks) {
      spans.push([openStart, i]);
      open = false;
      ticks = 0;
      openStart = -1;
    }
  }
  if (open) {
    spans.push([openStart, text.length]);
  }
  return {
    spans,
    state: { open, ticks }
  };
}
function findFenceSpanAtInclusive(spans, index) {
  return spans.find((span) => index >= span.start && index < span.end);
}
function isInsideFenceSpan(index, spans) {
  return spans.some((span) => index >= span.start && index < span.end);
}
function isInsideInlineSpan(index, spans) {
  return spans.some(([start, end]) => index >= start && index < end);
}

// packages/ai/src/utils/reasoning-tag-text-partitioner.ts
var REASONING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought|reasoning)|antthinking)\b[^<>]*>/gi;
var REASONING_TAG_NAMES = [
  "think",
  "thinking",
  "thought",
  "reasoning",
  "antthinking",
  "antml:think",
  "antml:thinking",
  "antml:thought",
  "antml:reasoning",
  "mm:think",
  "mm:thinking",
  "mm:thought",
  "mm:reasoning"
];
function createReasoningTagTextPartitioner() {
  let buffer = "";
  let reasoningDepth = 0;
  let strictMode = false;
  let emittedVisibleText = false;
  let inlineCodeState = createInlineCodeState();
  let fenceState;
  let hiddenInlineCodeState = createInlineCodeState();
  let hiddenFenceState;
  let recoverableOpenTagText;
  const consume = (final, recoverFullUnclosed) => {
    const output = [];
    const emit = (kind, text) => {
      if (!text) {
        return;
      }
      if (kind === "text" && text.trim().length > 0) {
        emittedVisibleText = true;
      }
      if (kind === "text") {
        const nextCode = buildCodeSpanIndex(text, inlineCodeState, fenceState);
        inlineCodeState = nextCode.inlineState;
        fenceState = nextCode.fenceState;
      } else {
        const nextCode = buildCodeSpanIndex(text, hiddenInlineCodeState, hiddenFenceState);
        hiddenInlineCodeState = nextCode.inlineState;
        hiddenFenceState = nextCode.fenceState;
      }
      const previous = output[output.length - 1];
      if (previous?.kind === kind) {
        previous.text += text;
        return;
      }
      output.push({ kind, text });
    };
    while (buffer) {
      const activeInlineCodeState = reasoningDepth === 0 ? inlineCodeState : hiddenInlineCodeState;
      const activeFenceState = reasoningDepth === 0 ? fenceState : hiddenFenceState;
      const codeSpans = buildCodeSpanIndex(buffer, activeInlineCodeState, activeFenceState);
      const hasUnclosedCode = reasoningDepth === 0 && Boolean(codeSpans.inlineState.open || codeSpans.fenceState.open);
      const hasRawReasoning = hasRawReasoningTag(buffer);
      const tag = findNextReasoningTag(
        buffer,
        (index) => final && hasUnclosedCode && hasRawReasoning ? false : codeSpans.isInside(index)
      );
      if (!tag) {
        if (final) {
          const recoverAsText = reasoningDepth > 0 && recoverFullUnclosed && !hasRawReasoningCloseTag(buffer);
          const recoveredText = recoverAsText && recoverableOpenTagText ? recoverableOpenTagText + buffer : buffer;
          emit(reasoningDepth > 0 && !recoverAsText ? "thinking" : "text", recoveredText);
          buffer = "";
          reasoningDepth = 0;
          recoverableOpenTagText = void 0;
          return output;
        }
        if (reasoningDepth > 0 && recoverFullUnclosed && (!emittedVisibleText || recoverableOpenTagText)) {
          return output;
        }
        if (hasUnclosedCode && hasRawReasoning) {
          const openCodeIndex = inlineCodeState.open || fenceState?.open ? 0 : findOpenCodeContextStart(buffer);
          if (openCodeIndex !== -1) {
            emit("text", buffer.slice(0, openCodeIndex));
            buffer = buffer.slice(openCodeIndex);
            return output;
          }
        }
        const trailingFenceStart = findTrailingFenceFragmentStart(
          buffer,
          activeInlineCodeState,
          activeFenceState
        );
        if (trailingFenceStart !== -1) {
          emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, trailingFenceStart));
          buffer = buffer.slice(trailingFenceStart);
          return output;
        }
        const keepFrom = reasoningTagPrefixSuffixIndex(
          buffer,
          (index) => codeSpans.isInside(index)
        );
        if (keepFrom === -1) {
          emit(reasoningDepth > 0 ? "thinking" : "text", buffer);
          buffer = "";
          return output;
        }
        if (reasoningDepth === 0 && keepFrom > 0 && buffer.slice(0, keepFrom).trim().length > 0 && isReasoningCloseTagPrefix(buffer.slice(keepFrom))) {
          return output;
        }
        if (keepFrom > 0) {
          emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, keepFrom));
          buffer = buffer.slice(keepFrom);
        }
        return output;
      }
      const beforeTag = buffer.slice(0, tag.index);
      const afterTag = buffer.slice(tag.index + tag.text.length);
      if (tag.isClose && reasoningDepth === 0) {
        if (recoverFullUnclosed && beforeTag.trim().length > 0 && afterTag.trim().length > 0) {
          emit("text", beforeTag + tag.text);
          buffer = afterTag;
          continue;
        }
        if (beforeTag.trim().length > 0 && afterTag.trim().length === 0 && !final) {
          return output;
        }
        if (beforeTag.trim().length === 0 || afterTag.trim().length === 0) {
          emit("text", beforeTag);
        }
        buffer = afterTag;
        continue;
      }
      emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, tag.index));
      buffer = afterTag;
      if (tag.isClose) {
        reasoningDepth = Math.max(0, reasoningDepth - 1);
        if (reasoningDepth === 0) {
          recoverableOpenTagText = void 0;
          hiddenInlineCodeState = createInlineCodeState();
          hiddenFenceState = void 0;
        }
      } else {
        if (reasoningDepth === 0) {
          recoverableOpenTagText = recoverFullUnclosed && emittedVisibleText ? tag.text : void 0;
          hiddenInlineCodeState = createInlineCodeState();
          hiddenFenceState = void 0;
        }
        reasoningDepth += 1;
      }
    }
    return output;
  };
  return {
    markStrict() {
      strictMode = true;
    },
    push(chunk) {
      strictMode = true;
      buffer += chunk;
      return consume(false, false);
    },
    pushVisible(chunk) {
      buffer += chunk;
      return consume(false, true);
    },
    flush() {
      return consume(true, !strictMode);
    },
    hasPending() {
      return buffer.length > 0 || reasoningDepth > 0;
    },
    isInsideReasoning() {
      return reasoningDepth > 0;
    }
  };
}
function hasRawReasoningTag(text) {
  REASONING_TAG_RE.lastIndex = 0;
  return REASONING_TAG_RE.test(text);
}
function hasRawReasoningCloseTag(text) {
  REASONING_TAG_RE.lastIndex = 0;
  for (; ; ) {
    const match = REASONING_TAG_RE.exec(text);
    if (!match) {
      return false;
    }
    if (match[1] === "/") {
      return true;
    }
  }
}
function findNextReasoningTag(text, isIndexInsideCode) {
  REASONING_TAG_RE.lastIndex = 0;
  for (; ; ) {
    const match = REASONING_TAG_RE.exec(text);
    if (!match) {
      return null;
    }
    if (!isIndexInsideCode(match.index)) {
      return {
        index: match.index,
        text: match[0],
        isClose: match[1] === "/"
      };
    }
  }
}
function reasoningTagPrefixSuffixIndex(text, isIndexInsideCode) {
  for (let index = text.lastIndexOf("<"); index >= 0; ) {
    if (!isIndexInsideCode(index) && isReasoningTagPrefix(text.slice(index))) {
      return index;
    }
    if (index === 0) {
      break;
    }
    index = text.lastIndexOf("<", index - 1);
  }
  return -1;
}
function isReasoningTagPrefix(text) {
  const name = normalizeReasoningTagPrefixName(text);
  return REASONING_TAG_NAMES.some((tagName) => {
    if (tagName.startsWith(name)) {
      return true;
    }
    if (!name.startsWith(tagName)) {
      return false;
    }
    const rest = name.slice(tagName.length);
    return rest.length === 0 || /^[\s/>]/.test(rest);
  });
}
function isReasoningCloseTagPrefix(text) {
  const normalized = text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase();
  return normalized.startsWith("</") && isReasoningTagPrefix(text);
}
function normalizeReasoningTagPrefixName(text) {
  const normalized = text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase();
  const rawName = normalized.startsWith("</") ? normalized.slice(2) : normalized.slice(1);
  return rawName.trimStart();
}
function findOpenCodeContextStart(text) {
  const fence = findOpenFenceStart(text);
  const inline = findOpenInlineCodeStart(text);
  if (fence === -1) {
    return inline;
  }
  if (inline === -1) {
    return fence;
  }
  return Math.min(fence, inline);
}
function findOpenInlineCodeStart(text) {
  let openStart = -1;
  let openTicks = 0;
  let index = 0;
  while (index < text.length) {
    if (text.charAt(index) !== "`") {
      index += 1;
      continue;
    }
    const runStart = index;
    let runLength = 0;
    while (index < text.length && text.charAt(index) === "`") {
      runLength += 1;
      index += 1;
    }
    if (openStart === -1) {
      openStart = runStart;
      openTicks = runLength;
    } else if (runLength === openTicks) {
      openStart = -1;
      openTicks = 0;
    }
  }
  return openStart;
}
function findOpenFenceStart(text) {
  const fenceRe = /(^|\n)(```|~~~)[^\n]*(?:\n|$)/g;
  let open = null;
  for (const match of text.matchAll(fenceRe)) {
    const prefix = match.at(1);
    const marker = match.at(2);
    if (prefix === void 0 || marker === void 0) {
      continue;
    }
    const index = (match.index ?? 0) + prefix.length;
    if (open !== null && open.marker === marker) {
      open = null;
    } else if (!open) {
      open = { marker, index };
    }
  }
  return open?.index ?? -1;
}
function findTrailingFenceFragmentStart(text, inlineState, fenceState) {
  if (inlineState.open || fenceState?.open) {
    return -1;
  }
  const lineStart = Math.max(text.lastIndexOf("\n") + 1, 0);
  const line = text.slice(lineStart);
  const match = line.match(/^( {0,3})(`{1,2}|~{1,2})$/);
  return match ? lineStart : -1;
}

// packages/ai/src/utils/sanitize-unicode.ts
function sanitizeSurrogates(text) {
  return text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

// packages/normalization-core/src/number-coercion.ts
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
var MAX_TIMER_TIMEOUT_MS = 2147e6;
var MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
function clampTimerTimeoutMs(valueMs, minMs = 1) {
  const value = asFiniteNumber(valueMs);
  if (value === void 0) {
    return void 0;
  }
  const min = Math.max(1, Math.floor(minMs));
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}

// packages/ai/src/utils/stream-first-event-timeout.ts
function getFirstStreamEventTimeoutMs(options) {
  return options?.firstEventTimeoutMs;
}
function getFirstStreamEventTimeoutHandler(options) {
  return options?.onFirstEventTimeout;
}
function formatOptionalField(name, value) {
  return value ? ` ${name}=${value}` : "";
}
function createFirstStreamEventTimeoutError(context) {
  const stage = context.stage ? `${context.stage} ` : "";
  const details = [
    formatOptionalField("provider", context.provider),
    formatOptionalField("api", context.api),
    formatOptionalField("model", context.model)
  ].join("");
  return new Error(
    `${stage}HTTP stream opened but did not deliver a first SSE event within ${context.timeoutMs}ms after streaming headers (first-event timeout).${details}` + (context.hint ? ` ${context.hint}` : "")
  );
}
function createFirstStreamEventAbortController(parentSignal) {
  const controller = new AbortController();
  const abortFromParent = () => {
    if (!controller.signal.aborted) {
      controller.abort(parentSignal?.reason);
    }
  };
  if (parentSignal?.aborted) {
    abortFromParent();
  } else {
    parentSignal?.addEventListener("abort", abortFromParent, { once: true });
  }
  return {
    signal: controller.signal,
    abort(reason) {
      if (!controller.signal.aborted) {
        controller.abort(reason);
      }
    },
    dispose() {
      parentSignal?.removeEventListener("abort", abortFromParent);
    }
  };
}
function withFirstStreamEventTimeout(stream, context) {
  const timeoutMs = clampTimerTimeoutMs(context.timeoutMs);
  if (timeoutMs === void 0 || context.timeoutMs <= 0) {
    return stream;
  }
  const timeoutContext = { ...context, timeoutMs };
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = stream[Symbol.asyncIterator]();
      let timer;
      let completed = false;
      const clear = () => {
        if (timer) {
          clearTimeout(timer);
          timer = void 0;
        }
      };
      try {
        const first = await new Promise((resolve, reject) => {
          timer = setTimeout(() => {
            const timeoutError = createFirstStreamEventTimeoutError(timeoutContext);
            timeoutContext.onTimeout?.(timeoutError);
            timeoutContext.abort?.(timeoutError);
            reject(timeoutError);
          }, timeoutMs);
          timer.unref?.();
          iterator.next().then(resolve, reject);
        }).finally(clear);
        if (first.done) {
          completed = true;
          return;
        }
        yield first.value;
        for (; ; ) {
          const next = await iterator.next();
          if (next.done) {
            completed = true;
            return;
          }
          yield next.value;
        }
      } finally {
        clear();
        if (!completed) {
          void iterator.return?.().catch(() => void 0);
        }
      }
    }
  };
}

// packages/ai/src/utils/system-prompt-cache-boundary.ts
var SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
function stripSystemPromptCacheBoundary(text) {
  return text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
}
function splitSystemPromptCacheBoundary(text) {
  const boundaryIndex = text.indexOf(SYSTEM_PROMPT_CACHE_BOUNDARY);
  if (boundaryIndex === -1) {
    return void 0;
  }
  return {
    stablePrefix: text.slice(0, boundaryIndex).trimEnd(),
    dynamicSuffix: text.slice(boundaryIndex + SYSTEM_PROMPT_CACHE_BOUNDARY.length).trimStart()
  };
}

// packages/ai/src/providers/cache-retention.ts
function resolveCacheRetention(cacheRetention) {
  if (cacheRetention) {
    return cacheRetention;
  }
  if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") {
    return "long";
  }
  return "short";
}

// packages/ai/src/providers/cloudflare.ts
function isCloudflareProvider(provider) {
  return provider === "cloudflare-workers-ai" || provider === "cloudflare-ai-gateway";
}
function resolveCloudflareBaseUrl(model) {
  const url = model.baseUrl;
  if (!url.includes("{")) {
    return url;
  }
  const baseUrl = url.replace(/\{([A-Z_][A-Z0-9_]*)\}/g, (_match, name) => {
    const value = process.env[name];
    if (!value) {
      throw new Error(`${name} is required for provider ${model.provider} but is not set.`);
    }
    return value;
  });
  return baseUrl;
}

// packages/ai/src/providers/github-copilot-headers.ts
function inferCopilotInitiator(messages) {
  const last = messages[messages.length - 1];
  return last && last.role !== "user" ? "agent" : "user";
}
function hasCopilotVisionInput(messages) {
  return messages.some((msg) => {
    if (msg.role === "user" && Array.isArray(msg.content)) {
      return msg.content.some((c) => c.type === "image");
    }
    if (msg.role === "toolResult" && Array.isArray(msg.content)) {
      return msg.content.some((c) => c.type === "image");
    }
    return false;
  });
}
function buildCopilotDynamicHeaders(params) {
  const headers = {
    "X-Initiator": inferCopilotInitiator(params.messages),
    "Openai-Intent": "conversation-edits"
  };
  if (params.hasImages) {
    headers["Copilot-Vision-Request"] = "true";
  }
  return headers;
}

// packages/ai/src/providers/openai-prompt-cache.ts
var OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
function clampOpenAIPromptCacheKey(key) {
  if (key === void 0) {
    return void 0;
  }
  const chars = Array.from(key);
  if (chars.length <= OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH) {
    return key;
  }
  return chars.slice(0, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH).join("");
}

// packages/ai/src/providers/openai-stop-reason.ts
function mapOpenAIStopReason(reason, options) {
  if (reason === null) {
    return { stopReason: "stop" };
  }
  switch (reason) {
    case "stop":
    case "end":
      return { stopReason: "stop" };
    case "length":
      return { stopReason: "length" };
    case "function_call":
    case "tool_calls":
      return { stopReason: "toolUse" };
    case "tool_call":
      if (options?.allowSingularToolCall) {
        return { stopReason: "toolUse" };
      }
      break;
    case "content_filter":
      return { stopReason: "error", errorMessage: "Provider finish_reason: content_filter" };
    case "network_error":
      return { stopReason: "error", errorMessage: "Provider finish_reason: network_error" };
  }
  return {
    stopReason: "error",
    errorMessage: `Provider finish_reason: ${reason}`
  };
}

// packages/ai/src/providers/tool-schema-json-projection.ts
import { types as utilTypes } from "node:util";
function isJsonValue(value) {
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case "boolean":
    case "string":
      return true;
    case "number":
      return Number.isFinite(value);
    case "object":
      if (Array.isArray(value)) {
        return value.every(isJsonValue);
      }
      return Object.values(value).every(isJsonValue);
    default:
      return false;
  }
}
function isJsonObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isNonFiniteNumberValue(value) {
  if (typeof value === "number") {
    return !Number.isFinite(value);
  }
  if (value === null || typeof value !== "object" || !utilTypes.isNumberObject(value)) {
    return false;
  }
  return !Number.isFinite(Number.prototype.valueOf.call(value));
}
function serializeToolInputSchema(value, path) {
  const nonFiniteNumber = {
    path: null
  };
  const paths = /* @__PURE__ */ new WeakMap();
  let isRoot = true;
  let text;
  try {
    text = JSON.stringify(value, function(key, entry) {
      const holderPath = paths.get(this);
      const entryPath = isRoot ? path : holderPath === void 0 ? `${path}.${key}` : Array.isArray(this) ? `${holderPath}[${key}]` : `${holderPath}.${key}`;
      isRoot = false;
      if (nonFiniteNumber.path === null && isNonFiniteNumberValue(entry)) {
        nonFiniteNumber.path = entryPath;
      } else if (entry && typeof entry === "object") {
        paths.set(entry, entryPath);
      }
      return entry;
    });
  } catch {
    return {
      schema: {},
      violations: [`${path} is not JSON-serializable`]
    };
  }
  if (!text) {
    return {
      schema: {},
      violations: [`${path} is not JSON-serializable`]
    };
  }
  if (nonFiniteNumber.path !== null) {
    const violationPath = nonFiniteNumber.path;
    return {
      schema: {},
      violations: [`${violationPath} is not JSON-serializable`]
    };
  }
  const parsed = JSON.parse(text);
  if (!isJsonValue(parsed)) {
    return {
      schema: {},
      violations: [`${path} is not a JSON value`]
    };
  }
  return {
    schema: parsed,
    violations: []
  };
}
var schemaMapKeywords = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependencies",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
function findDynamicSchemaKeywordViolations(schema, path) {
  if (Array.isArray(schema)) {
    return schema.flatMap(
      (entry, index) => findDynamicSchemaKeywordViolations(entry, `${path}[${index}]`)
    );
  }
  if (!isJsonObject(schema)) {
    return [];
  }
  const violations = [];
  for (const key of ["$dynamicRef", "$dynamicAnchor"]) {
    if (key in schema) {
      violations.push(`${path}.${key}`);
    }
  }
  for (const [key, value] of Object.entries(schema)) {
    if (!value || typeof value !== "object") {
      continue;
    }
    if (schemaMapKeywords.has(key) && isJsonObject(value)) {
      for (const [schemaName, childSchema] of Object.entries(value)) {
        violations.push(
          ...findDynamicSchemaKeywordViolations(childSchema, `${path}.${key}.${schemaName}`)
        );
      }
    } else {
      violations.push(...findDynamicSchemaKeywordViolations(value, `${path}.${key}`));
    }
  }
  return violations;
}
function projectRuntimeToolInputSchema(schema, path = "parameters") {
  const projection = serializeToolInputSchema(schema, path);
  const violations = [...projection.violations];
  if (!isJsonObject(projection.schema)) {
    violations.push(`${path} must be a JSON object schema`);
  } else if (projection.schema.type !== void 0 && projection.schema.type !== "object") {
    violations.push(`${path}.type must be "object"`);
  }
  violations.push(...findDynamicSchemaKeywordViolations(projection.schema, path));
  return {
    schema: projection.schema,
    violations
  };
}

// packages/ai/src/providers/openai-tool-projection.ts
function unreadableToolDiagnostic(toolIndex) {
  return {
    toolIndex,
    violations: [`tool[${toolIndex}] is unreadable`]
  };
}
function projectOpenAITools(tools) {
  let inputToolCount;
  try {
    inputToolCount = tools.length;
  } catch {
    return {
      inputToolCount: 0,
      tools: [],
      diagnostics: [unreadableToolDiagnostic(0)]
    };
  }
  const projectedTools = [];
  const diagnostics = [];
  for (let toolIndex = 0; toolIndex < inputToolCount; toolIndex += 1) {
    let tool;
    try {
      const candidate = tools[toolIndex];
      if (!candidate) {
        diagnostics.push(unreadableToolDiagnostic(toolIndex));
        continue;
      }
      tool = candidate;
    } catch {
      diagnostics.push(unreadableToolDiagnostic(toolIndex));
      continue;
    }
    let name;
    try {
      name = tool.name;
    } catch {
      diagnostics.push({
        toolIndex,
        violations: [`tool[${toolIndex}].name is unreadable`]
      });
      continue;
    }
    if (typeof name !== "string" || !name) {
      diagnostics.push({
        toolIndex,
        violations: [`tool[${toolIndex}].name is empty`]
      });
      continue;
    }
    let parameters;
    try {
      parameters = tool.parameters;
    } catch {
      diagnostics.push({
        toolIndex,
        toolName: name,
        violations: [`${name}.parameters is unreadable`]
      });
      continue;
    }
    const schemaProjection = projectRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`);
    if (!isRecord(schemaProjection.schema) || schemaProjection.violations.length > 0) {
      diagnostics.push({
        toolIndex,
        toolName: name,
        violations: schemaProjection.violations.length > 0 ? schemaProjection.violations : [`${name}.parameters must be a JSON object schema`]
      });
      continue;
    }
    let descriptionValue;
    try {
      descriptionValue = tool.description;
    } catch {
    }
    const description = typeof descriptionValue === "string" ? descriptionValue : void 0;
    projectedTools.push({
      toolIndex,
      name,
      ...description !== void 0 ? { description } : {},
      parameters: schemaProjection.schema
    });
  }
  return {
    inputToolCount,
    tools: projectedTools,
    diagnostics
  };
}
function requireProjectedFunction(name, projection, choiceLabel) {
  if (!projection.tools.some((tool) => tool.name === name)) {
    throw new Error(`${choiceLabel} requested unavailable tool "${name}" after schema conversion`);
  }
}
function reconcileOpenAIResponsesToolChoice(choice, projection) {
  if (choice === "auto") {
    return projection.tools.length > 0 ? choice : void 0;
  }
  if (choice === "required") {
    if (projection.tools.length === 0) {
      throw new Error(
        "OpenAI Responses tool_choice requires a tool, but no tools survived schema conversion"
      );
    }
    return choice;
  }
  if (choice === "none" || !isRecord(choice)) {
    return choice;
  }
  const choiceType = choice.type;
  if (choiceType === "function") {
    const functionName = choice.name;
    if (typeof functionName !== "string") {
      return choice;
    }
    requireProjectedFunction(functionName, projection, "OpenAI Responses tool_choice");
    return { type: "function", name: functionName };
  }
  if (choiceType !== "allowed_tools") {
    return choice;
  }
  const mode = choice.mode;
  const tools = choice.tools;
  if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) {
    return choice;
  }
  const normalizedAllowedTools = [];
  for (const tool of tools) {
    if (!isRecord(tool) || tool.type !== "function") {
      normalizedAllowedTools.push(tool);
      continue;
    }
    const functionName = tool.name;
    if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) {
      normalizedAllowedTools.push({ type: "function", name: functionName });
    }
  }
  if (normalizedAllowedTools.length === 0) {
    if (mode === "auto") {
      return "none";
    }
    throw new Error(
      "OpenAI Responses tool_choice requires a tool, but no allowed tools survived schema conversion"
    );
  }
  return {
    type: "allowed_tools",
    mode,
    tools: normalizedAllowedTools
  };
}
function reconcileOpenAICompletionsToolChoice(choice, projection) {
  if (choice === "auto") {
    return projection.tools.length > 0 ? choice : void 0;
  }
  if (choice === "required") {
    if (projection.tools.length === 0) {
      throw new Error(
        "OpenAI Chat Completions tool_choice requires a tool, but no tools survived schema conversion"
      );
    }
    return choice;
  }
  if (choice === "none" || !isRecord(choice)) {
    return choice;
  }
  const choiceType = choice.type;
  if (choiceType === "custom") {
    throw new Error(
      "OpenAI Chat Completions custom tool_choice is unsupported because this adapter emits function tools only"
    );
  }
  if (choiceType === "function") {
    const functionChoice = choice.function;
    if (!isRecord(functionChoice)) {
      return choice;
    }
    const functionName = functionChoice.name;
    if (typeof functionName !== "string") {
      return choice;
    }
    requireProjectedFunction(functionName, projection, "OpenAI Chat Completions tool_choice");
    return { type: "function", function: { name: functionName } };
  }
  if (choiceType !== "allowed_tools") {
    return choice;
  }
  const allowedConfig = choice.allowed_tools;
  if (!isRecord(allowedConfig)) {
    return choice;
  }
  const mode = allowedConfig.mode;
  const tools = allowedConfig.tools;
  if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) {
    return choice;
  }
  const normalizedAllowedTools = [];
  for (const tool of tools) {
    if (!isRecord(tool) || tool.type !== "function") {
      continue;
    }
    const functionChoice = tool.function;
    const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
    if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) {
      normalizedAllowedTools.push({
        type: "function",
        function: { name: functionName }
      });
    }
  }
  if (normalizedAllowedTools.length === 0) {
    if (mode === "auto") {
      return "none";
    }
    throw new Error(
      "OpenAI Chat Completions tool_choice requires a tool, but no allowed tools survived schema conversion"
    );
  }
  return {
    type: "allowed_tools",
    allowed_tools: {
      mode,
      tools: normalizedAllowedTools
    }
  };
}

// packages/ai/src/providers/simple-options.ts
function buildBaseOptions(model, options, apiKey) {
  void model;
  const firstEventOptions = options;
  return {
    temperature: options?.temperature,
    maxTokens: options?.maxTokens,
    stop: options?.stop,
    signal: options?.signal,
    apiKey: apiKey || options?.apiKey,
    transport: options?.transport,
    cacheRetention: options?.cacheRetention,
    sessionId: options?.sessionId,
    promptCacheKey: options?.promptCacheKey,
    headers: options?.headers,
    onPayload: options?.onPayload,
    onResponse: options?.onResponse,
    timeoutMs: options?.timeoutMs,
    firstEventTimeoutMs: firstEventOptions?.firstEventTimeoutMs,
    onFirstEventTimeout: firstEventOptions?.onFirstEventTimeout,
    maxRetries: options?.maxRetries,
    maxRetryDelayMs: options?.maxRetryDelayMs,
    metadata: options?.metadata
  };
}

// packages/normalization-core/src/utf16-slice.ts
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

// packages/ai/src/providers/tool-result-text.ts
var PROVIDER_TOOL_RESULT_MAX_CHARS = 8e3;
var IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["image", "image_url", "input_image"]);
var AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["audio", "input_audio", "output_audio"]);
var MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
  ...IMAGE_TOOL_RESULT_TYPES,
  ...AUDIO_TOOL_RESULT_TYPES
]);
var INLINE_DATA_URI_PATTERN = /(^|[^A-Za-z0-9_])data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+(?:;[a-z0-9.+-]+=[^,;"'\s]+|;base64)*,[^\s"'<>)]+)/gi;
var MIME_KEY_CANDIDATES = [
  "mimeType",
  "mime_type",
  "mediaType",
  "media_type",
  "contentType",
  "content_type"
];
var TEXTUAL_MIME_PATTERN = /^(?:text\/|application\/(?:json|ld\+json|x-ndjson|xml|javascript|x-www-form-urlencoded)|[^/]+\/[^+]+\+(?:json|xml)$)/i;
var OPAQUE_OR_BINARY_FIELD_RE = /^(?:blob|buffer|bytes|encrypted_content|encrypted_stdout)$/i;
function readMimeType(value) {
  if (!isRecord(value)) {
    return void 0;
  }
  for (const key of MIME_KEY_CANDIDATES) {
    const mimeType = value[key];
    if (typeof mimeType === "string" && mimeType.trim().length > 0) {
      return mimeType;
    }
  }
  return void 0;
}
function isBinaryMimeType(mimeType) {
  const normalized = mimeType.split(";", 1)[0]?.trim().toLowerCase();
  return normalized ? !TEXTUAL_MIME_PATTERN.test(normalized) : false;
}
function describeOmittedValue(value, label) {
  const length = typeof value === "string" ? value.length : JSON.stringify(value)?.length;
  return length ? `[${label} omitted: ${length} chars]` : `[${label} omitted]`;
}
function redactInlineDataUris(value) {
  return value.replace(
    INLINE_DATA_URI_PATTERN,
    (_match, prefix, uri) => `${prefix}[inline data URI: ${uri.length} chars]`
  );
}
function redactStructuredTextValue(value) {
  const host = getAiTransportHost();
  const redacted = host.redactToolPayloadText(value);
  const trimmed = redacted.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return redacted;
  }
  try {
    const redactedWrapper = host.redactSecrets({ structuredTextValue: JSON.parse(redacted) });
    return JSON.stringify(redactedWrapper.structuredTextValue);
  } catch {
    return redacted;
  }
}
function stringifyStructuredBlock(block) {
  const seen = /* @__PURE__ */ new WeakSet();
  try {
    const redactedWrapper = getAiTransportHost().redactSecrets({ structuredToolResult: block });
    const redactedBlock = redactedWrapper.structuredToolResult;
    const serialized = JSON.stringify(
      redactedBlock,
      function structuredToolResultReplacer(key, value) {
        if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) {
          return `[omitted ${key}]`;
        }
        if (key === "data") {
          const mimeType = readMimeType(this);
          if (mimeType && isBinaryMimeType(mimeType)) {
            return describeOmittedValue(value, "binary data");
          }
        }
        if (typeof value === "bigint") {
          return value.toString();
        }
        if (typeof value === "string") {
          return redactInlineDataUris(redactStructuredTextValue(value));
        }
        if (typeof value === "function" || typeof value === "symbol" || value === void 0) {
          return void 0;
        }
        if (!value || typeof value !== "object") {
          return value;
        }
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
        return value;
      }
    );
    if (!serialized || serialized === "{}") {
      return void 0;
    }
    return serialized;
  } catch {
    return void 0;
  }
}
function truncateProviderToolText(text) {
  if (text.length <= PROVIDER_TOOL_RESULT_MAX_CHARS) {
    return text;
  }
  return `${truncateUtf16Safe(text, PROVIDER_TOOL_RESULT_MAX_CHARS)}
\u2026(truncated)\u2026`;
}
function hasMediaPayload(block) {
  return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
function isImageWithMediaPayload(block) {
  return isRecord(block) && block.type === "image" && hasMediaPayload(block);
}
function describeToolResultMediaPlaceholder(blocks) {
  let hasImage = false;
  let hasAudio = false;
  for (const block of blocks) {
    if (!hasMediaPayload(block)) {
      continue;
    }
    const record = block;
    const type = typeof record.type === "string" ? record.type : void 0;
    const mimeType = readMimeType(record);
    if (type && IMAGE_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("image/")) {
      hasImage = true;
    }
    if (type && AUDIO_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("audio/")) {
      hasAudio = true;
    }
  }
  if (hasImage && hasAudio) {
    return "(see attached media)";
  }
  if (hasAudio) {
    return "(see attached audio)";
  }
  if (hasImage) {
    return "(see attached image)";
  }
  return void 0;
}
function extractToolResultBlockText(block) {
  if (!block || typeof block !== "object") {
    return void 0;
  }
  const record = block;
  if (typeof record.type === "string" && MEDIA_ONLY_TOOL_RESULT_TYPES.has(record.type)) {
    return void 0;
  }
  if (record.type === "text") {
    const text = typeof record.text === "string" ? record.text : "";
    return text ? sanitizeSurrogates(text) : void 0;
  }
  const structured = stringifyStructuredBlock(record);
  return structured ? sanitizeSurrogates(truncateProviderToolText(structured)) : void 0;
}
function extractToolResultText(blocks) {
  const explicitTexts = [];
  const structuredTexts = [];
  for (const block of blocks) {
    const text = extractToolResultBlockText(block);
    if (!text) {
      continue;
    }
    const record = block;
    if (record.type === "text") {
      explicitTexts.push(text);
    } else {
      structuredTexts.push(text);
    }
  }
  if (explicitTexts.length > 0) {
    return sanitizeSurrogates(explicitTexts.join("\n"));
  }
  return sanitizeSurrogates(truncateProviderToolText(structuredTexts.join("\n")));
}

// packages/ai/src/providers/anthropic-model-contract.ts
function normalizeModelId(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  const unprefixed = normalized.startsWith("anthropic/") ? normalized.slice("anthropic/".length) : normalized;
  return unprefixed.replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
  const normalized = normalizeLowercaseStringOrEmpty(api);
  return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
  const responseModelId = normalizeModelId(ref.responseModelId);
  return responseModelId.length > 0 && responseModelId !== normalizeModelId(ref.modelId);
}
function resolveReplayModelBoundIdentity(ref) {
  if (normalizeApi(ref.api) !== "anthropic-messages") {
    return void 0;
  }
  const modelRef = hasConcreteResponseModel(ref) ? { id: ref.responseModelId } : { id: ref.modelId, params: ref.modelParams };
  const fableIdentity = resolveClaudeFable5ModelIdentity(modelRef);
  if (fableIdentity) {
    return `fable:${fableIdentity}`;
  }
  const mythosIdentity = resolveClaudeMythos5ModelIdentity(modelRef);
  if (mythosIdentity) {
    return `mythos:${mythosIdentity}`;
  }
  const sonnetIdentity = resolveClaudeSonnet5ModelIdentity(modelRef);
  return sonnetIdentity ? `sonnet:${sonnetIdentity}` : void 0;
}
function resolveModelBoundThinkingReplayMode(params) {
  const sourceApi = normalizeApi(params.source.api);
  const targetApi = normalizeApi(params.target.api);
  const sourceIdentity = resolveReplayModelBoundIdentity(params.source);
  const targetIdentity = resolveReplayModelBoundIdentity(params.target);
  const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId(params.source.modelId) === normalizeModelId(params.target.modelId);
  if (!sourceIdentity && !targetIdentity) {
    return "default";
  }
  if (!sourceIdentity && !hasConcreteResponseModel(params.source) && targetIdentity && sameRoute) {
    return "preserve";
  }
  const sameModel = sourceApi === targetApi && sourceIdentity === targetIdentity;
  return sameModel ? "preserve" : "drop";
}

// packages/ai/src/providers/transform-messages.ts
var NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
var NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
  const result = [];
  let previousWasPlaceholder = false;
  for (const block of content) {
    if (block.type === "image") {
      if (!isImageWithMediaPayload(block)) {
        continue;
      }
      if (!previousWasPlaceholder) {
        result.push({ type: "text", text: placeholder });
      }
      previousWasPlaceholder = true;
      continue;
    }
    result.push(block);
    previousWasPlaceholder = block.text === placeholder;
  }
  return result;
}
function downgradeUnsupportedImages(messages, model) {
  if (model.input.includes("image")) {
    return messages;
  }
  return messages.map((msg) => {
    if (msg.role === "user" && Array.isArray(msg.content)) {
      return {
        ...msg,
        content: replaceImagesWithPlaceholder(msg.content, NON_VISION_USER_IMAGE_PLACEHOLDER)
      };
    }
    if (msg.role === "toolResult") {
      return {
        ...msg,
        content: replaceImagesWithPlaceholder(msg.content, NON_VISION_TOOL_IMAGE_PLACEHOLDER)
      };
    }
    return msg;
  });
}
function transformMessages(messages, model, normalizeToolCallId) {
  const toolCallIdMap = /* @__PURE__ */ new Map();
  const normalizedMessages = messages.map(
    (msg) => msg.content == null ? { ...msg, content: [] } : msg
  );
  const imageAwareMessages = downgradeUnsupportedImages(normalizedMessages, model);
  const transformed = imageAwareMessages.map((msg) => {
    if (msg.role === "user") {
      return msg;
    }
    if (msg.role === "toolResult") {
      const normalizedId = toolCallIdMap.get(msg.toolCallId);
      if (normalizedId && normalizedId !== msg.toolCallId) {
        return Object.assign({}, msg, { toolCallId: normalizedId });
      }
      return msg;
    }
    if (msg.role === "assistant") {
      const assistantMsg = msg;
      const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
        source: {
          provider: assistantMsg.provider,
          api: assistantMsg.api,
          modelId: assistantMsg.model,
          responseModelId: assistantMsg.responseModel
        },
        target: {
          provider: model.provider,
          api: model.api,
          modelId: model.id,
          modelParams: model.params
        }
      });
      const isSameModel = modelBoundThinkingReplayMode === "preserve" || assistantMsg.provider === model.provider && assistantMsg.api === model.api && assistantMsg.model === model.id;
      const contentBlocks = typeof assistantMsg.content === "string" ? [{ type: "text", text: assistantMsg.content }] : assistantMsg.content;
      const transformedContent = contentBlocks.flatMap((block) => {
        if (block.type === "thinking") {
          if (modelBoundThinkingReplayMode === "drop") {
            return [];
          }
          if (block.redacted) {
            return isSameModel ? block : [];
          }
          if (isSameModel && block.thinkingSignature) {
            return block;
          }
          if (!block.thinking || block.thinking.trim() === "") {
            return [];
          }
          if (isSameModel) {
            return block;
          }
          return {
            type: "text",
            text: block.thinking
          };
        }
        if (block.type === "text") {
          if (isSameModel) {
            return block;
          }
          return {
            type: "text",
            text: block.text
          };
        }
        if (block.type === "toolCall") {
          const toolCall = block;
          let normalizedToolCall = toolCall;
          if (!isSameModel && toolCall.thoughtSignature) {
            normalizedToolCall = Object.assign({}, toolCall);
            delete normalizedToolCall.thoughtSignature;
          }
          if (!isSameModel && normalizeToolCallId) {
            const normalizedId = normalizeToolCallId(toolCall.id, model, assistantMsg);
            if (normalizedId !== toolCall.id) {
              toolCallIdMap.set(toolCall.id, normalizedId);
              normalizedToolCall = Object.assign({}, normalizedToolCall, { id: normalizedId });
            }
          }
          return normalizedToolCall;
        }
        return block;
      });
      return Object.assign({}, assistantMsg, { content: transformedContent });
    }
    return msg;
  });
  const result = [];
  let pendingToolCalls = [];
  let existingToolResultIds = /* @__PURE__ */ new Set();
  const insertSyntheticToolResults = () => {
    if (pendingToolCalls.length > 0) {
      for (const tc of pendingToolCalls) {
        if (!existingToolResultIds.has(tc.id)) {
          result.push({
            role: "toolResult",
            toolCallId: tc.id,
            toolName: tc.name,
            content: [{ type: "text", text: "No result provided" }],
            isError: true,
            timestamp: Date.now()
          });
        }
      }
      pendingToolCalls = [];
      existingToolResultIds = /* @__PURE__ */ new Set();
    }
  };
  for (const msg of transformed) {
    if (msg.role === "assistant") {
      insertSyntheticToolResults();
      const assistantMsg = msg;
      if (assistantMsg.stopReason === "error" || assistantMsg.stopReason === "aborted") {
        continue;
      }
      const toolCalls = assistantMsg.content.filter((b) => b.type === "toolCall");
      if (toolCalls.length > 0) {
        pendingToolCalls = toolCalls;
        existingToolResultIds = /* @__PURE__ */ new Set();
      }
      result.push(msg);
    } else if (msg.role === "toolResult") {
      existingToolResultIds.add(msg.toolCallId);
      result.push(msg);
    } else if (msg.role === "user") {
      insertSyntheticToolResults();
      result.push(msg);
    } else {
      result.push(msg);
    }
  }
  insertSyntheticToolResults();
  return result;
}

// packages/ai/src/providers/openai-completions.ts
function hasToolHistory(messages) {
  for (const msg of messages) {
    if (msg.role === "toolResult") {
      return true;
    }
    if (msg.role === "assistant") {
      if (Array.isArray(msg.content) && msg.content.some((block) => block.type === "toolCall")) {
        return true;
      }
    }
  }
  return false;
}
function isTextContentBlock(block) {
  return block.type === "text";
}
function isThinkingContentBlock(block) {
  return block.type === "thinking";
}
function isToolCallBlock(block) {
  return block.type === "toolCall";
}
var EMPTY_TOOL_RESULT_TEXT = "(no output)";
function sanitizeToolResultText(text, fallback) {
  const sanitized = sanitizeSurrogates(text);
  return sanitized.trim().length > 0 ? sanitized : fallback;
}
function isEncryptedReasoningDetail(detail) {
  if (typeof detail !== "object" || detail === null) {
    return false;
  }
  const candidate = detail;
  return candidate.type === "reasoning.encrypted" && typeof candidate.id === "string" && candidate.id.length > 0 && typeof candidate.data === "string" && candidate.data.length > 0;
}
var streamOpenAICompletions = (model, context, options) => {
  const stream = new AssistantMessageEventStream();
  void (async () => {
    const output = {
      role: "assistant",
      content: [],
      api: model.api,
      provider: model.provider,
      model: model.id,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: "stop",
      timestamp: Date.now()
    };
    let firstEventAbort;
    try {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
      const compat = getCompat(model);
      const cacheRetention = resolveCacheRetention(options?.cacheRetention);
      const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
      const client = createClient(model, context, apiKey, options?.headers, cacheSessionId, compat);
      let params = buildParams(model, context, options, compat, cacheRetention);
      const nextParams = await options?.onPayload?.(params, model);
      if (nextParams !== void 0) {
        params = nextParams;
      }
      firstEventAbort = createFirstStreamEventAbortController(options?.signal);
      const requestOptions = {
        signal: firstEventAbort.signal,
        ...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
        maxRetries: options?.maxRetries ?? 0
      };
      const { data: openaiStream, response } = await client.chat.completions.create(
        params,
        requestOptions
      ).withResponse();
      await options?.onResponse?.(
        { status: response.status, headers: headersToRecord(response.headers) },
        model
      );
      stream.push({ type: "start", partial: output });
      let textBlock = null;
      let thinkingBlock = null;
      let hasFinishReason = false;
      const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
      const toolCallBlocksById = /* @__PURE__ */ new Map();
      const toolCallBlocksByFirstId = /* @__PURE__ */ new Map();
      const pendingReasoningDetailsByToolCallId = /* @__PURE__ */ new Map();
      const blocks = output.content;
      const finishedBlocks = /* @__PURE__ */ new Set();
      const contentIndices = /* @__PURE__ */ new WeakMap();
      const appendBlock = (block) => {
        contentIndices.set(block, blocks.length);
        blocks.push(block);
      };
      const getContentIndex = (block) => contentIndices.get(block) ?? -1;
      const rememberFirstToolCallById = (id, block) => {
        if (toolCallBlocksByFirstId.has(id)) {
          return;
        }
        toolCallBlocksByFirstId.set(id, block);
        const pendingDetail = pendingReasoningDetailsByToolCallId.get(id);
        if (pendingDetail) {
          block.thoughtSignature = pendingDetail;
          pendingReasoningDetailsByToolCallId.delete(id);
        }
      };
      const finishBlock = (block) => {
        const contentIndex = getContentIndex(block);
        if (contentIndex === -1 || finishedBlocks.has(block)) {
          return;
        }
        finishedBlocks.add(block);
        if (block.type === "text") {
          stream.push({
            type: "text_end",
            contentIndex,
            content: block.text,
            partial: output
          });
        } else if (block.type === "thinking") {
          stream.push({
            type: "thinking_end",
            contentIndex,
            content: block.thinking,
            partial: output
          });
        } else if (block.type === "toolCall") {
          delete block.partialArgs;
          delete block.streamIndex;
          stream.push({
            type: "toolcall_end",
            contentIndex,
            toolCall: block,
            partial: output
          });
        }
      };
      const ensureTextBlock = () => {
        if (!textBlock) {
          textBlock = { type: "text", text: "" };
          appendBlock(textBlock);
          stream.push({
            type: "text_start",
            contentIndex: getContentIndex(textBlock),
            partial: output
          });
        }
        return textBlock;
      };
      const ensureThinkingBlock = (thinkingSignature) => {
        if (!thinkingBlock) {
          thinkingBlock = {
            type: "thinking",
            thinking: "",
            thinkingSignature
          };
          appendBlock(thinkingBlock);
          stream.push({
            type: "thinking_start",
            contentIndex: getContentIndex(thinkingBlock),
            partial: output
          });
        }
        return thinkingBlock;
      };
      const sealNativeReasoningBeforeText = () => {
        if (thinkingBlock && !reasoningTagTextPartitioner.isInsideReasoning()) {
          finishBlock(thinkingBlock);
          thinkingBlock = null;
        }
      };
      const appendTextDelta = (delta) => {
        sealNativeReasoningBeforeText();
        const block = ensureTextBlock();
        block.text += delta;
        stream.push({
          type: "text_delta",
          contentIndex: getContentIndex(block),
          delta,
          partial: output
        });
      };
      const appendThinkingDelta = (thinkingSignature, delta) => {
        const block = ensureThinkingBlock(thinkingSignature);
        block.thinking += delta;
        stream.push({
          type: "thinking_delta",
          contentIndex: getContentIndex(block),
          delta,
          partial: output
        });
      };
      const ensureToolCallBlock = (toolCall) => {
        const streamIndex = typeof toolCall.index === "number" ? toolCall.index : void 0;
        let block = streamIndex !== void 0 ? toolCallBlocksByIndex.get(streamIndex) : void 0;
        if (!block && toolCall.id) {
          block = toolCallBlocksById.get(toolCall.id);
        }
        if (!block) {
          block = {
            type: "toolCall",
            id: toolCall.id || "",
            name: toolCall.function?.name || "",
            arguments: {},
            partialArgs: "",
            streamIndex
          };
          if (streamIndex !== void 0) {
            toolCallBlocksByIndex.set(streamIndex, block);
          }
          if (toolCall.id) {
            toolCallBlocksById.set(toolCall.id, block);
            rememberFirstToolCallById(toolCall.id, block);
          }
          appendBlock(block);
          stream.push({
            type: "toolcall_start",
            contentIndex: getContentIndex(block),
            partial: output
          });
        }
        if (streamIndex !== void 0 && block.streamIndex === void 0) {
          block.streamIndex = streamIndex;
          toolCallBlocksByIndex.set(streamIndex, block);
        }
        if (toolCall.id) {
          toolCallBlocksById.set(toolCall.id, block);
        }
        return block;
      };
      const reasoningTagTextPartitioner = createReasoningTagTextPartitioner();
      const appendPartitionedContent = (text, hasMirroredReasoning) => {
        const routedDeltas = hasMirroredReasoning ? reasoningTagTextPartitioner.push(text) : reasoningTagTextPartitioner.pushVisible(text);
        for (const delta of routedDeltas) {
          if (delta.kind === "text") {
            appendTextDelta(delta.text);
          }
        }
      };
      const flushPartitionedContent = () => {
        for (const delta of reasoningTagTextPartitioner.flush()) {
          if (delta.kind === "text") {
            appendTextDelta(delta.text);
          }
        }
      };
      const guardedOpenaiStream = withFirstStreamEventTimeout(openaiStream, {
        provider: model.provider,
        api: model.api,
        model: model.id,
        timeoutMs: getFirstStreamEventTimeoutMs(options) ?? 0,
        stage: "completions",
        abort: firstEventAbort.abort,
        onTimeout: getFirstStreamEventTimeoutHandler(options),
        hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
      });
      for await (const chunk of guardedOpenaiStream) {
        if (!chunk || typeof chunk !== "object") {
          continue;
        }
        output.responseId ||= chunk.id;
        if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) {
          output.responseModel ||= chunk.model;
        }
        if (chunk.usage) {
          output.usage = parseChunkUsage(chunk.usage, model);
        }
        const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
        if (!choice) {
          continue;
        }
        const choiceUsage = choice.usage;
        if (!chunk.usage && choiceUsage) {
          output.usage = parseChunkUsage(choiceUsage, model);
        }
        if (choice.finish_reason) {
          const finishReasonResult = mapOpenAIStopReason(choice.finish_reason);
          output.stopReason = finishReasonResult.stopReason;
          if (finishReasonResult.errorMessage) {
            output.errorMessage = finishReasonResult.errorMessage;
          }
          hasFinishReason = true;
        }
        const choiceDelta = choice.delta ?? choice.message;
        if (choiceDelta) {
          const reasoningFields = ["reasoning_content", "reasoning", "reasoning_text"];
          const deltaFields = choiceDelta;
          const shouldEmitReasoning = Boolean(model.reasoning && options?.reasoningEffort);
          let foundReasoningField = null;
          for (const field of reasoningFields) {
            const value = deltaFields[field];
            if (typeof value === "string" && value.length > 0) {
              foundReasoningField = field;
              break;
            }
          }
          if (foundReasoningField) {
            reasoningTagTextPartitioner.markStrict();
          }
          if (shouldEmitReasoning && foundReasoningField) {
            const delta = deltaFields[foundReasoningField];
            if (typeof delta === "string" && delta.length > 0) {
              const thinkingSignature = model.provider === "opencode-go" && foundReasoningField === "reasoning" ? "reasoning_content" : foundReasoningField;
              appendThinkingDelta(thinkingSignature, delta);
            }
          }
          if (choiceDelta.content !== null && choiceDelta.content !== void 0 && choiceDelta.content.length > 0) {
            appendPartitionedContent(choiceDelta.content, Boolean(foundReasoningField));
          }
          const refusalText = typeof choiceDelta.refusal === "string" ? choiceDelta.refusal : "";
          if (refusalText.length > 0) {
            appendPartitionedContent(refusalText, Boolean(foundReasoningField));
          }
          if (choiceDelta.tool_calls) {
            flushPartitionedContent();
            sealNativeReasoningBeforeText();
            for (const toolCall of choiceDelta.tool_calls) {
              const block = ensureToolCallBlock(toolCall);
              if (!block.id && toolCall.id) {
                block.id = toolCall.id;
                toolCallBlocksById.set(toolCall.id, block);
                rememberFirstToolCallById(toolCall.id, block);
              }
              if (!block.name && toolCall.function?.name) {
                block.name = toolCall.function.name;
              }
              let delta = "";
              if (toolCall.function?.arguments) {
                delta = toolCall.function.arguments;
                block.partialArgs = (block.partialArgs ?? "") + toolCall.function.arguments;
                block.arguments = parseStreamingJson(block.partialArgs);
              }
              stream.push({
                type: "toolcall_delta",
                contentIndex: getContentIndex(block),
                delta,
                partial: output
              });
            }
          }
          const reasoningDetails = choiceDelta.reasoning_details;
          if (Array.isArray(reasoningDetails)) {
            for (const detail of reasoningDetails) {
              if (isEncryptedReasoningDetail(detail)) {
                const serializedDetail = JSON.stringify(detail);
                const matchingToolCall = toolCallBlocksByFirstId.get(detail.id);
                if (matchingToolCall) {
                  matchingToolCall.thoughtSignature = serializedDetail;
                } else {
                  pendingReasoningDetailsByToolCallId.set(detail.id, serializedDetail);
                }
              }
            }
          }
        }
      }
      flushPartitionedContent();
      for (const block of blocks) {
        finishBlock(block);
      }
      if (options?.signal?.aborted) {
        throw new Error("Request was aborted");
      }
      if (output.stopReason === "aborted") {
        throw new Error("Request was aborted");
      }
      if (output.stopReason === "error") {
        throw new Error(output.errorMessage || "Provider returned an error stop reason");
      }
      if (!hasFinishReason) {
        throw new Error("Stream ended without finish_reason");
      }
      const hasToolCalls = output.content.some((block) => block.type === "toolCall");
      const hasVisibleText = output.content.some(
        (block) => block.type === "text" && block.text.trim().length > 0
      );
      if (output.stopReason === "toolUse" && !hasToolCalls) {
        output.stopReason = "stop";
      }
      if (output.stopReason === "stop" && hasToolCalls && !hasVisibleText) {
        output.stopReason = "toolUse";
      }
      if (hasToolCalls && output.stopReason !== "toolUse") {
        output.content = output.content.filter((block) => block.type !== "toolCall");
      }
      stream.push({ type: "done", reason: output.stopReason, message: output });
      stream.end();
    } catch (error) {
      for (const block of output.content) {
        delete block.index;
        delete block.partialArgs;
        delete block.streamIndex;
      }
      output.stopReason = options?.signal?.aborted ? "aborted" : "error";
      output.errorMessage = formatProviderError(error);
      const rawMetadata = error?.error?.metadata?.raw;
      if (rawMetadata && !output.errorMessage.includes(rawMetadata)) {
        output.errorMessage += `
${rawMetadata}`;
      }
      stream.push({ type: "error", reason: output.stopReason, error: output });
      stream.end();
    } finally {
      firstEventAbort?.dispose();
    }
  })();
  return stream;
};
var streamSimpleOpenAICompletions = (model, context, options) => {
  const apiKey = options?.apiKey || getEnvApiKey(model.provider);
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const base = buildBaseOptions(model, options, apiKey);
  const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
  const reasoningEffort = clampedReasoning === "off" ? void 0 : clampedReasoning === "max" ? "xhigh" : clampedReasoning;
  const toolChoice = options?.toolChoice;
  return streamOpenAICompletions(model, context, {
    ...base,
    reasoningEffort,
    toolChoice
  });
};
function createClient(model, context, apiKey, optionsHeaders, sessionId, compat = getCompat(model)) {
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const headers = { ...model.headers };
  if (model.provider === "github-copilot") {
    const hasImages = hasCopilotVisionInput(context.messages);
    const copilotHeaders = buildCopilotDynamicHeaders({
      messages: context.messages,
      hasImages
    });
    Object.assign(headers, copilotHeaders);
  }
  if (sessionId && compat.sendSessionAffinityHeaders) {
    if (compat.sessionAffinityFormat === "openrouter") {
      headers["x-session-id"] = sessionId;
    } else {
      headers.session_id = sessionId;
      headers["x-client-request-id"] = sessionId;
      headers["x-session-affinity"] = sessionId;
    }
  }
  if (optionsHeaders) {
    Object.assign(headers, optionsHeaders);
  }
  const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
    ...headers,
    Authorization: headers.Authorization ?? null,
    "cf-aig-authorization": `Bearer ${apiKey}`
  } : headers;
  return new OpenAI({
    apiKey,
    baseURL: isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders,
    // OpenAI supports custom fetch, so sentinels stay opaque until guarded egress.
    fetch: getAiTransportHost().buildModelFetch(model)
  });
}
function buildParams(model, context, options, compat = getCompat(model), cacheRetention = resolveCacheRetention(options?.cacheRetention)) {
  const cacheControl = getCompatCacheControl(compat, cacheRetention);
  const cacheOptOutIndexes = /* @__PURE__ */ new Set();
  const messages = convertMessages(model, context, compat, {
    cacheOptOutIndexes,
    preserveSystemPromptCacheBoundary: cacheControl !== void 0
  });
  const supportsPromptCacheKey = model.baseUrl.includes("api.openai.com") || compat.supportsPromptCacheKey;
  const promptCacheKey = supportsPromptCacheKey && cacheRetention !== "none" ? clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId) : void 0;
  const params = {
    model: model.id,
    messages,
    stream: true,
    prompt_cache_key: promptCacheKey,
    prompt_cache_retention: supportsPromptCacheKey && cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0
  };
  if (compat.supportsUsageInStreaming) {
    params.stream_options = { include_usage: true };
  }
  if (compat.supportsStore) {
    params.store = false;
  }
  if (options?.maxTokens) {
    const maxTokens = clampOpenAICompletionsMaxTokens(model, options.maxTokens);
    if (compat.maxTokensField === "max_tokens") {
      params.max_tokens = maxTokens;
    } else {
      params.max_completion_tokens = maxTokens;
    }
  }
  if (options?.temperature !== void 0) {
    params.temperature = options.temperature;
  }
  if (options?.stop !== void 0 && options.stop.length > 0) {
    params.stop = options.stop;
  }
  let toolProjection;
  if (context.tools) {
    const converted = convertTools(context.tools, compat);
    toolProjection = converted.projection;
    if (converted.tools.length > 0) {
      params.tools = converted.tools;
    } else if (hasToolHistory(context.messages)) {
      params.tools = [];
    }
    if (compat.zaiToolStream && converted.tools.length > 0) {
      params.tool_stream = true;
    }
  } else if (hasToolHistory(context.messages)) {
    params.tools = [];
  }
  if (cacheControl) {
    applyAnthropicCacheControl(messages, params.tools, cacheControl, cacheOptOutIndexes);
  }
  if (options?.toolChoice) {
    const toolChoice = reconcileOpenAICompletionsToolChoice(
      options.toolChoice,
      toolProjection ?? projectOpenAITools([])
    );
    if (toolChoice !== void 0) {
      params.tool_choice = toolChoice;
    }
  }
  if (compat.thinkingFormat === "zai" && model.reasoning) {
    params.thinking = options?.reasoningEffort ? { type: "enabled", clear_thinking: false } : { type: "disabled" };
  } else if (compat.thinkingFormat === "qwen" && model.reasoning) {
    params.enable_thinking = Boolean(options?.reasoningEffort);
  } else if (compat.thinkingFormat === "qwen-chat-template" && model.reasoning) {
    params.chat_template_kwargs = {
      enable_thinking: Boolean(options?.reasoningEffort),
      preserve_thinking: true
    };
  } else if (compat.thinkingFormat === "deepseek" && model.reasoning) {
    params.thinking = { type: options?.reasoningEffort ? "enabled" : "disabled" };
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    }
  } else if (compat.thinkingFormat === "openrouter" && model.reasoning) {
    const openRouterParams = params;
    if (options?.reasoningEffort) {
      openRouterParams.reasoning = {
        effort: model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort
      };
    } else if (model.thinkingLevelMap?.off !== null) {
      openRouterParams.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
    }
  } else if (compat.thinkingFormat === "together" && model.reasoning) {
    const togetherParams = params;
    togetherParams.reasoning = { enabled: Boolean(options?.reasoningEffort) };
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      togetherParams.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    }
  } else if (options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
    params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
  } else if (!options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
    const offValue = model.thinkingLevelMap?.off;
    if (typeof offValue === "string") {
      params.reasoning_effort = offValue;
    }
  }
  if (model.compat?.openRouterRouting) {
    params.provider = model.compat.openRouterRouting;
  }
  if (model.baseUrl.includes("ai-gateway.vercel.sh") && model.compat?.vercelGatewayRouting) {
    const routing = model.compat.vercelGatewayRouting;
    if (routing.only || routing.order) {
      const gatewayOptions = {};
      if (routing.only) {
        gatewayOptions.only = routing.only;
      }
      if (routing.order) {
        gatewayOptions.order = routing.order;
      }
      params.providerOptions = { gateway: gatewayOptions };
    }
  }
  return params;
}
function clampOpenAICompletionsMaxTokens(model, requestedMaxTokens) {
  const modelMaxTokens = typeof model.maxTokens === "number" && Number.isFinite(model.maxTokens) && model.maxTokens > 0 ? Math.floor(model.maxTokens) : void 0;
  return modelMaxTokens === void 0 || requestedMaxTokens <= modelMaxTokens ? requestedMaxTokens : modelMaxTokens;
}
function getCompatCacheControl(compat, cacheRetention) {
  if (compat.cacheControlFormat !== "anthropic" || cacheRetention === "none") {
    return void 0;
  }
  const ttl = cacheRetention === "long" && compat.supportsLongCacheRetention ? "1h" : void 0;
  return { type: "ephemeral", ...ttl ? { ttl } : {} };
}
function applyAnthropicCacheControl(messages, tools, cacheControl, cacheOptOutIndexes) {
  addCacheControlToSystemPrompt(messages, cacheControl);
  addCacheControlToLastTool(tools, cacheControl);
  addCacheControlToLastConversationMessage(messages, cacheControl, cacheOptOutIndexes);
}
function addCacheControlToSystemPrompt(messages, cacheControl) {
  for (const message of messages) {
    if (message.role === "system" || message.role === "developer") {
      addCacheControlToInstructionMessage(message, cacheControl);
      return;
    }
  }
}
function addCacheControlToLastConversationMessage(messages, cacheControl, cacheOptOutIndexes) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (!message || cacheOptOutIndexes.has(i)) {
      continue;
    }
    if (message.role === "user" || message.role === "assistant") {
      if (addCacheControlToMessage(message, cacheControl)) {
        return;
      }
    }
  }
}
function addCacheControlToLastTool(tools, cacheControl) {
  if (!tools || tools.length === 0) {
    return;
  }
  const lastTool = tools.at(-1);
  if (!lastTool) {
    return;
  }
  lastTool.cache_control = cacheControl;
}
function addCacheControlToInstructionMessage(message, cacheControl) {
  return addCacheControlToTextContent(message, cacheControl);
}
function addCacheControlToMessage(message, cacheControl) {
  if (message.role === "user" || message.role === "assistant") {
    return addCacheControlToTextContent(message, cacheControl);
  }
  return false;
}
function addCacheControlToTextContent(message, cacheControl) {
  const content = message.content;
  if (typeof content === "string") {
    if (content.length === 0) {
      return false;
    }
    message.content = buildCacheControlledTextParts(content, cacheControl);
    return true;
  }
  if (!Array.isArray(content)) {
    return false;
  }
  for (let i = content.length - 1; i >= 0; i--) {
    const part = content[i];
    if (part?.type === "text") {
      const text = part.text;
      content.splice(i, 1, ...buildCacheControlledTextParts(text, cacheControl));
      return true;
    }
  }
  return false;
}
function buildCacheControlledTextParts(text, cacheControl) {
  const split = splitSystemPromptCacheBoundary(text);
  if (!split) {
    return [{ type: "text", text, cache_control: cacheControl }];
  }
  const parts = [];
  if (split.stablePrefix) {
    parts.push({
      type: "text",
      text: split.stablePrefix,
      cache_control: cacheControl
    });
  }
  if (split.dynamicSuffix) {
    parts.push({ type: "text", text: split.dynamicSuffix });
  }
  return parts.length > 0 ? parts : [{ type: "text", text: "" }];
}
function convertMessages(model, context, compat, options = {}) {
  const params = [];
  const normalizeToolCallId = (id) => {
    if (id.includes("|")) {
      const callId = id.slice(0, id.indexOf("|"));
      return callId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    }
    if (model.provider === "openai") {
      return id.length > 40 ? id.slice(0, 40) : id;
    }
    return id;
  };
  const transformedMessages = transformMessages(
    context.messages,
    model,
    (id) => normalizeToolCallId(id)
  );
  if (context.systemPrompt) {
    const useDeveloperRole = model.reasoning && compat.supportsDeveloperRole;
    const role = useDeveloperRole ? "developer" : "system";
    const systemPrompt = options.preserveSystemPromptCacheBoundary ? context.systemPrompt : stripSystemPromptCacheBoundary(context.systemPrompt);
    params.push({
      role,
      content: sanitizeSurrogates(systemPrompt)
    });
  }
  let lastRole = null;
  for (let i = 0; i < transformedMessages.length; i++) {
    const msg = transformedMessages[i];
    if (!msg) {
      continue;
    }
    if (compat.requiresAssistantAfterToolResult && lastRole === "toolResult" && msg.role === "user") {
      params.push({
        role: "assistant",
        content: "I have processed the tool results."
      });
    }
    if (msg.role === "user") {
      const isRuntimeContextCarrier = msg.runtimeContextCarrier === true;
      if (typeof msg.content === "string") {
        const userParam = {
          role: "user",
          content: sanitizeSurrogates(msg.content)
        };
        if (isRuntimeContextCarrier) {
          options.cacheOptOutIndexes?.add(params.length);
        }
        params.push(userParam);
      } else {
        const content = msg.content.map(
          (item) => {
            if (item.type === "text") {
              return {
                type: "text",
                text: sanitizeSurrogates(item.text)
              };
            }
            return {
              type: "image_url",
              image_url: {
                url: `data:${item.mimeType};base64,${item.data}`
              }
            };
          }
        );
        if (content.length === 0) {
          continue;
        }
        const userParam = {
          role: "user",
          content
        };
        if (isRuntimeContextCarrier) {
          options.cacheOptOutIndexes?.add(params.length);
        }
        params.push(userParam);
      }
    } else if (msg.role === "assistant") {
      const assistantMsg = {
        role: "assistant",
        content: compat.requiresAssistantAfterToolResult ? "" : null
      };
      const assistantTextParts = msg.content.filter(isTextContentBlock).filter((block) => block.text.trim().length > 0).map(
        (block) => ({
          type: "text",
          text: sanitizeSurrogates(block.text)
        })
      );
      const assistantText = assistantTextParts.map((part) => part.text).join("");
      const nonEmptyThinkingBlocks = msg.content.filter(isThinkingContentBlock).filter((block) => block.thinking.trim().length > 0);
      if (nonEmptyThinkingBlocks.length > 0) {
        if (compat.requiresThinkingAsText) {
          const thinkingText = nonEmptyThinkingBlocks.map((block) => sanitizeSurrogates(block.thinking)).join("\n\n");
          assistantMsg.content = [{ type: "text", text: thinkingText }, ...assistantTextParts];
        } else {
          if (assistantText.length > 0) {
            assistantMsg.content = assistantText;
          }
          let signature = nonEmptyThinkingBlocks.at(0)?.thinkingSignature;
          if (model.provider === "opencode-go" && signature === "reasoning") {
            signature = "reasoning_content";
          }
          if (signature && signature.length > 0) {
            assistantMsg[signature] = nonEmptyThinkingBlocks.map((block) => block.thinking).join("\n");
          }
        }
      } else if (assistantText.length > 0) {
        assistantMsg.content = assistantText;
      }
      const toolCalls = msg.content.filter(isToolCallBlock);
      if (toolCalls.length > 0) {
        assistantMsg.tool_calls = toolCalls.map((tc) => ({
          id: tc.id,
          type: "function",
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.arguments)
          }
        }));
        const reasoningDetails = toolCalls.flatMap((tc) => {
          const signature = tc.thoughtSignature;
          if (!signature) {
            return [];
          }
          try {
            const parsed = JSON.parse(signature);
            return parsed ? [parsed] : [];
          } catch {
            return [];
          }
        });
        if (reasoningDetails.length > 0) {
          assistantMsg.reasoning_details = reasoningDetails;
        }
      }
      if (compat.requiresReasoningContentOnAssistantMessages && model.reasoning && assistantMsg.reasoning_content === void 0) {
        assistantMsg.reasoning_content = "";
      }
      const content = assistantMsg.content;
      const hasContent = content !== null && content !== void 0 && (typeof content === "string" ? content.length > 0 : content.length > 0);
      if (!hasContent && !assistantMsg.tool_calls) {
        continue;
      }
      params.push(assistantMsg);
    } else if (msg.role === "toolResult") {
      const imageBlocks = [];
      let j = i;
      while (j < transformedMessages.length) {
        const toolMsg = transformedMessages.at(j);
        if (toolMsg?.role !== "toolResult") {
          break;
        }
        const textResult = extractToolResultText(toolMsg.content);
        const mediaPlaceholder = describeToolResultMediaPlaceholder(toolMsg.content);
        const hasImages = toolMsg.content.some(isImageWithMediaPayload);
        const content = sanitizeToolResultText(
          textResult,
          mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT
        );
        const toolResultMsg = {
          role: "tool",
          content,
          tool_call_id: toolMsg.toolCallId
        };
        if (compat.requiresToolResultName && toolMsg.toolName) {
          toolResultMsg.name = toolMsg.toolName;
        }
        params.push(toolResultMsg);
        if (hasImages && model.input.includes("image")) {
          for (const block of toolMsg.content) {
            if (isImageWithMediaPayload(block)) {
              imageBlocks.push({
                type: "image_url",
                image_url: {
                  url: `data:${block.mimeType};base64,${block.data}`
                }
              });
            }
          }
        }
        j += 1;
      }
      i = j - 1;
      if (imageBlocks.length > 0) {
        if (compat.requiresAssistantAfterToolResult) {
          params.push({
            role: "assistant",
            content: "I have processed the tool results."
          });
        }
        params.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "Attached image(s) from tool result:"
            },
            ...imageBlocks
          ]
        });
        lastRole = "user";
      } else {
        lastRole = "toolResult";
      }
      continue;
    }
    lastRole = msg.role;
  }
  return params;
}
function convertTools(tools, compat) {
  const projection = projectOpenAITools(tools);
  return {
    projection,
    tools: projection.tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        // Only include strict if provider supports it. Some reject unknown fields.
        ...compat.supportsStrictMode && { strict: false }
      }
    }))
  };
}
function parseChunkUsage(rawUsage, model) {
  const promptTokens = rawUsage.prompt_tokens || 0;
  const cacheReadTokens = rawUsage.prompt_tokens_details?.cached_tokens ?? rawUsage.prompt_cache_hit_tokens ?? 0;
  const cacheWriteTokens = rawUsage.prompt_tokens_details?.cache_write_tokens || 0;
  const input = Math.max(0, promptTokens - cacheReadTokens - cacheWriteTokens);
  const outputTokens = rawUsage.completion_tokens || 0;
  const usage = {
    input,
    output: outputTokens,
    cacheRead: cacheReadTokens,
    cacheWrite: cacheWriteTokens,
    totalTokens: input + outputTokens + cacheReadTokens + cacheWriteTokens,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
  };
  calculateCost(model, usage);
  applyProviderReportedUsageCost(usage, rawUsage.cost);
  return usage;
}
function detectCompat(model) {
  const provider = model.provider;
  const baseUrl = model.baseUrl;
  const isZai = provider === "zai" || baseUrl.includes("api.z.ai");
  const isTogether = provider === "together" || baseUrl.includes("api.together.ai") || baseUrl.includes("api.together.xyz");
  const isMoonshot = provider === "moonshotai" || provider === "moonshotai-cn" || baseUrl.includes("api.moonshot.");
  const isCloudflareWorkersAI = provider === "cloudflare-workers-ai" || baseUrl.includes("api.cloudflare.com");
  const isCloudflareAiGateway = provider === "cloudflare-ai-gateway" || baseUrl.includes("gateway.ai.cloudflare.com");
  const isOpenRouter = provider === "openrouter" || baseUrl.includes("openrouter.ai");
  const isNonStandard = provider === "cerebras" || baseUrl.includes("cerebras.ai") || provider === "xai" || baseUrl.includes("api.x.ai") || isTogether || baseUrl.includes("chutes.ai") || baseUrl.includes("deepseek.com") || isZai || isMoonshot || provider === "opencode" || baseUrl.includes("opencode.ai") || isCloudflareWorkersAI || isCloudflareAiGateway;
  const useMaxTokens = baseUrl.includes("chutes.ai") || isMoonshot || isCloudflareAiGateway || isTogether || isZai;
  const isGrok = provider === "xai" || baseUrl.includes("api.x.ai");
  const isDeepSeek = provider === "deepseek" || baseUrl.includes("deepseek.com");
  const isXiaomi = provider === "xiaomi" || baseUrl.includes("xiaomimimo.com");
  const supportsOpenRouterDeveloperRole = isOpenRouter && (model.id.startsWith("anthropic/") || model.id.startsWith("openai/"));
  const usesOpenRouterSessionAffinity = isOpenRouter || model.compat?.thinkingFormat === "openrouter" || model.compat?.openRouterRouting !== void 0;
  const cacheControlFormat = provider === "openrouter" && model.id.startsWith("anthropic/") ? "anthropic" : void 0;
  return {
    supportsStore: !isNonStandard,
    supportsDeveloperRole: supportsOpenRouterDeveloperRole || !isNonStandard && !isOpenRouter,
    supportsReasoningEffort: !isGrok && !isZai && !isMoonshot && !isTogether && !isCloudflareAiGateway,
    supportsUsageInStreaming: true,
    maxTokensField: useMaxTokens ? "max_tokens" : "max_completion_tokens",
    requiresToolResultName: false,
    requiresAssistantAfterToolResult: false,
    requiresThinkingAsText: false,
    requiresReasoningContentOnAssistantMessages: isDeepSeek || isXiaomi,
    thinkingFormat: isDeepSeek ? "deepseek" : isXiaomi ? "deepseek" : isZai ? "zai" : isTogether ? "together" : isOpenRouter ? "openrouter" : "openai",
    openRouterRouting: {},
    vercelGatewayRouting: {},
    zaiToolStream: false,
    supportsStrictMode: !isMoonshot && !isTogether && !isCloudflareAiGateway,
    cacheControlFormat,
    sendSessionAffinityHeaders: false,
    sessionAffinityFormat: usesOpenRouterSessionAffinity ? "openrouter" : "openai",
    supportsPromptCacheKey: false,
    supportsLongCacheRetention: !(isTogether || isCloudflareWorkersAI || isCloudflareAiGateway)
  };
}
function getCompat(model) {
  const detected = detectCompat(model);
  if (!model.compat) {
    return detected;
  }
  return {
    supportsStore: model.compat.supportsStore ?? detected.supportsStore,
    supportsDeveloperRole: model.compat.supportsDeveloperRole ?? detected.supportsDeveloperRole,
    supportsReasoningEffort: model.compat.supportsReasoningEffort ?? detected.supportsReasoningEffort,
    supportsUsageInStreaming: model.compat.supportsUsageInStreaming ?? detected.supportsUsageInStreaming,
    maxTokensField: model.compat.maxTokensField ?? detected.maxTokensField,
    requiresToolResultName: model.compat.requiresToolResultName ?? detected.requiresToolResultName,
    requiresAssistantAfterToolResult: model.compat.requiresAssistantAfterToolResult ?? detected.requiresAssistantAfterToolResult,
    requiresThinkingAsText: model.compat.requiresThinkingAsText ?? detected.requiresThinkingAsText,
    requiresReasoningContentOnAssistantMessages: model.compat.requiresReasoningContentOnAssistantMessages ?? detected.requiresReasoningContentOnAssistantMessages,
    thinkingFormat: model.compat.thinkingFormat ?? detected.thinkingFormat,
    openRouterRouting: model.compat.openRouterRouting ?? {},
    vercelGatewayRouting: model.compat.vercelGatewayRouting ?? detected.vercelGatewayRouting,
    zaiToolStream: model.compat.zaiToolStream ?? detected.zaiToolStream,
    supportsStrictMode: model.compat.supportsStrictMode ?? detected.supportsStrictMode,
    cacheControlFormat: model.compat.cacheControlFormat ?? detected.cacheControlFormat,
    sendSessionAffinityHeaders: model.compat.sendSessionAffinityHeaders ?? detected.sendSessionAffinityHeaders,
    sessionAffinityFormat: detected.sessionAffinityFormat,
    supportsPromptCacheKey: model.compat.supportsPromptCacheKey ?? detected.supportsPromptCacheKey,
    supportsLongCacheRetention: model.compat.supportsLongCacheRetention ?? detected.supportsLongCacheRetention
  };
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
function normalizeModelId2(id) {
  return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
function isOpenAIGpt54MiniModel(model) {
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
  return /^gpt-5\.4-mini(?:-|$)/u.test(id);
}
function isOpenAIGpt55Model(model) {
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
  const name = normalizeModelId2(typeof model.name === "string" ? model.name : void 0);
  return /^gpt-5\.5(?:-|$)/u.test(id) || /^gpt-5\.5(?:\s|\(|-|$)/u.test(name);
}
function isOpenAIGpt56Model(model) {
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
  const name = normalizeModelId2(typeof model.name === "string" ? model.name : void 0);
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
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
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
  const id = normalizeModelId2(typeof model.id === "string" ? model.id : void 0);
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

// packages/ai/src/providers/openai-responses.ts
import OpenAI2 from "openai";

// packages/ai/src/providers/openai-responses-shared.ts
import { randomUUID } from "node:crypto";

// packages/ai/src/utils/hash.ts
function shortHash(str) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}

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

// packages/ai/src/providers/openai-responses-terminal-usage.ts
function readCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function mapResponsesTerminalUsage(usage) {
  if (!usage) {
    return void 0;
  }
  const cacheRead = readCount(usage.input_tokens_details?.cached_tokens);
  const cacheWrite = readCount(usage.input_tokens_details?.cache_write_tokens);
  const input = Math.max(0, readCount(usage.input_tokens) - cacheRead - cacheWrite);
  const output = readCount(usage.output_tokens);
  const bucketTotal = input + output + cacheRead + cacheWrite;
  const totalTokens = Math.max(bucketTotal, readCount(usage.total_tokens));
  return { input, output, cacheRead, cacheWrite, totalTokens };
}
function readResponsesReasoningTokens(usage) {
  const reasoningTokens = usage?.output_tokens_details?.reasoning_tokens;
  return typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) ? reasoningTokens : void 0;
}
function mapResponsesTerminalStopReason(status) {
  if (!status) {
    return "stop";
  }
  switch (status) {
    case "completed":
      return "stop";
    case "incomplete":
      return "length";
    case "failed":
    case "cancelled":
      return "error";
    // These two are wonky ...
    case "in_progress":
    case "queued":
      return "stop";
    default: {
      const exhaustive = status;
      throw new Error(`Unhandled stop reason: ${String(exhaustive)}`);
    }
  }
}
function resolveResponsesTerminalStopReason(params) {
  if (params.status === "incomplete" && params.incompleteReason === "content_filter") {
    return { stopReason: "error", errorMessage: "Provider incomplete_reason: content_filter" };
  }
  const stopReason = mapResponsesTerminalStopReason(params.status);
  if (stopReason === "stop" && params.hasToolCall) {
    return { stopReason: "toolUse" };
  }
  return { stopReason };
}

// packages/ai/src/providers/openai-responses-tool-call-tracker.ts
function readIdentityValue(value) {
  const identity = typeof value === "string" ? value.trim() : "";
  return identity || void 0;
}
function readOutputIndex(event) {
  return typeof event.output_index === "number" && Number.isInteger(event.output_index) && event.output_index >= 0 ? event.output_index : void 0;
}
function readEventIdentity(event) {
  return { itemId: readIdentityValue(event.item_id) };
}
function readResponsesToolCallItemIdentity(item) {
  return {
    itemId: readIdentityValue(item.id),
    callId: readIdentityValue(item.call_id)
  };
}
function createResponsesToolCallTracker() {
  const indexedCalls = /* @__PURE__ */ new Map();
  const unindexedCalls = /* @__PURE__ */ new Set();
  const identitiesConflict = (state, identity) => Boolean(
    state.itemId && identity.itemId && state.itemId !== identity.itemId || state.callId && identity.callId && state.callId !== identity.callId
  );
  const sharesIdentity = (state, identity) => Boolean(
    state.itemId && identity.itemId && state.itemId === identity.itemId || state.callId && identity.callId && state.callId === identity.callId
  );
  const adoptIdentity = (state, identity) => {
    state.itemId ??= identity.itemId;
    state.callId ??= identity.callId;
    return state;
  };
  const resolveCompatible = (candidates, identity) => {
    const uniqueCandidates = [...new Set(candidates)];
    if (!identity.itemId && !identity.callId) {
      return uniqueCandidates.length === 1 ? uniqueCandidates.at(0) : void 0;
    }
    const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
    const matches = compatible.filter((state) => sharesIdentity(state, identity));
    const matched = matches.length === 1 ? matches.at(0) : void 0;
    if (matched) {
      return adoptIdentity(matched, identity);
    }
    const soleCompatible = uniqueCandidates.length === 1 && compatible.length === 1 && matches.length === 0 ? compatible.at(0) : void 0;
    return soleCompatible ? adoptIdentity(soleCompatible, identity) : void 0;
  };
  return {
    register(event, state) {
      const outputIndex = readOutputIndex(event);
      if (outputIndex === void 0) {
        unindexedCalls.add(state);
        return;
      }
      if (indexedCalls.has(outputIndex)) {
        throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
      }
      indexedCalls.set(outputIndex, state);
    },
    resolve(event, identity = readEventIdentity(event)) {
      const outputIndex = readOutputIndex(event);
      if (outputIndex !== void 0) {
        const indexed = indexedCalls.get(outputIndex);
        if (indexed) {
          if (indexed.callId && identity.callId && indexed.callId !== identity.callId) {
            return void 0;
          }
          return adoptIdentity(indexed, identity);
        }
        const unindexed = resolveCompatible(unindexedCalls, identity);
        if (unindexed) {
          unindexedCalls.delete(unindexed);
          indexedCalls.set(outputIndex, unindexed);
        }
        return unindexed;
      }
      return resolveCompatible([...indexedCalls.values(), ...unindexedCalls], identity);
    },
    forget(toolCall) {
      for (const [outputIndex, tracked] of indexedCalls) {
        if (tracked === toolCall) {
          indexedCalls.delete(outputIndex);
        }
      }
      unindexedCalls.delete(toolCall);
    },
    markArgumentsUnreliable() {
      for (const toolCall of /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])) {
        toolCall.argumentStreamReliable = false;
      }
    },
    hasActive() {
      return indexedCalls.size > 0 || unindexedCalls.size > 0;
    }
  };
}

// packages/ai/src/providers/openai-responses-tools.ts
import { createHash } from "node:crypto";

// packages/ai/src/providers/openai-tool-schema-compat.ts
var OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  // Draft-07 dependencies mix schema values with property-name arrays. The
  // recursive helpers leave scalar array entries untouched.
  "dependencies",
  "patternProperties",
  "properties"
]);
var OPENAI_NULLABLE_ANNOTATION_KEYS = /* @__PURE__ */ new Set([
  "default",
  "description",
  "examples",
  "format",
  "title"
]);
var OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS = /* @__PURE__ */ new Set([
  "additionalItems",
  "additionalProperties",
  "allOf",
  "anyOf",
  "contains",
  "contentSchema",
  "else",
  "if",
  "items",
  "not",
  "oneOf",
  "prefixItems",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties"
]);
function normalizeOpenAIStrictCompatSchemaMap(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return schema;
  }
  let changed = false;
  const normalized = {};
  for (const [key, value] of Object.entries(schema)) {
    const next = normalizeOpenAIStrictCompatSchemaRecursive(value, {
      promoteEmptyObject: false
    });
    normalized[key] = next;
    changed ||= next !== value;
  }
  return changed ? normalized : schema;
}
function normalizeOpenAIStrictCompatSchemaRecursive(schema, options) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const normalized2 = schema.map((entry) => {
      const next = normalizeOpenAIStrictCompatSchemaRecursive(entry, {
        promoteEmptyObject: false
      });
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? normalized2 : schema;
  }
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const record = schema;
  let changed = false;
  let hadNullType = false;
  const normalized = {};
  for (const [key, value] of Object.entries(record)) {
    if (value === null && OPENAI_NULLABLE_ANNOTATION_KEYS.has(key)) {
      changed = true;
      continue;
    }
    if (value === null && key === "type") {
      hadNullType = true;
      changed = true;
      continue;
    }
    const next = OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS.has(key) ? normalizeOpenAIStrictCompatSchemaMap(value) : OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS.has(key) ? normalizeOpenAIStrictCompatSchemaRecursive(value, {
      promoteEmptyObject: false
    }) : value;
    normalized[key] = next;
    changed ||= next !== value;
  }
  if (Object.keys(normalized).length === 0) {
    if (!options.promoteEmptyObject) {
      return schema;
    }
    return {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    };
  }
  const hasObjectShapeHints = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) || Array.isArray(normalized.required);
  const hasArrayShapeHints = "items" in normalized;
  if (!("type" in normalized) && hasObjectShapeHints !== hasArrayShapeHints) {
    normalized.type = hasObjectShapeHints ? "object" : "array";
    changed = true;
  } else if (hadNullType && !("type" in normalized)) {
    normalized.type = null;
  }
  if (normalized.type === "object" && !("properties" in normalized)) {
    normalized.properties = {};
    changed = true;
  }
  const hasEmptyProperties = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) && Object.keys(normalized.properties).length === 0;
  if (normalized.type === "object" && !Array.isArray(normalized.required) && hasEmptyProperties) {
    normalized.required = [];
    changed = true;
  }
  if (normalized.type === "object" && hasEmptyProperties && !("additionalProperties" in normalized)) {
    normalized.additionalProperties = false;
    changed = true;
  }
  return changed ? normalized : schema;
}
function normalizeOpenAIStrictCompatSchema(schema) {
  return normalizeOpenAIStrictCompatSchemaRecursive(schema, {
    promoteEmptyObject: true
  });
}
function findOpenAIStrictSchemaViolations(schema, path, options) {
  if (Array.isArray(schema)) {
    if (options?.requireObjectRoot) {
      return [`${path}.type`];
    }
    return schema.flatMap(
      (item, index) => findOpenAIStrictSchemaViolations(item, `${path}[${index}]`)
    );
  }
  if (!schema || typeof schema !== "object") {
    return options?.requireObjectRoot ? [`${path}.type`] : [];
  }
  const record = schema;
  const violations = [];
  for (const key of ["anyOf", "oneOf", "allOf"]) {
    if (key in record) {
      violations.push(`${path}.${key}`);
    }
  }
  if (Array.isArray(record.type)) {
    violations.push(`${path}.type`);
  }
  const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : void 0;
  if (record.type === "object") {
    if (record.additionalProperties !== false) {
      violations.push(`${path}.additionalProperties`);
    }
    const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
    if (!required) {
      violations.push(`${path}.required`);
    } else if (properties) {
      const requiredSet = new Set(required);
      for (const key of Object.keys(properties)) {
        if (!requiredSet.has(key)) {
          violations.push(`${path}.required.${key}`);
        }
      }
    }
  }
  for (const key of OPENAI_STRICT_COMPAT_SCHEMA_MAP_KEYS) {
    const schemaMap = record[key];
    if (!schemaMap || typeof schemaMap !== "object" || Array.isArray(schemaMap)) {
      continue;
    }
    for (const [entryKey, value] of Object.entries(schemaMap)) {
      violations.push(...findOpenAIStrictSchemaViolations(value, `${path}.${key}.${entryKey}`));
    }
  }
  for (const key of OPENAI_STRICT_COMPAT_SCHEMA_NESTED_KEYS) {
    const value = record[key];
    if (value && typeof value === "object") {
      violations.push(...findOpenAIStrictSchemaViolations(value, `${path}.${key}`));
    }
  }
  return violations;
}

// packages/ai/src/providers/openai-tool-schema.ts
var MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA = 8;
var strictOpenAISchemaCache = /* @__PURE__ */ new WeakMap();
function resolveToolSchemaModelCompat(compat) {
  if (!compat) {
    return void 0;
  }
  const unsupportedToolSchemaKeywords = Array.isArray(compat.unsupportedToolSchemaKeywords) ? compat.unsupportedToolSchemaKeywords.filter(
    (keyword) => typeof keyword === "string"
  ) : [];
  if (unsupportedToolSchemaKeywords.length === 0 && compat.omitEmptyArrayItems !== true) {
    return void 0;
  }
  return {
    ...unsupportedToolSchemaKeywords.length > 0 ? { unsupportedToolSchemaKeywords } : {},
    ...compat.omitEmptyArrayItems === true ? { omitEmptyArrayItems: true } : {}
  };
}
function resolveStrictOpenAISchemaCacheKey(modelCompat) {
  const compat = resolveToolSchemaModelCompat(modelCompat);
  return JSON.stringify([
    [...compat?.unsupportedToolSchemaKeywords ?? []].toSorted(),
    shouldOmitEmptyArrayItems(compat)
  ]);
}
function readCachedStrictOpenAISchema(schema, key) {
  return strictOpenAISchemaCache.get(schema)?.find((entry) => entry.key === key)?.value;
}
function rememberStrictOpenAISchema(schema, key, value) {
  const entries = strictOpenAISchemaCache.get(schema) ?? [];
  strictOpenAISchemaCache.set(
    schema,
    [{ key, value }, ...entries.filter((entry) => entry.key !== key)].slice(
      0,
      MAX_STRICT_SCHEMA_CACHE_ENTRIES_PER_SCHEMA
    )
  );
  return value;
}
function clearOpenAIToolSchemaCacheForTest() {
  strictOpenAISchemaCache = /* @__PURE__ */ new WeakMap();
}
function normalizeStrictOpenAIJsonSchema(schema, modelCompat) {
  const schemaInput = schema ?? {};
  if (!schemaInput || typeof schemaInput !== "object") {
    return normalizeStrictOpenAIJsonSchemaRecursive(
      normalizeToolParameterSchema(schemaInput, {
        modelCompat: resolveToolSchemaModelCompat(modelCompat)
      }),
      0
    );
  }
  const cacheKey = resolveStrictOpenAISchemaCacheKey(modelCompat);
  const cached = readCachedStrictOpenAISchema(schemaInput, cacheKey);
  if (cached !== void 0) {
    return cached;
  }
  return rememberStrictOpenAISchema(
    schemaInput,
    cacheKey,
    // Cache by input object and compatibility key so repeated inventory generation preserves object
    // identity without mixing schemas normalized for different provider limitations.
    normalizeStrictOpenAIJsonSchemaRecursive(
      normalizeToolParameterSchema(schemaInput, {
        modelCompat: resolveToolSchemaModelCompat(modelCompat)
      }),
      0
    )
  );
}
function normalizeStrictOpenAIJsonSchemaRecursive(schema, depth) {
  if (Array.isArray(schema)) {
    let changed2 = false;
    const normalized2 = schema.map((entry) => {
      const next = normalizeStrictOpenAIJsonSchemaRecursive(entry, depth);
      changed2 ||= next !== entry;
      return next;
    });
    return changed2 ? normalized2 : schema;
  }
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const record = schema;
  let changed = false;
  const normalized = {};
  for (const [key, value] of Object.entries(record)) {
    const next = normalizeStrictOpenAIJsonSchemaRecursive(
      value,
      key === "properties" ? depth : depth + 1
    );
    normalized[key] = next;
    changed ||= next !== value;
  }
  if (normalized.type === "object") {
    const properties = normalized.properties && typeof normalized.properties === "object" && !Array.isArray(normalized.properties) ? normalized.properties : void 0;
    if (properties && Object.keys(properties).length === 0 && !Array.isArray(normalized.required)) {
      normalized.required = [];
      changed = true;
    }
    if (depth === 0 && !("additionalProperties" in normalized)) {
      normalized.additionalProperties = false;
      changed = true;
    }
  }
  return changed ? normalized : schema;
}
function normalizeOpenAIStrictToolParameters(schema, strict, modelCompat) {
  const toolSchemaCompat = resolveToolSchemaModelCompat(modelCompat);
  if (!strict) {
    return normalizeToolParameterSchema(schema ?? {}, { modelCompat: toolSchemaCompat });
  }
  return normalizeStrictOpenAIJsonSchema(schema, toolSchemaCompat);
}
function isStrictOpenAIJsonSchemaCompatible(schema) {
  return isStrictOpenAIJsonSchemaCompatibleRecursive(normalizeStrictOpenAIJsonSchema(schema));
}
function findOpenAIStrictToolProjectionDiagnostics(projection) {
  return [
    ...projection.diagnostics.map((diagnostic) => ({
      toolIndex: diagnostic.toolIndex,
      ...diagnostic.toolName ? { toolName: diagnostic.toolName } : {},
      violations: [...diagnostic.violations]
    })),
    ...projection.tools.flatMap((tool) => {
      const violations = findOpenAIStrictSchemaViolations(
        normalizeStrictOpenAIJsonSchema(tool.parameters),
        `${tool.name}.parameters`
      );
      return violations.length > 0 ? [{ toolIndex: tool.toolIndex, toolName: tool.name, violations }] : [];
    })
  ];
}
function isStrictOpenAIJsonSchemaCompatibleRecursive(schema) {
  if (Array.isArray(schema)) {
    return schema.every((entry) => isStrictOpenAIJsonSchemaCompatibleRecursive(entry));
  }
  if (!schema || typeof schema !== "object") {
    return true;
  }
  const record = schema;
  if ("anyOf" in record || "oneOf" in record || "allOf" in record) {
    return false;
  }
  if (Array.isArray(record.type)) {
    return false;
  }
  if (record.type === "object" && record.additionalProperties !== false) {
    return false;
  }
  if (record.type === "object") {
    const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : {};
    const required = Array.isArray(record.required) ? record.required.filter((entry) => typeof entry === "string") : void 0;
    if (!required) {
      return false;
    }
    const requiredSet = new Set(required);
    if (Object.keys(properties).some((key) => !requiredSet.has(key))) {
      return false;
    }
  }
  return Object.entries(record).every(([key, entry]) => {
    if (key === "properties" && entry && typeof entry === "object" && !Array.isArray(entry)) {
      return Object.values(entry).every(
        (value) => isStrictOpenAIJsonSchemaCompatibleRecursive(value)
      );
    }
    return isStrictOpenAIJsonSchemaCompatibleRecursive(entry);
  });
}
function resolveOpenAIProjectedToolsStrictToolFlag(projection, strict) {
  if (strict !== true) {
    return strict === false ? false : void 0;
  }
  return projection.tools.every((tool) => isStrictOpenAIJsonSchemaCompatible(tool.parameters));
}

// packages/ai/src/providers/openai-responses-tools.ts
var LOG_SUBSYSTEM = "llm/openai-responses";
var MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 64;
var loggedStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
function convertResponsesToolPayload(tools, options) {
  const projection = projectOpenAITools(tools);
  const strictSetting = resolveResponsesStrictToolSetting(options);
  const strict = resolveResponsesStrictToolFlag(projection, strictSetting, options?.model);
  const convertedTools = sortResponsesToolsByName(projection.tools).map((tool) => {
    const result = {
      type: "function",
      name: tool.name,
      description: tool.description,
      parameters: normalizeOpenAIStrictToolParameters(
        tool.parameters,
        strict === true,
        options?.model?.compat
      )
    };
    if (strict !== void 0) {
      result.strict = strict;
    }
    return result;
  });
  return { projection, tools: convertedTools };
}
function resolveResponsesStrictToolSetting(options) {
  if (options?.strict !== void 0) {
    return options.strict;
  }
  if (options?.model) {
    return getAiTransportHost().resolveOpenAIStrictToolSetting(options.model, {
      transport: "stream",
      supportsStrictMode: options.supportsStrictMode
    });
  }
  return false;
}
function resolveResponsesStrictToolFlag(projection, strictSetting, model) {
  const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
  if (strictSetting === true && strict === false && model) {
    getAiTransportHost().logDebug(LOG_SUBSYSTEM, () => {
      const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
      if (!shouldLogStrictToolDowngradeDiagnostic(diagnostics, model)) {
        return null;
      }
      const sample = diagnostics.slice(0, 5).map((entry) => ({
        tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
        violations: entry.violations.slice(0, 8)
      }));
      return {
        message: `OpenAI responses tool schema strict mode downgraded to strict=false for ${model.provider ?? "unknown"}/${model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`,
        data: {
          provider: model.provider,
          model: model.id,
          incompatibleToolCount: diagnostics.length,
          sample
        }
      };
    });
  }
  return strict;
}
function shouldLogStrictToolDowngradeDiagnostic(diagnostics, model) {
  const key = createHash("sha256").update(
    JSON.stringify({
      provider: model.provider,
      model: model.id,
      diagnostics: diagnostics.map((entry) => ({
        toolIndex: entry.toolIndex,
        toolName: entry.toolName ?? null,
        violations: entry.violations
      }))
    })
  ).digest("hex");
  if (loggedStrictToolDowngradeDiagnosticKeys.has(key)) {
    return false;
  }
  if (loggedStrictToolDowngradeDiagnosticKeys.size >= MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS) {
    loggedStrictToolDowngradeDiagnosticKeys.clear();
  }
  loggedStrictToolDowngradeDiagnosticKeys.add(key);
  return true;
}
function compareToolText(left, right) {
  const leftText = left ?? "";
  const rightText = right ?? "";
  if (leftText < rightText) {
    return -1;
  }
  if (leftText > rightText) {
    return 1;
  }
  return 0;
}
function sortResponsesToolsByName(tools) {
  return tools.toSorted(
    (left, right) => compareToolText(left.name, right.name) || compareToolText(left.description, right.description)
  );
}

// packages/ai/src/providers/openai-responses-shared.ts
var EMPTY_TOOL_RESULT_TEXT2 = "(no output)";
function splitResponsesToolCallId(id) {
  const separatorIndex = id.indexOf("|");
  return separatorIndex === -1 ? [id, void 0] : [id.slice(0, separatorIndex), id.slice(separatorIndex + 1)];
}
function resolveResponsesToolCallId(item, fallbackId) {
  const callId = typeof item.call_id === "string" ? item.call_id.trim() : "";
  const itemId = typeof item.id === "string" ? item.id.trim() : "";
  const [fallbackCallId, fallbackItemId = ""] = splitResponsesToolCallId(fallbackId ?? "");
  const resolvedCallId = callId || fallbackCallId;
  const resolvedItemId = itemId || fallbackItemId;
  if (resolvedCallId) {
    return resolvedItemId ? `${resolvedCallId}|${resolvedItemId}` : resolvedCallId;
  }
  const generatedCallId = `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
  return resolvedItemId ? `${generatedCallId}|${resolvedItemId}` : generatedCallId;
}
function sanitizeToolResultText2(text, fallback) {
  const sanitized = sanitizeSurrogates(text);
  return sanitized.trim().length > 0 ? sanitized : fallback;
}
function normalizeResponsesReasoningReplayItem(params) {
  const next = { ...params.item };
  if (!Array.isArray(next.summary)) {
    next.summary = [];
  }
  if (!params.replayResponsesItemIds) {
    delete next.id;
  }
  return next;
}
function encodeTextSignatureV1(id, phase) {
  const payload = { v: 1, id };
  if (phase) {
    payload.phase = phase;
  }
  return JSON.stringify(payload);
}
function parseTextSignature(signature) {
  if (!signature) {
    return void 0;
  }
  if (signature.startsWith("{")) {
    try {
      const parsed = JSON.parse(signature);
      if (parsed.v === 1) {
        const id = typeof parsed.id === "string" ? parsed.id : void 0;
        const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
        if (id !== void 0 || phase !== void 0) {
          return { id, phase };
        }
        return void 0;
      }
    } catch {
    }
  }
  return { id: signature };
}
function resolveReplayableResponsesMessageId(params) {
  if (!params.textSignatureId) {
    return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
  }
  return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
function isResponsesReasoningEffort(effort) {
  return effort === "minimal" || effort === "low" || effort === "medium" || effort === "high" || effort === "xhigh" || effort === "max";
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
  const messages = [];
  const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
  const normalizeIdPart = (part) => {
    const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
    const normalized = sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized;
    return normalized.replace(/_+$/, "");
  };
  const buildForeignResponsesItemId = (itemId) => {
    const normalized = `fc_${shortHash(itemId)}`;
    return normalized.length > 64 ? normalized.slice(0, 64) : normalized;
  };
  const normalizeToolCallId = (id, targetModel, source) => {
    void targetModel;
    if (!allowedToolCallProviders.has(model.provider)) {
      return normalizeIdPart(id);
    }
    if (!id.includes("|")) {
      return normalizeIdPart(id);
    }
    const [callId, itemId = ""] = splitResponsesToolCallId(id);
    const normalizedCallId = normalizeIdPart(callId);
    const isForeignToolCall = source.provider !== model.provider || source.api !== model.api;
    let normalizedItemId = isForeignToolCall ? buildForeignResponsesItemId(itemId) : normalizeIdPart(itemId);
    if (!normalizedItemId.startsWith("fc_")) {
      normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
    }
    return `${normalizedCallId}|${normalizedItemId}`;
  };
  const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId);
  const includeSystemPrompt = options?.includeSystemPrompt ?? true;
  if (includeSystemPrompt && context.systemPrompt) {
    const compat = model.compat;
    const role = model.reasoning && compat?.supportsDeveloperRole !== false ? "developer" : "system";
    messages.push({
      type: "message",
      role,
      content: [
        {
          type: "input_text",
          text: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
        }
      ]
    });
  }
  let msgIndex = 0;
  for (const msg of transformedMessages) {
    if (msg.role === "user") {
      if (typeof msg.content === "string") {
        messages.push({
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: sanitizeSurrogates(msg.content) }]
        });
      } else {
        const content = msg.content.map((item) => {
          if (item.type === "text") {
            return {
              type: "input_text",
              text: sanitizeSurrogates(item.text)
            };
          }
          return {
            type: "input_image",
            detail: "auto",
            image_url: `data:${item.mimeType};base64,${item.data}`
          };
        });
        if (content.length === 0) {
          continue;
        }
        messages.push({
          type: "message",
          role: "user",
          content
        });
      }
    } else if (msg.role === "assistant") {
      const output = [];
      let textFallbackOrdinal = 0;
      const assistantMsg = msg;
      let previousReplayItemWasReasoning = false;
      const isDifferentModel = assistantMsg.model !== model.id && assistantMsg.provider === model.provider && assistantMsg.api === model.api;
      for (const block of msg.content) {
        if (block.type === "thinking") {
          if (block.thinkingSignature) {
            const reasoningItem = normalizeResponsesReasoningReplayItem({
              item: JSON.parse(block.thinkingSignature),
              replayResponsesItemIds: shouldReplayResponsesItemIds
            });
            output.push(reasoningItem);
            previousReplayItemWasReasoning = true;
          }
        } else if (block.type === "text") {
          const textBlock = block;
          const parsedSignature = parseTextSignature(textBlock.textSignature);
          let msgId = shouldReplayResponsesItemIds ? resolveReplayableResponsesMessageId({
            textSignatureId: parsedSignature?.id,
            fallbackId: `msg_${msgIndex}`,
            fallbackOrdinal: textFallbackOrdinal,
            previousReplayItemWasReasoning
          }) : void 0;
          if (!parsedSignature?.id) {
            textFallbackOrdinal += 1;
          }
          if (msgId && msgId.length > 64) {
            msgId = `msg_${shortHash(msgId)}`;
          }
          const messageItem = {
            type: "message",
            role: "assistant",
            content: [
              { type: "output_text", text: sanitizeSurrogates(textBlock.text), annotations: [] }
            ],
            status: "completed",
            ...msgId ? { id: msgId } : {},
            phase: parsedSignature?.phase
          };
          output.push(messageItem);
          previousReplayItemWasReasoning = false;
        } else if (block.type === "toolCall") {
          const toolCall = block;
          const [callId, itemIdRaw] = splitResponsesToolCallId(toolCall.id);
          let itemId = shouldReplayResponsesItemIds ? itemIdRaw : void 0;
          if (shouldReplayResponsesItemIds && isDifferentModel && itemId?.startsWith("fc_")) {
            itemId = void 0;
          }
          output.push({
            type: "function_call",
            ...itemId ? { id: itemId } : {},
            call_id: callId,
            name: toolCall.name,
            arguments: JSON.stringify(toolCall.arguments)
          });
          previousReplayItemWasReasoning = false;
        }
      }
      if (output.length === 0) {
        continue;
      }
      messages.push(...output);
    } else if (msg.role === "toolResult") {
      const textResult = extractToolResultText(msg.content);
      const sanitizedTextResult = sanitizeSurrogates(textResult);
      const hasImages = msg.content.some(isImageWithMediaPayload);
      const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
      const hasText = sanitizedTextResult.trim().length > 0;
      const [callId] = splitResponsesToolCallId(msg.toolCallId);
      let output;
      if (hasImages && model.input.includes("image")) {
        const contentParts = [];
        if (hasText) {
          contentParts.push({
            type: "input_text",
            text: sanitizedTextResult
          });
        } else if (mediaPlaceholder === "(see attached media)") {
          contentParts.push({
            type: "input_text",
            text: mediaPlaceholder
          });
        }
        for (const block of msg.content) {
          if (isImageWithMediaPayload(block)) {
            contentParts.push({
              type: "input_image",
              detail: "auto",
              image_url: `data:${block.mimeType};base64,${block.data}`
            });
          }
        }
        output = contentParts;
      } else {
        output = sanitizeToolResultText2(textResult, mediaPlaceholder ?? EMPTY_TOOL_RESULT_TEXT2);
      }
      messages.push({
        type: "function_call_output",
        call_id: callId,
        output
      });
    }
    msgIndex++;
  }
  return messages;
}
function createResponsesAssistantOutput(model, api = model.api) {
  return {
    role: "assistant",
    content: [],
    api,
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
    },
    stopReason: "stop",
    timestamp: Date.now()
  };
}
function resolveResponsesReasoningEffort(model, reasoning) {
  const clampedReasoning = reasoning ? clampThinkingLevel(model, reasoning) : void 0;
  if (!clampedReasoning || clampedReasoning === "off") {
    return void 0;
  }
  if (clampedReasoning === "max") {
    return supportsOpenAIReasoningEffort(model, "max") ? "max" : "xhigh";
  }
  if (clampedReasoning === "minimal" && model.provider === "openai" && supportsOpenAIReasoningEffort(model, "max")) {
    const effort = resolveOpenAIReasoningEffortForModel({ model, effort: "minimal" });
    return isResponsesReasoningEffort(effort) ? effort : void 0;
  }
  return clampedReasoning;
}
function applyCommonResponsesParams(params, model, context, options, config) {
  if (options?.maxTokens) {
    params.max_output_tokens = Math.max(options.maxTokens, 16);
  }
  if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) {
    params.temperature = options.temperature;
  }
  if (context.tools) {
    const converted = convertResponsesToolPayload(context.tools, { model });
    if (converted.tools.length > 0) {
      params.tools = converted.tools;
    }
  }
  if (!model.reasoning) {
    return;
  }
  if (options?.reasoningEffort || options?.reasoningSummary) {
    const effort = options?.reasoningEffort ? model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort : "medium";
    params.reasoning = {
      effort,
      summary: options?.reasoningSummary || "auto"
    };
    params.include = ["reasoning.encrypted_content"];
  } else if ((config?.setDefaultReasoningOff ?? true) && model.thinkingLevelMap?.off !== null) {
    params.reasoning = {
      effort: model.thinkingLevelMap?.off ?? "none"
    };
  }
}
function buildResponsesRequestOptions(options) {
  return {
    ...options?.signal ? { signal: options.signal } : {},
    ...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
    maxRetries: options?.maxRetries ?? 0
  };
}
function cleanStreamingScratchBuffers(output) {
  for (const block of output.content) {
    delete block.index;
    delete block.partialJson;
  }
}
async function runResponsesStreamLifecycle(params) {
  const { stream, model, output, options } = params;
  let firstEventAbort;
  try {
    const client = params.createClient();
    let requestParams = params.buildParams();
    const nextParams = await options?.onPayload?.(requestParams, model);
    if (nextParams !== void 0) {
      requestParams = nextParams;
    }
    firstEventAbort = createFirstStreamEventAbortController(options?.signal);
    const { data: openaiStream, response } = await client.responses.create(requestParams, {
      ...buildResponsesRequestOptions(options),
      signal: firstEventAbort.signal
    }).withResponse();
    await options?.onResponse?.(
      { status: response.status, headers: headersToRecord(response.headers) },
      model
    );
    stream.push({ type: "start", partial: output });
    const firstEventTimeoutMs = getFirstStreamEventTimeoutMs(options);
    const onFirstEventTimeout = getFirstStreamEventTimeoutHandler(options);
    const processStreamOptions = params.processStreamOptions || firstEventTimeoutMs !== void 0 || onFirstEventTimeout !== void 0 ? {
      ...params.processStreamOptions,
      firstEventTimeoutMs: params.processStreamOptions?.firstEventTimeoutMs ?? firstEventTimeoutMs,
      abortFirstEventStream: params.processStreamOptions?.abortFirstEventStream ?? firstEventAbort.abort,
      onFirstEventTimeout: params.processStreamOptions?.onFirstEventTimeout ?? onFirstEventTimeout
    } : void 0;
    await processResponsesStream(openaiStream, output, stream, model, processStreamOptions);
    if (options?.signal?.aborted) {
      throw new Error("Request was aborted");
    }
    if (output.stopReason === "aborted" || output.stopReason === "error") {
      throw new Error(output.errorMessage ?? "An unknown error occurred");
    }
    stream.push({ type: "done", reason: output.stopReason, message: output });
    stream.end();
  } catch (error) {
    cleanStreamingScratchBuffers(output);
    output.stopReason = options?.signal?.aborted ? "aborted" : "error";
    output.errorMessage = params.formatError(error);
    stream.push({ type: "error", reason: output.stopReason, error: output });
    stream.end();
  } finally {
    firstEventAbort?.dispose();
  }
}
async function processResponsesStream(openaiStream, output, stream, model, options) {
  const streamingToolCalls = createResponsesToolCallTracker();
  const outputSlots = /* @__PURE__ */ new Map();
  const reasoningBlocksById = /* @__PURE__ */ new Map();
  let unindexedOutputSlot;
  let terminalResponseEvent;
  let lastTextBlock = null;
  const blocks = output.content;
  const blockIndex = () => blocks.length - 1;
  const readOutputIndex2 = (event) => {
    const outputIndex = event.output_index;
    return typeof outputIndex === "number" && Number.isInteger(outputIndex) && outputIndex >= 0 ? outputIndex : void 0;
  };
  const registerOutputSlot = (event, slot) => {
    const outputIndex = readOutputIndex2(event);
    if (outputIndex === void 0) {
      if (unindexedOutputSlot) {
        throw new Error("Responses stream added overlapping unindexed output items");
      }
      unindexedOutputSlot = slot;
      return;
    }
    if (outputSlots.has(outputIndex)) {
      throw new Error(`Responses stream reused active output index ${outputIndex}`);
    }
    outputSlots.set(outputIndex, slot);
  };
  const resolveOutputSlot = (event, type) => {
    const outputIndex = readOutputIndex2(event);
    let slot = outputIndex === void 0 ? unindexedOutputSlot : outputSlots.get(outputIndex);
    if (outputIndex === void 0 && !slot) {
      const matchingSlots = [...outputSlots.values()].filter(
        (candidate) => candidate.type === type
      );
      slot = matchingSlots.length === 1 ? matchingSlots[0] : void 0;
    }
    return slot?.type === type ? slot : void 0;
  };
  const forgetOutputSlot = (event, slot) => {
    const outputIndex = readOutputIndex2(event);
    if (outputIndex === void 0) {
      if (unindexedOutputSlot === slot) {
        unindexedOutputSlot = void 0;
      } else {
        for (const [indexedOutput, indexedSlot] of outputSlots) {
          if (indexedSlot === slot) {
            outputSlots.delete(indexedOutput);
          }
        }
      }
      return;
    }
    if (outputSlots.get(outputIndex) === slot) {
      outputSlots.delete(outputIndex);
    }
  };
  const forgetToolCallOutputSlot = (toolCall) => {
    for (const [outputIndex, slot] of outputSlots) {
      if (slot.type === "toolCall" && slot.toolCall === toolCall) {
        outputSlots.delete(outputIndex);
      }
    }
  };
  const readIdentityValue2 = (value) => {
    const identity = typeof value === "string" ? value.trim() : "";
    return identity || void 0;
  };
  const resolveCompletedToolCallName = (toolCall, value) => {
    const streamedName = readIdentityValue2(toolCall?.block.name);
    const completedName = readIdentityValue2(value);
    if (streamedName && completedName && streamedName !== completedName) {
      throw new Error(
        `Responses stream changed tool-call function name from ${streamedName} to ${completedName}`
      );
    }
    const name = completedName ?? streamedName;
    if (!name) {
      throw new Error("Responses stream completed tool call without a function name");
    }
    return name;
  };
  const createOutputSlot = (event, item) => {
    if (item.type === "reasoning") {
      const block = { type: "thinking", thinking: "" };
      const slot = {
        type: "thinking",
        item,
        block,
        contentIndex: blocks.length
      };
      blocks.push(block);
      registerOutputSlot(event, slot);
      stream.push({ type: "thinking_start", contentIndex: slot.contentIndex, partial: output });
      return slot;
    }
    if (item.type === "message") {
      const messageItem = item;
      const collapseCandidate = lastTextBlock;
      const block = collapseCandidate ? null : {
        type: "text",
        text: "",
        ...messageItem.phase ? { textSignature: encodeTextSignatureV1(messageItem.id, messageItem.phase) } : {}
      };
      const slot = {
        type: "text",
        item: messageItem,
        block,
        contentIndex: block ? blocks.length : void 0,
        pendingText: collapseCandidate ? "" : null,
        collapseCandidate
      };
      if (block) {
        blocks.push(block);
      }
      registerOutputSlot(event, slot);
      if (slot.contentIndex !== void 0) {
        stream.push({ type: "text_start", contentIndex: slot.contentIndex, partial: output });
      }
      return slot;
    }
    return void 0;
  };
  const resolveOutputItemSlot = (event, item) => {
    if (item.type === "reasoning") {
      return resolveOutputSlot(event, "thinking");
    }
    if (item.type === "message") {
      return resolveOutputSlot(event, "text");
    }
    const outputIndex = readOutputIndex2(event);
    return outputIndex === void 0 ? void 0 : outputSlots.get(outputIndex);
  };
  const getOrCreateOutputSlot = (event, item) => {
    return resolveOutputItemSlot(event, item) ?? createOutputSlot(event, item);
  };
  const materializeDeferredTextSlot = (slot) => {
    if (slot.block || slot.pendingText === null) {
      return;
    }
    const text = slot.pendingText;
    slot.block = {
      type: "text",
      text,
      ...slot.item.phase ? { textSignature: encodeTextSignatureV1(slot.item.id, slot.item.phase) } : {}
    };
    blocks.push(slot.block);
    slot.contentIndex = blockIndex();
    stream.push({ type: "text_start", contentIndex: slot.contentIndex, partial: output });
    if (text) {
      stream.push({
        type: "text_delta",
        contentIndex: slot.contentIndex,
        delta: text,
        partial: output
      });
    }
    if (lastTextBlock === slot.collapseCandidate) {
      lastTextBlock = null;
    }
    slot.pendingText = null;
    slot.collapseCandidate = null;
  };
  const materializeDeferredTextSlots = (except) => {
    for (const slot of outputSlots.values()) {
      if (slot !== except && slot.type === "text") {
        materializeDeferredTextSlot(slot);
      }
    }
    if (unindexedOutputSlot !== except && unindexedOutputSlot?.type === "text") {
      materializeDeferredTextSlot(unindexedOutputSlot);
    }
  };
  const appendPendingMessageDelta = (slot, delta) => {
    slot.pendingText = `${slot.pendingText ?? ""}${delta}`;
    const priorText = slot.collapseCandidate?.block.text ?? "";
    if (priorText.startsWith(slot.pendingText) || slot.pendingText.startsWith(priorText)) {
      return;
    }
    materializeDeferredTextSlot(slot);
  };
  const backfillReasoningSignatures = (responseOutput) => {
    for (const item of responseOutput) {
      if (item.type !== "reasoning" || !item.encrypted_content) {
        continue;
      }
      const block = reasoningBlocksById.get(item.id);
      if (!block?.thinkingSignature) {
        continue;
      }
      const storedItem = JSON.parse(block.thinkingSignature);
      if (storedItem.encrypted_content) {
        continue;
      }
      block.thinkingSignature = JSON.stringify({
        ...storedItem,
        encrypted_content: item.encrypted_content
      });
    }
  };
  const finalizeResponse = (response) => {
    terminalResponseEvent = "finalized";
    backfillReasoningSignatures(response.output ?? []);
    if (response.id) {
      output.responseId = response.id;
    }
    const mappedUsage = mapResponsesTerminalUsage(response.usage);
    if (mappedUsage) {
      output.usage = {
        ...mappedUsage,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      };
    }
    calculateCost(model, output.usage);
    if (options?.applyServiceTierPricing) {
      const serviceTier = options.resolveServiceTier ? options.resolveServiceTier(response.service_tier, options.serviceTier) : response.service_tier ?? options.serviceTier;
      options.applyServiceTierPricing(output.usage, serviceTier);
    }
    const terminal = resolveResponsesTerminalStopReason({
      status: response.status,
      incompleteReason: response.incomplete_details?.reason,
      hasToolCall: output.content.some((block) => block.type === "toolCall")
    });
    output.stopReason = terminal.stopReason;
    if (terminal.errorMessage) {
      output.errorMessage = terminal.errorMessage;
    }
  };
  const guardedStream = withFirstStreamEventTimeout(openaiStream, {
    provider: model.provider,
    api: model.api,
    model: model.id,
    timeoutMs: options?.firstEventTimeoutMs ?? 0,
    stage: "responses",
    abort: options?.abortFirstEventStream,
    onTimeout: options?.onFirstEventTimeout,
    hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
  });
  for await (const event of guardedStream) {
    if (event.type === "response.created") {
      output.responseId = event.response.id;
    } else if (event.type === "response.output_item.added") {
      materializeDeferredTextSlots();
      const item = event.item;
      if (item.type !== "message") {
        lastTextBlock = null;
      }
      if (item.type === "reasoning" || item.type === "message") {
        createOutputSlot(event, item);
      } else if (item.type === "function_call") {
        const toolCallBlock = {
          type: "toolCall",
          id: resolveResponsesToolCallId(item),
          name: readIdentityValue2(item.name) ?? "",
          arguments: {},
          partialJson: item.arguments || ""
        };
        const contentIndex = output.content.length;
        const toolCallState = {
          block: toolCallBlock,
          contentIndex,
          argumentStreamReliable: true,
          ...readResponsesToolCallItemIdentity(item)
        };
        streamingToolCalls.register(event, toolCallState);
        if (readOutputIndex2(event) !== void 0) {
          registerOutputSlot(event, { type: "toolCall", toolCall: toolCallState });
        }
        output.content.push(toolCallBlock);
        stream.push({ type: "toolcall_start", contentIndex, partial: output });
      }
    } else if (event.type === "response.reasoning_summary_part.added") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.item.summary = slot.item.summary || [];
      slot.item.summary.push(event.part);
    } else if (event.type === "response.reasoning_summary_text.delta") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.item.summary = slot.item.summary || [];
      const lastPart = slot.item.summary[slot.item.summary.length - 1];
      if (!lastPart) {
        continue;
      }
      slot.block.thinking += event.delta;
      lastPart.text += event.delta;
      stream.push({
        type: "thinking_delta",
        contentIndex: slot.contentIndex,
        delta: event.delta,
        partial: output
      });
    } else if (event.type === "response.reasoning_summary_part.done") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.item.summary = slot.item.summary || [];
      const lastPart = slot.item.summary[slot.item.summary.length - 1];
      if (!lastPart) {
        continue;
      }
      slot.block.thinking += "\n\n";
      lastPart.text += "\n\n";
      stream.push({
        type: "thinking_delta",
        contentIndex: slot.contentIndex,
        delta: "\n\n",
        partial: output
      });
    } else if (event.type === "response.reasoning_text.delta") {
      const slot = resolveOutputSlot(event, "thinking");
      if (!slot) {
        continue;
      }
      slot.block.thinking += event.delta;
      stream.push({
        type: "thinking_delta",
        contentIndex: slot.contentIndex,
        delta: event.delta,
        partial: output
      });
    } else if (event.type === "response.content_part.added") {
      const slot = resolveOutputSlot(event, "text");
      if (!slot) {
        continue;
      }
      slot.item.content = slot.item.content || [];
      if (event.part.type === OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE || event.part.type === AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE || event.part.type === "refusal") {
        slot.item.content.push(event.part);
      }
    } else if (event.type === "response.output_text.delta") {
      const slot = resolveOutputSlot(event, "text");
      if (!slot?.item.content || slot.item.content.length === 0) {
        continue;
      }
      const lastPart = slot.item.content[slot.item.content.length - 1];
      if (!isResponsesTextContentPartType(lastPart?.type)) {
        continue;
      }
      lastPart.text += event.delta;
      if (slot.pendingText !== null) {
        appendPendingMessageDelta(slot, event.delta);
      } else if (slot.block && slot.contentIndex !== void 0) {
        slot.block.text += event.delta;
        stream.push({
          type: "text_delta",
          contentIndex: slot.contentIndex,
          delta: event.delta,
          partial: output
        });
      }
    } else if (isAzureResponsesTextDeltaEvent(event)) {
      const slot = resolveOutputSlot(event, "text");
      if (!slot) {
        continue;
      }
      slot.item.content = slot.item.content || [];
      let lastPart = slot.item.content[slot.item.content.length - 1];
      if (lastPart?.type !== "text") {
        lastPart = { type: "text", text: "" };
        slot.item.content.push(lastPart);
      }
      lastPart.text += event.delta;
      if (slot.pendingText !== null) {
        appendPendingMessageDelta(slot, event.delta);
      } else if (slot.block && slot.contentIndex !== void 0) {
        slot.block.text += event.delta;
        stream.push({
          type: "text_delta",
          contentIndex: slot.contentIndex,
          delta: event.delta,
          partial: output
        });
      }
    } else if (event.type === "response.refusal.delta") {
      const slot = resolveOutputSlot(event, "text");
      if (!slot?.item.content || slot.item.content.length === 0) {
        continue;
      }
      const lastPart = slot.item.content[slot.item.content.length - 1];
      if (lastPart?.type !== "refusal") {
        continue;
      }
      lastPart.refusal += event.delta;
      if (slot.pendingText !== null) {
        appendPendingMessageDelta(slot, event.delta);
      } else if (slot.block && slot.contentIndex !== void 0) {
        slot.block.text += event.delta;
        stream.push({
          type: "text_delta",
          contentIndex: slot.contentIndex,
          delta: event.delta,
          partial: output
        });
      }
    } else if (event.type === "response.function_call_arguments.delta") {
      const toolCall = streamingToolCalls.resolve(event);
      if (toolCall) {
        toolCall.block.partialJson += event.delta;
        toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
        stream.push({
          type: "toolcall_delta",
          contentIndex: toolCall.contentIndex,
          delta: event.delta,
          partial: output
        });
      } else if (streamingToolCalls.hasActive()) {
        streamingToolCalls.markArgumentsUnreliable();
      }
    } else if (event.type === "response.function_call_arguments.done") {
      const toolCall = streamingToolCalls.resolve(event);
      if (toolCall) {
        const previousPartialJson = toolCall.block.partialJson;
        const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
        if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
          toolCall.block.partialJson = doneArguments;
          toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
          toolCall.argumentStreamReliable = true;
        }
        if (doneArguments?.startsWith(previousPartialJson)) {
          const delta = doneArguments.slice(previousPartialJson.length);
          if (delta.length > 0) {
            stream.push({
              type: "toolcall_delta",
              contentIndex: toolCall.contentIndex,
              delta,
              partial: output
            });
          }
        }
      } else if (streamingToolCalls.hasActive()) {
        streamingToolCalls.markArgumentsUnreliable();
      }
    } else if (event.type === "response.output_item.done") {
      const item = event.item;
      if (item.type !== "message") {
        lastTextBlock = null;
      }
      const existingOutputSlot = resolveOutputItemSlot(event, item);
      materializeDeferredTextSlots(existingOutputSlot);
      const outputSlot = existingOutputSlot ?? getOrCreateOutputSlot(event, item);
      if (item.type === "reasoning" && outputSlot?.type === "thinking") {
        const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
        const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
        outputSlot.block.thinking = summaryText || contentText || outputSlot.block.thinking;
        outputSlot.block.thinkingSignature = JSON.stringify(item);
        if (typeof item.id === "string") {
          reasoningBlocksById.set(item.id, outputSlot.block);
        }
        stream.push({
          type: "thinking_end",
          contentIndex: outputSlot.contentIndex,
          content: outputSlot.block.thinking,
          partial: output
        });
        forgetOutputSlot(event, outputSlot);
      } else if (item.type === "message" && outputSlot?.type === "text" && (outputSlot.block || outputSlot.pendingText !== null)) {
        const streamedText = outputSlot.pendingText ?? outputSlot.block?.text ?? "";
        const finalText = item.content == null ? streamedText : item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
        const phase = item.phase ?? void 0;
        const collapse = outputSlot.pendingText !== null ? resolveResponsesMessageSnapshotCollapse({
          prior: outputSlot.collapseCandidate && {
            text: outputSlot.collapseCandidate.block.text,
            phase: outputSlot.collapseCandidate.phase
          },
          nextText: finalText,
          nextPhase: phase
        }) : { kind: "keep" };
        outputSlot.pendingText = null;
        if (collapse.kind === "extend" && outputSlot.collapseCandidate) {
          outputSlot.collapseCandidate.block.text = collapse.text;
          outputSlot.collapseCandidate.block.textSignature = encodeTextSignatureV1(item.id, phase);
          stream.push({
            type: "text_end",
            contentIndex: outputSlot.collapseCandidate.index,
            content: collapse.text,
            partial: output
          });
          lastTextBlock = outputSlot.collapseCandidate;
        } else {
          if (!outputSlot.block) {
            outputSlot.block = {
              type: "text",
              text: "",
              ...phase ? { textSignature: encodeTextSignatureV1(item.id, phase) } : {}
            };
            blocks.push(outputSlot.block);
            outputSlot.contentIndex = blockIndex();
            stream.push({
              type: "text_start",
              contentIndex: outputSlot.contentIndex,
              partial: output
            });
          }
          outputSlot.block.text = finalText;
          outputSlot.block.textSignature = encodeTextSignatureV1(item.id, phase);
          const contentIndex = outputSlot.contentIndex;
          if (contentIndex === void 0) {
            throw new Error("Responses stream finalized text without a content index");
          }
          lastTextBlock = { block: outputSlot.block, index: contentIndex, phase };
          stream.push({
            type: "text_end",
            contentIndex,
            content: outputSlot.block.text,
            partial: output
          });
        }
        forgetOutputSlot(event, outputSlot);
      } else if (item.type === "function_call") {
        const streamingToolCall = streamingToolCalls.resolve(
          event,
          readResponsesToolCallItemIdentity(item)
        );
        if (!streamingToolCall && streamingToolCalls.hasActive()) {
          continue;
        }
        const completedName = resolveCompletedToolCallName(streamingToolCall, item.name);
        const streamedArguments = streamingToolCall?.block.partialJson ?? "";
        const completedArguments = typeof item.arguments === "string" ? item.arguments : void 0;
        if (streamingToolCall && !streamingToolCall.argumentStreamReliable && !completedArguments) {
          continue;
        }
        const finalArguments = completedArguments !== void 0 && (completedArguments.length > 0 || !streamedArguments) ? completedArguments : streamedArguments || "{}";
        const args = parseStreamingJson(finalArguments);
        let toolCall;
        let contentIndex;
        if (streamingToolCall) {
          const block = streamingToolCall.block;
          block.id = resolveResponsesToolCallId(item, block.id);
          block.name = completedName;
          block.arguments = args;
          delete block.partialJson;
          toolCall = block;
          contentIndex = streamingToolCall.contentIndex;
        } else {
          toolCall = {
            type: "toolCall",
            id: resolveResponsesToolCallId(item),
            name: completedName,
            arguments: args
          };
          blocks.push(toolCall);
          contentIndex = blockIndex();
          stream.push({ type: "toolcall_start", contentIndex, partial: output });
        }
        if (streamingToolCall) {
          streamingToolCalls.forget(streamingToolCall);
          forgetToolCallOutputSlot(streamingToolCall);
        }
        stream.push({
          type: "toolcall_end",
          contentIndex,
          toolCall,
          partial: output
        });
      }
    } else if (event.type === "response.completed" || event.type === "response.incomplete") {
      if (streamingToolCalls.hasActive()) {
        throw new Error("Responses stream completed with unresolved tool calls");
      }
      finalizeResponse(event.response);
    } else if (event.type === "error") {
      throw new Error(
        event.message ? `Error Code ${event.code}: ${event.message}` : "Unknown error"
      );
    } else if (event.type === "response.failed") {
      const error = event.response?.error;
      const details = event.response?.incomplete_details;
      output.responseId = event.response.id;
      output.stopReason = "error";
      output.errorMessage = error ? `${error.code || "unknown"}: ${error.message || "no message"}` : details?.reason ? `incomplete: ${details.reason}` : "Unknown error (no error details in response)";
      terminalResponseEvent = "failed";
      break;
    }
  }
  if (terminalResponseEvent === "failed") {
    return;
  }
  if (streamingToolCalls.hasActive()) {
    throw new Error("Responses stream ended with unresolved tool calls");
  }
  if (!terminalResponseEvent) {
    throw new Error("OpenAI Responses stream ended before a terminal response event");
  }
}

// packages/ai/src/providers/openai-responses.ts
var OPENAI_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
function getCompat2(model) {
  return {
    sendSessionIdHeader: model.compat?.sendSessionIdHeader ?? true,
    supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? true
  };
}
function getPromptCacheRetention(compat, cacheRetention) {
  return cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0;
}
function formatOpenAIResponsesError(error) {
  if (error instanceof Error) {
    const status = error.status;
    const statusCode = typeof status === "number" ? status : void 0;
    if (statusCode !== void 0) {
      return `OpenAI API error (${statusCode}): ${error.message}`;
    }
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
var streamOpenAIResponses = (model, context, options) => {
  const stream = new AssistantMessageEventStream();
  const output = createResponsesAssistantOutput(model);
  void runResponsesStreamLifecycle({
    stream,
    model,
    output,
    options,
    createClient: () => {
      const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
      const cacheRetention = resolveCacheRetention(options?.cacheRetention);
      const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
      return createClient2(model, context, apiKey, options?.headers, cacheSessionId);
    },
    buildParams: () => buildParams2(model, context, options),
    processStreamOptions: {
      serviceTier: options?.serviceTier,
      applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
    },
    formatError: formatOpenAIResponsesError
  });
  return stream;
};
var streamSimpleOpenAIResponses = (model, context, options) => {
  const apiKey = options?.apiKey || getEnvApiKey(model.provider);
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const base = buildBaseOptions(model, options, apiKey);
  return streamOpenAIResponses(model, context, {
    ...base,
    reasoningEffort: resolveResponsesReasoningEffort(model, options?.reasoning),
    replayResponsesItemIds: options?.replayResponsesItemIds
  });
};
function createClient2(model, context, apiKey, optionsHeaders, sessionId) {
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }
  const compat = getCompat2(model);
  const headers = { ...model.headers };
  if (model.provider === "github-copilot") {
    const hasImages = hasCopilotVisionInput(context.messages);
    const copilotHeaders = buildCopilotDynamicHeaders({
      messages: context.messages,
      hasImages
    });
    Object.assign(headers, copilotHeaders);
  }
  if (sessionId) {
    if (compat.sendSessionIdHeader) {
      headers.session_id = sessionId;
    }
    headers["x-client-request-id"] = sessionId;
  }
  if (optionsHeaders) {
    Object.assign(headers, optionsHeaders);
  }
  const defaultHeaders = model.provider === "cloudflare-ai-gateway" ? {
    ...headers,
    Authorization: headers.Authorization ?? null,
    "cf-aig-authorization": `Bearer ${apiKey}`
  } : headers;
  return new OpenAI2({
    apiKey,
    baseURL: isCloudflareProvider(model.provider) ? resolveCloudflareBaseUrl(model) : model.baseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders,
    // OpenAI supports custom fetch, so sentinels stay opaque until guarded egress.
    fetch: getAiTransportHost().buildModelFetch(model)
  });
}
function buildParams2(model, context, options) {
  const messages = convertResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, {
    replayResponsesItemIds: options?.replayResponsesItemIds ?? false
  });
  const cacheRetention = resolveCacheRetention(options?.cacheRetention);
  const compat = getCompat2(model);
  const params = {
    model: model.id,
    input: messages,
    stream: true,
    prompt_cache_key: cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
    prompt_cache_retention: getPromptCacheRetention(compat, cacheRetention),
    store: false
  };
  if (options?.maxTokens) {
    params.max_output_tokens = options?.maxTokens;
  }
  if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) {
    params.temperature = options?.temperature;
  }
  if (options?.serviceTier !== void 0) {
    params.service_tier = options.serviceTier;
  }
  applyCommonResponsesParams(params, model, context, options, {
    setDefaultReasoningOff: model.provider !== "github-copilot"
  });
  return params;
}
function getServiceTierCostMultiplier(model, serviceTier) {
  switch (serviceTier) {
    case "flex":
      return 0.5;
    case "priority":
      return model.id === "gpt-5.5" ? 2.5 : 2;
    default:
      return 1;
  }
}
function applyServiceTierPricing(usage, serviceTier, model) {
  const multiplier = getServiceTierCostMultiplier(model, serviceTier);
  if (multiplier === 1) {
    return;
  }
  usage.cost.input *= multiplier;
  usage.cost.output *= multiplier;
  usage.cost.cacheRead *= multiplier;
  usage.cost.cacheWrite *= multiplier;
  usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
export {
  AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE,
  AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE,
  GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS,
  OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH,
  OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE,
  OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE,
  clampOpenAIPromptCacheKey,
  cleanSchemaForGemini,
  clearOpenAIToolSchemaCacheForTest,
  convertMessages,
  createResponsesToolCallTracker,
  extractToolSchemaModelCompat,
  findOpenAIStrictSchemaViolations,
  findOpenAIStrictToolProjectionDiagnostics,
  isAzureResponsesTextDeltaEvent,
  isAzureResponsesTextDeltaEventType,
  isOpenAICompatibleAzureResponsesBaseUrl,
  isOpenAIGpt54MiniModel,
  isOpenAIGpt55Model,
  isOpenAIGpt56Model,
  isResponsesTextContentPartType,
  isResponsesTextDeltaEventType,
  isStrictOpenAIJsonSchemaCompatible,
  isTraditionalAzureOpenAIHost,
  mapOpenAIStopReason,
  mapResponsesTerminalUsage,
  normalizeOpenAIReasoningEffort,
  normalizeOpenAIStrictCompatSchema,
  normalizeOpenAIStrictToolParameters,
  normalizeStrictOpenAIJsonSchema,
  normalizeToolParameterSchema,
  parseAzureDeploymentNameMap,
  projectOpenAITools,
  projectRuntimeToolInputSchema,
  readResponsesReasoningTokens,
  readResponsesToolCallItemIdentity,
  reconcileOpenAICompletionsToolChoice,
  reconcileOpenAIResponsesToolChoice,
  resolveAzureDeploymentNameFromMap,
  resolveOpenAIProjectedToolsStrictToolFlag,
  resolveOpenAIReasoningEffortForModel,
  resolveOpenAISupportedReasoningEfforts,
  resolveResponsesMessageSnapshotCollapse,
  resolveResponsesTerminalStopReason,
  resolveUnsupportedToolSchemaKeywords,
  shouldOmitEmptyArrayItems,
  streamOpenAICompletions,
  streamOpenAIResponses,
  streamSimpleOpenAICompletions,
  streamSimpleOpenAIResponses,
  stripUnsupportedSchemaKeywords,
  supportsOpenAIReasoningEffort,
  supportsOpenAITemperature
};
