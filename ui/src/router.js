import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './pages/index';
import LoginPage from './pages/login';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={LoginPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
