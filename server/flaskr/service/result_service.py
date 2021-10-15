from collections import Counter

from db_connect import db
from flask import jsonify
from flaskr.service.recommend_service import Recommendation


class Result:
    def get_result_recom(user_code):
        recom = Recommendation()
        user_data, _ = recom.get_user_data(user_code)
        # 비슷한 상위 200개의 컨텐츠
        result_data = recom.get_result(user_data["contents"])
        # 장르
        result_diagram = recom.get_diagram(result_data)
        top_genre = recom.get_top_genre(result_data)
        # ott추천정도
        top_platform = recom.get_ott_recommendation(result_data)
        top3_platform = sorted(top_platform.items(), key=lambda x: x[1], reverse=True)[
            :3
        ]

        total_top3_platform_sum = sum(i[1] for i in top3_platform)
        result_platform = dict()
        for ott, _ in top3_platform:
            result_platform[ott] = recom.get_price_info(ott, user_code)
            result_platform[ott]["percentage"] = int(
                (top_platform[ott] / total_top3_platform_sum) * 100
            )

        # 장르 추천 정도
        total_genre_sum = sum(top_genre.values())
        for key, val in top_genre.items():
            top_genre[key] = int((val / total_genre_sum) * 100)

        # ott추천 정렬
        return (
            jsonify(
                category=top_genre,
                platform=dict(
                    sorted(
                        result_platform.items(),
                        key=lambda x: x[1]["percentage"],
                        reverse=True,
                    )
                ),
                diagram=result_diagram,
            ),
            200,
        )

    def get_wordcloud(user_code):
        recom = Recommendation()
        user_data, _ = recom.get_user_data(user_code)
        result_data = recom.get_result(user_data["contents"])
        tokens = recom.for_wordcloud(result_data)
        token_cnt = Counter(tokens.split())
        for word in ["그", "것", "이"]:
            try:
                token_cnt.pop(word)
            except:
                pass

        return jsonify(words=token_cnt.most_common(300)), 200
