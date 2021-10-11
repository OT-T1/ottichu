import json
import time
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup as bs

# 변경변경!
FILE_PATH = ""

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
}


def g_search_actor(actor):
    try:
        time.sleep(0.5)

        url = f"https://www.google.com/search?q={actor}"
        req = Request(url, headers=HEADERS)
        page = urlopen(req)
        soup = bs(page, "html.parser")

        actor_name = soup.find("h2", attrs={"data-attrid": True}).text
        idx = actor_name.find("(")
        ans = actor_name if idx == -1 else actor_name[: idx - 1]
        return None if ans == "이것을 찾으셨나요?" else ans

    except Exception as e:
        return None


if __name__ == "__main__":
    # 각자 현재 naver search를 이용한 json파일 존재하는 경로를 적어주세요.
    with open(FILE_PATH) as f:
        dict_actor = dict(filter(lambda x: x[1] is None, json.load(f).items()))

    for actor in dict_actor:
        change_actor = g_search_actor("+".join(actor.split()))
        print(f"{actor} => {change_actor}")
        dict_actor[actor] = change_actor

    j = json.dumps(dict_actor)

    # 여기도 각자 start-end형식으로 [ex) google_0_20000.json] 파일명을 작성해주세요.
    with open("./google_0_20000.json", "w") as f:
        f.write(j)
