# Care@Home website

Source of **https://icareathome.eu** — the website of *Care@Home – AI that Cares for Aging at Home*.

The site is a React application that is turned into plain HTML files when it is built, so it can be
hosted for free on GitHub Pages. **Texts, events, people, partners and images are kept in simple
content files** — updating the website never requires changing program code.

| I want to…                                   | Go to                                                         |
| -------------------------------------------- | ------------------------------------------------------------- |
| Add or edit an event                         | [Events](#events)                                             |
| Add photos or a gallery to an event          | [Event photos and gallery](#event-photos-and-gallery)         |
| Add or update a contact person / photo       | [People and contacts](#people-and-contacts)                   |
| Replace or add a partner logo                | [Consortium partners and logos](#consortium-partners-and-logos) |
| Change text on a page                        | [Page texts](#page-texts)                                     |
| Run the website on my computer / build it    | [Running and building](#running-and-building)                 |
| Publish                                      | [Deployment](#deployment)                                     |

---

## Where everything lives

```
src/content/                 ← TEXT AND DATA (edit these)
  events/                      one Markdown file per event
    _TEMPLATE.md               copy this to start a new event
  people.json                  contact persons (Contact page, footer)
  partners.json                consortium partners and their logos
  site.json                    site name, navigation, logo, funding text and logos
  pages/                       the texts of each page (home, about, objectives, …)

public/                      ← FILES PUBLISHED AS THEY ARE (images, documents)
  images/
    branding/                  Care@Home logo files and icons
    consortium/                partner logos
    funding/                   EU / RCL (LMTLT) / THCS logos
    people/                    profile photos
    events/<year>/<event>/     event cover and gallery photos
    homepage/                  the home page photo
  documents/events/<year>/<event>/   PDFs and other files attached to events
  CNAME                        custom domain (icareathome.eu) — do not delete

src/components, src/pages    ← design and program code (no content here)
scripts/                     ← build tools
```

Rules of thumb for file names: **lowercase, no spaces, no accents**, words separated by hyphens
(`workshop-tallinn`, `photo-01.jpg`, `kristina-sutiene.jpg`).

---

## Events

Events are listed on the Events page (newest first, grouped by year) and the three most recent
appear on the home page. Every event automatically gets its own page at
`https://icareathome.eu/events/<file-name>/`.

### Add an event — step by step

1. **Create the files.** Either run

   ```
   npm run new-event
   ```

   and answer the questions (title, date, location) — this creates the event file and its photo
   folder — **or** do it by hand:
   - copy `src/content/events/_TEMPLATE.md` to a new file named `YYYY-MM-short-name.md`,
     e.g. `src/content/events/2027-01-workshop-tallinn.md`;
   - create the photo folder `public/images/events/2027/2027-01-workshop-tallinn/`.

2. **Copy the photos** into the photo folder (see [Event photos and gallery](#event-photos-and-gallery)).

3. **Fill in the event file.** The part between the two `---` lines holds the details; the
   description goes below it:

   ```markdown
   ---
   title: "Workshop in Tallinn"
   date: "2027-01-15"
   endDate: "2027-01-16"
   location: "Tallinn, Estonia"
   summary: "Partners met at TalTech to review the first sensor prototypes."
   tags:
     - "Workshop"
   coverImage: "/images/events/2027/2027-01-workshop-tallinn/cover.jpg"
   coverAlt: "Project partners around a table with sensor prototypes"
   galleryFolder: "/images/events/2027/2027-01-workshop-tallinn/"
   ---

   The consortium met in Tallinn on 15–16 January …

   ## Results

   - First point
   - Second point
   ```

4. **Check it**: run `npm run dev` and open the address shown (usually http://localhost:5173/events/).
   The page updates as soon as you save the file.

5. **Build** with `npm run build`. Any mistake (missing title, wrong date format, misspelled field,
   photo not found) is reported with the file name and a plain-language explanation.

6. **Publish** (see [Deployment](#deployment)).

> To prepare an event before it should appear publicly, add `draft: true`. Drafts are visible
> with `npm run dev` (marked "Draft") but are left out of the published site.

### Edit or remove an event

- **Edit:** open the file in `src/content/events/`, change it, save, rebuild.
- **Remove:** delete the event file (and its photo folder if no longer needed), rebuild.
- **Change the web address:** the address comes from the file name. Renaming the file changes the
  address and breaks existing links to it — alternatively keep the file name and add
  `slug: "new-address"`.

### Event fields

| Field           | Required | Format / example                                    | Notes |
| --------------- | :------: | --------------------------------------------------- | ----- |
| `title`         | ✔        | `"Kick-off Meeting"`                                | Page heading and card title |
| `date`          | ✔        | `"2026-04-23"` (YYYY-MM-DD)                         | Start date; used for sorting |
| `endDate`       |          | `"2026-04-24"`                                      | For multi-day events. Shown as "April 23–24, 2026" |
| `location`      |          | `"Kaunas, Lithuania"`                               | |
| `summary`       |          | One or two sentences                                | Shown on the card. If missing, the first paragraph of the text is used |
| `tags`          |          | list: `- "Workshop"`                                | Small labels on the card and page |
| `coverImage`    |          | `"/images/events/2027/2027-01-name/cover.jpg"`              | Without a cover, a branded placeholder showing the date is used |
| `coverAlt`      |          | `"What the photo shows"`                            | Description for screen readers |
| `gallery`       |          | list of photos (see below)                          | Photos one by one, with optional descriptions/captions |
| `galleryFolder` |          | `"/images/events/2027/2027-01-name/"`                       | Shows every photo in the folder (files starting with `cover` are skipped) |
| `links`         |          | list of `label` + `url`                             | External links, open in a new tab |
| `attachments`   |          | list of `label` + `file`                            | Downloadable documents (PDF etc.) |
| `slug`          |          | `"workshop-tallinn"`                                | Overrides the web address (lowercase letters, numbers, hyphens) |
| `draft`         |          | `true`                                              | Hide from the published site |

**Validation rules** (checked on every build): `title` and `date` must be present; dates must be
real dates in `YYYY-MM-DD` form; `endDate` cannot be before `date`; two events cannot have the same
address; image paths must start with `/`; unknown field names are reported (field names are
case-sensitive — `coverimage` is not `coverImage`). Missing image files are reported as warnings and
replaced by a placeholder on the site.

**Writing the text.** Below the second `---` you can write normal paragraphs (separate them with an
empty line) and use simple [Markdown](https://www.markdownguide.org/basic-syntax/):
`**bold**`, `*italic*`, `[link text](https://…)`, lists starting with `- `, subheadings starting
with `## `, quotes starting with `> `, and images `![description](/images/…)`.

---

## Event photos and gallery

1. Put all photos of one event in `public/images/events/<year>/<event-file-name>/` — the folder has the same
   name as the event file, e.g. `public/images/events/2026/2026-04-kick-off-meeting/` for
   `2026-04-kick-off-meeting.md`.
2. Name the cover photo `cover.jpg` (or `.png` / `.webp`) and the others `photo-01.jpg`,
   `photo-02.jpg`, … — the number decides the order.
3. **Photos can be copied straight from a camera or phone.** During `npm run build` every photo is
   automatically resized into several smaller WebP versions; visitors only download the size their
   screen needs. The original files in `public/` are never changed. (Very large files — over 8 MB —
   still work but are mentioned in the build output.)
4. Show them on the event page — choose one:
   - **All photos in the folder:** `galleryFolder: "/images/events/2027/2027-01-workshop-tallinn/"`
     — shown in file-name order, except files whose name starts with `cover`. To show the cover in the
     gallery as well, simply don't name it `cover…` (as in the kick-off meeting folder).
   - **Selected photos with descriptions** (recommended for accessibility):

     ```yaml
     gallery:
       - src: "/images/events/2027/2027-01-workshop-tallinn/photo-01.jpg"
         alt: "Partners presenting the sensor prototype"   # read out by screen readers
         caption: "Opening session"                         # optional, shown under the photo
       - "/images/events/2027/2027-01-workshop-tallinn/photo-02.jpg"
     ```

Visitors can click any photo to open a full-screen viewer (arrow keys / swipe to browse, Esc to close).

**Cover image:** set `coverImage` to the photo's path. Landscape photos (about 3:2 or 16:9) work best;
the card shows a 16:10 crop and the event page a 16:9 crop centred on the middle of the photo.

**Documents:** put files in `public/documents/events/<year>/<event-name>/` and list them under
`attachments` with a `label` and `file` path.

Only publish photos you have permission to use, and that people in them have agreed to.

---

## People and contacts

Contact persons are listed in `src/content/people.json` and shown on the Contact page (and in the
footer) in the same order as in the file.

### Add a person

1. Open `src/content/people.json`.
2. Copy this template and paste it into the list. Separate entries with a comma:
   `[ {…first…}, {…second…}, {…new…} ]`.

   ```json
   {
     "id": "firstname-lastname",
     "name": "Full Name",
     "role": "Role in the project",
     "institution": "Name of the university or organisation",
     "email": "name@example.org",
     "phone": "",
     "note": "",
     "photo": "/images/people/firstname-lastname.jpg",
     "photoPosition": "",
     "profileUrl": "",
     "bio": ""
   }
   ```

3. Fill in the fields; leave a field as `""` if it does not apply (it is then simply not shown).
4. Save and rebuild. A missing comma or quote is reported by the build with the line to check.

| Field           | Notes |
| --------------- | ----- |
| `id`            | Unique, e.g. `"firstname-lastname"` |
| `name`          | **Required.** Written exactly as the person wishes |
| `role`          | e.g. `"Project Contact Person"` |
| `institution`   | University or organisation |
| `email`         | Shown as a clickable link |
| `phone`         | e.g. `"+370 600 00000"` — clickable on phones. Only publish numbers meant to be public. |
| `note`          | Short extra line, e.g. `"Available via Microsoft Teams"` |
| `photo`         | e.g. `"/images/people/firstname-lastname.jpg"`; initials are shown when empty or missing |
| `photoPosition` | Fine-tunes the crop, e.g. `"center 20%"` (default keeps the upper part of the photo) |
| `profileUrl`    | Link to an institutional or professional profile |
| `bio`           | Short description shown under the email on the Contact page — only text provided or approved by the person. The build prints a warning if it still contains placeholder text (Lorem ipsum). |

### Change a person's photo

1. Save the photo as `public/images/people/firstname-lastname.jpg` (lowercase, no spaces, no accents;
   portrait, at least 600 × 750 px, face in the upper half). The Contact page shows a square crop;
   adjust it with `photoPosition` if needed. To replace an existing photo, overwrite the old file
   with the same name — nothing else changes.
2. Set `"photo": "/images/people/firstname-lastname.jpg"` for that person in `people.json`.
3. Rebuild.

Never use a photo of a different person or a generated face as a placeholder — leave `photo` empty instead.

---

## Consortium partners and logos

Partners are listed in `src/content/partners.json` (shown on the Consortium page and the home page).

- **Replace a logo:** copy the new official file into `public/images/consortium/` and update that
  partner's `"logo"` path. (If the new file has exactly the same name as the old one, just overwrite it.)
  Logos are always shown whole — never cropped, stretched or recoloured. SVG is preferred; PNG with a
  transparent background is fine.
- **Balance logo sizes:** some official logo files contain a lot of empty space. `"logoScale"`
  (default `1`) makes a logo look larger (e.g. `1.3`) or smaller (e.g. `0.9`) without changing the file.
- **Partner website link:** fill in `"url"` to show a "Website" link on the partner card.
- **Add a partner:** copy this template into the list (separate entries with a comma). The coordinator
  is marked with `"coordinator": true`.

  ```json
  {
    "id": "short-id",
    "name": "Full Name of the Institution",
    "country": "Country",
    "role": "Role in the project",
    "logo": "/images/consortium/Official_Logo_File.svg",
    "logoScale": 1,
    "url": "https://www.example.org"
  }
  ```

- Note: the counts "9 partners", "7 countries" are part of the page texts
  (`src/content/pages/consortium.json` and `home.json`) and must be updated there by hand.

Funding logos and the funding statement are in `src/content/site.json` → `funding`
(files in `public/images/funding/`). The statement text is mandatory and must not be shortened.

---

## Page texts

Each page's text is in `src/content/pages/<page>.json` (`home`, `about`, `objectives`,
`work-packages`, `consortium`, `contact`, `events`). Change the text between the quotes and keep
the quotes, commas and brackets intact. In `home.json`, words wrapped in `**double asterisks**` are
highlighted on the page (the asterisks are not shown).

Navigation labels, the site name, tagline and the funding statement are in `src/content/site.json`.
On large screens the logo is the link to the home page, so "Home" is listed only in the mobile
menu and the footer. Keep the `"path"` values unchanged — they are the page addresses.

### Home page photo

The right half of the home page header shows a photograph of *an older adult at home, in natural
daylight*: `public/images/homepage/main_pic.png` (created with ChatGPT; the file's built-in
"AI-generated" tag should be kept). Without any photo, a labelled placeholder is shown and the
build prints a reminder.

1. Copy the photo to `public/images/homepage/`, e.g. `public/images/homepage/hero.jpg`
   (landscape, at least 2000 px wide; a camera photo is fine — smaller versions are made automatically).
2. In `src/content/pages/home.json`, fill in `hero.image`:

   ```json
   "image": {
     "src": "/images/homepage/hero.jpg",
     "alt": "Short description of what the photo shows",
     "position": "center"
   }
   ```

   `position` chooses which part of the photo stays visible when it is cropped, e.g. `"right center"`
   or `"60% 40%"`.
3. Rebuild. Only use a photo you have the rights to, with the consent of anyone shown.

### Replacing the Care@Home logo

The header shows the logo symbol (`public/images/branding/care-at-home-symbol.png`, two figures
forming a heart around a house, with a transparent background) next to the "Care@Home" wordmark,
which is typeset text styled like the logo ("Care@" navy, "Home" in the blue→green gradient).

- **New symbol:** save it in `public/images/branding/` (SVG, or PNG with a transparent background,
  at least 256 px) and set `logo.symbol` in `src/content/site.json` to its path, with
  `symbolWidth` / `symbolHeight` set to the file's pixel size (keeps the page from jumping while it loads).
- **Complete horizontal logo** ([symbol] Care@Home in one file): set `logo.horizontal` to its path —
  the header then shows that image instead of symbol + text.
- Browser tab icon: `public/images/branding/favicon.png` (64 × 64 px, transparent) and the phone
  home-screen icon `apple-touch-icon.png` (180 × 180 px, white background) — replace them with
  versions of the new symbol, or change the two `<link rel="icon"…>` lines in `index.html`.

---

## Running and building

### One-time setup

1. Install **Node.js 24 LTS** (or newer) from https://nodejs.org (use the default options).
2. Open a terminal in this folder and run:

   ```
   npm install
   ```

### Everyday commands

| Command                   | What it does |
| ------------------------- | ------------ |
| `npm run dev`             | Starts a local preview at http://localhost:5173 that updates while you edit. Shows drafts. Stop with `Ctrl + C`. |
| `npm run build`           | Creates the finished website in the `dist/` folder and checks all content. |
| `npm run preview`         | Shows the built `dist/` site at http://localhost:4173 — exactly what will be published. |
| `npm run new-event`       | Creates a new event file and photo folder (asks a few questions). |
| `npm run verify:content`  | After a build: confirms all text from the previous website (branch `website`) is still present word for word. Text removed on purpose is listed in `APPROVED_REMOVALS` in the script. Only meaningful while that branch still holds the old site. |

### Editing directly on GitHub (no installation)

Once deployment through GitHub Actions is set up (see below), small updates can be made in the
browser: open the repository on GitHub, switch to the published branch, use **Add file → Upload
files** to add photos to the right folder and **Add file → Create new file** for a new event, then
commit. The website is rebuilt and published automatically; if something is wrong, the **Actions**
tab shows the error message and the live site stays unchanged.

---

## How the site works (for developers)

- **Stack:** React 19, Vite 8, Tailwind CSS 4, Motion (animations), Lucide (icons), React Router 8.
  Fonts (Inter, Plus Jakarta Sans) are self-hosted — no requests to Google.
- **Pre-rendering:** `npm run build` builds the browser bundle, then a server bundle that
  `scripts/prerender.mjs` uses to write a complete HTML file for every page
  (`dist/about/index.html`, `dist/events/<slug>/index.html`, `dist/404.html`, `sitemap.xml`,
  `robots.txt`). Every address therefore works when opened directly or refreshed — no hash URLs or
  404 redirects needed on GitHub Pages — and search engines see the full text and per-page titles.
- **Events:** `scripts/content-plugin.mjs` reads `src/content/events/*.md` at build time
  (`import events from 'virtual:events'`), validates them, converts Markdown to HTML and reloads the
  dev server when content or images change.
- **Images:** `scripts/optimize-images.mjs` writes 400/800/1200/2000 px WebP versions of photos in
  `images/events`, `images/people`, `images/homepage` and `images/work-packages` (cached in
  `node_modules/.cache`). During `npm run dev` the same versions are created on first request by
  `scripts/content-plugin.mjs`, so the preview shows photos exactly as the published site (large camera
  originals scaled down by the browser can look harsh). Both use `scripts/image-variant.mjs`.
  `src/components/media/SmartImage.jsx` adds the matching `srcset`, lazy loading and fallbacks; the naming
  rule is shared in `src/lib/image-variants.js`. Logos are never processed.
- **Old addresses:** links of the previous site (`index.html?page=contact`, `?page=wps`, …) are
  redirected by a small script in `index.html`; the old fragment files `pages/*.html` are replaced by
  redirect pages generated during the build.
- **Accessibility & motion:** semantic landmarks, skip link, visible focus styles, WCAG AA colour
  contrast, keyboard-operable menu and photo viewer (native `<dialog>`). Animations respect
  "reduce motion" and content stays visible without JavaScript.

| New address        | Previous address                |
| ------------------ | ------------------------------- |
| `/`                | `index.html?page=home`          |
| `/about/`          | `index.html?page=about`         |
| `/objectives/`     | `index.html?page=objectives`    |
| `/work-packages/`  | `index.html?page=wps`           |
| `/consortium/`     | `index.html?page=consortium`    |
| `/contact/`        | `index.html?page=contact`       |
| `/events/`         | `index.html?page=events`        |
| `/events/<event>/` | *(new)*                         |

---

## Deployment

The previous site was published by GitHub Pages directly from the files of the `website` branch.
The new site must be **built** first, so publishing switches to the GitHub Actions workflow in
`.github/workflows/deploy.yml` (build → upload `dist/` → deploy). Nothing is published until the
steps below are done.

**Switch-over checklist (repository admin):**

1. Review this branch (`redesign-v2`) locally: `npm install`, `npm run build`, `npm run preview`.
2. In GitHub: **Settings → Pages → Build and deployment → Source → "GitHub Actions"**.
   Check that the custom domain is still `icareathome.eu` and "Enforce HTTPS" is on.
   *(Do this before step 3. If `website` received the new source code while Pages still serves the
   branch files directly, visitors would see an unbuilt page.)*
3. Merge `redesign-v2` into `website` (via a pull request) and push. The workflow builds and
   publishes the site; progress is visible in the **Actions** tab. It can also be started by hand
   there ("Run workflow").
4. If the deployment is blocked by environment protection rules, allow the `website` branch under
   **Settings → Environments → github-pages**.
5. Rollback: re-run the last successful deployment in the Actions tab, or revert the merge commit.

`public/CNAME` is copied into every build, so the custom domain configuration is kept.
