// packages/markdown-core/src/html-tags.ts
import { HTML_TAG_RE } from "markdown-it/lib/common/html_re.mjs";
function htmlTagName(rawTag, closing) {
  let end = closing ? 2 : 1;
  while (end < rawTag.length) {
    const code = rawTag.charCodeAt(end);
    const isAsciiLetter = code >= 65 && code <= 90 || code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;
    if (!isAsciiLetter && !isDigit && code !== 45) {
      break;
    }
    end += 1;
  }
  return rawTag.slice(closing ? 2 : 1, end).toLowerCase();
}
function* tokenizeHtmlTags(html) {
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf("<", cursor);
    if (start < 0) {
      return;
    }
    const match = HTML_TAG_RE.exec(html.slice(start));
    if (!match) {
      cursor = start + 1;
      continue;
    }
    const raw = match[0];
    const closing = raw.startsWith("</");
    const end = start + raw.length;
    const name = htmlTagName(raw, closing);
    if (!name) {
      cursor = end;
      continue;
    }
    yield {
      raw,
      start,
      end,
      name,
      closing,
      selfClosing: !closing && raw.trimEnd().endsWith("/>")
    };
    cursor = end;
  }
}
export {
  tokenizeHtmlTags
};
