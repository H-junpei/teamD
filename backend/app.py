from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

import os
from datetime import datetime, timedelta
from routes.admin_routes import admin_bp
from routes.reserve_routes import reserve_bp
from routes.job_seeker_routes import jobseeker_bp

from extensions import db

from models import TimeSlot, Admin, Reservation, JobSeeker, AdminJobSeeker


from routes.slot import slot_bp
from routes.admin import admin_slots_bp
from routes.auth import auth_bp
from routes.admin_routes import admin_bp
from routes.admin_job_seeker import admin_job_seeker_bp
from routes.job_seeker_status import job_seeker_status_bp

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


    app.register_blueprint(reserve_bp)

    db.init_app(app)
    app.register_blueprint(jobseeker_bp)

    # Blueprint登録
    app.register_blueprint(slot_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(admin_slots_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_job_seeker_bp)
    app.register_blueprint(job_seeker_status_bp)


    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return "Flask backend is running!"


    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
