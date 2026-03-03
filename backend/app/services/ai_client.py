import requests
import os

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:5001")

def get_ai_decision(offer, context):
    """
    Hits the internal Flask microservice for AI processing.
    Context includes: productId, originalPrice, minPrice, userTier, currentRound
    """
    try:
        payload = {
            "offer": offer,
            "context": context
        }
        res = requests.post(f"{AI_SERVICE_URL}/api/decide", json=payload, timeout=3.0)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Error calling AI Service: {e}")
        # Fake fallback if AI Service is down
        return {
            "action": "counter",
            "counter_offer": context["originalPrice"],
            "sentiment": 0.0,
            "confidence": 0.5,
            "explanation": ["AI disconnected. Sending list price."]
        }
