/**
 * Image pipeline (run with `npm run images`).
 *
 * 1. Screenshots
 *    Reads raw device screenshots from  content/screenshots/*.{png,jpg,jpeg}
 *    Writes optimized variants to        src/assets/screenshots/<name>-{w}.{webp,jpg}
 *    Widths are chosen for a phone mock that renders at ~260-340 CSS px (2x retina).
 *
 *    To add a new screenshot: drop the raw file in content/screenshots/, run
 *    `npm run images`, then reference it in src/config/screenshots.ts.
 *
 * 2. Favicons / touch icons
 *    Derived from the supplied app icon at src/assets/brand/prefix-icon.png.
 *    NOTE: the icon currently supplied is 79x82px. Sizes above that are upscaled
 *    and will look soft — replace prefix-icon.png with a 1024x1024 export and
 *    re-run this script.
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Quiet libvips' harmless CPU-feature warnings; must be set before sharp loads.
process.env.VIPS_WARNING ??= '0';
const { default: sharp } = await import('sharp');

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SRC_DIR = path.join(ROOT, 'content/screenshots');
const OUT_DIR = path.join(ROOT, 'src/assets/screenshots');
const ICON_SRC = path.join(ROOT, 'src/assets/brand/prefix-icon.png');
const PUBLIC_DIR = path.join(ROOT, 'public');

const WIDTHS = [320, 480, 720];

async function optimizeScreenshots() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const file of files) {
    const name = path.parse(file).name;
    const input = sharp(path.join(SRC_DIR, file));
    for (const w of WIDTHS) {
      await input
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(OUT_DIR, `${name}-${w}.webp`));
      await input
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(path.join(OUT_DIR, `${name}-${w}.jpg`));
    }
    const size = (await stat(path.join(SRC_DIR, file))).size;
    console.log(`screenshot  ${file} (${(size / 1024).toFixed(0)} KB) -> ${WIDTHS.join('/')}w webp+jpg`);
  }
}

async function buildIcons() {
  const meta = await sharp(ICON_SRC).metadata();
  const targets = [
    { file: 'favicon-32.png', size: 32 },
    { file: 'favicon-64.png', size: 64 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-192.png', size: 192 },
    { file: 'icon-512.png', size: 512 },
  ];
  for (const t of targets) {
    await sharp(ICON_SRC)
      .resize(t.size, t.size, { fit: 'cover', kernel: 'lanczos3' })
      .png()
      .toFile(path.join(PUBLIC_DIR, t.file));
    const note = t.size > (meta.width ?? 0) ? '  (upscaled — supply a larger icon)' : '';
    console.log(`icon        ${t.file} ${t.size}x${t.size}${note}`);
  }
}

await optimizeScreenshots();
await buildIcons();
console.log('done');
