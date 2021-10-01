import time
import json
import requests

OTT_PROVIDERS = 'tving'
BASE_URL = 'https://api.tving.com'
HEADERS = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
}
MOVIE_URL = '/v2/media/movies'
TVSHOW_URL = '/v2/media/episodes'
QUERY_PARAMS = lambda x, y: {
  'pageNo': x,
  'pageSize': y,
  'order': 'viewDay',
  'free': 'all',
  'adult': 'all',
  'guest': 'all',
  'scope': 'all',
  'lastFrequency': 'y',
  'personal': 'N',
  'screenCode': 'CSSD0100',
  'networkCode': 'CSND0900',
  'osCode': 'CSOD0900',
  'teleCode': 'CSCD0900',
  'apiKey': '1e7952d0917d6aab1f0293a063697610'
}

RETRY_CNT = 3
RETRY_DELAY = 3

REQUIRED_DATA = {
  # TV Show
  'name',
  'category1_name',
  'category2_name',
  'product_year',
  'product_country',
  'production',
  'director',
  'actor',
  'synopsis',
  'story',
  'adult_yn',
  'fan_yn',
  # Movie
  'free_yn',
  'original_cp',
  'price',
  'hd_yn',
  'quality',
  'rating',
  'story',
  'diversity_yn',
  'non_drm_yn',
  'tving_original_yn',
  'tving_exclusive_yn',
  'billing_package_tag',
  'drm_4k_yn',
  'hdr_type'
}

# movie , max_page_size = 451, pages = 8, total_cnt = 3608
# tv program, max_page_size = 451, pages = 8, total_cnt = 2255

class TVCrawler:
  def __init__(self, base_url):
    self.base = base_url
    self.url = ''
    self.params = None
    self.contents_cnt = 0
    self.collected_data = {}
    self.err_list = []
    self.end_log = []
    self.eof = False

  def get_data(self):
    return self.collected_data
  
  def get_data_cnt(self):
    return len(self.collected_data.keys())
  
  def set_url(self, remainder, page_no=1, page_size=451):
    self.url = self.base + remainder
    self.params = QUERY_PARAMS(page_no, page_size)
    return self
  
  def clear_eof(self):
    self.eof = False

  def __request_contents_data(self, try_cnt):
    response = requests.get(self.url, headers=HEADERS, params=self.params)
    if response.status_code != 200:
      if try_cnt == RETRY_CNT:
        self.err_list.append((self.url, self.params, response.status_code))
        return {'res': None, 'err': response.status_code}
      time.sleep(RETRY_DELAY)
      return self.__request_contents_data(try_cnt + 1)
    
    to_dict = json.loads(response.text, encoding='utf-8')
    if to_dict['header']['status'] != 200:
      self.eof = True
      self.end_log.append((self.url, self.params, to_dict['header']['status']))
      return {'res': None, 'err': False}
    return {'res': to_dict['body']['result'], 'err': False}

  def get_contents_data(self):
    reponse = self.__request_contents_data(RETRY_CNT)['res']
    if not reponse:
      return self
    
    self.contents_cnt += len(reponse)
    for content in reponse:
      for ctgry, data in content.items():
        if ctgry not in { 'program', 'movie' } or not data:
          continue
        self.collected_data[data['code']] = {}
        for item, value in data.items():
          if item in REQUIRED_DATA:
            self.collected_data[data['code']][item] = value
    return self

  def print_collected_data(self):
    if not self.collected_data:
      return
    for item, value in self.collected_data.items():
      print(item, value)

  def print_error(self):
    if not self.err_list:
      return
    for url, prms, err,  in self.err_list:
      print(f'{err}: {url} / {prms}')


# Define dataset creaction function
def create_dataset(type, data):
    if type == 'csv':
      pass
    elif type == 'json':
      with open('tv_ott_dataset.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent='\t')
    print(f'tv_ott_dataset.{type}파일 생성완료')



if __name__ == '__main__':
  crawler = TVCrawler(BASE_URL)
  try:
    for category in ['episodes', 'movies']:
      for i in range(1, 9):
        crawler \
          .set_url(f'/v2/media/{category}', i) \
          .get_contents_data() \
          .print_error() \
          # .print_collected_data()
        if crawler.eof:
          crawler.clear_eof()
    else:
      print(f'전체 데이터 개수: {crawler.get_data_cnt()}')
      create_dataset('json', crawler.get_data())
  except Exception as e:
    print(f'"Error Message": {e}')