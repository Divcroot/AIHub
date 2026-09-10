import "dotenv/config";

const requiredEnvVariables = [
    "MONGODB_URI",
    "JWT_SECRET"
] as const;

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

export const env = {
    PORT: Number(process.env.PORT) || 4000,
    MONGODB_URI: process.env.MONGODB_URI!,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d"
};