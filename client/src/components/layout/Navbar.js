import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../../style/Navbar.scss";

library.add(faSignOutAlt);

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const guestLink = (
    <ul>
      <li>
        <Link to="/map">Maps</Link>
      </li>
      <li>
        <Link to="/signup">Sign Up</Link>
      </li>
      <li>
        <Link to="/login">Sign In</Link>
      </li>
    </ul>
  );
  const memberLink = (
    <ul>
      <li>
        <Link to="/map">Maps</Link>
      </li>
      <li>
        <Link to="/dashboard">Account</Link>
      </li>
      <li onClick={logout}>
        <div className="logout">
          <FontAwesomeIcon icon="sign-out-alt" /> Logout
        </div>
      </li>
    </ul>
  );
  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <div className="logo"></div> LOKA
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? memberLink : guestLink}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProp = state => ({
  auth: state.auth
});

export default connect(mapStateToProp, { logout })(Navbar);
