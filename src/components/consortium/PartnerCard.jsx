import { ArrowUpRight, MapPin } from 'lucide-react'
import PartnerLogo from '../media/PartnerLogo.jsx'

function PartnerLink({ partner }) {
  if (!partner.url) return null
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1 font-display text-sm font-bold text-blue-text underline-offset-4 hover:underline"
    >
      Website
      <ArrowUpRight className="size-4" aria-hidden="true" />
      <span className="sr-only">of {partner.name} (opens in a new tab)</span>
    </a>
  )
}

function Country({ partner }) {
  return (
    <p className="flex items-center gap-1.5 type-small text-ink-muted">
      <MapPin className="size-4 text-teal-text" aria-hidden="true" />
      {partner.country}
    </p>
  )
}

/** Large card for the project coordinator. */
export function CoordinatorCard({ partner }) {
  return (
    <article className="gradient-border relative grid overflow-hidden rounded-3xl bg-white shadow-lift md:grid-cols-12">
      <div className="flex items-center justify-center border-b border-line bg-white px-10 py-10 md:col-span-5 md:border-r md:border-b-0 lg:px-14">
        <PartnerLogo partner={partner} height={120} className="w-full max-w-xs" />
      </div>
      <div className="relative flex flex-col justify-center gap-3 bg-brand-gradient-soft p-8 sm:p-10 md:col-span-7">
        <span className="w-fit rounded-full bg-navy-900 px-3.5 py-1 font-display text-[0.8125rem] font-bold tracking-wide text-white">
          {partner.role}
        </span>
        <h3 className="type-subheading">{partner.name}</h3>
        <Country partner={partner} />
        <PartnerLink partner={partner} />
      </div>
    </article>
  )
}

export default function PartnerCard({ partner }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft">
      <div className="flex h-36 items-center justify-center border-b border-line bg-white px-7">
        <PartnerLogo partner={partner} height={84} className="w-full" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Country partner={partner} />
        <h3 className="mt-2 type-subheading">{partner.name}</h3>
        <p className="mt-auto pt-4">
          <span className="inline-block rounded-full bg-tint px-3 py-1 text-[0.8125rem] font-semibold text-teal-text">{partner.role}</span>
        </p>
        <PartnerLink partner={partner} />
      </div>
    </article>
  )
}
