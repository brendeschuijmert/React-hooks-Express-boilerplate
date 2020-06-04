import { all, fork } from 'redux-saga/effects';

import { userSaga } from '../User/redux/saga';
import { reviewSaga } from '../Review/redux/saga';
import { restaurantSaga } from '../Restaurant/redux/saga';

export function* appSaga() {
  yield all([fork(userSaga), fork(reviewSaga), fork(restaurantSaga)]);
}
