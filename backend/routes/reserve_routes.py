from flask import Blueprint, jsonify, request

from extensions import db
from models import TimeSlot, Reservation, JobSeeker
reserve_bp = Blueprint("reserve_bp", __name__)

@reserve_bp.route("/api/reserve", methods=["POST"])
def reserve():
    data = request.json

    day = data.get("day")
    time = data.get("time")
    name = data.get("name")
    time_slot_id = data.get("time_slot_id")

    if not day or not time:
        return jsonify({"message": "day と time は必須です"}), 400

    if not time_slot_id:
        return jsonify({"message": "time_slot_id は必須です"}), 400

    try:
        time_slot_id = int(time_slot_id)
    except (TypeError, ValueError):
        return jsonify({"message": "time_slot_id の形式が不正です"}), 400

    if not name:
        return jsonify({"message": "name は必須です"}), 400

    job_seeker = JobSeeker.query.filter_by(name=name).first()

    if not job_seeker:
        return jsonify({"message": "求職者が見つかりません"}), 404

    existing_reservation = Reservation.query.filter_by(
        job_seeker_id=job_seeker.job_seeker_id,
        status="active"
    ).first()

    if existing_reservation:
        return jsonify({
            "message": "すでに別の枠を予約済みです。1人1件までです"
        }), 400

    slot = TimeSlot.query.get(time_slot_id)

    if not slot:
        return jsonify({"message": "スロットなし"}), 404

    if slot.status != "available":
        return jsonify({"message": "既に予約済み"}), 400

    new_reservation = Reservation(
        time_slot_id=slot.time_slot_id,
        job_seeker_id=job_seeker.job_seeker_id,
        status="active"
    )
    db.session.add(new_reservation)
    slot.status = "pending"
    db.session.commit()

    print("✅ 予約:", {
        "day": day,
        "time": time,
        "name": name,
        "time_slot_id": time_slot_id
    })

    return jsonify({"message": "予約完了"})
