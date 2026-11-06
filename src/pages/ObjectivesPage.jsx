import { m } from 'motion/react'
import { CircleCheck } from 'lucide-react'
import objectives from '../content/pages/objectives.json'
import { getIcon } from '../lib/icons.js'
import { usePageMeta } from '../lib/meta.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { SECTION_SPACING } from '../components/ui/Section.jsx'
import { Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'
import IconTile from '../components/ui/IconTile.jsx'
import NumberedHeading, { formatNumber } from '../components/ui/NumberedHeading.jsx'

// The line between two areas steps along the brand gradient (purple → blue → teal → green).
const SEGMENT_COLORS = [
  'from-brand-purple to-brand-blue',
  'from-brand-blue to-brand-teal',
  'from-brand-teal to-brand-green',
  'from-brand-green to-brand-green',
]
const EASE = [0.22, 1, 0.36, 1]

function ThemeIndex({ groups }) {
  return (
    <nav aria-label="Objective areas" className="rounded-3xl bg-white/80 p-3 shadow-soft ring-1 ring-line backdrop-blur">
      <ul className="grid gap-1">
        {groups.map((group, index) => {
          return (
            <li key={group.id}>
              <a href={`#${group.id}`} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-mist">
                <IconTile icon={getIcon(group.icon)} size="sm" />
                <span className="font-display font-bold text-navy-900">{group.heading}</span>
                <span aria-hidden="true" className="ml-auto text-xs font-medium text-ink-subtle tabular-nums">
                  {formatNumber(index)}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Line from this area's icon down to the next one (the last area's line ends in a dot).
 * It fills once it scrolls into view. The visibility check watches the full-height track,
 * not the filling line: that starts at zero height, so the browser never reports it as visible.
 */
function Connector({ index, isLast }) {
  return (
    <m.span
      aria-hidden="true"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -35% 0px' }}
      className={`absolute top-12 left-[23px] w-0.5 sm:top-14 sm:left-[35px] ${isLast ? 'bottom-0' : '-bottom-16 sm:-bottom-20'}`}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full bg-line">
        <m.span
          data-reveal=""
          className={`block h-full w-full origin-top bg-linear-to-b ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}
          variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </span>
      {isLast && (
        <m.span
          data-reveal=""
          className="absolute -bottom-1.5 -left-[5px] size-3 rounded-full bg-brand-green shadow-[0_0_0_5px_rgb(23_193_136/0.16)]"
          variants={{ hidden: { scale: 0 }, shown: { scale: 1 } }}
          transition={{ delay: 0.75, duration: 0.4, ease: EASE }}
        />
      )}
    </m.span>
  )
}

function ObjectiveGroup({ group, index, isLast }) {
  const Icon = getIcon(group.icon)
  return (
    <section id={group.id} aria-labelledby={`${group.id}-heading`} className="relative scroll-mt-28 pl-14 sm:pl-24">
      <Connector index={index} isLast={isLast} />
      <span className="absolute top-0 left-0 flex size-12 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-line sm:left-2 sm:size-14">
        <Icon className="size-6 text-blue-text" strokeWidth={1.9} aria-hidden="true" />
      </span>

      {/* Each area sits on a light tinted panel. */}
      <div className="-mt-6 -mr-2 grid gap-8 rounded-3xl bg-wash px-3.5 pt-6 pb-3.5 sm:-mt-10 sm:mr-0 sm:p-10 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <NumberedHeading id={`${group.id}-heading`} index={index}>
            {group.heading}
          </NumberedHeading>
        </Reveal>
        <RevealGroup as="ul" className="space-y-4 lg:col-span-8">
          {group.objectives.map((objective) => (
            <RevealItem
              as="li"
              key={objective}
              className="flex gap-3 rounded-2xl bg-white/85 p-5 sm:gap-4 sm:p-7"
            >
              <CircleCheck className="mt-1 size-6 shrink-0 text-teal-text" strokeWidth={1.9} aria-hidden="true" />
              <p className="type-lead text-ink">{objective}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

export default function ObjectivesPage() {
  const { hero, groups, summary } = objectives
  usePageMeta({ title: hero.title, description: hero.intro })

  return (
    <>
      <PageHero title={hero.title} intro={hero.intro} aside={<ThemeIndex groups={groups} />} />

      <div className={`container-page ${SECTION_SPACING}`}>
        {/* pt offsets the panels' negative top margin, so the gap below the header matches other pages. */}
        <div className="space-y-16 pt-6 sm:space-y-20 sm:pt-10">
          {groups.map((group, index) => (
            <ObjectiveGroup key={group.id} group={group} index={index} isLast={index === groups.length - 1} />
          ))}
        </div>

        <Reveal className="mt-16 sm:mt-20">
          <div className="gradient-border relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-mist px-8 py-12 text-center sm:px-14 sm:py-14">
            <p className="type-lead text-navy-900">{summary}</p>
          </div>
        </Reveal>
      </div>
    </>
  )
}
