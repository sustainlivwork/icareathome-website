import contact from '../content/pages/contact.json'
import { getPartner, people } from '../lib/content.js'
import { usePageMeta } from '../lib/meta.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Section } from '../components/ui/Section.jsx'
import PersonCard from '../components/people/PersonCard.jsx'
import PartnerLogo from '../components/media/PartnerLogo.jsx'
import { Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'

export default function ContactPage() {
  const { hero, coordinator } = contact
  usePageMeta({ title: hero.title, description: hero.intro })
  const partner = getPartner(coordinator.partner)

  return (
    <>
      <PageHero title={hero.title} intro={hero.intro} />

      <Section>
        <RevealGroup className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),26rem))]">
          {people.map((person) => (
            <RevealItem key={person.id ?? person.name} className="h-full">
              <PersonCard person={person} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="mist" labelledBy="coordinator-heading">
        <Reveal className="grid overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line md:grid-cols-12">
          {partner && (
            <div className="flex items-center justify-center border-b border-line px-10 py-10 md:col-span-4 md:border-r md:border-b-0">
              <PartnerLogo partner={partner} height={104} className="w-full max-w-[16rem]" />
            </div>
          )}
          <div className={`p-8 sm:p-10 lg:p-12 ${partner ? 'md:col-span-8' : 'md:col-span-12'}`}>
            <h2 id="coordinator-heading" className="type-heading">
              {coordinator.heading}
            </h2>
            <p className="mt-3 type-subheading text-teal-text">{coordinator.name}</p>
            <p className="mt-4 max-w-2xl type-body text-ink-muted">{coordinator.text}</p>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
