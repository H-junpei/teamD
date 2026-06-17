from flask import Flask, jsonify, request, session, redirect, url_for, render_template
from dotenv import load_dotenv
import os
from extensions import db
from models import Admin, TimeSlot, Reservation, JobSeeker
from flask_sqlalchemy import SQLAlchemy


load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"

# Flaskアプリ(app)とDB(SQLAlchemy)を接続する
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return "Flask backend is running!"


@app.route("/api/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "message": "backend is alive"
        }
    )


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
