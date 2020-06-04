import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Icon } from '../Icon';
import { logout } from '../../screens/auth/redux/actions';
import { isAdmin, isOwnerOrUser } from '../../utils/permission';
import Logo from '../../assets/logo.svg';

const TopBar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const { firstName, lastName, role } = currentUser;
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand
        as={Link}
        to="/"
        className="d-inline-flex align-items-center"
      >
        <img
          src={Logo}
          width="40"
          height="40"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        Restaurant Review
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {isAdmin(currentUser) && (
            <>
              <Nav.Link as={Link} to={'/restaurants'}>
                Restaurants
              </Nav.Link>
              <Nav.Link as={Link} to={'/users'}>
                Users
              </Nav.Link>
            </>
          )}
          {isOwnerOrUser(currentUser) && (
            <Nav.Link as={Link} to={'/restaurants'}>
              Restaurants
            </Nav.Link>
          )}
        </Nav>
        <Nav>
          <Nav.Link>{`${firstName} ${lastName} (${role})`}</Nav.Link>
          <Nav.Link as={Link} to="/logout" onClick={handleLogout}>
            Logout&nbsp;
            <Icon name="sign-out" />
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export { TopBar };
