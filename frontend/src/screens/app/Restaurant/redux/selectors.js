import { createSelector } from 'reselect';
import get from 'lodash/get';

const selectRestaurant = state => get(state, 'app.restaurantState');

const makeSelectRestaurantList = () =>
  createSelector(selectRestaurant, restaurantState =>
    get(restaurantState, ['restaurants', 'list']),
  );

const makeSelectRestaurantListLoading = () =>
  createSelector(selectRestaurant, restaurantState =>
    get(restaurantState, ['restaurants', 'loading']),
  );

const makeSelectRestaurant = () =>
  createSelector(selectRestaurant, restaurantState =>
    get(restaurantState, ['restaurant', 'data']),
  );

const makeSelectRestaurantLoading = () =>
  createSelector(selectRestaurant, restaurantState =>
    get(restaurantState, ['restaurant', 'loading']),
  );

export {
  selectRestaurant,
  makeSelectRestaurantList,
  makeSelectRestaurantListLoading,
  makeSelectRestaurant,
  makeSelectRestaurantLoading,
};
