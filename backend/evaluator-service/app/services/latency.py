# app/services/latency.py
from app.core.config import settings

def compute_normalized_latency(latency_ms: float) -> float:
    """Map latency to [0, 1], where 0 = fastest, 1 = worst."""
    if latency_ms <= 0:
        return 0.0
    value = latency_ms / settings.LATENCY_MAX_MS
    return min(1.0, max(0.0, value))
