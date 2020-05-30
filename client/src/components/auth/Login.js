import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
// import { GoogleLogin } from 'react-google-login';

import { login, facebookLogin } from '../../actions/auth';
import { Spinner } from '../layout/Spinner';

/*----- Thank "https://medium.com/@alexanderleon/implement-social-authentication-with-react-restful-api-9b44f4714fa" for the guide ------*/

const Login = ({ login, loading, isAuthenticated, facebookLogin }) => {
  const [LoginData, setLoginData] = useState({
    email: '',
    password: '',
    check: false,
  });
  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        document.getElementById('login-submit-button').click();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);
  const onChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setLoginData({ ...LoginData, [e.target.name]: value });
  };
  const onSubmit = async (e) => {
    const { email, password } = LoginData;
    e.preventDefault();
    await login({ email, password });
  };
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  if (loading) return <Spinner />;
  return (
    <div className='fade-in'>
      <div className='login-wrap'>
        <div className='login-html'>
          <label className='tab'>Log In</label>
          <div className='login-form'>
            <div className='sign-in-htm'>
              <div className='group'>
                <label htmlFor='email' className='label'>
                  E-mail
                </label>
                <input
                  type='text'
                  className='input'
                  name='email'
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='group'>
                <label htmlFor='password' className='label'>
                  Password
                </label>
                <input
                  type='password'
                  className='input'
                  data-type='password'
                  name='password'
                  onChange={(e) => onChange(e)}
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
              <div className='group'>
                <input
                  id='login-submit-button'
                  type='submit'
                  className='button'
                  value='Sign In'
                  onClick={(e) => onSubmit(e)}
                />
              </div>
              <div className='hr'></div>
              <div
                style={{
                  color: 'white',
                  textAlign: 'center',
                  margin: '10px auto',
                }}
              >
                or
              </div>
              <div style={{ margin: '10px auto', width: 'max-content' }}>
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields='name,email,picture'
                  callback={facebookLogin}
                />
              </div>
              {/* <div style={{ margin: '10px auto', width: 'max-content' }}>
                <GoogleLogin
                  clientId='XXXXXXXXXX'
                  buttonText='Login with Google'
                  onSuccess={this.googleResponse}
                  onFailure={this.googleResponse}
                />
              </div> */}
              {/* <div className='foot-lnk'>
                <a href='#forgot'>Forgot Password?</a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  facebookLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProp = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});
export default connect(mapStateToProp, { login, facebookLogin })(Login);
