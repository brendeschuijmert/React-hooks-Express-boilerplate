import { call, put, takeLatest, select } from 'redux-saga/effects';

import * as CONSTANTS from './constants';
import {
  userListSuccess,
  userListError,
  userLoadSuccess,
  userLoadError,
  userSaveSuccess,
  userSaveError,
  userDeleteSuccess,
  userDeleteError,
} from './actions';
import { selectUser } from './selectors';
import request from '../../../../utils/apiRequest';
import notify from '../../../../utils/notify';
import { history } from '../../../../configureStore';

export function* userListRequest(action) {
  try {
    const requestData = {
      skip: action.payload.skip,
      limit: action.payload.limit,
      filters: action.payload.filters,
    };

    const { list, totalCount } = yield call(
      request,
      '/users',
      'GET',
      requestData,
      true,
    );
    yield put(userListSuccess(list, totalCount));
  } catch (err) {
    yield put(userListError(err));
  }
}

export function* userLoadRequest(action) {
  try {
    const data = yield call(request, `/users/${action.id}`, 'GET', null, true);
    yield put(userLoadSuccess(data));
  } catch (err) {
    yield put(userLoadError(err));
  }
}

export function* userDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `/users/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(userDeleteSuccess(action.id, data));
    notify('info', 'The user has been removed successfully!');
  } catch (err) {
    notify('error', 'An error occured in removing user.');
    yield put(userDeleteError(err));
  }
}

export function* userSaveRequest() {
  try {
    const state = yield select();
    const user = selectUser(state);
    const requestData = user.user.data;
    const id = user.user.id;
    let responseData = null;

    if (id === 'new') {
      responseData = yield call(
        request,
        '/users',
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `/users/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }

    yield put(userSaveSuccess(responseData));
    notify('success', 'User saved');
    history.push('/users');
  } catch (err) {
    notify('error', err.message);
    yield put(userSaveError(err));
  }
}

export function* userSaga() {
  yield takeLatest(CONSTANTS.USER_LIST_REQUEST, userListRequest);
  yield takeLatest(CONSTANTS.USER_LOAD_REQUEST, userLoadRequest);
  yield takeLatest(CONSTANTS.USER_SAVE_REQUEST, userSaveRequest);
  yield takeLatest(CONSTANTS.USER_DELETE_REQUEST, userDeleteRequest);
}
