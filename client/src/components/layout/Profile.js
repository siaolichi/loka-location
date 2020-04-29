import React, { useState } from 'react';
import Button from '@material/react-button';

import CreateProfile from './CreateProfile';

const Profile = ({ profile }) => {
  const [editProfile, setEditProfile] = useState(false);
  if (editProfile)
    return (
      <CreateProfile setEditProfile={setEditProfile} initProfile={profile} />
    );
  return (
    <div id='profile' data-test='component-profile'>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {profile.user && (
          <div className='profile-container' data-test='profile-element'>
            <div className='profile-title'>Name:</div>
            <div className='profile-content'>{profile.user.name}</div>
          </div>
        )}
        {profile.user && (
          <div className='profile-container' data-test='profile-element'>
            <div className='profile-title'>E-mail:</div>
            <div className='profile-content'>{profile.user.email}</div>
          </div>
        )}
        <div className='profile-container' data-test='profile-element'>
          <div className='profile-title'>Website:</div>
          <div className='profile-content'>{profile.website}</div>
        </div>
        <div className='profile-container' data-test='profile-element'>
          <div className='profile-title'>Address:</div>
          <div className='profile-content'>{profile.location}</div>
        </div>
        <div className='profile-container' data-test='profile-element'>
          <div className='profile-title'>Introduction:</div>
          <div className='profile-content'>{profile.bio}</div>
        </div>
        {/* {profile.social && profile.social.facebook && (
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
      </div>
      <br />
      <Button
        outlined
        style={{ margin: '20px', border: 'solid 1px #AAA', color: 'black' }}
        className='fade-in'
        data-test='edit-button'
        onClick={() => {
          setEditProfile(true);
        }}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default Profile;
