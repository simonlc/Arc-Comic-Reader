import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';

import Home from './home';
import Profile from './profile';
import Users from './users';
import Login from './login';
import Upload from './upload';
import Reader from './reader';

import NoMatch from './no-match';

export default
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/upload" component={Upload} />
    <Route path="/users" component={Users} />
    <Route path="/users/:username" component={Profile} />
    {/*<Route path="/comics" component={Comics} />*/}
    <Route path="/c/:comic" component={Reader} />
    <Route path="/*" component={NoMatch} />
  </Route>
