from flask import request
from flask_socketio import emit
from flask_jwt_extended import decode_token
import json
import uuid
import datetime
from ..services.ai_client import get_ai_decision
from ..config import Config

# Using the socketio instance imported in __init__
from app import socketio, db, redis_client

@socketio.on('join_negotiation')
def handle_join(data):
    # Verify Auth Token from connection handshake
    token = request.args.get('token')
    if not token:
        emit('negotiation_error', {'message': 'Unauthorized'})
        return
        
    try:
        decoded = decode_token(token)
        user_id = decoded['sub']
    except Exception:
        emit('negotiation_error', {'message': 'Invalid token'})
        return
        
    product_id = data.get('productId')
    if not product_id:
        emit('negotiation_error', {'message': 'Product ID required'})
        return

    product = db.products.find_one({"id": product_id})
    if not product or not product.get('negotiationEnabled'):
        emit('negotiation_error', {'message': 'Product not negotiable'})
        return
        
    session_id = f"neg_sess:{user_id}:{product_id}"
    
    # Check if session exists in Redis
    session_data = redis_client.get(session_id)
    
    if session_data:
        session = json.loads(session_data)
        emit('negotiation_history', session)
    else:
        # Start new session
        session = {
            "userId": user_id,
            "productId": product_id,
            "status": "active",
            "currentRound": 1,
            "messages": [],
        }
        redis_client.setex(session_id, 3600 * 24, json.dumps(session)) # 24h expiry
        emit('negotiation_history', session)

@socketio.on('send_offer')
def handle_offer(data):
    token = request.args.get('token')
    if not token:
        return
    try:
        user_id = decode_token(token)['sub']
    except:
        return
        
    product_id = data.get('productId')
    offer_amount = data.get('offer')
    
    product = db.products.find_one({"id": product_id})
    user = db.users.find_one({"id": user_id})
    
    if not product or not user:
        return
        
    session_id = f"neg_sess:{user_id}:{product_id}"
    session_data = redis_client.get(session_id)
    
    if not session_data:
        emit('negotiation_error', {'message': 'Session expired'})
        return
        
    session = json.loads(session_data)
    
    if session['status'] == 'accepted':
        emit('negotiation_error', {'message': 'Deal already closed'})
        return
        
    if session['currentRound'] > 5:
        emit('negotiation_error', {'message': 'Max rounds reached'})
        return

    # Add user message
    user_msg = {
        "id": str(uuid.uuid4()),
        "sender": "user",
        "text": f"I'll offer ₹{offer_amount:,}",
        "offerAmount": offer_amount,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    session['messages'].append(user_msg)

    # Prepare context for AI Service
    ai_context = {
        "productId": product_id,
        "originalPrice": product["price"],
        "minPrice": product["minPrice"],
        "userTier": user.get("tier", "Bronze"),
        "currentRound": session["currentRound"],
        "maxRounds": 5
    }
    
    # Call AI Service Microservice (Blocking call, simple for now in SocketIO)
    decision = get_ai_decision(offer_amount, ai_context)
    
    # Action handling
    action = decision.get("action", "counter")
    ai_offer = decision.get("counter_offer", product["price"])
    sentiment = decision.get("sentiment", 0.0)
    confidence = decision.get("confidence", 0.5)
    explanation = decision.get("explanation", [])
    
    ai_msg = {
        "id": str(uuid.uuid4()),
        "sender": "ai",
        "text": f"My counter-offer is ₹{ai_offer:,}",
        "offerAmount": ai_offer,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "metadata": {
            "sentiment": sentiment,
            "confidence": confidence,
            "explanation": explanation
        }
    }
    
    if action == "accept" or offer_amount >= ai_offer:
        # Deal accepted
        session['status'] = 'accepted'
        final_price = offer_amount if offer_amount >= ai_offer else ai_offer
        ai_msg["text"] = f"Deal! I can accept ₹{final_price:,}. 🎉"
        ai_msg["offerAmount"] = final_price
        
        savings = product["price"] - final_price
        savings_pct = (savings / product["price"]) * 100
        
        session['messages'].append(ai_msg)
        redis_client.setex(session_id, 3600 * 24, json.dumps(session))
        
        emit('receive_message', ai_msg)
        emit('deal_accepted', {"price": final_price, "savingsPercent": savings_pct})
        
        # Save to Mongo
        db.negotiation_sessions.insert_one(session)
        
    else:
        # Counter offer
        session['currentRound'] += 1
        session['messages'].append(ai_msg)
        redis_client.setex(session_id, 3600 * 24, json.dumps(session))
        
        emit('receive_message', ai_msg)
        emit('round_update', session['currentRound'])
