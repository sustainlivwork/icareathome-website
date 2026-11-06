import SmartImage from './SmartImage.jsx'

function initials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words.at(-1)[0] : ''
  return `${first}${last}`.toLocaleUpperCase()
}

/**
 * Portrait of a person (cropped to fill its box) or, without a photo, their
 * initials. The parent decides the size via `className`.
 */
export default function Avatar({ name, photo, position, className = '' }) {
  const fallback = (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-brand-gradient-soft" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMaxYMin slice" className="absolute inset-0 h-full w-full text-white">
        <circle cx="96" cy="6" r="30" fill="none" stroke="currentColor" strokeOpacity="0.7" />
        <circle cx="96" cy="6" r="50" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <circle cx="96" cy="6" r="70" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      </svg>
      <span
        className="relative flex size-28 items-center justify-center rounded-full bg-white/85 font-display text-4xl font-extrabold tracking-tight text-navy-900 shadow-soft sm:size-32 sm:text-[2.75rem]"
      >
        {initials(name)}
      </span>
    </div>
  )

  return (
    <div className={`relative overflow-hidden bg-tint ${className}`}>
      <SmartImage
        src={photo}
        alt={`Portrait of ${name}`}
        sizes="(min-width: 640px) 416px, 100vw"
        position={position || 'center 25%'}
        fallback={fallback}
      />
    </div>
  )
}
