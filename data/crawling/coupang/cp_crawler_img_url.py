import json
import os
import random
import time

import requests

# 헤더 정보가 없으면 에러가 나는 경우가 있어서 미리 넣었습니다.
headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}

# 카테고리별 작품 아이디 수집
# 카테고리 페이지는 로그인이 되어 있어야 접근 가능한 상황
# 현재 로그인 세션 유지에 계속 실패하여 우선 수동으로 각 카테고리 페이지에 접근하였고
# 22개 카테고리에 대한 json 파일을 개발자 도구 response를 통해 수동으로 얻음

categories_path = './categories_kr/'
file_list = os.listdir(categories_path)

# exclude hidden files
file_list = [path for path in file_list if path[0] != '.'] 

for path in file_list:
    file_path = categories_path+path
    with open(file_path, 'r') as json_file:
        raw_data = json.load(json_file)

    data = raw_data['data']['data']
    

    # Main Crawler
    cnt = 0
    content = dict()
    while True:
        try:
            ott = {'coupang' : ['정액제']}
            id = data[cnt]['id']
            title = data[cnt]['title']
            original_title = ''

            # category, released_year and seasons
            if data[cnt]['as'] == 'TVSHOW':
                category = 'TV 프로그램'
                if data[cnt]['meta']['releaseYear']:
                    released_year = data[cnt]['meta']['releaseYear']
                elif data[cnt]['rating']['classification_number'] != '':
                    released_year = int(data[cnt]['rating']['classification_number'].split('-')[0])
                elif data[cnt]['rating']['broadcast_date'] != '':
                    released_year = int(data[cnt]['rating']['broadcast_date'].split('-')[0])
                else:
                    released_year = 0


                # 쿠팡의 경우 개봉일 및 방영일이 이 현지가 아니라 한국 최초 방영/개봉일 기준으로 되어 있습니다.
                # 따라서 released_year 데이터가 타사에 비해 다소 정확하지 않습니다.
                # TVSHOW는 시즌제이나 영화는 시즌이 기록되지 않습니다.
                # (시즌 정보가 있다 하더라도 '1'로만 표기되어 무의미하므로 기록에서 제외)
                seasons = int(data[cnt]['seasons'])
                total_episodes = []
                season_count = 1
                while True:
                    try:
                        time.sleep(random.uniform(0.1, 0.3))
                        epi_url = f'https://discover.coupangstreaming.com/v1/discover/titles/{id}/episodes?platform=WEBCLIENT&season={season_count}&sort=true&locale=ko&page=1&perPage=10'
                        test_epi = requests.get(epi_url)
                        html_doc = test_epi.text
                        result_epi = json.loads(html_doc)
                        #print(result_epi)
                        episodes_per_season = result_epi['pagination']['totalCount']
                        #print("title", title)
                        #print("season_count", season_count)
                        #print("epi per season", episodes_per_season)
                        total_episodes.append([season_count, episodes_per_season])
                        season_count += 1
                    except:
                        break
                

            elif data[cnt]['as'] == 'MOVIE':
                category = '영화'
                if data[cnt]['meta']['releaseYear']:
                    released_year = data[cnt]['meta']['releaseYear']
                else:
                    released_year = 0
                seasons = 0
                total_episodes = []
            
                

            country = []
                

            age_rating = data[cnt]['age_rating']
            poster_url = data[cnt]['images']['poster']['url']
 

            # 장르 정리
            genre = []
            genre_cnt = 0
            while True:
                try:
                    genre.append(data[cnt]['tags'][genre_cnt]['tag'])
                    genre_cnt += 1
                except:
                    break


            # 감독 및 배우 정보 정리
            director = []
            actors = []
            actor_cnt = 0
            while True:
                try:
                    if data[cnt]['people'][actor_cnt]['role'] == 'CAST':
                        actors.append(data[cnt]['people'][actor_cnt]['name'])
                    elif data[cnt]['people'][actor_cnt]['role'] == 'DIRECTOR':
                        director.append(data[cnt]['people'][actor_cnt]['name'])
                    actor_cnt += 1
                except:
                    break            
        
            
            # 기타 정보 정리
            runtime = int(data[cnt]['running_time']//60)
            summary = data[cnt]['description']
            short_desc = data[cnt]['short_description'].strip()
            rating = 0.0
            age_rating = data[cnt]['rating']['age']
            rating_levels = data[cnt]['rating']['levels']
            poster_url = data[cnt]['images']['poster']['url']
            
            content[id] = {
                "ott" : ott,
                "title" : title,
                "original_title" : original_title,
                "category" : category,
                "country" : country,
                "genre" : genre,
                "director" : director,
                "actors" : actors,
                "released_year" : released_year,
                "runtime" : runtime,
                "summary" : summary,
                "rating" : rating,
                "age_rating" : age_rating,
                "rating_levels" : rating_levels,
                "poster_url" : poster_url,
                "short_desc" : short_desc,
                "seasons" : seasons,
                "total_episodes" : total_episodes
            }
            
            cnt += 1

        except:
            break


    save_file_path = f'./data/data_{path}'

    with open(save_file_path, 'w') as outfile:
        json.dump(content, outfile, indent=4, ensure_ascii = False)
    
    print('wrote:',save_file_path)




