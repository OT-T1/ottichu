from db_connect import db


class users(db.Model):
    __tablename__ = "users"
    __table_args__ = {
        "mysql_default_charset": "utf8mb4",
        "mysql_collate": "utf8mb4_general_ci",
    }

    user_code = db.Column(
        db.Integer, primary_key=True, autoincrement=True, nullable=False
    )

    ott_price = db.Column(db.Integer)
    member_cnt = db.Column(db.Integer)
    free_time = db.Column(db.Integer)
    age = db.Column(db.Integer)

    gender = db.Column(db.String(10))

    is_movie = db.Column(db.Boolean)
    is_tvshow = db.Column(db.Boolean)

    def __init__(
        self, ott_price, member_cnt, free_time, age, gender, is_movie, is_tvshow
    ):
        self.ott_price = ott_price
        self.member_cnt = member_cnt
        self.free_time = free_time
        self.age = age
        self.gender = gender
        self.is_movie = is_movie
        self.is_tvshow = is_tvshow
