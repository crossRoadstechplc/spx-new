/* Phase 2.5: Unit tests for media content block components */
import { render, screen } from "@testing-library/react";
import {
  MediaContentBlock,
  FullWidthMediaBlock,
  MediaCardGrid,
} from "@/components/ui/media-content-block";

describe("MediaContentBlock", () => {
  it("renders children content", () => {
    render(
      <MediaContentBlock>
        <h2>Test Heading</h2>
        <p>Test content</p>
      </MediaContentBlock>
    );
    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders with image-right layout by default", () => {
    const { container } = render(
      <MediaContentBlock>
        <p>Content</p>
      </MediaContentBlock>
    );
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    const { container } = render(
      <MediaContentBlock>
        <p>Content</p>
      </MediaContentBlock>
    );
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("grid-cols-1");
    expect(gridContainer).toHaveClass("md:grid-cols-2");
  });

  it("supports image-left layout", () => {
    const { container } = render(
      <MediaContentBlock layout="image-left">
        <p>Content</p>
      </MediaContentBlock>
    );
    expect(container.querySelector(".md\\:order-1")).toBeInTheDocument();
  });

  it("applies custom gap size", () => {
    const { container } = render(
      <MediaContentBlock gap="lg">
        <p>Content</p>
      </MediaContentBlock>
    );
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("gap-12");
  });
});

describe("FullWidthMediaBlock", () => {
  it("renders full-width container", () => {
    const { container } = render(<FullWidthMediaBlock />);
    const fullWidthContainer = container.querySelector(".w-full");
    expect(fullWidthContainer).toBeInTheDocument();
  });

  it("renders image placeholder", () => {
    render(<FullWidthMediaBlock />);
    const placeholder = screen.getByTestId("image-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("renders caption when provided", () => {
    render(<FullWidthMediaBlock caption="Full-width media caption" />);
    expect(screen.getByText("Full-width media caption")).toBeInTheDocument();
  });
});

describe("MediaCardGrid", () => {
  const mockCards = [
    {
      title: "Card 1",
      description: "Description 1",
    },
    {
      title: "Card 2",
      description: "Description 2",
    },
    {
      title: "Card 3",
      description: "Description 3",
    },
  ];

  it("renders all cards", () => {
    render(<MediaCardGrid cards={mockCards} />);
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByText("Card 3")).toBeInTheDocument();
  });

  it("renders card descriptions", () => {
    render(<MediaCardGrid cards={mockCards} />);
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("applies 3-column grid by default", () => {
    const { container } = render(<MediaCardGrid cards={mockCards} />);
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("lg:grid-cols-3");
  });

  it("supports 2-column grid", () => {
    const { container } = render(<MediaCardGrid cards={mockCards} columns={2} />);
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("md:grid-cols-2");
  });

  it("supports 4-column grid", () => {
    const { container } = render(<MediaCardGrid cards={mockCards} columns={4} />);
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("lg:grid-cols-4");
  });

  it("renders image placeholder for each card", () => {
    render(<MediaCardGrid cards={mockCards} />);
    const placeholders = screen.getAllByTestId("image-placeholder");
    expect(placeholders).toHaveLength(mockCards.length);
  });
});
