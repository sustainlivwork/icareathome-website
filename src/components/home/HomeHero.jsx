import { ImageIcon } from 'lucide-react'
import home from '../../content/pages/home.json'
import { site } from '../../lib/content.js'
import { assetUrl } from '../../lib/assets.js'
import ButtonLink from '../ui/ButtonLink.jsx'
import SmartImage from '../media/SmartImage.jsx'

// Home page hero: text on the left, a home photograph filling the right half
// of the screen. The photo is set in src/content/pages/home.json → hero.image.

/** "Cares" in the heading gets the brand gradient; the text itself is unchanged. */
function Heading({ text }) {
  const index = text.indexOf('Cares')
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <span className="text-gradient-deep">Cares</span>
      {text.slice(index + 'Cares'.length)}
    </>
  )
}

/** Shown until a real photograph is added (the build prints a reminder). */
function PhotoPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#e6e0fa_0%,#dde5fa_42%,#d3ece6_100%)]"
    >
      {/* Soft "daylight through a window" and a gentle floor shadow, to read as a photo slot */}
      <div className="absolute -top-1/4 right-[14%] h-[150%] w-[30%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.7)_45%,transparent)] blur-2xl" />
      <div className="absolute -top-1/4 right-[50%] h-[150%] w-[14%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.5)_50%,transparent)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(11_40_95/0.12),transparent)]" />
      <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-soft ring-1 ring-white backdrop-blur-sm sm:bottom-8 sm:left-8 lg:left-10">
        <ImageIcon className="size-5 shrink-0 text-blue-text" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-navy-900">Photo placeholder</p>
          <p className="mt-0.5 text-[0.8125rem] text-ink-muted">Older adult at home, natural daylight</p>
        </div>
      </div>
    </div>
  )
}

function HeroPhoto({ image }) {
  if (!image?.src) return <PhotoPlaceholder />
  return (
    <>
      <SmartImage
        src={image.src}
        alt={image.alt || ''}
        sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 100vw"
        position={image.position || 'center'}
        priority
        className="animate-settle"
        fallback={<PhotoPlaceholder />}
      />
      {/* Gentle colour grade so any photo sits within the brand palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(167_139_250/0.14),transparent_45%,rgb(23_193_136/0.12))] mix-blend-multiply"
      />
    </>
  )
}

export default function HomeHero() {
  const { tagline, description, image } = home.hero
  const euLogo = site.funding.logos[0]

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[linear-gradient(115deg,#f7f5ff_0%,#f3f6ff_48%,#eef9f5_100%)]"
    >
      {/* Text and photo share one centred grid, so the layout keeps its proportions at
          every screen width and zoom level. The photo is shown above the text on phones. */}
      <div className="container-page grid items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-16 xl:gap-14">
        <div className="relative order-first aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-tint shadow-lift sm:aspect-[16/10] lg:order-last lg:col-span-6 lg:aspect-[4/3] xl:col-span-7 lg:rounded-[2.25rem] xl:aspect-[16/11]">
          <HeroPhoto image={image} />
        </div>

        <div className="lg:col-span-6 xl:col-span-5">
          <h1
            id="hero-heading"
            className="animate-fade-up type-title"
          >
            <Heading text={tagline} />
          </h1>
          <p className="mt-5 max-w-xl animate-fade-up type-lead text-ink-muted [animation-delay:120ms]">
            {description}
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:180ms]">
            <ButtonLink to="/about/">About the Project</ButtonLink>
            <ButtonLink to="/work-packages/" variant="secondary">
              Work Packages
            </ButtonLink>
          </div>
          {euLogo && (
            <img
              src={assetUrl(euLogo.src)}
              alt={euLogo.alt}
              width="4119"
              height="919"
              className="mt-10 h-9 w-auto animate-fade-up [animation-delay:240ms] lg:mt-12"
              decoding="async"
            />
          )}
        </div>
      </div>
    </section>
  )
}
