import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import Profile from './Profile';
import MyLoka from './MyLoka';
import Favorite from './Favorite';
import Spinner from './Spinner';

import '../../style/Dashboard.scss';
export const UnconnectedDashboard = ({
  getCurrentProfile,
  auth: { isAuthenticated },
  profile: { loading, profile }
}) => {
  useEffect(() => {
    // console.log('GetProfile', isAuthenticated);
    getCurrentProfile();
  }, [isAuthenticated]);
  const [ActiveTab, setActiveTab] = useState('Profile');
  if (!isAuthenticated) return <Redirect to='/login' />;
  if (loading) return <Spinner />;
  if (!profile) {
    getCurrentProfile();
    return <Spinner />;
  }

  const changeTab = e => {
    const allTabs = document.getElementsByClassName('profile-title');
    Object.values(allTabs).forEach(tab => {
      tab.classList.remove('active');
    });
    e.target.classList.add('active');
    setActiveTab(e.target.innerHTML);
  };
  const backToProfile = () => {
    const allTabs = document.getElementsByClassName('profile-title');
    Object.values(allTabs).forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementsByClassName('profile-title')[0].classList.add('active');
    setActiveTab('Profile');
  };

  return (
    <div id='dashboard' className='fade-in' data-test='component-dashboard'>
      <div className='tabs'>
        <button className='profile-title active' onClick={e => changeTab(e)}>
          Profile
        </button>
        <button className='profile-title' onClick={e => changeTab(e)}>
          Edit Groups
        </button>
        <button className='profile-title' onClick={e => changeTab(e)}>
          My Favorite
        </button>
      </div>

      <div className='tab__content'>
        <div className='content__wrapper'>
          {ActiveTab === 'Profile' ? (
            <Profile profile={profile} />
          ) : ActiveTab === 'Edit Groups' ? (
            <MyLoka
              profile={{ loading, profile }}
              backToProfile={backToProfile}
            />
          ) : ActiveTab === 'My Favorite' ? (
            <Favorite profile={{ loading, profile }} />
          ) : (
            <Redirect to='/' />
          )}
        </div>
      </div>
    </div>
  );
};

UnconnectedDashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(
  UnconnectedDashboard
);
