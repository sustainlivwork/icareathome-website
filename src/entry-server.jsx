// Used only by `npm run build` (scripts/prerender.mjs) to write a complete HTML
// file for every page, so each address works when opened directly.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'
import { MetaContext, fullTitle } from './lib/meta.jsx'
import { events, site } from './lib/content.js'

export { site, fullTitle }
export const base = import.meta.env.BASE_URL

export function getStaticPaths() {
  const pages = site.navigation.map((item) => item.path)
  return [...pages, ...events.map((event) => `/events/${event.slug}/`)]
}

export function render(url) {
  const meta = {}
  const html = renderToString(
    <StrictMode>
      <MetaContext value={meta}>
        <StaticRouter location={url} basename={import.meta.env.BASE_URL}>
          <App />
        </StaticRouter>
      </MetaContext>
    </StrictMode>,
  )
  return { html, meta }
}
