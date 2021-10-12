# 데이터 합치기

import json
import os
import pickle

import pandas as pd

data_path = './data/'
file_list = os.listdir(data_path)

# exclude hidden files
file_list = [path for path in file_list if path[0] != '.'] 
file_list.sort()


lists = [[]*i for i in range(24)]
id, title, original_title, director, actors, summary, country, category, genre, runtime, rating, is_netflix, is_tving, is_wavve, is_watcha, is_coopang, released_year, age_rating, rating_levels, poster_url, short_desc, seasons, total_episodes, ott = lists


for path in file_list:
    file_path = data_path+path
    
    with open(file_path, 'r') as json_file:
        raw_data = json.load(json_file)


    for key in raw_data.keys():
        id.append(key)
        title.append(raw_data[key]['title'])
        director.append(raw_data[key]['director'])
        actors.append(raw_data[key]['actors'])
        summary.append(raw_data[key]['summary'])
        country.append(raw_data[key]['country'])
        category.append(raw_data[key]['category'])
        temp_genre = []
        for g in raw_data[key]['genre']:
            temp_genre.append(g.replace('\xa0','').replace('romance','로맨스'))
        #genre.append(raw_data[key]['genre'])
        genre.append(temp_genre)
        runtime.append(raw_data[key]['runtime'])
        rating.append(raw_data[key]['rating'])
        poster_url.append(raw_data[key]['poster_url']) # added 210112 THU
        is_netflix.append(0)
        is_tving.append(0)
        is_wavve.append(0)
        is_watcha.append(0)
        is_coopang.append(1)
        ott.append(raw_data[key]['ott'])
        

    print("done:", path)



df = pd.DataFrame({
    "id" : id,
    "title" : title,
    "director" : director,
    "actors" : actors,
    "summary" : summary,
    "country" : country,
    "category" : category,
    "genre" : genre,
    "runtime" : runtime,
    "rating" : rating,
    "ott" : ott,
    "imgurl" : poster_url,
    "is_netflix" : is_netflix,
    "is_tving" : is_tving,
    "is_wavve" : is_wavve,
    "is_watcha" : is_watcha,
    "is_coopang" : is_coopang
})
    

# pickle : 파이썬 객체 구조를 그대로 저장할 수 있어서 csv형보다 사용하기 편리할 것으로 생각
# 현재 중간 단계 데이터 전처리 중이므로 최종 csv 파일 이전 처리에는 pickle이 용이

f = open("test_img.pkl", "wb")
pickle.dump(df, f)
f.close()    
print(df.info())


# f2 = open("test.pkl", "rb")
# temp = pickle.load(f2)
# print(temp)
# print(type(temp))
