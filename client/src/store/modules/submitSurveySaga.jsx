import { all, put, call, select, takeLatest } from 'redux-saga/effects';
import api from '../../api';
import { reducerState } from '../../utils/reducer';
import { ottTermsSelector } from './ottTermsReducer';
import { preferenceSelector } from './preferenceReducer';
import { surveyActions } from './surveyPageReducer';
import { userSelector } from './userReducer';

const REQ_SUBMIT_BASIC_INFO = 'survey/requestSubmitBasic';
// const REQ_SUBMIT_FAVORITE_PROGRAMS = 'survey/submitFavoritePrograms';

function* createSubmitData() {
  try {
    const surveyData = yield all([
      select(userSelector.getUserInfo),
      select(preferenceSelector.getPreferenceInfo),
      select(ottTermsSelector.getOttTerms),
    ]);
    return { ...surveyData[0], ...surveyData[1], ...surveyData[2] };
  } catch (e) {
    throw new Error(e);
  }
}

function* submitBasicInfo() {
  try {
    yield put(surveyActions.submitBasicInfo(reducerState.loading()));
    const submitData = yield createSubmitData();
    console.log('제출할 형식: ', submitData);
    const response = yield call(api.submitBasicInfo, submitData);
    console.log('응답!: ', response);
    yield put(surveyActions.submitBasicInfo(reducerState.success(true)));
  } catch (e) {
    yield put(surveyActions.submitBasicInfo(reducerState.failure(e)));
  }
}

function* submitSurveySaga() {
  yield takeLatest(REQ_SUBMIT_BASIC_INFO, submitBasicInfo);
}

export default submitSurveySaga;
