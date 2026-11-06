import { Link } from 'react-router'
import { ArrowUp, Mail, Phone } from 'lucide-react'
import { people, site } from '../../lib/content.js'
import { assetUrl } from '../../lib/assets.js'

export function FundingAcknowledgement({ className = '' }) {
  return (
    <div className={`rounded-2xl bg-white p-6 text-ink sm:p-8 ${className}`}>
      <h2 className="sr-only">Funding</h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-5">
          {site.funding.logos.map((logo) => (
            <li key={logo.src}>
              <img
                src={assetUrl(logo.src)}
                alt={logo.alt}
                style={{ height: logo.height }}
                className="w-auto max-w-full"
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed text-ink-muted lg:max-w-xl lg:border-l lg:border-line lg:pl-10">
          {site.funding.statement}
        </p>
      </div>
    </div>
  )
}

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

export default function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#0b285f_0%,#0a2454_55%,#081d47_100%)] text-slate-300">
      <div className="h-1 bg-brand-gradient" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 -z-10 size-[36rem] rounded-full bg-brand-purple/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-24 -z-10 size-[30rem] rounded-full bg-brand-teal/12 blur-3xl" />

      <div className="container-page pt-16 pb-10 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <nav aria-labelledby="footer-pages" className="lg:col-span-5">
            <h2 id="footer-pages" className="eyebrow text-slate-400">
              Pages
            </h2>
            <ul className="mt-5 grid w-fit grid-flow-col grid-rows-4 gap-x-14 gap-y-3">
              {site.navigation.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="rounded text-slate-300 transition hover:text-white hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-7">
            <h2 className="eyebrow text-slate-400">Contact</h2>
            <ul className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {people.map((person) => (
                <li key={person.id ?? person.name}>
                  <p className="font-semibold text-white">{person.name}</p>
                  {person.institution && <p className="mt-0.5 type-small text-slate-400">{person.institution}</p>}
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="mt-2 inline-flex items-center gap-2 [overflow-wrap:anywhere] text-slate-300 transition hover:text-white hover:underline"
                    >
                      <Mail className="size-4 shrink-0 text-brand-teal" aria-hidden="true" />
                      {person.email}
                    </a>
                  )}
                  {person.phone && (
                    <a
                      href={telHref(person.phone)}
                      className="mt-1 flex w-fit items-center gap-2 text-slate-300 transition hover:text-white hover:underline"
                    >
                      <Phone className="size-4 shrink-0 text-brand-teal" aria-hidden="true" />
                      {person.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FundingAcknowledgement className="mt-14" />

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{site.name}</p>
          <a href="#top" className="inline-flex w-fit items-center gap-2 rounded font-semibold text-slate-300 transition hover:text-white">
            <ArrowUp className="size-4" aria-hidden="true" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
