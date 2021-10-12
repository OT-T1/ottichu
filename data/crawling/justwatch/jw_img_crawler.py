import json
import random
import time
from urllib.request import urlopen

import pandas as pd
import pymysql
import requests


# DB 연결
def connect_db():
    try:
        conn = pymysql.connect(
            user = "admin",
            passwd = "1q2w3e4r!",
            host =  "ott-service-project.cbmthuyhcguk.ap-northeast-2.rds.amazonaws.com",
            port = 3306,
            database = "ott-service",
            charset='utf8'
        )
        # cur = conn.cursor()
        return conn

    except Exception as e:
        return print(e)



# CONNECT DB
db = connect_db()


# 전체 데이터 받아놓기 
SHOW_CONTENTS = "SELECT * FROM contents"
contents = pd.read_sql(SHOW_CONTENTS, db)


# 헤더 정보가 없으면 에러가 나는 경우가 있어서 미리 넣었습니다.
# 윈도우의 경우 여기서 에러가 난다면 자신의 헤더 정보로 바꿔주세요.
headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}


# 이 크롤러 파일과 같은 위치에 json 파일을 둡니다.
FILE_PATH = 'jw_ott_dataset.json'
with open(FILE_PATH, 'r') as json_file:
    raw_data = json.load(json_file)

ids = raw_data.keys()


data = dict()
error = dict()

# Just Watch image query 
for id in ids:
    
    try:

        if raw_data[id]['category'] == 'TV 프로그램' : 
            ctgr = 'show'
        elif raw_data[id]['category'] == '영화':
            ctgr = 'movie'

        BASE_URL = f'https://apis.justwatch.com/content/titles/{ctgr}/{id}/locale/ko_KR?language=ko'

        
        
        try:
            time.sleep(random.uniform(0.1, 0.3))
            raw_text = requests.get(BASE_URL)
            raw_json = raw_text.json()
            img_id = raw_json['poster'].split('/')[2]

            img_url = f'https://images.justwatch.com/poster/{img_id}/s332'


            # img 폴더를 미리 만들어두세요.
            with urlopen(img_url) as f:
                with open ('./img/' + 'J_' + f'{id}' + '.jpg', 'wb') as h:
                    img = f.read()
                    h.write(img)
            
            data[id] = img_url

        except Exception as e:
            # 에러가 나서 다운로드가 끊겼다면 에러 메시지를 보시고 끊긴 지점을 알려주세요.
            print(id)
            print(e)
            error[id] = BASE_URL
    

    except Exception as e:
        print(e)


save_file_path = f'./jw_imgurl.json'

with open(save_file_path, 'w') as outfile:
    json.dump(data, outfile, indent=4, ensure_ascii = False)
    
print('wrote:',save_file_path)


error_file_path = f'./jw_error.json'
with open(error_file_path, 'w') as outfile:
    json.dump(error, outfile, indent=4, ensure_ascii = False)
    
print('wrote:',error_file_path)
