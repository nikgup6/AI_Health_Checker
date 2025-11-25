# app/schemas/metrics.py
from datetime import datetime
from typing import List
from pydantic import BaseModel

class MetricsSummary(BaseModel):
    count: int
    avgFactuality: float
    avgRelevance: float
    avgCoherence: float
    avgSafety: float
    avgCalibration: float
    avgLatencyMs: float
    avgHealthScore: float

class MetricsItem(BaseModel):
    requestId: int
    prompt: str
    modelName: str
    createdAt: datetime
    healthScore: float
    factuality: float
    relevance: float
    coherence: float
    safety: float
    normalizedLatency: float
    calibration: float
    latencyMs: int

class MetricsListResponse(BaseModel):
    items: List[MetricsItem]
