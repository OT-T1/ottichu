import { createSlice, createSelector } from '@reduxjs/toolkit';
import { reducerState } from '../../utils/reducer';

const initialState = {
  categories: {},
  actors: {},
  directors: {},
  actorKeyword: '',
  directorKeyword: '',
  vaildActors: reducerState.initial(null),
  validDirectors: reducerState.initial(null),
};

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    loadPreference(state, action) {
      const { categories, directors, actors } = action.payload;
      state.categories = categories;
      state.directors = directors;
      state.actors = actors;
    },
    selectCategories(state, action) {
      const type = action.payload;
      if (type in state.categories) {
        delete state.categories[type];
        return;
      }
      state.categories[type] = true;
    },
    selectActorDirector(state, action) {
      const { type, name } = action.payload;
      if (type === 'actors') {
        state.actors[name] = true;
        state.vaildActors = reducerState.initial(null);
      } else {
        state.directors[name] = true;
        state.validDirectors = reducerState.initial(null);
      }
    },
    deleteActorDirector(state, action) {
      const { type, name } = action.payload;
      const target = type === 'actors' ? state.actors : state.directors;
      delete target[name];
    },
    clearActorsDirectors(state, action) {
      const { type } = action.payload;
      if (type === 'actors') {
        state.validDirectors.data = null;
        state.directorKeyword = '';
      } else if (type === 'directors') {
        state.vaildActors.data = null;
        state.actorKeyword = '';
      } else {
        state.vaildActors.data = null;
        state.actorKeyword = '';
        state.validDirectors.data = null;
        state.directorKeyword = '';
      }
    },
    reqDirectors(state, action) {
      state.validDirectors = reducerState.loading([]);
      state.directorKeyword = action.payload;
    },
    reqActors(state, action) {
      state.vaildActors = reducerState.loading([]);
      state.actorKeyword = action.payload;
    },
    resDirectors(state, action) {
      state.validDirectors = action.payload;
    },
    resActors(state, action) {
      state.vaildActors = action.payload;
    },
  },
});

const getSelectedCategories = (state) => state.preference.categories;
const getDirectors = (state) => state.preference.directors;
const getActors = (state) => state.preference.actors;
// TODO: 에러로 못가져올 떄랑 없을 떄랑 구분해야됨.
const getValidDirectors = (state) => state.preference.validDirectors;
const getValidActors = (state) => state.preference.vaildActors;
const getKeywordDirector = (state) => state.preference.directorKeyword;
const getKeywordActor = (state) => state.preference.actorKeyword;

const isPreferenceAnswered = createSelector(
  [getSelectedCategories],
  (choiceRecord) => !!Object.keys(choiceRecord).length,
);

const getPreferenceInfo = createSelector(
  [getSelectedCategories, getDirectors, getActors],
  (categories, directors, actors) => ({
    categories: Object.keys(categories),
    'favorite-director': Object.keys(directors),
    'favorite-actor': Object.keys(actors),
  }),
);

const getSelectedDirectors = createSelector([getDirectors], (directors) =>
  Object.keys(directors),
);

const getSelectedActors = createSelector([getActors], (actors) =>
  Object.keys(actors),
);

const getPreferenceRecord = createSelector(
  [getSelectedCategories, getDirectors, getActors],
  (categories, directors, actors) => ({
    categories,
    directors,
    actors,
  }),
);

export const preferenceActions = preferenceSlice.actions;
export const preferenceSelector = {
  getSelectedCategories,
  getDirectors,
  getActors,
  getKeywordDirector,
  getKeywordActor,
  getValidDirectors,
  getValidActors,
  getSelectedDirectors,
  getSelectedActors,
  isPreferenceAnswered,
  getPreferenceInfo,
  getPreferenceRecord,
};
export default preferenceSlice.reducer;

// 임시 stay
// kMovie: false,
// fMovie: false,
// kDrama: false,
// fDrama: false,
// kVariety: false,
// fVariety: false,
// kAnimation: false,
// fAnimation: false,
// documentary: false,
