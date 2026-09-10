import type { Request, Response } from "express";
import {
    createNoteSchema,
    updateNoteSchema
} from "../utils/validation.js";
import {
    createNote,
    getUserNotes,
    getUserNoteById,
    updateNote,
    deleteNote
} from "../services/note.service.js";
import { AppError } from "../utils/app-error.js";

export const create = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const result = createNoteSchema.safeParse(req.body);

    if (!result.success) {
        throw new AppError(400, "Validation failed");
    }

    const note = await createNote(
        req.user._id,
        result.data
    );

    res.status(201).json({
        success: true,
        note
    });
};

export const getAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const notes = await getUserNotes(req.user._id);

    res.status(200).json({
        success: true,
        notes
    });
};

export const getById = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const noteId = req.params.id;

    if (typeof noteId !== "string") {
        throw new AppError(400, "Invalid note ID");
    }

    const note = await getUserNoteById(
        req.user._id,
        noteId
    );

    res.status(200).json({
        success: true,
        note
    });
};

export const update = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const result = updateNoteSchema.safeParse(req.body);

    if (!result.success) {
        throw new AppError(400, "Validation failed");
    }

    const noteId = req.params.id;

    if (typeof noteId !== "string") {
        throw new AppError(400, "Invalid note ID");
    }

    const note = await updateNote(
        req.user._id,
        noteId,
        result.data
    );

    res.status(200).json({
        success: true,
        note
    });
};

export const remove = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const noteId = req.params.id;

    if (typeof noteId !== "string") {
        throw new AppError(400, "Invalid note ID");
    }

    await deleteNote(
        req.user._id,
        noteId
    );

    res.status(200).json({
        success: true,
        message: "Note deleted successfully"
    });
};