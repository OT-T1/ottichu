from db_connect import db


class directors(db.Model):
    __tablename__ = "directors"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    director_code = db.Column(
        db.Integer, primary_key=True, nullable=False, autoincrement=True
    )

    director = db.Column(db.String(255), unique=True, nullable=False)
