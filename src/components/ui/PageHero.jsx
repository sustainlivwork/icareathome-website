import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ trail = [], current }) {
  const items = [{ label: 'Home', to: '/' }, ...trail]
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 type-small text-ink-muted">
        {items.map((item) => (
          <li key={item.to} className="flex items-center gap-1.5">
            <Link to={item.to} className="rounded font-medium hover:text-navy-900 hover:underline">
              {item.label}
            </Link>
            <ChevronRight className="size-3.5 text-ink-subtle" aria-hidden="true" />
          </li>
        ))}
        <li aria-current="page" className="font-semibold text-navy-900">
          {current}
        </li>
      </ol>
    </nav>
  )
}

/** Soft brand-coloured light and "sensing" rings behind page headers. */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-48 -right-40 size-[38rem] rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="absolute top-24 -right-10 size-[26rem] rounded-full bg-brand-teal/15 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 size-[30rem] rounded-full bg-brand-blue/10 blur-3xl" />
      <div className="absolute inset-0 dot-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <svg
        viewBox="0 0 600 600"
        className="absolute top-1/2 -right-48 hidden h-[44rem] w-[44rem] -translate-y-1/2 text-navy-900 md:block lg:-right-24"
      >
        {[80, 140, 200, 260, 290].map((r, i) => (
          <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeOpacity={0.09 - i * 0.012} strokeWidth="1.25" />
        ))}
      </svg>
    </div>
  )
}

/** Header of every inner page: breadcrumb, title (h1) and introduction. */
export default function PageHero({ title, intro, trail, current, aside, children }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-mist">
      <HeroBackdrop />
      <div className="container-page relative pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pb-20">
        <Breadcrumbs trail={trail} current={current ?? title} />
        <div className="mt-10 grid items-end gap-10 sm:mt-14 lg:grid-cols-12">
          <div className={aside ? 'lg:col-span-7' : 'lg:col-span-9'}>
            <h1 className="animate-fade-up type-title">
              {title}
            </h1>
            {intro && (
              <p className="mt-6 max-w-2xl animate-fade-up type-lead text-ink-muted [animation-delay:90ms]">
                {intro}
              </p>
            )}
          </div>
          {aside && <div className="animate-fade-up [animation-delay:160ms] lg:col-span-5">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  )
}
