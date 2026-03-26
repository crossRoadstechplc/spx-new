/* Phase 2: Unit tests for PageHero component */
import { render, screen } from "@testing-library/react";
import { PageHero } from "@/components/layout/page-hero";

describe("PageHero", () => {
  it("renders title", () => {
    render(<PageHero title="Test Hero Title" />);
    expect(screen.getByText("Test Hero Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <PageHero
        title="Title"
        description="This is a test description"
      />
    );
    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("does not render description container when not provided", () => {
    const { container } = render(<PageHero title="Title" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <PageHero title="Title">
        <button>CTA Button</button>
      </PageHero>
    );
    expect(screen.getByText("CTA Button")).toBeInTheDocument();
  });

  it("applies default size classes", () => {
    render(<PageHero title="Title" />);
    const heading = screen.getByText("Title");
    expect(heading).toHaveClass("text-3xl");
    expect(heading).toHaveClass("md:text-4xl");
    expect(heading).toHaveClass("lg:text-5xl");
  });

  it("applies large size classes", () => {
    render(<PageHero title="Title" size="large" />);
    const heading = screen.getByText("Title");
    expect(heading).toHaveClass("text-4xl");
    expect(heading).toHaveClass("md:text-5xl");
    expect(heading).toHaveClass("lg:text-6xl");
  });

  it("applies custom className", () => {
    const { container } = render(
      <PageHero title="Title" className="custom-hero" />
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-hero");
  });

  it("renders decorative accent element", () => {
    const { container } = render(<PageHero title="Title" />);
    const accent = container.querySelector(".bg-gradient-to-r");
    expect(accent).toBeInTheDocument();
  });
});
