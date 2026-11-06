import { dayOfMonth, monthShort, yearOf } from '../../lib/dates.js'
import SmartImage from './SmartImage.jsx'

/** Branded artwork used when an event has no cover photo (or it is missing). */
export function EventCoverPlaceholder({ date, compact = false }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-navy-900" aria-hidden="true">
      <div className="absolute inset-0 bg-brand-gradient opacity-75" />
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-white">
        {[60, 110, 160, 210, 260].map((r) => (
          <circle key={r} cx="330" cy="40" r={r} fill="none" stroke="currentColor" strokeOpacity={0.22 - r / 2000} strokeWidth="1.5" />
        ))}
        <path d="M40 210 L95 165 L150 210" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {date && (
        <div className="relative text-center text-white">
          <div className={`font-display font-extrabold leading-none tracking-tight ${compact ? 'text-4xl' : 'text-6xl'}`}>
            {dayOfMonth(date)}
          </div>
          <div className={`mt-1 font-display font-semibold uppercase tracking-[0.2em] ${compact ? 'text-xs' : 'text-sm'}`}>
            {monthShort(date)} {yearOf(date)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function EventCover({ event, sizes, priority = false, compact = false }) {
  return (
    <SmartImage
      src={event.coverImage}
      alt={event.coverAlt || ''}
      sizes={sizes}
      priority={priority}
      fallback={<EventCoverPlaceholder date={event.date} compact={compact} />}
    />
  )
}
