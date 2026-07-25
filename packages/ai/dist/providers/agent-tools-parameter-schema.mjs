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
export {
  extractToolSchemaModelCompat,
  normalizeToolParameterSchema,
  resolveUnsupportedToolSchemaKeywords,
  shouldOmitEmptyArrayItems
};
