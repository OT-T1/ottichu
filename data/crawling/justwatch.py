import requests
from bs4 import BeautifulSoup


def get_ott(PATH):
    # 헤더 정보가 없으면 에러가 나는 경우가 있어서 미리 넣었습니다.
    headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}

    # BeautifulSoup 기본 준비 사항
    r = requests.get(PATH, headers=headers)
    html_doc = r.text
    soup = BeautifulSoup(html_doc, 'html.parser')

    # 현재 몇 군데에서 ott 서비스를 하는지 모르니, 데이터가 존재하는 만큼 긁어옵니다.
    # just watch에서는 스트리밍 / 대여 / 구매로 div가 나뉘어 있어서 두 군데에서 제공하는 정보를 모두 긁어옵니다.
    # 데이터 구조 : {영화/TV 쇼 제목 : {ott 서비스명: 시청 가능한 링크}}

    # selector 설명
    # 1) 스트리밍
    streaming = '#app > div.content > div.jw-info-box > div > div.col-sm-8 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div.price-comparison__grid__row.price-comparison__grid__row--stream'
    # 2) 대여
    rent = '#app > div.content > div.jw-info-box > div > div.col-sm-8 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div.price-comparison__grid__row.price-comparison__grid__row--rent'
    # 3) 구매
    buy = '#app > div.content > div.jw-info-box > div > div.col-sm-8 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div.price-comparison__grid__row.price-comparison__grid__row--buy'

    selectors = [streaming, rent, buy]
    selectors_text = ['streaming', 'rent', 'buy']
    result = dict()
    for idx, s in enumerate(selectors):
        i = 1
        temp = dict()
        while True:
            try:
                soup_ott_title = soup.select_one(f'{s} > div.price-comparison__grid__row__holder > div:nth-child({i}) > div > a > img')['title']
                soup_ott_raw_link = soup.select_one(f'{s} > div.price-comparison__grid__row__holder > div:nth-child({i}) > div > a')['href']
                soup_ott_link = soup_ott_raw_link.replace('https://click.justwatch.com/a?r=', '').split('&cx=ey')[0].replace('%2F', '/').replace('%3D', '=').replace('%3F', '?').replace('%3A', ':')
                temp[soup_ott_title] = soup_ott_link
                i += 1
            except:
                break
        result[selectors_text[idx]] = temp
    
    name = soup.select_one('#app > div.content > div.jw-info-box > div > div.col-sm-8 > div:nth-child(2) > div:nth-child(1) > div > div.title-block > div > h1').text.strip()
    

    return result, name

