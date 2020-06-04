import get from 'lodash/get';

const selectCurrentUser = state => get(state, 'auth.currentUser');

export { selectCurrentUser };
