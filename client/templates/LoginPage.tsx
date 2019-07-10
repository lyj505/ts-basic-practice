// @flow
import React from 'react';
import _ from 'lodash';
import qs from 'qs';
import { withRouter, RouteComponentProps } from 'react-router';
import { update } from 'react-updaters';
import { Response } from '../../common/types';
import LoginForm from './LoginForm';
import ResponseMessage from './ResponseMessage';

type Props = {
  location: {
    pathname: string;
    query: {
      redirect?: string;
    };
  };
} & RouteComponentProps<{}>;

type Tab = 'register' | 'login' | 'resetPassword';

type State = {
  tab: Tab;
  registrationResponse: Response | null;
};

class LoginPage extends React.PureComponent<Props, State> {
  state: State = {
    tab: 'login',
    registrationResponse: null,
  };

  setTabFromUrl = (props: Props) => {
    const pathname = _.get(props, 'location.pathname');
    if (pathname === '/register') {
      this.setState({ tab: 'register' });
    } else if (pathname === '/resetPassword') {
      this.setState({ tab: 'resetPassword' });
    } else {
      this.setState({ tab: 'login' });
    }
  };

  componentWillMount() {
    this.setTabFromUrl(this.props);
  }

  componentWillReceiveProps(props: Props) {
    this.setTabFromUrl(props);
  }

  query() {
    return qs.parse(this.props.location.search.substr(1));
  }

  handleLogin = () => {
    const redirect = this.query().redirect;
    this.props.history.push(redirect || '/');
  };

  handleRegister = () => {
    const redirect = this.query().redirect;
    this.props.history.push(redirect || '/');
  };

  handleTabChange = (tab: Tab) => {
    this.setState({ tab });
    this.props.history.push(`/${tab}${this.props.location.search}`);
  };

  render() {
    const registrationResponse = this.state.registrationResponse;
    const tab = this.state.tab;

    if (registrationResponse && registrationResponse.success) {
      return (
        <div className="container">
          <h1>Register</h1>
          <ResponseMessage response={registrationResponse} />
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 offset-md-3">
            <LoginForm
              onLogin={this.handleLogin}
              onRegister={this.handleRegister}
              tab={tab}
              onTabChange={this.handleTabChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPage);
