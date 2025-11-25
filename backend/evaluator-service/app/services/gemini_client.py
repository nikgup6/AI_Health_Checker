# app/services/gemini_client.py
import requests
from app.core.config import settings

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

def call_gemini_chat(model: str, prompt_text: str) -> str:
    """
    Call Gemini's generateContent with a simple text prompt.
    """
    url = f"{GEMINI_API_BASE}/{model}:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": settings.GEMINI_API_KEY,
    }
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt_text}],
            }
        ],
        "generationConfig": {
            "temperature": 0.0  # make output more deterministic / less verbose
        },
    }

    resp = requests.post(url, headers=headers, json=body, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    candidates = data.get("candidates", [])
    if not candidates:
        return ""

    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(p.get("text", "") for p in parts)
    return text
