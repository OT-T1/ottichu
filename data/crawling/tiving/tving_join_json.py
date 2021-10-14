import json

imgurl_path = f'./tving_imgurl.json'
with open(imgurl_path, 'r', encoding="UTF-8") as i:
    imgurl = json.load(i)

whole_path = f'./tv_ott_dataset.json'
with open(whole_path, 'r') as w:
    whole = json.load(w)

i = 0
for key in whole.keys():
    try:
        whole[key]['imgurl'] = imgurl[key]
    except Exception as e:
        print(e)
        i += 1
        print(i)
        whole[key]['imgurl'] = ''


with open(whole_path, 'w') as outfile:
     result = json.dump(whole, outfile, indent=4, ensure_ascii = False)

