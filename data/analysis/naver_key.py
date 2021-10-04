from selenium import webdriver
import time
import pandas as pd

driver = webdriver.Chrome()

final = {}

# 연관검색어를 찾을 검색어 리스트(쿼리 리스트)
keyword_list = ['넷플릭스', '왓챠', '티빙', '웨이브', '쿠팡플레이']

for i in range(len(keyword_list)):
    URL = "https://search.naver.com/search.naver?ie=UTF-8&sm=whl_hty&query={}".format(keyword_list[i])
    driver.get(URL)
    driver.implicitly_wait(3)

    searches = driver.find_elements_by_css_selector(".lst_related_srch li")

    temp = []

    for keyword in searches:
        result = keyword.text
        temp.append(result)

    final[keyword_list[i]] = pd.Series(temp)

df = pd.DataFrame(final)

df.to_csv('naver_key.csv', encoding='utf-8-sig')

driver.quit()