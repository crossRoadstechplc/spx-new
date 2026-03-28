/* How We Work page - Methodology and approach */
import { SiteLayout, PageHero, SectionIntro, Container, CTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock } from "@/components/ui/media-content-block";

export const metadata = {
  title: "How We Work | SPX",
  description: "Our approach combines system design, partnership building, capital structuring, and operational execution to deliver transformative solutions.",
};

export default function HowWeWorkPage() {
  return (
    <SiteLayout>
      <PageHero
        title="How We Work"
        description="A holistic methodology that integrates strategy, capital, and operations to build market systems that scale."
      />

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Our Methodology"
            title="Four Pillars of Execution"
            description="We structure interventions that integrate policy, capital, and operations—moving seamlessly from concept to delivery."
          />
        </Container>
      </section>

      {/* System Design */}
      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image32.webp"
            imageAlt="System design"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  01
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">System Design</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We take a holistic view of market systems, structuring interventions that integrate policy frameworks, capital flows, stakeholder incentives, and operational models.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Market Analysis</h4>
                    <p className="text-sm text-muted-foreground">Understanding constraints, opportunities, and systemic dynamics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Architecture Design</h4>
                    <p className="text-sm text-muted-foreground">Structuring policy, financial, and operational frameworks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Intervention Mapping</h4>
                    <p className="text-sm text-muted-foreground">Defining pathways, sequencing, and critical dependencies</p>
                  </div>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      {/* Partnerships & Ecosystem Building */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/about/image6.webp"
            imageAlt="Partnership building"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  02
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Partnerships & Ecosystem Building</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We convene and align public and private stakeholders to drive coordinated action. Sustainable market systems require multi-stakeholder engagement and shared commitment.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Stakeholder Convening</h4>
                    <p className="text-sm text-muted-foreground">Bringing together governments, investors, enterprises, and institutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Incentive Alignment</h4>
                    <p className="text-sm text-muted-foreground">Structuring commercial and development incentives to drive participation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Coordination Mechanisms</h4>
                    <p className="text-sm text-muted-foreground">Establishing governance structures and collaboration frameworks</p>
                  </div>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      {/* Capital Structuring */}
      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image40.webp"
            imageAlt="Capital structuring"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  03
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Capital Structuring</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We design financing solutions that align risk, return, and impact. Our approach to capital structuring ensures interventions are financially sustainable and commercially viable.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Financial Modeling</h4>
                    <p className="text-sm text-muted-foreground">Analyzing cash flows, returns, and sustainability metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Blended Finance Design</h4>
                    <p className="text-sm text-muted-foreground">Combining public, philanthropic, and commercial capital</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Investor Engagement</h4>
                    <p className="text-sm text-muted-foreground">Structuring investment opportunities and managing capital deployment</p>
                  </div>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      {/* Execution Model */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/projects/image7.webp"
            imageAlt="Execution model"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  04
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Execution Model</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We move from concept to delivery, ensuring operational rigor and scalability. Our execution model combines strong project management with adaptive learning to achieve measurable outcomes.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Program Management</h4>
                    <p className="text-sm text-muted-foreground">Structured delivery with clear accountability and milestones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Performance Monitoring</h4>
                    <p className="text-sm text-muted-foreground">Real-time tracking of outputs, outcomes, and impact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Adaptive Management</h4>
                    <p className="text-sm text-muted-foreground">Learning systems that enable continuous improvement and course correction</p>
                  </div>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionIntro
              align="center"
              eyebrow="Integrated Approach"
              title="Strategy Through Implementation"
            />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our methodology ensures that strategic design translates into operational execution. By integrating system thinking with capital structuring and implementation discipline, we create solutions that are both transformative and sustainable.
            </p>
          </div>
        </Container>
      </section>

      <CTASection
        variant="primary"
        title="See Our Methodology in Action"
        description="Explore projects and ventures where SPX has applied this integrated approach to deliver measurable outcomes."
        primaryCTA={{ label: "View Our Work", href: "/our-work" }}
        secondaryCTA={{ label: "Contact Us", href: "/contact" }}
      />
    </SiteLayout>
  );
}
