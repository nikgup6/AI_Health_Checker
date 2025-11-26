// src/services/api.ts
import axios from "axios";

// Why?
// Centralizes our backend URL. If later you deploy evaluator-service
// somewhere else, you only change this file.
const API_BASE_URL = "https://ai-health-checker-n137.onrender.com/api/v1"

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Types matching evaluator-service responses

export interface MetricsSummary {
    count: number;
    avgFactuality: number;
    avgRelevance: number;
    avgCoherence: number;
    avgSafety: number;
    avgCalibration: number;
    avgLatencyMs: number;
    avgHealthScore: number;
}

export interface MetricsItem {
    requestId: number;
    prompt: string;
    modelName: string;
    createdAt: string;
    healthScore: number;
    factuality: number;
    relevance: number;
    coherence: number;
    safety: number;
    normalizedLatency: number;
    calibration: number;
    latencyMs: number;
}

export interface MetricsListResponse {
    items: MetricsItem[];
}

// API calls

export async function fetchSummary(): Promise<MetricsSummary> {
    const res = await api.get<MetricsSummary>("/metrics/summary");
    return res.data;
}

export async function fetchRecentMetrics(limit: number = 20): Promise<MetricsItem[]> {
    const res = await api.get<MetricsListResponse>("/metrics/recent", {
        params: { limit },
    });
    return res.data.items;
}
