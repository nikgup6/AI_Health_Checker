# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.evaluate import router as eval_router
from app.api.v1.metrics import router as metrics_router

app = FastAPI(title="AI HealthGuard Evaluator Service", version="0.1.0")

# CORS (so your React frontend can call this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "evaluator-service"}

app.include_router(eval_router, prefix="/api/v1")
app.include_router(metrics_router, prefix="/api/v1")
