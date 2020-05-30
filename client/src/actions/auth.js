import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import { createProfile } from './profile';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';

// Signup
export const signup = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/user', body, config);
    await dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    await dispatch(loadUser());
    await dispatch(
      createProfile({
        bio: '',
        website: '',
        location: '',
      })
    );
  } catch (err) {
    dispatch({ type: REGISTER_FAILED });
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors)
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

//Load User

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/auth', { email, password }, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    await dispatch(loadUser());
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

export const facebookLogin = (fbResponse) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      '/api/auth/facebook',
      { accessToken: fbResponse.accessToken },
      config
    );
    await dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    await dispatch(loadUser());
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
