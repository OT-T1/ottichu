from db_connect import db


class genres(db.Model):
    __tablename__ = "genres"
    __table_args__ = {
        "mysql_default_charset": "utf8mb4",
        "mysql_collate": "utf8mb4_general_ci",
    }

    genre_code = db.Column(
        db.Integer, primary_key=True, nullable=False, autoincrement=True
    )

    genre = db.Column(db.String(255), unique=True, nullable=False)
