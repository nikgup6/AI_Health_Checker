# app/models/metrics.py
from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base

class Metrics(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=False, unique=True)

    factuality = Column(Float, nullable=False)
    relevance = Column(Float, nullable=False)
    coherence = Column(Float, nullable=False)
    safety = Column(Float, nullable=False)
    normalized_latency = Column(Float, nullable=False)
    calibration = Column(Float, nullable=False)
    health_score = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    request = relationship("Request", backref="metrics")
