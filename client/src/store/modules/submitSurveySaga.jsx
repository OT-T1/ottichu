import {
  all,
  put,
  call,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import api from '../../api';
import { reducerState } from '../../utils/reducer';
import { contentActions, contentSelector } from './contentReducer';
import { ottTermsSelector } from './ottTermsReducer';
import { preferenceSelector } from './preferenceReducer';
import { surveyActions, surveySelector } from './surveyPageReducer';
import { userActions, userSelector } from './userReducer';

const DATA_TYPE = Object.freeze({
  user: 0,
  preference: 1,
  ottTerms: 2,
});
const REQ_UPDATE_SELECTION_INFO = [
  'user/selectAge',
  'user/selectGender',
  'preference/selectCategories',
  'preference/selectActorDirector',
  'preference/deleteActorDirector',
  'ottTerms/selectOttPrice',
  'ottTerms/selectOttGroupCnt',
  'ottTerms/selectOttFreeTime',
];
const REQ_SUBMIT_BASIC_INFO = 'survey/reqSubmitBasic';
const REQ_SUBMIT_CONTENT = 'survey/reqSubmitContent';

function* clearBasicSubmitRecord() {
  const submitBasic = yield select(surveySelector.hasBasicInfoSubmited);
  if (submitBasic) {
    yield put(surveyActions.clearBasicSubmitRecord());
  }
}

function* createSubmitData() {
  try {
    const surveyData = yield all([
      select(userSelector.getUserInfo),
      select(preferenceSelector.getPreferenceInfo),
      select(ottTermsSelector.getOttTerms),
    ]);
    return {
      age: surveyData[DATA_TYPE.user].age,
      gender: surveyData[DATA_TYPE.user].gender,
      ...surveyData[DATA_TYPE.preference],
      ...surveyData[DATA_TYPE.ottTerms],
    };
  } catch (e) {
    throw new Error(e);
  }
}

function* submitBasicInfo() {
  try {
    const submitData = yield createSubmitData();
    // 사용자 기본 정보 제출
    const response = yield call(api.submitBasicInfo, submitData);
    yield put(surveyActions.resSubmitBasic(reducerState.success(true)));
    // 응답받은 사용자 코드 등록
    yield put(userActions.registerUserCode(response.user_code));
    // 컨텐츠 정보 요청
    yield put(contentActions.reqContentInfo(response.user_code));
  } catch (e) {
    yield put(surveyActions.resSubmitBasic(reducerState.failure(e)));
  }
}

function* submitContent(action) {
  try {
    const { result } = action.payload;
    const user = yield select(userSelector.getUser);
    const submitData = yield select(contentSelector.getSelectedContent);
    yield call(api.submitContent, { user_code: user, contents: submitData });
    yield put(surveyActions.resSubmitContent(reducerState.success()));
    if (!result) {
      yield put(contentActions.reqContentInfo(user));
    } else {
      // TODO: 결과 요청 후 history push
      // yield put(contentActions.reqContentInfo());
    }
  } catch (e) {
    yield put(surveyActions.resSubmitContent(reducerState.failure(e)));
  }
}

function* submitSurveySaga() {
  yield takeEvery(REQ_UPDATE_SELECTION_INFO, clearBasicSubmitRecord);
  yield takeLatest(REQ_SUBMIT_BASIC_INFO, submitBasicInfo);
  yield takeLatest(REQ_SUBMIT_CONTENT, submitContent);
}

export default submitSurveySaga;
