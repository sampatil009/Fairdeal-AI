import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    MONGO_DB = os.getenv("MONGO_DB", "fairdeal")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fairdeal-ai-super-secret-key-2024-do-not-share")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:5001")
