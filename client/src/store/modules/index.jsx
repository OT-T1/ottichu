import { all } from 'redux-saga/effects';
import loadSurveyRecordSaga from './loadPreviousRecordSaga';
import getActorDirectorSaga from './ActordirectorSaga';
import submitSurveySaga from './submitSurveySaga';
import surveyReducer, {
  surveyActions,
  surveySelector,
} from './surveyPageReducer';
import userReducer, { userActions, userSelector } from './userReducer';
import preferenceReducer, {
  preferenceActions,
  preferenceSelector,
} from './preferenceReducer';
import ottTermsReducer, {
  ottTermsActions,
  ottTermsSelector,
} from './ottTermsReducer';

export const actions = {
  ...surveyActions,
  ...userActions,
  ...preferenceActions,
  ...ottTermsActions,
};

export function* rootSaga() {
  yield all([
    loadSurveyRecordSaga(),
    getActorDirectorSaga(),
    submitSurveySaga(),
  ]);
}

const reducer = {
  survey: surveyReducer,
  user: userReducer,
  preference: preferenceReducer,
  ottTerms: ottTermsReducer,
};

export const selector = {
  ...surveySelector,
  ...userSelector,
  ...preferenceSelector,
  ...ottTermsSelector,
};

export default reducer;
