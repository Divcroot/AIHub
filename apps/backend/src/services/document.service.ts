import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { Types } from "mongoose";
import { DocumentModel } from "../models/document.model";
import { DocumentChunk } from "../models/document-chunk.model.js";
import { chunkText } from "./chunk.service.js";

interface UploadedFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}

const PDF_MIME = "application/pdf";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const extractDocumentText = async (
    file: UploadedFile
): Promise<string> => {
    if (file.mimetype === PDF_MIME) {
        const parser = new PDFParse({
            data: file.buffer
        });

        try {
            const result = await parser.getText();

            return result.text.trim();
        } finally {
            await parser.destroy();
        }
    }

    if (file.mimetype === DOCX_MIME) {
        const result = await mammoth.extractRawText({
            buffer: file.buffer
        });

        return result.value.trim();
    }

    throw new Error("Unsupported document type");
};

export const getUserDocuments = async (userId: Types.ObjectId) => {
    return DocumentModel.find({ userId })
        .select("-extractedText")
        .sort({ createdAt: -1 });
};

export const deleteDocument = async (
    documentId: string,
    userId: Types.ObjectId
) => {
    if (!Types.ObjectId.isValid(documentId)) {
        throw new Error("Invalid document ID");
    }

    const document = await DocumentModel.findOneAndDelete({
        _id: documentId,
        userId
    });

    if (!document) {
        throw new Error("Document not found");
    }

    return document;
};

export const createDocumentChunks = async (
    documentId: Types.ObjectId,
    userId: Types.ObjectId,
    text: string
) => {
    const chunks = chunkText(text);

    if (chunks.length === 0) {
        return [];
    }

    const documents = chunks.map((chunk) => ({
        documentId,
        userId,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex
    }));

    return DocumentChunk.insertMany(documents);
};