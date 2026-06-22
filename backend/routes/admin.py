from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta

from extensions import db
from models import (
    TimeSlot,
    Reservation,
    JobSeeker
)

admin_bp = Blueprint("admin", __name__)


# ==========================================
# 管理者カレンダー表示用
# ==========================================
@admin_bp.route("/api/admin/events", methods=["GET"])
def get_admin_events():

    events = []

    slots = TimeSlot.query.all()

    for slot in slots:

        reservation = Reservation.query.filter_by(
            time_slot_id=slot.time_slot_id
        ).first()

        job_seeker = None

        if reservation:
            job_seeker = JobSeeker.query.get(
                reservation.job_seeker_id
            )

        title = "空き枠"

        if slot.status == "pending":
            title = "予約申請"

        elif slot.status == "reserved":
            title = "面接確定"

        events.append({
            "id": slot.time_slot_id,
            "title": title,
            "status": slot.status,
            "jobSeeker": (
                job_seeker.name
                if job_seeker
                else None
            ),
            "email": (
                job_seeker.email
                if job_seeker
                else None
            ),
            "start": slot.start_datetime.isoformat(),
            "end": slot.end_datetime.isoformat(),
        })

    return jsonify(events)


# ==========================================
# 空き枠作成
# AdminCalendarV2対応
# ==========================================
@admin_bp.route(
    "/api/admin/slots",
    methods=["POST"]
)
def add_slot():

    data = request.json

    start_dt = datetime.strptime(
        f"{data['start_day']} {data['start_time']}",
        "%Y-%m-%d %H:%M"
    )

    end_dt = datetime.strptime(
        f"{data['end_day']} {data['end_time']}",
        "%Y-%m-%d %H:%M"
    )

    # クリックのみの場合
    if start_dt == end_dt:
        end_dt = start_dt + timedelta(minutes=30)

    # ドラッグ方向補正
    if end_dt < start_dt:
        start_dt, end_dt = end_dt, start_dt

    exists = TimeSlot.query.filter(
        TimeSlot.start_datetime < end_dt,
        TimeSlot.end_datetime > start_dt
    ).first()

    if exists:
        return jsonify({
            "message": "時間帯が重複しています"
        }), 400

    slot = TimeSlot(
        admin_id=1,
        start_datetime=start_dt,
        end_datetime=end_dt,
        status="available"
    )

    db.session.add(slot)
    db.session.commit()

    return jsonify({
        "message": "登録完了"
    })


# ==========================================
# 空き枠削除
# ==========================================
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


# ==========================================
# 予約承認
# ==========================================
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


# ==========================================
# 予約却下
# ==========================================
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
