// Dates in content files are written as YYYY-MM-DD and shown as "April 23, 2026".
// They are treated as calendar dates (no time zone), so every visitor sees the same day.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parts(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month, day }
}

export function formatDate(isoDate) {
  const { year, month, day } = parts(isoDate)
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

/** "April 23–24, 2026" · "April 30 – May 2, 2026" · "December 30, 2026 – January 2, 2027" */
export function formatDateRange(start, end) {
  if (!end || end === start) return formatDate(start)
  const a = parts(start)
  const b = parts(end)
  if (a.year === b.year && a.month === b.month) return `${MONTHS[a.month - 1]} ${a.day}–${b.day}, ${a.year}`
  if (a.year === b.year) return `${MONTHS[a.month - 1]} ${a.day} – ${MONTHS[b.month - 1]} ${b.day}, ${a.year}`
  return `${formatDate(start)} – ${formatDate(end)}`
}

export function monthShort(isoDate) {
  return MONTHS[parts(isoDate).month - 1].slice(0, 3)
}

export function dayOfMonth(isoDate) {
  return parts(isoDate).day
}

export function yearOf(isoDate) {
  return parts(isoDate).year
}
