import requests
import json
import time
import random


# 크롤링을 위한 API KEY
API_KEY = 'aaeb39f3d7b1e153106013ce39c952af'

# TMDB에서는 영화 id가 숫자로 되어 있으므로 for문을 돌면서 영화 정보를 모두 수집합니다.
temp = dict()

# id값을 start에서 end만큼 돌며 api에서 제공하는 영화 메타데이터를 수집합니다.
start = 7001
end = 8001
for i in range(start,end):
    # TMDB api 이용하기
    api_data = requests.get(f'https://api.themoviedb.org/3/movie/{i}?api_key={API_KEY}&language=ko-KR').json()
    # 크롤링 Block을 막기 위해 시간 차 두기
    time.sleep(random.uniform(0.5, 1.5))
   
    try:  
        temp[i] = {
            "title": api_data['title'], # 한국어 제목
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

file_path = f'./TMDB_base_info_{start}_{end-1}.json'

# 최초 파일 작성용
with open(file_path, 'w') as outfile:
    json.dump(temp, outfile, indent=4, ensure_ascii = False)


# 저장된 파일 불러와서 확인하기
# with open(file_path, 'r') as json_file:
#     json_data2 = json.load(json_file)
#     print(json_data2)







