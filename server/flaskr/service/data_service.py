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
    def get_contents(self, user_code):
        try:
            # 해당 user_code를 가진 user를 찾는다.
            target_user = (
                db.session.query(users).filter(users.user_code == user_code).one()
            )

            t_user_actors = (
                db.session.query(user_actors)
                .filter(user_actors.user_code == user_code)
                .all()
            )
            t_user_directors = (
                db.session.query(user_directors)
                .filter(user_directors == user_code)
                .all()
            )
            t_user_contents = (
                db.session.query(user_contents)
                .filter(user_contents.user_code == user_code)
                .all()
            )

            tmp = []
            if target_user.is_movie:
                tmp.append("영화")
            if target_user.is_tvshow:
                tmp.append("TV 프로그램")

            user_prefiltered = self.pre_filter(
                t_user_actors, t_user_directors, tmp, t_user_contents
            )

            def get_content_data(contents_list):
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

            # 첫 추천
            if len(t_user_contents) == 0:
                contents_list = self.get_first_10_contents(user_prefiltered)

                return jsonify(contents=get_content_data(contents_list))
            # 선택된 컨텐츠 기반 추천
            else:
                contents_list = self.get_another_10_contents(user_prefiltered)
                return jsonify(contents=get_content_data(contents_list))

        except Exception as e:
            print(e)
            return jsonify(result="fail"), 400

    def pre_filter(self, t_actors, t_directors, t_category, t_contents):

        sel_director = " ".join([ta.actor for ta in t_actors])
        sel_actor = " ".join([td.director for td in t_directors])
        sel_category = " ".join([tc for tc in t_category])

        # DB에서 사용자가 선택한 인덱스를 가져온다

        sel_contents = [tc.content_code for tc in t_contents]

        data = mecab_data.data
        prev_user = (
            data.loc[data["content_code"].isin(sel_contents)]
            # .sort_values(by=["rating"], ascending=False)
            .reset_index()
        )

        user_prefiltered = (
            data.loc[
                (
                    data["directors"].astype(str).str.contains(f"{sel_director}")
                    | data["actors"].astype(str).str.contains(f"{sel_actor}")
                )
                & (data["category"] == f"{sel_category}")
            ]
            # .sort_values(by=["rating"], ascending=False)
            .reset_index()
        )

        user = pd.concat([prev_user[:5], user_prefiltered[:5]], ignore_index=True)

        return user

    def get_first_10_contents(self, user_prefiltered):

        user_updated_embedded = self.make_user_embedding(
            user_prefiltered["content_code"],
            mecab_data.model_tok,
        )
        similar_contents = mecab_data.model_tok.dv.most_similar(
            user_updated_embedded, topn=20
        )
        similar_contents = list(set(similar_contents))[:10]

        content_codes = [x[0] + 1 for x in similar_contents]
        data = mecab_data.data

        result_codes = (
            data.loc[data["content_code"].isin(content_codes)]
            # .sort_values(by=["rating"], ascending=False)
            .reset_index()
        )
        result_codes = result_codes["content_code"].values.tolist()

        return result_codes

    def make_user_embedding(self, content_code_list, model):
        user_embedding = []
        for i in content_code_list:
            try:
                user_embedding.append(model.dv[i - 1])
            except Exception as e:
                print("i", i, e)

        user_embedding = np.array(user_embedding)
        user = np.mean(user_embedding, axis=0)

        return user

    def get_another_10_contents(self, user_updated):
        user_updated_embedded = self.make_user_embedding(
            user_updated.index.values.tolist(),
            mecab_data.model_tok,
        )

        num_code = len(user_updated)
        prev_code = user_updated.index.values.tolist()
        similar_contents = mecab_data.model_tok.dv.most_similar(
            user_updated_embedded, topn=num_code + 10
        )

        temp_code = [x[0] + 1 for x in similar_contents]

        data = mecab_data.data
        new_code = (
            data.loc[data["content_code"].isin(temp_code)]
            # .sort_values(by=["rating"], ascending=False)
            .reset_index()
        )
        new_code = new_code["content_code"].values.tolist()

        another_10_contents = list(set(prev_code + new_code))[:10]

        return another_10_contents
