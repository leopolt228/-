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

// packages/net-policy/src/redact-sensitive-url.ts
function normalizeLowercaseStringOrEmpty2(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
var SENSITIVE_URL_HINT_TAG = "url-secret";
var SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
  "token",
  "key",
  "api_key",
  "apikey",
  "secret",
  "access_token",
  "auth_token",
  "password",
  "pass",
  "passwd",
  "auth",
  "jwt",
  "session",
  "id_token",
  "code",
  "client_secret",
  "app_secret",
  "hook_token",
  "refresh_token",
  "signature",
  "x_amz_signature",
  "x_amz_security_token",
  "private_key",
  "credential",
  "authorization"
]);
var URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
var TELEGRAM_BOT_TOKEN_PATH_RE = /\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu;
var MAX_NESTED_URL_REDACTION_DEPTH = 8;
var URL_SCHEME_RE = /(?:^|[^a-z\d+.-])[a-z][a-z\d+.-]{0,31}:/iu;
var SPECIAL_SCHEME_AUTHORITY_RE = /\b(?:https?|wss?|ftp):[\\/]{0,2}[^\\/?#\s]*/giu;
var SPECIAL_SCHEME_SPILLED_USERINFO_RE = /\b(?:https?|wss?|ftp):[\\/]{0,2}[^\s]*@[^\\/?#\s]*/giu;
var PROTOCOL_RELATIVE_AUTHORITY_RE = /[\\/]{2,}[^\\/?#\s]*/gu;
function redactSensitiveUrlPath(value) {
  return value.replace(TELEGRAM_BOT_TOKEN_PATH_RE, "/bot***");
}
function normalizeUrlQueryParamName(name) {
  let current = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
  for (let depth = 0; depth <= MAX_NESTED_URL_REDACTION_DEPTH; depth += 1) {
    let decoded;
    try {
      decoded = decodeURIComponent(current).replace(URL_QUERY_NAME_SEPARATOR_RE, "");
    } catch {
      return {
        value: normalizeLowercaseStringOrEmpty2(current).replaceAll("-", "_"),
        unresolvedEncoding: current.includes("%")
      };
    }
    if (decoded === current) {
      return {
        value: normalizeLowercaseStringOrEmpty2(current).replaceAll("-", "_"),
        unresolvedEncoding: false
      };
    }
    current = decoded;
  }
  return {
    value: normalizeLowercaseStringOrEmpty2(current).replaceAll("-", "_"),
    unresolvedEncoding: current.includes("%")
  };
}
function looksLikeNestedUrlValue(value) {
  if (URL_SCHEME_RE.test(value)) {
    return true;
  }
  const forwardAuthorityIndex = value.indexOf("//");
  const backwardAuthorityIndex = value.indexOf("\\\\");
  const authorityIndex = forwardAuthorityIndex < 0 ? backwardAuthorityIndex : backwardAuthorityIndex < 0 ? forwardAuthorityIndex : Math.min(forwardAuthorityIndex, backwardAuthorityIndex);
  if (authorityIndex >= 0 && value.includes("@", authorityIndex + 2)) {
    return true;
  }
  const queryIndex = value.search(/[?&]/u);
  if (queryIndex >= 0 && value.includes("=", queryIndex + 1)) {
    return true;
  }
  const fragmentIndex = value.indexOf("#");
  if (fragmentIndex >= 0 && value.includes("=", fragmentIndex + 1)) {
    return true;
  }
  return /%[\da-f]{2}/iu.test(value);
}
function isSensitiveUrlQueryParamName(name) {
  const normalized = normalizeUrlQueryParamName(name);
  return normalized.unresolvedEncoding || SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized.value);
}
function isSensitiveUrlConfigPath(path) {
  if (path.endsWith(".baseUrl") || path.endsWith(".httpUrl")) {
    return true;
  }
  if (path.endsWith(".cdpUrl")) {
    return true;
  }
  if (path.endsWith(".request.proxy.url")) {
    return true;
  }
  return /^(?:nodeHost\.)?mcp\.servers\.(?:\*|[^.]+)\.url$/.test(path);
}
function hasSensitiveUrlHintTag(hint) {
  return hint?.tags?.includes(SENSITIVE_URL_HINT_TAG) === true;
}
function redactDirectSensitiveUrl(value) {
  try {
    const parsed = new URL(value);
    let mutated = false;
    const redactedPath = redactSensitiveUrlPath(parsed.pathname);
    if (redactedPath !== parsed.pathname) {
      parsed.pathname = redactedPath;
      mutated = true;
    }
    if (parsed.username || parsed.password) {
      parsed.username = parsed.username ? "***" : "";
      parsed.password = parsed.password ? "***" : "";
      mutated = true;
    }
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (isSensitiveUrlQueryParamName(key)) {
        parsed.searchParams.set(key, "***");
        mutated = true;
      }
    }
    return mutated ? parsed.toString() : value;
  } catch {
    return value;
  }
}
function redactQueryString(value, depth) {
  const params = new URLSearchParams(value);
  const entries = Array.from(params.entries());
  const redactedEntries = [];
  const seenSensitiveKeys = /* @__PURE__ */ new Set();
  let mutated = false;
  for (const [key, entryValue] of entries) {
    if (isSensitiveUrlQueryParamName(key)) {
      mutated = true;
      if (!seenSensitiveKeys.has(key)) {
        seenSensitiveKeys.add(key);
        redactedEntries.push([key, "***"]);
      }
      continue;
    }
    const redactedKey = redactNestedUrlValue(key, depth + 1);
    const redactedValue = redactNestedUrlValue(entryValue, depth + 1);
    if (redactedKey !== key || redactedValue !== entryValue) {
      mutated = true;
    }
    redactedEntries.push([redactedKey, redactedValue]);
  }
  if (!mutated) {
    return value;
  }
  const redactedParams = new URLSearchParams();
  for (const [key, entryValue] of redactedEntries) {
    redactedParams.append(key, entryValue);
  }
  return redactedParams.toString();
}
function redactUrlLikeFallback(value) {
  const redactedFallback = redactEmbeddedUrlUserInfo(value).replace(
    /([?&])([^=&]+)=([^&]*)/g,
    (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match
  );
  return redactSensitiveUrlPath(redactedFallback);
}
function redactAuthorityUserInfo(candidate, authorityStart) {
  const authority = candidate.slice(authorityStart);
  const userInfoEnd = authority.lastIndexOf("@");
  if (userInfoEnd < 0) {
    return candidate;
  }
  return `${candidate.slice(0, authorityStart)}***:***@${authority.slice(userInfoEnd + 1)}`;
}
function redactEmbeddedUrlUserInfo(value) {
  return value.replace(SPECIAL_SCHEME_AUTHORITY_RE, (candidate) => {
    let authorityStart = candidate.indexOf(":") + 1;
    while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) {
      authorityStart += 1;
    }
    return redactAuthorityUserInfo(candidate, authorityStart);
  }).replace(SPECIAL_SCHEME_SPILLED_USERINFO_RE, (candidate) => {
    let authorityStart = candidate.indexOf(":") + 1;
    while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) {
      authorityStart += 1;
    }
    const userInfoEnd = candidate.lastIndexOf("@");
    const firstReservedDelimiter = candidate.slice(authorityStart).search(/[\\/?#]/u);
    if (userInfoEnd < 0 || firstReservedDelimiter < 0) {
      return candidate;
    }
    const absoluteReservedDelimiter = authorityStart + firstReservedDelimiter;
    if (absoluteReservedDelimiter >= userInfoEnd) {
      return candidate;
    }
    const credentialSeparator = candidate.indexOf(":", authorityStart);
    if (credentialSeparator < 0 || credentialSeparator > absoluteReservedDelimiter) {
      return candidate;
    }
    const authorityPrefix = candidate.slice(authorityStart, absoluteReservedDelimiter);
    const possiblePort = candidate.slice(credentialSeparator + 1, absoluteReservedDelimiter);
    if (/^\d+$/u.test(possiblePort) || /^\[[^\]]+\](?::\d+)?$/u.test(authorityPrefix)) {
      return candidate;
    }
    return `${candidate.slice(0, authorityStart)}***:***@${candidate.slice(userInfoEnd + 1)}`;
  }).replace(PROTOCOL_RELATIVE_AUTHORITY_RE, (candidate) => {
    let authorityStart = 0;
    while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) {
      authorityStart += 1;
    }
    return redactAuthorityUserInfo(candidate, authorityStart);
  });
}
function hasUnresolvedEmbeddedUrlUserInfo(value) {
  for (const match of value.matchAll(/(?:\b(?:https?|wss?|ftp):[\\/]{0,2}|[\\/]{2,})/giu)) {
    const remainder = value.slice((match.index ?? 0) + match[0].length);
    const userInfoEnd = remainder.search(/(?<!\*\*\*:\*\*\*)@/u);
    const authorityEnd = remainder.search(/[\\/?#]/u);
    const pathBeforeAt = remainder.slice(authorityEnd + 1, userInfoEnd);
    if (userInfoEnd >= 0 && (authorityEnd < 0 || userInfoEnd <= authorityEnd || remainder[authorityEnd] === "/" && (pathBeforeAt.includes(":") || /^[^/?#\s]+\.[^/?#\s]+(?:[/?#]|$)/u.test(remainder.slice(userInfoEnd + 1))))) {
      return true;
    }
  }
  return false;
}
function redactRelativeUrlFragment(value, depth) {
  const fragmentIndex = value.indexOf("#");
  if (fragmentIndex < 0) {
    return value;
  }
  const fragment = value.slice(fragmentIndex + 1);
  const redactedFragment = redactFragment(fragment, depth + 1);
  return redactedFragment === fragment ? value : `${value.slice(0, fragmentIndex + 1)}${redactedFragment}`;
}
function redactFragment(value, depth) {
  if (!value) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH && looksLikeNestedUrlValue(value)) {
    return "***";
  }
  const wholeUrl = redactSensitiveUrlAtDepth(value, depth);
  if (wholeUrl.parsedWholeUrl) {
    return redactUrlLikeFallback(wholeUrl.value);
  }
  const candidate = value;
  const firstQueryDelimiter = candidate.search(/[?&]/u);
  const firstEquals = candidate.indexOf("=");
  if (firstEquals >= 0 && (firstQueryDelimiter < 0 || firstEquals < firstQueryDelimiter)) {
    return redactQueryString(candidate, depth);
  }
  const hashRouterQueryIndex = candidate.indexOf("?");
  if (hashRouterQueryIndex >= 0) {
    const query = candidate.slice(hashRouterQueryIndex + 1);
    const redactedQuery = redactQueryString(query, depth);
    const prefix = candidate.slice(0, hashRouterQueryIndex + 1);
    const redactedPrefix = redactEncodedUrlLikeString(redactUrlLikeFallback(prefix), depth + 1);
    return `${redactedPrefix}${redactedQuery}`;
  }
  const fallback = redactUrlLikeFallback(candidate);
  if (!looksLikeNestedUrlValue(fallback)) {
    return fallback;
  }
  let decoded;
  try {
    decoded = decodeURIComponent(fallback);
  } catch {
    return "***";
  }
  if (decoded === fallback) {
    return fallback;
  }
  const redactedDecoded = redactFragment(decoded, depth + 1);
  return redactedDecoded === decoded ? fallback : encodeURIComponent(redactedDecoded);
}
function redactEncodedNestedUrlPath(value, depth) {
  if (!looksLikeNestedUrlValue(value)) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
    return "***";
  }
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "***";
  }
  if (decoded === value) {
    return value;
  }
  const direct = redactSensitiveUrlLikeStringAtDepth(decoded, depth);
  if (direct.value !== decoded || hasUnresolvedEmbeddedUrlUserInfo(decoded)) {
    return direct.value !== decoded ? direct.value : "***";
  }
  if (direct.parsedWholeUrl) {
    return value;
  }
  const nested = redactEncodedNestedUrlPath(decoded, depth + 1);
  return nested === decoded ? value : nested;
}
function redactSensitiveUrlAtDepth(value, depth) {
  try {
    const directRedaction = redactDirectSensitiveUrl(value);
    const parsed = new URL(directRedaction);
    if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
      return { value: "***", parsedWholeUrl: true };
    }
    let mutated = directRedaction !== value;
    const redactedNestedPath = redactEmbeddedUrlUserInfo(
      redactEncodedNestedUrlPath(parsed.pathname, depth + 1)
    );
    if (redactedNestedPath !== parsed.pathname) {
      const originalPath = parsed.pathname;
      parsed.pathname = redactedNestedPath;
      if (parsed.pathname === originalPath) {
        return { value: directRedaction, parsedWholeUrl: false };
      }
      mutated = true;
    }
    const redactedQuery = redactQueryString(parsed.search.slice(1), depth);
    if (redactedQuery !== parsed.search.slice(1)) {
      parsed.search = redactedQuery;
      mutated = true;
    }
    const fragment = parsed.hash.slice(1);
    const redactedHash = redactFragment(fragment, depth + 1);
    if (redactedHash !== fragment) {
      parsed.hash = redactedHash;
      mutated = true;
    }
    return { value: mutated ? parsed.toString() : value, parsedWholeUrl: true };
  } catch {
    return { value, parsedWholeUrl: false };
  }
}
function redactSensitiveUrlLikeStringAtDepth(value, depth) {
  const redactedUrl = redactSensitiveUrlAtDepth(value, depth);
  if (redactedUrl.parsedWholeUrl) {
    return redactedUrl;
  }
  const redactedFallback = redactUrlLikeFallback(redactedUrl.value);
  const redactedRelativeFragment = redactRelativeUrlFragment(redactedFallback, depth);
  return {
    value: redactEncodedUrlLikeString(redactedRelativeFragment, depth + 1),
    parsedWholeUrl: false
  };
}
function redactEncodedUrlLikeString(value, depth) {
  if (!looksLikeNestedUrlValue(value)) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
    return "***";
  }
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "***";
  }
  if (decoded === value) {
    return value;
  }
  const redactedDecoded = redactSensitiveUrlLikeStringAtDepth(decoded, depth + 1);
  if (redactedDecoded.value !== decoded || redactedDecoded.parsedWholeUrl) {
    return redactedDecoded.value === decoded ? value : redactedDecoded.value;
  }
  return hasUnresolvedEmbeddedUrlUserInfo(decoded) ? "***" : value;
}
function redactNestedUrlValue(value, depth) {
  if (!looksLikeNestedUrlValue(value)) {
    return value;
  }
  if (depth > MAX_NESTED_URL_REDACTION_DEPTH) {
    return "***";
  }
  const direct = redactSensitiveUrlLikeStringAtDepth(value, depth);
  if (direct.value !== value) {
    return direct.value;
  }
  if (hasUnresolvedEmbeddedUrlUserInfo(value)) {
    return "***";
  }
  if (direct.parsedWholeUrl) {
    return value;
  }
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "***";
  }
  if (decoded === value || !looksLikeNestedUrlValue(decoded)) {
    return value;
  }
  const redactedDecoded = redactNestedUrlValue(decoded, depth + 1);
  return redactedDecoded === decoded ? value : encodeURIComponent(redactedDecoded);
}
function redactSensitiveUrl(value) {
  return redactSensitiveUrlLikeStringAtDepth(value, 0).value;
}
function redactSensitiveUrlLikeString(value) {
  return redactSensitiveUrlLikeStringAtDepth(value, 0).value;
}

