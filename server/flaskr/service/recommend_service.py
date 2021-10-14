import re
import time

import numpy as np
import pandas as pd
from db_connect import db
from flaskr.models import (
    content_genre,
    genres,
    ott_infos,
    user_actors,
    user_contents,
    user_directors,
    users,
)
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

            tastes = {
                "directors": [director.director for director in t_user_directors]
                if len(t_user_directors) != 0
                else ["봉준호", "김태호"],
                "actors": [actor.actor for actor in t_user_actors]
                if len(t_user_actors) != 0
                else ["유재석", "송강호"],
                "category": tmp,
                "contents": [content.content_code for content in t_user_contents],
            }

            if len(t_user_contents) == 0:
                first = True
            else:
                first = False

            return (tastes, first)
        except Exception as e:
            print("get_user_data", e)
            return False

    def get_first_contents(self, tastes, history_codes):
        try:
            # 선택한 감독과 배우가 둘다 없다면
            if len(tastes["actors"]) == 0 and len(tastes["directors"] == 0):
                tastes["actors"] = ["이정재"]  # 한 달 간 가장 언급 많이 된 배우
                tastes["directors"] = ["봉준호"]

            # prefilter 부분 : 감독, 배우 입력 값으로 해당하는 컨텐츠 코드 가져오기

            # 1) direcctor vector 생성 후 배우별 대표작 뽑기
            director_contents_codes = self.get_person_codes(
                tastes, "directors", mecab_data.model_director_tok
            )
            # 2) actor vector 생성 후 배우별 대표작 뽑기
            actor_contents_codes = self.get_person_codes(
                tastes, "actors", mecab_data.model_actor_tok
            )

            # 감독, 배우 컨텐츠 코드 모자라니까 더 만드는 부분(new)
            directors_other_codes = self.get_other_codes(
                director_contents_codes, mecab_data.model_director_tok
            ) + self.get_similar_codes(
                director_contents_codes, 2, mecab_data.model_director_tok
            )
            actors_other_codes = self.get_other_codes(
                actor_contents_codes, mecab_data.model_actor_tok
            ) + self.get_similar_codes(
                actor_contents_codes, 2, mecab_data.model_actor_tok
            )

            d_codes = director_contents_codes + directors_other_codes
            a_codes = actor_contents_codes + actors_other_codes

            length = min(len(d_codes), len(a_codes))

            result = []

            for d, c in zip(d_codes[:length], a_codes[:length]):
                if d not in history_codes and d not in result:
                    result.append(d)
                if c not in history_codes and c not in result:
                    result.append(c)

            more_directors_codes = self.get_other_codes(
                directors_other_codes, mecab_data.model_director_tok
            )
            more_actors_codes = self.get_other_codes(
                actors_other_codes, mecab_data.model_actor_tok
            )

            m_len = min(len(more_directors_codes), len(more_actors_codes))

            while len(result) < 10:
                for j in range(m_len):
                    d_code = more_directors_codes[j]
                    a_code = more_actors_codes[j]
                    if d_code not in history_codes and d_code not in result:
                        result.append(d_code)
                    if a_code not in history_codes and a_code not in result:
                        result.append(a_code)

            return result  # content_codes
        except Exception as e:
            print("get_first_contents", e)
            return False

    def get_other_10_contents(self, tastes, history_codes):
        try:
            user_picked_codes = tastes["contents"]
            result = []

            i = 1
            len_n = 0
            len_r = 10
            while len(result) < 10:
                new_codes = self.get_similar_codes(
                    user_picked_codes, i, mecab_data.model_tok
                )[len_n:]
                if len_r > 0:
                    rest_codes = self.get_first_contents(tastes, history_codes)[len_r:]
                else:
                    rest_codes = []
                temp = new_codes + rest_codes
                for t in temp:
                    if t not in history_codes and t not in result:
                        result.append(t)
                len_n = len(new_codes)
                len_r = len(rest_codes) - 10 * i
                i += 1

            return result[:10]  ### content_codes
        except Exception as e:
            print("get_other_10_contents", e)
            return False

    def get_result(self, final_codes):
        try:
            while len(final_codes) < 200:
                temp = self.get_similar_codes(final_codes, 3, mecab_data.model_tok)
                final_codes += temp

            return final_codes[:200]
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
            val = 200
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

    def get_similar_codes(self, content_codes, n, model):
        try:
            result = []
            for code in content_codes:
                code_vector = self.make_embedding([code], mecab_data.model_tok)
                similar_codes = model.dv.most_similar(code_vector, topn=n + 1)
                result_content_codes = [x[0] + 1 for x in similar_codes[1:]]
                result += result_content_codes

            return result
        except Exception as e:
            print("get_similar_codes", e)
            return False

    def get_person_codes(self, tastes, jobtype, model):
        try:
            contents_codes = []

            for person in tastes[jobtype]:
                picked = (
                    mecab_data.data["content_code"]
                    .loc[mecab_data.data[jobtype].astype(str).str.contains(f"{person}")]
                    .values.tolist()
                )
                embedded_pick = self.make_embedding(picked, model)
                representations = model.dv.most_similar(embedded_pick, topn=2)

                contents_codes += [rep[0] + 1 for rep in representations]

            return contents_codes
        except Exception as e:
            print("get_person_codes", e)
            return False

    def get_title(self, content_code):
        try:
            title = str(
                mecab_data.data["title"]
                .loc[mecab_data.data["content_code"] == content_code]
                .values
            )
            title = re.sub(r"[\[\]\'\"]", "", title)

            stopwords = ["흑백판", "4K", "리마스터링"]
            for stop in stopwords:
                title = re.sub(stop, "", title)

            return title

        except Exception as e:
            print("get_title", e)
            return False

    def check_title(self, prev_title, curr_title):
        if prev_title in curr_title:
            return True
        return False

    def get_other_codes(self, content_codes, model):
        try:
            result = []
            for code in content_codes:
                embedded = self.make_embedding([code], model)
                most_similar = model.dv.most_similar(embedded, topn=2)
                ms = most_similar[1][0] + 1

                if len(result) == 0:
                    result.append(ms)

                elif len(result) != 0:
                    prev_title = self.get_title(result[-1])
                    curr_title = self.get_title(ms)

                    if (self.check_title(prev_title, curr_title) == False) and (
                        ms not in result
                    ):
                        result.append(ms)

            return result

        except Exception as e:
            print("get_other_codes", e)
            return False

    def get_top_genre(self, result):
        try:
            # GENRE DICT SETTING
            genres_list = db.session.query(genres).all()

            unique_genre = set([genre.genre for genre in genres_list])  # 155개

            genre_count = dict()
            for ug in unique_genre:
                genre_count[ug] = 0

            # WEIGHT
            weight = [i for i in range(200, 0, -1)]

            for idx, content_code in enumerate(result):

                content_genres = db.session.query(content_genre).filter(
                    content_genre.content_code == content_code
                )
                genres_items = [temp.genre for temp in content_genres]
                for genre in genres_items:
                    try:
                        genre_count[genre] += weight[idx]  # 가중치 부여 점수 환산
                    except Exception as e:
                        print(e)

            top_genre = sorted(genre_count.items(), reverse=True, key=lambda x: x[1])[
                :5
            ]

            category = dict()
            for key, val in top_genre:
                category[key] = val

            return category
        except Exception as e:
            print("get_top_genre", e)
            return False

    def make_embedding(self, content_code_list, model_tok):
        try:
            user_embedding = []
            for i in content_code_list:
                try:
                    user_embedding.append(model_tok.dv[i - 1])
                except:
                    pass

            user_embedding = np.array(user_embedding)
            user = np.mean(user_embedding, axis=0)

            return user

        except Exception as e:
            print("make embedding", e)
            return False

    def get_price_info(self, ott, user_code):
        def get_best_price(target_price, monthly_fee):
            minimum_fee = max(monthly_fee)
            best_price = 0

            for fee in monthly_fee:
                cal = fee - target_price
                if cal < minimum_fee:
                    minimum_fee = cal
                    best_price = fee

            return best_price

        try:
            target_user = (
                db.session.query(users).filter(users.user_code == user_code).one()
            )
            target_price = target_user.ott_price // target_user.member_cnt

            target_ott_sheet = (
                db.session.query(ott_infos).filter(ott_infos.ott_name == ott).all()
            )
            monthly_fee = [ott_sheet.price for ott_sheet in target_ott_sheet]
            best_price = get_best_price(target_price, monthly_fee)

            best_plan = list(filter(lambda x: x.price == best_price, target_ott_sheet))[
                0
            ].plan

            best_quality = list(
                filter(lambda x: x.price == best_price, target_ott_sheet)
            )[0].quality

            price_info = {
                "plan": best_plan,
                "price": best_price,
                "quality": best_quality,
                "people_number": target_user.member_cnt,
                "imgurl": target_ott_sheet[0].imgurl,
            }

            return price_info
        except Exception as e:
            print("get_price_info", e)
            return False
