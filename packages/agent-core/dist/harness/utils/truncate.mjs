// packages/agent-core/src/harness/utils/truncate.ts
var DEFAULT_MAX_LINES = 2e3;
var DEFAULT_MAX_BYTES = 50 * 1024;
var GREP_MAX_LINE_LENGTH = 500;
var runtimeBuffer = globalThis.Buffer;
function splitLinesForCounting(content) {
  if (content.length === 0) {
    return [];
  }
  const lines = content.split("\n");
  if (content.endsWith("\n")) {
    lines.pop();
  }
  return lines;
}
function findFirstNonAscii(content) {
  for (let index = 0; index < content.length; index++) {
    if (content.charCodeAt(index) > 127) {
      return index;
    }
  }
  return -1;
}
function utf8ByteLength(content) {
  if (runtimeBuffer) {
    return runtimeBuffer.byteLength(content, "utf8");
  }
  const firstNonAscii = findFirstNonAscii(content);
  if (firstNonAscii === -1) {
    return content.length;
  }
  let bytes = firstNonAscii;
  for (let i = firstNonAscii; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code <= 127) {
      bytes += 1;
    } else if (code <= 2047) {
      bytes += 2;
    } else if (code >= 55296 && code <= 56319 && i + 1 < content.length) {
      const next = content.charCodeAt(i + 1);
      if (next >= 56320 && next <= 57343) {
        bytes += 4;
        i++;
      } else {
        bytes += 3;
      }
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
function replaceUnpairedSurrogates(content) {
  let output = "";
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code >= 55296 && code <= 56319) {
      if (i + 1 < content.length) {
        const next = content.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          output += content.charAt(i) + content.charAt(i + 1);
          i++;
          continue;
        }
      }
      output += "\uFFFD";
    } else if (code >= 56320 && code <= 57343) {
      output += "\uFFFD";
    } else {
      output += content.charAt(i);
    }
  }
  return output;
}
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
function resolveTruncationInput(content, options) {
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const totalBytes = utf8ByteLength(content);
  const lines = splitLinesForCounting(content);
  return {
    lines,
    totalLines: lines.length,
    totalBytes,
    maxLines,
    maxBytes
  };
}
function buildTruncationResult(input, params) {
  return {
    content: params.content,
    truncated: params.truncated,
    truncatedBy: params.truncatedBy,
    totalLines: input.totalLines,
    totalBytes: input.totalBytes,
    outputLines: params.outputLines,
    outputBytes: params.outputBytes ?? utf8ByteLength(params.content),
    lastLinePartial: params.lastLinePartial ?? false,
    firstLineExceedsLimit: params.firstLineExceedsLimit ?? false,
    maxLines: input.maxLines,
    maxBytes: input.maxBytes
  };
}
function truncateHead(content, options = {}) {
  const input = resolveTruncationInput(content, options);
  if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) {
    return buildTruncationResult(input, {
      content,
      truncated: false,
      truncatedBy: null,
      outputLines: input.totalLines,
      outputBytes: input.totalBytes
    });
  }
  const firstLine = input.lines[0];
  if (firstLine !== void 0 && utf8ByteLength(firstLine) > input.maxBytes) {
    return buildTruncationResult(input, {
      content: "",
      truncated: true,
      truncatedBy: "bytes",
      outputLines: 0,
      outputBytes: 0,
      firstLineExceedsLimit: true
    });
  }
  const outputLinesArr = [];
  let outputBytesCount = 0;
  let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
  for (const [i, line] of input.lines.slice(0, input.maxLines).entries()) {
    const lineBytes = utf8ByteLength(line) + (i > 0 ? 1 : 0);
    if (outputBytesCount + lineBytes > input.maxBytes) {
      truncatedBy = "bytes";
      break;
    }
    outputLinesArr.push(line);
    outputBytesCount += lineBytes;
  }
  if (input.totalLines > input.maxLines && outputLinesArr.length >= input.maxLines && outputBytesCount <= input.maxBytes) {
    truncatedBy = "lines";
  }
  const outputContent = outputLinesArr.join("\n");
  return buildTruncationResult(input, {
    content: outputContent,
    truncated: true,
    truncatedBy,
    outputLines: outputLinesArr.length
  });
}
function truncateTail(content, options = {}) {
  const input = resolveTruncationInput(content, options);
  if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) {
    return buildTruncationResult(input, {
      content,
      truncated: false,
      truncatedBy: null,
      outputLines: input.totalLines,
      outputBytes: input.totalBytes
    });
  }
  const outputLinesArr = [];
  let outputBytesCount = 0;
  let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
  let lastLinePartial = false;
  for (let i = input.lines.length - 1; i >= 0 && outputLinesArr.length < input.maxLines; i--) {
    const line = input.lines.at(i);
    if (line === void 0) {
      continue;
    }
    const lineBytes = utf8ByteLength(line) + (outputLinesArr.length > 0 ? 1 : 0);
    if (outputBytesCount + lineBytes > input.maxBytes) {
      truncatedBy = "bytes";
      if (outputLinesArr.length === 0) {
        const truncatedLine = truncateStringToBytesFromEnd(line, input.maxBytes);
        outputLinesArr.unshift(truncatedLine);
        outputBytesCount = utf8ByteLength(truncatedLine);
        lastLinePartial = true;
      }
      break;
    }
    outputLinesArr.unshift(line);
    outputBytesCount += lineBytes;
  }
  if (input.totalLines > input.maxLines && outputLinesArr.length >= input.maxLines && outputBytesCount <= input.maxBytes) {
    truncatedBy = "lines";
  }
  const outputContent = outputLinesArr.join("\n");
  return buildTruncationResult(input, {
    content: outputContent,
    truncated: true,
    truncatedBy,
    outputLines: outputLinesArr.length,
    lastLinePartial
  });
}
function truncateStringToBytesFromEnd(str, maxBytes) {
  if (maxBytes <= 0) {
    return "";
  }
  let outputBytes = 0;
  let start = str.length;
  let needsReplacement = false;
  for (let i = str.length; i > 0; ) {
    let characterStart = i - 1;
    const code = str.charCodeAt(characterStart);
    let characterBytes;
    let unpairedSurrogate = false;
    if (code >= 56320 && code <= 57343 && characterStart > 0) {
      const previous = str.charCodeAt(characterStart - 1);
      if (previous >= 55296 && previous <= 56319) {
        characterStart--;
        characterBytes = 4;
      } else {
        characterBytes = 3;
        unpairedSurrogate = true;
      }
    } else if (code >= 55296 && code <= 57343) {
      characterBytes = 3;
      unpairedSurrogate = true;
    } else {
      characterBytes = code <= 127 ? 1 : code <= 2047 ? 2 : 3;
    }
    if (outputBytes + characterBytes > maxBytes) {
      break;
    }
    outputBytes += characterBytes;
    start = characterStart;
    needsReplacement ||= unpairedSurrogate;
    i = characterStart;
  }
  const output = str.slice(start);
  return needsReplacement ? replaceUnpairedSurrogates(output) : output;
}
function truncateLine(line, maxChars = GREP_MAX_LINE_LENGTH) {
  if (line.length <= maxChars) {
    return { text: line, wasTruncated: false };
  }
  let cut = maxChars;
  if (cut < line.length) {
    const lastCode = line.charCodeAt(cut - 1);
    if (lastCode >= 55296 && lastCode <= 56319) {
      const nextCode = line.charCodeAt(cut);
      if (nextCode >= 56320 && nextCode <= 57343) {
        cut -= 1;
      }
    }
  }
  return { text: `${line.slice(0, cut)}... [truncated]`, wasTruncated: true };
}
export {
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  GREP_MAX_LINE_LENGTH,
  formatSize,
  truncateHead,
  truncateLine,
  truncateTail
};
