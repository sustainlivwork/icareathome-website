import { Reveal } from '../motion/Reveal.jsx'

const TONES = {
  white: 'bg-surface',
  mist: 'bg-mist',
  tint: 'bg-tint',
  wash: 'bg-wash',
}

// One vertical rhythm for every section on the site (also used by the few pages with their own layout).
export const SECTION_SPACING = 'py-12 sm:py-14 lg:py-16'

export function Section({ tone = 'white', labelledBy, children }) {
  return (
    <section aria-labelledby={labelledBy} className={`relative ${TONES[tone]}`}>
      <div className={`container-page ${SECTION_SPACING}`}>{children}</div>
    </section>
  )
}

export function SectionHeading({ id, title, intro, align = 'left' }) {
  const centered = align === 'center'
  return (
    <Reveal className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <h2 id={id} className="type-heading">
        {title}
      </h2>
      {intro && <p className={`mt-5 max-w-2xl type-lead text-ink-muted ${centered ? 'mx-auto' : ''}`}>{intro}</p>}
    </Reveal>
  )
}
