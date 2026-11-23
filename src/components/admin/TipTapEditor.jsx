import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Link as LinkIcon,
  Highlighter,
  Quote,
  Table as TableIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";

/**
 * TipTap-based rich text editor matching admin theme.
 * Outputs HTML string via onChange(name, htmlString).
 */
const TipTapEditor = ({ label, name, value, onChange, placeholder = "Write your content here…", minHeight = "200px" }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] }, // No H1 — blog title is the only H1
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tiptap-link" },
      }),
      Highlight.configure({ multicolor: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({ inline: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(name, editor.getHTML());
    },
  });

  if (!editor) return null;

  const ToolBtn = ({ onClick, isActive = false, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
        isActive
          ? "bg-[#B85C38]/15 text-[#B85C38]"
          : "text-[#6F665E] hover:text-[#B85C38] hover:bg-[#B85C38]/5"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-[#E7DED3] mx-0.5" />;

  const handleAddLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const handleAddImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold font-sans text-[#6F665E] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="rounded-2xl border border-[#E7DED3] overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E7DED3]/60 bg-[#FAF8F3] flex-wrap">
          <ToolBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolBtn>

          <Divider />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            isActive={editor.isActive("heading", { level: 4 })}
            title="Heading 4"
          >
            <Heading4 className="w-3.5 h-3.5" />
          </ToolBtn>

          <Divider />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolBtn>

          <Divider />

          <ToolBtn
            onClick={handleAddLink}
            isActive={editor.isActive("link")}
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </ToolBtn>

          <Divider />

          <ToolBtn onClick={handleInsertTable} title="Insert Table">
            <TableIcon className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={handleAddImage} title="Insert Image">
            <ImageIcon className="w-3.5 h-3.5" />
          </ToolBtn>

          <Divider />

          <ToolBtn
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </ToolBtn>
        </div>

        {/* Editor Content Area */}
        <div className="tiptap-editor" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;
