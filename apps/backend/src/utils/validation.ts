import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters")
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(1, "Password is required")
});

export const createNoteSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(200, "Title must be at most 200 characters"),

    content: z
        .unknown(),

    contentText: z
        .string()
        .max(500_000, "Content is too large")
        .default(""),

    tags: z
        .array(
            z
                .string()
                .trim()
                .min(1)
                .max(50)
        )
        .max(20)
        .default([]),

    folderId: z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Invalid folder ID")
        .nullable()
        .optional()
});

export const updateNoteSchema = createNoteSchema.partial();