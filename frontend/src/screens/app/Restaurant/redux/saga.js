import { call, put, takeLatest, select } from 'redux-saga/effects';
import get from 'lodash/get';

import * as CONSTANTS from './constants';
import {
  restaurantListSuccess,
  restaurantListError,
  restaurantLoadSuccess,
  restaurantLoadError,
  restaurantSaveSuccess,
  restaurantSaveError,
  restaurantDeleteSuccess,
  restaurantDeleteError,
} from './actions';
import request from '../../../../utils/apiRequest';
import { history } from '../../../../configureStore';
import notify from '../../../../utils/notify';
import { selectRestaurant } from './selectors';

export function* restaurantListRequest(action) {
  try {
    const requestData = {
      skip: action.payload.skip,
      limit: action.payload.limit,
      filters: action.payload.filters,
    };
    const { list, totalCount } = yield call(
      request,
      '/restaurants',
      'GET',
      requestData,
      true,
    );

    yield put(restaurantListSuccess(list, totalCount));
    history.push(`/restaurants`);
  } catch (err) {
    yield put(restaurantListError(err));
  }
}

export function* restaurantLoadRequest(action) {
  try {
    const data = yield call(
      request,
      `/restaurants/${action.id}`,
      'GET',
      null,
      true,
    );

    yield put(restaurantLoadSuccess(data));
  } catch (err) {
    yield put(restaurantLoadError(err));
  }
}

export function* restaurantDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `/restaurants/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(restaurantDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(restaurantDeleteError(err));
  }
}

export function* restaurantSaveRequest() {
  try {
    const state = yield select();
    const restaurant = selectRestaurant(state);
    const requestData = get(restaurant, 'restaurant.data');
    const id = get(restaurant, 'restaurant.id');
    let responseData = null;

    if (id === 'new') {
      responseData = yield call(
        request,
        '/restaurants',
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `/restaurants/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }
    history.push('/restaurants');
    notify('success', 'The restaurant has been saved succcessfully');

    yield put(restaurantSaveSuccess(responseData));
  } catch (err) {
    notify('error', 'Failed to save the restaurant, try again!');
    yield put(restaurantSaveError(err));
  }
}

export function* restaurantSaga() {
  yield takeLatest(CONSTANTS.RESTAURANT_LIST_REQUEST, restaurantListRequest);
  yield takeLatest(CONSTANTS.RESTAURANT_LOAD_REQUEST, restaurantLoadRequest);
  yield takeLatest(CONSTANTS.RESTAURANT_SAVE_REQUEST, restaurantSaveRequest);
  yield takeLatest(
    CONSTANTS.RESTAURANT_DELETE_REQUEST,
    restaurantDeleteRequest,
  );
}
