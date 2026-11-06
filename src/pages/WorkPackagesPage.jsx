import { Fragment, useState } from 'react'
import { ChevronRight, Landmark } from 'lucide-react'
import wpContent from '../content/pages/work-packages.json'
import { getIcon } from '../lib/icons.js'
import { usePageMeta } from '../lib/meta.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Section, SectionHeading, SECTION_SPACING } from '../components/ui/Section.jsx'
import IconTile from '../components/ui/IconTile.jsx'
import { Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'

/**
 * Shows a text such as "WP1 → WP2" with a drawn chevron instead of the arrow character.
 * The original arrow stays in the page (visually hidden), so screen readers and the
 * content check read exactly the same text as before. With `badges`, each part is a WP badge.
 */
// Small rounded label for work package codes ("WP1").
const BADGE = 'rounded-full bg-mist px-3 py-1 font-display text-[0.8125rem] font-bold tracking-wide ring-1 ring-line'

function Sequence({ text, badges = false }) {
  return text.split(/\s*→\s*/).map((part, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <>
          {' '}
          <span className="sr-only">→</span>
          <ChevronRight
            aria-hidden="true"
            strokeWidth={2.25}
            className={badges ? 'size-4 shrink-0 text-ink-subtle' : 'inline-block size-[1.05em] align-[-0.2em] text-ink-subtle'}
          />{' '}
        </>
      )}
      {badges ? (
        <span className={`${BADGE} text-navy-900`}>
          {part}
        </span>
      ) : (
        part
      )}
    </Fragment>
  ))
}

function TimelineCard({ timeline }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-line sm:p-7">
      <h2 className="type-subheading text-navy-900">{timeline.heading}</h2>
      <p className="mt-1 text-ink-muted">{timeline.text}</p>
      <div className="mt-6" aria-hidden="true">
        <div className="relative h-2.5 overflow-hidden rounded-full bg-tint">
          <div className="absolute inset-0 rounded-full bg-brand-gradient" />
          <div className="absolute inset-y-0 left-1/3 w-0.5 bg-white/80" />
          <div className="absolute inset-y-0 left-2/3 w-0.5 bg-white/80" />
        </div>
        <div className="mt-2 flex justify-between text-sm font-medium text-ink-subtle">
          <span>{timeline.startLabel}</span>
          <span>{timeline.endLabel}</span>
        </div>
      </div>
    </div>
  )
}

function WorkPackageCard({ wp }) {
  return (
    <article
      id={wp.id}
      aria-labelledby={`${wp.id}-title`}
      className="flex h-full scroll-mt-28 flex-col rounded-3xl bg-white p-7 ring-1 ring-line shadow-soft target:ring-2 target:ring-blue-text sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <IconTile icon={getIcon(wp.icon)} />
        <p className={`${BADGE} text-ink-muted`}>
          {wp.code}
        </p>
      </div>
      <h3 id={`${wp.id}-title`} className="mt-6 type-subheading">
        {wp.title}
      </h3>
      <p className="mt-4 type-body text-ink-muted">{wp.description}</p>
      <div className="mt-auto pt-7">
        <p className="flex items-start gap-3 border-t border-line pt-5 type-small text-ink">
          <Landmark className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <span>
            <span className="font-semibold text-navy-900">Lead:</span> {wp.lead}
          </span>
        </p>
      </div>
    </article>
  )
}

