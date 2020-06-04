import React from 'react';
import { useSelector } from 'react-redux';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import { AuthScreens } from './auth';
import { AppScreens } from './app';

const Routes = () => {
  const currentUser = useSelector(state => state.auth.currentUser);
  return (
    <Switch>
      {!currentUser && <Route path="/auth" component={AuthScreens} />}
      {!currentUser && <Redirect to="/auth" />}

      {currentUser && <Route path="/" component={AppScreens} />}
      {currentUser && <Redirect to="/" />}
    </Switch>
  );
};

export default withRouter(Routes);
