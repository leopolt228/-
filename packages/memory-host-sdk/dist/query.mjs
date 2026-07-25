// packages/memory-host-sdk/src/query.ts
function normalizeNullableString(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}
var STOP_WORDS_EN = /* @__PURE__ */ new Set([
  // Articles and determiners
  "a",
  "an",
  "the",
  "this",
  "that",
  "these",
  "those",
  // Pronouns
  "i",
  "me",
  "my",
  "we",
  "our",
  "you",
  "your",
  "he",
  "she",
  "it",
  "they",
  "them",
  // Common verbs
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "can",
  "may",
  "might",
  // Prepositions
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "about",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "over",
  // Conjunctions
  "and",
  "or",
  "but",
  "if",
  "then",
  "because",
  "as",
  "while",
  "when",
  "where",
  "what",
  "which",
  "who",
  "how",
  "why",
  // Time references (vague, not useful for FTS)
  "yesterday",
  "today",
  "tomorrow",
  "earlier",
  "later",
  "recently",
  "before",
  "ago",
  "just",
  "now",
  // Vague references
  "thing",
  "things",
  "stuff",
  "something",
  "anything",
  "everything",
  "nothing",
  // Question words
  "please",
  "help",
  "find",
  "show",
  "get",
  "tell",
  "give"
]);
var STOP_WORDS_ES = /* @__PURE__ */ new Set([
  // Articles and determiners
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "este",
  "esta",
  "ese",
  "esa",
  // Pronouns
  "yo",
  "me",
  "mi",
  "nosotros",
  "nosotras",
  "tu",
  "tus",
  "usted",
  "ustedes",
  "ellos",
  "ellas",
  // Prepositions and conjunctions
  "de",
  "del",
  "a",
  "en",
  "con",
  "por",
  "para",
  "sobre",
  "entre",
  "y",
  "o",
  "pero",
  "si",
  "porque",
  "como",
  // Common verbs / auxiliaries
  "es",
  "son",
  "fue",
  "fueron",
  "ser",
  "estar",
  "haber",
  "tener",
  "hacer",
  // Time references (vague)
  "ayer",
  "hoy",
  "ma\xF1ana",
  "antes",
  "despues",
  "despu\xE9s",
  "ahora",
  "recientemente",
  // Question/request words
  "que",
  "qu\xE9",
  "c\xF3mo",
  "cuando",
  "cu\xE1ndo",
  "donde",
  "d\xF3nde",
  "porqu\xE9",
  "favor",
  "ayuda"
]);
var STOP_WORDS_PT = /* @__PURE__ */ new Set([
  // Articles and determiners
  "o",
  "a",
  "os",
  "as",
  "um",
  "uma",
  "uns",
  "umas",
  "este",
  "esta",
  "esse",
  "essa",
  // Pronouns
  "eu",
  "me",
  "meu",
  "minha",
  "nos",
  "n\xF3s",
  "voc\xEA",
  "voc\xEAs",
  "ele",
  "ela",
  "eles",
  "elas",
  // Prepositions and conjunctions
  "de",
  "do",
  "da",
  "em",
  "com",
  "por",
  "para",
  "sobre",
  "entre",
  "e",
  "ou",
  "mas",
  "se",
  "porque",
  "como",
  // Common verbs / auxiliaries
  "\xE9",
  "s\xE3o",
  "foi",
  "foram",
  "ser",
  "estar",
  "ter",
  "fazer",
  // Time references (vague)
  "ontem",
  "hoje",
  "amanh\xE3",
  "antes",
  "depois",
  "agora",
  "recentemente",
  // Question/request words
  "que",
  "qu\xEA",
  "quando",
  "onde",
  "porqu\xEA",
  "favor",
  "ajuda"
]);
var STOP_WORDS_AR = /* @__PURE__ */ new Set([
  // Articles and connectors
  "\u0627\u0644",
  "\u0648",
  "\u0623\u0648",
  "\u0644\u0643\u0646",
  "\u062B\u0645",
  "\u0628\u0644",
  // Pronouns / references
  "\u0623\u0646\u0627",
  "\u0646\u062D\u0646",
  "\u0647\u0648",
  "\u0647\u064A",
  "\u0647\u0645",
  "\u0647\u0630\u0627",
  "\u0647\u0630\u0647",
  "\u0630\u0644\u0643",
  "\u062A\u0644\u0643",
  "\u0647\u0646\u0627",
  "\u0647\u0646\u0627\u0643",
  // Common prepositions
  "\u0645\u0646",
  "\u0625\u0644\u0649",
  "\u0627\u0644\u0649",
  "\u0641\u064A",
  "\u0639\u0644\u0649",
  "\u0639\u0646",
  "\u0645\u0639",
  "\u0628\u064A\u0646",
  "\u0644",
  "\u0628",
  "\u0643",
  // Common auxiliaries / vague verbs
  "\u0643\u0627\u0646",
  "\u0643\u0627\u0646\u062A",
  "\u064A\u0643\u0648\u0646",
  "\u062A\u0643\u0648\u0646",
  "\u0635\u0627\u0631",
  "\u0623\u0635\u0628\u062D",
  "\u064A\u0645\u0643\u0646",
  "\u0645\u0645\u0643\u0646",
  // Time references (vague)
  "\u0628\u0627\u0644\u0623\u0645\u0633",
  "\u0627\u0645\u0633",
  "\u0627\u0644\u064A\u0648\u0645",
  "\u063A\u062F\u0627",
  "\u0627\u0644\u0622\u0646",
  "\u0642\u0628\u0644",
  "\u0628\u0639\u062F",
  "\u0645\u0624\u062E\u0631\u0627",
  // Question/request words
  "\u0644\u0645\u0627\u0630\u0627",
  "\u0643\u064A\u0641",
  "\u0645\u0627\u0630\u0627",
  "\u0645\u062A\u0649",
  "\u0623\u064A\u0646",
  "\u0647\u0644",
  "\u0645\u0646 \u0641\u0636\u0644\u0643",
  "\u0641\u0636\u0644\u0627",
  "\u0633\u0627\u0639\u062F"
]);
var STOP_WORDS_KO = /* @__PURE__ */ new Set([
  // Particles (조사)
  "\uC740",
  "\uB294",
  "\uC774",
  "\uAC00",
  "\uC744",
  "\uB97C",
  "\uC758",
  "\uC5D0",
  "\uC5D0\uC11C",
  "\uB85C",
  "\uC73C\uB85C",
  "\uC640",
  "\uACFC",
  "\uB3C4",
  "\uB9CC",
  "\uAE4C\uC9C0",
  "\uBD80\uD130",
  "\uD55C\uD14C",
  "\uC5D0\uAC8C",
  "\uAED8",
  "\uCC98\uB7FC",
  "\uAC19\uC774",
  "\uBCF4\uB2E4",
  "\uB9C8\uB2E4",
  "\uBC16\uC5D0",
  "\uB300\uB85C",
  // Pronouns (대명사)
  "\uB098",
  "\uB098\uB294",
  "\uB0B4\uAC00",
  "\uB098\uB97C",
  "\uB108",
  "\uC6B0\uB9AC",
  "\uC800",
  "\uC800\uD76C",
  "\uADF8",
  "\uADF8\uB140",
  "\uADF8\uB4E4",
  "\uC774\uAC83",
  "\uC800\uAC83",
  "\uADF8\uAC83",
  "\uC5EC\uAE30",
  "\uC800\uAE30",
  "\uAC70\uAE30",
  // Common verbs / auxiliaries (일반 동사/보조 동사)
  "\uC788\uB2E4",
  "\uC5C6\uB2E4",
  "\uD558\uB2E4",
  "\uB418\uB2E4",
  "\uC774\uB2E4",
  "\uC544\uB2C8\uB2E4",
  "\uBCF4\uB2E4",
  "\uC8FC\uB2E4",
  "\uC624\uB2E4",
  "\uAC00\uB2E4",
  // Nouns (의존 명사 / vague)
  "\uAC83",
  "\uAC70",
  "\uB4F1",
  "\uC218",
  "\uB54C",
  "\uACF3",
  "\uC911",
  "\uBD84",
  // Adverbs
  "\uC798",
  "\uB354",
  "\uB610",
  "\uB9E4\uC6B0",
  "\uC815\uB9D0",
  "\uC544\uC8FC",
  "\uB9CE\uC774",
  "\uB108\uBB34",
  "\uC880",
  // Conjunctions
  "\uADF8\uB9AC\uACE0",
  "\uD558\uC9C0\uB9CC",
  "\uADF8\uB798\uC11C",
  "\uADF8\uB7F0\uB370",
  "\uADF8\uB7EC\uB098",
  "\uB610\uB294",
  "\uADF8\uB7EC\uBA74",
  // Question words
  "\uC65C",
  "\uC5B4\uB5BB\uAC8C",
  "\uBB50",
  "\uC5B8\uC81C",
  "\uC5B4\uB514",
  "\uB204\uAD6C",
  "\uBB34\uC5C7",
  "\uC5B4\uB5A4",
  // Time (vague)
  "\uC5B4\uC81C",
  "\uC624\uB298",
  "\uB0B4\uC77C",
  "\uCD5C\uADFC",
  "\uC9C0\uAE08",
  "\uC544\uAE4C",
  "\uB098\uC911",
  "\uC804\uC5D0",
  // Request words
  "\uC81C\uBC1C",
  "\uBD80\uD0C1"
]);
var KO_TRAILING_PARTICLES = [
  "\uC5D0\uC11C",
  "\uC73C\uB85C",
  "\uC5D0\uAC8C",
  "\uD55C\uD14C",
  "\uCC98\uB7FC",
  "\uAC19\uC774",
  "\uBCF4\uB2E4",
  "\uAE4C\uC9C0",
  "\uBD80\uD130",
  "\uB9C8\uB2E4",
  "\uBC16\uC5D0",
  "\uB300\uB85C",
  "\uC740",
  "\uB294",
  "\uC774",
  "\uAC00",
  "\uC744",
  "\uB97C",
  "\uC758",
  "\uC5D0",
  "\uB85C",
  "\uC640",
  "\uACFC",
  "\uB3C4",
  "\uB9CC"
].toSorted((a, b) => b.length - a.length);
function stripKoreanTrailingParticle(token) {
  for (const particle of KO_TRAILING_PARTICLES) {
    if (token.length > particle.length && token.endsWith(particle)) {
      return token.slice(0, -particle.length);
    }
  }
  return null;
}
function isUsefulKoreanStem(stem) {
  if (/[\uac00-\ud7af]/.test(stem)) {
    return stem.length >= 2;
  }
  return /^[a-z0-9_]+$/i.test(stem);
}
var STOP_WORDS_JA = /* @__PURE__ */ new Set([
  // Pronouns and references
  "\u3053\u308C",
  "\u305D\u308C",
  "\u3042\u308C",
  "\u3053\u306E",
  "\u305D\u306E",
  "\u3042\u306E",
  "\u3053\u3053",
  "\u305D\u3053",
  "\u3042\u305D\u3053",
  // Common auxiliaries / vague verbs
  "\u3059\u308B",
  "\u3057\u305F",
  "\u3057\u3066",
  "\u3067\u3059",
  "\u307E\u3059",
  "\u3044\u308B",
  "\u3042\u308B",
  "\u306A\u308B",
  "\u3067\u304D\u308B",
  // Particles / connectors
  "\u306E",
  "\u3053\u3068",
  "\u3082\u306E",
  "\u305F\u3081",
  "\u305D\u3057\u3066",
  "\u3057\u304B\u3057",
  "\u307E\u305F",
  "\u3067\u3082",
  "\u304B\u3089",
  "\u307E\u3067",
  "\u3088\u308A",
  "\u3060\u3051",
  // Question words
  "\u306A\u305C",
  "\u3069\u3046",
  "\u4F55",
  "\u3044\u3064",
  "\u3069\u3053",
  "\u8AB0",
  "\u3069\u308C",
  // Time (vague)
  "\u6628\u65E5",
  "\u4ECA\u65E5",
  "\u660E\u65E5",
  "\u6700\u8FD1",
  "\u4ECA",
  "\u3055\u3063\u304D",
  "\u524D",
  "\u5F8C"
]);
var STOP_WORDS_ZH = /* @__PURE__ */ new Set([
  // Pronouns
  "\u6211",
  "\u6211\u4EEC",
  "\u4F60",
  "\u4F60\u4EEC",
  "\u4ED6",
  "\u5979",
  "\u5B83",
  "\u4ED6\u4EEC",
  "\u8FD9",
  "\u90A3",
  "\u8FD9\u4E2A",
  "\u90A3\u4E2A",
  "\u8FD9\u4E9B",
  "\u90A3\u4E9B",
  // Auxiliary words
  "\u7684",
  "\u4E86",
  "\u7740",
  "\u8FC7",
  "\u5F97",
  "\u5730",
  "\u5417",
  "\u5462",
  "\u5427",
  "\u554A",
  "\u5440",
  "\u561B",
  "\u5566",
  // Verbs (common, vague)
  "\u662F",
  "\u6709",
  "\u5728",
  "\u88AB",
  "\u628A",
  "\u7ED9",
  "\u8BA9",
  "\u7528",
  "\u5230",
  "\u53BB",
  "\u6765",
  "\u505A",
  "\u8BF4",
  "\u770B",
  "\u627E",
  "\u60F3",
  "\u8981",
  "\u80FD",
  "\u4F1A",
  "\u53EF\u4EE5",
  // Prepositions and conjunctions
  "\u548C",
  "\u4E0E",
  "\u6216",
  "\u4F46",
  "\u4F46\u662F",
  "\u56E0\u4E3A",
  "\u6240\u4EE5",
  "\u5982\u679C",
  "\u867D\u7136",
  "\u800C",
  "\u4E5F",
  "\u90FD",
  "\u5C31",
  "\u8FD8",
  "\u53C8",
  "\u518D",
  "\u624D",
  "\u53EA",
  // Time (vague)
  "\u4E4B\u524D",
  "\u4EE5\u524D",
  "\u4E4B\u540E",
  "\u4EE5\u540E",
  "\u521A\u624D",
  "\u73B0\u5728",
  "\u6628\u5929",
  "\u4ECA\u5929",
  "\u660E\u5929",
  "\u6700\u8FD1",
  // Vague references
  "\u4E1C\u897F",
  "\u4E8B\u60C5",
  "\u4E8B",
  "\u4EC0\u4E48",
  "\u54EA\u4E2A",
  "\u54EA\u4E9B",
  "\u600E\u4E48",
  "\u4E3A\u4EC0\u4E48",
  "\u591A\u5C11",
  // Question/request words
  "\u8BF7",
  "\u5E2E",
  "\u5E2E\u5FD9",
  "\u544A\u8BC9"
]);
function isQueryStopWordToken(token) {
  return STOP_WORDS_EN.has(token) || STOP_WORDS_ES.has(token) || STOP_WORDS_PT.has(token) || STOP_WORDS_AR.has(token) || STOP_WORDS_ZH.has(token) || STOP_WORDS_KO.has(token) || STOP_WORDS_JA.has(token);
}
function isValidKeyword(token) {
  if (!token || token.length === 0) {
    return false;
  }
  if (/^[a-zA-Z]+$/.test(token) && token.length < 3) {
    return false;
  }
  if (/^\d+$/.test(token)) {
    return false;
  }
  if (/^[\p{P}\p{S}]+$/u.test(token)) {
    return false;
  }
  return true;
}
function tokenize(text, opts) {
  const useTrigram = opts?.ftsTokenizer === "trigram";
  const tokens = [];
  const normalized = normalizeLowercaseStringOrEmpty(text);
  const segments = normalized.split(/[\s\p{P}]+/u).filter(Boolean);
  for (const segment of segments) {
    if (/[\u3040-\u30ff]/.test(segment)) {
      const jpParts = segment.match(/[a-z0-9_]+|[\u30a0-\u30ffー]+|[\u4e00-\u9fff]+|[\u3040-\u309f]{2,}/g) ?? [];
      for (const part of jpParts) {
        if (/^[\u4e00-\u9fff]+$/.test(part)) {
          tokens.push(part);
          if (!useTrigram) {
            for (let i = 0; i < part.length - 1; i++) {
              tokens.push(part.slice(i, i + 2));
            }
          }
        } else {
          tokens.push(part);
        }
      }
    } else if (/[\u4e00-\u9fff]/.test(segment)) {
      const chars = Array.from(segment).filter((c) => /[\u4e00-\u9fff]/.test(c));
      if (useTrigram) {
        const block = chars.join("");
        if (block.length > 0) {
          tokens.push(block);
        }
      } else {
        tokens.push(...chars);
        for (let i = 0; i < chars.length - 1; i++) {
          tokens.push(chars.slice(i, i + 2).join(""));
        }
      }
    } else if (/[\uac00-\ud7af\u3131-\u3163]/.test(segment)) {
      const stem = stripKoreanTrailingParticle(segment);
      const stemIsStopWord = stem !== null && STOP_WORDS_KO.has(stem);
      if (!STOP_WORDS_KO.has(segment) && !stemIsStopWord) {
        tokens.push(segment);
      }
      if (stem && !STOP_WORDS_KO.has(stem) && isUsefulKoreanStem(stem)) {
        tokens.push(stem);
      }
    } else {
      tokens.push(segment);
    }
  }
  return tokens;
}
function extractKeywords(query, opts) {
  const tokens = tokenize(query, opts);
  const keywords = [];
  const seen = /* @__PURE__ */ new Set();
  for (const token of tokens) {
    if (isQueryStopWordToken(token)) {
      continue;
    }
    if (!isValidKeyword(token)) {
      continue;
    }
    if (seen.has(token)) {
      continue;
    }
    seen.add(token);
    keywords.push(token);
  }
  return keywords;
}
export {
  extractKeywords,
  isQueryStopWordToken
};
