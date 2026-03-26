/* Phase 2: Unit tests for CTASection component */
import { render, screen } from "@testing-library/react";
import { CTASection } from "@/components/layout/cta-section";

describe("CTASection", () => {
  it("renders title", () => {
    render(<CTASection title="Call to Action Title" />);
    expect(screen.getByText("Call to Action Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <CTASection
        title="Title"
        description="This is a CTA description"
      />
    );
    expect(screen.getByText("This is a CTA description")).toBeInTheDocument();
  });

  it("renders primary CTA button when provided", () => {
    render(
      <CTASection
        title="Title"
        primaryCTA={{ label: "Get Started", href: "/contact" }}
      />
    );
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders secondary CTA button when provided", () => {
    render(
      <CTASection
        title="Title"
        secondaryCTA={{ label: "Learn More", href: "/about" }}
      />
    );
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders both CTA buttons when provided", () => {
    render(
      <CTASection
        title="Title"
        primaryCTA={{ label: "Primary", href: "/primary" }}
        secondaryCTA={{ label: "Secondary", href: "/secondary" }}
      />
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<CTASection title="Title" />);
    const section = container.querySelector("section");
    expect(section).not.toHaveClass("bg-primary/5");
  });

  it("applies primary variant styles", () => {
    const { container } = render(<CTASection title="Title" variant="primary" />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-primary/5");
  });

  it("applies custom className", () => {
    const { container } = render(
      <CTASection title="Title" className="custom-cta" />
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-cta");
  });

  it("renders decorative accents with primary variant", () => {
    const { container } = render(<CTASection title="Title" variant="primary" />);
    const accents = container.querySelectorAll(".bg-gradient-to-r, .bg-gradient-to-l");
    expect(accents.length).toBe(2);
  });
});
