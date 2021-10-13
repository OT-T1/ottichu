import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';
import { contentSelector } from './contentReducer';
import { ottTermsSelector } from './ottTermsReducer';
import { preferenceSelector } from './preferenceReducer';
import { userSelector } from './userReducer';

const initialState = {
  schedulerId: null,
  isLoading: false,
  sectionIndex: 0,
  submitLog: {
    basic: reducerState.initial(false),
    content: reducerState.initial(false),
  },
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    registerScheduler(state, action) {
      state.schedulerId = action.payload;
    },
    clearScheduler(state) {
      clearTimeout(state.schedulerId);
    },
    storeSurveyRecord() {},
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
      const { loading, data, error } = action.payload;
      state.submitLog.content.loading = loading;
      state.submitLog.content.data = !!data || state.submitLog.content.data;
      state.submitLog.content.error = error;
    },
  },
});

const getSchedulerId = (state) => state.survey.schedulerId;
const getSurveyPageStatus = (state) => state.survey.isLoading;
const getSurveySectionIndex = (state) => state.survey.sectionIndex;
const hasBasicInfoSubmited = (state) => !!state.survey.submitLog.basic.data;
const hasContentSubmited = (state) => state.survey.submitLog.content.data;

const getSurveySectionState = createSelector(
  [
    userSelector.isUserInfoAnswered,
    preferenceSelector.isPreferenceAnswered,
    ottTermsSelector.isOttTermsAnswered,
    contentSelector.isContentAnswered,
  ],
  (user, preference, ottTerms, content) => [
    user,
    preference,
    ottTerms,
    content,
  ],
);
const isSectionCompleted = createSelector(
  [getSurveySectionIndex, getSurveySectionState],
  (section, state) => state[section],
);
const getSurveyInfo = createSelector(
  [getSurveySectionIndex, hasBasicInfoSubmited, hasContentSubmited],
  (sectionIndex, basicSubmitLog, contentSubmitLog) => ({
    section: sectionIndex,
    'basic-submit': basicSubmitLog,
    'content-submit': contentSubmitLog,
  }),
);

export const surveyActions = surveySlice.actions;
export const surveySelector = {
  getSchedulerId,
  getSurveyPageStatus,
  getSurveySectionIndex,
  hasBasicInfoSubmited,
  getSurveySectionState,
  isSectionCompleted,
  hasContentSubmited,
  getSurveyInfo,
};
export default surveySlice.reducer;
