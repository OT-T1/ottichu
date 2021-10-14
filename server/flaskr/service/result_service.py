from collections import Counter

from db_connect import db
from flask import jsonify
from flaskr.service.recommend_service import Recommendation


class Result:
    def get_result(user_code):
        recom = Recommendation()
        result_data, _ = recom.get_user_data(user_code)

        top_platform = recom.get_ott_recommendation(result_data["contents"])
        top_genre = recom.get_top_genre(result_data["contents"])

        total_genre_sum = sum(top_genre.values())
        for key, val in top_genre.items():
            top_genre[key] = int((val / total_genre_sum) * 100)

        total_platform_sum = sum(top_platform.values())
        for key, val in top_platform.items():
            top_platform[key] = {
                "percentage": int((val / total_platform_sum) * 100),
                "plan": "basic",
                "quality": "4K",
                "price": 5000,
                "people_number": 4,
            }

        return jsonify(category=top_genre, platform=top_platform), 200

    def get_wordcloud(user_code):
        recom = Recommendation()
        result_data, _ = recom.get_user_data(user_code)
        tokens = recom.for_wordcloud(result_data["contents"])
        token_cnt = Counter(tokens.split())
        for word in ["그", "것", "이"]:
            try:
                token_cnt.pop(word)
            except:
                pass

        return jsonify(words=token_cnt.most_common(300)), 200
