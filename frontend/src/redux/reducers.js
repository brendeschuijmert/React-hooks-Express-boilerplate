import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { authReducer } from '../screens/auth/redux/reducers';
import { appReducer } from '../screens/app/redux/reducers';

const topReducer = combineReducers({
  routing: routerReducer,
  auth: authReducer,
  app: appReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    localStorage.removeItem('persist:root');
    state = undefined;
  }
  return topReducer(state, action);
};

export default rootReducer;
