import React from 'react';
import { connect } from 'react-redux';
import TitleAnimation from './TitleAnimation';
import './Landing.scss';
import { Redirect } from 'react-router-dom';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) return <Redirect to='/dashboard' />;
  return <TitleAnimation />;
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, null)(Landing);
