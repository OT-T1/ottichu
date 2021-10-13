import { all, put, takeEvery } from 'redux-saga/effects';
import { preferenceActions } from './preferenceReducer';
import { surveyActions } from './surveyPageReducer';
import { userActions } from './userReducer';
// import history from '../../utils/history';
import { ottTermsActions } from './ottTermsReducer';

const LOAD_PREVIOUS_RECORD = 'survey/loadPreviousRecord';

function* loadPreviousRecord(action) {
  const record = JSON.parse(action.payload);
  yield all([
    put(
      userActions.loadUserInfo({
        user: record?.user,
        age: record?.age,
        gender: record?.gender,
      }),
    ),
    put(
      preferenceActions.loadPreference({
        categories: record?.categories,
        directors: record?.directors,
        actors: record?.actors,
      }),
    ),
    put(
      ottTermsActions.loadOttTerms({
        price: record['ott-price'],
        group: record['ott-people'],
        freetime: record['free-time'],
      }),
    ),
    put(
      surveyActions.finishRecordLoad({
        section: record?.section,
        basicSubmitLog: record['basic-submit'],
        contentSubmitLog: record['content-submit'],
      }),
    ), // TODO: Add user_code
  ]);

  // TODO: 빠가다 히스토리 수정 요망
  // history.push(`/survey#${record?.section + 1}`);
}

function* loadPreviousRecordSaga() {
  yield takeEvery(LOAD_PREVIOUS_RECORD, loadPreviousRecord);
}

export default loadPreviousRecordSaga;
