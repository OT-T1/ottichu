import re

import pandas as pd

# 이전 함수에서 받아와야 하는 데이터
# otts = get_ott_recommendation(result)


# 예시 
otts = {'netflix': 807, 'tving': 13766, 'watcha': 6159, 'wavve': 3901, 'coupang': 2615}

price_sheet = pd.read_excel('./price.xlsx')
price_sheet.drop(['devices', 'down_num', 'broadcasts'], axis=1, inplace=True)

otts = sorted(otts.items(), key=lambda x: x[1], reverse=True)
ott_rank = [ott[0] for ott in otts][:3]     # 상위 3개만 선별


# 프론트에서 넘어오는 정보
user = {
    'hope_price' : 10000,     # 희망 가격
    'with_people' : 2,     # 시청 인원
    'freetime' : 0     # 여가시간
}


# 더미 정보
hope_price = user['hope_price']
with_people = user['with_people']

target_price = hope_price // with_people

def get_best_price(target_price, monthly_fee):
    minimum_fee = max(monthly_fee)
    best_price = 0

    for fee in monthly_fee:
        cal = fee - target_price
        if cal < minimum_fee:
            minimum_fee = cal
            best_price = fee

    return best_price


def get_price_info(ott):
    this_sheet = price_sheet.loc[price_sheet['ott']==ott]
    monthly_fee = this_sheet['price'].tolist()
    best_price = get_best_price(target_price, monthly_fee)
    best_plan = str(this_sheet['plan'].loc[this_sheet['price'] == best_price].values)
    best_plan = re.sub(r'[\[\]\'\"]','',best_plan)
    best_resolution = str(this_sheet['resolution'].loc[this_sheet['price']==best_price].values)
    best_resolution = re.sub(r'[\[\]\'\"]','',best_resolution)
 

    price_info = {
        'plan' : best_plan,
        'price' : best_price,
        'resolution' : best_resolution,
    }

    return price_info


# 결과 예시
# tving {'plan': '베이직', 'price': 7900, 'resolution': 'HD(720p)'}
# watcha {'plan': '베이직', 'price': 7900, 'resolution': 'FHD(1080p)'}
# wavve {'plan': '베이직', 'price': 7900, 'resolution': 'HD(720p)'}

for ott in ott_rank:
    print(ott, get_price_info(ott))
