// packages/agent-core/src/harness/prompt-template-arguments.ts
function parseCommandArgs(argsString) {
  const args = [];
  let current = "";
  let inQuote = null;
  let hasToken = false;
  for (const char of argsString) {
    if (inQuote) {
      if (char === inQuote) {
        inQuote = null;
      } else {
        hasToken = true;
        current += char;
      }
    } else if (char === '"' || char === "'") {
      hasToken = true;
      inQuote = char;
    } else if (/\s/.test(char)) {
      if (hasToken) {
        args.push(current);
        current = "";
        hasToken = false;
      }
    } else {
      hasToken = true;
      current += char;
    }
  }
  if (hasToken) {
    args.push(current);
  }
  return args;
}
function parseSafeNonNegativeInteger(raw) {
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : void 0;
}
function substituteArgs(content, args) {
  let result = content;
  result = result.replace(/\$(\d+)/g, (_, num) => {
    const parsed = parseSafeNonNegativeInteger(num);
    if (parsed === void 0 || parsed <= 0) {
      return "";
    }
    return args[parsed - 1] ?? "";
  });
  result = result.replace(
    /\$\{@:(\d+)(?::(\d+))?\}/g,
    (_, startStr, lengthStr) => {
      const parsedStart = parseSafeNonNegativeInteger(startStr);
      if (parsedStart === void 0) {
        return "";
      }
      let start = parsedStart - 1;
      if (start < 0) {
        start = 0;
      }
      if (lengthStr) {
        const length = parseSafeNonNegativeInteger(lengthStr);
        if (length === void 0) {
          return "";
        }
        return args.slice(start, start + length).join(" ");
      }
      return args.slice(start).join(" ");
    }
  );
  const allArgs = args.join(" ");
  result = result.replace(/\$ARGUMENTS/g, allArgs);
  result = result.replace(/\$@/g, allArgs);
  return result;
}
function formatPromptTemplateInvocation(template, args = []) {
  return substituteArgs(template.content, args);
}
export {
  formatPromptTemplateInvocation,
  parseCommandArgs,
  substituteArgs
};
