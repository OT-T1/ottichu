from db_connect import db


class content_actor(db.Model):
    __tablename__ = "content_actor"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    title = db.Column(
        db.String(255),
        db.ForeignKey("contents.title", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    director = db.Column(
        db.String(255),
        db.ForeignKey("contents.director", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    actor = db.Column(
        db.String(50),
        db.ForeignKey("actors.actor", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
