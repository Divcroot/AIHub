import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

interface AccessTokenPayload {
    userId: string;
}

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

        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        ) as AccessTokenPayload;

        const user = await User.findById(decoded.userId);

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