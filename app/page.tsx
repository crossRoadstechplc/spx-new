/* Home page - Strategy-to-implementation platform */
import { SiteLayout, PageHero, SectionIntro, Container, CTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock, MediaCardGrid } from "@/components/ui/media-content-block";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "SPX | Strategy-to-Implementation Platform",
  description: "A strategy-to-implementation platform working at the intersection of business and development to design, build, and scale market-shaping systems.",
};

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <PageHero
        size="large"
        title="Strategy-to-Implementation"
        subtitle="Platform"
        description="We work at the intersection of business and development to design, build, and scale market-shaping systems across emerging markets."
        carouselImages={[
          "/assets/images/hero/image3.webp",
          "/assets/images/hero/image1.webp",
          "/assets/images/hero/image5.webp",
        ]}
      >
        <Button asChild size="lg" className="font-medium">
          <Link href="/contact">Partner With Us</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="font-medium">
          <Link href="/who-we-are">Learn More</Link>
        </Button>
      </PageHero>

      {/* Platform Overview */}
      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image15.webp"
            imageAlt="Strategy platform"
          >
            <div className="space-y-4">
              <SectionIntro
                eyebrow="Who We Are"
                title="A Platform Built for Market Transformation"
              />
              <p className="text-lg text-muted-foreground leading-relaxed">
                SPX is a strategy-to-implementation platform that bridges the gap between ambitious ideas and operational reality. We work at the intersection of business and development to design, build, and scale systems that unlock sustainable growth in emerging markets.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We originate ideas, structure systems, and execute solutions—bringing together strategic advisory, capital structuring, program implementation, and venture building under one integrated platform.
              </p>
              <div className="pt-4">
                <Link
                  href="/who-we-are"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Discover our platform
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
            align="center"
            eyebrow="What We Do"
            title="Integrated Capabilities for Market Systems"
            description="Five core service areas that work together to design, build, and scale transformative solutions."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Strategic Advisory",
                description: "Advising governments, investors, and institutions on market entry, sector strategy, and system design."
              },
              {
                number: "02",
                title: "Program Design & Implementation",
                description: "Designing and delivering high-impact programs with focus on execution, accountability, and measurable outcomes."
              },
              {
                number: "03",
                title: "Market Systems Development",
                description: "Building and strengthening ecosystems by aligning stakeholders, incentives, and infrastructure."
              },
              {
                number: "04",
                title: "Venture Building & Incubation",
                description: "Originating, incubating, and scaling ventures that address systemic gaps and unlock new markets."
              },
              {
                number: "05",
                title: "Research & Insights",
                description: "Generating data-driven insights to inform decision-making and position ideas that shape markets."
              }
            ].map((capability, idx) => (
              <div key={idx} className="space-y-4 p-6 rounded-lg border border-border/40 bg-card hover:border-primary/40 transition-all">
                <div className="text-sm font-bold text-primary uppercase tracking-wider">
                  {capability.number}
                </div>
                <h3 className="text-xl font-semibold">{capability.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
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
              Explore our capabilities
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
            imageSrc="/assets/images/xtras/image20.webp"
            imageAlt="Our methodology"
          >
            <div className="space-y-4">
              <SectionIntro
                eyebrow="Our Methodology"
                title="From Concept to Delivery"
              />
              <p className="text-lg text-muted-foreground leading-relaxed">
                We take a holistic approach to market systems development—structuring interventions that integrate policy, capital, and operations. Our model moves seamlessly from strategic design to operational execution, ensuring solutions are built for scale and sustainability.
              </p>
              <p className="text-muted-foreground">
                We convene public and private stakeholders, structure financing solutions that align risk and return with impact, and maintain operational rigor throughout delivery.
              </p>
              <div className="pt-4">
                <Link
                  href="/how-we-work"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  See how we work
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
            align="center"
            eyebrow="Focus Areas"
            title="Sectors Shaping Emerging Markets"
            description="We work across critical sectors where systemic change creates the greatest opportunity for sustainable growth."
          />

          <div className="mt-16">
            <MediaCardGrid
              columns={3}
              cards={[
                {
                  title: "Agriculture",
                  description: "Building integrated value chains and improving productivity, resilience, and market access.",
                  imageSrc: "/assets/images/projects/image5.webp"
                },
                {
                  title: "Technology & Platforms",
                  description: "Developing digital infrastructure and platforms that enable trade, data, and services.",
                  imageSrc: "/assets/images/xtras/image25.webp"
                },
                {
                  title: "Energy & Sustainability",
                  description: "Advancing scalable solutions in renewable energy, resource efficiency, and circular systems.",
                  imageSrc: "/assets/images/projects/image15.webp"
                }
              ]}
            />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Explore all sectors
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
            eyebrow="Projects & Impact"
            title="Building Systems That Scale"
            description="Our work spans large-scale programs, scalable platforms, and high-potential ventures designed to transform markets."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Projects",
                description: "Large-scale programs delivered in partnership with governments and development institutions."
              },
              {
                title: "Platforms",
                description: "Scalable systems and infrastructure designed to enable markets and transactions."
              },
              {
                title: "Ventures",
                description: "High-potential businesses incubated and scaled to address critical market gaps."
              }
            ].map((category, idx) => (
              <div key={idx} className="space-y-3 p-6 rounded-lg border border-border/40 bg-card hover:border-primary/40 transition-all">
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              View our work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      {/* Final CTA */}
      <CTASection
        variant="primary"
        title="Ready to Transform Markets?"
        description="Partner with us to design, build, and scale solutions that unlock sustainable growth in emerging markets."
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
        secondaryCTA={{ label: "About SPX", href: "/who-we-are" }}
      />
    </SiteLayout>
  );
}
