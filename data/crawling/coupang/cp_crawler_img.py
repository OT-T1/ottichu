import json
import os
import random
import time
from urllib.error import HTTPError
from urllib.request import urlopen

import pandas as pd
import pymysql
import requests

# 헤더 정보가 없으면 에러가 나는 경우가 있어서 미리 넣었습니다.
headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}



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

# 이 크롤러 파일과 같은 위치에 json 파일을 둡니다.
FILE_PATH = 'coupang_data_img.json'
with open(FILE_PATH, 'r') as json_file:
    raw_data = json.load(json_file)

ids = raw_data.keys()

error = dict()
# {id : imgurl} json file

# tving image query 
for id in ids:
    
    time.sleep(random.uniform(0.1, 0.3))
    title = raw_data[id]['title']
    content_code = contents['content_code'].loc[contents['title']==title]
    content_code = content_code.values[0]

    img_url = raw_data[id]['imgurl']

    # print(img_url)

    try:
        # img 폴더를 미리 만들어두세요.
        with urlopen(img_url) as f:
            with open ('./img/' + 'PK_' + f'{content_code}_' + 'C_' + f'{id}' + '.jpg', 'wb') as h:
                img = f.read()
                h.write(img)
        

    except Exception as e:
        print(e)
        print(id)
        error[id] = img_url



save_file_path = './coupang_error.json'
with open(save_file_path, 'w') as outfile:
    json.dump(error, outfile, indent=4, ensure_ascii = False)
    
print('wrote:',save_file_path)




