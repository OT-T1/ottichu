// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';
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
import contentReducer, {
  contentActions,
  contentSelector,
} from './contentReducer';
import contentSaga from './contentSaga';
import storeCurrentRecordSaga from './storeCurrentRecordSaga';

export const actions = {
  ...surveyActions,
  ...userActions,
  ...preferenceActions,
  ...ottTermsActions,
  ...contentActions,
};

export function* rootSaga() {
  yield all([
    storeCurrentRecordSaga(),
    loadSurveyRecordSaga(),
    getActorDirectorSaga(),
    submitSurveySaga(),
    contentSaga(),
  ]);
}

const reducer = {
  survey: surveyReducer,
  user: userReducer,
  preference: preferenceReducer,
  ottTerms: ottTermsReducer,
  content: contentReducer,
};

// const persistConfig = {
//   key: 'root',
//   storage,
//   blacklist: ['content'],
// };

// const persistedReducer = persistReducer(persistConfig, () => reducers);

export const selector = {
  ...surveySelector,
  ...userSelector,
  ...preferenceSelector,
  ...ottTermsSelector,
  ...contentSelector,
};

export default reducer;
