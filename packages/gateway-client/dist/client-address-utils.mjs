// packages/net-policy/src/ip.ts
import ipaddr from "ipaddr.js";
function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed || void 0;
}
function normalizeLowercaseStringOrEmpty(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
var RFC2544_BENCHMARK_PREFIX = [ipaddr.IPv4.parse("198.18.0.0"), 15];
function stripIpv6Brackets(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1);
  }
  return value;
}
function isIpv6Address(address) {
  return address.kind() === "ipv6";
}
function normalizeIpv4MappedAddress(address) {
  if (!isIpv6Address(address)) {
    return address;
  }
  if (!address.isIPv4MappedAddress()) {
    return address;
  }
  return address.toIPv4Address();
}
function normalizeIpParseInput(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) {
    return void 0;
  }
  return stripIpv6Brackets(trimmed);
}
function parseCanonicalIpAddress(raw) {
  const normalized = normalizeIpParseInput(raw);
  if (!normalized) {
    return void 0;
  }
  const isCanonical = ipaddr.IPv4.isValidFourPartDecimal(normalized) || ipaddr.IPv6.isValid(normalized);
  return isCanonical ? ipaddr.parse(normalized) : void 0;
}
function normalizeIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return void 0;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  return normalizeLowercaseStringOrEmpty(normalized.toString());
}

// packages/gateway-client/src/client-address-utils.ts
function normalizeLowercaseStringOrEmpty2(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isSensitiveUrlQueryParamName(key) {
  return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function normalizeFingerprint(fingerprint) {
  return (fingerprint ?? "").replaceAll(":", "").trim().toLowerCase();
}
function parseHostForAddressChecks(host) {
  if (!host) {
    return null;
  }
  const normalizedHost = host.toLowerCase().trim();
  const canonicalHost = normalizedHost.replace(/\.+$/, "");
  if (canonicalHost === "localhost") {
    return { isLocalhost: true, unbracketedHost: canonicalHost };
  }
  return {
    isLocalhost: false,
    // URL.hostname canonicalizes IPv6 with brackets in some call sites. Strip
    // them before net.isIP so address checks do not fall back to hostname rules.
    unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
  };
}
function parseGatewayIpAddress(host) {
  const normalized = normalizeIpAddress(host);
  return normalized ? parseCanonicalIpAddress(normalized) : void 0;
}
export {
  isSensitiveUrlQueryParamName,
  normalizeFingerprint,
  normalizeLowercaseStringOrEmpty2 as normalizeLowercaseStringOrEmpty,
  parseGatewayIpAddress,
  parseHostForAddressChecks
};
