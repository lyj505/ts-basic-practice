import * as React from 'react';
import qs from 'qs';
import { withAuth, AuthInjectedProps } from '../js/stores/Auth';
import { withRouter, RouteComponentProps } from 'react-router';

type Props = AuthInjectedProps & RouteComponentProps<any>;

const messages = {
  activationFailed: {
    success: false,
    text:
      'The activation link you followed is invalid; please make sure you followed the link emailed to you exactly.',
  },
  activated: {
    success: true,
    text: 'Thank you for confirming your email!',
  },
  notFound: {
    success: false,
    text:
      'We couldn’t find the page you were looking for (404). Please check the link you followed, and if it was from our site, contact us to report it.',
  },
};

class HomePage extends React.PureComponent<Props> {
  isNotFound() {
    const { path } = this.props.match;
    return path === '*';
  }

  query() {
    return qs.parse(this.props.location.search.substr(1));
  }

  render() {
    // const { user } = this.props;

    const query = this.query();
    let message = query.message && messages[query.message];
    if (this.isNotFound()) {
      message = messages.notFound;
    }

    return (
      <div className="container">
        <h1>Hello world</h1>
        {message && (
          <div
            className={`alert alert-${message.success ? 'success' : 'danger'}`}
          >
            {message.text}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(withAuth(HomePage));
