from db_connect import db
from flask import jsonify
from flaskr.models import actors, directors


class Actors:
    def get_actors(query):
        try:
            filter_actors = (
                db.session.query(actors)
                .filter(actors.actor.like(f"{query}%"))
                .limit(10)
            )
            return jsonify(actors=[data.actor for data in filter_actors]), 200
        except Exception as e:
            print(e)
            return jsonify("fail"), 400


class Directors:
    def get_directors(query):
        try:
            filter_directors = (
                db.session.query(directors)
                .filter(directors.director.like(f"{query}%"))
                .limit(10)
            )
            return jsonify(directors=[data.director for data in filter_directors]), 200
        except Exception as e:
            print(e)
            return jsonify(result="fail"), 400


class Contents:
    def get_contents():
        try:
            tmp = [
                [
                    1,
                    "괴물",
                    "봉준호",
                    "https://upload.wikimedia.org/wikipedia/ko/6/6a/%EA%B4%B4%EB%AC%BC.jpg",
                ],
                [
                    2,
                    "오징어게임",
                    "황동혁",
                    "https://img.khan.co.kr/news/2021/09/30/l_2021093001003585000310901.jpg",
                ],
            ]
            return jsonify(contents=tmp), 200
        except Exception as e:
            print(e)
            return jsonify(result="fail"), 400
