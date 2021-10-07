from db_connect import db


class user_actors(db.Model):
    __tablename__ = "user_actors"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)

    actor_code = db.Column(
        db.Integer,
        db.ForeignKey("actors.actor_code", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    user_code = db.Column(
        db.Integer,
        db.ForeignKey("users.user_code", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
