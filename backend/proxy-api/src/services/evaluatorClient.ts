// src/services/evaluatorClient.ts
import axios from "axios";
import config from "../config/env";

export interface EvaluationPayload {
    prompt: string;
    response: string;
    latencyMs: number;
    modelName: string;
    userId?: string;
}

export interface EvaluationResult {
    requestId: string;
    factuality: number;
    relevance: number;
    coherence: number;
    safety: number;
    normalizedLatency: number;
    calibration: number;
    healthScore: number;
}

export async function sendForEvaluation(
    payload: EvaluationPayload
): Promise<EvaluationResult | null> {
    try {
        const res = await axios.post(config.EVALUATOR_URL, payload);
        return res.data as EvaluationResult;
    } catch (err) {
        console.error("Error sending data to evaluator service:", err);
        return null;
    }
}
