import produce from 'immer';
import get from 'lodash/get';
import * as CONSTANTS from './constants';

const newRestaurant = {
  date: new Date(),
};

const initalState = {
  restaurants: {
    list: [],
    totalCount: 0,
    loading: false,
  },
  restaurant: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
};

const restaurantReducer = (state = initalState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CONSTANTS.LOAD_NEW_RESTAURANT:
        draft.restaurant = {
          id: 'new',
          data: newRestaurant,
          error: [],
          loading: false,
        };
        break;
      case CONSTANTS.RESTAURANT_LIST_REQUEST:
        draft.restaurants.loading = true;
        break;
      case CONSTANTS.RESTAURANT_LIST_SUCCESS:
        draft.restaurants.list = action.payload.data;
        draft.restaurants.totalCount = action.payload.totalCount;
        draft.restaurants.loading = false;
        break;
      case CONSTANTS.RESTAURANT_LIST_ERROR:
        draft.restaurants.loading = false;
        break;
      case CONSTANTS.RESTAURANT_DELETE_REQUEST:
        draft.restaurants.loading = true;
        draft.restaurant.loading = true;
        break;
      case CONSTANTS.RESTAURANT_DELETE_SUCCESS:
        const restaurantList = get(state, ['restaurants', 'list']);
        const filteredList = restaurantList.filter(
          restaurant => restaurant['_id'] !== action.id,
        );
        draft.restaurants.list = filteredList;
        draft.restaurants.loading = false;
        draft.restaurant.loading = false;
        break;
      case CONSTANTS.RESTAURANT_DELETE_ERROR:
        draft.restaurant.loading = false;
        draft.restaurants.loading = false;
        break;
      case CONSTANTS.RESTAURANT_LOAD_REQUEST:
        draft.restaurant.loading = true;
        break;
      case CONSTANTS.RESTAURANT_LOAD_SUCCESS:
        draft.restaurant.data = action.data;
        draft.restaurant.id = action.data._id;
        draft.restaurant.loading = false;
        break;
      case CONSTANTS.RESTAURANT_LOAD_ERROR:
        draft.restaurant.loading = false;
        break;
      case CONSTANTS.RESTAURANT_SAVE_REQUEST:
        draft.restaurant.loading = true;
        draft.restaurant.error = [];
        break;
      case CONSTANTS.RESTAURANT_SAVE_SUCCESS:
        draft.restaurant.id = action.data._id;
        draft.restaurant.data.id = action.data._id;
        draft.restaurant.loading = false;
        break;
      case CONSTANTS.RESTAURANT_SAVE_ERROR:
        draft.restaurant.loading = false;
        draft.restaurant.error = action.data.error;
        break;
      case CONSTANTS.UPDATE_RESTAURANT_FIELD:
        draft.restaurant.data[action.field] = action.value;
        break;
      default:
        break;
    }
  });

export { restaurantReducer };
