from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta

from extensions import db
from models import (
    TimeSlot,
    Reservation,
    JobSeeker,
    AdminJobSeeker
)

admin_slots_bp = Blueprint("admin_slots", __name__)


# ==================================
# 管理者カレンダー表示用
# ==================================
@admin_slots_bp.route("/api/admin/events", methods=["GET"])
def get_admin_events():
    admin_id = request.args.get("admin_id", type=int)

    if not admin_id:
        return jsonify({
            "message": "admin_id が必要です"
        }), 400

    events = []

    # ログイン管理者に紐づいている求職者IDを取得
    linked_job_seeker_ids = [
        link.job_seeker_id
        for link in AdminJobSeeker.query.filter_by(
            admin_id=admin_id,
            status="active"
        ).all()
    ]

    # ログイン管理者の空き枠だけ取得
    slots = TimeSlot.query.filter_by(
        admin_id=admin_id
    ).order_by(TimeSlot.start_datetime.asc()).all()

    for slot in slots:
        reservation = Reservation.query.filter_by(
            time_slot_id=slot.time_slot_id
        ).first()

        job_seeker_name = None
        email = None
        reservation_id = None
        job_seeker_id = None

        # 予約がある場合
        if reservation:
            # 予約している求職者が、この管理者の担当外なら表示しない
            if reservation.job_seeker_id not in linked_job_seeker_ids:
                continue

            seeker = JobSeeker.query.get(
                reservation.job_seeker_id
            )

            if seeker:
                job_seeker_name = seeker.name
                email = seeker.email
                job_seeker_id = seeker.job_seeker_id

            reservation_id = reservation.reservation_id

        title = "空き枠"

        if slot.status == "pending":
            title = "予約申請"

        elif slot.status == "reserved":
            title = "面接確定"

        elif slot.status == "booked":
            title = "予約済み"

        elif slot.status == "available":
            title = "空き枠"

        events.append({
            "id": slot.time_slot_id,
            "timeSlotId": slot.time_slot_id,
            "reservationId": reservation_id,
            "title": title,
            "status": slot.status,
            "jobSeekerId": job_seeker_id,
            "jobSeeker": job_seeker_name,
            "email": email,
            "start": slot.start_datetime.isoformat(),
            "end": slot.end_datetime.isoformat(),
        })

    return jsonify(events), 200


# ==================================
# 空き枠追加（30分固定）
# ==================================
@admin_slots_bp.route("/api/admin/slots", methods=["POST"])
def add_slot():
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "データが送られていません"
        }), 400

    admin_id = data.get("admin_id")
    day = data.get("day")
    time = data.get("time")

    if not admin_id or not day or not time:
        return jsonify({
            "message": "admin_id, day, time が必要です"
        }), 400

    try:
        admin_id = int(admin_id)

        start_dt = datetime.strptime(
            f"{day} {time}",
            "%Y-%m-%d %H:%M"
        )

    except ValueError:
        return jsonify({
            "message": "日付または時刻の形式が不正です"
        }), 400

    end_dt = start_dt + timedelta(minutes=30)

    # 同じ管理者の同じ時間帯だけ重複禁止
    exists = TimeSlot.query.filter_by(
        admin_id=admin_id,
        start_datetime=start_dt
    ).first()

    if exists:
        return jsonify({
            "message": "既に存在します"
        }), 400

    new_slot = TimeSlot(
        admin_id=admin_id,
        start_datetime=start_dt,
        end_datetime=end_dt,
        status="available"
    )

    db.session.add(new_slot)
    db.session.commit()

    return jsonify({
        "message": "追加完了",
        "slot": {
            "time_slot_id": new_slot.time_slot_id,
            "admin_id": new_slot.admin_id,
            "start": new_slot.start_datetime.isoformat(),
            "end": new_slot.end_datetime.isoformat(),
            "status": new_slot.status
        }
    }), 201


