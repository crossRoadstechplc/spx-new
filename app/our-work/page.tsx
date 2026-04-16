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
        description="Projects, Platforms, and Ventures."
      />

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
              <div className="text-sm font-medium text-primary uppercase tracking-wider"></div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Projects
              </h2>
              <p className="text-muted-foreground leading-relaxed">
              Multi-year programs addressing system-level constraints.              </p>
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
              <div className="text-sm font-medium text-primary uppercase tracking-wider"></div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Platforms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
              Infrastructure enabling transactions, coordination, and data exchange.              </p>
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
              <div className="text-sm font-medium text-primary uppercase tracking-wider"></div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Ventures              </h2>
              <p className="text-muted-foreground leading-relaxed">
              Businesses addressing structural gaps within markets.              </p>
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

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Case Examples"
            title="Representative Work"
            description=""
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "Agriculture",
                title: "Agriculture Program",
                description: "Value chain development across production, processing, and market access."
              },
              {
                category: "Platform",
                title: "Digital Platform",
                description: "Systems enabling coordination between market participants."
              },
              {
                category: "Energy",
                title: "Energy Venture",
                description: "Deployment of distributed systems for productive use."
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
        title="At the level of systems, build solutions that scale"
        description="Programs, Platforms, and Ventures."
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
        secondaryCTA={{ label: "Our Capabilities", href: "/what-we-do" }}
      />
    </SiteLayout>
  );
}
