import { usePageMeta } from '../lib/meta.jsx'
import ButtonLink from '../components/ui/ButtonLink.jsx'
import { HeroBackdrop } from '../components/ui/PageHero.jsx'

function NotFoundMeta() {
  usePageMeta({ title: 'Page not found', noindex: true })
  return null
}

export default function NotFoundPage({ withMeta = true }) {
  return (
    <section className="relative isolate overflow-hidden bg-mist">
      {withMeta && <NotFoundMeta />}
      <HeroBackdrop />
      <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p aria-hidden="true" className="font-display text-8xl font-extrabold tracking-tight sm:text-9xl">
          <span className="text-gradient-deep">404</span>
        </p>
        <h1 className="mt-4 type-title">Page not found</h1>
        <ButtonLink to="/" className="mt-10">
          Home
        </ButtonLink>
      </div>
    </section>
  )
}
