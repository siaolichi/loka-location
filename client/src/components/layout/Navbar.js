import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import MaterialIcon from '@material/react-material-icon';
import './Navbar.scss';

library.add(faSignOutAlt);

const Navbar = ({
  logout,
  auth: { isAuthenticated, loading },
  setOpenAccount,
}) => {
  const guestLink = (
    <ul>
      <li className='map'>
        <Link to='/map'>
          <MaterialIcon icon='location_on' />
        </Link>
      </li>
      <li>
        <Link to='/signup'>Sign Up</Link>
      </li>
      <li>
        <Link to='/login'>Sign In</Link>
      </li>
    </ul>
  );
  const memberLink = (
    <ul className='nav-auth'>
      <li className='map'>
        <Link to='/map'>
          <MaterialIcon icon='location_on' />
        </Link>
      </li>
      <li className='account'>
        <a
          href='#!'
          onClick={(e) => {
            e.preventDefault();
            setOpenAccount(true);
          }}
        >
          <MaterialIcon icon='face' />
        </a>
      </li>
      <li onClick={logout} className='logout'>
        <a
          href='#!'
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          <MaterialIcon icon='exit_to_app' />
        </a>
      </li>
    </ul>
  );
  return (
    <nav className='navbar'>
      <h1>
        <Link to='/'>
          <div className='logo'></div> LOKA
        </Link>
      </h1>
      {loading || !isAuthenticated ? guestLink : memberLink}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProp, { logout })(Navbar);
