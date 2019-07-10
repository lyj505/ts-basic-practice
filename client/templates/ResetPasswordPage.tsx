// @flow
import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { update, setState, getCatch } from 'react-updaters';
import { Response } from '../../common/types';
import { isValidPasswordResetToken, resetPassword } from '../js/User';
import ResponseMessage from './ResponseMessage';

type Props = {
  match: {
    params: {
      email: string;
      token: string;
    };
  };
};

type State = {
  loading: boolean;
  isValid: boolean | null;
  response: Response | null;

  password: string;
  password2: string;
  blurredPassword2: boolean;

  passwordChanged: boolean;
};

export default class ResetPasswordPage extends React.PureComponent<
  Props,
  State
  > {
  state = {
    loading: true,
    isValid: null,
    response: null,

    password: '',
    password2: '',
    blurredPassword2: false,

    passwordChanged: false,
  };

  checkToken = async (props: Props) => {
    const token = props.match.params.token;

    this.setState({ loading: true, response: null, isValid: null });

    try {
      const isValid = await isValidPasswordResetToken(token);
      this.setState({
        loading: false,
        isValid,
        response: !isValid
          ? {
            success: false,
            messages: [
              'The password reset link you followed has expired or is invalid. Please go to the Sign In page to request another one',
            ],
            errTypes: ['expired'],
          }
          : null,
      });
    } catch (err) {
      getCatch(this)(err);
    }
  };

  componentWillMount() {
    this.checkToken(this.props);
  }

  componentWillReceiveProps(props: Props) {
    if (props.match.params.token !== this.props.match.params.token) {
      this.checkToken(props);
    }
  }

  resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ loading: true, response: null });

    const params = this.props.match.params;

    try {
      await resetPassword(params.token, this.state.password);
      // Add extra link if successful
      this.setState({
        passwordChanged: true,
        response: {
          success: true,
          messages: [
            <span>
              We've updated your account's password.{' '}
              <Link to="/login">Sign in with your new password</Link> to start
              using your account.
            </span>,
          ],
        },
      });
    } catch (err) {
      getCatch(this)(err);
    }
  };

  render() {
    const {
      password,
      password2,
      blurredPassword2,
      loading,
      response,
      passwordChanged,
    } = this.state;

    const enableSubmit =
      password === password2 &&
      password &&
      password2 &&
      !loading &&
      !passwordChanged;
    // Disable if missing inputs, loading, or already done
    const showPassword2Error =
      password !== password2 && (blurredPassword2 || password2 !== '');

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
            <h1>Reset your password</h1>

            {loading && this.state.isValid === null ? (
              <div className="text-center">
                <p>
                  Please wait while we check if you followed a valid password
                  reset link:
                </p>
                <i className="fa fa-circle-o-notch fa-spin fa-3x" />
              </div>
            ) : (
                <div>
                  {response && <ResponseMessage response={response} />}

                  {this.state.isValid && (
                    <form onSubmit={this.resetPassword}>
                      <input
                        type="text"
                        value={this.props.match.params.email}
                        autoComplete="username email"
                        className="d-none"
                      />
                      {/* This is only used for populating Chrome autocomplete:
                        see https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands */}

                      <div className="form-group">
                        <label htmlFor="password">New password</label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          autoComplete="new-password"
                          disabled={passwordChanged}
                          value={password}
                          onChange={update(this, 'password')}
                        />
                        <p className="help-block">
                          Choose a long, hard-to-guess password that you don't use
                          anywhere else.
                      </p>
                      </div>

                      <div className="form-group">
                        <label htmlFor="password2">New password again</label>
                        <input
                          type="password"
                          id="password2"
                          className={`form-control ${
                            showPassword2Error ? 'is-invalid' : ''
                            }`}
                          autoComplete="new-password"
                          disabled={passwordChanged}
                          value={password2}
                          onChange={update(this, 'password2')}
                          onBlur={setState(this, 'blurredPassword2', true)}
                        />
                        {showPassword2Error ? (
                          <div className="invalid-feedback">
                            The two passwords you entered do not match; please try
                            again.
                        </div>
                        ) : (
                            <div className="form-text text-muted">
                              Enter your password again to ensure that you entered
                              it correctly and won't be locked out of your account.
                        </div>
                          )}
                      </div>

                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={!enableSubmit}
                      >
                        Set new password
                    </button>
                    </form>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}
