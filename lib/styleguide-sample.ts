import type { PageBuilderBlock } from "@/components/page-builder";

export const styleguideSampleBlocks = [
  {
    _type: "heroBlock",
    eyebrow: "Design system",
    heading: "Ukázkový page builder renderer",
    subheading:
      "Tenhle renderer je první provozní vrstva nad novým Sanity modelem. Pomůže nám průběžně ověřovat, že bloky nejsou jen schema, ale i reálně použitelné UI.",
    primaryLabel: "Osobní konzultace",
    primaryHref: "/osobni-konzultace",
    secondaryLabel: "Otevřít app",
    secondaryHref: "https://app.zdravimebavi.cz/"
  },
  {
    _type: "richTextBlock",
    title: "Rich text",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Portable Text renderer už umí obsloužit základní textové bloky a připravuje nás na import obsahu ze snapshotu i následné redakční úpravy v Sanity."
          }
        ]
      }
    ]
  },
  {
    _type: "ctaBlock",
    eyebrow: "CTA",
    heading: "Konverzní blok",
    body: "Stejný model použijeme pro landingy, service pages i checkout pages. Teď je záměrně jednoduchý, ale už je připravený pro další rozšíření.",
    primaryLabel: "Chci konzultaci",
    primaryHref: "/osobni-konzultace"
  },
  {
    _type: "formBlock",
    title: "Lead formulář",
    description: "Ukázka nativního formuláře napojeného na scaffold API route.",
    formKey: "kontakt"
  },
  {
    _type: "faqBlock",
    title: "FAQ",
    items: [
      {
        question: "K čemu tenhle renderer slouží?",
        answer: "K průběžnému ověřování, že schema a frontend vrstva drží pohromadě."
      },
      {
        question: "Je už napojený na live Sanity data?",
        answer: "Ještě ne. Další krok je napojení route na skutečný content fetch a import snapshotu."
      }
    ]
  }
] as const satisfies readonly PageBuilderBlock[];
