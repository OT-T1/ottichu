import time
import json
import requests

OTT_PROVIDERS = ['nfx', 'wav', 'wac']
START_YEAR = 1916
END_YEAR = 2021
YEAR_CNT = 0

RETRY_CNT = 3
RETRY_DELAY = 3

BASE_URL = 'https://apis.justwatch.com/content/titles'
HEADERS = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
}
REQUEST_TYPE = {
  'contents_summary': 0,
  'content_detail': 1
}
CONTENTS_SUMMARY_URL = '/ko_KR/popular'
CONTENT_DETAIL_URL = lambda ctgry, id: f'{ctgry}/{id}/locale/ko_KR?language=ko'

ESSENTIAL_ITEMS = {
  'fields',
  'page',
  'page_size'
  #'enable_provider_filter':false,
  #'is_upcoming':false,
  #'matching_offers_only':true
}
DEFAULT_FIELDS = '["id","localized_release_date","object_type","poster","scoring","title","tmdb_popularity","production_countries","offers","original_release_year"]'
VALID_PARAMS = {
  'fields',
  'content_types',
  'providers',
  'release_year_from',
  'release_year_until',
  'enable_provider_filter',
  'is_upcoming',
  'monetization_types',
  'page',
  'page_size',
  'matching_offers_only'
}
VALID_FIELDS = {
  'id',
  'localized_release_date',
  'object_type',
  'poster',
  'scoring',
  'title',
  'tmdb_popularity',
  'production_countries',
  'offers',
  'original_release_year',
}
VALID_PROVIDERS = {
  'nfx',
  'wav',
  'wac',
  # ... 추가 가능
}
VALID_CONTENT_TYPE = { 'movie', 'show' }
ON_OFF_ITEM = {
  'enable_provider_filter',
  'is_upcoming',
  'matching_offers_only',
}

REQUIRED_DATA = {
  'id',
  'title',
  'original_title',
  'original_release_year',
  'tmdb_popularity',
  'object_type',
  'offers',
  'scoring',
  'production_countries',
  'short_description',
  'credits',
  'genre_ids',
  'runtime',
  'production_countries',  
}


class JWCrawler:
  def __init__(self, base_url):
    self.base = base_url
    self.url = ''
    self.total_pages = 21
    self.contents_cnt = 0
    self.collected_data = {}
    self.err_list = []

  def init_total_pages(self):
    self.total_pages = 21
    
  def get_data(self):
    return self.collected_data
  
  def get_data_cnt(self):
    return len(self.collected_data.keys())

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
    self.set_url(f'/{category}/{id}/locale/ko_KR?language=ko')
    response = self.__request_ott_data(1)['res']
    if not response:
      return {}
    return json.loads(response, encoding='utf-8')
    

  def get_ott_data(self):
    response = self.__request_ott_data(1)['res']
    if not response:
      return self
    to_dict = json.loads(response, encoding='utf-8')
    self.total_pages = to_dict['total_pages'] if to_dict['items'] else 21
    self.contents_cnt += len(to_dict['items'])

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
      for item, value in content.items():
        if item in REQUIRED_DATA:
          self.collected_data[id][item] = value
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
            .print_error() \
            # .print_collected_data()
        crawler.init_total_pages()
    else:
      print(f'전체 데이터 개수: {crawler.get_data_cnt()}')
      create_dataset('json', crawler.get_data())
  except Exception as e:
    print(f'"Error Message": {e}')