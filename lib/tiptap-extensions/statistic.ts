/* Phase 6: Custom Tiptap Statistic block extension */
import { Node, mergeAttributes } from "@tiptap/core";

export interface StatisticOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    statistic: {
      setStatistic: (attrs: { value: string; label: string }) => ReturnType;
    };
  }
}

export const Statistic = Node.create<StatisticOptions>({
  name: "statistic",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      value: {
        default: "",
      },
      label: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=\"statistic\"]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "statistic",
      }),
      ["div", { class: "stat-value" }, HTMLAttributes.value],
      ["div", { class: "stat-label" }, HTMLAttributes.label],
    ];
  },

  addCommands() {
    return {
      setStatistic:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});
