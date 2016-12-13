import * as types from '../../action-types';

const fetchChapters = comic => ({
  CALL_API: {
    types: [ types.CHAPTERS_REQUEST, types.CHAPTERS_SUCCESS, types.CHAPTERS_FAILURE ],
    endpoint: `/chapters/${comic}`,
    options: {
      method: 'GET',
    },
  },
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadChapters = comic => (dispatch, getState) => {
  return dispatch(fetchChapters(comic));
};

export const setComic = issue => (dispatch, getState) => {
  return dispatch({ type: types.COMIC_SET, issue });
};
