// Creates one resized WebP copy of a photo. Shared by the build
// (scripts/optimize-images.mjs) and the local preview (scripts/content-plugin.mjs),
// so `npm run dev` shows photos exactly as the published site does.

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

/**
 * Writes `targetFile` unless a copy made from this exact original already exists.
 * A small note next to each copy (`….src`) records the original's size and date. Any difference
 * means the photo was replaced, even by an older file (Windows keeps a copied file's original
 * date, so "is the original newer?" is not enough).
 */
export async function writeVariant(sourceFile, targetFile, width) {
  const source = await fs.stat(sourceFile)
  const stamp = `${source.size}:${Math.round(source.mtimeMs)}`
  const stampFile = `${targetFile}.src`
  try {
    if ((await fs.readFile(stampFile, 'utf8')) === stamp) {
      await fs.access(targetFile)
      return
    }
  } catch {
    // no copy yet, or made by an older version of this script
  }
  await fs.mkdir(path.dirname(targetFile), { recursive: true })
  await sharp(sourceFile).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(targetFile)
  await fs.writeFile(stampFile, stamp)
}
