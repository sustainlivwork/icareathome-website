import about from '../content/pages/about.json'
import { getIcon } from '../lib/icons.js'
import { usePageMeta } from '../lib/meta.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import TableOfContents from '../components/ui/TableOfContents.jsx'
import { SECTION_SPACING } from '../components/ui/Section.jsx'
import { Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'
import IconTile from '../components/ui/IconTile.jsx'
import NumberedHeading from '../components/ui/NumberedHeading.jsx'

/** Heading, a larger first paragraph (lead) and regular paragraphs — the same for every section. */
function TextSection({ id, heading, index, lead, paragraphs = [] }) {
  return (
    <Reveal as="section" id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-32">
      <NumberedHeading id={`${id}-heading`} index={index}>
        {heading}
      </NumberedHeading>
      <div className="mt-6 max-w-[68ch] space-y-5">
        <p className="type-lead text-navy-900">{lead}</p>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="type-body text-ink-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </Reveal>
  )
}

export default function AboutPage() {
  const { hero, sections, vision, impact } = about
  usePageMeta({ title: hero.title, description: hero.intro })

  const toc = [
    ...sections.map((section) => ({ id: section.id, label: section.heading })),
    { id: vision.id, label: vision.heading },
    { id: impact.id, label: impact.heading },
  ]

  return (
    <>
      <PageHero title={hero.title} intro={hero.intro} />

      <div className={`container-page grid gap-12 ${SECTION_SPACING} lg:grid-cols-12 lg:gap-10`}>
        <aside className="hidden lg:col-span-3 lg:block">
          <TableOfContents items={toc} />
        </aside>

        <div className="space-y-16 sm:space-y-20 lg:col-span-9">
          {sections.map((section, index) => (
            <TextSection
              key={section.id}
              id={section.id}
              heading={section.heading}
              index={index}
              lead={section.paragraphs[0]}
              paragraphs={section.paragraphs.slice(1)}
            />
          ))}

          <TextSection
            id={vision.id}
            heading={vision.heading}
            index={sections.length}
            lead={vision.quote}
            paragraphs={[vision.text]}
          />

          <section id={impact.id} aria-labelledby="impact-heading" className="scroll-mt-32">
            <Reveal>
              <NumberedHeading id="impact-heading" index={sections.length + 1}>
                {impact.heading}
              </NumberedHeading>
            </Reveal>
            <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
              {impact.items.map((item) => {
                return (
                  <RevealItem
                    key={item.title}
                    className="rounded-3xl bg-white p-7 ring-1 ring-line shadow-soft sm:p-8"
                  >
                    <IconTile icon={getIcon(item.icon)} />
                    <h3 className="mt-6 type-subheading">{item.title}</h3>
                    <p className="mt-2 type-body text-ink-muted">{item.text}</p>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </section>
        </div>
      </div>
    </>
  )
}
