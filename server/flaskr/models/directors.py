from db_connect import db


class directors(db.Model):
    __tablename__ = "directors"
    __table_args__ = {
        "mysql_default_charset": "utf8mb4",
        "mysql_collate": "utf8mb4_general_ci",
    }

    director_code = db.Column(
        db.Integer, primary_key=True, nullable=False, autoincrement=True
    )

    director = db.Column(db.String(255), unique=True, nullable=False)
