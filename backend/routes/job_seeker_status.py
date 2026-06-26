from flask import Blueprint, jsonify, request
from extensions import db
from models import JobSeeker, AdminJobSeeker

job_seeker_status_bp = Blueprint(
    "job_seeker_status",
    __name__
)

@job_seeker_status_bp.route(
    "/api/job-seekers/status/<int:admin_id>",
    methods=["GET"]
)
def get_job_seeker_status_list(admin_id):

    links = AdminJobSeeker.query.filter_by(
        admin_id=admin_id,
        status="active"
    ).all()

    job_seekers = [
        link.job_seeker
        for link in links
        if link.job_seeker
    ]

    return jsonify({
    "job_seekers": [
        {
            "job_seeker_id": js.job_seeker_id,
            "name": js.name,
            "email": js.email,
            "memo": js.memo
        }
        for js in job_seekers
    ]
}), 200

# 求職者ステータス更新
@job_seeker_status_bp.route(
    "/api/job-seekers/<int:job_seeker_id>/status",
    methods=["PATCH"]
)
def update_job_seeker_status(job_seeker_id):

    job_seeker = JobSeeker.query.get(job_seeker_id)

    if not job_seeker:
        return jsonify({
            "error": "求職者が存在しません"
        }), 404

    data = request.get_json()

    status = data.get("status")

    if not status:
        return jsonify({
            "error": "statusは必須です"
        }), 400

    job_seeker.status = status

    db.session.commit()

    return jsonify({
        "message": "ステータスを更新しました",
        "job_seeker_id": job_seeker.job_seeker_id,
        "status": job_seeker.status
    }), 200

# 求職者メモ更新
@job_seeker_status_bp.route(
    "/api/job-seekers/<int:job_seeker_id>/memo",
    methods=["PATCH"]
)
def update_job_seeker_memo(job_seeker_id):

    job_seeker = JobSeeker.query.get(job_seeker_id)

    if not job_seeker:
        return jsonify({
            "error": "求職者が存在しません"
        }), 404

    data = request.get_json()

    memo = data.get("memo")

    job_seeker.memo = memo

    db.session.commit()

    return jsonify({
        "message": "メモを保存しました"
    }), 200
