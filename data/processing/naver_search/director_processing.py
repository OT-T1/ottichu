import itertools
import json
import time

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs

# 각자 파일 저장한 위치 경로
CSV_FILE_PATH = "INSERT FILE PATH"

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
}


def create_list(df):
    dir_list = dict()
    for idx in df.index:
        cur = df.loc[idx]
        # 감독의 데이터를 뽑아온다.
        cur_dir = cur["director"].replace("'", "")[1:-1].split(",")
        # 감독들을 넣는다.
        for dir in cur_dir:
            dir_list[dir] = ""
    return dir_list


def search_director(director):
    time.sleep(0.5)
    naver_search = f"https://search.naver.com/search.naver?query={director}"

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
    dir_list = create_list(df)

    for dir in dir_list:
        try:
            change_dir = search_director(dir)
            print(f"{dir} => {change_dir}")
            dir_list[dir] = change_dir
        except Exception as e:
            print(e)

    json = json.dumps(dir_list)

    # 여기도 각자 start-end형식으로 [ex) (0-20000)] 파일명을 작성해주세요.
    # 작성해주셔서 파일 주시면 됩니다~
    with open("./director.json", "w") as f:
        f.write(json)
