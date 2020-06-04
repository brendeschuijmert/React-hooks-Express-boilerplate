import { combineReducers } from 'redux';

import { userReducer } from '../User/redux/reducers';
import { reviewReducer } from '../Review/redux/reducers';
import { restaurantReducer } from '../Restaurant/redux/reducers';

export const appReducer = combineReducers({
  userState: userReducer,
  reviewState: reviewReducer,
  restaurantState: restaurantReducer,
});
