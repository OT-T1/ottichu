import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducer, { rootSaga } from './modules';
import history from '../utils/history';

const sagaMiddleware = createSagaMiddleware({
  context: { history },
});

const store = configureStore({
  reducer,
  middleware: [sagaMiddleware, logger],
});

sagaMiddleware.run(rootSaga);

export default store;
