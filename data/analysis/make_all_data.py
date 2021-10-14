#%%
import os
import pickle

import pandas as pd
from bokeh.layouts import gridplot
from bokeh.models import ColumnDataSource, Label, LabelSet, Range1d
from bokeh.plotting import figure, output_file, show

#%%
# ott 월별 언급량 테스트

otts = ['netflix', 'watcha', 'tving', 'wavve', 'coupang']
ott_cnt = pd.DataFrame()

for ott in otts:
    ott_path = f'./{ott}/total_count/'
    file_list = os.listdir(ott_path)
    file_list.sort()

    # exclude hidden files
    file_list = [path for path in file_list if (path[0] != '.' and path[0] != '~')]

    # result = []
    result = pd.DataFrame(columns=['ott'])
    for path in file_list:
        for m in range(1, 13):
            try:
                file_path = ott_path+path
                temp = pd.read_excel(file_path, header=13)
                temp['날짜'] = pd.to_datetime(temp['날짜'])
                temp['yymm'] = temp['날짜'].apply(lambda x: x.strftime('%Y-%m')) 
                # print(temp.head())
                # print(temp.query('날짜.dt.month == 1'))
                total_count = temp['합계'].loc[temp['날짜'].dt.month == m].sum()
                yymm = temp['yymm'].loc[temp['날짜'].dt.month == m].iloc[0]
                # print(yymm, total_count)
                ott = ott
                result.loc[yymm] = [total_count]
                result.tail()
            except Exception as e:
                # print(e)
                break

    
    ott_cnt[f'{ott}_total'] = result['ott']

ott_cnt.index.name='date'



#%%
# 월별 ott 당 언급량, 해당 월의 키워드 가져오기
# 각 ott별 월별 최대 연관검색어 1개씩 추출
# 월별 1위 검색어 모으기

otts = ['netflix', 'watcha', 'tving', 'wavve', 'coupang']
otts_kr = ['넷플릭스', '왓챠', '티빙', '웨이브', '쿠팡플레이']

monthly_keys = pd.DataFrame()
# print(monthly_keys)

for ott in otts:
    ott_path = f'./{ott}/related_keywords/'
    file_list = os.listdir(ott_path)
    file_list.sort()

    # exclude hidden files
    file_list = [path for path in file_list if (path[0] != '.' and path[0] != '~')]

    result = pd.DataFrame(columns=[f'{ott}_key', f'{ott}_count'])
    
    for idx in range(33):
        path = file_list[idx]
        file_path = ott_path+path

        if (ott != 'coupang') or (ott == 'coupang' and idx >= 21) : 
            temp = pd.read_excel(file_path, header=13, nrows=1)           
            keyword = temp['연관어'].iloc[0] 
            count = temp['건수'].iloc[0] 
            temp_all = [keyword, count]
            result = result.append(pd.Series(temp_all, index=result.columns), ignore_index=True)

                
                # print(ott_cnt.index[idx])
        else :
            # date = ott_cnt.index[idx]
            temp_all = ["", 0]
            result = result.append(pd.Series(temp_all, index=result.columns), ignore_index=True)

       

    monthly_keys = pd.concat([monthly_keys, result], axis=1)




#%%
monthly_keys['date'] = ott_cnt.index

monthly_keys = monthly_keys.set_index('date')
print(monthly_keys.head())
print(monthly_keys.info())




#%%
# make all data
all_data = pd.concat([ott_cnt, monthly_keys], axis=1)
print(all_data.head())

# pickle data로 저장하기
with open ('all_key_count.pkl', 'wb') as save_file:
    pickle.dump(all_data, save_file)


#%%
