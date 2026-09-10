import type { Request, Response } from "express";
import { registerSchema } from "../utils/validation.js";
import { registerUser } from "../services/auth.service.js";
import { loginSchema } from "../utils/validation.js";
import { loginUser } from "../services/auth.service.js";
import { AppError } from "../utils/app-error.js";
import { env } from "../config/env.js";

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.flatten().fieldErrors
        });

        return;
    }

    try {
        const user = await registerUser(result.data);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });

            return;
        }

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.flatten().fieldErrors
        });

        return;
    }

    try {
        const { accessToken, user } = await loginUser(result.data);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });

            return;
        }

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const getCurrentUser = (
    req: Request,
    res: Response
): void => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    res.status(200).json({
        success: true,
        user: {
            id: req.user._id.toString(),
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt
        }
    });
};

export const logout = (
    _req: Request,
    res: Response
): void => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};