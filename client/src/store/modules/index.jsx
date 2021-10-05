import contentReducer, { contentActionCreator } from './contentReducer';
import sectionReducer, {
  sectionActionCreator,
  sectionSelector,
} from './sectionReducer';
import userReducer, { userActionCreator, userSelector } from './userReducer';

export const actionCreator = {
  ...sectionActionCreator,
  ...userActionCreator,
  ...contentActionCreator,
};

const reducer = {
  section: sectionReducer,
  user: userReducer,
  contents: contentReducer,
};

export const selector = {
  ...sectionSelector,
  ...userSelector,
};

export default reducer;
