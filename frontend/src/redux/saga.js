import { all, fork } from 'redux-saga/effects';

import { authSaga } from '../screens/auth/redux/saga';
import { appSaga } from '../screens/app/redux/saga';

export default function* root() {
  yield all([fork(authSaga), fork(appSaga)]);
}
