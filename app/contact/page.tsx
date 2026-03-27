/* Phase 3: Contact page */
import { SiteLayout, PageHero, Container, AccentDivider } from "@/components/layout";
import { ContactForm } from "@/components/contact/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact | SPX",
  description: "Partner with SPX to design, build, and scale transformative systems in emerging markets.",
};

export default function ContactPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Contact"
        description="Partner with us to design, build, and scale transformative systems."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Partner With Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you&apos;re exploring a program partnership, seeking strategic advisory, considering investment opportunities, or interested in market systems development, we&apos;d like to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <a
                      href="mailto:info@spxafrica.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@spxafrica.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Phone</div>
                    <a
                      href="tel:+251930199525"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +251930199525
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Location</div>
                    <p className="text-muted-foreground">
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
              </div>

              <AccentDivider variant="gradient" />

              <div>
                <h3 className="text-lg font-semibold mb-3">Response Time</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We typically respond to inquiries within 1-2 business days. For urgent matters, please note that in your message.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Confidentiality</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All inquiries are treated with strict confidentiality. We understand that strategic conversations often involve sensitive market intelligence and investment considerations.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-8 lg:p-10 rounded-lg border border-border/40 bg-card">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you promptly.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Prefer a Direct Conversation?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you&apos;d rather discuss your market opportunity directly, feel free to email us at{" "}
              <a href="mailto:info@spxafrica.com" className="text-primary hover:underline font-medium">
                info@spxafrica.com
              </a>{" "}
              or call us at{" "}
              <a href="tel:+251930199525" className="text-primary hover:underline font-medium">
                +251930199525
              </a>
              . We&apos;re happy to schedule an introductory call to explore collaboration opportunities.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
