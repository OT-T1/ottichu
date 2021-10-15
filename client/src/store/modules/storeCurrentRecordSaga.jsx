import { all, call, select, takeEvery } from 'redux-saga/effects';
import { ottTermsSelector } from './ottTermsReducer';
import { preferenceSelector } from './preferenceReducer';
import { surveySelector } from './surveyPageReducer';
import { userSelector } from './userReducer';

const DATA_TYPE = Object.freeze({
  survey: 0,
  user: 1,
  preference: 2,
  ottTerms: 3,
});
const STORE_SURVEY_RECORD = [
  'user/selectAge',
  'user/selectGender',
  'preference/selectCategories',
  'preference/selectActorDirector',
  'preference/deleteActorDirector',
  'ottTerms/selectOttPrice',
  'ottTerms/selectOttGroupCnt',
  'ottTerms/selectOttFreeTime',
];

function* createRecordForm() {
  const recordData = yield all([
    select(surveySelector.getSurveyInfo),
    select(userSelector.getUserInfo),
    select(preferenceSelector.getPreferenceRecord),
    select(ottTermsSelector.getOttTerms),
  ]);

  return {
    ...recordData[DATA_TYPE.survey],
    ...recordData[DATA_TYPE.user],
    ...recordData[DATA_TYPE.preference],
    ...recordData[DATA_TYPE.ottTerms],
  };
}

function* storeSurveyRecord() {
  try {
    const recordData = yield createRecordForm();
    yield call(
      [window.localStorage, 'setItem'],
      'ottichu',
      JSON.stringify(recordData),
    );
  } catch (e) {
    console.error(e);
  }
}

function* storeCurrentRecordSaga() {
  yield takeEvery(STORE_SURVEY_RECORD, storeSurveyRecord);
}

export default storeCurrentRecordSaga;
