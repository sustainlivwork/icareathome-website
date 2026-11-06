// Checks that every piece of text from the previous website (git branch
// "website") still appears, word for word, on the corresponding new page.
// Run after a build:  npm run build && npm run verify:content

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const SOURCE_BRANCH = process.env.LEGACY_BRANCH ?? 'website'

const PAGES = {
  'index.html': 'index.html', // header navigation + funding acknowledgement
  'pages/home.html': 'index.html',
  'pages/about.html': 'about/index.html',
  'pages/objectives.html': 'objectives/index.html',
  'pages/wps.html': 'work-packages/index.html',
  'pages/consortium.html': 'consortium/index.html',
  'pages/contact.html': 'contact/index.html',
  'pages/events.html': 'events/index.html',
}

// Phone numbers are matched by pattern, so no private number has to be written in this file.
const ANY_PHONE_NUMBER = /^(Phone: )?\+\d[\d ]{6,}$/

// Text deliberately removed at the site owner's request (exact text or a pattern).
// Listed blocks are reported as "removed (approved)" instead of failing the check.
const APPROVED_REMOVALS = {
  // 2026-10-12: the contact box at the bottom of the Consortium page duplicated
  // the Contact page and was removed. The contacts remain on the Contact page.
  'pages/consortium.html': [
    'Contact',
    'Kristina Sutiene',
    'kristina.sutiene@ktu.lt',
    'Agne Paulauskaite',
    'agne.paulauskaite-taraseviciene@ktu.lt',
    ANY_PHONE_NUMBER,
  ],
  // 2026-11-06: the long dash in "…in the background—empowering…" replaced by a comma.
  'pages/about.html': [
    'Care@Home envisions a future where AI supports independent living by working seamlessly in the background—empowering older adults, supporting caregivers, and enabling timely, data-driven interventions without compromising privacy or dignity.',
  ],
  // 2026-11-06: phone number removed (private), names corrected/shortened and the
  // email address updated at the owner's request.
  'pages/contact.html': [
    'Kristina Sutiene',
    'Kristina.sutiene@ktu.lt',
    'Agnė Paulauskaitė-Tarasevičienė',
    'agne.paulauskaite-taraseviciene@ktu.lt',
    ANY_PHONE_NUMBER,
  ],
}

const ENTITIES ={ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const decode = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
const normalize = (text) => decode(text).replace(/\s+/g, ' ').trim()

/** Visible text blocks of an HTML fragment (scripts, styles and comments removed). */
function textBlocks(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/<[^>]+>/)
    .map(normalize)
    .filter((text) => text && /[\p{L}\p{N}]/u.test(text))
}

/** All visible text of a built page, as one string (inline tags joined without spaces). */
function pageText(html) {
  const body = html.slice(html.indexOf('<div id="root">'))
  return normalize(
    body
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\/(p|h[1-6]|li|dt|dd|div|section|a|button|figcaption|blockquote)>/gi, ' ')
      .replace(/<[^>]+>/g, ''),
  )
}

function legacyFile(file) {
  try {
    return execFileSync('git', ['show', `${SOURCE_BRANCH}:${file}`], { cwd: root, encoding: 'utf8' })
  } catch {
    console.error(`Could not read ${file} from the "${SOURCE_BRANCH}" branch. Is it available locally?`)
    process.exit(2)
  }
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ not found — run "npm run build" first.')
  process.exit(2)
}

let total = 0
let missing = 0
let removed = 0
for (const [legacy, built] of Object.entries(PAGES)) {
  const approvedList = APPROVED_REMOVALS[legacy] ?? []
  const isApproved = (block) =>
    approvedList.some((entry) => (entry instanceof RegExp ? entry.test(block) : entry === block))
  const blocks = textBlocks(legacyFile(legacy))
  const text = pageText(fs.readFileSync(path.join(dist, built), 'utf8'))
  const absent = blocks.filter((block) => !text.includes(block))
  const unexpected = absent.filter((block) => !isApproved(block))
  const allowed = absent.filter(isApproved)
  total += blocks.length
  missing += unexpected.length
  removed += allowed.length
  const found = blocks.length - absent.length
  console.log(
    `${unexpected.length ? '✗' : '✓'} ${legacy.padEnd(22)} → ${built.padEnd(26)} ${found}/${blocks.length} text blocks` +
      (allowed.length ? `  (+${allowed.length} removed on request)` : ''),
  )
  unexpected.forEach((block) => console.log(`    missing: "${block}"`))
  allowed.forEach((block) => console.log(`    removed (approved): "${block}"`))
}

console.log(`\n${total - missing - removed}/${total} original text blocks found on the new pages` + (removed ? `, ${removed} removed on request` : '') + `, ${missing} missing.`)
process.exit(missing ? 1 : 0)
