from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
import datetime

order_bp = Blueprint('orders', __name__)

@order_bp.route('/', methods=['POST'])
@jwt_required(optional=True)
def create_order():
    from app import db
    user_id = get_jwt_identity() # None if guest
    data = request.get_json()
    
    items = data.get('items', [])
    shipping = data.get('shippingAddress')
    
    if not items or not shipping:
        return jsonify({"error": "Missing order details"}), 400

    from bson.objectid import ObjectId
    order_id = str(uuid.uuid4())
    
    total = sum(item['finalPrice'] * item['quantity'] for item in items)
    
    order_doc = {
        "id": order_id,
        "userId": user_id,
        "items": items,
        "total": total,
        "shippingAddress": shipping,
        "paymentMethod": data.get("paymentMethod", "Credit Card (Simulated)"),
        "status": "processing",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    
    db.orders.insert_one(order_doc)
    
    return jsonify({"orderId": order_id}), 201

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    from app import db
    user_id = get_jwt_identity()
    user = db.users.find_one({"id": user_id})
    
    if user and user.get("role") == "admin":
        orders = list(db.orders.find())
    else:
        orders = list(db.orders.find({"userId": user_id}))
        
    for o in orders:
        o['_id'] = str(o['_id'])
        
    return jsonify({"orders": orders}), 200
