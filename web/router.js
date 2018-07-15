import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './pages/index';
import LoginPage from './pages/login';
import AliGeniePage from './pages/aligenie';
import AliGenieAuthPage from './pages/aligenieauth';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/aligenie" exact component={AliGeniePage} />
        <Route path="/aligenie/authorize" exact component={AliGenieAuthPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
