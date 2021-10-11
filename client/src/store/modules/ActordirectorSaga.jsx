import { put, call, throttle } from 'redux-saga/effects';
import api from '../../api';
import { reducerState } from '../../utils/reducer';
import { surveyActions } from './surveyPageReducer';

const REQ_GET_DIRECTORS = 'preference/loadDirectors';
// const REQ_GET_ACTORS = 'preference/loadActors';

// function* getActors(action) {
//   try {
//     const data = yield call(api.getActor, action.payload.params);
//   } catch (e) {}
// }

function* getDirectors(action) {
  try {
    const data = yield call(api.getDirectors, action.payload.params);
    yield put(
      surveyActions.loadDirectors(reducerState.success(data?.directors)),
    );
  } catch (e) {
    yield put(surveyActions.loadDirectors(reducerState.failure(true)));
  }
}

function* getActorDirectorSaga() {
  yield throttle(300, REQ_GET_DIRECTORS, getDirectors);
  // yield throttle(300, REQ_GET_ACTORS, getActors);
}

export default getActorDirectorSaga;
