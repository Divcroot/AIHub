import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

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