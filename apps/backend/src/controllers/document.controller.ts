import type { Request, Response } from "express";
import { DocumentModel } from "../models/document.model.js";
import { extractDocumentText, getUserDocuments, deleteDocument } from "../services/document.service.js";
import { AppError } from "../utils/app-error.js";

export const upload = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(
            401,
            "Authentication required"
        );
    }

    if (!req.file) {
        throw new AppError(
            400,
            "A document file is required"
        );
    }

    try {
        const extractedText = await extractDocumentText(
            req.file
        );

        if (!extractedText) {
            throw new AppError(
                400,
                "No readable text was found in the document"
            );
        }

        const document = await DocumentModel.create({
            userId: req.user._id,

            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,

            extractedText,

            status: "ready"
        });

        res.status(201).json({
            success: true,
            document: {
                _id: document._id,
                originalName: document.originalName,
                mimeType: document.mimeType,
                size: document.size,
                status: document.status,
                createdAt: document.createdAt
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            400,
            "Failed to process document"
        );
    }
};

export const getAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const documents = await getUserDocuments(req.user._id);

    res.status(200).json({
        success: true,
        documents
    });
};

export const remove = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    const documentId = req.params.id;

    if (typeof documentId !== "string") {
        throw new AppError(400, "Invalid document ID");
    }

    try {
        await deleteDocument(documentId, req.user._id);

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Invalid document ID") {
            throw new AppError(400, error.message);
        }

        if (error instanceof Error && error.message === "Document not found") {
            throw new AppError(404, error.message);
        }

        throw error;
    }
};