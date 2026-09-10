import { useEffect, useRef, useState } from "react";
import { api, type Note } from "../lib/api";
import NoteEditor from "../components/NoteEditor";

type SaveStatus =
    | "saved"
    | "unsaved"
    | "saving"
    | "error";

function Notes() {

    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
    const [error, setError] = useState("");

    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const response = await api.notes.getAll();

                setNotes(response.notes);

                if (response.notes.length > 0) {
                    setSelectedNote(response.notes[0]);
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load notes"
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadNotes();
    }, []);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);

    const createNote = async () => {
        try {
            setError("");

            const response = await api.notes.create({
                title: "Untitled",
                content: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph"
                        }
                    ]
                },
                contentText: "",
                tags: []
            });

            setNotes((current) => [
                response.note,
                ...current
            ]);

            setSelectedNote(response.note);
            setSaveStatus("saved");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create note"
            );
        }
    };

    const handleDelete = async () => {
        if (!selectedNote) {
            return;
        }

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }

        setIsDeleting(true);
        setError("");

        try {
            await api.notes.delete(selectedNote._id);

            const remainingNotes = notes.filter(
                (note) => note._id !== selectedNote._id
            );

            setNotes(remainingNotes);

            setSelectedNote(
                remainingNotes.length > 0
                    ? remainingNotes[0]
                    : null
            );

            setShowDeleteConfirm(false);
            setSaveStatus("saved");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete note"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const scheduleSave = (note: Note) => {
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        setSaveStatus("unsaved");

        saveTimerRef.current = setTimeout(async () => {
            setSaveStatus("saving");

            try {
                const response = await api.notes.update(
                    note._id,
                    {
                        title: note.title,
                        content: note.content,
                        contentText: note.contentText,
                        tags: note.tags,
                        folderId: note.folderId ?? null
                    }
                );

                setSelectedNote(response.note);

                setNotes((current) =>
                    current.map((currentNote) =>
                        currentNote._id === response.note._id
                            ? response.note
                            : currentNote
                    )
                );

                setSaveStatus("saved");
            } catch (error) {
                setSaveStatus("error");

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to save note"
                );
            }
        }, 2000);
    };

    const updateTitle = (title: string) => {
        if (!selectedNote) {
            return;
        }

        const updatedNote = {
            ...selectedNote,
            title
        };

        setSelectedNote(updatedNote);

        setNotes((current) =>
            current.map((note) =>
                note._id === updatedNote._id
                    ? updatedNote
                    : note
            )
        );

        scheduleSave(updatedNote);
    };

    const updateContent = (
        content: unknown,
        contentText: string
    ) => {
        if (!selectedNote) {
            return;
        }

        const updatedNote = {
            ...selectedNote,
            content,
            contentText
        };

        setSelectedNote(updatedNote);

        setNotes((current) =>
            current.map((note) =>
                note._id === updatedNote._id
                    ? updatedNote
                    : note
            )
        );

        scheduleSave(updatedNote);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                Loading notes...
            </div>
        );
    }

    return (
        <main className="flex h-screen bg-zinc-950 text-white">
            <aside className="w-72 border-r border-zinc-800 p-4">
                <button
                    onClick={createNote}
                    className="mb-6 w-full rounded-lg bg-white px-4 py-2 font-medium text-black"
                >
                    + New note
                </button>

                <div className="space-y-1">
                    {notes.map((note) => (
                        <button
                            key={note._id}
                            onClick={() => {
                                setSelectedNote(note);
                                setSaveStatus("saved");
                            }}
                            className={`w-full rounded-lg px-3 py-3 text-left ${selectedNote?._id === note._id
                                ? "bg-zinc-800"
                                : "hover:bg-zinc-900"
                                }`}
                        >
                            <p className="truncate font-medium">
                                {note.title || "Untitled"}
                            </p>

                            <p className="mt-1 truncate text-xs text-zinc-500">
                                {note.contentText || "Empty note"}
                            </p>
                        </button>
                    ))}
                </div>
            </aside>

            <section className="flex-1">
                {selectedNote ? (
                    <>
                        <div className="flex h-12 items-center justify-between border-b border-zinc-800 px-6 text-sm">
                            <span className="text-zinc-500">
                                {saveStatus === "saved" && "Saved"}
                                {saveStatus === "unsaved" && "Unsaved changes"}
                                {saveStatus === "saving" && "Saving..."}
                                {saveStatus === "error" && "Failed to save"}
                            </span>

                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="rounded-lg px-3 py-1.5 text-red-400 hover:bg-red-500/10"
                            >
                                Delete
                            </button>
                        </div>

                        <NoteEditor
                            title={selectedNote.title}
                            content={selectedNote.content}
                            onTitleChange={updateTitle}
                            onContentChange={updateContent}
                        />
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                        <h2 className="text-xl font-semibold">
                            Your knowledge base is empty
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Create your first note to start building your knowledge base.
                        </p>

                        <button
                            type="button"
                            onClick={createNote}
                            className="mt-6 rounded-lg bg-white px-5 py-2.5 font-medium text-black hover:bg-zinc-200"
                        >
                            Create your first note
                        </button>
                    </div>
                )}
            </section>

            {error && (
                <div className="fixed bottom-6 right-6 rounded-lg bg-red-500 px-4 py-3 text-sm text-white">
                    {error}
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold">
                            Delete this note?
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            This will permanently delete{" "}
                            <span className="font-medium text-white">
                                {selectedNote?.title || "Untitled"}
                            </span>
                            .
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Notes;