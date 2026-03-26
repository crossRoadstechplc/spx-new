/* Phase 6: Tiptap renderer tests */
import { render, screen } from "@testing-library/react";
import { renderTiptapContent } from "@/lib/tiptap-renderer";

describe("renderTiptapContent", () => {
  it("should render paragraph nodes", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello world" }],
        },
      ],
    };

    const { container } = render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("should render heading nodes", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Test Heading" }],
        },
      ],
    };

    const { container } = render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(container.querySelector("h2")).toBeInTheDocument();
  });

  it("should render bullet lists", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Item 1" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Item 2" }],
                },
              ],
            },
          ],
        },
      ],
    };

    const { container } = render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("should render blockquotes", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Quoted text" }],
            },
          ],
        },
      ],
    };

    const { container } = render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("Quoted text")).toBeInTheDocument();
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });

  it("should render links with marks", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Visit site",
              marks: [{ type: "link", attrs: { href: "https://example.com" } }],
            },
          ],
        },
      ],
    };

    render(<div>{renderTiptapContent(json)}</div>);
    const link = screen.getByText("Visit site");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "https://example.com");
  });

  it("should render bold text", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Bold text",
              marks: [{ type: "bold" }],
            },
          ],
        },
      ],
    };

    const { container } = render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("Bold text")).toBeInTheDocument();
    expect(container.querySelector("strong")).toBeInTheDocument();
  });

  it("should handle empty content", () => {
    const json = {
      type: "doc",
      content: [],
    };

    const { container } = render(<div>{renderTiptapContent(json)}</div>);
    expect(container.textContent).toBe("");
  });

  it("should render custom callout blocks", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "callout",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Important note" }],
            },
          ],
        },
      ],
    };

    render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("Important note")).toBeInTheDocument();
  });

  it("should render custom statistic blocks", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "statistic",
          attrs: {
            value: "95%",
            label: "Success Rate",
          },
        },
      ],
    };

    render(<div>{renderTiptapContent(json)}</div>);
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("Success Rate")).toBeInTheDocument();
  });

  it("should handle unknown node types gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    
    const json = {
      type: "doc",
      content: [
        {
          type: "unknownBlock",
          content: [],
        },
      ],
    };

    render(<div>{renderTiptapContent(json)}</div>);
    expect(consoleSpy).toHaveBeenCalledWith("Unknown node type: unknownBlock");
    
    consoleSpy.mockRestore();
  });
});
