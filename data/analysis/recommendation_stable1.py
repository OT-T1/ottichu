#%%
# DB에서 가져오기 - 실제 DB
import re

import config
import numpy as np
import pandas as pd
import pymysql
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from konlpy.tag import Mecab


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

all_data = contents

#%%
PICK_ACTOR = "SELECT * FROM content_actor WHERE content_code=%s"
PICK_DIRECTOR = "SELECT * FROM content_director WHERE content_code=%s"
PICK_GENRE = "SELECT * FROM content_genre WHERE content_code=%s"


#%%
# 결측치 처리 - fillna - 현재 summary에만 64개 결측치 발견
all_data = all_data.fillna("")

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
		temp_items.append(str(actor).replace('\'','').replace(']','').replace('[',''))
		temp_items.append(str(director).replace('\'','').replace(']','').replace('[',''))
		temp_items.append(str(genre).replace('\'','').replace(']','').replace('[',''))
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
	temp['actors'] = temp['actors'].astype(str)
	temp['directors'] = directors
	temp['directors'] = temp['directors'].astype(str)
	temp['genres'] = genres


	m = Mecab()
	mecab_tok = []

	# 줄거리만 벡터화하도록 다시 수정해 봄  ############
	# for summary in temp['summary']:
	for doc in temp['doc']:
		words = m.nouns(doc)
		# words = m.nouns(summary) # 고유명사화 알아보기
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
# def make_doc2vec_data(data, column, tagged=False):
# 	data_doc= []

# 	for tag, doc in zip(data.index, data[column]):
# 	# for tag, doc in zip(data['content_code'], data[column]):  #########
# 		doc = doc.split(" ")
# 		data_doc.append(([tag], doc))

# 	if tagged:
# 		data = [TaggedDocument(words=text, tags=tag) for tag, text in data_doc]
# 		return data

# 	else:
# 		return data_doc



#%%
# 벡터 데이터 만들기
# doc : 필요한 거 전부 문자열로 이어붙인 것
# mecab_tok : mecab을 통해 형태소 분석한 결과
# tag: doc2vec model 학습에 사용됨
# without tag : user embedding, cosine similiarty 구하는 용도

# data_doc_tag = make_doc2vec_data(data, 'doc', tagged=True)
# data_doc = make_doc2vec_data(data, 'doc')

# data_doc_tok_tag = make_doc2vec_data(data, 'mecab_tok', tagged=True)
# data_doc_tok = make_doc2vec_data(data, 'mecab_tok')


#%%
# 분석 대상 컨텐츠(doc)를 100차원 벡터로 만들기
# tok : 형태소 분석기를 적용한 모델이냐 아니냐 : bool data
# def make_doc2vec_models(tagged_data, name, vector_size=100, window=4, epochs=100, min_count=2, workers=5):
# 	model = Doc2Vec(tagged_data, vector_size=vector_size, window=window, epochs=epochs, min_count=min_count, workers=workers)
# 	model.save(f'./model/{name}_model_211013_test.doc2vec')


# data_director_tag = make_doc2vec_data(data, 'directors', tagged=True)
# make_doc2vec_models(data_director_tag, name='directors')


# actor_tag = make_doc2vec_data(data, 'actors', tagged=True)
# make_doc2vec_models(actor_tag, name='actors') # 형태소 분석 결과

#%%
# doc2vec models 로드하기
model_tok = Doc2Vec.load('./model/True_model_211013_test.doc2vec') ############
model_actor_tok = Doc2Vec.load('./model/actors_model_211013_test.doc2vec')
model_director_tok = Doc2Vec.load('./model/directors_model_211013_test.doc2vec')
#%%
# print(len(model_tok.dv)) ## model size = 19795
# print(data.iloc[19794]) ## data idx 0~19794
# print(data.info())  ## data 19795
# print(len(data_doc_tok))  ## 19795
#%%
# mecab 형태소 분석한 모델 적용한 유저 임베딩
# content vector 기반의 user history의 평균을 구해서 user embedding을 만들어 줌
# index_list : 사용자가 선택한 컨텐츠의 인덱스 리스트 >> PK :content code로 수정
# data_doc : 벡터 데이터 (안쓰는 걸로 바꿈)
# model : 모델 데이터

# 유저가 선택한 content_code를 입력받고, 100차원 벡터 데이터를 반환함
def make_embedding(content_code_list, model_tok): #########
	user_embedding = []
	
	for i in content_code_list:
		try:
			user_embedding.append(model_tok.dv[i-1]) 
			# model_tok은 배열 상태라 결국 인덱스값으로 조회해야 한다.
			# 따라서 content_code - 1을 해야 함
		except:
			pass

	user_embedding = np.array(user_embedding)
	user = np.mean(user_embedding, axis = 0)

	return user


