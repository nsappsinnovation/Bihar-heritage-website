// One-off: download every remote image/audio file referenced from src/ into
// public/, convert images to WebP, and rewrite the references to the local copy.
// Result: the site loads no assets from third-party hosts.
//
//   node scripts/localize-assets.mjs --dry   # list what would be downloaded
//   node scripts/localize-assets.mjs         # download + rewrite
//
// Links (Wikipedia articles, YouTube watch/embed URLs, map links) are NOT touched.
// URLs that cannot be fetched are pointed at the placeholder image and listed.
// docs/image-sources.json records where each local file came from.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const IMG_OUT = path.join(ROOT, "public", "images", "remote");
const AUDIO_OUT = path.join(ROOT, "public", "audio");
const SOURCES_FILE = path.join(ROOT, "docs", "image-sources.json");
const PLACEHOLDER = "/images/heritage-placeholder.svg";
const DRY = process.argv.includes("--dry");
const UA = "BiharHeritageAssetMirror/1.0 (one-off static site asset download)";

const URL_RE = /https?:\/\/[^\s"'`\\<>]+/g;
const IMG_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const AUDIO_EXT = /\.mp3$/i;
const IMAGE_HOSTS = [
  /(^|\.)unsplash\.com$/, /(^|\.)cloudinary\.com$/, /^firebasestorage\.googleapis\.com$/,
  /^encrypted-tbn\d\.gstatic\.com$/, /^tse\d\.(mm|explicit)\.bing\.net$/, /^i\.ytimg\.com$/,
  /^img\.youtube\.com$/, /^picsum\.photos$/, /^via\.placeholder\.com$/, /^s7ap1\.scene7\.com$/,
  /^lh3\.googleusercontent\.com$/, /^blogger\.googleusercontent\.com$/,
  /^static\.toiimg\.com$/, /^pbs\.twimg\.com$/,
];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

const files = walk(SRC).filter((f) => /\.(jsx?|json)$/.test(f));

const classify = (raw) => {
  if (raw.includes("${")) return "dynamic";
  let u;
  try {
    u = new URL(raw);
  } catch {
    return "other";
  }
  if (AUDIO_EXT.test(u.pathname)) return "audio";
  if (IMG_EXT.test(u.pathname)) return "image";
  if (/wikimedia\.org$/.test(u.hostname) && u.pathname.includes("Special:FilePath")) return "image";
  if (IMAGE_HOSTS.some((re) => re.test(u.hostname))) return "image";
  return "other";
};

// 1. Collect
const found = { image: new Set(), audio: new Set(), dynamic: new Set(), other: new Map() };
for (const f of files) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(URL_RE)) {
    const kind = classify(m[0]);
    if (kind === "other") {
      const host = new URL(m[0]).hostname;
      found.other.set(host, (found.other.get(host) || 0) + 1);
    } else found[kind].add(m[0]);
  }
}
console.log(`images: ${found.image.size}, audio: ${found.audio.size}, dynamic (skipped): ${found.dynamic.size}`);
console.log("untouched link hosts:", [...found.other].map(([h, n]) => `${h}(${n})`).join(", "));
for (const d of found.dynamic) console.log("  dynamic:", d);
if (DRY) process.exit(0);

// 2. Download
fs.mkdirSync(IMG_OUT, { recursive: true });
fs.mkdirSync(AUDIO_OUT, { recursive: true });
fs.mkdirSync(path.dirname(SOURCES_FILE), { recursive: true });

const slugOf = (raw) => {
  const u = new URL(raw);
  const base = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || "file")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const hash = crypto.createHash("sha1").update(raw).digest("hex").slice(0, 8);
  return `${base || "file"}-${hash}`;
};

// Politeness: two requests per host at a time; the Wikimedia hosts share ONE slot
// with a pause between requests (they rate-limit hard).
const hostKey = (host) => (/wikimedia\.org$/.test(host) ? "wikimedia" : host);
const hostQueues = new Map();
const throttled = new Map(); // host key -> consecutive 429 count
const withHostLimit = async (host, fn) => {
  const key = hostKey(host);
  const limit = key === "wikimedia" ? 1 : 2;
  const q = hostQueues.get(key) || { active: 0, waiters: [] };
  hostQueues.set(key, q);
  while (q.active >= limit) await new Promise((r) => q.waiters.push(r));
  q.active += 1;
  try {
    return await fn();
  } finally {
    if (key === "wikimedia") await new Promise((r) => setTimeout(r, 3000));
    q.active -= 1;
    q.waiters.shift()?.();
  }
};

