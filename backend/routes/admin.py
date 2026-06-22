from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta

from extensions import db
from models import (
    TimeSlot,
    Reservation,
    JobSeeker
)

admin_bp = Blueprint("admin", __name__)


# ==================================
# 管理者カレンダー表示用
# ==================================
@admin_bp.route("/api/admin/events", methods=["GET"])
def get_admin_events():

    events = []

    slots = TimeSlot.query.all()

    for slot in slots:

        reservation = Reservation.query.filter_by(
            time_slot_id=slot.time_slot_id
        ).first()

        job_seeker_name = None
        email = None

        if reservation:
            seeker = JobSeeker.query.get(
                reservation.job_seeker_id
            )

            if seeker:
                job_seeker_name = seeker.name
                email = seeker.email

        title = "空き枠"

        if slot.status == "pending":
            title = "予約申請"

        elif slot.status == "reserved":
            title = "面接確定"

        events.append({
            "id": slot.time_slot_id,
            "title": title,
            "status": slot.status,
            "jobSeeker": job_seeker_name,
            "email": email,
            "start": slot.start_datetime.isoformat(),
            "end": slot.end_datetime.isoformat(),
        })

    return jsonify(events)


# ==================================
# 空き枠追加（30分固定）
# ==================================
@admin_bp.route("/api/admin/slots", methods=["POST"])
def add_slot():

    data = request.json

    start_dt = datetime.strptime(
        f"{data['day']} {data['time']}",
        "%Y-%m-%d %H:%M"
    )

    exists = TimeSlot.query.filter_by(
        start_datetime=start_dt
    ).first()

    if exists:
        return jsonify({
            "message": "既に存在します"
        }), 400

    end_dt = start_dt + timedelta(minutes=30)

    new_slot = TimeSlot(
        admin_id=1,
        start_datetime=start_dt,
        end_datetime=end_dt,
        status="available"
    )

    db.session.add(new_slot)
    db.session.commit()

    return jsonify({
        "message": "追加完了"
    })


# ==================================
# 空き枠削除
# ==================================
@admin_bp.route(
    "/api/admin/slots/<int:slot_id>",
    methods=["DELETE"]
)
def delete_slot(slot_id):

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "対象なし"
        }), 404

    db.session.delete(slot)
    db.session.commit()

    return jsonify({
        "message": "削除完了"
    })


# ==================================
# 予約承認
# ==================================
@admin_bp.route(
    "/api/admin/approve/<int:slot_id>",
    methods=["POST"]
)
def approve_reservation(slot_id):

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "対象なし"
        }), 404

    reservation = Reservation.query.filter_by(
        time_slot_id=slot_id
    ).first()

    if not reservation:
        return jsonify({
            "message": "予約申請なし"
        }), 404

    reservation.status = "approved"
    slot.status = "reserved"

    db.session.commit()

    return jsonify({
        "message": "承認完了"
    })


# ==================================
# 予約却下
# ==================================
@admin_bp.route(
    "/api/admin/reject/<int:slot_id>",
    methods=["POST"]
)
def reject_reservation(slot_id):

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "対象なし"
        }), 404

    reservation = Reservation.query.filter_by(
        time_slot_id=slot_id
    ).first()

    if not reservation:
        return jsonify({
            "message": "予約申請なし"
        }), 404

    db.session.delete(reservation)

    slot.status = "available"

    db.session.commit()

    return jsonify({
        "message": "却下完了"
    })
