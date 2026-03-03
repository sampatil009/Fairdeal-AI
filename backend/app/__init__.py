from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from pymongo import MongoClient
import redis
from .config import Config

# Extensions
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")

# DB Globals (Will be initialized in create_app)
mongo_client = None
db = None
redis_client = None

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    app.config.from_object(Config)

    # Initialize Extensions
    jwt.init_app(app)
    socketio.init_app(app)

    # Initialize Databases
    global mongo_client, db, redis_client
    try:
        mongo_client = MongoClient(app.config["MONGO_URI"])
        db = mongo_client[app.config["MONGO_DB"]]
        redis_client = redis.from_url(app.config["REDIS_URL"], decode_responses=True)
        # Test connection
        mongo_client.server_info()
        redis_client.ping()
        print("[SUCCESS] Databases connected successfully")
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")

    # Register Blueprints
    from .routes.auth_routes import auth_bp
    from .routes.product_routes import product_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')

    # Import sockets to register events
    from .sockets import negotiation_sockets

    return app, socketio
