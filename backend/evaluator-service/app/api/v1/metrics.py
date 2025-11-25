# app/api/v1/metrics.py
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.request import Request
from app.models.metrics import Metrics
from app.schemas.metrics import MetricsSummary, MetricsListResponse, MetricsItem

router = APIRouter()

@router.get("/metrics/summary", response_model=MetricsSummary)
def get_summary(db: Session = Depends(get_db)):
    """
    Aggregate averages for metrics + health score.
    """

    count = db.query(func.count(Metrics.id)).scalar() or 0
    if count == 0:
        # No data yet; return zeros
        return MetricsSummary(
            count=0,
            avgFactuality=0.0,
            avgRelevance=0.0,
            avgCoherence=0.0,
            avgSafety=0.0,
            avgCalibration=0.0,
            avgLatencyMs=0.0,
            avgHealthScore=0.0,
        )

    avg_f, avg_r, avg_c, avg_s, avg_k, avg_health = db.query(
        func.avg(Metrics.factuality),
        func.avg(Metrics.relevance),
        func.avg(Metrics.coherence),
        func.avg(Metrics.safety),
        func.avg(Metrics.calibration),
        func.avg(Metrics.health_score),
    ).one()

    avg_latency = db.query(func.avg(Request.latency_ms)).scalar() or 0.0

    return MetricsSummary(
        count=count,
        avgFactuality=avg_f or 0.0,
        avgRelevance=avg_r or 0.0,
        avgCoherence=avg_c or 0.0,
        avgSafety=avg_s or 0.0,
        avgCalibration=avg_k or 0.0,
        avgLatencyMs=avg_latency,
        avgHealthScore=avg_health or 0.0,
    )


@router.get("/metrics/recent", response_model=MetricsListResponse)
def get_recent_metrics(limit: int = 20, db: Session = Depends(get_db)):
    """
    Return a list of recent requests + metrics for the dashboard table.
    """

    query = (
        db.query(Request, Metrics)
        .join(Metrics, Metrics.request_id == Request.id)
        .order_by(Request.created_at.desc())
        .limit(limit)
    )

    items = []
    for req, met in query.all():
        items.append(
            MetricsItem(
                requestId=req.id,
                prompt=req.prompt,
                modelName=req.model_name,
                createdAt=req.created_at,
                healthScore=met.health_score,
                factuality=met.factuality,
                relevance=met.relevance,
                coherence=met.coherence,
                safety=met.safety,
                normalizedLatency=met.normalized_latency,
                calibration=met.calibration,
                latencyMs=req.latency_ms,
            )
        )

    return MetricsListResponse(items=items)