#%%
# 카테고리, 감독, 배우 입력 정보를 바탕으로 1차 필터링 하기
# Check Prefiltered User Data
# pre-filter by category, actor, director

# 사전 필터링 작동 확인
# tastes = 프론트에서 보낸 사용자 사전 응답 데이터
# 형식은 json으로 올 것을 예상하고 우선 만들어 둠

tastes = {
	'directors' : ['크리스토퍼 놀란', '봉준호'],
	'actors' : ['유재석', '송강호'],
	'category' : ['영화']
}



#%%
# 데이터 체크

# print(data.iloc[18283])
# most similar 자체가 자기 자신을 제외하고 내보낸다!>>아니다; 임베드하면 자기 내보낼 줄 안다...

# uue = [1, 18283] # 중경삼림, 중경삼림 리마스터링
# # sc = model_tok.dv.most_similar([18283], topn=20)
# sc = model_tok.dv.most_similar([1], topn=20)

# for i in range(5):
# 	print(data['title'].loc[data['content_code'] == sc[i][0]+1])

# 자기 자신은 제외하고 유사한 코드를 n개까지 반환함
def get_similar_codes(content_codes, n, model):

	result = []
	for code in content_codes:
		code_vector = make_embedding([code], model_tok)
		similar_codes = model.dv.most_similar(code_vector, topn=n)
		result_content_codes = [x[0] + 1 for x in similar_codes[1:]]
		result += result_content_codes
	
	return result
#%%
# 감독, 배우 코드 얻는 함수 정의

def get_person_codes(tastes, jobtype, model):
	contents_codes = []

	for person in tastes[jobtype]:
		picked = data['content_code'].loc[data[jobtype].astype(str).str.contains(f'{person}')].values.tolist()
		embedded_pick = make_embedding(picked, model)
		representations = model.dv.most_similar(embedded_pick, topn=2)

		contents_codes += [rep[0]+1 for rep in representations]

	return contents_codes


print(get_person_codes(tastes, 'directors', model_director_tok))
print(data['title'].loc[data['content_code']==2677])
print(get_person_codes(tastes, 'actors', model_actor_tok))
print(data['title'].loc[data['content_code']==4521])

#%%



def get_title(content_code):
	title = str(data['title'].loc[data['content_code'] == content_code].values)
	title = re.sub(r'[\[\]\'\"]','',title)

	stopwords = ['흑백판', '4K', '리마스터링']
	for stop in stopwords:
		title = re.sub(stop, '', title)
	
	return title

# 타이틀 매치 !
def check_title(prev_title, curr_title):

	if prev_title in curr_title:
		return True

	return False

#%%
# embedded = make_embedding([16237], model_tok)
# most_similar = model_tok.dv.most_similar(embedded, topn=2) ########
# print(most_similar[1:])

# print(data['title'].loc[data['content_code']==16237])
# print(data['title'].loc[data['content_code']==17285])
#%%
# get_other_codes : stable!

def get_other_codes(content_codes, model):
	result = []
	for code in content_codes:
		embedded = make_embedding([code], model)
		most_similar = model.dv.most_similar(embedded, topn=2) ########
		ms = most_similar[1][0] + 1
		# ms = get_similar_codes([code], 1, model)

		if len(result) == 0:
			result.append(ms)

		elif len(result) != 0:
			prev_title = get_title(result[-1]) 
			# print(prev_title)
			curr_title = get_title(ms)
			# print(prev_title, curr_title)
			# print(check_title(prev_title, curr_title))
		
			if (check_title(prev_title, curr_title) == False) and (ms not in result):
				result.append(ms)
				
		
			
	return result

#%%
director_contents_codes = get_person_codes(tastes, 'directors', model_director_tok)
actor_contents_codes = get_person_codes(tastes, 'actors', model_actor_tok)
# print(director_contents_codes)
# print(actor_contents_codes)
directors_other_codes = get_other_codes(director_contents_codes, model_director_tok)
actors_other_codes = get_other_codes(actor_contents_codes, model_actor_tok)

