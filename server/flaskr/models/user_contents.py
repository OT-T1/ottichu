from db_connect import db


class user_contents(db.Model):
    __tablename__ = "user_contents"
    __table_args__ = {
        "mysql_default_charset": "utf8mb4",
        "mysql_collate": "utf8mb4_general_ci",
    }

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)

    content_code = db.Column(
        db.Integer,
        db.ForeignKey("contents.content_code", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    user_code = db.Column(
        db.Integer,
        db.ForeignKey("users.user_code", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    def __init__(self, content_code, user_code):
        self.content_code = content_code
        self.user_code = user_code
