import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';

const initialState = {
  history: [],
  selectedContent: {},
  contentList: reducerState.initial(null),
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    reqContentInfo(state) {
      if (state.contentList.data) {
        state.history = state.history.concat(
          state.contentList.data.map(([code]) => code),
        );
      }
      state.selectedContent = {};
      state.contentList = reducerState.loading(state.contentList);
    },
    resContentInfo(state, action) {
      state.contentList = action.payload;
      // TODO: 에러 시 데이터 날릴지 말지 보고 결정!
    },
    selectContent(state, action) {
      const code = action.payload;
      if (code in state.selectedContent) {
        delete state.selectedContent[code];
        return;
      }
      state.selectedContent[code] = true;
    },
  },
});

const getContentHistory = (state) => state.content.history;
const getSelectionStorage = (state) => state.content.selectedContent;
const getContentList = (state) => state.content.contentList;

const getSelectedContent = createSelector([getSelectionStorage], (storage) =>
  Object.keys(storage),
);

const isContentAnswered = createSelector(
  [getSelectedContent],
  (selectedContent) => !!selectedContent && !!selectedContent.length,
);

export const contentActions = contentSlice.actions;
export const contentSelector = {
  getContentHistory,
  getSelectionStorage,
  getContentList,
  getSelectedContent,
  isContentAnswered,
};
export default contentSlice.reducer;
