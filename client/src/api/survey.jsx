import ottApi from './common';

const getActors = ottApi.get('/actors');
const getDirectors = ottApi.get('/directors');
const submitBasicInfo = ottApi.post('/user/info');

const surveyApi = {
  getActors,
  getDirectors,
  submitBasicInfo,
};

export default surveyApi;
