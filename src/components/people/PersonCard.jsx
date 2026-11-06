import { Building2, ExternalLink, Mail, Phone, Video } from 'lucide-react'
import Avatar from '../media/Avatar.jsx'

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

/**
 * Profile card for one entry of src/content/people.json: large photo, name,
 * email and short description first; other details below. Empty fields are not shown.
 */
export default function PersonCard({ person, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`
  const hasDetails = person.phone || person.note || person.profileUrl

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft">
      <Avatar
        name={person.name}
        photo={person.photo}
        position={person.photoPosition}
        className="aspect-square w-full shrink-0"
      />

      <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-7">
        <Heading className="type-subheading">{person.name}</Heading>
        {person.role && <p className="mt-1.5 type-small font-semibold text-teal-text">{person.role}</p>}
        {person.institution && (
          <p className="mt-1 flex items-start gap-2 type-small text-ink-muted">
            <Building2 className="mt-[0.2rem] size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
            {person.institution}
          </p>
        )}

        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="mt-4 inline-flex items-start gap-2.5 font-semibold text-blue-text underline-offset-4 [overflow-wrap:anywhere] hover:underline"
          >
            <Mail className="mt-1 size-[1.1rem] shrink-0" aria-hidden="true" />
            <span>
              <span className="sr-only">Email: </span>
              {person.email}
            </span>
          </a>
        )}

        {person.bio && <p className="mt-4 type-body text-ink-muted">{person.bio}</p>}

        {hasDetails && (
          <div className="mt-auto pt-6">
            <ul className="space-y-2 border-t border-line pt-5 type-small text-ink-muted">
              {person.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                  <a href={telHref(person.phone)} className="text-ink underline-offset-4 hover:underline">
                    <span className="sr-only">Phone: </span>
                    {person.phone}
                  </a>
                </li>
              )}
              {person.note && (
                <li className="flex items-start gap-3">
                  <Video className="mt-1 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                  {person.note}
                </li>
              )}
              {person.profileUrl && (
                <li className="flex items-start gap-3">
                  <ExternalLink className="mt-1 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                  <a
                    href={person.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-text underline-offset-4 hover:underline"
                  >
                    Profile<span className="sr-only"> of {person.name} (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}