# ==================================
# 空き枠削除
# ==================================
@admin_slots_bp.route(
    "/api/admin/slots/<int:slot_id>",
    methods=["DELETE"]
)
def delete_slot(slot_id):
    admin_id = request.args.get("admin_id", type=int)

    if not admin_id:
        return jsonify({
            "message": "admin_id が必要です"
        }), 400

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "対象なし"
        }), 404

    # 自分の空き枠以外は削除できない
    if slot.admin_id != admin_id:
        return jsonify({
            "message": "この空き枠を削除する権限がありません"
        }), 403

    reservation = Reservation.query.filter_by(
        time_slot_id=slot.time_slot_id
    ).first()

    if reservation:
        return jsonify({
            "message": "予約が存在するため削除できません"
        }), 400

    db.session.delete(slot)
    db.session.commit()

    return jsonify({
        "message": "削除完了"
    }), 200


# ==================================
# 予約承認
# ==================================
@admin_slots_bp.route(
    "/api/admin/approve/<int:slot_id>",
    methods=["POST"]
)
def approve_reservation(slot_id):
    admin_id = request.args.get("admin_id", type=int)

    if not admin_id:
        return jsonify({
            "message": "admin_id が必要です"
        }), 400

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "対象なし"
        }), 404

    # 自分の空き枠以外は承認できない
    if slot.admin_id != admin_id:
        return jsonify({
            "message": "この予約を承認する権限がありません"
        }), 403

    reservation = Reservation.query.filter_by(
        time_slot_id=slot_id
    ).first()

    if not reservation:
        return jsonify({
            "message": "予約申請なし"
        }), 404

    # 予約者がこの管理者の担当求職者か確認
    link = AdminJobSeeker.query.filter_by(
        admin_id=admin_id,
        job_seeker_id=reservation.job_seeker_id,
        status="active"
    ).first()

    if not link:
        return jsonify({
            "message": "担当外の求職者のため承認できません"
        }), 403

    reservation.status = "approved"
    slot.status = "reserved"

    db.session.commit()

    return jsonify({
        "message": "承認完了"
    }), 200


# ==================================
# 予約却下
# ==================================
@admin_slots_bp.route(
    "/api/admin/reject/<int:slot_id>",
    methods=["POST"]
)
def reject_reservation(slot_id):
    admin_id = request.args.get("admin_id", type=int)

    if not admin_id:
        return jsonify({
            "message": "admin_id が必要です"
        }), 400

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "対象なし"
        }), 404

    # 自分の空き枠以外は却下できない
    if slot.admin_id != admin_id:
        return jsonify({
            "message": "この予約を却下する権限がありません"
        }), 403

    reservation = Reservation.query.filter_by(
        time_slot_id=slot_id
    ).first()

    if not reservation:
        return jsonify({
            "message": "予約申請なし"
        }), 404

    # 予約者がこの管理者の担当求職者か確認
    link = AdminJobSeeker.query.filter_by(
        admin_id=admin_id,
        job_seeker_id=reservation.job_seeker_id,
        status="active"
    ).first()

    if not link:
        return jsonify({
            "message": "担当外の求職者のため却下できません"
        }), 403

    db.session.delete(reservation)

    slot.status = "available"

    db.session.commit()

    return jsonify({
        "message": "却下完了"
    }), 200

@admin_slots_bp.route(
    "/api/admin/cancel/<int:slot_id>",
    methods=["POST"]
)
def cancel_reservation(slot_id):
    admin_id = request.args.get("admin_id", type=int)

    slot = TimeSlot.query.get(slot_id)

    if not slot:
        return jsonify({
            "message": "スロットが存在しません"
        }), 404

    if slot.admin_id != admin_id:
        return jsonify({
            "message": "権限がありません"
        }), 403

    reservation = Reservation.query.filter_by(
        time_slot_id=slot_id
    ).first()

    if reservation:
        db.session.delete(reservation)

    slot.status = "available"

    db.session.commit()

    return jsonify({
        "message": "面談予定を削除しました"
    })
