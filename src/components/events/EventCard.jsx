import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import EventCover from '../media/EventCover.jsx'
import { EventDate, EventLocation, EventTags } from './EventMeta.jsx'

const eventPath = (event) => `/events/${event.slug}/`

/**
 * Preview of an event. The whole card is clickable (via the title link).
 *  layout="horizontal" – image beside the text (events page, featured)
 *  layout="vertical"   – image above the text
 *  layout="compact"    – small thumbnail, title and date only
 */
export default function EventCard({ event, layout = 'vertical', headingLevel = 3, priority = false }) {
  const Heading = `h${headingLevel}`

  if (layout === 'compact') {
    return (
      <article className="group relative flex items-center gap-5 rounded-2xl bg-white p-3 pr-5 ring-1 ring-line transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
          <EventCover event={event} sizes="112px" compact />
        </div>
        <div className="min-w-0">
          <EventDate event={event} className="type-small text-ink-muted" />
          <Heading className="mt-1.5 type-subheading">
            <Link to={eventPath(event)} className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-['']">
              {event.title}
            </Link>
          </Heading>
        </div>
      </article>
    )
  }

  const horizontal = layout === 'horizontal'
  return (
    <article
      className={`group relative flex overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft transition duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift ${
        horizontal ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-tint ${
          horizontal ? 'aspect-[16/10] md:aspect-auto md:w-[44%] md:min-h-72' : 'aspect-[16/10]'
        }`}
      >
        <div className="absolute inset-0 transition duration-700 ease-out-soft group-hover:scale-[1.03]">
          <EventCover
            event={event}
            priority={priority}
            sizes={horizontal ? '(min-width: 768px) 440px, 100vw' : '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw'}
          />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${horizontal ? 'p-6 sm:p-8 lg:p-10' : 'p-6 sm:p-7'}`}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 type-small text-ink-muted">
          <EventDate event={event} />
          <EventLocation event={event} />
        </div>
        <Heading className="mt-3 type-subheading">
          <Link
            to={eventPath(event)}
            className="rounded after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:text-blue-text"
          >
            {event.title}
          </Link>
        </Heading>
        {event.summary && (
          <p className={`mt-3 type-body text-ink-muted ${horizontal ? 'line-clamp-4' : 'line-clamp-3'}`}>{event.summary}</p>
        )}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <EventTags event={event} />
          <span aria-hidden="true" className="ml-auto inline-flex items-center gap-1.5 font-display font-bold text-blue-text">
            Read more
            <ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  )
}
