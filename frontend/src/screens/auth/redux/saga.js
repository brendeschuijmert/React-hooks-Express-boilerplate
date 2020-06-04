import { put, takeLatest, call } from 'redux-saga/effects';
import * as CONSTANTS from './constants';

import {
  signupError,
  signupSuccess,
  loginError,
  loginSuccess,
} from './actions';

import { history } from '../../../configureStore';
import request from '../../../utils/apiRequest';
import notify from '../../../utils/notify';

function* signup(action) {
  try {
    const data = yield call(
      request,
      '/auth/signup',
      'POST',
      action.data,
      false,
    );

    yield put(signupSuccess(data));
    notify('success', 'Successfully registered');
    history.push('/auth/login');
  } catch (err) {
    notify('error', err.message);
    yield put(signupError());
  }
}

function* signin(action) {
  try {
    const requestData = {
      email: action.email,
      password: action.password,
    };
    const data = yield call(request, '/auth/login', 'POST', requestData, false);
    yield put(loginSuccess(data));
    notify('success', 'You are successfully logged in!');
    history.push('/');
  } catch (err) {
    notify('error', err.message);
    yield put(loginError());
  }
}

export function* authSaga() {
  yield takeLatest(CONSTANTS.SIGNUP_REQUEST, signup);
  yield takeLatest(CONSTANTS.LOGIN_REQUEST, signin);
}
