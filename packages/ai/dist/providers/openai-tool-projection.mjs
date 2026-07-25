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
export {
  projectOpenAITools,
  reconcileOpenAICompletionsToolChoice,
  reconcileOpenAIResponsesToolChoice
};
