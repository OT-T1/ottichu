import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // TODO: 컨텐츠 취향 조사
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  // TODO: Define contents Reducers
});

export const contentActionCreator = contentSlice.actions;
export default contentSlice.reducer;
