import json
import time
from urllib.request import Request, urlopen

import pandas as pd
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


def g_search_director(director):
    try:
        time.sleep(0.5)

        url = f"https://www.google.com/search?q={director}"
        req = Request(url, headers=HEADERS)
        page = urlopen(req)
        soup = bs(page, "html.parser")

        director_name = soup.find("h2", attrs={"data-attrid": True}).text
        idx = director_name.find("(")
        ans = director_name if idx == -1 else director_name[: idx - 1]
        return None if ans == "이것을 찾으셨나요?" else ans

    except Exception as e:
        return None


if __name__ == "__main__":
    # 현재 CSV File을 읽어온다.
    df = pd.read_csv(CSV_FILE_PATH)
    # list를 만든다.
    # 각자 맡을 코드 밑에 주석처리한 부분에다가 넣고 돌려주세요.
    dir_list = create_list(df)

    for director in dir_list:
        change_director = g_search_director("+".join(director.split()))
        print(f"{director} => {change_director}")
        dir_list[director] = change_director
        break
    j = json.dumps(dir_list)

    # 여기도 각자 start-end형식으로 [ex) (0-20000)] 파일명을 작성해주세요.
    with open(
        "/mnt/c/Users/jeong/Desktop/Elice/ott-service-project/director.json", "w"
    ) as f:
        f.write(j)
