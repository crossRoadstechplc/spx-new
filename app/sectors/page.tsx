/* Sectors page - Focus areas */
import { SiteLayout, PageHero, SectionIntro, Container, ClosingCTASection } from "@/components/layout";
import { MediaCardGrid } from "@/components/ui/media-content-block";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";

export const metadata = {
  title: "Sectors",
  description: "SPX works across agriculture, technology, energy, trade, and finance to build market systems that unlock sustainable growth.",
};

const sectors = [
  {
    title: "Agriculture",
    description: "Value chain development across production, processing, and market access.",
    imageSrc: "/assets/images/focus/image6.webp"
  },
  {
    title: "Technology and Platforms",
    description: "Platforms enabling trade, data exchange, and service delivery.",
    imageSrc: "/assets/images/xtras/image27.webp"
  },
  {
    title: "Energy and Sustainability",
    description: "Deployment of energy systems and resource efficient models.",
    imageSrc: "/assets/images/xtras/image36.webp"
  },
  {
    title: "Trade and Logistics",
    description: "Systems supporting movement of goods, coordination, and market access.",
    imageSrc: "/assets/images/xtras/image21.webp"
  },
  {
    title: "Finance and Markets",
    description: "Financial structures and instruments supporting market participation.",
    imageSrc: "/assets/images/focus/image1.webp"
  },
  {
    title: "Training and Capacity Building",
    description: "Development of skills and knowledge to support market systems.",
    imageSrc: "/assets/images/xtras/image9.webp"
  },
];

export default function SectorsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Sectors"
        description="Building market systems across in frontier and emerging markets."
      />

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow=""
            title="Areas of Focus"
            description="We work across sectors where systemic change creates the opportunity for sustainable growth and inclusive development."
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaCardGrid
            columns={3}
            cards={sectors}
          />
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto">
            <SectionIntro
              align="center"
              eyebrow="Cross-Sector Impact"
              title="Integrated Solutions"
            />
            <p className={cn(proseBodyClass, "text-center mt-6")}>
              Many of our most impactful interventions span multiple sectors. Agricultural value chains require trade infrastructure and financial services. Digital platforms enable energy distribution and market access. Our integrated approach allows us to design solutions that address interconnected challenges.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Agriculture</h3>
              <p className={proseBodyClass}>
                We work across the agricultural value chain from input supply and production systems to post-harvest handling, processing, and market linkages. Our interventions strengthen farmer community, improve productivity, build market access, and create sustainable economic opportunities in rural areas.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Technology and Platforms</h3>
              <p className={proseBodyClass}>
                We design and build digital platforms that enable trade, data exchange, and service delivery. This includes marketplaces, information systems, payment infrastructure, and data platforms that reduce transaction costs, improve transparency, and create new economic opportunities.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Energy and Sustainability</h3>
              <p className={proseBodyClass}>
                We advance renewable energy deployment, resource efficiency, and circular economic models. Our work spans energy access programs, clean energy ventures, waste-to-value systems, and climate-smart agricultural practices that reduce environmental impact while driving economic growth.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Trade and Logistics</h3>
              <p className={proseBodyClass}>
                We strengthen supply chain infrastructure, improve trade facilitation, and build market linkages that connect producers to buyers. This includes logistics systems, quality assurance mechanisms, trade finance solutions, and market information systems that enable efficient, transparent commerce.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Finance and Markets</h3>
              <p className={proseBodyClass}>
                We expand access to finance and structure innovative financial solutions for smallholders, MSMEs, and larger enterprises. Our work includes financial product design, risk management mechanisms, investment structuring, and market-based financing solutions that align commercial returns with development outcomes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded mx-auto" />
              <h3 className="text-2xl font-bold text-center">Finance and Markets</h3>
              <p className={cn(proseBodyClass, "text-center")}>
                We expand access to finance and structure innovative financial solutions for smallholders, MSMEs, and larger enterprises. Our work includes financial product design, risk management mechanisms, investment structuring, and market-based financing solutions that align commercial returns with development outcomes.
              </p>
            </div>
          </div>
        </Container>
      </section> */}

      <ClosingCTASection />
    </SiteLayout>
  );
}
