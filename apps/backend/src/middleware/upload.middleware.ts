import multer from "multer";
import { AppError } from "../utils/app-error.js";

const storage = multer.memoryStorage();

export const uploadDocument = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (_req, file, callback) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            callback(
                new AppError(
                    400,
                    "Only PDF and DOCX files are supported"
                )
            );

            return;
        }

        callback(null, true);
    }
});