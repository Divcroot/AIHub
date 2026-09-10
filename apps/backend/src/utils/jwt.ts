import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";

interface AccessTokenPayload {
    userId: string;
}

export const generateAccessToken = (userId: string): string => {
    const options: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    };

    return jwt.sign(
        { userId } satisfies AccessTokenPayload,
        env.JWT_SECRET,
        options
    );
};

export const verifyAccessToken = (
    token: string
): AccessTokenPayload => {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.userId !== "string"
    ) {
        throw new AppError(401, "Authentication required");
    }

    return {
        userId: decoded.userId
    };
};