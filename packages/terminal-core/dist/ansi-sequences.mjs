// packages/terminal-core/src/ansi-sequences.ts
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
function isCompatPrefixCode(code) {
  return code === 91 || code === 93 || code === 40 || code === 41 || code === 35 || code === 59 || code === 63;
}
function isCompatParameterCode(code) {
  return code >= 48 && code <= 57 || code === 58 || code === 59;
}
function isDigitCode(code) {
  return code >= 48 && code <= 57;
}
function isCompatFinalCode(code) {
  return code >= 48 && code <= 57 || code >= 64 && code <= 90 || code === 99 || code >= 102 && code <= 110 || code >= 113 && code <= 117 || code === 121 || code === 61 || code === 62 || code === 60 || code === 126;
}
var AnsiSequenceStripper = class {
  constructor() {
    this.state = "text";
    this.csiCompatPrefixOnly = false;
    this.compatInParameters = false;
    this.compatParameterDigits = 0;
  }
  write(input) {
    if (typeof input !== "string") {
      throw new TypeError(`Expected a \`string\`, got \`${typeof input}\``);
    }
    if (this.state === "text" && !input.includes("\x1B") && !input.includes("\x9B") && !input.includes("\x9D")) {
      return input;
    }
    const output = [];
    let index = 0;
    while (index < input.length) {
      const code = input.charCodeAt(index);
      if (this.state === "text") {
        if (code === 27) {
          this.state = "escape";
        } else if (code === 155) {
          this.state = "csi";
          this.csiCompatPrefixOnly = true;
        } else if (code === 157) {
          this.state = "osc";
        } else {
          output.push(input.charAt(index));
        }
        index += 1;
        continue;
      }
      if (this.state === "osc") {
        if (code === 7 || code === 156) {
          this.state = "text";
        } else if (code === 27) {
          this.state = "osc-escape";
        }
        index += 1;
        continue;
      }
      if (this.state === "osc-escape") {
        if (code === 92 || code === 7 || code === 156) {
          this.state = "text";
        } else if (code !== 27) {
          this.state = "osc";
        }
        index += 1;
        continue;
      }
      if (this.state === "csi") {
        if (code === 24 || code === 26) {
          this.state = "text";
          index += 1;
        } else if (code === 27) {
          this.state = "escape";
          index += 1;
        } else if (code === 155) {
          this.csiCompatPrefixOnly = true;
          index += 1;
        } else if (code === 157) {
          this.state = "osc";
          index += 1;
        } else if (code <= 31 || code === 127) {
          output.push(input.charAt(index));
          index += 1;
        } else if (code >= 32 && code <= 63) {
          if (!isCompatPrefixCode(code)) {
            this.csiCompatPrefixOnly = false;
          }
          index += 1;
        } else if ((code === 91 || code === 93) && this.csiCompatPrefixOnly) {
          this.state = "compat";
          this.compatInParameters = false;
          this.compatParameterDigits = 0;
          index += 1;
        } else if (code >= 64 && code <= 126) {
          this.state = "text";
          index += 1;
        } else {
          this.state = "text";
        }
        continue;
      }
      if (this.state === "escape") {
        if (code === 93) {
          this.state = "osc";
          index += 1;
        } else if (code === 91) {
          this.state = "csi";
          this.csiCompatPrefixOnly = true;
          index += 1;
        } else if (code === 27) {
          index += 1;
        } else if (code === 155) {
          this.state = "csi";
          this.csiCompatPrefixOnly = true;
          index += 1;
        } else if (code === 157) {
          this.state = "osc";
          index += 1;
        } else if (isCompatPrefixCode(code)) {
          this.state = "compat";
          this.compatInParameters = false;
          this.compatParameterDigits = 0;
          index += 1;
        } else if (isDigitCode(code)) {
          this.state = "compat";
          this.compatInParameters = true;
          this.compatParameterDigits = 1;
          index += 1;
        } else if (isCompatFinalCode(code)) {
          this.state = "text";
          index += 1;
        } else {
          this.state = "text";
        }
        continue;
      }
      if (code === 24 || code === 26) {
        this.state = "text";
        index += 1;
      } else if (code === 27) {
        this.state = "escape";
        index += 1;
      } else if (code === 155) {
        this.state = "csi";
        this.csiCompatPrefixOnly = true;
        index += 1;
      } else if (code === 157) {
        this.state = "osc";
        index += 1;
      } else if (!this.compatInParameters && isCompatPrefixCode(code)) {
        index += 1;
      } else if (!this.compatInParameters && isDigitCode(code)) {
        this.compatInParameters = true;
        this.compatParameterDigits = 1;
        index += 1;
      } else if (this.compatInParameters && isCompatParameterCode(code)) {
        if (code === 58 || code === 59) {
          this.compatParameterDigits = 0;
          index += 1;
        } else if (this.compatParameterDigits < 4) {
          this.compatParameterDigits += 1;
          index += 1;
        } else {
          this.state = "text";
          index += 1;
        }
      } else if (isCompatFinalCode(code)) {
        this.state = "text";
        index += 1;
      } else {
        this.state = "text";
      }
    }
    return output.join("");
  }
  finish() {
    this.state = "text";
    this.csiCompatPrefixOnly = false;
    this.compatInParameters = false;
    this.compatParameterDigits = 0;
    return "";
  }
};
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
function splitAnsiSegments(input) {
  const segments = [];
  let position = 0;
  let index = 0;
  while (index < input.length) {
    const code = input.charCodeAt(index);
    if (code !== 27 && code !== 155 && code !== 157) {
      index += 1;
      continue;
    }
    const osc = matchAnsiOscAt(input, index);
    const csi = osc ? void 0 : scanAnsiCsiAt(input, index);
    const value = osc ?? csi?.value;
    if (!value) {
      index += 1;
      continue;
    }
    if (index > position) {
      segments.push({ kind: "text", value: input.slice(position, index) });
    }
    segments.push({ controls: csi?.controls ?? [], kind: "ansi", value });
    index += value.length;
    position = index;
  }
  if (position < input.length) {
    segments.push({ kind: "text", value: input.slice(position) });
  }
  return segments;
}
export {
  ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN,
  ANSI_OSC_INTRODUCER_PATTERN,
  ANSI_STRING_TERMINATOR_PATTERN,
  AnsiSequenceStripper,
  matchAnsiOscAt,
  scanAnsiCsiAt,
  splitAnsiSegments
};
