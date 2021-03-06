import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { signup } from '../../actions/auth';
import '../../style/Signup.scss';

const Signup = ({ setAlert, signup, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    const { name, email, password, password2 } = formData;
    if (password !== password2) {
      console.log('password do not match');
      setAlert('password do not match', 'danger');
    } else {
      const newUser = {
        name,
        email,
        password,
      };
      signup(newUser);
    }
  };
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <div className='fade-in'>
      <div className='login-wrap'>
        <div className='login-html'>
          <div className='tab'>Sign Up</div>
          <div className='login-form'>
            <div className='sign-up-htm'>
              <div className='group'>
                <label htmlFor='user' className='label'>
                  Username
                </label>
                <input
                  name='name'
                  type='text'
                  className='input'
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='group'>
                <label htmlFor='pass' className='label'>
                  Email Address
                </label>
                <input
                  name='email'
                  type='text'
                  className='input'
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='group'>
                <label htmlFor='pass' className='label'>
                  Password
                </label>
                <input
                  name='password'
                  type='password'
                  className='input'
                  data-type='password'
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='group'>
                <label htmlFor='pass' className='label'>
                  Check Password
                </label>
                <input
                  name='password2'
                  type='password'
                  className='input'
                  data-type='password'
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='group'>
                <input
                  type='submit'
                  className='button'
                  value='Sign Up'
                  onClick={(e) => onSubmit(e)}
                />
              </div>
              <div className='hr'></div>
              <div className='foot-lnk'>
                <Link to='/login'>Already Member?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Signup.propTypes = {
  setAlert: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProp = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProp, { setAlert, signup })(Signup);
