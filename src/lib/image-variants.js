// Shared by the website (src/components/media/SmartImage.jsx) and the build
// script (scripts/optimize-images.mjs), so both always agree on file names.
//
// During `npm run build`, every JPG/PNG/WebP photo in the folders below gets
// resized WebP copies next to it, e.g.
//   /images/events/2026/workshop/photo-01.jpg
//   → /images/events/2026/workshop/photo-01.w800.webp
// Browsers then download only the size they need. Logos are never touched.

export const VARIANT_WIDTHS = [400, 800, 1200, 2000]

export const OPTIMIZED_FOLDERS = [
  '/images/events/',
  '/images/people/',
  '/images/homepage/',
]

const RASTER = /\.(jpe?g|png|webp)$/i
const VARIANT = /\.w\d+\.webp$/i

export function isOptimizable(path) {
  return (
    typeof path === 'string' &&
    RASTER.test(path) &&
    !VARIANT.test(path) &&
    OPTIMIZED_FOLDERS.some((folder) => path.startsWith(folder))
  )
}

export function variantPath(path, width) {
  return `${path.replace(/\.[^./]+$/, '')}.w${width}.webp`
}
