// src/index.ts
import express from "express";
import cors from "cors";
import config from "./config/env";
import chatRouter from "./routes/chat";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "proxy-api" });
});

// Routes
app.use("/api", chatRouter);

// Start server
app.listen(config.PORT, () => {
    console.log(`Proxy API listening on port ${config.PORT}`);
});
