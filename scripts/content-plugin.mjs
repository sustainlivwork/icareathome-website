// Vite plugin that turns the Markdown files in src/content/events/ into data
// for the website (`import events from 'virtual:events'`).
//
// It also checks all content for mistakes (missing fields, wrong dates,
// image paths that do not exist) and prints clear messages. A broken event
// stops `npm run build`; during `npm run dev` it is skipped with a warning.

import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { Marked } from 'marked'
import { VARIANT_WIDTHS, isOptimizable, variantPath } from '../src/lib/image-variants.js'

const VIRTUAL_ID = 'virtual:events'
const RESOLVED_ID = '\0virtual:events'

const EVENTS_DIR = 'src/content/events'
const PUBLIC_DIR = 'public'
const IMAGE_FILE = /\.(jpe?g|png|webp|svg|avif|gif)$/i
const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/
const PLACEHOLDER = /lorem ipsum/i
const SLUG_FORMAT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const EVENT_FIELDS = new Set([
  'title', 'date', 'endDate', 'location', 'slug', 'summary', 'tags', 'draft',
  'coverImage', 'coverAlt', 'gallery', 'galleryFolder', 'links', 'attachments',
])
const PERSON_FIELDS = new Set([
  'id', 'name', 'role', 'institution', 'email', 'phone', 'note',
  'photo', 'photoPosition', 'profileUrl', 'bio',
])
const PARTNER_FIELDS = new Set([
  'id', 'name', 'country', 'role', 'coordinator', 'logo', 'logoScale', 'url',
])

// ── Markdown ──────────────────────────────────────────────────────────────────

const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const isExternal = (href) => /^https?:\/\//i.test(href)

const markdown = new Marked({
  gfm: true,
  renderer: {
    // The event title is the page's only <h1>, so "#" and "##" both become <h2>.
    heading({ tokens, depth }) {
      const level = Math.min(Math.max(depth, 2), 6)
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens)
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
      const external = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeAttr(href)}"${titleAttr}${external}>${text}</a>`
    },
    image({ href, title, text }) {
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
      return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}"${titleAttr} loading="lazy" decoding="async">`
    },
  },
})

function firstParagraphText(body) {
  const block = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .find((part) => part && !/^(#|!\[|[-*+] |\d+\. |>|```)/.test(part))
  if (!block) return ''
  return block
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function splitFrontmatter(source) {
  const match = source.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/)
  if (!match) return null
  return { data: match[1], body: match[2] }
}

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10)
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!DATE_FORMAT.test(text)) return null
  const [y, m, d] = text.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? text : null
}

function publicFileExists(root, webPath) {
  if (typeof webPath !== 'string' || !webPath.startsWith('/')) return false
  return fs.existsSync(path.join(root, PUBLIC_DIR, decodeURI(webPath)))
}

const isLocalPath = (value) => typeof value === 'string' && value.startsWith('/')
const isText = (value) => typeof value === 'string' && value.trim() !== ''
const optionalText = (value) => (isText(value) ? value.trim() : '')

// ── Events ────────────────────────────────────────────────────────────────────

