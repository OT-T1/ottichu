import ottApi from './common';

const getActors = ottApi.get('/data/actors');
const getDirectors = ottApi.get('/data/directors');
const submitBasicInfo = ottApi.post('/user/info');
const getContent = ottApi.get('/data/contents');
const submitContent = ottApi.patch('/user/contents');

const surveyApi = {
  getActors,
  getDirectors,
  submitBasicInfo,
  getContent,
  submitContent,
};

export default surveyApi;
