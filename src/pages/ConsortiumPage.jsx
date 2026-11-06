import consortium from '../content/pages/consortium.json'
import { partners } from '../lib/content.js'
import { usePageMeta } from '../lib/meta.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Section, SectionHeading } from '../components/ui/Section.jsx'
import PartnerCard, { CoordinatorCard } from '../components/consortium/PartnerCard.jsx'
import { Reveal } from '../components/motion/Reveal.jsx'

function SummaryStats({ summary }) {
  return (
    <dl className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line">
      {summary.map((item) => (
        <div key={item.label} className="flex flex-col-reverse items-center px-3 py-6 text-center sm:py-7">
          <dt className="mt-1 type-small font-medium text-ink-muted">{item.label}</dt>
          <dd className="type-title">
            <span className="text-gradient-deep">{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default function ConsortiumPage() {
  const { hero, summary, partnersHeading } = consortium
  usePageMeta({ title: hero.title, description: hero.intro })

  const coordinator = partners.find((partner) => partner.coordinator)
  const others = partners.filter((partner) => partner !== coordinator)

  return (
    <>
      <PageHero title={hero.title} intro={hero.intro} aside={<SummaryStats summary={summary} />} />

      <Section labelledBy="partners-heading">
        <SectionHeading id="partners-heading" title={partnersHeading} />
        {coordinator && (
          <Reveal className="mt-14">
            <CoordinatorCard partner={coordinator} />
          </Reveal>
        )}
        <Reveal as="ul" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((partner) => (
            <li key={partner.id} className="h-full">
              <PartnerCard partner={partner} />
            </li>
          ))}
        </Reveal>
      </Section>
    </>
  )
}
