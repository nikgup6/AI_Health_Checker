# app/services/scoring.py
def compute_health_score(
    factuality: float,
    relevance: float,
    coherence: float,
    safety: float,
    normalized_latency: float,
    calibration: float,
) -> float:
    """
    Health = 0.40*F + 0.20*R + 0.15*C + 0.10*S + 0.10*(1-L) + 0.05*K
    """
    return (
        0.40 * factuality
        + 0.20 * relevance
        + 0.15 * coherence
        + 0.10 * safety
        + 0.10 * (1.0 - normalized_latency)
        + 0.05 * calibration
    )
