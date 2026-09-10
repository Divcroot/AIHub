import {
    Schema,
    model,
    type Document,
    type Types
} from "mongoose";

export interface IDocumentChunk extends Document {
    documentId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
    chunkIndex: number;
    tokenCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const documentChunkSchema = new Schema<IDocumentChunk>(
    {
        documentId: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true,
            index: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        content: {
            type: String,
            required: true
        },

        chunkIndex: {
            type: Number,
            required: true,
            min: 0
        },

        tokenCount: {
            type: Number,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

documentChunkSchema.index({
    documentId: 1,
    chunkIndex: 1
});

documentChunkSchema.index({
    userId: 1,
    documentId: 1
});

export const DocumentChunk = model<IDocumentChunk>(
    "DocumentChunk",
    documentChunkSchema
);