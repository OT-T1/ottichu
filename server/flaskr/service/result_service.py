from collections import Counter, defaultdict

from db_connect import db
from flask import jsonify
from flaskr.models import content_genre, contents
from flaskr.service.recommend_service import Recommendation


class Result:
    def get_result(user_code):
        recom = Recommendation()
        data_recom, _ = recom.get_user_data(user_code)
        data_result = recom.get_recom_result(data_recom)

        platform = recom.get_ott_recommendation(data_result)
        cnt_ott = recom.count_by_ott(data_result)

        contents_info = (
            db.session.query(contents)
            .filter(contents.content_code.in_(data_result))
            .all()
        )
        content_genres = (
            db.session.query(content_genre)
            .filter(content_genre.content_code.in_(data_result))
            .all()
        )
        result_genre = defaultdict(int)
        for info in content_genres:
            result_genre[info.genre] += 1
        total_genre_cnt = sum(result_genre.values())
        result_genre = sorted(result_genre.items(), key=lambda x: x[1], reverse=True)
        genre = {
            result_genre[0][0]: result_genre[0][1] / total_genre_cnt,
            result_genre[1][0]: result_genre[1][1] / total_genre_cnt,
            result_genre[2][0]: result_genre[2][1] / total_genre_cnt,
            result_genre[3][0]: result_genre[3][1] / total_genre_cnt,
            result_genre[4][0]: result_genre[4][1] / total_genre_cnt,
        }
        print(genre)

        platform = {}

        print(data_result)
        print(len(data_result))
        print(type(cnt_ott))
        print(cnt_ott)
        print(type(platform))
        print(platform)

        category = {"좀비": 50, "액션": 30, "코미디": 10, "코믹": 5, "호러": 5}
        platform = {
            "netflix": {
                "percentage": 50,
                "plan": "basic",
                "quality": "4K",
                "price": 5000,
                "people_number": 4,
            },
            "watcha": {
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

        return jsonify(category=category, platform=platform), 200

    def get_wordcloud(user_code):
        recom = Recommendation()
        data_recom, _ = recom.get_user_data(user_code)
        result = recom.get_recom_result(data_recom)
        tokens = recom.for_wordcloud(result)

        token_cnt = Counter(tokens.split())
        for word in ["그", "것", "이"]:
            token_cnt.pop(word)

        return jsonify(words=token_cnt.most_common(300)), 200
