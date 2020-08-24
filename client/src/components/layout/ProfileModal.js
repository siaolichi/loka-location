/*eslint-disable react-hooks/exhaustive-deps*/
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material/react-button';
import {TweenMax} from 'gsap';
import './ProfileModal.scss';

import CreateProfile from '../elements/CreateProfile';

import MaterialIcon from '@material/react-material-icon';
import {getCurrentProfile} from '../../actions/profile';

export const ProfileModal = ({
    profile: {profile, loading},
    isAuthenticated,
    getCurrentProfile,
    openAccount,
    setOpenAccount,
}) => {
    const container = useRef(null);
    const [editProfile, setEditProfile] = useState(false);
    useEffect(() => {
        if (isAuthenticated) {
            getCurrentProfile();
        }
    }, [isAuthenticated, container]);
    if (openAccount && container.current)
        TweenMax.to(container.current, 1, {
            x: -500,
            opacity: 1,
            ease: 'Power2.easeInOut',
        });
    else if (container.current)
        TweenMax.to(container.current, 1, {
            x: 0,
            opacity: 0,
            ease: 'Power2.easeInOut',
        });
    if (!isAuthenticated) return '';
    if (loading || !profile) return '';
    return (
        <div ref={container} id='profile-modal'>
            <div className='header'>
                <div className='close-button'>
                    <MaterialIcon
                        role='button'
                        icon='close'
                        onClick={() => {
                            setOpenAccount(false);
                        }}
                    />
                </div>
                <div className='header-title'>Account</div>
                <div className='right-section'></div>
            </div>
            {editProfile ? (
                <CreateProfile setEditProfile={setEditProfile} initProfile={profile} />
            ) : (
                <div className='profile-table'>
                    {profile.user && (
                        <div className='profile-container' data-test='profile-element'>
                            <div className='profile-title'>Name</div>
                            <div className='profile-content'>{profile.user.name}</div>
                        </div>
                    )}
                    {profile.user && (
                        <div className='profile-container' data-test='profile-element'>
                            <div className='profile-title'>E-mail</div>
                            <div className='profile-content'>{profile.user.email}</div>
                        </div>
                    )}
                    <div className='profile-container' data-test='profile-element'>
                        <div className='profile-title'>Website</div>
                        <div className='profile-content'>{profile.website}</div>
                    </div>
                    <div className='profile-container' data-test='profile-element'>
                        <div className='profile-title'>Address</div>
                        <div className='profile-content'>{profile.location}</div>
                    </div>
                    <div className='profile-container' data-test='profile-element'>
                        <div className='profile-title'>Introduction</div>
                        <div className='profile-content'>{profile.bio}</div>
                    </div>
                    {/* <div className='profile-container' data-test='profile-element'>
            <div className='profile-title'>Groups</div>
          </div>
          {profile.groups.map((group, index) => (
            <div
              className='profile-container'
              style={{ height: '30px', border: 'none' }}
              key={index}
              data-test='profile-element'
            >
              <div className='profile-title'></div>
              <div className='profile-content'>{group}</div>
            </div>
          ))} 
          {profile.social && profile.social.facebook && (
            <div>
              <div className="profile-title">Facebook</div>
              <div className="profile-content">{profile.social.facebook}</div>
            </div>
          )}
          {profile.social && profile.social.twitter && (
            <div>
              <div className="profile-title">Twitter</div>
              <div className="profile-content">{profile.social.twitter}</div>
            </div>
          )}
          {profile.social && profile.social.instagram && (
            <div>
              <div className="profile-title">Instagram</div>
              <div className="profile-content">{profile.social.instagram}</div>
            </div>
          )}
          */}
                    <br />
                    <Button
                        outlined
                        style={{margin: '20px', width: '150px'}}
                        className='fade-in'
                        data-test='edit-button'
                        onClick={() => {
                            setEditProfile(true);
                        }}
                    >
                        <b>Edit Profile</b>
                    </Button>
                </div>
            )}
        </div>
    );
};

ProfileModal.propTypes = {
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {getCurrentProfile};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModal);
