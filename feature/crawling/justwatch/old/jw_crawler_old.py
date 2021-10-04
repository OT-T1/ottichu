import re
import time
import copy
import urllib
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from collections import defaultdict

# Define CONSTANTS
DEBUG_WEB = False
DEBUG_CNT = False
DEBUG_ERR = True
WEBDRIVER_PATH = 'chromedriver.exe'
SCROLL_DELAY = 2
LAST_CHECK_DELAY = 5

WEB_BROWSER = 'chrome'
BASE_URL = 'https://www.justwatch.com'
HEADERS = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
}
START_YEAR = 1916
END_YEAR = 2021
# 검색에 포함할 개봉 연도 수(default: 0 => start ~ 2000까지 수집 후 2001년부터는 당해년도만 수집)
YEAR_CNT = 0

# 'rent': {
#   ott_type: {
#     'price':,
#     'quality':,
#   }
# }

RESULT_TEMPLATE = {
  'title': {},
  'category': '',
  'genre': '',
  'film_rating': '',
  'director': '',
  'actors': '',
  'ott': {
    'streaming': {},
    'rent': {},
    'buy': {}
  },
  'runtime': -1,
  'overview': '',
  'release_year': -1,
  'rating': {
    'justWatch': '',
    'IMDB': {}
  }
}


def set_backgound_mode(options):
  options.add_argument('headless')
  return options

# Define Init Driver
def init_driver(browser):
  if browser == 'chrome':
    options = set_backgound_mode(webdriver.ChromeOptions()) if not DEBUG_WEB else None
    return webdriver.Chrome(WEBDRIVER_PATH, options=options)
  # TODO: 크롬 외엔 테스트해보지 않음...
  elif browser == 'firefox':
    options = set_backgound_mode(webdriver.FirefoxOptions()) if not DEBUG_WEB else None
    return webdriver.Firefox(WEBDRIVER_PATH, options=options)
  elif browser == 'safari':
    pass
  elif browser == 'edge':
    pass
  return None


# Define Crawler
class Crawler:
  def __init__(self, driver):
    self.driver = driver
    self.driver.maximize_window() # 브라우저 창 최대로
    self.location = ''
    self.category = ''
    self.collected_data = defaultdict(dict)
    self.err_list = []
    self.contents_cnt = 0
  
  # TODO: 뭔가 에러가 나오는 것 같은데... 좀 알아봐야할 듯
  # def __del__(self):
  #   if not self.driver:
  #     return
  #   self.driver.quit()
  
  # TODO: getter, setter로 변경하면 좋을 듯...
  def get_data(self):
    return self.collected_data
  
  def set_location(self, location):
    self.location = location
    return self
  
  
  def set_category(self, category):
    self.category = category
    return self
  
  
  def get_html_soup(self, base, rest='', params=dict()):
    if type(params) != type(dict()):
      return
    try:
      url = base + rest
      response = requests.get(url, headers=HEADERS, params=params)
      if response.status_code != 200:
        raise Exception({'res': None, 'err': response.status_code})
      return {'res': response.text, 'err': False}
    except Exception as e:
      return {'res': None, 'err': e}

  
  def get_html_driver(self, base, params=dict()):
    if type(params) != type(dict()):
      return

    query = '?'
    for param, value in params.items():
      query += f'{param}={",".join(value)}&'
    else:
      if query[-1] == '&':
        query = query[:-1]
    
    url = f'{base}/{self.location}' + [f'/{self.category}', ''][not self.category] + [query, ''][not params]
    self.driver.get(url)
    return self


  def __get_height(self):
    return self.driver.execute_script('return document.body.scrollHeight')


  def scroll_to_end(self):
    prev_height = self.driver.execute_script('return document.body.scrollHeight')
    scroll_cnt = 0
    
    while True:
      self.driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
      time.sleep(SCROLL_DELAY)
      
      curr_height = self.__get_height()
      if curr_height == prev_height:
        time.sleep(LAST_CHECK_DELAY)
        curr_height = self.__get_height()
        if curr_height == prev_height:
          return self
        
      prev_height = curr_height
      # print(scroll_cnt)
      scroll_cnt += 1

  def __process_data(self, data, empty):
    return data.get_text().strip() if data else empty
  
  # TODO: 추후 예정: 연도 부분을 제목과 분리할 로직 검토?
  def __get_title_n_release_year(self, soup):
      title = soup.find('div', class_='title-block')
      ko_title = title.h1.get_text().strip() if title else ''
      release_year = title.find('span', class_='text-muted')
      release_year = re.sub('[()]', '', release_year.get_text().strip()) if release_year else -1

      if not title.h3:
        return { 'title': { 'ko': ko_title, 'org': ko_title }, 'release_year': release_year }
      else:
        return { 'title': { 'ko': ko_title, 'org': title.h3.get_text().replace("원제: ", "") }, 'release_year': release_year }


  # Get data in the detail info
  def __get_genre(self, data):
    return self.__process_data(data, '').replace(', ', ',')


  def __get_rating(self, data):
    justwatch = data.find(attrs={'v-uib-tooltip': 'JustWatch Rating'})
    justwatch = self.__process_data(justwatch, '')
    imdb = data.find(attrs={'v-uib-tooltip': 'IMDB'})
    imdb = imdb.get_text().strip().split() if imdb else []
    unit = { 'k': 1000, 'm': 1_000_000, 'b': 1_000_000_000 }
    # print(justwatch, imdb[1][1:-2] if len(imdb) > 1 else -1) # 디버러러러러러깅
    return {
      'justWatch': justwatch,
      'IMDB': {
        'score': float(imdb[0]) if imdb else -1,
        'vote_count': int(float(imdb[1][1:-2]) * unit[imdb[1][-2]]) if len(imdb) > 1 else -1
      }
    }


  def __get_runtime(self, data):
    runtime = self.__process_data(data, '').split()
    minutes = 0
    for tm in runtime:
      if re.search('\d+시간', tm):
        minutes += int(re.sub('시간', '', tm)) * 60
      else:
        minutes += int(re.sub('분|min', '', tm))
    return minutes if minutes else -1


  def __get_director(self, data):
    director = data.find('a', class_='title-credit-name')
    return self.__process_data(director, '')


  # TODO: 찾아야댐...
  def __get_film_rating(self, data):
    pass


  def __get_detail_info(self, soup): # TODO: 수정 예정 - 머 수정하려고 했드라...?-_-
    result = {}
    detail_info = {
      '평점': 'rating',
      '장르': 'genre',
      '재생 시간': 'runtime',
      '감독': 'director',
      '연령 등급': 'film_rating'
    }
    
    labels = soup.find('div', class_='detail-infos__detail').find_all('div', class_='label') # or detail-infos__subheading
    for label in labels:
      item = detail_info[label.get_text().strip()]
      data = label.find_next('div', class_='detail-infos__detail--values')
      
      if item == 'genre':
        result[item] = self.__get_genre(data)
      elif item == 'rating':
        result[item] = self.__get_rating(data)
      elif item == 'runtime':
        result[item] = self.__get_runtime(data)
      elif item == 'director':
        result[item] = self.__get_director(data)
      elif item == 'film_rating':
        result[item] = self.__get_film_rating(data)
      else:
        print('또 있어?!', item)
    return result


  def __get_overview(self, soup):
    overview = soup.find(attrs={ 'data-v-b0ff2508': '' }, text='시놉시스')
    return self.__process_data(overview.find_next('span'), '') if overview else ''
  
  
  def __get_actors(self, soup):
    actors = []
    for actor in soup.find_all('div', class_='title-credits__actor'):
      actor = self.__process_data(actor.find(class_='title-credit-name'), '')
      if actor:
        actors.append(actor)
    return ','.join(actors)

  def __get_otts(self, soup):
    pass  

  def __get_video_data(self, soup):
    result = copy.deepcopy(RESULT_TEMPLATE)
    
    data = self.__get_title_n_release_year(soup)
    result['title'] = data['title']
    result['release_year'] = data['release_year']
    for item, data in self.__get_detail_info(soup).items():
      result[item] = data

    # 테스트 요망
    result['overview'] = self.__get_overview(soup)
    result['actors'] = self.__get_actors(soup)
    result['ott'] = self.__get_otts(soup)
    
    # result = {
    #   'ott': ,
    #   'film_rating': '',
    # }
