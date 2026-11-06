// Single entry point for all structured content. Components import from here
// rather than reaching into the content folder directly.
import events from 'virtual:events'
import site from '../content/site.json'
import partners from '../content/partners.json'
import people from '../content/people.json'

export { events, site, partners, people }

const partnersById = new Map(partners.map((partner) => [partner.id, partner]))

export function getPartner(id) {
  return partnersById.get(id) ?? null
}

export function getEvent(slug) {
  return events.find((event) => event.slug === slug) ?? null
}

/** Neighbouring events in the (newest-first) list, for previous/next links. */
export function getAdjacentEvents(slug) {
  const index = events.findIndex((event) => event.slug === slug)
  if (index === -1) return { newer: null, older: null }
  return { newer: events[index - 1] ?? null, older: events[index + 1] ?? null }
}

/** Groups events by the year of their start date, keeping newest-first order. */
export function groupEventsByYear(list = events) {
  const groups = []
  for (const event of list) {
    const year = event.date.slice(0, 4)
    const group = groups.at(-1)
    if (group?.year === year) group.events.push(event)
    else groups.push({ year, events: [event] })
  }
  return groups
}
