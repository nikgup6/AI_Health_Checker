# app/schemas/evaluation.py
from typing import Optional
from pydantic import BaseModel, Field

class EvaluationRequest(BaseModel):
    prompt: str = Field(..., description="User's original prompt")
    response: str = Field(..., description="Model's response")
    latencyMs: int = Field(..., ge=0, description="Latency in milliseconds")
    modelName: str = Field(..., description="Name of the model used")
    userId: Optional[str] = Field(None, description="Optional user identifier")

class EvaluationResponse(BaseModel):
    requestId: int
    factuality: float
    relevance: float
    coherence: float
    safety: float
    normalizedLatency: float
    calibration: float
    healthScore: float
