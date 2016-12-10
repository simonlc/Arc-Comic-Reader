import * as types from '../../action-types';

const fetchLogin = values => ({
  CALL_API: {
    types: [ types.LOGIN_REQUEST, types.LOGIN_SUCCESS, types.LOGIN_FAILURE ],
    endpoint: '/login',
    options: {
      body: JSON.stringify(values),
      method: 'POST',
    },
  },
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const login = values => (dispatch, getState) => {
  return dispatch(fetchLogin(values));
};
