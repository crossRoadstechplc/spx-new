/* Phase 6: Tiptap JSON to React renderer */
import { LazyImage } from "@/components/ui/lazy-image";
import Link from "next/link";

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export interface TiptapContent {
  type: string;
  content?: TiptapNode[];
}

// Helper to safely get string attr
function getAttrString(attrs: Record<string, unknown> | undefined, key: string, fallback = ""): string {
  const value = attrs?.[key];
  return typeof value === "string" ? value : fallback;
}

// Helper to safely get number attr
function getAttrNumber(attrs: Record<string, unknown> | undefined, key: string, fallback: number): number {
  const value = attrs?.[key];
  return typeof value === "number" ? value : fallback;
}

export function renderTiptapContent(json: TiptapContent): React.ReactNode {
  if (!json || !json.content) {
    return null;
  }

  return json.content.map((node, index) => renderNode(node, index));
}

function renderNode(node: TiptapNode, key: number): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return <p key={key}>{renderContent(node.content)}</p>;

    case "heading":
      const level = getAttrNumber(node.attrs, "level", 2);
      const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return <HeadingTag key={key}>{renderContent(node.content)}</HeadingTag>;

    case "bulletList":
      return <ul key={key}>{renderContent(node.content)}</ul>;

    case "orderedList":
      return <ol key={key}>{renderContent(node.content)}</ol>;

    case "listItem":
      return <li key={key}>{renderContent(node.content)}</li>;

    case "blockquote":
      return (
        <blockquote key={key} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
          {renderContent(node.content)}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre key={key} className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-6">
          <code>{renderContent(node.content)}</code>
        </pre>
      );

    case "image":
      const imgSrc = getAttrString(node.attrs, "src");
      const imgAlt = getAttrString(node.attrs, "alt");
      const imgTitle = getAttrString(node.attrs, "title");
      
      if (!imgSrc) return null;
      
      return (
        <div key={key} className="my-8">
          <LazyImage
            src={imgSrc}
            alt={imgAlt}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
          />
          {imgTitle && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {imgTitle}
            </p>
          )}
        </div>
      );

    case "horizontalRule":
      return <hr key={key} className="my-8 border-t-2 border-border" />;

    case "table":
      return (
        <div key={key} className="overflow-x-auto my-6">
          <table className="min-w-full divide-y divide-border">
            <tbody className="divide-y divide-border">
              {renderContent(node.content)}
            </tbody>
          </table>
        </div>
      );

    case "tableRow":
      return <tr key={key}>{renderContent(node.content)}</tr>;

    case "tableCell":
      return (
        <td key={key} className="px-4 py-2 border border-border">
          {renderContent(node.content)}
        </td>
      );

    case "tableHeader":
      return (
        <th key={key} className="px-4 py-2 border border-border bg-muted font-semibold text-left">
          {renderContent(node.content)}
        </th>
      );

    case "callout":
      return (
        <div key={key} className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg my-6">
          {renderContent(node.content)}
        </div>
      );

    case "statistic":
      return (
        <div key={key} className="bg-card border border-border rounded-lg p-8 text-center my-6">
          <div className="text-5xl font-bold text-primary mb-2">
            {getAttrString(node.attrs, "value")}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            {getAttrString(node.attrs, "label")}
          </div>
        </div>
      );

    case "text":
      const textContent = typeof node.text === "string" ? node.text : "";
      return renderTextWithMarks(textContent, node.marks || [], key);

    case "hardBreak":
      return <br key={key} />;

    default:
      console.warn(`Unknown node type: ${node.type}`);
      return null;
  }
}

function renderContent(content?: TiptapNode[]): React.ReactNode {
  if (!content) return null;
  return content.map((node, index) => renderNode(node, index));
}

function renderTextWithMarks(text: string, marks: Array<{ type: string; attrs?: Record<string, unknown> }>, key: number): React.ReactNode {
  if (marks.length === 0) {
    return text;
  }

  let result: React.ReactNode = text;

  marks.forEach((mark) => {
    switch (mark.type) {
      case "bold":
        result = <strong>{result}</strong>;
        break;
      case "italic":
        result = <em>{result}</em>;
        break;
      case "code":
        result = <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{result}</code>;
        break;
      case "link":
        result = (
          <Link href={mark.attrs?.href || "#"} className="text-primary underline">
            {result}
          </Link>
        );
        break;
      default:
        break;
    }
  });

  return <span key={key}>{result}</span>;
}
