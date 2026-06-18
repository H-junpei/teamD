from app import app
from extensions import db
from models import Admin, JobSeeker
from werkzeug.security import generate_password_hash

with app.app_context():
    # 管理者の確認用データ
    admin = Admin.query.filter_by(email="admin@test.com").first()
    if not admin:
        admin = Admin(
            name="テスト管理者",
            email="admin@test.com",
            password_hash=generate_password_hash("1234")
        )
        db.session.add(admin)

    # 求職者の確認用データ
    user = JobSeeker.query.filter_by(email="user@test.com").first()
    if not user:
        user = JobSeeker(
            name="テスト求職者",
            email="user@test.com"
        )
        db.session.add(user)

    db.session.commit()
    print("seed投入完了")
