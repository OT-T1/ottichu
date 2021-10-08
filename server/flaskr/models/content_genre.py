from db_connect import db


class content_genre(db.Model):
    __tablename__ = "content_genre"
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

    genre = db.Column(
        db.String(255),
        db.ForeignKey("genres.genre", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
