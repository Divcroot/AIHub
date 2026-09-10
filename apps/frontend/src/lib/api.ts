const API_URL = import.meta.env.VITE_API_URL;

interface ApiOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
}

const request = async <T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> => {
    const { body, ...fetchOptions } = options;

    const isFormData = body instanceof FormData;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: "include",
        headers: {
            ...(isFormData
                ? {}
                : { "Content-Type": "application/json" }),
            ...fetchOptions.headers
        },
        body: isFormData
            ? body
            : body
                ? JSON.stringify(body)
                : undefined
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface Note {
    _id: string;
    userId: string;
    title: string;
    content: unknown;
    contentText: string;
    tags: string[];
    folderId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Document {
    _id: string;
    userId: string;
    originalName: string;
    mimeType: string;
    size: number;
    status: "processing" | "ready" | "failed";
    createdAt: string;
    updatedAt: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
}

export const api = {
    health: () =>
        request<{
            success: boolean;
            message: string;
        }>("/api/health"),

    auth: {
        register: (data: {
            name: string;
            email: string;
            password: string;
        }) =>
            request<AuthResponse>("/api/auth/register", {
                method: "POST",
                body: data
            }),

        login: (data: {
            email: string;
            password: string;
        }) =>
            request<AuthResponse>("/api/auth/login", {
                method: "POST",
                body: data
            }),

        logout: () =>
            request<{
                success: boolean;
                message: string;
            }>("/api/auth/logout", {
                method: "POST"
            }),

        me: () =>
            request<{
                success: boolean;
                user: User;
            }>("/api/auth/me"),
    },

    notes: {
        getAll: () =>
            request<{
                success: boolean;
                notes: Note[];
            }>("/api/notes"),

        getById: (id: string) =>
            request<{
                success: boolean;
                note: Note;
            }>(`/api/notes/${id}`),

        create: (data: {
            title: string;
            content: unknown;
            contentText: string;
            tags?: string[];
            folderId?: string | null;
        }) =>
            request<{
                success: boolean;
                note: Note;
            }>("/api/notes", {
                method: "POST",
                body: data
            }),

        update: (
            id: string,
            data: {
                title?: string;
                content?: unknown;
                contentText?: string;
                tags?: string[];
                folderId?: string | null;
            }
        ) =>
            request<{
                success: boolean;
                note: Note;
            }>(`/api/notes/${id}`, {
                method: "PATCH",
                body: data
            }),

        delete: (id: string) =>
            request<{
                success: boolean;
                message: string;
            }>(`/api/notes/${id}`, {
                method: "DELETE"
            })
    },

    documents: {
        getAll: () =>
            request<{ success: boolean; documents: Document[] }>(
                "/api/documents"
            ),

        upload: (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            return request<{
                success: boolean;
                document: Document;
            }>("/api/documents/upload", {
                method: "POST",
                body: formData
            });
        },

        delete: (id: string) =>
            request<{ success: boolean; message: string }>(
                `/api/documents/${id}`,
                {
                    method: "DELETE"
                }
            )
    }
};