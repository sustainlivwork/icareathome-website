import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from 'lucide-react'
import { getAdjacentEvents, getEvent } from '../lib/content.js'
import { assetUrl } from '../lib/assets.js'
import { usePageMeta } from '../lib/meta.jsx'
import { Breadcrumbs, HeroBackdrop } from '../components/ui/PageHero.jsx'
import { Section, SectionHeading, SECTION_SPACING } from '../components/ui/Section.jsx'
import SmartImage from '../components/media/SmartImage.jsx'
import Gallery from '../components/media/Gallery.jsx'
import EventCard from '../components/events/EventCard.jsx'
import { EventDate, EventLocation, EventTags } from '../components/events/EventMeta.jsx'
import { Reveal } from '../components/motion/Reveal.jsx'
import NotFoundPage from './NotFoundPage.jsx'

function BackLink({ className = '' }) {
  return (
    <Link
      to="/events/"
      className={`group inline-flex items-center gap-2 font-display font-bold text-blue-text underline-offset-4 hover:underline ${className}`}
    >
      <ArrowLeft className="size-4 transition-transform duration-300 ease-out-soft group-hover:-translate-x-1" aria-hidden="true" />
      Back to Events
    </Link>
  )
}

function Resources({ event }) {
  if (!event.links.length && !event.attachments.length) return null
  return (
    <div className="space-y-8 rounded-3xl bg-mist p-7 ring-1 ring-line lg:sticky lg:top-32">
      {event.links.length > 0 && (
        <div>
          <h2 className="eyebrow text-ink-subtle">Links</h2>
          <ul className="mt-4 space-y-3">
            {event.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 font-semibold text-blue-text underline-offset-4 hover:underline"
                >
                  <ArrowUpRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {event.attachments.length > 0 && (
        <div>
          <h2 className="eyebrow text-ink-subtle">Documents</h2>
          <ul className="mt-4 space-y-3">
            {event.attachments.map((file) => (
              <li key={file.file}>
                <a
                  href={assetUrl(file.file)}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line transition hover:shadow-soft hover:ring-line-strong"
                  {...(file.type === 'PDF' ? { target: '_blank', rel: 'noopener' } : { download: '' })}
                >
                  <FileText className="mt-0.5 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-navy-900">{file.label}</span>
                    {file.type && <span className="type-small text-ink-muted">{file.type}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function EventDetailPage() {
  const { slug } = useParams()
  const event = getEvent(slug)
  usePageMeta(
    event
      ? { title: event.title, description: event.summary, image: event.coverImage }
      : { title: 'Page not found', noindex: true },
  )
  if (!event) return <NotFoundPage withMeta={false} />

  const { newer, older } = getAdjacentEvents(event.slug)
  const hasResources = event.links.length > 0 || event.attachments.length > 0

  return (
    <article>
      <header className="relative isolate overflow-hidden border-b border-line bg-mist">
        <HeroBackdrop />
        <div className={`container-page relative pt-8 ${event.coverImage ? 'pb-40 sm:pb-52' : 'pb-16 sm:pb-20'}`}>
          <Breadcrumbs trail={[{ label: 'Events', to: '/events/' }]} current={event.title} />
          <div className="mt-10 max-w-4xl sm:mt-14">
            <EventTags event={event} className="animate-fade-up" />
            <h1 className="mt-5 animate-fade-up type-title [animation-delay:60ms]">
              {event.title}
            </h1>
            <p className="mt-6 flex animate-fade-up flex-wrap gap-x-8 gap-y-2 type-body text-ink-muted [animation-delay:120ms]">
              <EventDate event={event} />
              <EventLocation event={event} />
            </p>
          </div>
        </div>
      </header>

      {event.coverImage && (
        <div className="container-page relative -mt-28 sm:-mt-40">
          <div className="mx-auto aspect-[16/9] max-w-5xl animate-fade-up overflow-hidden rounded-3xl bg-tint shadow-lift [animation-delay:160ms]">
            <SmartImage
              src={event.coverImage}
              alt={event.coverAlt}
              sizes="(min-width: 1100px) 1024px, 100vw"
              priority
              fallback={<div className="h-full w-full bg-brand-gradient-soft" aria-hidden="true" />}
            />
          </div>
        </div>
      )}

      <div className={`container-page ${SECTION_SPACING}`}>
        <div className={`mx-auto grid max-w-6xl gap-12 ${hasResources ? 'lg:grid-cols-12' : ''}`}>
          <div className={hasResources ? 'lg:col-span-8' : 'mx-auto w-full max-w-3xl'}>
            {event.html ? (
              <Reveal>
                <div className="prose-care" dangerouslySetInnerHTML={{ __html: event.html }} />
              </Reveal>
            ) : (
              event.summary && <p className="type-lead text-ink-muted">{event.summary}</p>
            )}
            <BackLink className="mt-12" />
          </div>
          {hasResources && (
            <aside className="lg:col-span-4">
              <Resources event={event} />
            </aside>
          )}
        </div>
      </div>

      {event.gallery.length > 0 && (
        <Section tone="mist" labelledBy="gallery-heading">
          <SectionHeading id="gallery-heading" title="Photo gallery" />
          <div className="mt-10">
            <Gallery images={event.gallery} title={event.title} />
          </div>
        </Section>
      )}

      {(newer || older) && (
        <nav aria-label="More events" className="border-t border-line bg-white">
          <div className={`container-page grid gap-6 ${SECTION_SPACING} md:grid-cols-2`}>
            {newer ? (
              <div>
                <p className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-ink-muted">
                  <ArrowLeft className="size-4" aria-hidden="true" /> Newer event
                </p>
                <EventCard event={newer} layout="compact" headingLevel={2} />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
            {older && (
              <div>
                <p className="mb-3 flex items-center justify-end gap-2 font-display text-sm font-bold text-ink-muted">
                  Older event <ArrowRight className="size-4" aria-hidden="true" />
                </p>
                <EventCard event={older} layout="compact" headingLevel={2} />
              </div>
            )}
          </div>
        </nav>
      )}
    </article>
  )
}
