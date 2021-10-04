import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import reducer from './modules';

const store = configureStore({
  reducer,
  middleware: [logger],
});

export default store;
