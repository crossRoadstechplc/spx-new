"use client";

import { motion } from "framer-motion";
import { Container, SectionIntro } from "@/components/layout";

const PARTNERS = [
  "Partner 1",
  "Partner 2",
  "Partner 3",
  "Partner 4",
  "Partner 5",
  "Partner 6",
  "Partner 7",
  "Partner 8",
];

export function PartnersPlaceholderCarousel() {
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-14 md:py-20 border-y border-border/40 bg-muted/20">
      <Container>
        <SectionIntro
          align="center"
          eyebrow="Partners"
          title="Organizations We Build With"
          description="Placeholder partner logos for now. We can replace these with real brand assets when ready."
        />

        <div className="mt-10 overflow-hidden">
          <motion.div
            className="flex min-w-max gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {track.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex h-24 w-44 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-card text-sm font-medium text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
