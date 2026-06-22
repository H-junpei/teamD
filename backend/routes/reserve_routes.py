from flask import Blueprint, jsonify, request
from datetime import datetime

from extensions import db
from models import TimeSlot

reserve_bp = Blueprint("reserve_bp", __name__)

@reserve_bp.route("/api/reserve", methods=["POST"])
def reserve():
    data = request.json

    day = data.get("day")
    time = data.get("time")
    name = data.get("name")

    if not day or not time:
        return jsonify({"message": "day と time は必須です"}), 400

    try:
        dt = datetime.strptime(f"{day} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({"message": "日付形式が不正です"}), 400

    slot = TimeSlot.query.filter_by(start_datetime=dt).first()

    if not slot:
        return jsonify({"message": "スロットなし"}), 404

    if slot.status != "available":
        return jsonify({"message": "既に予約済み"}), 400

    slot.status = "reserved"
    db.session.commit()

    print("✅ 予約:", {
        "day": day,
        "time": time,
        "name": name
    })

    return jsonify({"message": "予約完了"})