// packages/net-policy/src/url-protocol.ts
var HTTP_URL_PREFIX_RE = /^https?:\/\//i;
function parseUrl(value) {
  if (value instanceof URL) {
    return value;
  }
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
function hasHttpUrlPrefix(value) {
  return HTTP_URL_PREFIX_RE.test(value);
}
function isHttpUrl(value) {
  const url = parseUrl(value);
  return url?.protocol === "http:" || url?.protocol === "https:";
}
function isHttpsUrl(value) {
  return parseUrl(value)?.protocol === "https:";
}
function isWebSocketUrl(value) {
  const url = parseUrl(value);
  return url?.protocol === "ws:" || url?.protocol === "wss:";
}

// packages/net-policy/src/url-userinfo.ts
function stripUrlUserInfo(value) {
  try {
    const parsed = new URL(value);
    if (!parsed.username && !parsed.password) {
      return value;
    }
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return value;
  }
}
export {
  SENSITIVE_URL_HINT_TAG,
  extractEmbeddedIpv4FromIpv6,
  hasHttpUrlPrefix,
  hasSensitiveUrlHintTag,
  isBlockedSpecialUseIpv4Address,
  isBlockedSpecialUseIpv6Address,
  isCanonicalDottedDecimalIPv4,
  isCarrierGradeNatIpv4Address,
  isCloudMetadataIpAddress,
  isHttpUrl,
  isHttpsUrl,
  isIpInCidr,
  isIpv4Address,
  isIpv6Address,
  isLegacyIpv4Literal,
  isLinkLocalIpAddress,
  isLoopbackIpAddress,
  isPrivateOrLoopbackIpAddress,
  isRfc1918Ipv4Address,
  isSensitiveUrlConfigPath,
  isSensitiveUrlQueryParamName,
  isWebSocketUrl,
  normalizeIpAddress,
  parseCanonicalIpAddress,
  parseLooseIpAddress,
  redactSensitiveUrl,
  redactSensitiveUrlLikeString,
  stripUrlUserInfo,
  validateDottedDecimalIPv4Input
};
