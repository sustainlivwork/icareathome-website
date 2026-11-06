// Step 3 of `npm run build`: writes a complete HTML file for every page
// (dist/about/index.html, dist/events/<event>/index.html, dist/404.html, …),
// so every address works when opened directly on GitHub Pages.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isOptimizable, variantPath } from '../src/lib/image-variants.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, getStaticPaths, site, fullTitle, base } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const SITE_URL = site.url.replace(/\/$/, '')
const BASE = base.replace(/\/$/, '')
const LEGACY_PAGES = {
  home: '/',
  about: '/about/',
  objectives: '/objectives/',
  wps: '/work-packages/',
  consortium: '/consortium/',
  contact: '/contact/',
  events: '/events/',
}

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function imageUrl(src) {
  if (!src) return ''
  if (/^https?:\/\//.test(src)) return src
  const file = isOptimizable(src) ? variantPath(src, 1200) : src
  return SITE_URL + BASE + encodeURI(file)
}

function headTags(meta, urlPath) {
  const title = fullTitle(meta.title)
  const description = meta.description || site.description
  const canonical = urlPath ? SITE_URL + BASE + urlPath : ''
  const image = imageUrl(meta.image)
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    canonical && `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    meta.noindex && '<meta name="robots" content="noindex" />',
    `<meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    canonical && `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    image && `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

// Fonts needed for the first view of every page.
const assetFiles = await fs.readdir(path.join(dist, 'assets'))
const fontPreloads = assetFiles
  .filter((file) => /^(inter|plus-jakarta-sans)-latin-wght-normal-.*\.woff2$/.test(file))
  .map((file) => `<link rel="preload" href="${BASE}/assets/${file}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-start-->')) {
  throw new Error('dist/index.html is missing the <!--app-html--> or <!--app-head-start--> markers.')
}

function page(urlPath, renderPath = urlPath) {
  const { html, meta } = render(renderPath)
  return template
    .replace(/<!--app-head-start-->[\s\S]*?<!--app-head-end-->/, `${headTags(meta, urlPath)}\n    ${fontPreloads}`)
    .replace('<!--app-html-->', html)
}

async function write(relativeFile, content) {
  const file = path.join(dist, relativeFile)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content)
}

// 1. Pages
const paths = getStaticPaths()
for (const urlPath of paths) {
  await write(path.join(urlPath, 'index.html'), page(urlPath))
}
await write('404.html', page(null, '/404.html'))

// 2. Old fragment files (pages/about.html …) of the previous site → new addresses.
for (const [name, target] of Object.entries(LEGACY_PAGES)) {
  const url = BASE + target
  await write(
    `pages/${name}.html`,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(site.name)}</title>` +
      `<meta name="robots" content="noindex"><link rel="canonical" href="${SITE_URL + url}">` +
      `<meta http-equiv="refresh" content="0; url=${url}"><script>location.replace(${JSON.stringify(url)})</script>` +
      `</head><body><p><a href="${url}">${escapeHtml(site.name)}</a></p></body></html>\n`,
  )
}

// 3. Search engines
await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((urlPath) => `  <url><loc>${escapeHtml(SITE_URL + BASE + urlPath)}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
)
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL + BASE}/sitemap.xml\n`)

// 4. Clean up the temporary server build.
await fs.rm(ssrDir, { recursive: true, force: true })

console.log(`✓ Pre-rendered ${paths.length} pages + 404.html, legacy redirects, sitemap.xml and robots.txt`)
