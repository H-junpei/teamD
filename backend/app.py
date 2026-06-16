from flask import Flask, jsonify
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")


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
