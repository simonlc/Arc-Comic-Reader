import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './services/configure-store';
import scenes from './scenes';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const Root = () =>
  <Provider store={store}>
    <Router history={history} routes={scenes} />
  </Provider>

render(
  <Root store={store} history={history} />,
  document.getElementById('root'),
);
