/* Phase 6: Tiptap editor component */
"use client";

import { useEditor, EditorContent, type Editor, type Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Callout } from "@/lib/tiptap-extensions/callout";
import { Statistic } from "@/lib/tiptap-extensions/statistic";
import { TiptapToolbar } from "./tiptap-toolbar";
import "./tiptap-styles.css";

interface TiptapEditorProps {
  content: unknown;
  onChange: (json: unknown, html: string) => void;
  onInsertImage?: () => void;
  onEditorReady?: (editor: Editor) => void;
}

export function TiptapEditor({ content, onChange, onInsertImage, onEditorReady }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Callout,
      Statistic,
    ],
    content: content as Content,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const html = editor.getHTML();
      onChange(json, html);
    },
    onCreate: ({ editor }) => {
      if (onEditorReady) {
        onEditorReady(editor);
      }
    },
  });

  if (!editor) {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-background min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <TiptapToolbar editor={editor} onInsertImage={onInsertImage} />
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
