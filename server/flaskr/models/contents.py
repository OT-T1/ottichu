from db_connect import db


class contents(db.Model):
    __tablename__ = "contents"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    title = db.Column(db.String(255), primary_key=True, nullable=False)
    director = db.Column(db.String(255), primary_key=True, nullable=False)

    summary = db.Column(db.String(255))
    country = db.Column(db.String(50))
    category = db.Column(db.String(50))
    genre = db.Column(db.String(255))
    run_time = db.Column(db.String(20))

    rating = db.Column(db.Float)

    is_netflix = db.Column(db.Boolean)
    is_tving = db.Column(db.Boolean)
    is_wavve = db.Column(db.Boolean)
    is_watcha = db.Column(db.Boolean)
    is_coopang = db.Column(db.Boolean)

    def __init__(self, title, director):
        self.title = title
        self.director = director
