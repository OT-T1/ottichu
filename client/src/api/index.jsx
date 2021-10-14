import resultApi from './result';
import surveyApi from './survey';

const api = {
  ...surveyApi,
  ...resultApi,
};

export default api;
