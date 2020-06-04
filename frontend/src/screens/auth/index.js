import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { LoginPage } from './Login';
import { SignupPage } from './Signup';

const AuthRouter = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/login`} component={LoginPage} />
    <Route exact path={`${match.url}/signup`} component={SignupPage} />
    <Redirect to={`${match.url}/login`} />
  </Switch>
);

export const AuthScreens = withRouter(AuthRouter);