function readEvent(root, file, problems) {
  const name = path.basename(file)
  const where = `${EVENTS_DIR}/${name}`
  const error = (message) => problems.errors.push(`${where}: ${message}`)
  const warn = (message) => problems.warnings.push(`${where}: ${message}`)

  const parts = splitFrontmatter(fs.readFileSync(file, 'utf8'))
  if (!parts) {
    error('the file must start with a "---" line, then the fields, then another "---" line.')
    return null
  }

  let data
  try {
    data = parseYaml(parts.data) ?? {}
  } catch (cause) {
    error(`the fields between the "---" lines could not be read (${cause.message.split('\n')[0]}). Check quotes and indentation.`)
    return null
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    error('the fields between the "---" lines must be written as "name: value".')
    return null
  }

  const errorCount = problems.errors.length

  for (const key of Object.keys(data)) {
    if (!EVENT_FIELDS.has(key)) warn(`unknown field "${key}" is ignored (check the spelling — field names are case-sensitive).`)
  }

  if (!isText(data.title)) error('"title" is required.')

  const date = normalizeDate(data.date)
  if (!date) error(`"date" is required and must be a real date written as YYYY-MM-DD (found: ${JSON.stringify(data.date ?? null)}).`)

  let endDate = ''
  if (data.endDate != null && data.endDate !== '') {
    endDate = normalizeDate(data.endDate)
    if (!endDate) error(`"endDate" must be a real date written as YYYY-MM-DD (found: ${JSON.stringify(data.endDate)}).`)
    else if (date && endDate < date) error('"endDate" is earlier than "date".')
    else if (endDate === date) endDate = ''
  }

  const slug = isText(data.slug) ? data.slug.trim() : name.replace(/\.md$/i, '')
  if (!SLUG_FORMAT.test(slug)) {
    error(`the web address "${slug}" may only contain lowercase letters, numbers and single hyphens. Rename the file (or set "slug").`)
  }

  const tags = data.tags == null ? [] : (Array.isArray(data.tags) ? data.tags : [data.tags])
  if (tags.some((tag) => !isText(tag))) error('"tags" must be a list of short texts.')

  const checkImage = (webPath, field) => {
    if (!isLocalPath(webPath)) {
      error(`"${field}" must be a path starting with "/images/…" (found: ${JSON.stringify(webPath)}).`)
      return false
    }
    if (!publicFileExists(root, webPath)) warn(`"${field}" points to ${webPath}, but that file does not exist in public/. A placeholder will be shown.`)
    return true
  }

  let coverImage = ''
  if (isText(data.coverImage)) {
    if (checkImage(data.coverImage.trim(), 'coverImage')) coverImage = data.coverImage.trim()
  }

  const title = optionalText(data.title)
  const gallery = []
  if (data.gallery != null) {
    if (!Array.isArray(data.gallery)) {
      error('"gallery" must be a list (each line starting with "- ").')
    } else {
      data.gallery.forEach((item, index) => {
        const entry = typeof item === 'string' ? { src: item } : item
        if (!entry || !isText(entry.src)) {
          error(`gallery item ${index + 1} needs a "src" path.`)
          return
        }
        if (!checkImage(entry.src.trim(), `gallery item ${index + 1}`)) return
        gallery.push({ src: entry.src.trim(), alt: optionalText(entry.alt), caption: optionalText(entry.caption) })
      })
    }
  }
  if (isText(data.galleryFolder) && gallery.length === 0) {
    const folder = data.galleryFolder.trim().replace(/\/?$/, '/')
    const dir = path.join(root, PUBLIC_DIR, decodeURI(folder))
    if (!folder.startsWith('/') || !fs.existsSync(dir)) {
      warn(`"galleryFolder" ${folder} does not exist in public/. No gallery is shown.`)
    } else {
      fs.readdirSync(dir)
        .filter((file) => IMAGE_FILE.test(file) && !/^cover\./i.test(file) && !/\.w\d+\.webp$/i.test(file))
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
        .forEach((file) => gallery.push({ src: folder + file, alt: '', caption: '' }))
    }
  } else if (isText(data.galleryFolder)) {
    warn('both "gallery" and "galleryFolder" are set — only the "gallery" list is used.')
  }
  gallery.forEach((photo, index) => {
    if (!photo.alt) photo.alt = `Photo ${index + 1} of ${gallery.length} from ${title || 'the event'}`
  })

  const links = []
  for (const [index, link] of (Array.isArray(data.links) ? data.links : []).entries()) {
    if (!link || !isText(link.url)) {
      error(`link ${index + 1} needs a "url".`)
      continue
    }
    links.push({ label: optionalText(link.label) || link.url.trim(), url: link.url.trim() })
  }
  if (data.links != null && !Array.isArray(data.links)) error('"links" must be a list (each item starting with "- ").')

  const attachments = []
  for (const [index, item] of (Array.isArray(data.attachments) ? data.attachments : []).entries()) {
    if (!item || !isText(item.file)) {
      error(`attachment ${index + 1} needs a "file" path.`)
      continue
    }
    const file = item.file.trim()
    if (isLocalPath(file) && !publicFileExists(root, file)) warn(`attachment ${file} does not exist in public/.`)
    const extension = (file.split('?')[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toUpperCase()
    attachments.push({ label: optionalText(item.label) || path.basename(file), file, type: extension })
  }
  if (data.attachments != null && !Array.isArray(data.attachments)) error('"attachments" must be a list (each item starting with "- ").')

  if (problems.errors.length > errorCount) return null

  const body = parts.body.trim()
  if (PLACEHOLDER.test(body) || PLACEHOLDER.test(String(data.summary ?? ''))) {
    warn('still contains placeholder text (Lorem ipsum) — replace it before publishing.')
  }
  return {
    slug,
    title,
    date,
    endDate,
    location: optionalText(data.location),
    summary: optionalText(data.summary) || firstParagraphText(body),
    tags: tags.map((tag) => tag.trim()),
    draft: data.draft === true,
    coverImage,
    coverAlt: optionalText(data.coverAlt),
    gallery,
    links,
    attachments,
    html: body ? markdown.parse(body) : '',
    source: where,
  }
}

export function loadEvents(root, { includeDrafts = false } = {}) {
  const problems = { errors: [], warnings: [] }
  const dir = path.join(root, EVENTS_DIR)
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => /\.md$/i.test(file) && !/^[_.]/.test(file))
    : []

  const events = []
  const slugs = new Map()
  for (const file of files) {
    const event = readEvent(root, path.join(dir, file), problems)
    if (!event) continue
    if (slugs.has(event.slug)) {
      problems.errors.push(`${event.source}: the web address "${event.slug}" is already used by ${slugs.get(event.slug)}.`)
      continue
    }
    slugs.set(event.slug, event.source)
    if (event.draft && !includeDrafts) continue
    events.push(event)
  }

  events.sort((a, b) =>
    b.date.localeCompare(a.date) || (b.endDate || b.date).localeCompare(a.endDate || a.date) || a.title.localeCompare(b.title),
  )
  return { events, ...problems }
}

// ── People & partners ─────────────────────────────────────────────────────────

function readJsonList(root, file, problems) {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
    if (Array.isArray(list)) return list
    problems.errors.push(`${file}: must contain a list ([ … ]).`)
  } catch (cause) {
    problems.errors.push(`${file}: could not be read — ${cause.message}. Check for missing commas or quotes.`)
  }
  return []
}

