import { CalendarClock, RefreshCw } from 'lucide-react'
import eventsPage from '../content/pages/events.json'
import { events, groupEventsByYear } from '../lib/content.js'
import { usePageMeta } from '../lib/meta.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Section } from '../components/ui/Section.jsx'
import EventCard from '../components/events/EventCard.jsx'
import { Reveal } from '../components/motion/Reveal.jsx'
import IconTile from '../components/ui/IconTile.jsx'

function EmptyState() {
  return (
    <Reveal className="mx-auto max-w-2xl rounded-3xl bg-mist p-10 text-center ring-1 ring-line sm:p-14">
      <IconTile icon={CalendarClock} size="lg" className="bg-white" />
      <h2 className="mt-6 type-subheading">No events published yet</h2>
    </Reveal>
  )
}

export default function EventsPage() {
  const { hero, ongoing } = eventsPage
  usePageMeta({ title: hero.title, description: hero.intro })
  const groups = groupEventsByYear(events)

  return (
    <>
      <PageHero title={hero.title} intro={hero.intro} current="Events" />

      <Section>
        {groups.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {groups.map((group, groupIndex) => (
              <section key={group.year} aria-labelledby={`year-${group.year}`} className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-2">
                  <h2
                    id={`year-${group.year}`}
                    className="type-heading lg:sticky lg:top-32"
                  >
                    <span className="text-gradient-deep">{group.year}</span>
                  </h2>
                </div>
                <ol className="relative space-y-8 border-l-2 border-line pl-6 sm:pl-10 lg:col-span-10">
                  {group.events.map((event, index) => (
                    <Reveal as="li" key={event.slug} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-10 -left-[calc(1.5rem+9px)] size-4 rounded-full bg-brand-gradient ring-4 ring-white sm:-left-[calc(2.5rem+9px)]"
                      />
                      <EventCard event={event} layout="horizontal" priority={groupIndex === 0 && index === 0} />
                    </Reveal>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </Section>

      <Section tone="mist" labelledBy="ongoing-heading">
        <Reveal className="gradient-border relative mx-auto flex max-w-4xl flex-col items-center gap-6 overflow-hidden rounded-3xl bg-white p-8 text-center sm:p-12">
          <IconTile icon={RefreshCw} size="lg" />
          <h2 id="ongoing-heading" className="type-heading">
            {ongoing.heading}
          </h2>
          <p className="max-w-2xl type-body text-ink-muted">{ongoing.text}</p>
        </Reveal>
      </Section>
    </>
  )
}
