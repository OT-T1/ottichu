// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   sectionIndex: 0,
//   confirmActivate: false,
//   isMoving: false,
// };

// const mainSlice = createSlice({
//   name: 'main',
//   initialState,
//   reducers: {
//     activateConfirm(state, action) {
//       state.confirmActivate = action.payload;
//     },
//     moveSection(state, action) {
//       state.isMoving = true;
//       state.sectionIndex = action.payload;
//     },
//     completedMove(state) {
//       state.isMoving = false;
//     },
//   },
// });

// const getMainSectionIndex = (state) => state.main.sectionIndex;
// const isSectionMoving = (state) => state.main.isMoving;
// const isConfirmActivate = (state) => state.main.confirmActivate;

// export const mainActions = mainSlice.actions;
// export const mainSelector = {
//   getMainSectionIndex,
//   isSectionMoving,
//   isConfirmActivate,
// };
// export default mainSlice.reducer;
