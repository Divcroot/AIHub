import {
    Schema,
    model,
    type Document,
    type Types
} from "mongoose";

export type DocumentStatus =
    | "processing"
    | "ready"
    | "failed";

export interface IDocument extends Document {
    userId: Types.ObjectId;

    originalName: string;
    mimeType: string;
    size: number;

    extractedText: string;

    status: DocumentStatus;
    errorMessage?: string;

    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        originalName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },

        mimeType: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true,
            min: 1
        },

        extractedText: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["processing", "ready", "failed"],
            default: "processing",
            required: true
        },

        errorMessage: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

documentSchema.index({
    userId: 1,
    createdAt: -1
});

export const DocumentModel = model<IDocument>(
    "Document",
    documentSchema
);