from db_connect import db


class user_contents(db.Model):
    __tablename__ = "user_contents"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)

    content_code = db.Column(
        db.Integer,
        db.ForeignKey(
            "contents.content_code", ondelete="CASCADE", onupdate="CASCADE"
        ),
        nullable=False,
    )

    user_code = db.Column(
        db.Integer,
        db.ForeignKey("users.user_code", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
