from db_connect import db


class genres(db.Model):
    __tablename__ = "genres"
    __table_args__ = {"mysql_collate": "utf8_general_ci"}

    genre_code = db.Column(
        db.Integer, primary_key=True, nullable=False, autoincrement=True
    )

    genre = db.Column(db.String(255), unique=True, nullable=False)
