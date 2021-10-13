import numpy as np
import pandas as pd
from db_connect import db
from flaskr.models import user_actors, user_contents, user_directors, users
from mecab import mecab_data


class Recommendation:
    def get_user_data(self, user_code):
        try:
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
                .filter(user_directors.user_code == user_code)
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
                t_actors=t_user_actors,
                t_directors=t_user_directors,
                t_category=tmp,
                t_contents=t_user_contents,
            )
            if len(t_user_contents) == 0:
                first = True
            else:
                first = False

            return user_prefiltered, first
        except Exception as e:
            print("get_user_data", e)
            return False

    def pre_filter(self, t_actors, t_directors, t_category, t_contents):
        try:
            sel_director = " ".join([td.director for td in t_directors])
            sel_actor = " ".join([ta.actor for ta in t_actors])
            sel_category = " ".join([tc for tc in t_category])

            # DB에서 사용자가 선택한 인덱스를 가져온다

            sel_contents = [tc.content_code for tc in t_contents]

            data = mecab_data.data
            prev_user = (
                data.loc[data["content_code"].isin(sel_contents)]
                .sort_values(by=["rating"], ascending=False)
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
                .sort_values(by=["rating"], ascending=False)
                .reset_index()
            )

            user = pd.concat([prev_user[:1], user_prefiltered[:10]], ignore_index=True)

            return user
        except Exception as e:
            print("pre_filter", e)
            return False

    def get_first_10_contents(self, user_prefiltered):
        try:
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
                .sort_values(by=["rating"], ascending=False)
                .reset_index()
            )
            result_codes = result_codes["content_code"].values.tolist()

            return result_codes
        except Exception as e:
            print("get_first_10_contents", e)
            return False

    def make_user_embedding(self, content_code_list, model):
        try:
            user_embedding = []
            for i in content_code_list:
                try:
                    user_embedding.append(model.dv[i - 1])
                except Exception as e:
                    print("i", i, e)

            user_embedding = np.array(user_embedding)
            user = np.mean(user_embedding, axis=0)

            return user
        except Exception as e:
            print("make_user_embedding", e)
            return False

    def get_another_10_contents(self, user_updated):
        try:
            user_updated_embedded = self.make_user_embedding(
                user_updated["content_code"],
                mecab_data.model_tok,
            )

            num_code = len(user_updated)
            prev_code = user_updated["content_code"].values.tolist()
            similar_contents = mecab_data.model_tok.dv.most_similar(
                user_updated_embedded, topn=num_code + 10
            )

            temp_code = [x[0] + 1 for x in similar_contents]

            data = mecab_data.data
            new_code = (
                data.loc[data["content_code"].isin(temp_code)]
                .sort_values(by=["rating"], ascending=False)
                .reset_index()
            )
            new_code = new_code["content_code"].values.tolist()

            another_10_contents = list(set(prev_code + new_code))[:10]

            return another_10_contents
        except Exception as e:
            print("get_another_10_contents", e)
            return False

    def get_recom_result(self, user_updated):
        try:
            user_final = self.make_user_embedding(
                user_updated["content_code"].values.tolist(), mecab_data.model_tok
            )

            # 최종 데이터와 유사한 문서 상위 200개를 선정하여, 어느 ott에 더 많은지 알려주기
            final_contents = mecab_data.model_tok.dv.most_similar(user_final, topn=200)

            final_temp_codes = [x[0] + 1 for x in final_contents]
            # final_content_codes = [x[0] for x in final_contents]

            final_codes = (
                mecab_data.data.loc[
                    mecab_data.data["content_code"].isin(final_temp_codes)
                ]
                .sort_values(by=["rating"], ascending=False)
                .reset_index()
            )

            final_codes = final_codes["content_code"].values.tolist()

            return final_codes
        except Exception as e:
            print("get_result", e)
            return False

    def count_by_ott(self, result):
        try:
            count = mecab_data.data.loc[mecab_data.data["content_code"].isin(result)]
            otts = ["is_netflix", "is_tving", "is_wavve", "is_watcha", "is_coupang"]
            ott = ["netflix", "tving", "wavve", "watcha", "coupang"]
            ott_counts = dict()
            for idx, is_ott in enumerate(otts):
                # print(f"{is_ott}", count['content_code'][count[f'{is_ott}'] == 1].count())
                val = count[{is_ott}].sum().values[0]
                print(f"{is_ott}", val)
                ott_counts[ott[idx]] = val

            return ott_counts
        except Exception as e:
            print("count_by_ott", e)
            return False

    def get_ott_recommendation(self, result):
        try:
            # netflix_score, tving_score, wavve_score, watcha_score, coupang_score = 0, 0, 0, 0, 0
            scores = [0, 0, 0, 0, 0]
            is_otts = ["is_netflix", "is_tving", "is_wavve", "is_watcha", "is_coupang"]
            weight = [i for i in range(200, 0, -1)]

            # i = 0 ~ 199  :  200개 결과값
            for idx, content_code in enumerate(result):
                # j = 0 ~ 4  : 5가지 ott 점수
                try:
                    for j, is_ott in enumerate(is_otts):
                        scores[j] += (
                            mecab_data.data[is_ott]
                            .loc[mecab_data.data["content_code"] == content_code]
                            .values[0]
                            * weight[idx]
                        )
                except Exception as e:
                    print(e)

            platform = {
                "netflix": scores[0],
                "tving": scores[1],
                "watcha": scores[2],
                "wavve": scores[3],
                "coupang": scores[4],
            }

            return platform
        except Exception as e:
            print("get_ott_recommendation", e)
            return False

    def for_wordcloud(self, result):
        try:
            # 워드클라우드에 입력되어야 할 토큰이(단어가) 더 많아야 하면 val을 조정하기
            val = 30
            tokens = []
            for content_code in result[:val]:
                token = str(
                    mecab_data.data["mecab_tok"]
                    .loc[mecab_data.data["content_code"] == content_code]
                    .values
                )
                tokens.append(token)

            tokens = " ".join(tokens).replace("[", "").replace("]", "").replace("'", "")

            return tokens
        except Exception as e:
            print("for_wordcloud", e)
            return False
