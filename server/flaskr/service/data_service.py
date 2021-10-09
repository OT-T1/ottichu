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
            return jsonify(contents="content"), 200
        except Exception as e:
            print(e)
            return jsonify(result="fail"), 400
