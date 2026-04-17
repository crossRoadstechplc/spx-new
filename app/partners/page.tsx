/* Partners page - Collaboration ecosystem */
import { SiteLayout, PageHero, SectionIntro, Container, ClosingCTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock } from "@/components/ui/media-content-block";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";

export const metadata = {
  title: "Partners",
  description: "SPX collaborates with development partners, private sector entities, and governments to design, build, and scale transformative market systems.",
};

export default function PartnersPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Partners"
        description="Engagements span development institutions, public and private sectors."
      />

      {/* <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Our Ecosystem"
            title="Collaborative Partnerships"
            description="We work with development institutions, private enterprises, and governments to create market systems that deliver both commercial and development outcomes."
          />
        </Container>
      </section> */}

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/about/image8.webp"
            imageAlt="Development Institutions"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Development Partners
              </h2>
              <p className={proseBodyClass}>
              Work on program design, implementation, and evaluation.              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Program design and implementation partnerships</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Market systems development initiatives</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Impact measurement and evaluation frameworks</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Knowledge generation and dissemination</span>
                </div>
              </div>
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
            imageSrc="/assets/images/xtras/image49.jpg"
            imageAlt="Private sector partners"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Private Sector
              </h2>
              <p className={proseBodyClass}>
              Engagement on market entry, structuring, and venture development.              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Market entry strategy and business development</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Investment structuring and capital deployment</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Venture building and incubation partnerships</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Supply chain and distribution partnerships</span>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image12.webp"
            imageAlt="Government partnerships"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Public Sectors
              </h2>
              <p className="text-muted-foreground leading-relaxed">
              Work on policy, institutional design, and implementation.              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Policy development and regulatory reform</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Institutional strengthening and capacity building</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Public-private partnership structuring</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Program implementation and monitoring</span>
                </div>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="dotted" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto">
            <SectionIntro
              align="center"
              eyebrow="Partnership Approach"
              title="Collaborative Relationships"
            />
            <p className={cn(proseBodyClass, "text-center mt-6")}>
              We build long-term relationships with partners who share our commitment to transformative impact. Our collaborations are structured to align incentives, share risk and return equitably, and create value for all stakeholders while advancing broader objectives.
            </p>
          </div>
        </Container>
      </section>

      {/* <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Become a Partner</h3>
              <p className={proseBodyClass}>
                We are interested in strategic partnerships with organizations that bring complementary capabilities and share our vision for market systems development. If you represent a development institution, enterprise, or government agency interested in collaboration, we would like to hear from you.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary rounded" />
              <h3 className="text-2xl font-bold">Partnership Value</h3>
              <p className={proseBodyClass}>
                Partners gain access to integrated capabilities spanning strategy, implementation, and venture building. We bring deep market knowledge, operational expertise, and a track record of delivering measurable outcomes in challenging environments.
              </p>
            </div>
          </div>
        </Container>
      </section> */}

      <ClosingCTASection />
    </SiteLayout>
  );
}
