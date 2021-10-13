import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  age: '',
  gender: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUserInfo(state, action) {
      const { user, age, gender } = action.payload;
      state.user = user;
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
    registerUserCode(state, action) {
      const user = action.payload;
      state.user = user;
    },
  },
});

const getUserAge = (state) => state.user.age;
const getUserGender = (state) => state.user.gender;
const getUser = (state) => state.user.user;

const isUserInfoAnswered = createSelector(
  [getUserAge, getUserGender],
  (age, gender) => !!(age && gender),
);
const getUserInfo = createSelector(
  [getUser, getUserAge, getUserGender],
  (user, age, gender) => ({
    user,
    age,
    gender,
  }),
);

export const userActions = userSlice.actions;
export const userSelector = {
  getUserAge,
  getUserGender,
  getUser,
  isUserInfoAnswered,
  getUserInfo,
};
export default userSlice.reducer;
