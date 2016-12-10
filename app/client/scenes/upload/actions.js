import * as types from '../../action-types';

const fetchUpload = values => ({
  CALL_API: {
    types: [ types.UPLOAD_REQUEST, types.UPLOAD_SUCCESS, types.UPLOAD_FAILURE ],
    endpoint: '/comics',
    options: {
      headers: {
        // Remove default headers in our API middleware.
      },
      body: values,
      method: 'POST',
    },
  },
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const upload = values => (dispatch, getState) => {
  const data = new FormData();
  for (let key in values) {
    if (values.hasOwnProperty(key)) {
      data.append(key, values[key]);
    }
  }
  return dispatch(fetchUpload(data));
};
