// src/routes/chat.ts
import { Router, Request, Response } from "express";
import { callGptModel } from "../services/gptClient";
import { sendForEvaluation } from "../services/evaluatorClient";

const router = Router();

/**
 * POST /chat
 * Body: { userId?: string, prompt: string }
 *
 * Flow:
 * 1. Call GPT model for the answer.
 * 2. Measure latency.
 * 3. Asynchronously send data to evaluator-service.
 * 4. Return GPT answer immediately to user.
 */
router.post("/chat", async (req: Request, res: Response) => {
    const { userId, prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "prompt is required and must be a string" });
    }

    try {
        const start = Date.now();

        // 1) Call GPT
        const gptResult = await callGptModel(prompt);

        const latencyMs = Date.now() - start;

        // 2) Prepare evaluation payload
        const evalPayload = {
            prompt,
            response: gptResult.content,
            latencyMs,
            modelName: gptResult.model,
            userId
        };

        // 3) Send to evaluator (async, don't block user)
        sendForEvaluation(evalPayload).then((evalRes) => {
            if (evalRes) {
                console.log(
                    `Evaluation completed for request: healthScore=${evalRes.healthScore.toFixed(3)}`
                );
            }
        });

        // 4) Respond to the client
        return res.json({
            answer: gptResult.content,
            model: gptResult.model,
            latencyMs
        });
    } catch (error: any) {
        console.error("Error in /chat route:", error?.response?.data || error.message);
        return res.status(500).json({ error: "Failed to process chat request" });
    }
});

export default router;
