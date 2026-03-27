import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionIntro } from "@/components/layout";

export function AboutSpxStoryCard() {
  return (
    <section className="py-16 md:py-24">
      <Container size="narrow">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-10 md:px-10">
          <SectionIntro
            eyebrow="About SPX"
            title="From Ambition to Operational Reality"
            description="SPX exists to close the gap between strategy and execution. We originate ideas, structure systems, and deliver implementation that helps institutions and markets move from concept to sustained impact."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {["Originate", "Structure", "Execute"].map((step) => (
              <span
                key={step}
                className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {step}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/who-we-are"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Explore who we are
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
