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
export {
  findOpenAIStrictSchemaViolations,
  normalizeOpenAIStrictCompatSchema
};
