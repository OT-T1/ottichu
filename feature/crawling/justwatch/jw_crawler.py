import re
import time
import json
import requests
from constants import \
  BASE_URL, \
  HEADERS, \
  CONTENTS_SUMMARY_URL, \
  CONTENT_DETAIL_URL, \
  ESSENTIAL_ITEMS, \
  DEFAULT_FIELDS, \
  VALID_PARAMS, \
  VALID_FIELDS, \
  VALID_PROVIDERS, \
  VALID_CONTENT_TYPE, \
  REQUIRED_LIST, \
  ON_OFF_ITEM, \
  OTT_NAME, \
  OTT_TYPE, \
  GENRE_CODE, \
  COUNTRY
from collections import defaultdict

OTT_PROVIDERS = ['nfx', 'wav', 'wac']
START_YEAR = 1916
END_YEAR = 2021
YEAR_CNT = 0

RETRY_CNT = 3
RETRY_DELAY = 3


class JWCrawler:
  def __init__(self, base_url):
    self.base = base_url
    self.url = ''
    self.total_pages = 21
    self.contents_cnt = 0
    self.actual_cnt = 0
    self.collected_data = {}
    self.err_list = []
    self.country = set()

  def init_total_pages(self):
    self.total_pages = 21
    
  def clear_collection(self):
    self.collected_data = {}
    
  def get_data(self):
    return self.collected_data
  
  def get_data_cnt(self):
    return self.actual_cnt

  def __parse_item(self, values, valid_values):
    result = ''
    for value in values:
      if value in valid_values:
        result += f'"{value}",'
    return f'[{result[:-1]}]'
  
  
  def __add_query(self, params={}):
    if not params:
      return ''
    
    query = ''
    missing_items = ESSENTIAL_ITEMS - set(params.keys())
    if missing_items:
      for item in missing_items:
        query += f'"{item}":'
        if item == 'fields':
          query += DEFAULT_FIELDS
        elif item == 'page':
          query += '1'
        elif item == 'page_size':
          query += '100'
        query += ','

    for item, values in params.items():
      if item not in VALID_PARAMS:
        continue
      query += f'"{item}":'
      if item == 'fields':
        query += self.__parse_item(values, VALID_FIELDS)
      elif item == 'providers':
        query += self.__parse_item(values, VALID_PROVIDERS)
      elif item == 'content_types':
        query += self.__parse_item(values, VALID_CONTENT_TYPE)
      elif item == 'monetization_types':
        query += self.__parse_item(values, set())
      elif item in ON_OFF_ITEM:
        query += 'true' if values else 'false'
      else:
        query += str(values)
      query += ','
    return f'?body={{{query[:-1]}}}&language=ko'
  
  
  def set_url(self, remainder, params={}):
    self.url = self.base + remainder + self.__add_query(params)
    return self

  def __request_ott_data(self, try_cnt):
    response = requests.get(self.url, headers=HEADERS)
    if response.status_code != 200:
        if try_cnt == RETRY_CNT:
          self.err_list.append((self.url, response.status_code))
          return {'res': None, 'err': response.status_code}
        time.sleep(RETRY_DELAY)
        return self.__request_ott_data(try_cnt + 1)
    return {'res': response.text, 'err': False}
  
  def __get_content_data(self, id, category):
    self.set_url(CONTENT_DETAIL_URL(category, id))
    response = self.__request_ott_data(1)['res']
    if not response:
      return {}
    return json.loads(response, encoding='utf-8')
  
  def __put_content_data(self, content):
    if not content:
      return
    
    items = {}
    exist = set(content.keys())
    for item in REQUIRED_LIST:
      items[item] = content[item] if item in exist else ''
      if item == 'object_type' and items['object_type']:
        items['object_type'] = ['TV 프로그램', '영화'][items['object_type'] == 'movie']

    otts = defaultdict(set)
    for ofr in items['offers']:
      if ofr['provider_id'] in OTT_NAME:
        otts[OTT_NAME[ofr['provider_id']]] \
          .add(OTT_TYPE[ofr['monetization_type']])
    
    # 딥버깅
    for cntry in items['production_countries']:
      self.country.add(cntry)

    directors, actors = [], []
    for person in items['credits']:
      if person['role'] == 'DIRECTOR':
        directors.append(person['name'])
      elif person['role'] == 'ACTOR':
        actors.append(person['name'])

    calc_avg = lambda x: round(sum(x) / len(x), 1) if x else float(0)
    get_scores = lambda scores: [scr['value'] for scr in scores if scr['provider_type'].endswith(':score')]

    # show movie
    template_data = {
      'ott': {name : list(mtype) for name, mtype in otts.items()},
      'title': items['title'],
      'original_title': items['original_title'],
      'category': items['object_type'],
      'country': [COUNTRY[cntry] for cntry in items['production_countries'] if cntry in COUNTRY],
      'genre': [GENRE_CODE[id] for id in items['genre_ids']],
      'director': directors,
      'actors': actors,
      'released_year': items['original_release_year'],
      'runtime': items['runtime'],
      'summary': re.sub('\r|\n', '', items['short_description']),
      'rating': calc_avg(get_scores(items['scoring'])),
      # 'rating_meta':,
      # 'poster_url':,
    }
    self.collected_data[content['id']] = template_data
    self.actual_cnt += 1


  def get_ott_data(self):
    response = self.__request_ott_data(1)['res']
    if not response:
      return self
    to_dict = json.loads(response, encoding='utf-8')
    self.total_pages = to_dict['total_pages'] if to_dict['items'] else self.total_pages
    self.contents_cnt += len(to_dict['items'])
    # print(len(to_dict['items']), self.contents_cnt) # 디버깅

    # Get content list
    ids = {}
    for content in to_dict['items']:
      self.collected_data[content['id']] = {}
      ids[content['id']] = content['object_type']
      for item, value in content.items():
        if item == 'tmdb_popularity':
          self.collected_data[content['id']][item] = value

    # Get detail data of content
    for id, ctgry in ids.items():
      content = self.__get_content_data(id, ctgry)
      self.__put_content_data(content)
    return self
  
  def print_collected_data(self):
    if not self.collected_data:
      return
    for item, value in self.collected_data.items():
      print(item, value)
  
  def print_error(self):
    if not self.err_list:
      return
    for url, err in self.err_list:
      print(f'{err}: {url}')


