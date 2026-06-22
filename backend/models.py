from extensions import db

# テーブル定義を書く場所

# 管理者テーブル
class Admin (db.Model):
  # SQLAlchemyに「テーブル名はこれ」と伝えるための特別な設定名
  __tablename__ = "admins"
  
  admin_id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(20), nullable=False) # not NULL
  email = db.Column(db.String(50), unique=True, nullable=False) # 一意に制限
  password_hash = db.Column(db.String(255), nullable=False)
  
  time_slots = db.relationship("TimeSlot", backref="admin")

  job_seeker_links = db.relationship(
    "AdminJobSeeker",
    backref="admin",
    cascade="all, delete-orphan"
  )
    
# 空き時間テーブル
class TimeSlot(db.Model):
  __tablename__ = "time_slots"
  
  time_slot_id = db.Column(db.Integer, primary_key=True)
  admin_id = db.Column(db.Integer, db.ForeignKey("admins.admin_id"), nullable=False)
  start_datetime = db.Column(db.DateTime, nullable=False)
  end_datetime = db.Column(db.DateTime, nullable=False)
  
  # available = 予約可能, booked = 予約済み, cancelled = 無効
  status = db.Column(db.String(20), default="available", nullable=False)

  reservation = db.relationship("Reservation", backref="time_slot", uselist=False)
    
# 予約テーブル
class Reservation(db.Model):
  __tablename__ = "reservations"
  
  reservation_id = db.Column(db.Integer, primary_key=True)
  
  # 1つの空き枠に1件の予約だけを許可するため unique=True
  time_slot_id = db.Column(
    db.Integer, 
    db.ForeignKey("time_slots.time_slot_id"),
    unique=True,
    nullable=False
  )
  job_seeker_id = db.Column(
    db.Integer,
    db.ForeignKey("job_seekers.job_seeker_id"),
    nullable=False
  )
  
  # active = 有効な予約, cancelled = キャンセル済み
  status = db.Column(db.String(20), default="active", nullable=False)

    
# 求職者テーブル
class JobSeeker(db.Model):
  __tablename__ = "job_seekers"
  
  job_seeker_id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(20), nullable=False)
  email = db.Column(db.String(50), nullable=False)
  
  reservations = db.relationship("Reservation", backref="job_seeker")

  admin_links = db.relationship(
    "AdminJobSeeker",
    backref="job_seeker",
    cascade="all, delete-orphan"
  )


# 管理者と求職者の紐づけテーブル
class AdminJobSeeker(db.Model):
  __tablename__ = "admin_job_seekers"

  admin_job_seeker_id = db.Column(db.Integer, primary_key=True)

  admin_id = db.Column(
    db.Integer,
    db.ForeignKey("admins.admin_id"),
    nullable=False
  )

  job_seeker_id = db.Column(
    db.Integer,
    db.ForeignKey("job_seekers.job_seeker_id"),
    nullable=False
  )

  # active = 担当中, inactive = 担当解除済み
  status = db.Column(db.String(20), default="active", nullable=False)

  # 同じ管理者と求職者の組み合わせを重複登録させない
  __table_args__ = (
    db.UniqueConstraint(
      "admin_id",
      "job_seeker_id",
      name="uq_admin_job_seeker"
    ),
  )
