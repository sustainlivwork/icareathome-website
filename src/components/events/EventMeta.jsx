import { CalendarDays, MapPin } from 'lucide-react'
import { formatDateRange } from '../../lib/dates.js'

export function EventDate({ event, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <CalendarDays className="size-4 shrink-0 text-teal-text" aria-hidden="true" />
      <time dateTime={event.date}>{formatDateRange(event.date, event.endDate)}</time>
    </span>
  )
}

export function EventLocation({ event, className = '' }) {
  if (!event.location) return null
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <MapPin className="size-4 shrink-0 text-teal-text" aria-hidden="true" />
      {event.location}
    </span>
  )
}

export function EventTags({ event, className = '' }) {
  if (!event.tags.length && !event.draft) return null
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {event.draft && (
        <li className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-900 uppercase">
          Draft: not published
        </li>
      )}
      {event.tags.map((tag) => (
        <li key={tag} className="rounded-full bg-tint px-3 py-1 text-[0.8125rem] font-semibold text-teal-text">
          {tag}
        </li>
      ))}
    </ul>
  )
}
