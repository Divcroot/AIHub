import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error.js";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next
) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                success: false,
                message: "File size must be 10MB or less"
            });

            return;
        }

        res.status(400).json({
            success: false,
            message: "File upload failed"
        });

        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });

        return;
    }

    console.error("Unhandled error:", error);

    res.status(500).json({
        success: false,
        message: "Something went wrong"
    });
};