import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  age: '',
  gender: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUserInfo(state, action) {
      const { age, gender } = action.payload;
      state.age = age || initialState.age;
      state.gender = gender || initialState.gender;
    },
    selectAge(state, action) {
      if (state.age === action.payload) {
        return;
      }
      state.age = action.payload;
    },
    selectGender(state, action) {
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
const getUserGender = (state) => state.user.gender;

const isUserInfoAnswered = createSelector(
  [getUserAge, getUserGender],
  (age, gender) => !!(age && gender),
);
const getUserInfo = createSelector(
  [getUserAge, getUserGender],
  (age, gender) => ({
    age,
    gender,
  }),
);

export const userActions = userSlice.actions;
export const userSelector = {
  getUserAge,
  getUserGender,
  isUserInfoAnswered,
  getUserInfo,
};
export default userSlice.reducer;
