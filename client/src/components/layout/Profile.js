import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Button from "@material/react-button";

import Spinner from "./Spinner";
import CreateProfile from "./CreateProfile";

const Profile = ({ isAuthenticated, profile: { loading, profile } }) => {
  const [editProfile, setEditProfile] = useState(false);
  // console.log("profile", profile);
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

export default Profile;
