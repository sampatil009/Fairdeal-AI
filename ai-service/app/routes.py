from flask import Flask, request, jsonify
from .nlp.parser import extract_price_and_intent
from .nlp.sentiment import analyze_sentiment
from .rl.agent import get_rl_action
from .explainability.explainer import generate_explanation

def init_routes(app):
    @app.route('/api/decide', methods=['POST'])
    def decide():
        data = request.json
        offer_text = str(data.get("offer", ""))
        context = data.get("context", {})

        # 1. NLP: Extract intent and clean offer
        parsed_offer, intent = extract_price_and_intent(offer_text)
        
        # Override parsed offer if it was passed numerically 
        if isinstance(data.get("offer"), (int, float)):
            parsed_offer = data.get("offer")

        # 2. Sentiment Analysis
        sentiment_score = analyze_sentiment(offer_text)

        # 3. RL Engine Decision
        action, counter_offer, confidence = get_rl_action(parsed_offer, context, sentiment_score)

        # 4. Explainability (SHAP)
        explanation = generate_explanation(action, parsed_offer, context, sentiment_score)

        return jsonify({
            "action": action,
            "counter_offer": counter_offer,
            "sentiment": sentiment_score,
            "confidence": confidence,
            "explanation": explanation
        }), 200
