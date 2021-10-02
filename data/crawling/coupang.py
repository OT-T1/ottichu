import json

file_path = './coupang/tv.json'
with open(file_path, 'r') as json_file:
    json_data = json.load(json_file)
    
data = json_data['pageProps']['initialFeedData'][1]['data']

# 한국 드라마만 현재 긁어오는 코드입니다. 전체를 크롤링하는 코드는 정리중입니다.
temp = []

count = 0
while True:
    try:
        # 0) ott
        ott = 'coupang'
        # 0) country
        country = '한국'
        # 1) title
        title = data[6]['data'][count]['title']
        original_title = ""
        # 2) description - overview
        desc = data[6]['data'][count]['description']
        # 3) TVSHOW or MOVIE or ...
        category = data[6]['data'][count]['as']
        # 4) genre
        tag_count = 0
        genre = []
        i = 0
        while True:
            try:
                genre.append(data[6]['data'][count]['tags'][i]['tag'])
                i += 1
            except:
                break
        # 5) actors
        actors = []
        j=0
        while True:
            try:
                actors.append(data[6]['data'][count]['people'][j]['name'])
                j += 1 
            except:
                break
        # 6) seasons
        seasons = data[6]['data'][count]['seasons']
        # 7) released_year
        released_year = data[6]['data'][count]['meta']['releaseYear']
        # 8) age_rating
        age_rating = data[6]['data'][count]['age_rating']
        # 9) rating_meta
        rating_meta = data[6]['data'][count]['meta']['rating_levels']
        # 10) kmrb
        kmrb = ""
        # 11) classification_number
        classification_number = ""
        # 12) running_time(sec)
        running_time = data[6]['data'][count]['running_time']

        poster_url = data[6]['data'][count]['images']['poster']['url']

        temp.append([ott, category, country, genre, title, original_title, actors, released_year, running_time, seasons, desc, age_rating, rating_meta, poster_url])

        count += 1
    except:
        break


# print(title)
# print(desc)
# print(category)
# print(genre)
# print(actors)
# print(released_year)
# print(age_rating)
# print(rating_meta)
# print(running_time)

print(temp[0:3])
print(len(temp))
