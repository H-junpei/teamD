from flask import Blueprint, jsonify, request
from models import TimeSlot, AdminJobSeeker

slot_bp = Blueprint("slot", __name__)


@slot_bp.route("/api/slots", methods=["GET"])
def get_slots():

    job_seeker_id = request.args.get("job_seeker_id")
    if not job_seeker_id:
        slots = TimeSlot.query.all()
    else:
        job_seeker_id = int(job_seeker_id)
        # 紐づいている管理者を取得
        links = AdminJobSeeker.query.filter_by(job_seeker_id=job_seeker_id, status="active").all()
        admin_ids = [link.admin_id for link in links]
        
        # その管理者のtime_slotsだけを取得
        slots = TimeSlot.query.filter(TimeSlot.admin_id.in_(admin_ids)).all()
        result = []

        for slot in slots:
            result.append({
                "id": slot.time_slot_id,
                "day": slot.start_datetime.strftime("%Y-%m-%d"),
                "time": slot.start_datetime.strftime("%H:%M"),
                "status": slot.status
            })

        return jsonify(result)
