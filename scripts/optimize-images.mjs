// Step 4 of `npm run build`: creates smaller WebP copies of the photos in the
// published site (dist/), e.g. photo-01.jpg → photo-01.w400.webp … photo-01.w2000.webp.
// The original files in public/ are never changed. Results are cached in
// node_modules/.cache so unchanged photos are not processed again.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeVariant } from './image-variant.mjs'
import { OPTIMIZED_FOLDERS, VARIANT_WIDTHS, isOptimizable, variantPath } from '../src/lib/image-variants.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const publicDir = path.join(root, 'public')
const cache = path.join(root, 'node_modules', '.cache', 'care-images')
const LARGE_FILE = 8 * 1024 * 1024

async function* walk(dir) {
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

let images = 0
let variants = 0
let inputBytes = 0
let outputBytes = 0

for (const folder of OPTIMIZED_FOLDERS) {
  for await (const file of walk(path.join(dist, folder))) {
    const webPath = `/${path.relative(dist, file).split(path.sep).join('/')}`
    if (!isOptimizable(webPath)) continue
    const source = await fs.stat(file)
    if (source.size > LARGE_FILE) {
      console.warn(`⚠ ${webPath} is ${(source.size / 1024 / 1024).toFixed(1)} MB — consider exporting it smaller (it still works).`)
    }
    images += 1
    inputBytes += source.size
    // Use the original in public/ (its date tells whether the cached copies are still current).
    const original = path.join(publicDir, ...webPath.split('/').filter(Boolean))
    const sourceFile = await fs.stat(original).then(() => original, () => file)
    for (const width of VARIANT_WIDTHS) {
      const relative = variantPath(webPath, width)
      const cached = path.join(cache, relative)
      await writeVariant(sourceFile, cached, width)
      const output = path.join(dist, relative)
      await fs.copyFile(cached, output)
      outputBytes += (await fs.stat(output)).size
      variants += 1
    }
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
console.log(
  images
    ? `✓ Optimised ${images} photo(s) → ${variants} responsive WebP files (originals ${mb(inputBytes)}, all sizes ${mb(outputBytes)})`
    : '✓ No photos to optimise yet',
)