const fetchBuffer = async (raw) => {
  const key = hostKey(new URL(raw).hostname);
  if ((throttled.get(key) || 0) >= 3) return { error: "HTTP 429 (skipped: host is throttling us, retry later)" };
  let lastErr;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const res = await fetch(raw, {
        headers: {
          "User-Agent": UA,
          Accept: "image/*,audio/*,*/*;q=0.5",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(60000),
      });
      if (res.status === 429) {
        throttled.set(key, (throttled.get(key) || 0) + 1);
        if ((throttled.get(key) || 0) >= 3) return { error: "HTTP 429 (host is throttling us, retry later)" };
      } else throttled.set(key, 0);
      if (res.status === 429 || res.status >= 500) {
        const wait = Number(res.headers.get("retry-after")) || 8 * attempt;
        lastErr = new Error(`HTTP ${res.status}`);
        await new Promise((r) => setTimeout(r, Math.min(wait, 60) * 1000));
        continue;
      }
      if (!res.ok) return { error: `HTTP ${res.status}` }; // other 4xx: permanent, do not retry
      return { buf: Buffer.from(await res.arrayBuffer()), type: res.headers.get("content-type") || "" };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  return { error: String(lastErr?.message || lastErr) };
};

const map = new Map(); // remote url -> local path
const sources = [];
const failed = [];
let bytesIn = 0;
let bytesOut = 0;

const doImage = async (raw) => {
  const name = `${slugOf(raw)}.webp`;
  const out = path.join(IMG_OUT, name);
  const local = `/images/remote/${name}`;
  if (fs.existsSync(out)) {
    map.set(raw, local);
    sources.push({ local, source: raw });
    return;
  }
  const { buf, type, error } = await withHostLimit(new URL(raw).hostname, () => fetchBuffer(raw));
  if (error) return failed.push({ url: raw, reason: error });
  if (!/^image\//i.test(type) && !/\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(raw)) {
    return failed.push({ url: raw, reason: `not an image (${type})` });
  }
  try {
    const info = await sharp(buf, { animated: false })
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(out);
    bytesIn += buf.length;
    bytesOut += info.size;
    map.set(raw, local);
    sources.push({ local, source: raw });
  } catch (e) {
    failed.push({ url: raw, reason: `cannot decode: ${e.message}` });
  }
};

const doAudio = async (raw) => {
  const name = `${slugOf(raw)}.mp3`;
  const out = path.join(AUDIO_OUT, name);
  const local = `/audio/${name}`;
  if (!fs.existsSync(out)) {
    const { buf, error } = await withHostLimit(new URL(raw).hostname, () => fetchBuffer(raw));
    if (error) return failed.push({ url: raw, reason: error });
    fs.writeFileSync(out, buf);
  }
  map.set(raw, local);
  sources.push({ local, source: raw });
};

const jobs = [...found.image].map((u) => () => doImage(u)).concat([...found.audio].map((u) => () => doAudio(u)));
let next = 0;
let done = 0;
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (next < jobs.length) {
      await jobs[next++]();
      done += 1;
      if (done % 25 === 0) console.log(`  ${done}/${jobs.length}`);
    }
  })
);

// 3. Rewrite references. Only PERMANENT failures (404/403/undecodable) become the
// placeholder; transient ones (rate limit, timeout) keep their URL so a rerun can retry.
const isTransient = (reason) => /HTTP (429|5\d\d)|timeout|fetch failed|aborted/i.test(reason);
for (const f of failed) if (found.image.has(f.url) && !isTransient(f.reason)) map.set(f.url, PLACEHOLDER);
let rewritten = 0;
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  const s2 = s.replace(URL_RE, (m) => map.get(m) ?? m);
  if (s2 !== s) {
    fs.writeFileSync(f, s2);
    rewritten += 1;
  }
}

// Merge with the record from earlier runs (already-localised URLs are no longer in src/).
let previous = { sources: [], failed: [] };
try {
  previous = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"));
} catch {
  /* first run */
}
const bySource = new Map(previous.sources.map((x) => [x.local, x]));
for (const x of sources) bySource.set(x.local, x);
const allSources = [...bySource.values()].sort((a, b) => a.local.localeCompare(b.local));
const stillFailing = new Map(previous.failed.map((x) => [x.url, x]));
for (const x of sources) stillFailing.delete(x.source); // fetched successfully this run
for (const f of failed) stillFailing.set(f.url, f);
const allFailed = [...stillFailing.values()];
fs.writeFileSync(
  SOURCES_FILE,
  JSON.stringify({ generated: new Date().toISOString(), sources: allSources, failed: allFailed }, null, 2) + "\n"
);
const retryable = failed.filter((f) => isTransient(f.reason));
console.log(`\nthis run: downloaded ${sources.length}, failed ${failed.length} (${retryable.length} retryable), files rewritten ${rewritten}`);
console.log(`images: ${(bytesIn / 1e6).toFixed(1)} MB -> ${(bytesOut / 1e6).toFixed(1)} MB`);
for (const f of failed) console.log(`  FAILED ${f.reason}  ${f.url}`);
if (retryable.length) console.log("\nSome failures were temporary — run the script again to retry them.");
