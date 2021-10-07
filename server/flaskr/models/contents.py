from db_connect import db


class contents(db.Model):
    __tablename__ = "contents"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    content_code = db.Column(
        db.Integer, primary_key=True, autoincrement=True, nullable=False
    )

    title = db.Column(db.String(255), nullable=False)

    summary = db.Column(db.Text())
    category = db.Column(db.String(50))
    genre = db.Column(db.String(255))
    released_year = db.Column(db.String(20))
    run_time = db.Column(db.String(20))

    rating = db.Column(db.Float)

    is_netflix = db.Column(db.Boolean)
    is_tving = db.Column(db.Boolean)
    is_wavve = db.Column(db.Boolean)
    is_watcha = db.Column(db.Boolean)
    is_coupang = db.Column(db.Boolean)

    def __init__(self, title, director):
        self.title = title
        self.director = director
