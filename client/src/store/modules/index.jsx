import surveyReducer, { surveyActionCreator } from './surveyReducer';

export const actionCreator = {
  ...surveyActionCreator,
};

const reducer = {
  survey: surveyReducer,
};

export default reducer;
