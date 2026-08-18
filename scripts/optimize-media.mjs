/**
 * Media pipeline — run with `npm run optimize:media`.
 *
 * Reads the untouched originals from `media-src/` and emits web-ready
 * derivatives into `src/assets/media/`, where Vite content-hashes them so
 * they can be served `immutable` for a year.
 *
 * Originals are never modified. Re-running is idempotent.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SRC = 'media-src';
const OUT = 'src/assets/media';

/* Every source photo, deduplicated. The originals shipped seven
   byte-identical pairs under two directories; each survives once here. */
const PHOTOS = [
  { out: 'coach-portrait',  src: 'coach-portrait.jpg'  },
  { out: 'dumbbell-rack',   src: 'dumbbell-rack.jpg'   },
  { out: 'tire-flip',       src: 'tire-flip.jpg'       },
  { out: 'trainer-session', src: 'trainer-session.jpg' },
  { out: 'treadmill',       src: 'treadmill.jpg'       },
  { out: 'dumbbells-mat',   src: 'dumbbells-mat.jpg'   },
  { out: 'trainer-pullup',  src: 'trainer-pullup.jpg'  },
];

/* Before/after pairs. Source is 768x1376 and displays at ~330px wide,
   so two variants cover every viewport at 2x. */
const CLIENTS = [
  { out: 'client-1-before', src: 'client-1-before.png' },
  { out: 'client-1-after',  src: 'client-1-after.png'  },
  { out: 'client-2-before', src: 'client-2-before.png' },
  { out: 'client-2-after',  src: 'client-2-after.png'  },
  { out: 'client-3-before', src: 'client-3-before.png' },
  { out: 'client-3-after',  src: 'client-3-after.png'  },
];

/* Review avatars — 52px circles, so 104w covers a 2x display. */
const AVATARS = [
  { out: 'avatar-1', src: 'avatar-1.jpg' },
  { out: 'avatar-2', src: 'avatar-2.jpg' },
  { out: 'avatar-3', src: 'avatar-3.jpg' },
  { out: 'avatar-4', src: 'avatar-4.jpg' },
];

const PHOTO_WIDTHS = [640, 1280, 1920];
const CLIENT_WIDTHS = [384, 768];
const AVATAR_WIDTHS = [104, 156];

/* Every photo sits behind a brightness filter between 0.25 and 0.72 and a
   gradient overlay, so quality below the usual threshold is invisible. */
const WEBP = { quality: 72, effort: 6 };

const manifest = {};
let totalIn = 0;
let totalOut = 0;

async function emit({ out, src }, widths) {
  const input = join(SRC, src);
  const image = sharp(input);
  const meta = await image.metadata();
  const srcBytes = statSync(input).size;
  totalIn += srcBytes;

  const variants = [];
  for (const target of widths) {
    /* Cap height too: one source is 5304x7952, and a plain width cap would
       leave a 2878px-tall file behind a 370px-tall card. */
    const buf = await sharp(input)
      .resize({ width: target, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp(WEBP)
      .toBuffer({ resolveWithObject: true });

    const { width, height } = buf.info;
    // A height cap makes portrait sources converge: 1280 and 1920 both land
    // near 1280w. Emitting both would ship the same picture twice.
    if (variants.some((v) => Math.abs(v.width - width) / width < 0.05)) continue;
    writeFileSync(join(OUT, `${out}-${width}.webp`), buf.data);
    variants.push({ width, height, bytes: buf.data.length });
    totalOut += buf.data.length;
  }

  const largest = variants[variants.length - 1];
  manifest[out] = { width: largest.width, height: largest.height };
  const saved = ((srcBytes - variants.reduce((a, v) => a + v.bytes, 0)) / 1048576).toFixed(2);
  console.log(
    `  ${out.padEnd(16)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)}` +
      ` ${(srcBytes / 1048576).toFixed(2).padStart(6)} MB -> ` +
      variants.map((v) => `${v.width}w ${(v.bytes / 1024).toFixed(0)}KB`).join(', ') +
      `  (saved ${saved} MB)`
  );
}

/*
  Social preview image. Goes to public/ at a stable, unhashed path: scrapers
  cache by URL and never run the JS that would resolve a hashed one.
*/
async function ogImage() {
  const out = 'public/og-image.jpg';
  await sharp(join(SRC, 'coach-portrait.jpg'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .modulate({ brightness: 0.72 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(`  og-image        1200x630   ${(statSync(out).size / 1024).toFixed(0)} KB -> ${out}`);
}

function ff(args) {
  execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
}

function video() {
  const input = join(SRC, 'hero-loop.mp4');
  /* The 20.5s master is 27.7 Mbps of near-lossless 1080p. Seconds 2-10 hold
     the strongest movement; the clip loops, so it only needs eight of them. */
  const trim = ['-ss', '2', '-t', '8', '-i', input, '-an'];

  console.log('  hero-loop        1920x1080 20.6s 27.7 Mbps ->');

  ff([...trim, '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-profile:v', 'high',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vf', 'scale=1920:-2',
      join(OUT, 'hero-loop.mp4')]);

  ff([...trim, '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1',
      '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-vf', 'scale=1920:-2',
      join(OUT, 'hero-loop.webm')]);

  /* Poster: the browser paints this instantly while the video buffers, and
     it is what a reduced-motion or data-saver visitor sees instead. */
  ff(['-ss', '2', '-i', input, '-frames:v', '1', '-vf', 'scale=1920:-2',
      '-c:v', 'libwebp', '-quality', '70', join(OUT, 'hero-poster.webp')]);
}

console.log('\nPhotos');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const p of PHOTOS) await emit(p, PHOTO_WIDTHS);

console.log('\nClient before/after');
for (const c of CLIENTS) await emit(c, CLIENT_WIDTHS);

console.log('');
console.log('Review avatars');
for (const a of AVATARS) await emit(a, AVATAR_WIDTHS);

console.log('\nVideo');
video();

console.log('');
console.log('Social preview');
await ogImage();

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

const savedMb = ((totalIn - totalOut) / 1048576).toFixed(1);
console.log(`
Wrote ${readdirSync(OUT).length} files to ${OUT}`);
console.log(`Images: ${(totalIn / 1048576).toFixed(1)} MB in -> ${(totalOut / 1048576).toFixed(2)} MB out (saved ${savedMb} MB)
`);
