from db_connect import db


class content_director(db.Model):
    __tablename__ = "content_director"
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

    director = db.Column(
        db.String(255),
        db.ForeignKey("directors.director", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
