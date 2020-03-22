import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import { Redirect } from "react-router-dom";

const Login = ({ login, isAuthenticated }) => {
  const [LoginData, setLoginData] = useState({
    email: "",
    password: "",
    check: false
  });
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        document.getElementById("login-submit-button").click();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);
  const onChange = e => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setLoginData({ ...LoginData, [e.target.name]: value });
  };
  const onSubmit = async e => {
    const { email, password } = LoginData;
    e.preventDefault();
    login({ email, password });
  };
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="fade-in">
      <div className="login-wrap">
        <div className="login-html">
          <label className="tab">Log In</label>
          <div className="login-form">
            <div className="sign-in-htm">
              <div className="group">
                <label htmlFor="email" className="label">
                  E-mail
                </label>
                <input
                  type="text"
                  className="input"
                  name="email"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="group">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  type="password"
                  className="input"
                  data-type="password"
                  name="password"
                  onChange={e => onChange(e)}
                />
              </div>
              {/* <div className="group">
                <input
                  id="signin-check"
                  name="check"
                  type="checkbox"
                  className="check"
                  onChange={e => onChange(e)}
                />
                <label htmlFor="signin-check" className="label">
                  <span className="icon"></span> Keep me signed in
                </label>
              </div> */}
              <div className="group">
                <input
                  id="login-submit-button"
                  type="submit"
                  className="button"
                  value="Sign In"
                  onClick={e => onSubmit(e)}
                />
              </div>
              <div className="hr"></div>
              <div className="foot-lnk">
                <a href="#forgot">Forgot Password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};
const mapStateToProp = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProp, { login })(Login);
