/* Phase 2.5: Unit tests for image placeholder components */
import { render, screen } from "@testing-library/react";
import {
  ImagePlaceholder,
  EditorialImagePlaceholder,
  PortraitImagePlaceholder,
  WideBannerPlaceholder,
  SquareImagePlaceholder,
  UltraWidePlaceholder,
} from "@/components/ui/image-placeholder";

describe("ImagePlaceholder", () => {
  it("renders with default landscape variant", () => {
    render(<ImagePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
    // Note: aspect-ratio CSS property not reliably testable in JSDOM
  });

  it("renders with custom aspect ratio", () => {
    render(<ImagePlaceholder aspectRatio="16/9" />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("renders caption when provided", () => {
    render(<ImagePlaceholder caption="Editorial image caption" />);
    expect(screen.getByText("Editorial image caption")).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(<ImagePlaceholder badge="Coming Soon" />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("shows icon by default", () => {
    const { container } = render(<ImagePlaceholder />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("hides icon when showIcon is false", () => {
    const { container } = render(<ImagePlaceholder showIcon={false} />);
    const iconContainer = container.querySelector(".flex.items-center.justify-center");
    expect(iconContainer).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ImagePlaceholder className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("Placeholder Variants", () => {
  it("EditorialImagePlaceholder renders correctly", () => {
    render(<EditorialImagePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("PortraitImagePlaceholder renders correctly", () => {
    render(<PortraitImagePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("WideBannerPlaceholder renders correctly", () => {
    render(<WideBannerPlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("SquareImagePlaceholder renders correctly", () => {
    render(<SquareImagePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("UltraWidePlaceholder renders correctly", () => {
    render(<UltraWidePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });
});

describe("Placeholder Responsiveness", () => {
  it("renders with responsive border and background classes", () => {
    render(<ImagePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toHaveClass("rounded-lg");
    expect(placeholder).toHaveClass("border-2");
  });

  it("applies hover state classes for interactivity", () => {
    render(<ImagePlaceholder />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toHaveClass("hover:border-primary/40");
  });
});