#   'ott': {
#     'streaming': {},
#     'rent': {},
#     'buy': {}
#   },
    
    return result


  def get_video_list(self):
    contents = self.driver.find_elements_by_class_name('title-list-grid__item--link')
    
    if not DEBUG_CNT: # 임시 디버깅 코드
      for content in contents:
        url = content.get_attribute('href') # TODO: 에러는 이부분 같다! 아니네 맞나 -_-?
        category = url.replace(f'{BASE_URL}/kr/', '').split('/')[0]
        # print(url) # 디버러어어어어깅
        
        response = self.get_html_soup(url)
        if not response['err']:
          soup = BeautifulSoup(response['res'], 'html.parser')
          result = self.__get_video_data(soup)
          result['category'] = urllib.parse.unquote(category)
          self.collected_data[result['title']['ko']] = result
        else:
          self.err_list.append(f'[{url}] Error Code: {response["err"]}')
    
    # TODO: Check Total Count
    self.contents_cnt += len(contents)
    print(f'Total: {self.contents_cnt}, current: {len(contents)}, err_list: {len(self.err_list)}')
    return self

  
  def print_videos(self):
    for i, video in enumerate(self.collected_data.values()):
      print(f'{i}: {video}')


  def print_errors(self):
    for i, err in enumerate(self.err_list):
      print(f'ERR {i}: {err}')


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


# TODO: 파일 떨구기
def create_file(type, data):
  if type(data) != 'xxx':
    return
  if type == 'json':
    pass
  elif type == 'csv':
    pass


if __name__ == '__main__':
  try:
    driver = init_driver(WEB_BROWSER)
    if not driver:
      raise Exception('Not found web driver!')
    
    crawler = Crawler(driver)
    for start, end in set_year_filter(START_YEAR, END_YEAR, YEAR_CNT):
      for category in ['영화', 'TV-프로그램']:
        crawler \
          .set_location('kr') \
          .set_category(category) \
          .get_html_driver(BASE_URL, {
            'providers': ['nfx', 'prv', 'wac', 'wav'],
            'release_year_from': [str(start)],
            'release_year_until': [str(end)]
          }) \
          .scroll_to_end() \
          .get_video_list() \
          .print_videos()
    
    if DEBUG_ERR and crawler.err_list:
      print(f'{"=" * 10} ERROR {"=" * 10}')
      crawler.print_errors()
    
    # 수집한 데이터로 'json'이나 'csv' 파일을 생성
    create_file('json', crawler.get_data())
      
  except Exception as e:
    print(f'에러어어어어어: {e}')