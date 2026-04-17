/* Home page - Strategy-to-implementation platform */
import { SiteLayout, PageHero, SectionIntro, Container, ClosingCTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock, MediaCardGrid } from "@/components/ui/media-content-block";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsletterGate } from "@/components/home/newsletter-gate";
import { CookieConsentBanner } from "@/components/home/cookie-consent-banner";
import type { Metadata } from "next";
import { DEFAULT_SITE_DESCRIPTION, SEO_KEYWORDS } from "@/lib/seo-config";
import { proseBodyClass } from "@/lib/typography";

export const metadata: Metadata = {
  title: {
    absolute: "SPX | Strategy-to-Implementation Platform",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  openGraph: {
    title: "SPX | Strategy-to-Implementation Platform",
    description: DEFAULT_SITE_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <PageHero
        size="large"
        title="Strategy-to-Implementation"
        description="We work on the design, structuring, and execution of market system across environments where policy, capital, and operations intersect."
        carouselImages={[
          "/assets/images/hero/image1.webp",
          "/assets/images/hero/image3.webp",
          "/assets/images/hero/image5.webp",
        ]}
        scrollToNextSectionId="home-platform"
      />

      {/* Platform Overview */}
      <section
        id="home-platform"
        className="scroll-mt-24 py-16 md:py-24"
      >
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/innovation/shutterstock_2596948973.webp"
            imageAlt="Strategy and advisory collaboration"
          >
            <div className="space-y-4">
              <SectionIntro
                eyebrow="Who We Are"
                title="Built for Market Transformation"
              />
              <p className={proseBodyClass}>
              SPX operates at the intersection of business and development.
              </p>
              <p className={proseBodyClass}>
              Our work focuses on the design, structuring, and execution of market systems.
              </p>
              <p className={proseBodyClass}>
              It moves from origination to structuring to execution, across advisory, capital, and implementation contexts.
              </p>
              <div className="pt-4">
                <Link
                  href="/who-we-are"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  See More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      {/* What We Do Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <SectionIntro
            align="left"
            eyebrow="What We Do"
            title="Areas of Work"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Strategic Advisory",
                description: "Work on market entry, sector strategy, and system design."
              },
              {
                title: "Program Design and Implementation",
                description: "Design and delivery of programs with emphasis on execution and accountability."
              },
              {
                title: "Market Systems Development",
                description: "Structuring market systems through alignment of stakeholders, incentives, and infrastructure."
              },
              {
                title: "Venture Building and Incubation",
                description: "Origination and development of ventures addressing structural gaps in markets."
              },
              {
                title: "Research and Insights",
                description: "Research and analysis to inform decision-making and system design."
              }
            ].map((capability, idx) => (
              <div key={idx} className="space-y-4 p-6 rounded-lg border border-border/40 bg-card hover:border-primary/40 transition-all">
                <h3 className="text-xl font-semibold">{capability.title}</h3>
                <p className={proseBodyClass}>
                  {capability.description}
                </p>
              </div>
            ))}
          </div>

        
          <div className="mt-12 text-center">
            <Link
              href="/what-we-do"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              See More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* How We Work Section */}
      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/xtras/image17.webp"
            imageAlt="Structured approach from analysis through to delivery"
          >
            <div className="space-y-4">
              <SectionIntro
                eyebrow="How we work"
                title="From Concept to Delivery"
              />
              <p className={proseBodyClass}>
              We structure interventions that integrate policy, capital, and operations.
              </p>
              <p className={proseBodyClass}>
              We move from strategic design to operational execution.
              </p>
              <div className="pt-4">
                <Link
                  href="/how-we-work"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  See More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="dotted" className="my-16" />

      {/* Sectors Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <SectionIntro
            align="left"
            eyebrow="Sectors"
            title="Focus Areas"
            description="Work across sectors where market structure is evolving."
          />

          
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Agriculture",
                description: "Value chain development across production, processing, and market access"
              },
              {
                title: "Technology and Platforms",
                description: "Platforms enabling trade, data exchange, and service delivery."
              },
              {
                title: "Enery and Sustainability",
                description: "Deployment of energy systems and resource efficient models."
              },
              {
                title: "Trade and Logistics",
                description: "Systems supporting movement of goods, coordination, and market access."
              },
              {
                title: "Finance and Markets",
                description: "Financial structures and instruments supporting market participation.Research and analysis to inform decision-making and system design."
              },
              {
                title: "Training and Capacity Building",
                description: "Development of skills and knowledge to support market systems."
              },

            ].map((capability, idx) => (
              <div key={idx} className="space-y-4 p-6 rounded-lg border border-border/40 bg-card hover:border-primary/40 transition-all">
                <h3 className="text-xl font-semibold">{capability.title}</h3>
                <p className={proseBodyClass}>
                  {capability.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              See More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Our Work Preview */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Our Work"
            title="Projects Platforms Ventures"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Projects",
                description: "Multi-year programs delivered with governments and institutions, focused on system-level interventions."
              },
              {
                title: "Platforms",
                description: "Systems and infrastructure enabling transactions, coordination, and data exchange."
              },
              {
                title: "Ventures",
                description: "Businesses developed to address structural gaps and operate within the systems created."
              }
            ].map((category, idx) => (
              <div key={idx} className="space-y-3 p-6 rounded-lg border border-border/40 bg-card hover:border-primary/40 transition-all">
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className={proseBodyClass}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          {/* <div className="mt-10 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Case Examples
              </h3>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Agriculture Program",
                  description:
                    "Value chain development across production, processing, and market access."
                },
                {
                  title: "Trade Platform",
                  description:
                    "Marketplace enabling coordination between producers, intermediaries, and buyers."
                },
                {
                  title: "Energy Venture",
                  description:
                    "Deployment of distributed systems for productive use."
                }
              ].map((example, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-border/30 bg-background/40 space-y-2"
                >
                  <p className="font-medium text-sm">{example.title}</p>
                  <p className={proseBodyClass}>
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          </div> */}


          <div className="mt-12 text-center">
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              See More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      <NewsletterGate />

      {/* Final CTA */}

      <ClosingCTASection />

      <CookieConsentBanner />
    </SiteLayout>
  );
}
