import { useEffect, useRef, useState } from "react";
import { api, type Document } from "../lib/api";

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (mimeType: string) => {
    if (mimeType === "application/pdf") {
        return "PDF";
    }

    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return "DOCX";
    }

    return "File";
};

export default function Documents() {

    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const loadDocuments = async () => {
        try {
            setError(null);

            const response = await api.documents.getAll();

            setDocuments(response.documents);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load documents"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setError(null);
            setUploading(true);

            await api.documents.upload(file);

            await loadDocuments();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to upload document"
            );
        } finally {
            setUploading(false);

            // Allow selecting the same file again.
            event.target.value = "";
        }
    };

    const handleDelete = async (document: Document) => {
        const confirmed = window.confirm(`Delete "${document.originalName}"?`);

        if (!confirmed) {
            return;
        }

        try {
            setError(null);
            setDeletingId(document._id);

            await api.documents.delete(document._id);

            setDocuments((current) =>
                current.filter((item) => item._id !== document._id)
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete document"
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Documents
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload PDFs and Word documents to your
                            knowledge base.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload document"}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading documents...
                    </div>
                ) : documents.length === 0 ? (
                    /* Empty state */
                    <div className="rounded-xl border border-dashed border-gray-300 p-16 text-center">
                        <div className="mb-4 text-5xl">📄</div>

                        <h2 className="text-lg font-semibold">
                            No documents yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Upload a PDF or DOCX to start building
                            your knowledge base.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="mt-6 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Upload your first document
                        </button>
                    </div>
                ) : (
                    /* Document list */
                    <div className="space-y-3">
                        {documents.map((document) => (
                            <div
                                key={document._id}
                                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl">
                                        {getFileType(
                                            document.mimeType
                                        ) === "PDF"
                                            ? "📕"
                                            : "📘"}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-medium">
                                            {document.originalName}
                                        </h3>

                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                            <span>
                                                {getFileType(
                                                    document.mimeType
                                                )}
                                            </span>

                                            <span>•</span>

                                            <span>
                                                {formatFileSize(
                                                    document.size
                                                )}
                                            </span>

                                            <span>•</span>

                                            <span>
                                                {new Date(
                                                    document.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-4 flex shrink-0 items-center gap-4">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${document.status ===
                                                "ready"
                                                ? "bg-green-100 text-green-700"
                                                : document.status ===
                                                    "failed"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {document.status}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(document)
                                        }
                                        disabled={
                                            deletingId ===
                                            document._id
                                        }
                                        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                                    >
                                        {deletingId === document._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}