print(directors_other_codes)
print(actors_other_codes)
#%%
# 처음 10개 작품 목록 받기
# prefilter + get_first_10_contents
# 10개 이상을 일단 출력해서 사용할 때 콘텐츠 코드 10개만 잘라쓰기
def get_first_contents(tastes, history_codes):
	
	# 선택한 감독과 배우가 둘다 없다면
	if len(tastes['actors']) == 0 and len(tastes['directors'] == 0):
		tastes['actors'] = ['유재석', '송강호', '공유'] # 한 달 간 가장 언급 많이 된 배우
		tastes['directors'] = ['김태호']
	
	# prefilter 부분 : 감독, 배우 입력 값으로 해당하는 컨텐츠 코드 가져오기

	# 1) direcctor vector 생성 후 배우별 대표작 뽑기
	director_contents_codes = get_person_codes(tastes, 'directors', model_director_tok)
	# 2) actor vector 생성 후 배우별 대표작 뽑기
	actor_contents_codes = get_person_codes(tastes, 'actors', model_actor_tok)

	# 감독, 배우 컨텐츠 코드 모자라니까 더 만드는 부분(new)
	directors_other_codes = get_other_codes(director_contents_codes, model_director_tok) + get_similar_codes(director_contents_codes, 1, model_director_tok)
	actors_other_codes = get_other_codes(actor_contents_codes, model_actor_tok) + get_similar_codes(director_contents_codes, 1, model_actor_tok)
	
	length = min(len(directors_other_codes), len(actors_other_codes))

	temp = director_contents_codes + actor_contents_codes
	result = []

	for t in temp:
		if t not in history_codes and t not in result:
			result.append(t)

	for i in range(length):
		d_code = directors_other_codes[i]
		a_code = actors_other_codes[i]
		if d_code not in history_codes and d_code not in result:
			result.append(d_code) 
		if a_code not in history_codes and a_code not in result:
			result.append(a_code)

	if len(result) < 10:
		more_directors_codes = get_similar_codes(directors_other_codes, 1,model_director_tok)
		more_actors_codes = get_similar_codes(actors_other_codes, 1, model_actor_tok)

		for j in range(length):
			d_code = more_directors_codes[j]
			a_code = more_actors_codes[j]
			if d_code not in history_codes and d_code not in result:
				result.append(d_code)
			if a_code not in history_codes and a_code not in result:
				result.append(a_code)

	return result  # content_codes




print('first_10_contents')
first_10_contents = get_first_contents(tastes)[:10]
print(first_10_contents)
for tc in first_10_contents:
	print(data['title'].loc[data['content_code'] == tc])



#%%
print(get_other_codes([16237, 42, 5802], model_tok))

#%%
# get other 10 contents
# user_updated = 선호 컨텐츠 응답 내용이 추가된 최신 사용자 데이터 : content_codes

def get_other_10_contents(user_picked_codes, prev_codes):

	skip_codes = user_picked_codes + prev_codes
	new_codes = get_other_codes(user_picked_codes, model_tok)
	rest_codes = get_first_contents(tastes)[10:]
	# print('skip codes:', skip_codes)
	# print('get new codes', new_codes)
	# print('get rest codes', rest_codes)
	
	result = []
	
	for nc in new_codes:
		if nc not in skip_codes and nc not in result:
			result.append(nc)

	more_codes = get_other_codes(result, model_tok)


	for mc in more_codes:
		if mc not in skip_codes and mc not in result:
			result.append(mc)

	for rc in rest_codes:
		if rc not in skip_codes and rc not in result:
			result.append(rc)

	more_more_codes = get_other_codes(more_codes, model_tok)
	result = new_codes + rest_codes + more_codes + more_more_codes

	return result

	

user_picked_codes = [16237, 42, 17628]

prev_codes = get_first_contents(tastes)[:10]
rest_codes = get_first_contents(tastes)[10:]
new_codes = get_other_codes(user_picked_codes, model_tok)
user_updated2 = get_other_10_contents(user_picked_codes, prev_codes)
# print(prev_codes)
# print(rest_codes)
# print(new_codes)

for uu2 in user_updated2:
	print(data['title'].loc[data['content_code']==uu2])

print(user_updated2)




#%%
# get result : 결과에 띄울 샹위 200개 컨텐츠 인덱스 반환

# 유퀴즈, 아키라, 하얀거탑, 박쥐, 하울링
user_picked_codes = [16237, 42, 3191, 3583, 4701]
user_final = user_picked_codes

print(data['title'].loc[data['content_code'].isin(user_final)])

#%%

def get_result(user_final):

	final_codes = user_final

	while len(final_codes) < 200:
		temp = get_similar_codes(final_codes, 3, model_tok)
		final_codes += temp

	return final_codes[:200]


print(len(get_result(user_final)))




#%%
# 중간 테스트...
check = get_result(user_final)[:10]
for c in check:
	print(data['title'].loc[data['content_code']==c])

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

# ott 별 집계 결과 얻기
result = get_result(user_final)
count_by_ott(result)

#%%
# 최종 OTT 추천 받기
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

print(get_ott_recommendation(result))



#%%
# 장르 분포 분석 - 가중치 부여

