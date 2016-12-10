import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';
import * as ActionTypes from './action-types';

const users = (state = [], action) => {
  if (action.type === ActionTypes.USERS_SUCCESS) {
    return action.response;
  }
  return state;
};

const comics = (state = [], action) => {
  if (action.type === ActionTypes.COMICS_SUCCESS) {
    return action.response;
  }
  return state;
};

const chapters = (state = [], action) => {
  if (action.type === ActionTypes.CHAPTERS_SUCCESS) {
    return action.response;
  }
  return state;
};

const login = (state = { loggedIn: false }, action) => {
  // if (action.type === ActionTypes.LOGIN_REQUEST) {
  // }
  // if (action.type === ActionTypes.LOGIN_FAILURE) {
  // }
  if (action.type === ActionTypes.LOGIN_SUCCESS) {
    return { loggedIn: action.response.username };
  }
  return state;
};

const rootReducer = combineReducers({
  login,
  users,
  comics,
  chapters,
  form,
  routing,
});

export default rootReducer;
