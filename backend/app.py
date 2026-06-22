from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from routes.admin_routes import admin_bp

# DB
from extensions import db
from models import TimeSlot, Admin

# CORS
from flask_cors import CORS
from routes.auth import auth_bp

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    # ✅ 絶対パス（DB迷子防止）
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, "instance", "test.db")

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


    db.init_app(app)
    app.register_blueprint(admin_bp)

    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    # =========================
    # 確認
    # =========================
    @app.route("/")
    def index():
        return "Flask backend is running!"

    # =========================
    # スロット取得
    # =========================
    @app.route("/api/slots", methods=["GET"])
    def get_slots():
        slots = TimeSlot.query.all()

        result = []
        for s in slots:
            result.append({
                "id": s.time_slot_id,
                "day": s.start_datetime.strftime("%Y-%m-%d"),
                "time": s.start_datetime.strftime("%H:%M"),  # ✅ 08:00形式
                "status": s.status
            })

        return jsonify(result)

    # =========================
    # スロット追加（クリック）
    # =========================
    # =========================
    # スロット追加（クリック）
    # =========================
    @app.route("/api/admin/slots", methods=["POST"])
    def add_slot():
        data = request.json

        dt = datetime.strptime(
            f"{data['day']} {data['time']}",
            "%Y-%m-%d %H:%M"
        )

        # 重複防止
        exists = TimeSlot.query.filter_by(start_datetime=dt).first()
        if exists:
            return jsonify({"message": "既に存在"}), 400

        end_dt = dt + timedelta(minutes=30)

        new_slot = TimeSlot(
            admin_id=1,
            start_datetime=dt,
            end_datetime=end_dt,
            status="available"
        )

        db.session.add(new_slot)
        db.session.commit()

        print("開始:", dt)
        print("終了:", end_dt)

        return jsonify({"message": "追加完了"})
    # =========================
    # スロット削除（トグル）
    # =========================
    @app.route("/api/admin/slots", methods=["DELETE"])
    def delete_slot():
        data = request.json

        dt = datetime.strptime(
            f"{data['day']} {data['time']}",
            "%Y-%m-%d %H:%M"
        )

        slot = TimeSlot.query.filter_by(start_datetime=dt).first()

        if slot:
            db.session.delete(slot)
            db.session.commit()

            print("🗑️ 削除:", data)

            return jsonify({"message": "削除完了"})

        return jsonify({"message": "対象なし"}), 404

    # =========================
    # 予約処理
    # =========================
    @app.route("/api/reserve", methods=["POST"])
    def reserve():
        data = request.json

        dt = datetime.strptime(
            f"{data['day']} {data['time']}",
            "%Y-%m-%d %H:%M"
        )

        slot = TimeSlot.query.filter_by(start_datetime=dt).first()

        if not slot:
            return jsonify({"message": "スロットなし"}), 404

        if slot.status == "reserved":
            return jsonify({"message": "既に予約済み"}), 400

        slot.status = "reserved"
        db.session.commit()

        print("✅ 予約:", data)

        return jsonify({"message": "予約完了"})

    return app


# =========================
# 起動
# =========================
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
