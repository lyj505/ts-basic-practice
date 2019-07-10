import * as React from 'react';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav } from 'reactstrap';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import Routes from './Routes';
import { withAuth, AuthInjectedProps } from '../js/stores/Auth';
import NavbarUser from './NavbarUser';

type Props = AuthInjectedProps & RouteComponentProps<any>;

type State = {
  expanded: boolean;
};

class MainPage extends React.Component<Props, State> {
  state = { expanded: false };

  handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.logout();
  };

  toggleNavbar = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { location } = this.props;
    const { expanded } = this.state;

    return (
      <div>
        <Navbar dark color="dark" fixed="top" expand="md">
          <div className="container">
            <NavbarBrand tag={Link} to="/">
              YOUR_SITE_NAME
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={expanded} navbar>
              <Nav navbar className="mr-auto" />
              <Nav navbar>
                {/* Here, we need to pass `location` or else `PureComponent` prevents route updates */}
                <NavbarUser location={location} />
              </Nav>
            </Collapse>
          </div>
        </Navbar>

        <div className="navbar-offset">
          {/* Here, we need to pass `location` or else `PureComponent` prevents route updates */}
          <Routes location={location} />
        </div>

        <footer className="footer">
          <div className="container">
            <span className="pull-left">Created by YOUR NAME</span>
            <span className="pull-left" style={{ marginLeft: 20 }}>
              Email: email@example.com
            </span>
          </div>
        </footer>
      </div>
    );
  }
}

// This weird typing is to avoid a strange error in server/app/index.tss
export default withRouter(withAuth(MainPage)) as React.ComponentClass<{}>;
