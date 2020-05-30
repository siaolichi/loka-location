import {
  LOGIN_LOADING,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
} from '../actions/types';
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  redirect: false,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_LOADING:
      return {
        ...state,
        loading: true,
        redirect: true,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // console.log('Auth success');
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
      };
    case USER_LOADED:
      // console.log('user logged');
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case AUTH_ERROR:
    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case LOGOUT:
      // console.log("auth error");
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
}
