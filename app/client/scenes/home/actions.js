import * as types from '../../action-types';

const fetchComics = () => ({
  CALL_API: {
    types: [ types.COMICS_REQUEST, types.COMICS_SUCCESS, types.COMICS_FAILURE ],
    endpoint: '/comics',
    options: {
      method: 'GET',
    },
  },
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadComics = () => (dispatch, getState) => {
  return dispatch(fetchComics());
};
