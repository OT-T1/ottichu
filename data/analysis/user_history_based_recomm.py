#%% 
import random

import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.test.utils import common_texts
from sklearn.manifold import TSNE
from sklearn.metrics.pairwise import cosine_similarity

#%%
all_data = pd.read_pickle('all_data.pkl')
print(all_data.head())

#%%
# 가변 길이의 줄거리 콘텐츠를 128차원 고정 길이 벡터로 만듦(지금 20차원으로 수정)
# tok : 형태소 분석기를 적용한 모델이냐 아니냐 : bool data
def make_doc2vec_models(tagged_data, tok, vector_size=128, window=3, epochs=40, min_count=0, workers=4):
	model = Doc2Vec(tagged_data, vector_size=vector_size, window=window, epochs=epochs, min_count=min_count, workers=workers)
	model.save(f'./test/{tok}_content_model.doc2vec')


#%%

# 데이터 가져오기 및 전처리
from konlpy.tag import Mecab


def get_and_process_data():
	temp = all_data.drop(columns=['rating', 'runtime', 'ott'], axis=1)
	docs = []
	for title, actors, director, country, genre, summary in zip(temp['title'], temp['actors'], temp['director'], temp['country'], temp['genre'], temp['summary']):
		doc = title + ' ' + ''.join(actors) + ' ' + ''.join(director) + ' ' + ''.join(country) + ' ' + ''.join(genre) + ' ' + summary
		doc = doc.replace('[','').replace(']','').replace('\'','')
		docs.append(doc)

	temp['doc'] = docs

	m = Mecab()
	mecab_tok = []

	for doc in temp['doc']:
		words = m.nouns(doc)
		words = ' '.join(words)
		mecab_tok.append(words)

	temp['mecab_tok'] = mecab_tok
	temp['mecab_tok'] = temp['mecab_tok'].astype(str)

	return temp


#%%

# 전처리된 데이터 얻기(미완성)
data = get_and_process_data()



#%%
# doc2vec에 필요한 데이터 만들어주는 함수
def make_doc2vec_data(data, column, t_document=False):
	data_doc= []
	for tag, doc in zip(data.index, data[column]):
		doc = doc.split(" ")
		data_doc.append(([tag], doc))
	if t_document:
		data = [TaggedDocument(words=text, tags=tag) for tag, text in data_doc]
		return data
	else:
		return data_doc


#%%
# 코사인 유사도를 구해서 상위 5개 추천하기

def get_recommend_contents(user, data_doc, model):
	scores = []

	for tags, text in data_doc:
		try:
			trained_doc_vec = model.dv[tags[0]]
			scores.append(cosine_similarity(user.reshape(-1, 128), trained_doc_vec.reshape(-1, 128)))
		except:
			pass
	scores = np.array(scores).reshape(-1)
	scores = np.argsort(-scores)[:5] 
	# argsort : sort한 어레이의 인덱스!를 반환함(원 데이터 기준 오름차순으로 인덱스 반환)

	return data.loc[scores, :]

#%%
# content vector 기반의 user history의 평균을 구해서 user embedding을 만들어 줌

def make_user_embedding(index_list, data_doc, model):
	user = []
	user_embedding = []
	for i in index_list:
		user.append(data_doc[i][0][0])

	for i in user:
		try:
			user_embedding.append(model.dv[i])
		except:
			pass
	user_embedding = np.array(user_embedding)
	user = np.mean(user_embedding, axis = 0)

	return user


#%% 
# 사용자 히스토리 보여주기

def view_user_history(data):
	print(data[['category', 'doc']])


#%%
# 벡터 데이터 만들기

# doc : 필요한 거 전부 문자열로 이어붙인 것
# mecab_tok : mecab을 통해 형태소 분석한 결과

data_doc_tag = make_doc2vec_data(data, 'doc', t_document=True)
data_doc = make_doc2vec_data(data, 'doc')

# tag: doc2vec 학습에 사용됨
data_doc_tok_tag = make_doc2vec_data(data, 'mecab_tok', t_document=True)
# without tag : user embedding, cosine similiarty 구하는 용도
data_doc_tok = make_doc2vec_data(data, 'mecab_tok')

#%%
# make doc2vec models
# 형태소 분석 적용, 미적용 데이터 분류

# 이미 만들었으니 일단 주석 처리, 파일 변경 시 주석을 풀어서 새로 생성할 것
# 해설
# False_content_model.doc2vec와
# True_content_model.doc2vec를 각각 생성

# make_doc2vec_models(data_doc_tag, tok=False) # 형태소 분석 미적용
# make_doc2vec_models(data_doc_tok_tag, tok=True) # 형태소 분석 결과


#%%
# doc2vec models 로드하기

model = Doc2Vec.load('./test/False_content_model.doc2vec')
model_tok = Doc2Vec.load('./test/True_content_model.doc2vec')

#%%
# 지금은 사용자 히스토리를 랜덤하게 뽑음
# 추후 사용자 데이터를 서버에서 받은 상황을 가정하고 작업 마무리해야 함
# 예 : 유저 카테고리 1 = TV 프로그램만만을 좋아하는 사람이 선호하는 컨텐츠 5개를 담음
# 이는 나중에 실제 데이터로 교체되어야 함

user_category_1 = data.loc[random.sample(data.loc[data.category == 'TV 프로그램', :].index.values.tolist(), 5), :] # tv
view_user_history(user_category_1)

user_category_2 = data.loc[random.sample(data.loc[data.category == '영화', :].index.values.tolist(), 5), :] # 영화
view_user_history(user_category_2)

#%%
# 유저 임베딩
# tag 데이터가 아닌 ([tag], doc) 데이터를 doc2vec에서 사용하고, 형태소 분석하지 않은 제목+본문 합친 모델을 내보냄

user_1 = make_user_embedding(user_category_1.index.values.tolist(), data_doc, model) # TV만 선호하는 경우
user_2 = make_user_embedding(user_category_2.index.values.tolist(), data_doc, model) # 영화만 선호하는 경우



#%%
# 결과를 보자

result = get_recommend_contents(user_1, data_doc, model)
pd.DataFrame(result.loc[:, ['category', 'title', 'doc']])

result = get_recommend_contents(user_2, data_doc, model)
pd.DataFrame(result.loc[:, ['category', 'title', 'doc']])

# %%
