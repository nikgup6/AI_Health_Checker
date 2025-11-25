// src/components/RequestTable.tsx
import React, { useEffect, useState } from "react";
import { fetchRecentMetrics, type MetricsItem } from "../services/api";

const classifyScore = (score: number): "good" | "medium" | "bad" => {
    if (score >= 0.8) return "good";
    if (score >= 0.5) return "medium";
    return "bad";
};

const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;

export const RequestTable: React.FC = () => {
    const [items, setItems] = useState<MetricsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetchRecentMetrics(30)
            .then((data) => {
                if (mounted) setItems(data);
            })
            .catch((err) => {
                console.error("Error fetching recent metrics:", err);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="card" style={{ marginTop: "1rem" }}>
            <div className="card-header">
                <div>
                    <div className="card-title">Recent Responses</div>
                    <div className="card-subtitle">
                        Latest evaluated prompts, models, and health scores
                    </div>
                </div>
            </div>
            <div className="table-container">
                {loading ? (
                    <p className="muted" style={{ padding: "0.75rem" }}>
                        Loading recent metrics…
                    </p>
                ) : items.length === 0 ? (
                    <p className="muted" style={{ padding: "0.75rem" }}>
                        No data yet. Once your proxy routes /api/chat traffic, requests will appear here.
                    </p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Prompt</th>
                                <th>Model</th>
                                <th>Health</th>
                                <th>F</th>
                                <th>R</th>
                                <th>C</th>
                                <th>S</th>
                                <th>Latency</th>
                                <th>When</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const healthClass = classifyScore(item.healthScore);
                                const date = new Date(item.createdAt);
                                const when = date.toLocaleString();

                                return (
                                    <tr key={item.requestId}>
                                        <td>{item.requestId}</td>
                                        <td title={item.prompt}>{truncate(item.prompt, 60)}</td>
                                        <td>{item.modelName}</td>
                                        <td>
                                            <span className={`badge-score ${healthClass}`}>
                                                {(item.healthScore * 100).toFixed(1)}
                                            </span>
                                        </td>
                                        <td>{(item.factuality * 100).toFixed(0)}</td>
                                        <td>{(item.relevance * 100).toFixed(0)}</td>
                                        <td>{(item.coherence * 100).toFixed(0)}</td>
                                        <td>{(item.safety * 100).toFixed(0)}</td>
                                        <td>{item.latencyMs} ms</td>
                                        <td>{when}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
