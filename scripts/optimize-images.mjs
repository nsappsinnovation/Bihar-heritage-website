// One-off: convert PNG/JPG imported from src/ to WebP, rewrite imports,
// and move originals (plus unreferenced images) to ../_originals/.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const BACKUP = path.resolve(ROOT, "..", "_originals");
const IMG = /\.(png|jpe?g)$/i;
const SPEC = /((?:from|import\()\s*["'])([^"']+\.(?:png|jpe?g))(["'])/gi;
const CSS_URL = /(url\(\s*["']?)([^"')]+\.(?:png|jpe?g))(["']?\s*\))/gi;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

const files = walk(SRC);
const code = files.filter((f) => /\.(jsx?|css)$/.test(f));
const converted = new Map();
let before = 0, after = 0;

async function toWebp(abs) {
  if (converted.has(abs)) return converted.get(abs);
  const out = abs.replace(IMG, ".webp");
  const maxW = /logo/i.test(path.basename(abs)) ? 400 : 1600;
  await sharp(abs)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(out);
  before += fs.statSync(abs).size;
  after += fs.statSync(out).size;
  converted.set(abs, out);
  return out;
}

for (const file of code) {
  let text = fs.readFileSync(file, "utf8");
  const re = file.endsWith(".css") ? CSS_URL : SPEC;
  const jobs = [];
  text.replace(re, (_m, _a, spec) => {
    if (spec.startsWith(".")) jobs.push(spec);
    return _m;
  });
  if (!jobs.length) continue;
  for (const spec of jobs) {
    const abs = path.resolve(path.dirname(file), spec);
    if (fs.existsSync(abs)) await toWebp(abs);
    else console.warn("missing:", path.relative(ROOT, file), spec);
  }
  text = text.replace(re, (m, a, spec, b) => {
    const abs = path.resolve(path.dirname(file), spec);
    return converted.has(abs) ? a + spec.replace(IMG, ".webp") + b : m;
  });
  fs.writeFileSync(file, text);
}

// Move every remaining PNG/JPG in src (converted originals + unreferenced) out of src.
let moved = 0;
for (const f of files.filter((f) => IMG.test(f))) {
  const dest = path.join(BACKUP, path.relative(ROOT, f));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(f, dest);
  moved++;
}

const mb = (n) => (n / 1048576).toFixed(1) + " MB";
console.log(`converted ${converted.size}: ${mb(before)} -> ${mb(after)}; moved ${moved} originals to ${BACKUP}`);
