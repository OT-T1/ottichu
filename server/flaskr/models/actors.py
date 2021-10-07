from db_connect import db


class actors(db.Model):
    __tablename__ = "actors"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    actor_code = db.Column(
        db.Integer, primary_key=True, nullable=False, autoincrement=True
    )

    actor = db.Column(db.String(255), nullable=False)
