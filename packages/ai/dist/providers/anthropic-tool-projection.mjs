// packages/normalization-core/src/record-coerce.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

// packages/ai/src/providers/anthropic-tool-projection.ts
function isProviderSupportedViolation(violation) {
  return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
var schemaValueKeywords = /* @__PURE__ */ new Set([
  "additionalProperties",
  "contains",
  "contentSchema",
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
var schemaMapKeywords2 = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependencies",
  "dependentSchemas",
  "patternProperties",
  "properties"
]);
function normalizeAnthropicJsonSchema(schema) {
  if (!isRecord(schema)) {
    return schema;
  }
  let changed = false;
  const normalized = { ...schema };
  for (const [key, value] of Object.entries(schema)) {
    if (schemaValueKeywords.has(key) && !Array.isArray(value)) {
      const next = normalizeAnthropicJsonSchema(value);
      normalized[key] = next;
      changed ||= next !== value;
      continue;
    }
    if (schemaArrayKeywords.has(key) && Array.isArray(value)) {
      const next = value.map(normalizeAnthropicJsonSchema);
      normalized[key] = next;
      changed ||= next.some((entry, index) => entry !== value[index]);
      continue;
    }
    if (schemaMapKeywords2.has(key) && isRecord(value)) {
      const next = Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => [
          entryKey,
          normalizeAnthropicJsonSchema(entryValue)
        ])
      );
      normalized[key] = next;
      changed ||= Object.entries(value).some(
        ([entryKey, entryValue]) => next[entryKey] !== entryValue
      );
    }
  }
  if (Array.isArray(schema.items)) {
    normalized.prefixItems = schema.items.map(normalizeAnthropicJsonSchema);
    const additionalItems = schema.additionalItems;
    if (typeof additionalItems === "boolean" || isRecord(additionalItems)) {
      normalized.items = normalizeAnthropicJsonSchema(additionalItems);
    } else {
      delete normalized.items;
    }
    delete normalized.additionalItems;
    changed = true;
  }
  return changed ? normalized : schema;
}
function projectAnthropicTools(tools, toWireName) {
  const projectedTools = [];
  const unavailableOriginalNames = /* @__PURE__ */ new Set();
  for (const tool of tools) {
    let projectedTool;
    let originalName;
    try {
      const name = tool.name;
      originalName = name;
      if (!name) {
        continue;
      }
      const schemaProjection = projectRuntimeToolInputSchema(tool.parameters, `${name}.parameters`);
      if (!isRecord(schemaProjection.schema) || schemaProjection.violations.some((violation) => !isProviderSupportedViolation(violation))) {
        unavailableOriginalNames.add(name);
        continue;
      }
      const anthropicSchema = normalizeAnthropicJsonSchema(schemaProjection.schema);
      if (!isRecord(anthropicSchema)) {
        unavailableOriginalNames.add(name);
        continue;
      }
      const properties = anthropicSchema.properties;
      const required = anthropicSchema.required;
      if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) {
        unavailableOriginalNames.add(name);
        continue;
      }
      let description;
      try {
        description = typeof tool.description === "string" ? tool.description : void 0;
      } catch {
      }
      const wireName = toWireName(name);
      projectedTool = {
        originalName: name,
        wireName,
        ...description ? { description } : {},
        inputSchema: {
          type: "object",
          properties: properties ?? {},
          required: required ?? []
        }
      };
    } catch {
      if (originalName) {
        unavailableOriginalNames.add(originalName);
      }
      continue;
    }
    const conflictingTool = projectedTools.find(
      (entry) => entry.wireName === projectedTool.wireName
    );
    if (conflictingTool && conflictingTool.originalName !== projectedTool.originalName) {
      throw new Error(
        `Anthropic tool names "${conflictingTool.originalName}" and "${projectedTool.originalName}" both map to "${projectedTool.wireName}"`
      );
    }
    projectedTools.push(projectedTool);
  }
  return {
    inputToolCount: tools.length,
    unavailableOriginalNames,
    tools: projectedTools
  };
}
function reconcileAnthropicToolChoice(choice, projection) {
  if (projection.inputToolCount === 0) {
    return choice;
  }
  if (choice.type === "tool") {
    const requestedName = choice.name;
    const originalMatch = projection.tools.find((tool) => tool.originalName === requestedName);
    if (originalMatch) {
      return { ...choice, name: originalMatch.wireName };
    }
    if (projection.unavailableOriginalNames.has(requestedName)) {
      throw new Error(
        `Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`
      );
    }
    const matchedTool = projection.tools.find((tool) => tool.wireName === requestedName);
    if (!matchedTool) {
      throw new Error(
        `Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`
      );
    }
    return { ...choice, name: matchedTool.wireName };
  }
  if (projection.tools.length === 0) {
    if (choice.type === "auto") {
      return void 0;
    }
    if (choice.type === "any") {
      throw new Error(
        "Anthropic tool_choice requires a tool, but no tools survived schema conversion"
      );
    }
  }
  return choice;
}
function resolveOriginalAnthropicToolName(name, projection) {
  return projection?.tools.find((tool) => tool.wireName === name)?.originalName ?? name;
}
export {
  projectAnthropicTools,
  reconcileAnthropicToolChoice,
  resolveOriginalAnthropicToolName
};
