/* Careers page */
import { SiteLayout, PageHero, SectionIntro, Container, CTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock } from "@/components/ui/media-content-block";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Careers",
  description: "Join SPX and work with a team committed to building impactful, scalable solutions that transform markets in emerging economies.",
};

export default function CareersPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Careers"
        description="Join a team committed to building transformative market systems in emerging markets."
      />

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/about/image3.webp"
            imageAlt="Team culture"
          >
            <SectionIntro
              eyebrow="Our Team"
              title="Built for Impact and Scale"
              description="SPX attracts professionals who thrive at the intersection of strategy, implementation, and entrepreneurship—combining analytical rigor with operational excellence."
            />
            <p className="text-muted-foreground mt-4">
              We value depth over speed, collaboration over individual achievement, and sustainable impact over short-term wins. Our team brings diverse expertise across strategy, operations, finance, technology, and sector-specific knowledge.
            </p>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="What We Look For"
            title="Skills & Mindset"
            description="We seek professionals with strong analytical capabilities, operational discipline, and entrepreneurial mindset."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Strategic Thinking",
                description: "Ability to analyze complex systems, identify leverage points, and design interventions that create lasting change."
              },
              {
                title: "Operational Excellence",
                description: "Strong project management skills with focus on execution, accountability, and delivering measurable results."
              },
              {
                title: "Entrepreneurial Mindset",
                description: "Comfort with ambiguity, resourcefulness in problem-solving, and willingness to build new capabilities."
              },
              {
                title: "Collaborative Approach",
                description: "Ability to work across disciplines, engage diverse stakeholders, and build consensus around shared objectives."
              },
              {
                title: "Development Orientation",
                description: "Commitment to creating solutions that align commercial viability with inclusive, sustainable development outcomes."
              },
              {
                title: "Sector Expertise",
                description: "Deep knowledge in agriculture, energy, technology, trade, finance, or related domains in emerging markets."
              }
            ].map((quality, idx) => (
              <div key={idx} className="space-y-4 p-6 rounded-lg border border-border/40 bg-card">
                <div className="h-1 w-12 bg-primary rounded" />
                <h3 className="text-xl font-semibold">{quality.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {quality.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/about/image4.webp"
            imageAlt="Working together"
          >
            <SectionIntro
              eyebrow="Work Environment"
              title="How We Work"
              description="A collaborative environment that values intellectual curiosity, analytical rigor, and operational discipline."
            />
            <p className="text-muted-foreground mt-4">
              Our team combines the strategic thinking of advisory firms, the execution discipline of implementers, and the entrepreneurial mindset of venture builders. We work on challenging problems that require both deep analysis and practical solutions.
            </p>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="dotted" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionIntro
              align="center"
              eyebrow="Open Positions"
              title="Join Us"
            />
            <p className="text-lg text-muted-foreground">
              We are building our team and considering candidates across strategy, implementation, venture building, and sector-specific roles.
            </p>
            <p className="text-lg text-muted-foreground">
              While we do not have formal job postings at this time, we are always interested in speaking with exceptional candidates who align with our mission and approach.
            </p>
          </div>

          <div className="mt-12 max-w-2xl mx-auto space-y-6">
            <div className="p-8 rounded-lg border border-border/40 bg-card">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Interested in Joining SPX?</h3>
                <p className="text-muted-foreground">
                  Send us your background, areas of expertise, and why you are interested in SPX&apos;s approach to market systems development.
                </p>
                <p className="text-sm text-muted-foreground">
                  Include relevant work samples, case studies, or research that demonstrates your analytical and implementation capabilities.
                </p>
                <div className="pt-4">
                  <Button asChild size="lg" className="font-medium w-full sm:w-auto">
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Remote-Friendly</h3>
              <p className="text-muted-foreground leading-relaxed">
                We support flexible work arrangements for many roles, though some projects may require field presence. We value focused work and understand that different people thrive in different environments.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Continuous Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Working across sectors and geographies means continuous learning. We support professional development, provide access to research and networks, and encourage participation in relevant conferences and workshops.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        variant="primary"
        title="Work With Us"
        description="Join a team building market systems that unlock sustainable growth in emerging markets."
        primaryCTA={{ label: "Contact Us", href: "/contact" }}
        secondaryCTA={{ label: "Our Work", href: "/our-work" }}
      />
    </SiteLayout>
  );
}
