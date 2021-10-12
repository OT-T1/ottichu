# 데이터 중복 제거하기

import json
import pickle

open_file = open("test_img.pkl", "rb")
df = pickle.load(open_file)

print(df.head())
df_processed = df.drop_duplicates(subset=['title'])
print(df_processed.info())

js = df_processed.to_json(orient='index', force_ascii=False)
js_js = json.loads(js)

save_file_path = f'./coupang_data_img.json'

with open(save_file_path, 'w') as outfile:
    json.dump(js_js, outfile, indent=4, ensure_ascii = False)
    
print('done:',save_file_path)
