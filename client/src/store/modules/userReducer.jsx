import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  age: '',
  gender: '',
  // TODO: 추가 정보(즐기는 컨텐츠, 좋아하는 감독, 배우 등)
  // contents: {
  //   krMovie:,
  //   frMovie:,
  //   krDrama:,
  //   usDrama:,
  // },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveAge(state, action) {
      if (state.age === action.payload) {
        return;
      }
      state.age = action.payload;
    },
    saveGender(state, action) {
      if (state.gender === action.payload) {
        return;
      }
      state.gender = action.payload;
    },
    // TODO: 회원가입을 할거라면?
    // saveName(state, action) {
    //   userName = action.payload;
    //   valid_form = /^([a-zA-Z]|[가-힣]){2,50}$/;
    //   if (!userName || !valid_form.test(userName)) {
    //     return state;
    //   }
    //   state.name = action.payload;
    // },
  },
});

const getUserAge = (state) => state.user.age;
const getGender = (state) => state.user.gender;
const isUserSectionAnswered = createSelector(
  [getUserAge, getGender],
  (userAge, userGender) => !!(userAge && userGender),
);

export const userActionCreator = userSlice.actions;
export const userSelector = {
  getUserAge,
  getGender,
  isUserSectionAnswered,
};
export default userSlice.reducer;
