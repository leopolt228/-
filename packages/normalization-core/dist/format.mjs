// packages/normalization-core/src/expect.ts
function expectDefined(value, context) {
  if (value === null || value === void 0) {
    throw new Error("expected " + context + " to be defined");
  }
  return value;
}

// packages/normalization-core/src/format.ts
var BYTE_SIZE_UNITS = ["byte", "kilo", "mega", "giga", "tera"];
var BYTE_SIZE_STYLES = {
  iec: { base: 1024, labels: ["B", "KiB", "MiB", "GiB", "TiB"] },
  "legacy-binary": { base: 1024, labels: ["B", "KB", "MB", "GB", "TB"] }
};
function formatByteSize(bytes, options) {
  const { base, labels } = BYTE_SIZE_STYLES[options.style];
  const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
  let unitIndex = 0;
  let value = bytes;
  while (value >= base && unitIndex < maxUnitIndex) {
    value /= base;
    unitIndex += 1;
  }
  const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
  const label = expectDefined(labels[unitIndex], "byte-size label");
  const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
  if (fractionDigits === null) {
    return `${value}${options.separator}${label}`;
  }
  if (options.floorUnits?.includes(unit)) {
    value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
  }
  return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
export {
  formatByteSize
};
