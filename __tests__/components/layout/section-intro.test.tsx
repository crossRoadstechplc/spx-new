/* Phase 2: Unit tests for SectionIntro component */
import { render, screen } from "@testing-library/react";
import { SectionIntro } from "@/components/layout/section-intro";

describe("SectionIntro", () => {
  it("renders title", () => {
    render(<SectionIntro title="Section Title" />);
    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(<SectionIntro eyebrow="Our Approach" title="Title" />);
    expect(screen.getByText("Our Approach")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <SectionIntro
        title="Title"
        description="This is a section description"
      />
    );
    expect(screen.getByText("This is a section description")).toBeInTheDocument();
  });

  it("applies left alignment by default", () => {
    const { container } = render(<SectionIntro title="Title" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass("text-center");
  });

  it("applies center alignment when specified", () => {
    const { container } = render(<SectionIntro title="Title" align="center" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("text-center");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SectionIntro title="Title" className="custom-intro" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-intro");
  });

  it("renders eyebrow with uppercase styling", () => {
    render(<SectionIntro eyebrow="Featured" title="Title" />);
    const eyebrow = screen.getByText("Featured");
    expect(eyebrow).toHaveClass("uppercase");
    expect(eyebrow).toHaveClass("text-primary");
  });
});
