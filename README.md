# Care@Home website

Source of **https://icareathome.eu**. Built with React + Vite + Tailwind and published as plain
HTML on GitHub Pages. All texts, events, people, partners and images live in content files, so
updating the site never requires touching program code.

## Where things are

```
src/content/
  pages/<page>.json     texts of each page (home, about, objectives, …)
  events/*.md           one file per event (_TEMPLATE.md = starting point)
  people.json           contact persons (Contact page, footer)
  partners.json         consortium partners and logos
  site.json             site name, navigation, logo, funding text
public/
  images/               logos, photos (events/<year>/<event>/, people/, homepage/ …)
  documents/            files attached to events
  CNAME                 custom domain, do not delete
```

File names: **lowercase, no spaces, no accents**, words joined with hyphens (`photo-01.jpg`).

## Run locally

Install [Node.js](https://nodejs.org) (LTS), then in this folder:

```
npm install        # once
npm run dev        # live preview at http://localhost:5173
npm run build      # build the site into dist/ (also checks all content)
npm run preview    # view the built site at http://localhost:4173
```

## Add an event

1. Run `npm run new-event` and answer the questions. It creates
   `src/content/events/YYYY-MM-name.md` and the photo folder
   `public/images/events/YYYY/YYYY-MM-name/`.
2. Copy the photos into that folder (straight from a camera/phone is fine, smaller versions are
   made automatically).
3. Fill in the event file:

   ```markdown
   ---
   title: "Workshop in Tallinn"
   date: "2027-01-15"
   endDate: "2027-01-16"          # optional
   location: "Tallinn, Estonia"
   summary: "One or two sentences for the card."
   tags:
     - "Workshop"
   coverImage: "/images/events/2027/2027-01-workshop-tallinn/cover.jpg"
   coverAlt: "What the photo shows"
   galleryFolder: "/images/events/2027/2027-01-workshop-tallinn/"
   ---

   Text of the event. **Bold**, [links](https://…), lists with "- " and subheadings with "## ".
   ```

- `galleryFolder` shows every photo in the folder in file-name order (files named `cover…` are
  skipped). Use `gallery:` with `src` / `alt` / `caption` entries to pick photos one by one.
- Optional fields: `links` (`label` + `url`), `attachments` (`label` + `file`), `draft: true`
  (visible only in `npm run dev`), `slug` (custom web address).
- The build reports mistakes (missing title, wrong date, missing photo) with the file name.

## People, partners, texts

- **Contact person:** edit `src/content/people.json` (`name`, `role`, `institution`, `email`,
  `photo`, `bio`, …; leave a field `""` to hide it). Photo: `public/images/people/firstname-lastname.jpg`,
  portrait. Only real, approved photos and texts; only public phone numbers.
- **Partner:** edit `src/content/partners.json`. Logos go in `public/images/consortium/`
  (official files only, never cropped or recoloured). `logoScale` balances logo sizes; the
  coordinator has `"coordinator": true`.
- **Page texts:** change the text between quotes in `src/content/pages/<page>.json`, keeping quotes
  and commas. `**double asterisks**` in `home.json` highlight words.
- **Home photo:** `public/images/homepage/main_pic.png` (created with ChatGPT; keep the file's
  built-in "AI-generated" tag). Set in `home.json` → `hero.image`.
- **Logo:** `public/images/branding/` (symbol, favicon, apple-touch-icon), set in `site.json` → `logo`.
- **Funding statement and logos:** `site.json` → `funding`. The statement is mandatory, do not shorten it.

## Publishing

Publishing runs through GitHub Actions (`.github/workflows/deploy.yml`): every push to the
`website` branch builds and publishes the site automatically.

**First-time switch-over (repository admin):**

1. GitHub → **Settings → Pages → Source: "GitHub Actions"**. Check the custom domain is still
   `icareathome.eu`. *Do this before step 2, otherwise the live site breaks.*
2. Open a pull request from `redesign-v2` into `website` and merge it.
3. Follow progress in the **Actions** tab (2–3 min), then check the site.

Rollback: revert the merge commit, or switch Pages back to "Deploy from a branch → website".

Old links (`index.html?page=contact`, …) redirect to the new pages automatically.
`npm run verify:content` (after a build) confirms all text from the old site is still present.
