import json
import random
import sys
import time
from urllib.request import urlopen

import pandas as pd
import pymysql
import requests

# config.py 파일이 있는 절대경로를 지정해 주세요.
ABS_PATH = '/Users/jiyoonpark/Desktop/project2/api_test/server'
sys.path.append(ABS_PATH)
# print(sys.path)


ID = "input your ID"
PW = "input your PW"

url="http://tving.com"
data={
    "userId" : ID,
    "password" : PW,
    "returnUrl" : "https://www.tving.com/main.do?retRef=Y&amp;source=https://user.tving.com/"
}
  
#세션 만들기
session=requests.session()
response=session.post(url, data=data) #get,post,put 등 페이지의 요청을 모방한다
  
#로그인 실행
response.raise_for_status()
  
# print(response.text)
print(response.status_code)



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
FILE_PATH = 'tv_ott_dataset.json'
with open(FILE_PATH, 'r') as json_file:
    raw_data = json.load(json_file)

ids = raw_data.keys()

data = dict()
error = dict()
# {id : imgurl} json file

# tving image query 
for id in ids:
    # ID = 'P001502170', '
    time.sleep(random.uniform(0.1, 0.3))
    title = raw_data[id]['title']
    content_code = contents['content_code'].loc[contents['title']==title]
    content_code = content_code.values[0]

    if id.startswith('P'):
        img_url = f'https://image.tving.com/resize_cdn.php?u=https://image.tving.com/upload/cms/caip/CAIP0900/{id}.jpg&w=186'

    elif id.startswith('M'):
        img_url = f'https://image.tving.com/upload/cms/caim/CAIM2100/{id}.jpg/dims/resize'

    try:
        # img 폴더를 미리 만들어두세요.
        with urlopen(img_url) as f:
            with open ('./img/' + 'PK_' + f'{content_code}_' + 'T_' + f'{id}' + '.jpg', 'wb') as h:
                img = f.read()
                h.write(img)
        
        data[id] = img_url

   
    except Exception as e:
        if id.startswith('P'):
            img_url = f'https://image.tving.com/resize_cdn.php?u=https://image.tving.com/upload/cms/caip/CAIP0900/{id}.png&w=186'

        elif id.startswith('M'):
            img_url = f'https://image.tving.com/upload/cms/caim/CAIM2100/{id}.png/dims/resize'

        try:
            # img 폴더를 미리 만들어두세요.
            with urlopen(img_url) as f:
                with open ('./img/' + 'PK_' + f'{content_code}_' + 'T_' + f'{id}' + '.png', 'wb') as h:
                    img = f.read()
                    h.write(img)
            
            data[id] = img_url

        except Exception as e:
            print(e)
            print(id)
            error[id] = img_url


save_file_path = f'./tving_imgurl_sub.json'

with open(save_file_path, 'w') as outfile:
    json.dump(data, outfile, indent=4, ensure_ascii = False)
    
print('wrote:',save_file_path)


error_file_path = f'./tving_error_sub.json'
with open(error_file_path, 'w') as outfile:
    json.dump(error, outfile, indent=4, ensure_ascii = False)
    
print('wrote:',error_file_path)


