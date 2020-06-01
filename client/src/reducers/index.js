import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import group from './group';
import map from './map';
export default combineReducers({ alert, auth, profile, group, map });
