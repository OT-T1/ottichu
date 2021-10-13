import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';

const initialState = {
  selectedContent: {},
  contentList: reducerState.initial(null),
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearSelectionStorage(state) {
      state.selectedContent = {};
    },
    reqContentInfo(state) {
      // TODO: 날릴지 말지 상태보고 결정!
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
  getSelectionStorage,
  getContentList,
  getSelectedContent,
  isContentAnswered,
};
export default contentSlice.reducer;
