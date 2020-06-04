import { createSelector } from 'reselect';
import get from 'lodash/get';

const selectReview = state => get(state, 'app.reviewState');

const makeSelectReviewList = () =>
  createSelector(selectReview, reviewState => get(reviewState, 'reviews.list'));

const makeSelectReviewListLoading = () =>
  createSelector(selectReview, reviewState =>
    get(reviewState, 'reviews.loading'),
  );
const makeSelectReview = () =>
  createSelector(selectReview, reviewState => get(reviewState, 'review.data'));

const makeSelectReviewLoading = () =>
  createSelector(selectReview, reviewState =>
    get(reviewState, 'review.loading'),
  );

export {
  selectReview,
  makeSelectReviewList,
  makeSelectReviewListLoading,
  makeSelectReview,
  makeSelectReviewLoading,
};