export function checkPeopleAndPartners(root) {
  const problems = { errors: [], warnings: [] }

  const people = readJsonList(root, 'src/content/people.json', problems)
  people.forEach((person, index) => {
    const where = `src/content/people.json (person ${index + 1}${person?.name ? `, ${person.name}` : ''})`
    if (!person || !isText(person.name)) problems.errors.push(`${where}: "name" is required.`)
    for (const key of Object.keys(person ?? {})) {
      if (!PERSON_FIELDS.has(key)) problems.warnings.push(`${where}: unknown field "${key}" is ignored.`)
    }
    if (isText(person?.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email.trim())) {
      problems.warnings.push(`${where}: "${person.email}" does not look like an email address.`)
    }
    if (isText(person?.photo) && !publicFileExists(root, person.photo.trim())) {
      problems.warnings.push(`${where}: photo ${person.photo} does not exist in public/. Initials are shown instead.`)
    }
    const placeholder = Object.entries(person ?? {}).find(([, value]) => PLACEHOLDER.test(String(value)))
    if (placeholder) {
      problems.warnings.push(`${where}: "${placeholder[0]}" still contains placeholder text (Lorem ipsum) — replace it before publishing.`)
    }
  })

  try {
    const image = JSON.parse(fs.readFileSync(path.join(root, 'src/content/pages/home.json'), 'utf8'))?.hero?.image
    const where = 'src/content/pages/home.json (hero.image)'
    if (!isText(image?.src)) {
      problems.warnings.push(`${where}: no photo set yet — the home page shows a placeholder. Add the photo before publishing.`)
    } else {
      if (!publicFileExists(root, image.src.trim())) problems.warnings.push(`${where}: ${image.src} does not exist in public/. The placeholder is shown instead.`)
      if (!isText(image.alt)) problems.warnings.push(`${where}: please add "alt" — a short description of the photo for screen readers.`)
    }
  } catch {
    // home.json errors are reported by Vite itself
  }

  const partners = readJsonList(root, 'src/content/partners.json', problems)
  partners.forEach((partner, index) => {
    const where = `src/content/partners.json (partner ${index + 1}${partner?.name ? `, ${partner.name}` : ''})`
    if (!partner || !isText(partner.name)) problems.errors.push(`${where}: "name" is required.`)
    for (const key of Object.keys(partner ?? {})) {
      if (!PARTNER_FIELDS.has(key)) problems.warnings.push(`${where}: unknown field "${key}" is ignored.`)
    }
    if (isText(partner?.logo) && !publicFileExists(root, partner.logo.trim())) {
      problems.warnings.push(`${where}: logo ${partner.logo} does not exist in public/. The name is shown instead.`)
    }
  })

  return problems
}

