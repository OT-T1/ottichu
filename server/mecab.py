import re

import pandas as pd
import pymysql
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from konlpy.tag import Mecab

import config

SHOW_TABLE = "SHOW TABLES"
SHOW_CONTENTS = "SELECT * FROM contents"
READ_CONTENT_GENRE = "SELECT * FROM content_genre"
READ_CONTENT_ACTOR = "SELECT * FROM content_actor"
READ_CONTENT_DIRECTOR = "SELECT * FROM content_director"

# 데이터 가져오기 및 전처리
class Data:
    def __init__(self, db=None):
        self.db = db
        self.data = None
        self.data_doc_tok_tag = None
        self.data_doc_tok = None
        self.model_tok = Doc2Vec.load("./True_content_model.doc2vec")
        print("init func")

    def make_data(self):
        print("aa")
        contents = pd.read_sql(SHOW_CONTENTS, db)
        content_actor = pd.read_sql(READ_CONTENT_ACTOR, self.db)
        content_director = pd.read_sql(READ_CONTENT_DIRECTOR, db)
        content_genre = pd.read_sql(READ_CONTENT_GENRE, db)

        self.data = contents.drop(
            columns=["rating", "run_time", "released_year"], axis=1
        )

        docs = []
        actors = []
        directors = []
        genres = []

        for content_code, title, summary in zip(
            self.data["content_code"], self.data["title"], self.data["summary"]
        ):
            temp_items = []

            actor = (
                content_actor["actor"]
                .loc[content_actor["content_code"] == content_code]
                .tolist()
            )
            director = (
                content_director["director"]
                .loc[content_director["content_code"] == content_code]
                .tolist()
            )
            genre = (
                content_genre["genre"]
                .loc[content_genre["content_code"] == content_code]
                .tolist()
            )

            temp_items.append(title)
            temp_items.append(str(actor))
            temp_items.append(str(director))
            temp_items.append(str(genre))
            temp_items.append(summary)

            doc = " ".join(filter(lambda x: x is not None, temp_items))

            remove_sc = re.compile("[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`'…》]")
            doc = remove_sc.sub("", doc)

            docs.append(doc)
            actors.append(actor)
            directors.append(director)
            genres.append(genre)

        self.data["doc"] = docs
        self.data["actors"] = actors
        self.data["directors"] = directors
        self.data["genres"] = genres

        m = Mecab()
        mecab_tok = []

        for doc in self.data["doc"]:
            words = m.nouns(doc)  # 고유명사화 알아보기
            words = " ".join(words)
            mecab_tok.append(words)

        self.data["mecab_tok"] = mecab_tok
        self.data["mecab_tok"] = self.data["mecab_tok"].astype(str)
        self.data["doc"] = self.data["doc"].astype(str)
        self.data.index.name = "num"

    def make_doc2vec_data(self, column, tagged=False):
        data_doc = []

        # for tag, doc in zip(data.index, data[column]):
        for tag, doc in zip(self.data.index, self.data[column]):
            doc = doc.split(" ")
            data_doc.append(([tag], doc))

        if tagged:
            self.data_doc_tok_tag = [
                TaggedDocument(words=text, tags=tag) for tag, text in data_doc
            ]
        else:
            self.data_doc_tok = data_doc


db = pymysql.connect(
    user=config.aws_db["user"],
    passwd=config.aws_db["password"],
    host=config.aws_db["host"],
    port=int(config.aws_db["port"]),
    db=config.aws_db["database"],
)
mecab_data = Data(db)
