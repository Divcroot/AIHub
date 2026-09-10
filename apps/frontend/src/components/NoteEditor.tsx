import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface NoteEditorProps {
    title: string;
    content: unknown;
    onTitleChange: (title: string) => void;
    onContentChange: (content: unknown, contentText: string) => void;
}

function NoteEditor({
    title,
    content,
    onTitleChange,
    onContentChange
}: NoteEditorProps) {

    const [localTitle, setLocalTitle] = useState(title);

    const editor = useEditor({
        extensions: [StarterKit],
        content: content as object,

        onUpdate: ({ editor }) => {
            onContentChange(
                editor.getJSON(),
                editor.getText()
            );
        }
    });

    useEffect(() => {
        setLocalTitle(title);
    }, [title]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const currentContent = editor.getJSON();

        if (
            JSON.stringify(currentContent) !==
            JSON.stringify(content)
        ) {
            editor.commands.setContent(content as object);
        }
    }, [editor, content]);

    const handleTitleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        setLocalTitle(value);
        onTitleChange(value);
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="flex h-full flex-col">
            <input
                value={localTitle}
                onChange={handleTitleChange}
                placeholder="Untitled"
                className="border-none bg-transparent px-8 pt-8 text-4xl font-bold outline-none placeholder:text-zinc-600"
            />

            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800 px-8 py-3">
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("bold")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    B
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("italic")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    I
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("strike")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    S
                </button>

                <div className="mx-2 h-6 w-px bg-zinc-800" />

                <button
                    type="button"
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("heading", { level: 1 })
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    H1
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("heading", { level: 2 })
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    H2
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("heading", { level: 3 })
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    H3
                </button>

                <div className="mx-2 h-6 w-px bg-zinc-800" />

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("bulletList")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    • List
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("orderedList")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    1. List
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("blockquote")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    Quote
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleCode().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("code")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    Code
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={`rounded px-3 py-1.5 text-sm hover:bg-zinc-800 ${editor.isActive("codeBlock")
                            ? "bg-zinc-800"
                            : ""
                        }`}
                >
                    Code block
                </button>

                <div className="mx-2 h-6 w-px bg-zinc-800" />

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-800"
                >
                    HR
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().undo().run()
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-800"
                >
                    Undo
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().redo().run()
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-800"
                >
                    Redo
                </button>
            </div>

            <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none flex-1 overflow-y-auto px-8 py-6"
            />
        </div>
    );
}

export default NoteEditor;