#%% 
import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

#%%
all_data = pd.read_pickle('all_data.pkl')
print(all_data.head())

#%%
# 가변 길이의 줄거리 콘텐츠를 128차원 고정 길이 벡터로 만듦(지금 30차원으로 수정)
# tok : 형태소 분석기를 적용한 모델이냐 아니냐 : bool data
def make_doc2vec_models(tagged_data, tok, vector_size=100, window=4, epochs=40, min_count=1, workers=4):
	model = Doc2Vec(tagged_data, vector_size=vector_size, window=window, epochs=epochs, min_count=min_count, workers=workers)
	model.save(f'./test/{tok}_content_model.doc2vec')


#%%

# 데이터 가져오기 및 전처리
from konlpy.tag import Mecab


def get_and_process_data():
	temp = all_data.drop(columns=['rating', 'runtime'], axis=1)
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
	temp.index.name = "num"
	return temp


#%%

# 전처리된 데이터 얻기(전처리 더 해야 함)
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

# False_content_model.doc2vec와
# True_content_model.doc2vec를 각각 생성

make_doc2vec_models(data_doc_tag, tok=False) # 형태소 분석 미적용
make_doc2vec_models(data_doc_tok_tag, tok=True) # 형태소 분석 결과


#%%
# doc2vec models 로드하기

model = Doc2Vec.load('./test/False_content_model.doc2vec')
model_tok = Doc2Vec.load('./test/True_content_model.doc2vec')


# %%
# 특정 사용자 샘플 가정해보기(영화+놀란을 좋아한다면?) + 유저 임베딩
# tag 데이터가 아닌 ([tag], doc) 데이터를 doc2vec에서 사용하고, 형태소 분석하지 않은 제목+본문 합친 모델을 내보냄
# user_filtered_1 은 128개 float(벡터 vector)을 가진 list

# 예 : 놀란을 선호하는 경우
user_filtered_1 = data.loc[(
	data['director'].str.contains('놀란')) 
	& (data['category'] == '영화')
	][:5]
view_user_history(user_filtered_1)

user_f1 = make_user_embedding(user_filtered_1.index.values.tolist(), data_doc, model) 


# %%

# similar_contents : index를 반환함
similar_contents = model.dv.most_similar(user_f1, topn=10)

#%%
# 처음 유저 데이터를 우선 가져오고, 유저가 선호한다고 응답한 데이터를 더 추가함
user_update = user_filtered_1

for s in similar_contents:
	user_update = user_update.append(data.loc[s[0]])

print(user_update['title'])


#%%
# 업데이트된 사용자 취향 보기
view_user_history(user_update)


# %%
# 최종 사용자 데이터 임베딩하기
# 놀란을 선호하는 경우 + update
user_final = make_user_embedding(user_update.index.values.tolist(), data_doc, model) 

# %%

# 최종 데이터와 유사한 문서 상위 1000개를 선정하여, 어느 ott에 더 많은지 알려주기
final_contents = model.dv.most_similar(user_final, topn=1000)


# %%

# 어느 ott에 더 많을까? 
# ott별 사용자 취향 컨텐츠 숫자 집계하기

netflix_cnt, tving_cnt, wavve_cnt, watcha_cnt, coupang_cnt = 0, 0, 0, 0, 0
otts_cnt = [netflix_cnt, tving_cnt, wavve_cnt, watcha_cnt, coupang_cnt]
otts = ['Netflix', 'tving', 'wavve', 'Watcha', 'coupang']
for f in final_contents:
	for idx, ott in enumerate(otts):
		if ott in data['ott'].loc[f[0]]:
			otts_cnt[idx] += 1

for pair in zip(otts, otts_cnt):
	print(pair)


#%%
# 전체 ott 데이터 수 출력


netflix_cnt, tving_cnt, wavve_cnt, watcha_cnt, coupang_cnt = 0, 0, 0, 0, 0
otts_cnt = [netflix_cnt, tving_cnt, wavve_cnt, watcha_cnt, coupang_cnt]
otts = ['Netflix', 'tving', 'wavve', 'Watcha', 'coupang']

for f in all_data['ott']:
    for idx, ott in enumerate(otts):
        if ott in f:
            otts_cnt[idx] +=1 
            

for pair in zip(otts, otts_cnt):
	print(pair)


#%%
