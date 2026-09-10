import { Types } from "mongoose";
import { Note } from "../models/note.model.js";
import { AppError } from "../utils/app-error.js";

interface CreateNoteInput {
    title: string;
    content: unknown;
    contentText: string;
    tags: string[];
    folderId?: string | null;
}

interface UpdateNoteInput {
    title?: string;
    content?: unknown;
    contentText?: string;
    tags?: string[];
    folderId?: string | null;
}

export const createNote = async (
    userId: Types.ObjectId,
    input: CreateNoteInput
) => {
    const note = await Note.create({
        userId,
        title: input.title,
        content: input.content,
        contentText: input.contentText,
        tags: input.tags,
        ...(input.folderId
            ? {
                folderId: new Types.ObjectId(input.folderId)
            }
            : {})
    });

    return note;
};

export const getUserNotes = async (
    userId: Types.ObjectId
) => {
    return Note.find({ userId }).sort({
        updatedAt: -1
    });
};

export const getUserNoteById = async (
    userId: Types.ObjectId,
    noteId: string
) => {
    if (!Types.ObjectId.isValid(noteId)) {
        throw new AppError(400, "Invalid note ID");
    }

    const note = await Note.findOne({
        _id: noteId,
        userId
    });

    if (!note) {
        throw new AppError(404, "Note not found");
    }

    return note;
};

export const updateNote = async (
    userId: Types.ObjectId,
    noteId: string,
    input: UpdateNoteInput
) => {
    if (!Types.ObjectId.isValid(noteId)) {
        throw new AppError(400, "Invalid note ID");
    }

    const updateData: Record<string, unknown> = {
        ...input
    };

    delete updateData.folderId;

    const updateOperation: {
        $set: Record<string, unknown>;
        $unset?: Record<string, 1>;
    } = {
        $set: updateData
    };

    if (input.folderId) {
        updateOperation.$set.folderId = new Types.ObjectId(
            input.folderId
        );
    } else if (input.folderId === null) {
        updateOperation.$unset = {
            folderId: 1
        };
    }

    const note = await Note.findOneAndUpdate(
        {
            _id: noteId,
            userId
        },
        updateOperation,
        {
            new: true,
            runValidators: true
        }
    );

    if (!note) {
        throw new AppError(404, "Note not found");
    }

    return note;
};

export const deleteNote = async (
    userId: Types.ObjectId,
    noteId: string
) => {
    if (!Types.ObjectId.isValid(noteId)) {
        throw new AppError(400, "Invalid note ID");
    }

    const note = await Note.findOneAndDelete({
        _id: noteId,
        userId
    });

    if (!note) {
        throw new AppError(404, "Note not found");
    }
};