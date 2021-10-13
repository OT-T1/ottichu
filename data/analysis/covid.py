import calendar

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs

BASE_URL = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson'


covid = dict()

for year in range(2020, 2022):
    for i in range(1, 13):
        try:
            day = calendar.monthrange(2020,i)[1]

            if i < 10:
                month = '0' + str(i)
            else:
                month = i
            
            # print(f'{year}{month}{day}')
            params = {
                'serviceKey' : 'u2xo85lXY+2OP2cnX4RowDqus5CE66Oq5FHL6uU4Z4TJJ4V+C7AY00OUV3colE7ZrHTW8b8BboMaJd1Aftonug==',
                'pageNo' : 1,
                'numOfRows' : day,
                'startCreateDt' : f'{year}{month}01',
                'endCreateDt' : f'{year}{month}{day}'
            }

            r = requests.get(BASE_URL, params = params)
            soup = bs(r.text, 'lxml')

            items = soup.find_all('item')
            
            nums = items[0].find('decidecnt').string
            # print(year, month, 'decidecnt: ', nums)
            
            time = f'{year}{month}'
            covid[time] = nums

            

        except Exception as e:
            print(e)



result = pd.DataFrame(list(covid.items()), columns=['time', 'total'])



covid_monthly = dict()
monthly_nums = []
for idx, nums in enumerate(result['total']):
    if idx == 0 :
        monthly_nums.append(int(nums))
        # print(nums)
    else:
        prev = int(result['total'].iloc[idx-1])
        curr = int(nums)
        val = curr - prev
        # print(val)
        monthly_nums.append(val)


result['monthly'] = monthly_nums

result = result[:21] # until 2021_09

result.to_csv('covid_monthly_202001_202109.csv')

