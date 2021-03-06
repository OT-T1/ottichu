import { put, call, select, throttle } from 'redux-saga/effects';
import api from '../../api';
import { reducerState } from '../../utils/reducer';
import { contentActions, contentSelector } from './contentReducer';

const REQ_CONTENT_INFO = 'content/reqContentInfo';

function* getContent(action) {
  try {
    const { user } = action.payload;
    const history = yield select(contentSelector.getContentHistory);
    const response = yield call(api.getContent, {
      user_code: user,
      history: history.join(','),
    });
    yield put(
      contentActions.resContentInfo(reducerState.success(response.contents)),
    );
  } catch (e) {
    yield put(contentActions.resContentInfo(reducerState.failure(e)));
  }
}

function* contentSaga() {
  yield throttle(1000, REQ_CONTENT_INFO, getContent);
}

export default contentSaga;
