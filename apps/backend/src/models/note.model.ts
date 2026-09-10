import {
    Schema,
    model,
    type Document,
    type Types
} from "mongoose";

export interface INote extends Document {
    userId: Types.ObjectId;
    title: string;
    content: unknown;
    contentText: string;
    tags: string[];
    folderId?: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 200
        },

        content: {
            type: Schema.Types.Mixed,
            required: true
        },

        contentText: {
            type: String,
            default: ""
        },

        tags: {
            type: [String],
            default: []
        },

        folderId: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
        }
    },
    {
        timestamps: true
    }
);

noteSchema.index({ userId: 1, updatedAt: -1 });

export const Note = model<INote>("Note", noteSchema);