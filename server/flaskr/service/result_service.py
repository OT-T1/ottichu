from db_connect import db
from flask import jsonify


class Result:
    def get_result(self):
        tmp_contents = {
            "좀비": 50,
            "액션": 30,
            "코미디": 10,
            "코믹": 5,
            "호러": 5,
        }
        tmp_platform = {
            "netflix": {
                "percentage": 50,
                "plan": "basic",
                "quality": "4K",
                "price": 5000,
                "people_number": 4,
            },
            "whatcha": {
                "percentage": 50,
                "plan": "basic",
                "quality": "4K",
                "price": 5000,
                "people_number": 4,
            },
            "coupang": {
                "percentage": 50,
                "plan": "basic",
                "quality": "4K",
                "price": 5000,
                "people_number": 4,
            },
        }
        best_platform = "netflix"
        word_cloud = ("https://i.imgur.com/kqoZCej.jpeg",)
        contents = ([[], [], []],)
        result = {
            "genre": "호러",
            "price": 5000,
        }

        best_contents = (
            [
                [1, "{title}", "{director}", "{img_url}", "{platform}"],
                [2, "..."],
            ],
        )
        return (
            jsonify(
                category=tmp_contents,
                best_platform=best_platform,
                platform=tmp_platform,
                result=result,
            ),
            200,
        )

    def get_wordcloud(self):
        return jsonify(result="success"), 200