// ── Plugin ────────────────────────────────────────────────────────────────────

const yellow = (text) => `\x1b[33m${text}\x1b[0m`
const red = (text) => `\x1b[31m${text}\x1b[0m`

export default function contentPlugin() {
  let root = process.cwd()
  let isBuild = false
  let reported = false

  return {
    name: 'care-at-home-content',

    configResolved(config) {
      root = config.root
      isBuild = config.command === 'build'
    },

    buildStart() {
      if (reported || this.environment?.name === 'ssr') return
      reported = true
      const { errors, warnings } = checkPeopleAndPartners(root)
      warnings.forEach((message) => console.warn(yellow(`⚠ ${message}`)))
      if (errors.length) {
        const text = `Content problems:\n  • ${errors.join('\n  • ')}`
        if (isBuild) this.error(text)
        console.error(red(text))
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return
      const { events, errors, warnings } = loadEvents(root, { includeDrafts: !isBuild })
      const ssr = this.environment?.name === 'ssr'
      if (!ssr) warnings.forEach((message) => console.warn(yellow(`⚠ ${message}`)))
      if (errors.length) {
        const text = `Event problems — fix these and run the command again:\n  • ${errors.join('\n  • ')}`
        if (isBuild) this.error(text)
        console.error(red(text))
      }
      return `export default ${JSON.stringify(events)}`
    },

    configureServer(server) {
      // Serve the resized photo versions (photo.w800.webp …) during `npm run dev`,
      // created on first request — so the preview looks exactly like the published site.
      const variantCache = path.join(root, 'node_modules', '.cache', 'care-images')
      server.middlewares.use(async (req, res, next) => {
        const match = decodeURI((req.url ?? '').split('?')[0]).match(/^(\/images\/.+)\.w(\d+)\.webp$/)
        if (!match || !VARIANT_WIDTHS.includes(Number(match[2]))) return next()
        const source = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP']
          .map((extension) => match[1] + extension)
          .find((candidate) => isOptimizable(candidate) && publicFileExists(root, candidate))
        if (!source) return next()
        try {
          const { writeVariant } = await import('./image-variant.mjs')
          const target = path.join(variantCache, variantPath(source, Number(match[2])))
          await writeVariant(path.join(root, PUBLIC_DIR, decodeURI(source)), target, Number(match[2]))
          res.setHeader('Content-Type', 'image/webp')
          res.setHeader('Cache-Control', 'no-cache')
          fs.createReadStream(target).pipe(res)
        } catch (cause) {
          next(cause)
        }
      })

      const eventsDir = path.join(root, EVENTS_DIR)
      const imagesDir = path.join(root, PUBLIC_DIR, 'images')
      const contentDir = path.join(root, 'src', 'content')
      server.watcher.add([eventsDir, imagesDir])

      const refresh = (file) => {
        const normalized = path.normalize(file)
        if (normalized.startsWith(contentDir)) reported = false
        if (!normalized.startsWith(eventsDir) && !normalized.startsWith(imagesDir)) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('change', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}
