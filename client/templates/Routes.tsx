import * as React from 'react';
import { Route, Switch } from 'react-router';

import HomePage from './HomePage';
import { Location } from 'history';
import LoginPage from './LoginPage';
import ResetPasswordPage from './ResetPasswordPage';
import Practice from './Practice';

export type Props = { location: Location };

export default class Routes extends React.PureComponent<Props> {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/index" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={LoginPage} />
          <Route path="/resetPassword" component={LoginPage} exact />
          <Route path="/practice" component={Practice} exact />
          <Route
            path="/resetPassword/:email/:token"
            component={ResetPasswordPage}
          />

          {/* 404 fall-through */}
          <Route path="*" component={HomePage} />
        </Switch>
      </React.Fragment>
    );
  }
}
