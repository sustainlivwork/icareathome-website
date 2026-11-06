// Creates a new event file and its photo folder.
//   npm run new-event                                (asks questions)
//   npm run new-event -- "Workshop in Tallinn" 2027-01-15

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const today = new Date().toISOString().slice(0, 10)

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '')

let [title, date, location = ''] = process.argv.slice(2)

if (!title) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  title = (await rl.question('Event title: ')).trim()
  date = (await rl.question(`Start date, YYYY-MM-DD [${today}]: `)).trim() || today
  location = (await rl.question('Location, e.g. "Kaunas, Lithuania" (optional): ')).trim()
  rl.close()
}
date ||= today

if (!title) {
  console.error('An event title is required.')
  process.exit(1)
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`The date must be written as YYYY-MM-DD (got "${date}").`)
  process.exit(1)
}

const year = date.slice(0, 4)
const name = slugify(title) || 'event'
const fileName = `${date.slice(0, 7)}-${name}.md`
const eventFile = path.join(root, 'src', 'content', 'events', fileName)
// The photo folder has the same name as the event file (e.g. 2027/2027-01-workshop-tallinn/).
const imageFolder = `/images/events/${year}/${fileName.replace(/\.md$/, '')}/`
const imageDir = path.join(root, 'public', ...imageFolder.split('/').filter(Boolean))

if (fs.existsSync(eventFile)) {
  console.error(`src/content/events/${fileName} already exists — open it to edit the event.`)
  process.exit(1)
}

const quote = (text) => JSON.stringify(text)
const content = `---
title: ${quote(title)}
date: ${quote(date)}
# endDate: ${quote(date)}
${location ? `location: ${quote(location)}` : '# location: "City, Country"'}
# summary: "One or two sentences for the event card."
# tags:
#   - "Workshop"
draft: true          # remove this line when the event is ready to publish

# coverImage: "${imageFolder}cover.jpg"
# coverAlt: "What the cover photo shows"
# galleryFolder: "${imageFolder}"
---

Write the event description here.
`

fs.mkdirSync(path.dirname(eventFile), { recursive: true })
fs.writeFileSync(eventFile, content)
fs.mkdirSync(imageDir, { recursive: true })

console.log(`
✓ Created src/content/events/${fileName}
✓ Created photo folder public${imageFolder}

Next steps:
  1. Copy the photos into public${imageFolder}
     (name the cover photo "cover.jpg", the others e.g. "photo-01.jpg", "photo-02.jpg")
  2. Open src/content/events/${fileName}, write the text and remove the # in front of the lines you need
  3. Preview: npm run dev   →  http://localhost:5173/events/${fileName.replace(/\.md$/, '')}/
  4. Remove "draft: true" and run: npm run build
`)
