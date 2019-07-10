// @flow
import React from 'react';
import BaseEmail, { Config } from '../common/BaseEmail';
import { UserInstance } from '../../../models/User';

type Props = {
  config: Config;
  user: UserInstance;
};

export default class Email extends React.Component<Props> {
  render() {
    const { config, user } = this.props;

    return (
      <BaseEmail {...this.props}>
        <div>
          <h3>Confirm your email</h3>
          Thank you for signing up on {config.siteName}! Before you can start
          DOING BLAH, please confirm your email address by clicking the button
          below:
          <br />
          <br />
          <a
            href={`${config.web.linkHost}/user/confirm/${user.email}/${
              user.activationKey
            }`}
            className="btn btn-primary btn-lg"
          >
            Confirm my email
          </a>
          <br />
          <br />
          If you did not request this email, please just ignore and delete it.
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
