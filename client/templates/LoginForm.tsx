import React, { FormEvent } from 'react';
import _ from 'lodash';
import { callProp, update, setState } from 'react-updaters';

import { withAuth, AuthInjectedProps } from '../js/stores/Auth';
import { startResetPassword } from '../js/User';
import { validateUser } from '../js/Validate';
import { Response } from '../../common/types';
import Tabs from './Tabs';
import { getCatch } from '../js/Ajax';
import ResponseMessage from './ResponseMessage';

const tabs = [
  { label: 'Sign in', value: 'login' },
  { label: 'Register', value: 'register' },
];

type Tab = 'login' | 'register' | 'resetPassword';

type OwnProps = {
  onLogin: () => unknown;
  onRegister: () => unknown;

  /** Tab is controlled to allow the containing element adjust its size */
  tab: Tab;
  onTabChange: (tab: Tab) => unknown;
};
type Props = OwnProps & AuthInjectedProps;

type State = {
  form: {
    email: string;
    username: string;
    password: string;
  };

  blurred: { [field: string]: boolean };
  hasSubmitErrors: boolean;
  loading: boolean;
  response: Response | null;
};

class LoginForm extends React.PureComponent<Props, State> {
  state = {
    form: {
      email: '',
      username: '',
      password: '',
    },

    // These determine which errors to show
    blurred: {},
    hasSubmitErrors: false,

    loading: false,
    response: null,
  };

  login = async () => {
    this.setState({ loading: true, response: null });

    try {
      await this.props.login(this.state.form.email, this.state.form.password);
      this.setState({ loading: false });
      this.props.onLogin();
    } catch (err) {
      getCatch(this)(err);
    }
  };

  register = async () => {
    const errors = validateUser(this.state.form);
    if (!_.isEmpty(errors)) {
      this.setState({ hasSubmitErrors: true, loading: false });
      return;
    }

    this.setState({ hasSubmitErrors: false, loading: true, response: null });
    try {
      await this.props.register(this.state.form);
      this.setState({ loading: false });
      this.props.onRegister();
    } catch (err) {
      getCatch(this)(err);
    }
  };

  resetPassword = async () => {
    this.setState({ loading: true, response: null });
    try {
      const response = await startResetPassword(this.state.form.email);
      this.setState({ loading: false, response });
    } catch (err) {
      getCatch(this)(err);
    }
  };

  submit = (event: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    this.setState({ loading: true, response: null });

    const activeTab = this.props.tab;
    if (activeTab === 'login') {
      this.login();
    } else if (activeTab === 'register') {
      this.register();
    } else if (activeTab === 'resetPassword') {
      this.resetPassword();
    }
  };

  render() {
    const activeTab = this.props.tab;
    const loading = this.state.loading || this.props.userLoading;

    const response = this.state.response;
    const form = this.state.form;
    const blurred = this.state.blurred;
    const hasSubmitErrors = this.state.hasSubmitErrors;

    let activeVerb = null;
    switch (activeTab) {
      case 'login':
        activeVerb = 'Sign in';
        break;
      case 'register':
        activeVerb = 'Register';
        break;
      case 'resetPassword':
        activeVerb = 'Reset password';
        break;
    }

    // Extra registration-only validation
    const errors = validateUser(form);
    let visibleErrors: { [k: string]: string } = {};

    if (activeTab === 'register') {
      visibleErrors = _.clone(errors);
      if (!hasSubmitErrors) {
        // If we've tried submitting already, show all errors
        _.forEach(errors, (error, key) => {
          if (!blurred[key]) {
            delete visibleErrors[key];
          }
        });
      }
    }

    return (
      <div>
        <h1>{activeVerb}</h1>

        <div className="mb-3">
          <Tabs
            tabs={tabs}
            value={activeTab}
            onChange={callProp(this, 'onTabChange')}
          />
        </div>

        {response && <ResponseMessage response={response} />}

        <form onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="email">
              Email
              {activeTab === 'login' && ' or username'}
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${
                visibleErrors.email ? 'is-invalid' : ''
              }`}
              maxLength={128}
              value={form.email}
              onChange={update(this, 'form.email')}
              onBlur={setState(this, 'blurred.email', true)}
            />
            {activeTab === 'register' &&
              (visibleErrors.email ? (
                <div className="invalid-feedback">{visibleErrors.email}</div>
              ) : (
                <div className="form-text text-muted">
                  We will send an email here with an activation link.
                </div>
              ))}
          </div>

          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className={`form-control ${
                  visibleErrors.username ? 'is-invalid' : ''
                }`}
                value={form.username}
                onChange={update(this, 'form.username')}
                onBlur={setState(this, 'blurred.username', true)}
              />
              {visibleErrors.username && (
                <div className="invalid-feedback">{visibleErrors.username}</div>
              )}
            </div>
          )}

          {(activeTab === 'register' || activeTab === 'login') && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className={`form-control ${
                  visibleErrors.password ? 'is-invalid' : ''
                }`}
                value={form.password}
                onChange={update(this, 'form.password')}
                onBlur={setState(this, 'blurred.password', true)}
              />
              {activeTab === 'register' &&
                (visibleErrors.password ? (
                  <div className="invalid-feedback">
                    {visibleErrors.password}
                  </div>
                ) : (
                  <div className="form-text text-muted">
                    Choose a long, hard-to-guess password that you don't use
                    anywhere else.
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'register' &&
            hasSubmitErrors && (
              <div className="alert alert-danger">
                Some fields don't seem to be filled in correctly! Take a look at
                the error messages above.
              </div>
            )}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {activeVerb}
          </button>
          {activeTab === 'login' && (
            <a
              href="#forgotPassword"
              className="float-right"
              onClick={callProp(this, 'onTabChange', ['resetPassword'], true)}
            >
              Forgot password
            </a>
          )}
        </form>
      </div>
    );
  }
}

export default withAuth(LoginForm) as React.ComponentClass<OwnProps>;
