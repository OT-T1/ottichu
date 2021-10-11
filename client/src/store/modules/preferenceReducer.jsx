import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  categories: {
    movie: false,
    tvshow: false,
    // kMovie: false,
    // fMovie: false,
    // kDrama: false,
    // fDrama: false,
    // kVariety: false,
    // fVariety: false,
    // kAnimation: false,
    // fAnimation: false,
    // documentary: false,
  },
  actors: {},
  directors: {},
};

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    loadPreference(state, action) {
      const { categories, directors, actors } = action.payload;
      state.categories = categories || initialState.categories;
      state.directors = directors || initialState.directors;
      state.actors = actors || initialState.actors;
    },
    selectCategories(state, action) {
      const type = action.payload;
      state.categories[type] = !state.categories[type];
    },
    // TODO: 임시 에러 방지용(수정 필요)
    selectDirector(state, action) {
      state.directors = action.payload;
    },
    // TODO: 임시 에러 방지용(수정 필요)
    selectActor(state, action) {
      state.actors = action.payload;
    },
    // TODO: 임시 에러 방지용(수정 필요)
    deleteDirector(state, action) {
      delete state.directors[action.payload];
    },
    // TODO: 임시 에러 방지용(수정 필요)
    deleteActor(state, action) {
      delete state.actors[action.payload];
    },
  },
});

const getSelectedCategories = (state) => state.preference.categories;
const getSelectedDirectors = (state) => state.preference.directors;
const getSelectedActors = (state) => state.preference.actors;

const isPreferenceAnswered = createSelector(
  [getSelectedCategories],
  (choiceRecord) =>
    !!Object.values(choiceRecord).filter((choice) => choice).length,
);
const getPreferenceInfo = createSelector(
  [getSelectedCategories, getSelectedDirectors, getSelectedActors],
  (categories, directors, actors) => ({
    categories: Object.keys(categories).filter((type) => categories[type]),
    'favorite-director': Object.keys(directors),
    'favorite-actor': Object.keys(actors),
  }),
);

export const preferenceActions = preferenceSlice.actions;
export const preferenceSelector = {
  getSelectedCategories,
  getSelectedDirectors,
  getSelectedActors,
  isPreferenceAnswered,
  getPreferenceInfo,
};
export default preferenceSlice.reducer;
