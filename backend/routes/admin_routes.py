from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash

from extensions import db
from models import Admin, JobSeeker, AdminJobSeeker

# Blueprintを作る
admin_bp = Blueprint("admin", __name__)

# =========================
# 管理者登録
# =========================
@admin_bp.route("/api/admin/register", methods=["POST"])
def register_admin():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # 入力チェック
    if not name or not email or not password:
        return jsonify({
            "message": "名前、メールアドレス、パスワードは必須です"
        }), 400

    # 重複チェック
    existing_admin = Admin.query.filter_by(email=email).first()
    if existing_admin:
        return jsonify({
            "message": "このメールアドレスは既に登録されています"
        }), 409

    # パスワードをハッシュ化
    password_hash = generate_password_hash(password)

    # DB登録
    new_admin = Admin(
        name=name,
        email=email,
        password_hash=password_hash
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "管理者登録が完了しました",
        "admin": {
            "admin_id": new_admin.admin_id,
            "name": new_admin.name,
            "email": new_admin.email
        }
    }), 201

# =========================
# 管理者が求職者を削除
# =========================
@admin_bp.route("/api/admin/job-seekers/<int:id>", methods=["DELETE"])
def delete_job_seeker(id):
    job_seeker = JobSeeker.query.get(id)

    if not job_seeker:
        return jsonify({"error": "Not found"}), 404

    AdminJobSeeker.query.filter_by(job_seeker_id=id).delete()
    
    db.session.delete(job_seeker)
    db.session.commit()

    return jsonify({"message": "deleted"})
