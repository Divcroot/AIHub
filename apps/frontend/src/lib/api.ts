const API_URL = import.meta.env.VITE_API_URL;

interface ApiOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
}

const request = async <T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> => {
    const { body, ...fetchOptions } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers
        },
        body: body ? JSON.stringify(body) : undefined
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
        }>("/api/auth/me")
};