// src/components/HealthOverview.tsx
import React, { useEffect, useState } from "react";
import { fetchSummary, type MetricsSummary } from "../services/api";

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

const formatLatency = (ms: number) => `${ms.toFixed(0)} ms`;

const classifyScore = (score: number): "good" | "medium" | "bad" => {
    if (score >= 0.8) return "good";
    if (score >= 0.5) return "medium";
    return "bad";
};

export const HealthOverview: React.FC = () => {
    const [summary, setSummary] = useState<MetricsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetchSummary()
            .then((data) => {
                if (mounted) {
                    setSummary(data);
                }
            })
            .catch((err) => {
                console.error("Error fetching summary:", err);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">AI Health Overview</div>
                        <div className="card-subtitle">Loading metrics…</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!summary || summary.count === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">AI Health Overview</div>
                        <div className="card-subtitle">
                            No evaluated requests yet. Use your /api/chat endpoint to start generating data.
                        </div>
                    </div>
                </div>
                <p className="muted">
                    Once your proxy sends prompts and responses to the evaluator, you’ll see average health
                    and quality metrics here.
                </p>
            </div>
        );
    }

    const healthClass = classifyScore(summary.avgHealthScore);

    return (
        <div className="grid grid-2">
            {/* Main health card */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">AI Health Score</div>
                        <div className="card-subtitle">
                            Aggregated across {summary.count} evaluated responses
                        </div>
                    </div>
                    <span className={`chip ${healthClass === "bad" ? "bad" : ""}`}>
                        <span
                            style={{
                                display: "inline-block",
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor:
                                    healthClass === "good"
                                        ? "#22c55e"
                                        : healthClass === "medium"
                                            ? "#eab308"
                                            : "#ef4444",
                            }}
                        ></span>
                        {healthClass === "good"
                            ? "Healthy"
                            : healthClass === "medium"
                                ? "Moderate"
                                : "Needs attention"}
                    </span>
                </div>
                <div>
                    <div className="metric-value-lg">
                        {(summary.avgHealthScore * 100).toFixed(1)}
                        <span style={{ fontSize: "1rem", marginLeft: 4 }}>/ 100</span>
                    </div>
                    <p className="muted">
                        Composite score from factuality, relevance, coherence, safety, latency, and calibration.
                    </p>
                </div>
            </div>

            {/* Secondary metrics */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Quality & Performance</div>
                        <div className="card-subtitle">Key averages across all responses</div>
                    </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                    <div>
                        <div className="metric-label">Factuality</div>
                        <div>{formatPercent(summary.avgFactuality)}</div>
                    </div>
                    <div>
                        <div className="metric-label">Relevance</div>
                        <div>{formatPercent(summary.avgRelevance)}</div>
                    </div>
                    <div>
                        <div className="metric-label">Coherence</div>
                        <div>{formatPercent(summary.avgCoherence)}</div>
                    </div>
                    <div>
                        <div className="metric-label">Safety</div>
                        <div>{formatPercent(summary.avgSafety)}</div>
                    </div>
                    <div>
                        <div className="metric-label">Calibration</div>
                        <div>{formatPercent(summary.avgCalibration)}</div>
                    </div>
                    <div>
                        <div className="metric-label">Avg Latency</div>
                        <div>{formatLatency(summary.avgLatencyMs)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
