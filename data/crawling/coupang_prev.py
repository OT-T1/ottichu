import requests
import json
import time
import random

# 헤더 정보가 없으면 에러가 나는 경우가 있어서 미리 넣었습니다.
headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}



# BeautifulSoup 기본 준비 사항

result = []
i = 1

        
result = dict()

# PATH부분의 주소가 국가+장르마다 바뀌는데, 이것까지는 크롤링으로 구현하지 못해서
# 일단은 일일이 PATH를 알아내서 바꿔가며 작업했습니다.
# 포스트맨과 병행하여 링크를 수집했습니다. 
# 아래 링크는 '한국 웹 드라마'에 해당하는 영상 정보를 크롤링하는 코드입니다.

for i in range(1, 7):
    try:
        PATH = f"https://discover.coupangstreaming.com/v1/discover/collections/0f6ba57f-0dd2-4bef-9ab3-1ec683b1b427/titles?platform=WEBCLIENT&page={i}&perPage=1"

        
        r = requests.get(PATH, headers=headers)
        html_doc = r.text
        #print(html_doc)
        c = json.loads(html_doc)['data'][0]

        tag_count = 0
        tags = []
        while True:
            try:
                tags.append(c['tags'][tag_count]['tag'])
                tag_count += 1
            except:
                break
        
        temp = {
            "id" : c['id'],
            "title" : c['title'],
            "as" : c['as'], # MOVIE or TV SHOW
            "region" : c['region'],
            "age_rating" : c['age_rating'],
            "image_link" : c['images']['poster']['url'],
            "tags" : tags,
            "seasons" : c['seasons'],
            "released_year" : c['meta']['releaseYear'],
            "rating" : c['rating']['age'],
            "rating_levels" : c['rating']['levels'],
            "kmrb" : c['rating']['category'],
            "classification_number" : c['rating']['classification_number'],
            "running_time" : c['running_time'],
            "languages" : c['languages']
        }

        result[i] = temp
    except:
        pass
    time.sleep(random.uniform(0.1, 0.3))


file_path = './coupang_tv_web_drama.json'

# 파일 작성용
with open(file_path, 'w') as outfile:
    json.dump(result, outfile, indent=4, ensure_ascii = False)

