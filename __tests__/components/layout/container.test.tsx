/* Phase 2: Unit tests for Container component */
import { render, screen } from "@testing-library/react";
import { Container } from "@/components/layout/container";

describe("Container", () => {
  it("renders children", () => {
    render(<Container>Test Content</Container>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies default max-width class", () => {
    const { container } = render(<Container>Content</Container>);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("max-w-7xl");
  });

  it("applies narrow size class", () => {
    const { container } = render(<Container size="narrow">Content</Container>);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("max-w-4xl");
  });

  it("applies wide size class", () => {
    const { container } = render(<Container size="wide">Content</Container>);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("max-w-[90rem]");
  });

  it("applies full size class", () => {
    const { container } = render(<Container size="full">Content</Container>);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("max-w-full");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Container className="custom-class">Content</Container>
    );
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("custom-class");
  });

  it("applies consistent horizontal padding", () => {
    const { container } = render(<Container>Content</Container>);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("px-4");
    expect(divElement).toHaveClass("lg:px-8");
  });

  it("applies mx-auto for centering", () => {
    const { container } = render(<Container>Content</Container>);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass("mx-auto");
  });
});
