import random
import re

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
            user_tastes = tastes
            dummy_tv_directors = ["김태호", "나영석", "유제원", "신원호", "이응복", "김원석"]
            dummy_mv_directors = [
                "류승완",
                "봉준호",
                "박찬욱",
                "이병헌",
                "최동훈",
                "안소니 루소",
                "조 루소",
                "김한민",
                "크리스토퍼 놀란",
                "황동혁",
                "이상근",
                "이일형",
            ]
            dummy_tv_actors = [
                "박보검",
                "유재석",
                "강호동",
                "신동엽",
                "송혜교",
                "송중기",
                "공유",
                "조정석",
                "나문희",
                "이지아",
                "김소연",
                "유진",
                "엄기준",
                "박해수",
                "유연석",
                "정경호",
                "전미도",
                "김고은",
            ]
            dummy_mv_actors = [
                "전지현",
                "김혜수",
                "박정민",
                "양조위",
                "스칼렛 요한슨",
                "조승우",
                "주지훈",
                "설경구",
                "로버트 다우니 주니어",
                "구교환",
                "신민아",
                "크리스 에반스",
                "마크 러팔로",
                "크리스 헴스워스",
                "제레미 레너",
                "브리 라슨",
                "조슈 브롤린",
                "최민식",
                "류승룡",
                "하정우",
                "이정재",
                "공유",
                "마동석",
                "임윤아",
                "조정석",
                "매튜 매커너히",
                "앤 해서웨이",
                "마이클 케인",
                "제시카 차스테인",
                "나문희",
                "심은경",
                "김고은",
            ]

            dummy_actors = []
            dummy_directors = []
            for category in user_tastes["category"]:
                if category == "TV 프로그램":
                    dummy_actors += dummy_tv_actors
                    dummy_directors += dummy_tv_directors
                elif category == "영화":
                    dummy_actors += dummy_mv_actors
                    dummy_directors += dummy_mv_directors

            len_directors = len(user_tastes["directors"])
            len_actors = len(user_tastes["actors"])

            if len_directors == 0:
                dum_direc_choice = random.sample(dummy_directors, 5)
                user_tastes["directors"] += dum_direc_choice
            if len_actors == 0:
                dum_ac_choice = random.sample(dummy_actors, 5)
                user_tastes["actors"] += dum_ac_choice

            director_contents_codes = self.get_person_codes(user_tastes, "directors")
            actor_contents_codes = self.get_person_codes(user_tastes, "actors")
            # prefilter 부분 : 감독, 배우 입력 값으로 해당하는 컨텐츠 코드 가져오기

            director_more_codes = self.get_similar_codes(
                director_contents_codes, 10, mecab_data.model_tok
            )
            actor_more_codes = self.get_similar_codes(
                actor_contents_codes, 10, mecab_data.model_tok
            )

            d_codes = director_contents_codes + director_more_codes
            a_codes = actor_contents_codes + actor_more_codes

            result = []
            for d, a in zip(d_codes, a_codes):
                if d not in history_codes and d not in result:
                    result.append(d)
                if a not in history_codes and a not in result:
                    result.append(a)

            return result  # content_codes
        except Exception as e:
            print("get_first_contents", e)
            return False

    def get_other_10_contents(self, tastes, history_codes):
        try:
            user_picked_codes = tastes["contents"]

            result = []

            new_codes = self.get_similar_codes(
                user_picked_codes, 4, mecab_data.model_tok
            )
            for _ in range(3):
                new_codes += self.get_similar_codes(new_codes, 3, mecab_data.model_tok)
            for nc in new_codes:
                if nc not in history_codes and nc not in result:
                    result.append(nc)

            return result[:10]  ### content_codes
        except Exception as e:
            print("get_other_10_contents", e)
            return False

    def get_result(self, final_codes):
        try:
            uf = final_codes

            if len(uf) < 5:
                cnt = 5
            elif 5 <= len(uf) < 12:
                cnt = 4
            elif len(uf) >= 12:
                cnt = 3

            temp = self.get_similar_codes(uf, cnt, mecab_data.model_tok)
            for _ in range(3):
                uf += temp
                temp = self.get_similar_codes(temp, cnt, mecab_data.model_tok)

            result = []
            for u in uf:
                if u not in result:
                    result.append(u)

            return result[:200]

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

            return user_embedding

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

    def get_diagram(self, result):
        try:
            otts = self.count_by_ott(result)
            otts = sorted(otts.items(), key=lambda x: x[1], reverse=True)
            # 상위 3개만 선별
            ott_rank = [ott[0] for ott in otts][:3]

            diagram_val = {
                ott_rank[0]: int(otts[0][1]),
                ott_rank[1]: int(otts[1][1]),
                ott_rank[2]: int(otts[2][1]),
            }

            query = []
            for ott in ott_rank:
                q = f"is_{ott}"
                query.append(q)

            contents = mecab_data.data.loc[mecab_data.data["content_code"].isin(result)]

            rank_1_2 = contents.loc[
                (contents[query[0]] == 1) & (contents[query[1]] == 1)
            ]

            rank_1_3 = contents.loc[
                (contents[query[0]] == 1) & (contents[query[2]] == 1)
            ]

            rank_2_3 = contents.loc[
                (contents[query[1]] == 1) & (contents[query[2]] == 1)
            ]

            rank_1_2_3 = contents.loc[
                (contents[query[0]] == 1)
                & (contents[query[1]] == 1)
                & (contents[query[2]] == 1)
            ]

            diagram_val[f"{ott_rank[0]}&{ott_rank[1]}"] = len(rank_1_2.index)
            diagram_val[f"{ott_rank[0]}&{ott_rank[2]}"] = len(rank_1_3.index)
            diagram_val[f"{ott_rank[1]}&{ott_rank[2]}"] = len(rank_2_3.index)
            diagram_val[f"{ott_rank[0]}&{ott_rank[1]}&{ott_rank[2]}"] = len(
                rank_1_2_3.index
            )

            return diagram_val
        except Exception as e:
            print("get_diagram", e)
