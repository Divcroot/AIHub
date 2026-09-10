import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new AppError(401, "Authentication required");
        }

        const { userId } = verifyAccessToken(token);

        const user = await User.findById(userId);

        if (!user) {
            throw new AppError(401, "Authentication required");
        }

        req.user = user;

        next();
    } catch (error) {
        next(
            error instanceof AppError
                ? error
                : new AppError(401, "Authentication required")
        );
    }
};