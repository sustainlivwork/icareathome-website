import { Globe, Landmark, UsersRound } from 'lucide-react'
import home from '../content/pages/home.json'
import eventsPage from '../content/pages/events.json'
import { events, partners, site } from '../lib/content.js'
import { getIcon } from '../lib/icons.js'
import { usePageMeta } from '../lib/meta.jsx'
import { Section, SectionHeading, SECTION_SPACING } from '../components/ui/Section.jsx'
import ButtonLink, { ArrowLink } from '../components/ui/ButtonLink.jsx'
import RichText from '../components/ui/RichText.jsx'
import { Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'
import CountUp from '../components/motion/CountUp.jsx'
import PartnerLogo from '../components/media/PartnerLogo.jsx'
import EventCard from '../components/events/EventCard.jsx'
import IconTile from '../components/ui/IconTile.jsx'
import HomeHero from '../components/home/HomeHero.jsx'

function WhyItMatters() {
  const { heading, stats } = home.whyItMatters
  return (
    <section aria-labelledby="why-heading" className="bg-white">
      <div className={`container-page grid items-center gap-12 ${SECTION_SPACING} lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <SectionHeading id="why-heading" title={heading} />
        </div>
        <RevealGroup as="dl" className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="flex flex-col-reverse justify-end rounded-3xl bg-mist p-8 ring-1 ring-line lg:p-9"
            >
              <dt className="mt-3 type-body text-ink-muted">{stat.label}</dt>
              <dd className="type-title">
                <span className="text-gradient-deep">
                  <CountUp value={stat.value} />
                </span>
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function Overview() {
  const { heading, text } = home.overview
  const vision = home.vision
  return (
    <Section tone="wash" labelledBy="overview-heading">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionHeading id="overview-heading" title={heading} />
          <Reveal>
            <p className="mt-8 type-lead text-ink-muted">
              <RichText
                text={text}
                strongClassName="font-semibold text-navy-900 [background:linear-gradient(transparent_64%,rgb(36_183_197/0.22)_0)]"
              />
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink to="/objectives/">Objectives</ArrowLink>
              <ArrowLink to="/work-packages/">Work Packages</ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal>
            <h3 id="vision-heading" className="type-subheading">
              {vision.heading}
            </h3>
          </Reveal>
          <RevealGroup as="ul" aria-labelledby="vision-heading" className="mt-6 grid gap-4 sm:grid-cols-2">
            {vision.items.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-line sm:p-7"
              >
                <IconTile icon={getIcon(item.icon)} />
                <h4 className="mt-5 type-subheading">{item.title}</h4>
                <p className="mt-1.5 type-body text-ink-muted">{item.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  )
}

const CONSORTIUM_ICONS = [UsersRound, Globe, Landmark]

function Consortium() {
  const { heading, items } = home.consortium
  return (
    <Section tone="tint" labelledBy="consortium-heading">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading id="consortium-heading" title={heading} />
          <RevealGroup as="ul" className="mt-10 space-y-6">
            {items.map((item, index) => {
              const Icon = CONSORTIUM_ICONS[index % CONSORTIUM_ICONS.length]
              return (
                <RevealItem as="li" key={item.title} className="flex items-start gap-4">
                  <IconTile icon={Icon} className="bg-white" />
                  <div>
                    <p className="type-subheading text-navy-900">{item.title}</p>
                    <p className="type-body text-ink-muted">{item.text}</p>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
          <div className="mt-10">
            <ButtonLink to="/consortium/" variant="secondary">
              Project Partners
            </ButtonLink>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3 self-center sm:grid-cols-3 sm:gap-4 lg:col-span-7">
          {partners.map((partner) => (
            <li
              key={partner.id}
              className="flex h-28 items-center justify-center rounded-2xl bg-white px-5 shadow-soft ring-1 ring-line/60 sm:h-32"
            >
              <PartnerLogo partner={partner} height={64} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function LatestEvents() {
  const [first, ...rest] = events.slice(0, 3)
  return (
    <Section labelledBy="events-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="events-heading" title={eventsPage.hero.title} intro={eventsPage.hero.intro} />
        <ArrowLink to="/events/">All events</ArrowLink>
      </div>
      {first ? (
        <div className={`mt-12 grid gap-6 ${rest.length ? 'lg:grid-cols-12' : ''}`}>
          <Reveal className={rest.length ? 'lg:col-span-7' : ''}>
            <EventCard event={first} layout={rest.length ? 'vertical' : 'horizontal'} />
          </Reveal>
          {rest.length > 0 && (
            <RevealGroup as="ul" className="flex flex-col gap-4 lg:col-span-5">
              {rest.map((event) => (
                <RevealItem as="li" key={event.slug}>
                  <EventCard event={event} layout="compact" />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      ) : (
        <Reveal className="mt-12 rounded-3xl bg-mist p-10 text-center text-ink-muted ring-1 ring-line">
          {eventsPage.ongoing.text}
        </Reveal>
      )}
    </Section>
  )
}

export default function HomePage() {
  usePageMeta({ title: site.name, description: home.hero.description })
  return (
    <>
      <HomeHero />
      <WhyItMatters />
      <Overview />
      <LatestEvents />
      <Consortium />
    </>
  )
}
