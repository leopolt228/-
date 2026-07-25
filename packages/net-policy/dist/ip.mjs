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
function expectIpv6Hextets(parts) {
  const [a, b, c, d, e, f, g, h] = parts;
  if (a === void 0 || b === void 0 || c === void 0 || d === void 0 || e === void 0 || f === void 0 || g === void 0 || h === void 0) {
    throw new Error("expected IPv6 address to expose 8 hextets");
  }
  return [a, b, c, d, e, f, g, h];
}
var BLOCKED_IPV4_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
  "unspecified",
  "broadcast",
  "multicast",
  "linkLocal",
  "loopback",
  "carrierGradeNat",
  "private",
  "reserved"
]);
var PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
  "loopback",
  "private",
  "linkLocal",
  "carrierGradeNat"
]);
var BLOCKED_IPV6_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
  "unspecified",
  "loopback",
  "linkLocal",
  "uniqueLocal",
  "multicast",
  "reserved",
  "benchmarking",
  "discard",
  "orchid2"
]);
var RFC2544_BENCHMARK_PREFIX = [ipaddr.IPv4.parse("198.18.0.0"), 15];
var CLOUD_METADATA_IP_ADDRESSES = /* @__PURE__ */ new Set(["100.100.100.200", "fd00:ec2::254"]);
function stripIpv6Brackets(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1);
  }
  return value;
}
function isNumericIpv4LiteralPart(value) {
  return /^[0-9]+$/.test(value) || /^0x[0-9a-f]+$/i.test(value);
}
function isIpv4Address(address) {
  return address.kind() === "ipv4";
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
function parseLooseIpAddress(raw) {
  const normalized = normalizeIpParseInput(raw);
  if (!normalized) {
    return void 0;
  }
  return ipaddr.isValid(normalized) ? ipaddr.parse(normalized) : void 0;
}
function normalizeIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return void 0;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  return normalizeLowercaseStringOrEmpty(normalized.toString());
}
function isCanonicalDottedDecimalIPv4(raw) {
  const normalized = normalizeIpParseInput(raw);
  return normalized !== void 0 && ipaddr.IPv4.isValidFourPartDecimal(normalized);
}
function isLegacyIpv4Literal(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) {
    return false;
  }
  const normalized = stripIpv6Brackets(trimmed);
  if (!normalized || normalized.includes(":")) {
    return false;
  }
  if (isCanonicalDottedDecimalIPv4(normalized)) {
    return false;
  }
  const parts = normalized.split(".");
  if (parts.length === 0 || parts.length > 4) {
    return false;
  }
  if (parts.some((part) => part.length === 0)) {
    return false;
  }
  if (!parts.every((part) => isNumericIpv4LiteralPart(part))) {
    return false;
  }
  return true;
}
function isLoopbackIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  return normalized.range() === "loopback";
}
function isLinkLocalIpAddress(raw) {
  const parsed = parseLooseIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv4Address(normalized)) {
    return normalized.range() === "linkLocal";
  }
  const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
  if (embeddedIpv4?.range() === "linkLocal") {
    return true;
  }
  return normalized.range() === "linkLocal";
}
function isCloudMetadataIpAddress(raw) {
  const parsed = parseLooseIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv6Address(normalized)) {
    const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
    if (embeddedIpv4 && CLOUD_METADATA_IP_ADDRESSES.has(embeddedIpv4.toString())) {
      return true;
    }
  }
  return CLOUD_METADATA_IP_ADDRESSES.has(normalized.toString());
}
function isPrivateOrLoopbackIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) {
    return false;
  }
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv4Address(normalized)) {
    return PRIVATE_OR_LOOPBACK_IPV4_RANGES.has(normalized.range());
  }
  return isBlockedSpecialUseIpv6Address(normalized);
}
function isBlockedSpecialUseIpv6Address(address, options = {}) {
  const range = address.range();
  if (range === "uniqueLocal" && options.allowUniqueLocalRange === true) {
    return false;
  }
  if (BLOCKED_IPV6_SPECIAL_USE_RANGES.has(range)) {
    return true;
  }
  const [firstPart] = expectIpv6Hextets(address.parts);
  return (firstPart & 65472) === 65216;
}
function isRfc1918Ipv4Address(raw) {
  return parseCanonicalIpAddress(raw)?.range() === "private";
}
function isCarrierGradeNatIpv4Address(raw) {
  return parseCanonicalIpAddress(raw)?.range() === "carrierGradeNat";
}
function isBlockedSpecialUseIpv4Address(address, options = {}) {
  const inRfc2544BenchmarkRange = address.match(RFC2544_BENCHMARK_PREFIX);
  if (inRfc2544BenchmarkRange && options.allowRfc2544BenchmarkRange === true) {
    return false;
  }
  return BLOCKED_IPV4_SPECIAL_USE_RANGES.has(address.range()) || inRfc2544BenchmarkRange;
}
function decodeIpv4FromHextets(high, low) {
  const octets = [
    high >>> 8 & 255,
    high & 255,
    low >>> 8 & 255,
    low & 255
  ];
  return ipaddr.IPv4.parse(octets.join("."));
}
function extractEmbeddedIpv4FromIpv6(address) {
  const parts = expectIpv6Hextets(address.parts);
  switch (address.range()) {
    case "ipv4Mapped":
      return address.toIPv4Address();
    case "rfc6145":
    case "rfc6052":
      return decodeIpv4FromHextets(parts[6], parts[7]);
    case "6to4":
      return decodeIpv4FromHextets(parts[1], parts[2]);
    case "teredo":
      return decodeIpv4FromHextets(parts[6] ^ 65535, parts[7] ^ 65535);
    default:
      break;
  }
  const isIpv4Compatible = parts[0] === 0 && parts[1] === 0 && parts[2] === 0 && parts[3] === 0 && parts[4] === 0 && parts[5] === 0;
  const isIsatap = (parts[4] & 64767) === 0 && parts[5] === 24318;
  if (isIpv4Compatible || isIsatap) {
    return decodeIpv4FromHextets(parts[6], parts[7]);
  }
  return void 0;
}
function isIpInCidr(ip, cidr) {
  const normalizedIp = parseCanonicalIpAddress(ip);
  if (!normalizedIp) {
    return false;
  }
  const candidate = cidr.trim();
  if (!candidate) {
    return false;
  }
  const comparableIp = normalizeIpv4MappedAddress(normalizedIp);
  if (!candidate.includes("/")) {
    const exact = parseCanonicalIpAddress(candidate);
    if (!exact) {
      return false;
    }
    const comparableExact = normalizeIpv4MappedAddress(exact);
    return comparableIp.kind() === comparableExact.kind() && comparableIp.toString() === comparableExact.toString();
  }
  try {
    const [baseAddress, prefixLength] = ipaddr.parseCIDR(candidate);
    const comparableBase = normalizeIpv4MappedAddress(baseAddress);
    if (isIpv4Address(comparableIp) && isIpv4Address(comparableBase)) {
      return comparableIp.match([comparableBase, prefixLength]);
    }
    if (isIpv6Address(comparableIp) && isIpv6Address(comparableBase)) {
      return comparableIp.match([comparableBase, prefixLength]);
    }
    return false;
  } catch {
    return false;
  }
}
export {
  extractEmbeddedIpv4FromIpv6,
  isBlockedSpecialUseIpv4Address,
  isBlockedSpecialUseIpv6Address,
  isCanonicalDottedDecimalIPv4,
  isCarrierGradeNatIpv4Address,
  isCloudMetadataIpAddress,
  isIpInCidr,
  isIpv4Address,
  isIpv6Address,
  isLegacyIpv4Literal,
  isLinkLocalIpAddress,
  isLoopbackIpAddress,
  isPrivateOrLoopbackIpAddress,
  isRfc1918Ipv4Address,
  normalizeIpAddress,
  parseCanonicalIpAddress,
  parseLooseIpAddress
};
