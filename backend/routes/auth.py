from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models import Admin, JobSeeker

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    print("受け取ったログイン情報:", data)

    if not data:
        return jsonify({
            "success": False,
            "message": "データが送られていません"
        }), 400

    role = data.get("role")

    # -------------------------
    # 管理者ログイン
    # -------------------------
    if role == "admin":
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "メールアドレスまたはパスワードが不足しています"
            }), 400

        admin = Admin.query.filter_by(email=email).first()

        if not admin:
            return jsonify({
                "success": False,
                "message": "管理者が見つかりません"
            }), 401

        if not check_password_hash(admin.password_hash, password):
            return jsonify({
                "success": False,
                "message": "パスワードが正しくありません"
            }), 401

        return jsonify({
            "success": True,
            "role": "admin",
            "message": "管理者ログイン成功"
        })

    # -------------------------
    # 求職者ログイン
    # -------------------------
    elif role == "user":
        name = data.get("name")
        email = data.get("email")

        if not name or not email:
            return jsonify({
                "success": False,
                "message": "名前またはメールアドレスが不足しています"
            }), 400

        user = JobSeeker.query.filter_by(name=name, email=email).first()

        if not user:
            return jsonify({
                "success": False,
                "message": "求職者が見つかりません"
            }), 401

        return jsonify({
            "success": True,
            "role": "user",
            "message": "求職者ログイン成功"
        })

    else:
        return jsonify({
            "success": False,
            "message": "role が不正です"
        }), 400
