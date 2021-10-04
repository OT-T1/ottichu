import json
import pymysql

# DB Connection Info
DB_HOST = 'INPUT YOUR DB HOST URL'
DB_PORT = 3306
USER = 'INPUT YOUR DB USER ID'
PASSWD = 'INPUT YOUR DB PASSWORD'
DB_NAME = 'INPUT YOUR DB NAME'


class DataPutter:
  def __init__(self, db=None):
    self.db = db
    self.cursor = self.db.cursor() if self.db else None
    self.actors = set()
    self.contents = []
    self.content_actor = []
    # self.ott_infos = []

  def connect_db(self, info={}):
    config = info.keys()
    self.db = pymysql.connect(
      host = DB_HOST if 'host' not in config else info['host'],
      port = DB_PORT if 'port' not in config else info['port'],
      user = USER if 'user' not in config else info['user'],
      passwd = PASSWD if 'passwd' not in config else info['passwd'],
      db = DB_NAME if 'db' not in config else info['db']
    )
    if self.db:
      self.cursor = self.db.cursor()
    return self
  
  def close_db(self):
    if not self.db:
      return self
    self.db.close()
    return self

  def apply_to_db(self):
    if not self.db:
      return self
    self.db.commit()
    return self

  def clear_data(self):
    self.actors = set()
    self.contents = []
    self.content_actor = []
    return self

  def __add_content(self, directors, content):
    if not content:
      return
    otts = set(content['ott'].keys())
    self.contents.append((
      content['title'],
      directors,
      content['summary'],
      '|'.join(content['country']),
      content['category'],
      '|'.join(content['genre']),
      str(content['runtime']),
      content['rating'],
      'Netflix' in otts,
      'TVING' in otts,
      'wavve' in otts,
      'Watcha' in otts,
      'Coupang Play' in otts,
    ))
  
  def __classify_data(self, data):
    if not data:
      return
    for content in data.values():
      # 'actors' Table Data
      self.actors |= set(content['actors'])
      # 'content_actor' Table Data
      directors = '|'.join(content['director'])
      self.content_actor.append((
        content['title'],
        directors,
        '|'.join(content['actors']),
      ))
      # 'contents' Table Data
      self.__add_content(directors, content)

  def read_data(self, file):
    type = file.split('.')[-1]
    with open(file, 'r', encoding='utf-8') as f:
      if type == 'json':
        data = json.load(f)
      elif type == 'csv':
        pass
    self.__classify_data(data)
    return self
  
  def __is_actor_existed(self, name):
    self.cursor.execute(
      '''
        SELECT actor
        FROM actors
        WHERE actor = %s
      ''' %(f'"{name}"')
    )
    record = self.cursor.fetchone()
    return True if record else False

  def insert_actors(self):
    if not self.cursor:
      return
    for name in self.actors:
      if not self.__is_actor_existed(name):
        self.cursor.execute('INSERT INTO actors(actor) VALUES(%s)', name)
    return self

  def insert_contents(self):
    if not self.cursor:
      return
    
    # TODO: Check Record(SELECT title)
    self.cursor.executemany(
      '''
        INSERT INTO contents (
          title,
          director,
          summary,
          country,
          category,
          genre,
          run_time,
          rating,
          is_netflix,
          is_tving,
          is_wavve,
          is_watcha,
          is_coopang
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
      ''',
      self.contents
    )
    return self
  
  def insert_content_actor(self):
    if not self.cursor:
      return
    
    # TODO: Check Record(SELECT title)
    self.cursor.executemany(
      'INSERT INTO content_actor(title, director, actor) VALUES(%s, %s, %s)',
      self.content_actor
    )
    return self

  # TODO: 아직 미구현.  
  def insert_ott_infos(self):
    pass
    return self

  def delete_actor(self, name):
    pass
    return self
  
  def delete_content(self):
    pass
    return self
  
  def delete_content_actor(self):
    pass
    return self

  # TEST
  def print_data(self):
    print(self.actors)
    print(self.contents)
    print(self.content_actor)


if __name__ == '__main__':
  # test_func()
  insertor = DataPutter()
  try:
    insertor \
      .connect_db() \
      .read_data('./tv_ott_dataset_test.json') \
      .insert_actors() \
      .insert_contents() \
      .apply_to_db() \
      .close_db() \
      # .insert_content_actor() \ # 사용하실 때 apply_to_db 위로 놓고 주석푸시면 됩니다.
      # .insert_ott_infos()
      # .print_data() \
  except Exception as e:
    print(f'Error Message: {e}')