# Define year for url query setting function
def set_year_filter(start, end, include_cnt):
  from_year, to_year = [], []
  if not YEAR_CNT:
    after_2000 = list(range(2001, end + 1))
    from_year, to_year = [start] + after_2000, [2000] + after_2000
  elif YEAR_CNT == 1:
    years = range(start, end + 1, include_cnt)
    from_year, to_year = years, years
  elif YEAR_CNT > 1:
    from_year = range(start, end + 1, include_cnt)
    to_year = range(start + 1, end + 2, include_cnt)
  return zip(from_year, to_year)


# Define dataset creaction function
def create_dataset(type, data):
    if type == 'csv':
      pass
    elif type == 'json':
      with open('jw_ott_dataset.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent='\t')
    print(f'jw_ott_dataset.{type}파일 생성완료')



if __name__ == '__main__':
  crawler = JWCrawler(BASE_URL)
  try:
    for start, end in set_year_filter(START_YEAR, END_YEAR, YEAR_CNT):
      print("개봉 연도:", start, end)
      for category in ['movie', 'show']:
        for i in range(1, 21):
          if i > crawler.total_pages:
            break
          crawler \
            .set_url(CONTENTS_SUMMARY_URL, {
              'page': i,
              # 'page_size': 1,
              'content_types': {category},
              'providers': OTT_PROVIDERS,
              'release_year_from': start,
              'release_year_until': end
            }) \
            .get_ott_data() \
            # .print_error() \
            # .print_collected_data()
        crawler.init_total_pages()
    else:
      print(f'전체 국가 코드: {crawler.country}')
      print(f'전체 데이터 개수: {crawler.get_data_cnt()}')
      print(f'에러 개수: {len(crawler.err_list)}')
      print(f'에러 목록: {crawler.err_list}')
      create_dataset('json', crawler.get_data())
  except Exception as e:
    print(f'"Error Message": {e}')