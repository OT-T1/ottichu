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
        self.content_actor = []
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
                "|".join(ast.literal_eval(content["genre"])),
                str(content["runtime"]),
                content["released_year"],
                content["rating"],
                content["ott.Netflix"] is not None,
                content["ott.tving"] is not None,
                content["ott.wavve"] is not None,
                content["ott.Watcha"] is not None,
                content["ott.coupang"] is not None,
            )
        )

    def __classify_data(self, data):
        if not data:
            return
        for content_code, content in data.items():
            tmp_actors = ast.literal_eval(content["actors"])
            # 'actors' Table Data
            self.actors |= set(tmp_actors)
            # 'directors' Table Data
            self.directors |= set(ast.literal_eval(content["director"]))
            # 'contents' Table Data
            self.__add_content(content)
            # 'content_actor' Table Data
            for tmp_actor in tmp_actors:
                self.content_actor.append((int(content_code) + 1, tmp_actor))

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
        for name in self.actors:
            self.cursor.execute("INSERT INTO actors(actor) VALUES(%s)", name)
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
            genre,
            run_time,
            released_year,
            rating,
            is_netflix,
            is_tving,
            is_wavve,
            is_watcha,
            is_coupang
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
        return self

    # TODO: 아직 미구현.
    def insert_ott_infos(self):
        pass
        return self

    def delete_table_data(self, table_name):
        self.cursor.execute(f"DELETE FROM {table_name}")
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
            "/Users/jeonggyu/Desktop/Elice/EliceProject/ott-service-project/data/db_putter/test.json"
        ).insert_content_actor().apply_to_db().close_db()

        # 삭제
        # insertor.connect_db().delete_table_data("contents").apply_to_db().close_db()

        # apply_to_db().close_db()
        # .insert_actors().apply_to_db().close_db()
        # .insert_actors()
        # .insert_contents()
    except Exception as e:
        print(f"Error Message: {e}")
