from db_connect import db
from flask import jsonify
from flaskr.models import user_actors, user_contents, user_directors, users


class User:
    def input_user_info(info):
        try:
            # category 처리
            is_movie, is_tvshow = False, False
            for category in info["categories"]:
                if category == "movie":
                    is_movie = True
                elif category == "tv_show":
                    is_tvshow = True

            # user데이터 생성
            new_user = users(
                age=info["age"],
                gender=info["gender"],
                is_movie=is_movie,
                is_tvshow=is_tvshow,
                ott_price=info["ott-price"],
                member_cnt=info["ott-people"],
                free_time=info["free-time"],
            )
            db.session.add(new_user)
            db.session.flush()
            user_code = new_user.user_code

            # user actor 데이터 생성
            for actor in info["favorite-actor"]:
                new_user_actors = user_actors(actor=actor, user_code=user_code)
                db.session.add(new_user_actors)

            # user director 데이터 생성
            for director in info["favorite-director"]:
                new_user_directors = user_directors(
                    director=director, user_code=user_code
                )
                db.session.add(new_user_directors)
            db.session.commit()
            return jsonify(result="created"), 201
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify(result="fail"), 400
