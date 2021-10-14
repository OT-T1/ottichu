import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  price: 0,
  groupCnt: 1,
  freeTime: 0,
};

const ottTermsSlice = createSlice({
  name: 'ottTerms',
  initialState,
  reducers: {
    loadOttTerms(state, action) {
      const { price, group, freetime } = action.payload;
      state.price = price;
      state.groupCnt = group;
      state.freeTime = freetime;
    },
    selectOttPrice(state, action) {
      state.price = Number(action.payload);
    },
    selectOttGroupCnt(state, action) {
      state.groupCnt = Number(action.payload);
    },
    selectOttFreeTime(state, action) {
      state.freeTime = Number(action.payload);
    },
  },
});

const getOttPrice = (state) => state.ottTerms.price;
const getOttGroupCnt = (state) => state.ottTerms.groupCnt;
const getOttFreeTime = (state) => state.ottTerms.freeTime;

const isOttTermsAnswered = createSelector(
  [getOttPrice, getOttFreeTime],
  (price, freetime) => !!price && !!freetime,
);
const getOttTerms = createSelector(
  [getOttPrice, getOttGroupCnt, getOttFreeTime],
  (price, group, freetime) => ({
    'ott-price': price,
    'ott-people': group,
    'free-time': freetime,
  }),
);

export const ottTermsActions = ottTermsSlice.actions;
export const ottTermsSelector = {
  getOttPrice,
  getOttGroupCnt,
  getOttFreeTime,
  isOttTermsAnswered,
  getOttTerms,
};
export default ottTermsSlice.reducer;
