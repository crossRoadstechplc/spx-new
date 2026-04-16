/* What We Do page - Core service areas */
import { SiteLayout, PageHero, SectionIntro, Container, CTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock } from "@/components/ui/media-content-block";

export const metadata = {
  title: "What We Do",
  description: "Strategic advisory, program implementation, market systems development, venture building, and research insights for emerging markets.",
};

export default function WhatWeDoPage() {
  return (
    <SiteLayout>
      <PageHero
        title="What We Do"
        description="Work across strategy, implementation, and system design."
      />

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow=""
            title="Core Capabilities"
            description=""
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image30.webp"
            imageAlt="Strategic advisory"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Strategic Advisory</h2>
              <p className="text-muted-foreground leading-relaxed">
              Work on market entry, sector strategy, and system design.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Market entry strategy and competitive positioning</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Sector development and policy design</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>System architecture and stakeholder mapping</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Commercial and development impact modeling</span>
                </li>
              </ul>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/approach/image2.webp"
            imageAlt="Program design and implementation"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Program Design & Implementation</h2>
              <p className="text-muted-foreground leading-relaxed">
              Design and delivery of programs with emphasis on execution and accountability.</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Program design and results frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Operational management and field coordination</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Monitoring, evaluation, and learning systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Partnership management and capacity building</span>
                </li>
              </ul>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image18.webp"
            imageAlt="Market systems development"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Market Systems Development</h2>
              <p className="text-muted-foreground leading-relaxed">
              Structuring of market systems through alignment of stakeholders, incentives, and infrastructure.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Ecosystem mapping and constraint analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Stakeholder alignment and coordination mechanisms</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Value chain development and market linkages</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Infrastructure and enabling conditions</span>
                </li>
              </ul>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/innovation/shutterstock_2339445835.webp"
            imageAlt="Venture building"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Venture Building & Incubation</h2>
              <p className="text-muted-foreground leading-relaxed">
              Origination and development of ventures addressing structural gaps in markets.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Venture origination and business model design</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Incubation and go-to-market support </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Capital structuring and investor engagement</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Operational scale-up  </span>
                </li>
              </ul>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image35.webp"
            imageAlt="Research and insights"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Research & Insights</h2>
              <p className="text-muted-foreground leading-relaxed">
              Research and analysis to inform decision-making and system design.              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Market and sector assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Policy and institutional research</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Impact evaluation and learning documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Publication and dissemination</span>
                </li>
              </ul>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="dotted" className="my-16" />

      {/* <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionIntro
              align="center"
              eyebrow="Integrated Approach"
              title="Capabilities That Reinforce Each Other"
            />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our capabilities are designed to work together—strategy informs implementation, ecosystem building enables ventures, research strengthens advisory, and operational experience refines strategic thinking. This integration is what allows us to deliver comprehensive, sustainable solutions.
            </p>
          </div>
        </Container>
      </section> */}

      <CTASection
        variant="primary"
        title="Ready to Build Solutions?"
        description="Partner with SPX to design, implement, and scale market systems that unlock sustainable growth."
        primaryCTA={{ label: "View Our Work", href: "/our-work" }}
        secondaryCTA={{ label: "Contact Us", href: "/contact" }}
      />
    </SiteLayout>
  );
}
