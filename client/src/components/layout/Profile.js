import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import Button from "@material/react-button";

import { getCurrentProfile } from "../../actions/profile";

import Spinner from "./Spinner";
import CreateProfile from "./CreateProfile";

const Profile = ({
  getCurrentProfile,
  auth: { isAuthenticated },
  profile: { loading, profile }
}) => {
  const [editProfile, setEditProfile] = useState(false);
  useEffect(() => {
    console.log("GetProfile", isAuthenticated);
    getCurrentProfile();
  }, [isAuthenticated, editProfile]);
  console.log("profile", profile);
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (editProfile)
    return (
      <CreateProfile setEditProfile={setEditProfile} initProfile={profile} />
    );
  if (profile === null) {
    return (
      <div>
        <Button
          outlined
          style={{ margin: "20px", border: "solid 1px #AAA", color: "black" }}
          className="fade-in"
          onClick={() => {
            setEditProfile(true);
          }}
        >
          Create Profile
        </Button>
      </div>
    );
  } else {
    return (
      <div id="profile">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {profile.user && (
            <div className="profile-container">
              <div className="profile-title">Name:</div>
              <div className="profile-content">{profile.user.name}</div>
            </div>
          )}
          {profile.user && (
            <div className="profile-container">
              <div className="profile-title">E-mail:</div>
              <div className="profile-content">{profile.user.email}</div>
            </div>
          )}
          <div className="profile-container">
            <div className="profile-title">Website:</div>
            <div className="profile-content">{profile.website}</div>
          </div>
          <div className="profile-container">
            <div className="profile-title">Address:</div>
            <div className="profile-content">{profile.location}</div>
          </div>
          <div className="profile-container">
            <div className="profile-title">Introduction:</div>
            <div className="profile-content">{profile.bio}</div>
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
          style={{ margin: "20px", border: "solid 1px #AAA", color: "black" }}
          className="fade-in"
          onClick={() => {
            setEditProfile(true);
          }}
        >
          Edit Profile
        </Button>
      </div>
    );
  }
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Profile);
