#%%
# DB에서 가져오기 - 실제 DB
import re

import numpy as np
import pandas as pd
import pymysql
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from konlpy.tag import Mecab

import config


#%%
# DB 연결
def connect_db():
    try:
        conn = pymysql.connect(
            user = config.aws_db['user'],
            passwd = config.aws_db['password'],
            host =  "ott-service-project.cbmthuyhcguk.ap-northeast-2.rds.amazonaws.com",
            port = 3306,
            database = "ott-service",
            charset='utf8'
        )

        return conn

    except Exception as e:
        return print(e)
        
#%%
# CONNECT DB
db = connect_db()

#%%
# COPY DATA FROM DB
SHOW_TABLE = "SHOW TABLES"
SHOW_CONTENTS = "SELECT * FROM contents"
READ_CONTENT_GENRE = "SELECT * FROM content_genre"
READ_CONTENT_ACTOR = "SELECT * FROM content_actor"
READ_CONTENT_DIRECTOR = "SELECT * FROM content_director"

contents = pd.read_sql(SHOW_CONTENTS, db)
print(contents.head())
all_data = contents

#%%
PICK_ACTOR = "SELECT * FROM content_actor WHERE content_code=%s"
# actor = pd.read_sql_query(PICK_ACTOR, db, params=[i])
# print(', '.join(actor['actor'].tolist()))
PICK_DIRECTOR = "SELECT * FROM content_director WHERE content_code=%s"
PICK_GENRE = "SELECT * FROM content_genre WHERE content_code=%s"


#%%
# 결측치 처리 - fillna - 현재 summary에만 64개 결측치 발견
print(all_data.summary.isnull().sum())
print(all_data.info())
all_data = all_data.fillna("")
print(all_data.info())
# 포스트그레스?! 벡터 저장?! >> NoSQL >> 웨디스?? 몽고디비?? 


#%%
# 데이터 가져오기 및 전처리
def get_and_process_data():

	content_actor = pd.read_sql(READ_CONTENT_ACTOR, db)
	content_director = pd.read_sql(READ_CONTENT_DIRECTOR, db)
	content_genre = pd.read_sql(READ_CONTENT_GENRE, db)

	temp = all_data

	docs = []
	actors = []
	directors = []
	genres = []


	for content_code, title, summary in zip(temp['content_code'], temp['title'], temp['summary']):
		temp_items = []
		
		actor = content_actor['actor'].loc[content_actor['content_code']==content_code].tolist()
		director = content_director['director'].loc[content_director['content_code']==content_code].tolist()
		genre = content_genre['genre'].loc[content_genre['content_code']==content_code].tolist()

		temp_items.append(title)
		temp_items.append(str(actor))
		temp_items.append(str(director))
		temp_items.append(str(genre))
		temp_items.append(summary)

		doc = ' '.join(temp_items)

		remove_sc = re.compile('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]')
		doc = remove_sc.sub('', doc)

		docs.append(doc)
		actors.append(actor)
		directors.append(director)
		genres.append(genre)

	temp['doc'] = docs
	temp['actors'] = actors
	temp['directors'] = directors
	temp['genres'] = genres


	m = Mecab()
	mecab_tok = []

	for doc in temp['doc']:
		words = m.nouns(doc) # 고유명사화 알아보기
		words = ' '.join(words)
		mecab_tok.append(words)

	temp['mecab_tok'] = mecab_tok
	temp['mecab_tok'] = temp['mecab_tok'].astype(str)
	temp['doc'] = temp['doc'].astype(str)
	temp.index.name = 'num'


	return temp


#%%
# data 전처리 후 가져오기
data = get_and_process_data()


#%%
# doc2vec에 필요한 데이터 만들고 저장하기
def make_doc2vec_data(data, column, tagged=False):
	data_doc= []

	for tag, doc in zip(data.index, data[column]):  #########
		doc = doc.split(" ")
		data_doc.append(([tag], doc))

	if tagged:
		data = [TaggedDocument(words=text, tags=tag) for tag, text in data_doc]
		return data

	else:
		return data_doc



#%%
# 벡터 데이터 만들기
# doc : 필요한 거 전부 문자열로 이어붙인 것
# mecab_tok : mecab을 통해 형태소 분석한 결과
# tag: doc2vec model 학습에 사용됨
# without tag : user embedding, cosine similiarty 구하는 용도

data_doc_tag = make_doc2vec_data(data, 'doc', tagged=True)
data_doc = make_doc2vec_data(data, 'doc')

data_doc_tok_tag = make_doc2vec_data(data, 'mecab_tok', tagged=True)
data_doc_tok = make_doc2vec_data(data, 'mecab_tok')


