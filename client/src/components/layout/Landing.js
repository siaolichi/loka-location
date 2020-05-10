import React from 'react';
import { connect } from 'react-redux';
import TitleAnimation from './TitleAnimation';
import Dashboard from './Dashboard';
import './Landing.scss';

const Landing = ({ isAuthenticated }) => {
  if (!isAuthenticated) return <TitleAnimation />;
  return <Dashboard />;
};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, null)(Landing);
