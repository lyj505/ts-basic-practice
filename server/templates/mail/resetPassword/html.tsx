// @flow
import React from 'react';
import BaseEmail, { Config } from '../common/BaseEmail';

interface Props {
  config: Config;
  email: string;
  username: string;
  token: string;
}

export default class Email extends React.Component<Props> {
  render() {
    const { email, token, config } = this.props;
    const resetLink = `${config.web.linkHost}/resetPassword/${email}/${token}`;

    return (
      <BaseEmail config={config}>
        <div>
          <h3>Reset your password</h3>
          Hello,
          <br />
          <br />
          <strong>
            We have just received a request to reset your password
          </strong>{' '}
          for your account at{' '}
          <a href={config.web.linkHost}>{config.siteName}</a>.<br />
          <br />
          If you forgot your password and need to reset it, click the button
          below:
          <br />
          <br />
          <a href={resetLink} className="btn btn-primary btn-lg">
            Reset password
          </a>
          <br />
          <br />
          If you did not request this password reset, please just ignore this
          email; the link will expire after 24 hours.
          <br />
          <br />
          Cheers,
          <br />
          {config.siteName} team
        </div>
      </BaseEmail>
    );
  }
}