#%%
# print(data_doc_tok_tag[0])
#%%
# 모델 만들기 
# 분석 대상 컨텐츠(doc)를 100차원 벡터로 만들기
# tok : 형태소 분석기를 적용한 모델이냐 아니냐 : bool data

# def make_doc2vec_models(tagged_data, tok, vector_size=100, window=4, epochs=40, min_count=1, workers=4):
# 	model = Doc2Vec(tagged_data, vector_size=vector_size, window=window, epochs=epochs, min_count=min_count, workers=workers)
# 	model.save(f'./model/{tok}_model.doc2vec')

#%%
# 모델 만들기 - 함수 호출

# make doc2vec models - 스토리지에 모델 파일(120MB;) 업로드 시 이 코드는 불필요
# make_doc2vec_models(data_doc_tok_tag, tok=True) # 형태소 분석 결과


#%%
# doc2vec models 로드하기
model_tok = Doc2Vec.load('./model/True_model.doc2vec') ############

#%%
# mecab 형태소 분석한 모델 적용한 유저 임베딩
# content vector 기반의 user history의 평균을 구해서 user embedding을 만들어 줌
# index_list : 사용자가 선택한 컨텐츠의 인덱스 리스트 >> PK :content code로 수정
# data_doc : 벡터 데이터 (안쓰는 걸로 바꿈)
# model : 모델 데이터

def make_user_embedding(content_code_list, model_tok): #########
	user_embedding = []
	
	for i in content_code_list:
		try:
			user_embedding.append(model_tok.dv[i-1])
		except:
			pass

	user_embedding = np.array(user_embedding)
	user = np.mean(user_embedding, axis = 0)

	return user


#%%
# 카테고리, 감독, 배우 입력 정보를 바탕으로 1차 필터링 하기
# Check Prefiltered User Data
# pre-filter by category, actor, director

def pre_filter(tastes):

	director = ' '.join(tastes['directors'])
	actor = ' '.join(tastes['actors'])
	category = ' '.join(tastes['category'])

	# DB에서 사용자가 선택한 인덱스를 가져온다
	# user_code = 1 # 프론트에서 가져올 것
	# PICK_USER = "SELECT * FROM user_contents WHERE user_code=%s"
	# user_contents = pd.read_sql_query(PICK_USER, db, params=[user_code])
	# user_picked = user_contents['content_code'].loc[user_contents['user_code']==user_code].tolist()
	
	# dummy user
	user_picked = [4]

	prev_user = data.loc[data['content_code'].isin(user_picked)].sort_values(by=['rating'], ascending=False).reset_index()

	user_prefiltered = data.loc[(
		data['directors'].astype(str).str.contains(f'{director}')
		| data['actors'].astype(str).str.contains(f'{actor}')) 
		& (data['category'] == f'{category}')
		][:].sort_values(by=['rating'], ascending=False).reset_index()

	user = pd.concat([prev_user[:5], user_prefiltered[:5]], ignore_index=True)

	return user

#%%
# 사전 필터링 작동 확인
# tastes = 프론트에서 보낸 사용자 사전 응답 데이터
# 형식은 json으로 올 것을 예상하고 우선 만들어 둠

tastes = {
	'directors' : ['크리스토퍼 놀란'],
	'actors' : ['크리스찬 베일'],
	'category' : ['영화']
}


user_prefiltered = pre_filter(tastes)

# print(len(user_prefiltered))
# print(user_prefiltered)
# print(user_prefiltered['content_code'].values.tolist())


#%%
# 처음 10개 작품 목록 받기
# Get first 10 Contents (from user_prefiltered)
# user_prefiltered = 카테고리, 감독, 배우로 1차 필터링을 거친 사용자 데이터

def get_first_10_contents(user_prefiltered):

	user_updated_embedded = make_user_embedding(user_prefiltered['content_code'][:10].values.tolist(), model_tok)  ########

	# similar_contents는 index를 반환할 수밖에 없다.
	similar_contents = model_tok.dv.most_similar(user_updated_embedded, topn=10)

	content_codes = [x[0]+1 for x in similar_contents] #########

	return content_codes ##########


#%%
first_10_contents = get_first_10_contents(user_prefiltered)
print(first_10_contents)
# print(data.loc[data['content_code'].isin(first_10_contents)])

#%%
# 선호 컨텐츠 입력 받고 사용자 업데이트하기
# update user
# index_responses = 사용자가 선호하는 컨텐츠의 인덱스
# user = 기존 사용자 데이터
# 리턴 값 user_updated = 새 사용자 데이터

def update_user(content_code_responses, user): ##########
	user_updated = user
	for content_code in content_code_responses:  ############
		user_updated.append(data.loc[data['content_code'] == content_code])
	
	return user_updated


