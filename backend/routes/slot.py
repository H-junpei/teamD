from flask import Blueprint, jsonify, request
from models import TimeSlot, AdminJobSeeker, Reservation

slot_bp = Blueprint("slot", __name__)

@slot_bp.route("/api/slots", methods=["GET"])
def get_slots():


        job_seeker_id = request.args.get("job_seeker_id", type=int)

        if not job_seeker_id:
            return jsonify([]), 200

        links = AdminJobSeeker.query.filter_by(
            job_seeker_id=job_seeker_id,
            status="active"
        ).all()
        admin_ids = [link.admin_id for link in links]

        if not admin_ids:
            return jsonify([]), 200

        slots = TimeSlot.query.filter(
            TimeSlot.admin_id.in_(admin_ids)
        ).all()

        result = []

        for slot in slots:
            reservation = Reservation.query.filter_by(
                time_slot_id=slot.time_slot_id
            ).first()

            # 空き枠は表示
            if slot.status == "available":
                result.append({
                    "id": slot.time_slot_id,
                    "admin_id": slot.admin_id,
                    "day": slot.start_datetime.strftime("%Y-%m-%d"),
                    "time": slot.start_datetime.strftime("%H:%M"),
                    "status": slot.status,
                    "job_seeker_id": None
                })
                continue

            # 自分の pending / reserved だけ表示
            if reservation and reservation.job_seeker_id == job_seeker_id:
                result.append({
                    "id": slot.time_slot_id,
                    "admin_id": slot.admin_id,
                    "day": slot.start_datetime.strftime("%Y-%m-%d"),
                    "time": slot.start_datetime.strftime("%H:%M"),
                    "status": slot.status,
                    "job_seeker_id": reservation.job_seeker_id
                })
        return jsonify(result), 200
