import manifest from '../assets/media/manifest.json';

/*
  Media lives in src/assets (not public/) so Vite content-hashes every file.
  Hashed names are what make a one-year immutable cache header safe: swap a
  photo, the hash changes, and nobody serves a stale one.

  `npm run optimize:media` writes `{name}-{width}.webp` for each source, so
  the width descriptors below are the real pixel widths, not assumptions.
*/
const files = import.meta.glob('../assets/media/*.webp', { eager: true, import: 'default' });

const variants = {};
for (const [path, url] of Object.entries(files)) {
  const match = path.split('/').pop().match(/^(.+)-(\d+)\.webp$/);
  if (!match) continue; // hero-poster.webp carries no width suffix
  const [, name, width] = match;
  (variants[name] ||= []).push({ width: Number(width), url });
}
for (const list of Object.values(variants)) list.sort((a, b) => a.width - b.width);

/* Returns the src/srcSet/intrinsic-size triple for one image name. */
export const img = (name) => {
  const list = variants[name];
  if (!list?.length) {
    throw new Error(`Unknown image "${name}" — run \`npm run optimize:media\`.`);
  }
  const { width, height } = manifest[name] ?? {};
  return {
    src: list[list.length - 1].url,
    srcSet: list.map((v) => `${v.url} ${v.width}w`).join(', '),
    width,
    height,
  };
};