user_updated = update_user(first_10_contents, user_prefiltered)
print(user_updated)


#%%
# get another 10 contents
# user_updated = 선호 컨텐츠 응답 내용이 추가된 최신 사용자 데이터

def get_another_10_contents(user_updated):
	# user_updated_embedded = make_user_embedding(user_prefiltered.index.values.tolist(), data_doc_tok, model_tok)
	user_updated_embedded = make_user_embedding(user_prefiltered['content_code'].values.tolist(), model_tok)  ########
	
	num_code = len(user_updated) #########
	# prev_code = user_updated.index.values.tolist()
	prev_code = user_updated['content_code'].values.tolist() #######

	similar_contents = model_tok.dv.most_similar(user_updated_embedded, topn=num_code+10)  #######

	new_code = [x[0]+1 for x in similar_contents]  #######

	another_10_contents = list(set(prev_code + new_code))[:10] ########

	return another_10_contents


another_10_contents = get_another_10_contents(user_updated)
print(another_10_contents)

#%%
# get result : 결과에 띄울 샹위 1000개 컨텐츠 인덱스 반환

def get_result(user_updated):
	user_final = make_user_embedding(user_updated['content_code'].values.tolist(), model_tok)  #######

	# 최종 데이터와 유사한 문서 상위 100개를 선정하여, 어느 ott에 더 많은지 알려주기
	final_contents = model_tok.dv.most_similar(user_final, topn=200)
	
	final_content_codes = [x[0]+1 for x in final_contents]	

	return final_content_codes

print(get_result(user_updated)[:10])

#%%
# 중간 테스트...
# print(data.loc[data['content_code'].isin(get_result(user_updated)[:10])])
#%%
# 어느 ott에 더 많을까? 
# ott별 사용자 취향 컨텐츠 숫자 집계하기

def count_by_ott(result):
	count = data.loc[data['content_code'].isin(result)]
	otts = ['is_netflix', 'is_tving', 'is_wavve', 'is_watcha', 'is_coupang']
	ott = ['netflix', 'tving', 'wavve', 'watcha', 'coupang']
	ott_counts = dict()
	for idx, is_ott in enumerate(otts):
		# print(f"{is_ott}", count['content_code'][count[f'{is_ott}'] == 1].count())
		val = count[{is_ott}].sum().values[0]
		print(f"{is_ott}", val)
		ott_counts[ott[idx]] = val

	return ott_counts

#%%
# ott 별 집계 결과 얻기
result = get_result(user_updated)
count_by_ott(result)

#%%
def get_ott_recommendation(result):
	
	# netflix_score, tving_score, wavve_score, watcha_score, coupang_score = 0, 0, 0, 0, 0
	scores = [0, 0, 0, 0, 0]
	is_otts = ['is_netflix', 'is_tving', 'is_wavve', 'is_watcha', 'is_coupang']
	weight = [i for i in range(200, 0, -1)]


	# i = 0 ~ 199  :  200개 결과값
	for idx, content_code in enumerate(result):
		# j = 0 ~ 4  : 5가지 ott 점수
		try:
			for j, is_ott in enumerate(is_otts):
				scores[j] += data[is_ott].loc[data['content_code'] == content_code].values[0] * weight[idx]
		except Exception as e:
			print(e)

	platform = {
		'netflix' : scores[0], 
		'tving' : scores[1], 
		'watcha' : scores[2],
		'wavve' : scores[3], 
		'coupang' : scores[4], 
	}

	return platform


#%%
# 최종 OTT 추천 받기
print(get_ott_recommendation(result))



#%%
# 장르 분포 분석

# result에 담긴 content code를 보고 해당 장르를 가져와서 집계한다
def get_top_genre(result):

	READ_CONTENT_GENRE = "SELECT * FROM content_genre"
	genres = pd.read_sql(READ_CONTENT_GENRE, db)
	unique_genre = genres['genre'].unique().tolist() # 155개

	genre_count = dict()
	for ug in unique_genre:
		genre_count[ug] = 0

	for content_code in result:
		PICK_GENRE = "SELECT * FROM content_genre WHERE content_code=%s"
		content_genres = pd.read_sql_query(PICK_GENRE, db, params=[content_code])
		genres = content_genres['genre'].tolist()
		# print(genres)
		for genre in genres:
			try:
				genre_count[genre] += 1
			except Exception as e:
				print(e)

	# print(genre_count)

	top_genre = sorted(genre_count.items(), reverse=True, key=lambda x: x[1])[:5]
	
	category = dict()
	for key, val in top_genre:
		category[key] = val

	return category
	

print(get_top_genre(result))

