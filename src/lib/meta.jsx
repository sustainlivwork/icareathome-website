import { createContext, useContext, useEffect } from 'react'
import site from '../content/site.json'

// While pages are pre-rendered at build time, page titles and descriptions are
// collected here and written into each HTML file's <head>. In the browser the
// same hook updates the document title on navigation.
export const MetaContext = createContext(null)

export function fullTitle(title) {
  return title && title !== site.name ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`
}

export function usePageMeta({ title, description, image, noindex = false }) {
  const collector = useContext(MetaContext)
  if (collector) Object.assign(collector, { title, description, image, noindex })

  useEffect(() => {
    document.title = fullTitle(title)
    const tag = document.querySelector('meta[name="description"]')
    if (tag && description) tag.setAttribute('content', description)
  }, [title, description])
}
