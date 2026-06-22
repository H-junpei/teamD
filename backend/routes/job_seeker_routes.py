from flask import Blueprint, request, jsonify

from extensions import db
from models import JobSeeker

# Blueprintを作る
jobseeker_bp = Blueprint("jobseeker", __name__)

# =========================
# 求職者登録
# =========================
@jobseeker_bp.route("/api/jobseeker/register", methods=["POST"])
def register_jobseeker():
    data = request.json

    name = data.get("name")
    email = data.get("email")

    # 入力チェック
    if not name or not email:
        return jsonify({
            "message": "名前、メールアドレスは必須です"
        }), 400

    # 重複チェック
    existing_admin = JobSeeker.query.filter_by(email=email).first()
    if existing_admin:
        return jsonify({
            "message": "このメールアドレスは既に登録されています"
        }), 409

    # DB登録
    new_jobseeker = JobSeeker(
        name=name,
        email=email
    )

    db.session.add(new_jobseeker)
    db.session.commit()

    return jsonify({
        "message": "管理者登録が完了しました",
        "jobseeker": {
            "jobseeker_id": new_jobseeker.job_seeker_id,
            "name": new_jobseeker.name,
            "email": new_jobseeker.email
        }
    }), 201
