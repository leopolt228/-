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
export {
  projectRuntimeToolInputSchema
};
