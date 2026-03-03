from flask import Flask
from app.routes import init_routes
import sys

def create_app():
    app = Flask(__name__)
    init_routes(app)
    return app

if __name__ == '__main__':
    app = create_app()
    # Runs on port 8000 internally
    app.run(host='0.0.0.0', port=8000, debug=True)
