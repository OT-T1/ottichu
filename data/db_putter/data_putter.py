import ast
import json

import pymysql

import config

# DB Connection Info
DB_HOST = config.aws_db["host"]
DB_PORT = int(config.aws_db["port"])
USER = config.aws_db["user"]
PASSWD = config.aws_db["password"]
DB_NAME = config.aws_db["database"]


class DataPutter:
    def __init__(self, db=None):
        self.db = db
        self.cursor = self.db.cursor() if self.db else None
        self.actors = set()
        self.directors = set()
        self.contents = []
        self.genres = set()
        self.content_actor = []
        self.content_director = []
        self.content_genre = []
        # self.ott_infos = []

    def connect_db(self, info={}):
        config = info.keys()
        self.db = pymysql.connect(
            host=DB_HOST if "host" not in config else info["host"],
            port=DB_PORT if "port" not in config else info["port"],
            user=USER if "user" not in config else info["user"],
            passwd=PASSWD if "passwd" not in config else info["passwd"],
            db=DB_NAME if "db" not in config else info["db"],
        )
        if self.db:
            self.cursor = self.db.cursor()
        return self

    def close_db(self):
        if not self.db:
            return self
        self.db.close()
        return self

    def apply_to_db(self):
        if not self.db:
            return self
        self.db.commit()
        return self

    def clear_data(self):
        self.actors = set()
        self.contents = []
        self.content_actor = []
        return self

    def __add_content(self, content):
        if not content:
            return

        self.contents.append(
            (
                content["title"],
                content["summary"],
                content["category"],
                str(content["runtime"]),
                content["released_year"],
                content["rating"],
                content["ott.Netflix"] is not None,
                content["ott.tving"] is not None,
                content["ott.wavve"] is not None,
                content["ott.Watcha"] is not None,
                content["ott.coupang"] is not None,
                str(content["imgurl"]),
                str(content["s3_imgurl"]),
            )
        )

    def __classify_data(self, data):
        if not data:
            return

        for content_code, content in data.items():
            # 'contents' Table Data
            self.__add_content(content)

            # string to list
            list_actors = ast.literal_eval(content["actors"])
            list_directors = ast.literal_eval(content["director"])
            list_genres = ast.literal_eval(content["genre"])

            # 'content_actor' Table Data
            self.content_actor += list(
                map(lambda x: (int(content_code) + 1, x), list_actors)
            )
            # 'content_director' Table Data
            self.content_director += list(
                map(lambda x: (int(content_code) + 1, x), list_directors)
            )
            # 'content_genre' Table Data
            self.content_genre += list(
                map(lambda x: (int(content_code) + 1, x), list_genres)
            )

            # 'actors' Table Data
            self.actors |= set(list_actors)
            # 'directors' Table Data
            self.directors |= set(list_directors)
            # 'genres' Table Data
            self.genres |= set(list_genres)
            self.genres -= {"Made in Europe", ""}

    def read_data(self, file):
        type = file.split(".")[-1]
        with open(file, "r", encoding="utf-8") as f:
            if type == "json":
                data = json.load(f)
            elif type == "csv":
                pass
        self.__classify_data(data)
        return self

    def insert_actors(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE actors AUTO_INCREMENT = 0")
        self.cursor.executemany(
            "INSERT INTO actors(actor) VALUES(%s)",
            self.actors,
        )
        return self

    def insert_directors(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE directors AUTO_INCREMENT = 0")
        self.cursor.executemany(
            "INSERT INTO directors(director) VALUES(%s)",
            self.directors,
        )
        return self

    def insert_genres(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE genres AUTO_INCREMENT = 0")
        self.cursor.executemany(
            "INSERT INTO genres(genre) VALUES(%s)",
            self.genres,
        )
        return self

    def insert_contents(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE contents AUTO_INCREMENT = 0")
        # TODO: Check Record(SELECT title)
        self.cursor.executemany(
            """
        INSERT INTO contents (
            title,
            summary,
            category,
            run_time,
            released_year,
            rating,
            is_netflix,
            is_tving,
            is_wavve,
            is_watcha,
            is_coupang,
            original_img,
            s3_img
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
            self.contents,
        )
        return self

    def insert_content_actor(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE content_actor AUTO_INCREMENT = 0")
        # TODO: Check Record(SELECT title)
        self.cursor.executemany(
            "INSERT INTO content_actor(content_code, actor) VALUES(%s, %s)",
            self.content_actor,
        )
        return self

    def insert_content_director(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE content_director AUTO_INCREMENT = 0")
        # TODO: Check Record(SELECT title)
        self.cursor.executemany(
            "INSERT INTO content_director(content_code, director) VALUES(%s, %s)",
            self.content_director,
        )
        return self

    def insert_content_genre(self):
        if not self.cursor:
            return
        # Auto_increment 초기화
        self.cursor.execute("ALTER TABLE content_genre AUTO_INCREMENT = 0")
        # TODO: Check Record(SELECT title)
        self.cursor.executemany(
            "INSERT INTO content_genre(content_code, genre) VALUES(%s, %s)",
            self.content_genre,
        )
        return self

    # TODO: 아직 미구현.
    def insert_ott_infos(self):
        pass
        return self

    def delete_table_data(self, table_name=None):
        for i in ["actors", "contents", "directors", "genres", "content_actor"]:
            self.cursor.execute(f"DELETE FROM {i}")
        return self

    # TEST
    def print_data(self):
        print(self.actors)
        print(self.directors)
        print(self.contents)
        print(self.content_actor)
        return self


if __name__ == "__main__":
    # test_func()
    insertor = DataPutter()
    try:

        insertor.connect_db().read_data(
            "/Users/jeonggyu/Desktop/수집한 dataset/new_data/del_nan_final_total_data.json"
        ).insert_actors().insert_contents().insert_genres().insert_directors().insert_content_actor().insert_content_director().insert_content_genre().apply_to_db().close_db()

    except Exception as e:
        insertor.db.rollback()
        print(f"Error Message: {e}")
