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
        description="The work requires individuals comfortable operating across strategy, implementation, and venture contexts."
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
              eyebrow=""
              title="Requirements"
              description=""
            />
            <p className="text-muted-foreground mt-4">
            * Analytical capability in complex systems
            </p>
            <p className="text-muted-foreground mt-4">
            * Operational discipline in execution environments
            </p>
            <p className="text-muted-foreground mt-4">
            * Comfort with ambiguity and early-stage work
            </p>
            <p className="text-muted-foreground mt-4">
            * Ability to engage across stakeholders and institutions
            </p>
          </MediaContentBlock>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="landscape"
            imageSrc="/assets/images/about/image3.webp"
            imageAlt="Team culture"
          >
            <SectionIntro
              eyebrow=""
              title="Work Context"
              description=""
            />
            <p className="text-muted-foreground mt-4">
            Work spans multiple sectors and geographies, requiring both analytical depth and operational execution.
            </p>
            
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <SectionIntro
            align="left"
            eyebrow=""
            title="Applications"
            description="No open roles are listed."
          />
          <p className="text-muted-foreground mt-4">
          Relevant profiles may be considered on a rolling basis.
          </p>
          <p className="text-muted-foreground mt-4">
          Submissions may include background, areas of work, and relevant material checks.
          </p>
        </Container>
      </section>

      {/* <section className="py-16 md:py-24">
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
      </section> */}

      <AccentDivider variant="dotted" className="my-16" />
{/* 
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
      </section> */}

      <CTASection
        variant="primary"
        title="Contact us for your enquiries"
        description="Join a team building market systems that unlock sustainable growth in emerging markets."
        primaryCTA={{ label: "Contact Us", href: "/contact" }}
        secondaryCTA={{ label: "Our Work", href: "/our-work" }}
      />
    </SiteLayout>
  );
}
