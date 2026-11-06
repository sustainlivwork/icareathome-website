import { useEffect, useState } from 'react'

/** Sticky "On this page" list that highlights the section currently being read. */
export default function TableOfContents({ items, label = 'On this page' }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter(Boolean)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="sticky top-32">
      <p className="eyebrow text-ink-subtle">{label}</p>
      <ol className="mt-5 space-y-1 border-l-2 border-line">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`-ml-0.5 block border-l-2 py-1.5 pl-4 font-display type-small font-semibold transition-colors ${
                  isActive ? 'border-blue-text text-navy-900' : 'border-transparent text-ink-muted hover:text-navy-900'
                }`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
