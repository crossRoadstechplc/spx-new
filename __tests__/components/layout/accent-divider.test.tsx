/* Phase 2: Unit tests for AccentDivider component */
import { render } from "@testing-library/react";
import { AccentDivider } from "@/components/layout/accent-divider";

describe("AccentDivider", () => {
  it("renders default variant", () => {
    const { container } = render(<AccentDivider />);
    const divider = container.querySelector(".bg-border\\/40");
    expect(divider).toBeInTheDocument();
  });

  it("renders gradient variant", () => {
    const { container } = render(<AccentDivider variant="gradient" />);
    const gradient = container.querySelector(".bg-gradient-to-r");
    expect(gradient).toBeInTheDocument();
  });

  it("renders dotted variant with 5 dots", () => {
    const { container } = render(<AccentDivider variant="dotted" />);
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots).toHaveLength(5);
  });

  it("applies custom className", () => {
    const { container } = render(<AccentDivider className="my-custom-class" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveClass("my-custom-class");
  });

  it("gradient variant uses primary color", () => {
    const { container } = render(<AccentDivider variant="gradient" />);
    const gradient = container.querySelector(".via-primary\\/30");
    expect(gradient).toBeInTheDocument();
  });

  it("dotted variant uses primary color for center dot", () => {
    const { container } = render(<AccentDivider variant="dotted" />);
    const centerDot = container.querySelector(".bg-primary:not([class*='\\/'])");
    expect(centerDot).toBeInTheDocument();
  });
});
