import itertools
import json
import time

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs

# 각자 파일 저장한 위치 경로
# 변경변경!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
CSV_FILE_PATH = "/Users/jeonggyu/Desktop/수집한 dataset/total_data.csv"

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
}


def create_list(df):
    actor_list = dict()
    for idx in df.index:
        cur = df.loc[idx]
        # 배우의 데이터를 뽑아온다.
        cur_actors = cur["actors"].replace("'", "")[1:-1].split(",")
        # 배우들을 넣는다.
        for actor in cur_actors:
            actor_list[actor] = ""
    return actor_list


def search_actor(actor):
    time.sleep(0.5)
    naver_search = f"https://search.naver.com/search.naver?query={actor}"

    try:
        search_name = requests.get(naver_search, headers=HEADERS)
    except:
        time.sleep(5)
        search_name = requests.get(naver_search, headers=HEADERS)

    res = search_name.text
    soup = bs(res, "html.parser")

    try:
        return soup.find("span", "area_text_title").text
    except:
        return None


if __name__ == "__main__":
    # 현재 CSV File을 읽어온다.
    df = pd.read_csv(CSV_FILE_PATH)
    # list를 만든다.
    # 각자 맡을 코드 밑에 주석처리한 부분에다가 넣고 돌려주세요.
    tmp_dict = create_list(df)
    actor_list = dict(itertools.islice(tmp_dict.items(), 100000, len(tmp_dict.keys())))

    for actor in actor_list:
        try:
            change_actor = search_actor(actor)
            print(f"{actor} => {change_actor}")
            actor_list[actor] = change_actor
        except Exception as e:
            print(e)

    json = json.dumps(actor_list)

    # 여기도 각자 start-end형식으로 [ex) (0-20000)] 파일명을 작성해주세요.
    # 작성해주셔서 파일 주시면 됩니다~
    with open("./100000_end.json", "w") as f:
        f.write(json)
