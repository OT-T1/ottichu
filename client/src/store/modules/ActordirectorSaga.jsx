import { put, call, select, throttle } from 'redux-saga/effects';
import api from '../../api';
import { reducerState } from '../../utils/reducer';
import { preferenceActions, preferenceSelector } from './preferenceReducer';

const REQ_DIRECTOR_LIST = 'preference/reqDirectors';
const REQ_ACTOR_LIST = 'preference/reqActors';

function* getDirectors(action) {
  try {
    const response = yield call(api.getDirectors, { query: action.payload });
    // Race Condition 처리
    const current = yield select(preferenceSelector.getKeywordDirector);
    if (current !== action.payload) {
      return;
    }
    yield put(
      preferenceActions.resDirectors(reducerState.success(response.directors)),
    );
  } catch (e) {
    yield put(preferenceActions.resDirectors(reducerState.failure(e))); // TODO: 에러메시지 정하기!
  }
}

function* getActors(action) {
  try {
    const response = yield call(api.getActors, { query: action.payload });
    // Race Condition 처리
    const current = yield select(preferenceSelector.getKeywordActor);
    if (current !== action.payload) {
      return;
    }
    yield put(
      preferenceActions.resActors(reducerState.success(response.actors)),
    );
  } catch (e) {
    yield put(preferenceActions.resActors(reducerState.failure(e))); // TODO: 에러메시지 정하기!
  }
}

function* getActorDirectorSaga() {
  yield throttle(300, REQ_DIRECTOR_LIST, getDirectors);
  yield throttle(300, REQ_ACTOR_LIST, getActors);
}

export default getActorDirectorSaga;
