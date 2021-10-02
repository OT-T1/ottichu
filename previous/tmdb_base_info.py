import requests
import json
import time
import random
import justwatch


# 헤더 정보가 없으면 에러가 나는 경우가 있어서 미리 넣었습니다.
headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}

# 크롤링을 위한 API KEY
API_KEY = 'aaeb39f3d7b1e153106013ce39c952af'


# TMDB에서는 영화 id가 숫자로 되어 있으므로 for문을 돌면서 영화 정보를 모두 수집합니다.
temp = dict()

# 현재는 550번 = 파이트 클럽만 수집해오는 상태입니다.
for i in range(550,551):
    # TMDB api 이용하기
    api_data = requests.get(f'https://api.themoviedb.org/3/movie/{i}?api_key={API_KEY}&language=ko-KR').json()
    # 크롤링 Block을 막기 위해 시간 차 두기
    time.sleep(random.uniform(0.5, 3))
   
    try:
        # Just Watch와 데이터 합치기
        # %EC%98%81%ED%99%94 = 영화 (아스키코드)
        # OTT 데이터 가져오기
        just_title = api_data['original_title'].replace(' ','-')
        JUST_PATH = f'https://www.justwatch.com/kr/%EC%98%81%ED%99%94/{just_title}'
        ott = justwatch.get_ott(JUST_PATH)
        
        temp[i] = {
            "title": api_data['title'], # 한국어 제목
            "ott": ott, # ott data from justwatch.py
            "original_title" : api_data['original_title'], # 영화/TV 쇼 원제
            "original_language" : api_data['original_language'], # 원래 제공되는 언어
            "imdb_id" : api_data['imdb_id'], # IMDB id
            "overview" : api_data['overview'], # 영화 짧은 글 소개
            "tagline" : api_data['tagline'], # 영화 한 줄 소개
            "TMDB_popularity": api_data['popularity'], # TMDB 인기도
            "TMDB_poster_path" : api_data['poster_path'], # TMDB 포스터 경로
            "release_date": api_data['release_date'], # 개봉일, 최초공개일
            "runtime" : api_data['runtime'], # 러닝타임
            "countries" : api_data['production_countries'], # 제작국가 전체 데이터
            "TMDB_vote_average" : api_data['vote_average'], # TMDB 평점
            "TMDB_vote_count" : api_data['vote_count'], # TMDB 카운트 수(평가 수?)
            }
    except:
        pass

file_path = './TMDB_base_info.json'

# 최초 파일 작성용
with open(file_path, 'w') as outfile:
    json.dump(temp, outfile, indent=4, ensure_ascii = False)

# # 덮어쓰기 위해 기존 파일 불러오기
# with open(file_path, 'r') as json_file:
#     json_data = json.load(json_file)

# # 덮어쓰기
# with open(file_path, 'w') as outfile:
#     json_data.update(temp)
#     json.dump(json_data, outfile, indent=4, ensure_ascii = False)


# 저장된 파일 불러와서 확인하기
with open(file_path, 'r') as json_file:
    json_data2 = json.load(json_file)
    print(json_data2)







