import { createSelector } from 'reselect';

const selectUser = state => state.app.userState;

const makeSelectUserList = () =>
  createSelector(selectUser, userState => userState.users.list);

const makeSelectUserListLoading = () =>
  createSelector(selectUser, userState => userState.users.loading);

const makeSelectUser = () =>
  createSelector(selectUser, userState => userState.user.data);

const makeSelectUserLoading = () =>
  createSelector(selectUser, userState => userState.user.loading);

export {
  selectUser,
  makeSelectUserList,
  makeSelectUserListLoading,
  makeSelectUser,
  makeSelectUserLoading,
};
