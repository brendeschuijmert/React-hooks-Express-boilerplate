import produce from 'immer';
import * as CONSTANTS from './constants';

const newReview = {
  date: new Date(),
};

const initalState = {
  reviews: {
    list: [],
    maxReview: {},
    minReview: {},
    avgRating: 0,
    totalCount: 0,
    loading: false,
  },
  review: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
};

const reviewReducer = (state = initalState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOAD_NEW_REVIEW:
        draft.review = {
          data: newReview,
          id: 'new',
          error: [],
          loading: false,
        };
        break;
      case CONSTANTS.REVIEW_LIST_REQUEST:
        draft.reviews.loading = true;
        break;
      case CONSTANTS.REVIEW_LIST_SUCCESS:
        draft.reviews.list = action.payload.list;
        draft.reviews.totalCount = action.payload.totalCount;
        draft.reviews.minReview = action.payload.minReview;
        draft.reviews.maxReview = action.payload.maxReview;
        draft.reviews.avgRating = action.payload.avgRating;
        draft.reviews.loading = false;
        break;
      case CONSTANTS.REVIEW_LIST_ERROR:
        draft.reviews.loading = true;
        break;
      case CONSTANTS.REVIEW_DELETE_REQUEST:
        draft.reviews.loading = true;
        draft.review.loading = true;
        break;
      case CONSTANTS.REVIEW_DELETE_SUCCESS: {
        const reviewList = state.reviews.list;
        const filteredList = reviewList.filter(
          review => review['_id'] !== action.id,
        );
        draft.reviews.list = filteredList;
        draft.reviews.loading = false;
        draft.review.loading = false;
        break;
      }
      case CONSTANTS.REVIEW_DELETE_ERROR:
        draft.reviews.loading = false;
        draft.review.loading = false;
        break;
      case CONSTANTS.REVIEW_LOAD_REQUEST:
        draft.review.loading = true;
        break;
      case CONSTANTS.REVIEW_LOAD_SUCCESS:
        draft.review.data = action.data;
        draft.review.id = action._id;
        draft.review.loading = false;
        break;
      case CONSTANTS.REVIEW_LOAD_ERROR:
        draft.review.loading = false;
        break;
      case CONSTANTS.REVIEW_SAVE_REQUEST:
        draft.review.loading = true;
        draft.review.error = [];
        break;
      case CONSTANTS.REVIEW_SAVE_SUCCESS:
        draft.review.id = action.data._id;
        draft.review.data.id = action.data._id;
        draft.review.loading = false;
        break;
      case CONSTANTS.REVIEW_SAVE_ERROR:
        draft.review.loading = false;
        draft.review.error = action.data.error;
        break;
      case CONSTANTS.UPDATE_REVIEW_FIELD:
        draft.review.data[action.field] = action.value;
        break;
      case CONSTANTS.REVIEW_REPLY_REQUEST:
        draft.review.loading = true;
        draft.review.data.reply = action.reply;
        break;
      case CONSTANTS.REVIEW_REPLY_SUCCESS:
        draft.review.id = action.data._id;
        draft.review.data.id = action.data._id;
        draft.review.loading = false;
        break;
      case CONSTANTS.PENDING_REVIEW_SUCCESS:
        draft.reviews.list = action.payload.list;
        draft.reviews.totalCount = action.payload.totalCount;
        draft.reviews.loading = false;
        break;
      case CONSTANTS.PENDING_REVIEW_REQUEST:
        draft.reviews.loading = true;
        break;
      case CONSTANTS.PENDING_REVIEW_ERROR:
        draft.reviews.loading = false;
        break;
      default:
        break;
    }
  });

export { reviewReducer };
