// packages/net-policy/src/ip.ts
import ipaddr from "ipaddr.js";
function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed || void 0;
}
var RFC2544_BENCHMARK_PREFIX = [ipaddr.IPv4.parse("198.18.0.0"), 15];
function stripIpv6Brackets(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1);
  }
  return value;
}
function normalizeIpParseInput(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) {
    return void 0;
  }
  return stripIpv6Brackets(trimmed);
}
function isCanonicalDottedDecimalIPv4(raw) {
  const normalized = normalizeIpParseInput(raw);
  return normalized !== void 0 && ipaddr.IPv4.isValidFourPartDecimal(normalized);
}

// packages/net-policy/src/ipv4.ts
function validateDottedDecimalIPv4Input(value) {
  if (!value) {
    return "IP address is required for custom bind mode";
  }
  if (isCanonicalDottedDecimalIPv4(value)) {
    return void 0;
  }
  return "Invalid IPv4 address (e.g., 192.168.1.100)";
}
export {
  validateDottedDecimalIPv4Input
};
