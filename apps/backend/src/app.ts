import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Knowledge Hub API is running"
    });
});

app.use("/api/auth", authRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;