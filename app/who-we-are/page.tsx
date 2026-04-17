/* Who We Are page - Platform overview */
import { SiteLayout, PageHero, SectionIntro, Container, ClosingCTASection, AccentDivider } from "@/components/layout";
import { MediaContentBlock } from "@/components/ui/media-content-block";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";

export const metadata = {
  title: "Who We Are",
  description: "A strategy-to-implementation platform working at the intersection of business and development to design, build, and scale market-shaping systems.",
};

export default function WhoWeArePage() {
  return (
    <SiteLayout>
      <PageHero
        title="Who We Are"
        description="A strategy-to-implementation organization operating across business and development activities."
      />

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-right" 
            imageVariant="landscape"
            imageSrc="/assets/images/xtras/image10.webp"
            imageAlt="SPX platform"
          >
            <SectionIntro
              eyebrow="Our Foundation"
              title="Where Strategy Meets Implementation"
            />
            <p className={cn(proseBodyClass, "mt-4")}>
            SPX focuses on the design, structuring, and execution of market systems.
            </p>
            <p className={cn(proseBodyClass, "mt-4")}>
            our work spans advisory, capital structuring, program implementation, and venture development.
              </p>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="gradient" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Vision and Mission"
            title="Unlocking Sustainable Growth"
            description="Alignment of commercial incentives with development outcomes."
          />

          {/* <div className="mt-12 max-w-4xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that the most transformative solutions emerge when commercial viability aligns with development impact. Our platform is built on the principle that market systems can be designed to serve both growth and inclusion-creating value for businesses while advancing broader social and economic outcomes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We work with governments, development institutions, investors, and enterprises to structure interventions that are commercially sustainable, operationally scalable, and systemically transformative.
            </p>
          </div> */}
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MediaContentBlock 
            layout="image-left" 
            imageVariant="wide"
            imageSrc="/assets/images/about/image7.webp"
            imageAlt="Our approach"
          >
            <SectionIntro
              eyebrow="Our Approach"
              title=""
            />
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Origination</h3>
                <p className={proseBodyClass}>Focus on structural gaps and intervention design.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Structuring</h3>
                <p className={proseBodyClass}>Design of system architecture across policy, capital, incentives, and operations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Execution</h3>
                <p className={proseBodyClass}>Execution across programs, platforms, and ventures.</p>
              </div>
            </div>
          </MediaContentBlock>
        </Container>
      </section>

      <AccentDivider variant="dotted" className="my-16" />

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Leadership and Team"
            title="Expertise across strategy finance, operations, and technology."
            description="Capabilities span systems design, capital structuring, and implementation."
          />

          {/* <div className="mt-12 max-w-4xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our team brings together diverse expertise across strategy, finance, operations, technology, and sector-specific knowledge. We combine the analytical rigor of advisory firms, the execution discipline of implementers, and the entrepreneurial mindset of venture builders.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This multidisciplinary foundation enables us to design holistic solutions, structure complex transactions, and deliver programs that achieve both commercial and development objectives.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Strategic Thinkers",
                description: "Experts in market analysis, system design, and policy structuring."
              },
              {
                title: "Technical Specialists",
                description: "Engineers, technologists, and sector experts with deep operational knowledge."
              },
              {
                title: "Financial Architects",
                description: "Professionals skilled in capital structuring, financial modeling, and investment analysis."
              },
              {
                title: "Implementation Leaders",
                description: "Program managers and operators with proven delivery track records."
              }
            ].map((expertise, idx) => (
              <div key={idx} className="space-y-3 p-6 rounded-lg border border-border/40 bg-card">
                <h3 className="text-lg font-semibold">{expertise.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {expertise.description}
                </p>
              </div>
            ))}
          </div> */}
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionIntro
              align="center"
              eyebrow="Looking Ahead"
              title="Work on systems integrating strategy, capital, and execution."
            />
            {/* <p className="text-lg text-muted-foreground leading-relaxed">
              We are committed to advancing a new model of market development-one that integrates strategy, capital, and operations to create systems that are commercially viable, socially inclusive, and environmentally sustainable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Partner with us to design, build, and scale solutions that transform markets and unlock sustainable growth.
            </p> */}
          </div>
        </Container>
      </section>

      <ClosingCTASection />
    </SiteLayout>
  );
}
