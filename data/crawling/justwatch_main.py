# -*- coding: utf-8 -*-

from selenium import webdriver
import time
import justwatch
import csv
import pickle

driver = webdriver.Chrome(executable_path = r'/usr/local/bin/chromedriver')

YEAR = 2021
while YEAR > 1899:
    PAUSE_TIME = 1
    MAIN_URL = f'https://www.justwatch.com/kr/%EC%98%81%ED%99%94?release_year_from={YEAR-1}&release_year_until={YEAR}'
    driver.implicitly_wait(5)
    driver.get(MAIN_URL)


    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        # Scroll down to bottom                                     
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        # Wait to load page
        time.sleep(PAUSE_TIME)                                      
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight-50);")
        time.sleep(PAUSE_TIME)
        
        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")

        if new_height == last_height:                  
            break

        last_height = new_height



    result = []
    i = 1
    while True:
        try:
            url  = driver.find_elements_by_xpath(f'//*[@id="base"]/div[3]/div/div/div[2]/div[1]/div/div[{i}]/a')[0].get_attribute('href')
            #print(url)
            result.append(url)
            i += 1
        except:
            break

    # Write Text File - links
    file_path = f'./{YEAR}_link.txt'
    with open(file_path, 'wb') as txtfile:
        pickle.dump(result, txtfile)
    
    YEAR -= 1



driver.quit()
# with open(file_path, 'rb') as links:
#     readLink = pickle.load(links)
#     print(readLink)
    
# print(result)

# https://dev-dain.tistory.com/91
# 어떤 홈페이지 타겟으로 크롤링을 하실 때는 반드시 해당 홈페이지의 robots.txt를 확인하고, 
# user-agent *에서 allow가 되어 있는 부분만 크롤링하도록 합시다. 
# 아직은 권고 사항 정도라서 큰 효력을 갖지는 않고, 
# 학습 용도라면 크롤링을 눈 감아주는 분위기지만 너무 어뷰징해서 트래픽 폭주하면 문제의 소지가 될 수 있습니다.






