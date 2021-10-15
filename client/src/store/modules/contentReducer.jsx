import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';

const initialState = {
  onAlarm: false,
  onConfirm: false,
  history: [],
  selectedContent: {},
  contentList: reducerState.initial(null),
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    activateAlarm(state) {
      state.onAlarm = true;
    },
    closeAlarm(state) {
      state.onAlarm = false;
    },
    activateConfirm(state) {
      state.onConfirm = true;
    },
    closeConfirm(state) {
      state.onConfirm = false;
    },
    reqContentInfo(state, action) {
      const { refresh } = action.payload;
      if (
        refresh ||
        (state.contentList.data &&
          Object.keys(state.selectedContent).length !== 0)
      ) {
        state.history = state.history.concat(
          state.contentList.data.map(([code]) => code),
        );
      }
      state.selectedContent = {};
      state.contentList = reducerState.loading();
    },
    resContentInfo(state, action) {
      state.contentList = action.payload;
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

const isAlarmActivated = (state) => state.content.onAlarm;
const isConfirmActivated = (state) => state.content.onConfirm;
const getContentHistory = (state) => state.content.history;
const getSelectionStorage = (state) => state.content.selectedContent;
const getContentList = (state) => state.content.contentList;

const getSelectedContent = createSelector([getSelectionStorage], (storage) =>
  Object.keys(storage),
);

const isContentAnswered = createSelector(
  [getSelectedContent],
  (selectedContent) => selectedContent && !!selectedContent.length,
);

export const contentActions = contentSlice.actions;
export const contentSelector = {
  isAlarmActivated,
  isConfirmActivated,
  getContentHistory,
  getSelectionStorage,
  getContentList,
  getSelectedContent,
  isContentAnswered,
};
export default contentSlice.reducer;
