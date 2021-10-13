import ottApi from './common';

const getResults = ottApi.get('/result');
const getWordCloudData = ottApi.get('/result/wordcloud');

const resultApi = {
  getResults,
  getWordCloudData,
};

export default resultApi;
