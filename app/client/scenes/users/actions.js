import * as types from '../../action-types';

const fetchUsers = () => ({
  CALL_API: {
    types: [ types.USERS_REQUEST, types.USERS_SUCCESS, types.USERS_FAILURE ],
    endpoint: '/users',
    options: {
      method: 'GET',
    },
  },
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadUsers = () => (dispatch, getState) => {
  return dispatch(fetchUsers());
};