# result에 담긴 content code를 보고 해당 장르를 가져와서 집계한다
def get_top_genre(result):

	# GENRE DICT SETTING
	READ_CONTENT_GENRE = "SELECT * FROM content_genre"
	genres = pd.read_sql(READ_CONTENT_GENRE, db)
	unique_genre = genres['genre'].unique().tolist() # 155개

	genre_count = dict()
	for ug in unique_genre:
		genre_count[ug] = 0


	# WEIGHT
	weight = [i for i in range(200, 0, -1)]

	for idx, content_code in enumerate(result):
		PICK_GENRE = "SELECT * FROM content_genre WHERE content_code=%s"
		content_genres = pd.read_sql_query(PICK_GENRE, db, params=[content_code])
		genres = content_genres['genre'].tolist()
		# print(genres)
		for genre in genres:
			try:
				# genre_count[genre] += 1  # 단순 집계
				genre_count[genre] += weight[idx] # 가중치 부여 점수 환산
			except Exception as e:
				print(e)

	# print(genre_count)

	top_genre = sorted(genre_count.items(), reverse=True, key=lambda x: x[1])[:5]
	
	category = dict()
	for key, val in top_genre:
		category[key] = val

	return category
	

print(get_top_genre(result))


#%%
# 워드클라우드용 줄거리 데이터 합쳐서 내보내기
# result : content_code 코드
# 아웃풋 tokens : 미캡 형태소 분석 거친 단어가 나열된 문자열

def for_wordcloud(result):
	# 워드클라우드에 입력되어야 할 토큰이(단어가) 더 많아야 하면 val을 조정하기
	val = 30
	tokens = []
	for content_code in result[:val]:
		token = str(data['mecab_tok'].loc[data['content_code'] == content_code].values)
		tokens.append(token)

	tokens = ' '.join(tokens).replace('[','').replace(']', '').replace('\'','')

	return tokens



#%%
# print(data['mecab_tok'].loc[data['content_code'].isin(result[:30])].sum())

print(for_wordcloud(result))

#%%
# 장르 분포 분석 - 단순 집계

# result에 담긴 content code를 보고 해당 장르를 가져와서 집계한다
# def get_top_genre(result):

# 	# GENRE DICT SETTING
# 	READ_CONTENT_GENRE = "SELECT * FROM content_genre"
# 	genres = pd.read_sql(READ_CONTENT_GENRE, db)
# 	unique_genre = genres['genre'].unique().tolist() # 155개

# 	genre_count = dict()
# 	for ug in unique_genre:
# 		genre_count[ug] = 0


# 	# WEIGHT
# 	weight = [i for i in range(200, 0, -1)]

# 	for idx, content_code in enumerate(result):
# 		PICK_GENRE = "SELECT * FROM content_genre WHERE content_code=%s"
# 		content_genres = pd.read_sql_query(PICK_GENRE, db, params=[content_code])
# 		genres = content_genres['genre'].tolist()
# 		# print(genres)
# 		for genre in genres:
# 			try:
# 				genre_count[genre] += 1  # 단순 집계
# 				# genre_count[genre] += weight[idx] # 가중치 부여 점수 환산
# 			except Exception as e:
# 				print(e)

# 	# print(genre_count)

# 	top_genre = sorted(genre_count.items(), reverse=True, key=lambda x: x[1])[:5]
	
# 	category = dict()
# 	for key, val in top_genre:
# 		category[key] = val

# 	return category
	

# print(get_top_genre(result))


#%%

# def get_result(user_final):

# 	user_final = make_embedding(user_updated['content_code'].values.tolist(), model_tok)  #######

# 	# 최종 데이터와 유사한 문서 상위 200개를 선정하여, 어느 ott에 더 많은지 알려주기
# 	final_contents = model_tok.dv.most_similar(user_final, topn=200)
	
# 	final_temp_codes = [x[0]+1 for x in final_contents]	
# 	# final_content_codes = [x[0] for x in final_contents]	

# 	final_codes = data.loc[data['content_code'].isin(final_temp_codes)].sort_values(by=['rating'], ascending=False).reset_index()

# 	final_codes = final_codes['content_code'].values.tolist()

# 	return final_codes


# def get_director_codes(tastes):
# 	director_contents_codes = []

# 	for director in tastes['directors']:
# 		picked_director = data['content_code'].loc[data['directors'].astype(str).str.contains(f'{director}')].values.tolist()
# 		embedded_pick = make_embedding(picked_director, model_director_tok)
# 		rep_director = model_director_tok.dv.most_similar(embedded_pick, topn=2)

# 		## content_code which includes picked director
# 		for rep_d in rep_director:
# 			director_contents_codes.append(rep_d[0]+1)  

# 	return director_contents_codes

# def get_actor_codes(tastes):
# 	actor_contents_codes = []

# 	for actor in tastes['actors']:
# 		picked_actor = data['content_code'].loc[data['actors'].astype(str).str.contains(f'{actor}')].values.tolist()
# 		embedded_pick = make_embedding(picked_actor, model_actor_tok)
# 		rep_actor = model_actor_tok.dv.most_similar(embedded_pick, topn=2)

# 		## content_code which includes picked actor
# 		for rep_a in rep_actor:
# 			actor_contents_codes.append(rep_a[0]+1)  

# 	return actor_contents_codes
