import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';
import { ottTermsSelector } from './ottTermsReducer';
import { preferenceSelector } from './preferenceReducer';
import { userSelector } from './userReducer';

const initialState = {
  isLoading: false,
  sectionIndex: 0,
  slideIndex: 0,
  directors: reducerState.initial([]),
  actors: reducerState.initial([]),
  submitLog: {
    basic: reducerState.initial(false),
    content: reducerState.initial([false, false, false, false, false]),
  },
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    requestLoad() {},
    requestSubmitBasic() {},
    isDataLoading(state, action) {
      state.isLoading = action.payload;
    },
    movePage(state, action) {
      const { section, slide } = action.payload;
      state.sectionIndex = section;
      state.slideIndex = slide;
    },
    loadDirectors(state, action) {
      state.directors.data.concat(action.payload); // TODO: Need fix
    },
    loadActors(state, action) {
      state.actors.data.concat(action.payload); // TODO: Need fix
    },
    submitBasicInfo(state, action) {
      const { loading, data, error } = action.payload;
      // TODO: 이후 api 호출과 관련된 리듀서들을 어떻게 함수화 시켜서 재사용할지 아직 감이 안온다... 일단, 맨들고 생각하기!
      if (loading) {
        return;
      }
      state.submitLog.basic.data = !!data;
      state.submitLog.basic.error = error;
    },
    // submitFavoriteContent(state, action) {},
  },
});

const getSurveyPageStatus = (state) => state.survey.isLoading;
const getSurveySectionIndex = (state) => state.survey.sectionIndex;
const getSurveySlideIndex = (state) => state.survey.slideIndex;
// TODO: Add get directors & actors
const isBasicInfoSubmit = (state) => !!state.survey.submitLog.basic.data;
const getSubmitLogOfContent = (state) => state.survey.submitLog.content.data;

const getSurveySectionState = createSelector(
  [
    userSelector.isUserInfoAnswered,
    preferenceSelector.isPreferenceAnswered,
    ottTermsSelector.isOttTermsAnswered,
  ],
  (user, preference, ottTerms) => [
    [user],
    [preference],
    [ottTerms],
    [false, false, false, false],
  ],
);
const isSlideSubmit = (slide) =>
  createSelector([getSubmitLogOfContent], (submitLog) => !!submitLog[slide]);
const isSurveyCompleted = createSelector(
  [getSurveySectionIndex, getSurveySlideIndex, getSurveySectionState],
  (section, slide, state) => state[section][slide],
);

export const surveyActions = surveySlice.actions;
export const surveySelector = {
  getSurveyPageStatus,
  getSurveySectionIndex,
  getSurveySlideIndex,
  getSubmitLogOfContent,
  getSurveySectionState,
  isSurveyCompleted,
  isBasicInfoSubmit,
  isSlideSubmit,
};
export default surveySlice.reducer;
