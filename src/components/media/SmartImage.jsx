import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../../lib/assets.js'
import { VARIANT_WIDTHS, isOptimizable, variantPath } from '../../lib/image-variants.js'

const DEFAULT_WIDTH = 1200

/**
 * Image from the content files with:
 *  - responsive sizes, also in the local preview (see src/lib/image-variants.js),
 *  - lazy loading by default,
 *  - a fallback (`fallback` prop) when the path is empty or the file is missing.
 * The parent element decides the size/aspect ratio; the image fills it.
 */
export default function SmartImage({
  src,
  alt = '',
  sizes = '100vw',
  fit = 'cover',
  position,
  priority = false,
  className = '',
  fallback = null,
  ...rest
}) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [src])

  // An image that failed before the page became interactive never fires onError
  // in React, so check once after mounting.
  useEffect(() => {
    const image = ref.current
    if (image?.complete && image.naturalWidth === 0 && !/\.svg$/i.test(src ?? '')) setFailed(true)
  }, [src])

  if (!src || failed) return fallback

  // Resized versions are made by the build, and on demand by `npm run dev`.
  const responsive = isOptimizable(src)
  const srcSet = responsive
    ? VARIANT_WIDTHS.map((width) => `${assetUrl(variantPath(src, width))} ${width}w`).join(', ')
    : undefined

  return (
    <img
      ref={ref}
      src={assetUrl(responsive ? variantPath(src, DEFAULT_WIDTH) : src)}
      srcSet={srcSet}
      sizes={responsive ? sizes : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      style={position ? { objectPosition: position } : undefined}
      {...rest}
    />
  )
}
