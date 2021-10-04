import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  gender: '',
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    saveName(state, action) {
      state.name = action.payload;
    },
    saveGender(state, action) {
      state.gender = action.payload;
    },
  },
});

export const surveyActionCreator = surveySlice.actions;
export default surveySlice.reducer;
