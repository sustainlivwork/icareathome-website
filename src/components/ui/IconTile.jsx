const SIZES = {
  sm: { box: 'size-9 rounded-xl', glyph: 'size-[1.1rem]' },
  md: { box: 'size-12 rounded-2xl', glyph: 'size-6' },
  lg: { box: 'size-14 rounded-2xl', glyph: 'size-7' },
}

/** Icon on a soft brand-gradient tile — one consistent style across the site. */
export default function IconTile({ icon: Icon, size = 'md', className = '' }) {
  const { box, glyph } = SIZES[size] ?? SIZES.md
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-brand-gradient-soft text-blue-text ring-1 ring-white/70 ring-inset ${box} ${className}`}
    >
      <Icon className={glyph} strokeWidth={1.9} aria-hidden="true" />
    </span>
  )
}
