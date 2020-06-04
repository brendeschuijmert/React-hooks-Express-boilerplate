import * as CONSTANTS from './constants';
import produce from 'immer';

const initialState = {
  currentUser: null,
  token: '',
  loading: false,
};

const authReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOGIN_REQUEST:
        draft.loading = true;
        break;
      case CONSTANTS.LOGIN_SUCCESS:
        draft.loading = false;
        draft.currentUser = action.payload.user;
        draft.token = action.payload.token;
        break;
      case CONSTANTS.LOGIN_ERROR:
        draft.loading = false;
        break;
      case CONSTANTS.SIGNUP_REQUEST:
        draft.loading = true;
        break;
      case CONSTANTS.SIGNUP_SUCCESS:
        draft.loading = false;
        break;
      case CONSTANTS.SIGNUP_ERROR:
        draft.loading = false;
        break;
      case CONSTANTS.LOGOUT:
        draft.currentUser = null;
        draft.token = '';
        break;
      default:
        break;
    }
  });

export { authReducer };
