from db_connect import db


class actors(db.Model):
    __tablename__ = "actors"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    actor = db.Column(db.String(50), primary_key=True, nullable=False)

    def __init__(self, actor):
        self.actor = actors
