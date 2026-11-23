/**
 * URL safety helpers for values that come from editable content (CMS fields,
 * localStorage) and end up in `href` / iframe `src`.
 *
 * Both helpers return the original string untouched when it is safe, so
 * existing valid links keep working. When it is not safe, safeHref returns
 * undefined (the anchor renders without an href and does nothing) and
 * safeEmbedUrl returns an empty string.
 */

// Strip whitespace/control characters browsers ignore inside a scheme
// ("java\nscript:" must not slip through).
const normalise = (value) =>
  Array.from(String(value))
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 0x20 && (code < 0x7f || code > 0x9f);
    })
    .join("");

const SCHEME = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;

/**
 * For `<a href>`. Allows http(s), relative paths, blob: and uploaded PDFs
 * (`data:application/pdf`). Blocks javascript:, vbscript:, other data: URLs, etc.
 */
export const safeHref = (value) => {
  if (typeof value !== "string" || !value) return undefined;

  // Only the start matters for scheme detection (uploaded PDFs are multi-MB data: URLs).
  const probe = normalise(value.slice(0, 256));
  const match = probe.match(SCHEME);
  if (!match) return value; // relative URL, "#anchor", "/path"

  const scheme = match[1].toLowerCase();
  if (scheme === "http" || scheme === "https" || scheme === "blob") return value;
  if (scheme === "data" && /^data:application\/pdf[;,]/i.test(probe)) return value;
  return undefined;
};

const EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
]);

/** For video `<iframe src>`. Only https YouTube embed URLs are allowed. */
export const safeEmbedUrl = (value) => {
  if (typeof value !== "string" || !value) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol === "https:" && EMBED_HOSTS.has(url.hostname) && url.pathname.startsWith("/embed/")) {
      return value;
    }
  } catch {
    /* not a valid absolute URL */
  }
  return "";
};
