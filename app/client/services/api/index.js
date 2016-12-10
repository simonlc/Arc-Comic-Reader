const API_ROOT = '/api';

async function callApi(endpoint, actionOptions) {
  // TODO Change this.
  const fullUrl = API_ROOT + endpoint;

  const options = Object.assign({}, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }, actionOptions);

  const response = await fetch(fullUrl, options);
  return response.json();
}

function actionWith(action, data) {
  const finalAction = { ...action, ...data };
  delete finalAction.CALL_API;
  return finalAction;
}

// Since we call next, do we really need to delete CALL_API?
export default ({ getState, dispatch }) => next => async action => {
  const callAPI = action.CALL_API;

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { types, endpoint, options } = callAPI;
  const [requestType, successType, failureType] = types;

  next(actionWith(action, { type: requestType }));

  try {
    const response = await callApi(endpoint, options);
    return next(actionWith({
      response,
      type: successType,
    }));
  } catch (error) {
    return next(actionWith({
      error: error.message || 'Something bad happened',
      type: failureType,
    }));
  }
};
