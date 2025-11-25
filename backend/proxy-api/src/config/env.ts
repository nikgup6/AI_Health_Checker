// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: number;
    GEMINI_API_KEY: string;
    GEMINI_MODEL: string;
    EVALUATOR_URL: string;
}

const PORT = parseInt(process.env.PORT || "8080", 10);

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

if (!process.env.EVALUATOR_URL) {
    throw new Error("EVALUATOR_URL is not set in environment variables");
}

const config: EnvConfig = {
    PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    EVALUATOR_URL: process.env.EVALUATOR_URL
};

export default config;
