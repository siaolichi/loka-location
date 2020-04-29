import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR } from './types';

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createProfile = (
  formData,
  isCreated = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    await axios.post('/api/profile', formData, config);
    dispatch(getCurrentProfile());
    dispatch(
      setAlert(isCreated ? 'Profile Updated' : 'Profile Created', 'success')
    );
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addGroupToProfile = group => async dispatch => {
  const res = await axios.get('/api/profile/me');
  const profile = res.data;
  if (profile.groups) profile.groups.push(group);
  else profile.groups = [group];
  dispatch(createProfile(profile, true));
};

export const removeGroupToProfile = group => async dispatch => {
  const res = await axios.get('/api/profile/me');
  const profile = res.data;
  let index = profile.groups.indexOf(group);
  if (index > -1) {
    profile.groups.splice(index, 1);
  }
  dispatch(createProfile(profile, true));
};
