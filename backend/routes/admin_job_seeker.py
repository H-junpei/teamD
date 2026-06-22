from flask import Blueprint, jsonify, request
from extensions import db
from models import Admin, JobSeeker, AdminJobSeeker


admin_job_seeker_bp = Blueprit ("admin_job_seeker", __name__)


# 管理者と求職者の紐づけ登録
@admin_job_seeker_bp.route("/api/admin/job-seekers/link", methods=["POST"])
def link_admin_job_seeker():
    data = request.get_json()

    admin_id = data.get("admin_id")
    job_seeker_id = data.get("job_seeker_id")

    if not admin_id or not job_seeker_id:
        return jsonify({
            "error": "admin_id と job_seeker_id は必須です"
        }), 400

    admin = Admin.query.get(admin_id)
    job_seeker = JobSeeker.query.get(job_seeker_id)

    if not admin:
        return jsonify({
            "error": "指定された管理者が存在しません"
        }), 404

    if not job_seeker:
        return jsonify({
            "error": "指定された求職者が存在しません"
        }), 404

    existing_link = AdminJobSeeker.query.filter_by(
        admin_id=admin_id,
        job_seeker_id=job_seeker_id,
        status="active"
    ).first()

    if existing_link:
        return jsonify({
            "error": "この管理者と求職者はすでに紐づけされています"
        }), 409

    new_link = AdminJobSeeker(
        admin_id=admin_id,
        job_seeker_id=job_seeker_id,
        status="active"
    )

    db.session.add(new_link)
    db.session.commit()

    return jsonify({
        "message": "管理者と求職者を紐づけました",
        "admin_job_seeker_id": new_link.admin_job_seeker_id
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
                "status": link.status
            }
            for link in links
        ]
    }), 200
