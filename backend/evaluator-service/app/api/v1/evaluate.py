# app/api/v1/evaluate.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db, Base, engine
from app.models.request import Request
from app.models.metrics import Metrics
from app.schemas.evaluation import EvaluationRequest, EvaluationResponse
from app.services.judge import judge_online
from app.services.latency import compute_normalized_latency
from app.services.scoring import compute_health_score

# Ensure tables exist (simple auto-create for MVP)
Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.post("/evaluate", response_model=EvaluationResponse)
def evaluate(request: EvaluationRequest, db: Session = Depends(get_db)):
    """
    Evaluate a single prompt/response pair, compute metrics + health score,
    store them in the DB, and return them.
    """

    # 1) Store raw request
    req = Request(
        user_id=request.userId,
        prompt=request.prompt,
        response=request.response,
        model_name=request.modelName,
        latency_ms=request.latencyMs,
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    # 2) Judge the answer using Gemini
    scores = judge_online(req.prompt, req.response)

    factuality = scores["factuality"]
    relevance = scores["relevance"]
    coherence = scores["coherence"]
    safety = scores["safety"]
    calibration = scores["calibration"]

    # 3) Latency normalization
    norm_latency = compute_normalized_latency(req.latency_ms)

    # 4) Health score
    health = compute_health_score(
        factuality, relevance, coherence, safety, norm_latency, calibration
    )

    # 5) Store metrics
    metrics = Metrics(
        request_id=req.id,
        factuality=factuality,
        relevance=relevance,
        coherence=coherence,
        safety=safety,
        normalized_latency=norm_latency,
        calibration=calibration,
        health_score=health,
    )
    db.add(metrics)
    db.commit()
    db.refresh(metrics)

    # 6) Return response
    return EvaluationResponse(
        requestId=req.id,
        factuality=factuality,
        relevance=relevance,
        coherence=coherence,
        safety=safety,
        normalizedLatency=norm_latency,
        calibration=calibration,
        healthScore=health,
    )
