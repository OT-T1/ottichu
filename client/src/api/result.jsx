import ottApi from './common';

const getResults = ottApi.get('/result');
const getWordCloudData = ottApi.get('/wordcloud');

const resultApi = {
  getResults,
  getWordCloudData,
};

export default resultApi;
