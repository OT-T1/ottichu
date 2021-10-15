import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';
import { contentSelector } from './contentReducer';
import { ottTermsSelector } from './ottTermsReducer';
import { preferenceSelector } from './preferenceReducer';
import { userSelector } from './userReducer';

const initialState = {
  isLoading: false,
  sectionIndex: 0,
  submitLog: {
    basic: reducerState.initial(false),
    content: reducerState.initial(0),
  },
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    registerScheduler(state, action) {
      state.schedulerId = action.payload;
    },
    loadPreviousRecord(state) {
      state.isLoading = true;
    },
    finishRecordLoad(state, action) {
      const { section, basicSubmitLog, contentSubmitLog } = action.payload;
      state.sectionIndex = section;
      state.submitLog.basic.data = basicSubmitLog;
      state.submitLog.content.data = contentSubmitLog;
      state.isLoading = false;
    },
    movePage(state, action) {
      state.sectionIndex = action.payload;
    },
    clearBasicSubmitRecord(state) {
      if (state.submitLog.basic.data) {
        state.submitLog.basic.data = false;
      }
    },
    reqSubmitBasic(state) {
      state.submitLog.basic = reducerState.loading(false);
    },
    resSubmitBasic(state, action) {
      const { loading, data, error } = action.payload;
      state.submitLog.basic.loading = loading;
      state.submitLog.basic.data = !!data;
      state.submitLog.basic.error = error;
    },
    reqSubmitContent(state) {
      state.submitLog.content = reducerState.loading(
        state.submitLog.content.data,
      );
    },
    resSubmitContent(state, action) {
      const { loading, error } = action.payload;
      state.submitLog.content.loading = loading;
      state.submitLog.content.data = error
        ? state.submitLog.content.data
        : state.submitLog.content.data + 1;
      state.submitLog.content.error = error;
    },
  },
});

const getSurveyPageStatus = (state) => state.survey.isLoading;
const getSurveySectionIndex = (state) => state.survey.sectionIndex;
const hasBasicInfoSubmited = (state) => !!state.survey.submitLog.basic.data;
const getContentSubmitCnt = (state) => state.survey.submitLog.content.data;

const getSurveySectionState = createSelector(
  [
    userSelector.isUserInfoAnswered,
    preferenceSelector.isPreferenceAnswered,
    ottTermsSelector.isOttTermsAnswered,
    contentSelector.isContentAnswered,
    getContentSubmitCnt,
  ],
  (user, preference, ottTerms, content, contentSubmitCnt) => [
    user,
    preference,
    ottTerms,
    contentSubmitCnt || content,
  ],
);
const isSectionCompleted = createSelector(
  [getSurveySectionIndex, getSurveySectionState],
  (section, state) => state[section],
);
const getSurveyInfo = createSelector(
  [getSurveySectionIndex, hasBasicInfoSubmited, getContentSubmitCnt],
  (sectionIndex, basicSubmitLog, contentSubmitLog) => ({
    section: sectionIndex,
    'basic-submit': basicSubmitLog,
    'content-submit': contentSubmitLog,
  }),
);

export const surveyActions = surveySlice.actions;
export const surveySelector = {
  getSurveyPageStatus,
  getSurveySectionIndex,
  hasBasicInfoSubmited,
  getSurveySectionState,
  isSectionCompleted,
  getContentSubmitCnt,
  getSurveyInfo,
};
export default surveySlice.reducer;
