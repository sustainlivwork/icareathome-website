const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Turns a content path such as "/images/people/name.webp" into a URL that works
 *  wherever the site is hosted. External URLs are returned unchanged. */
export function assetUrl(path) {
  if (!path) return ''
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path
  return encodeURI(`${BASE}/${path.replace(/^\//, '')}`)
}

export const isExternalUrl = (url) => /^https?:\/\//i.test(url ?? '')
