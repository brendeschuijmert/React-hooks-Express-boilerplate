import { call, put, takeLatest, select } from 'redux-saga/effects';
import get from 'lodash/get';

import { isUser } from '../../../../utils/permission';
import request from '../../../../utils/apiRequest';
import notify from '../../../../utils/notify';
import { history } from '../../../../configureStore';

import * as CONSTANTS from './constants';
import {
  reviewListRequest,
  reviewListSuccess,
  reviewListError,
  reviewLoadSuccess,
  reviewLoadError,
  reviewSaveSuccess,
  reviewSaveError,
  reviewDeleteSuccess,
  reviewDeleteError,
  reviewReplySuccess,
  reviewReplyError,
  pendingReviewSuccess,
  pendingReivewError,
} from './actions';
import { selectReview } from './selectors';
import { selectCurrentUser } from '../../../auth/redux/selectors';

export function* reviewList(action) {
  try {
    const requestData = {
      skip: action.payload.skip,
      limit: action.payload.limit,
    };
    const { list, totalCount, maxReview, minReview, avgRating } = yield call(
      request,
      `/restaurants/${action.payload.id}/reviews`,
      'GET',
      requestData,
      true,
    );
    yield put(
      reviewListSuccess(list, totalCount, maxReview, minReview, avgRating),
    );
  } catch (err) {
    notify('error', err.message);
    yield put(reviewListError(err));
  }
}

export function* pendingReviewRequest(action) {
  try {
    const requestData = {
      skip: action.payload.skip,
      limit: action.payload.limit,
    };
    const { totalCount, list } = yield call(
      request,
      `/restaurants/reviews`,
      'GET',
      requestData,
      true,
    );

    yield put(pendingReviewSuccess(list, totalCount));
  } catch (error) {
    notify('error', 'Errors in fetching pending reviews');
    yield put(pendingReivewError(error));
  }
}
export function* reviewLoadRequest(action) {
  try {
    const data = yield call(
      request,
      `/restaurants/${action.restaurantId}/reviews/${action.id}`,
      'GET',
      null,
      true,
    );
    yield put(reviewLoadSuccess(data));
  } catch (err) {
    yield put(reviewLoadError(err));
  }
}

export function* reviewDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `/restaurants/${action.restaurantId}/reviews/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(reviewDeleteSuccess(action.id, data));
    yield put(reviewListRequest({ id: action.restaurantId }));
    notify('success', 'The review has been successfully removed!');
  } catch (err) {
    notify('error', 'Failed to remove the review, try again!');
    yield put(reviewDeleteError(err));
  }
}

export function* reviewSaveRequest(action) {
  try {
    const state = yield select();
    const currentUser = selectCurrentUser(state);
    const review = selectReview(state);
    const requestData = review.review.data;
    const id = review.review.id || review.review.data._id;
    let responseData = null;

    if (id === 'new') {
      responseData = yield call(
        request,
        `/restaurants/${action.restaurantId}/reviews`,
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `/restaurants/${action.restaurantId}/reviews/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }

    yield put(reviewSaveSuccess(responseData));
    notify('success', 'The review saved successfully!');

    isUser(currentUser)
      ? history.push(`/restaurants`)
      : history.push(`/restaurants/${action.restaurantId}/reviews`);
  } catch (err) {
    notify('error', 'Saving the reviwe failed, try again!');
    yield put(reviewSaveError(err));
  }
}

export function* reviewReplyRequest(action) {
  try {
    const state = yield select();
    const review = selectReview(state);
    const requestData = get(review, 'review.data');
    let responseData = null;

    responseData = yield call(
      request,
      `/restaurants/${action.restaurantId}/reviews/${action.reviewId}`,
      'PUT',
      { ...requestData },
      true,
    );

    yield put(reviewReplySuccess(responseData));
    yield put(reviewListRequest({ id: action.restaurantId }));
    notify('succss', 'The review has been successfully saved!');
  } catch (err) {
    notify('error', err.message);
    yield put(reviewReplyError(err));
  }
}

export function* reviewSaga() {
  yield takeLatest(CONSTANTS.REVIEW_LIST_REQUEST, reviewList);
  yield takeLatest(CONSTANTS.PENDING_REVIEW_REQUEST, pendingReviewRequest);
  yield takeLatest(CONSTANTS.REVIEW_LOAD_REQUEST, reviewLoadRequest);
  yield takeLatest(CONSTANTS.REVIEW_SAVE_REQUEST, reviewSaveRequest);
  yield takeLatest(CONSTANTS.REVIEW_DELETE_REQUEST, reviewDeleteRequest);
  yield takeLatest(CONSTANTS.REVIEW_REPLY_REQUEST, reviewReplyRequest);
}
