from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    from app import db # Import here to avoid circular dependencies
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    tier = data.get('tier', 'Bronze')

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "name": name,
        "email": email,
        "password": hashed_pw.decode('utf-8'),
        "role": "user",
        "tier": tier
    }
    
    db.users.insert_one(user_doc)

    # Remove password from response
    user_response = {k: v for k, v in user_doc.items() if k != 'password'}
    user_response['_id'] = str(user_response['_id']) if '_id' in user_response else None

    token = create_access_token(identity=user_id)
    return jsonify({"user": user_response, "token": token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    from app import db
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = db.users.find_one({"email": email})
    
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"error": "Invalid email or password"}), 401

    user_response = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "tier": user.get("tier", "Bronze")
    }

    token = create_access_token(identity=user["id"])
    return jsonify({"user": user_response, "token": token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    from app import db
    user_id = get_jwt_identity()
    user = db.users.find_one({"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user_response = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "tier": user.get("tier", "Bronze")
    }
    return jsonify({"user": user_response}), 200
