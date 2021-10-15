import numpy as np
import pandas as pd
from db_connect import db
from flask import jsonify
from flaskr.models import (
    actors,
    content_director,
    contents,
    directors,
    user_actors,
    user_contents,
    user_directors,
    users,
)
from flaskr.service.recommend_service import Recommendation
from mecab import mecab_data


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
    def get_contents(self, user_code, history_codes):
        try:
            recom = Recommendation()
            tastes, first = recom.get_user_data(user_code)

            # 첫 추천
            if first:
                contents_list = recom.get_first_contents(tastes, set(history_codes))[
                    :10
                ]
                return jsonify(contents=self.get_content_data(contents_list))
            # 선택된 컨텐츠 기반 추천
            else:
                contents_list = recom.get_other_10_contents(tastes, set(history_codes))
                return jsonify(contents=self.get_content_data(contents_list))

        except Exception as e:
            print(e)
            return jsonify(result="fail"), 400

    def get_content_data(self, contents_list):
        result_contents = []
        for content in contents_list:
            t_content = (
                db.session.query(contents)
                .filter(contents.content_code == int(content))
                .one()
            )
            t_directors = (
                db.session.query(content_director)
                .filter(content_director.content_code == int(content))
                .all()
            )
            result_contents.append(
                (
                    t_content.content_code,
                    t_content.title,
                    [t_director.director for t_director in t_directors],
                    t_content.s3_img,
                )
            )
        return result_contents
