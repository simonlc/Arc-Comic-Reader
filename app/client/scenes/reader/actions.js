import * as types from '../../action-types';

const fetchComic = (comic, issueNumber) => ({
  CALL_API: {
    types: [ types.COMIC_REQUEST, types.COMIC_SUCCESS, types.COMIC_FAILURE ],
    endpoint: `/${comic}/${issueNumber}`,
    options: {
      method: 'GET',
    },
  },
});

export const loadComic = (comic, issueNumber) => (dispatch, getState) => {
  return dispatch(fetchComic(comic, issueNumber));
};
