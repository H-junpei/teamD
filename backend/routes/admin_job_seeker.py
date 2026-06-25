from flask import Blueprint, jsonify, request
from extensions import db
from models import Admin, JobSeeker, AdminJobSeeker


admin_job_seeker_bp = Blueprint ("admin_job_seeker", __name__)


# 管理者と求職者の紐づけ登録
# 管理者と求職者の紐づけ登録
@admin_job_seeker_bp.route("/api/admin/job-seekers/link", methods=["POST"])
def link_admin_job_seeker():
    data = request.get_json()

    admin_id = data.get("admin_id")
    job_seeker_ids = data.get("job_seeker_ids", [])

    if not admin_id or len(job_seeker_ids) == 0:
        return jsonify({
            "error": "admin_id と job_seeker_ids は必須です"
        }), 400

    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({
            "error": "指定された管理者が存在しません"
        }), 404

    created_count = 0

    for job_seeker_id in job_seeker_ids:

        job_seeker = JobSeeker.query.get(job_seeker_id)

        if not job_seeker:
            continue

        existing_link = AdminJobSeeker.query.filter_by(
            admin_id=admin_id,
            job_seeker_id=job_seeker_id,
            status="active"
        ).first()

        if existing_link:
            continue

        new_link = AdminJobSeeker(
            admin_id=admin_id,
            job_seeker_id=job_seeker_id,
            status="active"
        )

        db.session.add(new_link)
        created_count += 1

    db.session.commit()

    return jsonify({
        "message": f"{created_count}件の紐づけを登録しました"
    }), 201

# 紐づけ解除
@admin_job_seeker_bp.route(
    "/api/admin/job-seekers/links/<int:admin_job_seeker_id>/inactive",
    methods=["PATCH"]
)
def inactive_admin_job_seeker_link(admin_job_seeker_id):
    link = AdminJobSeeker.query.get(admin_job_seeker_id)

    if not link:
        return jsonify({
            "error": "指定された紐づけが存在しません"
        }), 404

    link.status = "inactive"
    db.session.commit()

    return jsonify({
        "message": "紐づけを解除しました"
    }), 200


# 管理者一覧取得
@admin_job_seeker_bp.route("/api/admin/admins", methods=["GET"])
def get_admins():
    admins = Admin.query.all()

    return jsonify({
        "admins": [
            {
                "admin_id": admin.admin_id,
                "name": admin.name,
                "email": admin.email
            }
            for admin in admins
        ]
    }), 200


# 求職者一覧取得
@admin_job_seeker_bp.route("/api/admin/job-seekers", methods=["GET"])
def get_job_seekers():
    job_seekers = JobSeeker.query.all()

    return jsonify({
        "job_seekers": [
            {
                "job_seeker_id": job_seeker.job_seeker_id,
                "name": job_seeker.name,
                "email": job_seeker.email
            }
            for job_seeker in job_seekers
        ]
    }), 200


# 管理者と求職者の紐づけ一覧取得
@admin_job_seeker_bp.route("/api/admin/job-seekers/links", methods=["GET"])
def get_admin_job_seeker_links():
    links = AdminJobSeeker.query.all()

    return jsonify({
        "links": [
            {
                "admin_job_seeker_id": link.admin_job_seeker_id,
                "admin_id": link.admin_id,
                "job_seeker_id": link.job_seeker_id,
                "admin_name": link.admin.name if link.admin else "",
                "job_seeker_name": link.job_seeker.name if link.job_seeker else "",
                "job_seeker_email": link.job_seeker.email if link.job_seeker else "",
                "status": link.status,
                "admin_email": link.admin.email if link.admin else "",
            }
            for link in links
        ]
    }), 200
