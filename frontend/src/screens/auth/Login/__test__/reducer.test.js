import produce from 'immer';

import { authReducer } from '../../redux/reducers';
import { loginError, loginRequest, loginSuccess } from '../../redux/actions';

/* eslint-disable default-case, no-param-reassign */
describe('authReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      currentUser: null,
      token: '',
      loading: false,
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(authReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the login request action correctly', () => {
    const expectedResult = produce(state, draft => {
      draft.loading = true;
    });

    expect(authReducer(state, loginRequest())).toEqual(expectedResult);
  });

  it('should handle the login success action correctly', () => {
    const user = {};
    const token = 'test';
    const expectedResult = produce(state, draft => {
      draft.currentUser = user;
      draft.loading = false;
      draft.token = token;
    });

    expect(authReducer(state, loginSuccess({ user, token }))).toEqual(
      expectedResult,
    );
  });

  it('should handle the login error action correctly', () => {
    const expectedResult = produce(state, draft => {
      draft.loading = false;
    });

    expect(authReducer(state, loginError())).toEqual(expectedResult);
  });
});
