from db_connect import db


class ott_infos(db.Model):
    __tablename__ = "ott_infos"
    __table_args__ = {
        "mysql_default_charset": "utf8mb4",
        "mysql_collate": "utf8mb4_general_ci",
    }

    code = db.Column(db.String(20), primary_key=True, nullable=False)

    ott_name = db.Column(db.String(20), nullable=False)
    number_people = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    quality = db.Column(db.String(20), nullable=False)

    def __init__(self, code, ott_name, number_people, price, quality):
        self.code = code
        self.ott_name = ott_name
        self.number_people = number_people
        self.price = price
        self.quality = quality
