import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userSelector } from './userReducer';

const initialState = {
  index: 0,
};

const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    updateSection(state, action) {
      state.index = action.payload;
    },
  },
});

const getSectionIndex = (state) => state.section.index;
const getSectionsState = createSelector(
  [userSelector.isUserSectionAnswered],
  (userSection) => [userSection, false, false, false],
);

const isSectionCompleted = createSelector(
  [getSectionIndex, getSectionsState],
  (sectionIndex, sectionsState) => sectionsState[sectionIndex],
);

export const sectionActionCreator = sectionSlice.actions;
export const sectionSelector = {
  getSectionIndex,
  getSectionsState,
  isSectionCompleted,
};
export default sectionSlice.reducer;
