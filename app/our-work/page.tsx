/* Our Work page - Projects, Platforms, Ventures */
import * as React from "react";
import { SiteLayout, PageHero, SectionIntro, Container, CTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock } from "@/components/ui/media-content-block";

export const metadata = {
  title: "Our Work",
  description: "SPX delivers large-scale programs, builds scalable platforms, and incubates high-potential ventures across emerging markets.",
};

export default function OurWorkPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Our Work"
        description="Projects, platforms, and ventures designed to transform markets and unlock sustainable growth."
      />

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Three Modalities"
            title="How We Create Impact"
            description="We deliver results through large-scale programs, scalable infrastructure, and market-creating ventures."
          />
        </Container>
      </section>

      {/* Projects */}
      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/projects/image23.webp"
            imageAlt="Large-scale programs and field delivery"
          >
            <div className="space-y-4">
              <div className="text-sm font-medium text-primary uppercase tracking-wider">Projects</div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Large-Scale Programs
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We design and deliver multi-year programs in partnership with governments and development institutions. These initiatives address systemic constraints, build capacity, and create enabling conditions for inclusive growth.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Multi-stakeholder coordination and implementation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Policy reform and institutional strengthening</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Value chain development and market systems building</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Measurable outcomes and impact evaluation</span>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      {/* Platforms */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/innovation/shutterstock_2231928525.webp"
            imageAlt="Digital platforms"
          >
            <div className="space-y-4">
              <div className="text-sm font-medium text-primary uppercase tracking-wider">Platforms</div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Scalable Systems & Infrastructure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We build digital and physical infrastructure that enables markets and transactions. These platforms reduce friction, improve transparency, and create new opportunities for trade, data exchange, and service delivery.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Digital marketplaces and trade platforms</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Data infrastructure and information systems</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Payment and financial infrastructure</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Quality assurance and certification systems</span>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      {/* Ventures */}
      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/innovation/shutterstock_2596948973.webp"
            imageAlt="Venture building"
          >
            <div className="space-y-4">
              <div className="text-sm font-medium text-primary uppercase tracking-wider">Ventures</div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                High-Potential Businesses
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We originate, incubate, and scale businesses that address critical market gaps. These ventures are designed to be commercially viable while delivering development outcomes—creating jobs, expanding access, and demonstrating new business models.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Idea origination and business model design</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Incubation support and operational setup</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Capital raising and financial structuring</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Growth strategy and scale-up execution</span>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="dotted" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionIntro
              align="center"
              eyebrow="Integrated Impact"
              title="Complementary Modalities"
            />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our work across projects, platforms, and ventures creates reinforcing effects. Programs build enabling environments, platforms provide infrastructure, and ventures demonstrate commercial viability. Together, they create sustainable market systems that outlast individual interventions.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Case Examples"
            title="Representative Work"
            description="Due to confidentiality, we share high-level examples that illustrate our approach and impact across sectors."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "Agriculture Project",
                title: "Value Chain Development Program",
                description: "Multi-year initiative strengthening farmer organizations, improving post-harvest handling, and building market linkages across coffee, spices, and horticulture sectors."
              },
              {
                category: "Digital Platform",
                title: "Agricultural Trade Platform",
                description: "Digital marketplace connecting farmers, cooperatives, and buyers—providing price discovery, logistics coordination, and quality assurance services."
              },
              {
                category: "Energy Venture",
                title: "Distributed Solar Solutions",
                description: "Enterprise providing productive-use solar systems to farmers and rural businesses—enabling irrigation, processing, and income-generating activities."
              },
              {
                category: "Trade Project",
                title: "Export Facilitation Program",
                description: "Initiative building export capacity for smallholder farmers—addressing quality standards, certification, logistics, and international market access."
              },
              {
                category: "Fintech Platform",
                title: "Agri-Finance System",
                description: "Digital platform enabling financial institutions to provide tailored agricultural finance products with improved risk assessment and portfolio management."
              },
              {
                category: "Agritech Venture",
                title: "Agricultural Waste Processing",
                description: "Technology-enabled venture converting agricultural residues into high-value compost—supporting circular economy and soil health improvement."
              }
            ].map((example, idx) => (
              <div key={idx} className="space-y-3 p-6 rounded-lg border border-border/40 bg-card">
                <div className="text-xs font-medium text-primary uppercase tracking-wider">
                  {example.category}
                </div>
                <h3 className="text-lg font-semibold">{example.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        variant="primary"
        title="Build Solutions That Scale"
        description="Partner with SPX to design and deliver programs, platforms, or ventures that transform markets and unlock sustainable growth."
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
        secondaryCTA={{ label: "Our Capabilities", href: "/what-we-do" }}
      />
    </SiteLayout>
  );
}