function Connections({ connections, packages }) {
  const [hovered, setHovered] = useState(null)
  const [pinned, setPinned] = useState(null)
  const active = hovered ?? pinned
  const activeSet = active === null ? null : new Set(connections.steps[active].packages)

  const inChain = new Set(connections.steps.flatMap((step) => step.packages))
  const chain = packages.filter((wp) => inChain.has(wp.id))
  const linkActive = (a, b) => Boolean(activeSet?.has(a) && activeSet.has(b))

  return (
    <section aria-labelledby="connections-heading" className="relative isolate overflow-hidden bg-wash">
      <div className={`container-page ${SECTION_SPACING}`}>
        <SectionHeading id="connections-heading" title={connections.heading} />

        <Reveal className="mt-14">
          <div className="flex flex-col lg:grid" style={{ gridTemplateColumns: `repeat(${chain.length}, minmax(0, 1fr))` }}>
            {chain.map((wp, position) => {
              const next = chain[position + 1]
              const isActive = activeSet?.has(wp.id)
              const dimmed = activeSet && !isActive
              const toNext = next && linkActive(wp.id, next.id)
              return (
                <div key={wp.id} className="relative flex items-center gap-4 pb-8 last:pb-0 lg:flex-col lg:gap-4 lg:pb-0 lg:text-center">
                  {next && (
                    <>
                      <span
                        aria-hidden="true"
                        className={`absolute top-16 bottom-0 left-8 w-0.5 rounded-full transition-colors duration-300 lg:hidden ${toNext ? 'bg-brand-gradient' : 'bg-line-strong'}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute top-8 right-[calc(-50%+2.5rem)] left-[calc(50%+2.5rem)] hidden h-0.5 rounded-full transition-colors duration-300 lg:block ${toNext ? 'bg-brand-gradient' : 'bg-line-strong'}`}
                      />
                    </>
                  )}
                  <a
                    href={`#${wp.id}`}
                    className={`relative flex size-16 shrink-0 items-center justify-center rounded-full font-display text-lg font-extrabold transition duration-300 ease-out-soft ${
                      isActive
                        ? 'scale-110 bg-brand-gradient-deep text-white shadow-glow'
                        : dimmed
                          ? 'bg-white/70 text-ink-subtle ring-1 ring-line'
                          : 'bg-white text-navy-900 shadow-soft ring-1 ring-line hover:ring-line-strong'
                    }`}
                  >
                    {wp.code}
                    <span className="sr-only">: {wp.title}</span>
                  </a>
                  <p
                    aria-hidden="true"
                    className={`max-w-xs type-small transition-colors duration-300 lg:max-w-[12rem] ${dimmed ? 'text-ink-subtle' : 'text-ink-muted'}`}
                  >
                    {wp.title}
                  </p>
                </div>
              )
            })}
          </div>
        </Reveal>

        <RevealGroup as="ul" className="mt-14 grid gap-4 lg:grid-cols-3">
          {connections.steps.map((step, index) => {
            const isActive = active === index
            return (
              <RevealItem as="li" key={step.label}>
                <button
                  type="button"
                  aria-pressed={pinned === index}
                  onClick={() => setPinned((value) => (value === index ? null : index))}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  className={`relative h-full w-full rounded-2xl bg-white p-6 text-left transition duration-300 ease-out-soft sm:p-7 ${
                    isActive ? 'gradient-border shadow-glow' : 'shadow-soft ring-1 ring-line hover:ring-line-strong'
                  }`}
                >
                  <span className="flex flex-wrap items-center gap-1.5">
                    <Sequence text={step.label} badges />
                  </span>
                  <span className="mt-4 block type-body text-ink-muted">
                    <Sequence text={step.text} />
                  </span>
                </button>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

export default function WorkPackagesPage() {
  const { hero, timeline, packagesHeading, packages, connections, outcomes } = wpContent
  usePageMeta({ title: packagesHeading, description: hero.intro })

  return (
    <>
      <PageHero title={hero.title} intro={hero.intro} current={packagesHeading} aside={<TimelineCard timeline={timeline} />} />

      <Section labelledBy="packages-heading">
        <SectionHeading id="packages-heading" title={packagesHeading} />
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((wp) => (
            <RevealItem key={wp.id} className="h-full">
              <WorkPackageCard wp={wp} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Connections connections={connections} packages={packages} />

      <Section labelledBy="outcomes-heading">
        <SectionHeading id="outcomes-heading" title={outcomes.heading} align="center" />
        <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
          {outcomes.items.map((item) => (
            <RevealItem as="li" key={item.title} className="rounded-3xl bg-mist p-8 text-center ring-1 ring-line sm:p-10">
              <IconTile icon={getIcon(item.icon)} size="lg" className="bg-white" />
              <h3 className="mt-6 type-subheading">{item.title}</h3>
              <p className="mt-2 text-ink-muted">{item.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  )
}
