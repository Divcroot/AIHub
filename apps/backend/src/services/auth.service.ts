import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { generateAccessToken } from "../utils/jwt.js";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const registerUser = async ({
    name,
    email,
    password
}: RegisterInput) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError(
            409,
            "An account with this email already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
};

export const loginUser = async ({
    email,
    password
}: LoginInput) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        throw new AppError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user._id.toString());

    return {
        accessToken,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
    };
};