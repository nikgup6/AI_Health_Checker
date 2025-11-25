// src/services/gptClient.ts
import axios from "axios";
import config from "../config/env";

export interface ChatCompletionResult {
    model: string;
    content: string;
}

/**
 * Calls the Gemini model and returns the generated message.
 * We treat Gemini as a drop-in replacement for the previous GPT-like call.
 */
export async function callGptModel(prompt: string): Promise<ChatCompletionResult> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent`;

    const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": config.GEMINI_API_KEY
    };

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ]
    };

    const response = await axios.post(url, body, { headers });

    // Gemini response format:
    // {
    //   candidates: [
    //     {
    //       content: { parts: [ { text: "..." }, ... ] },
    //       ...
    //     }
    //   ]
    // }
    const candidate = response.data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const content = parts.map((p: any) => p.text || "").join("");

    return {
        model: config.GEMINI_MODEL,
        content
    };
}
