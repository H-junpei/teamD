from flask import Blueprint, jsonify

from models import TimeSlot

slot_bp = Blueprint("slot", __name__)


@slot_bp.route("/api/slots", methods=["GET"])
def get_slots():

    slots = TimeSlot.query.all()

    result = []

    for slot in slots:
        result.append({
            "id": slot.time_slot_id,
            "day": slot.start_datetime.strftime("%Y-%m-%d"),
            "time": slot.start_datetime.strftime("%H:%M"),
            "status": slot.status
        })

    return jsonify(result)
