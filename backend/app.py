from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

import os
from datetime import datetime, timedelta
from routes.admin_routes import admin_bp
from routes.job_seeker_routes import jobseeker_bp

from extensions import db
from models import TimeSlot

from routes.slot import slot_bp
from routes.admin import admin_slots_bp
from routes.auth import auth_bp
from routes.admin_routes import admin_bp

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, "instance", "test.db")

    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY",
        "dev-secret-key"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///" + db_path
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(jobseeker_bp)

    # Blueprint登録
    app.register_blueprint(slot_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(admin_slots_bp)
    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return "Flask backend is running!"

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
