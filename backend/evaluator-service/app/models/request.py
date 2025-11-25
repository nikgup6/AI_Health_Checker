# app/models/request.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, BigInteger, DateTime
from app.core.db import Base

class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=True)
    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    model_name = Column(String(255), nullable=False)
    latency_ms = Column(BigInteger, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
