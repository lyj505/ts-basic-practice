// @flow
import React, { MouseEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { withAuth, AuthInjectedProps } from '../js/stores/Auth';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

type OwnProps = { location?: any };
type Props = RouteComponentProps<{}> & AuthInjectedProps & OwnProps;

/**
 * This component is the user display (e.g., "Username | Sign out" or
 * "Sign in" that can be slotted into any display
 */
class NavbarUser extends React.Component<Props> {
  logout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.logout().then(() => {
      this.props.history.push('/');
    });
  };

  render() {
    const isLoggedIn = !!this.props.user;
    const logoutLoading = this.props.userLoading;

    if (isLoggedIn) {
      return (
        <NavItem>
          <NavLink
            href="#logout"
            onClick={this.logout}
            disabled={logoutLoading}
          >
            {logoutLoading ? 'Loading' : 'Sign out'}
          </NavLink>
        </NavItem>
      );
    } else {
      return (
        <NavItem>
          <NavLink tag={Link} to="/register?redirect=/">
            Register or sign in
          </NavLink>
        </NavItem>
      );
    }
  }
}

export default withAuth(withRouter(NavbarUser)) as React.ComponentClass<
  OwnProps
>;
