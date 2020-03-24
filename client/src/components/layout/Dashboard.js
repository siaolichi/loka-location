import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profile";
import Profile from "./Profile";
import MyLoka from "./MyLoka";
import Map from "./Map";
import "../../style/Dashboard.scss";
const Dashboard = ({
  getCurrentProfile,
  auth: { isAuthenticated },
  profile: { loading, profile }
}) => {
  useEffect(() => {
    console.log("GetProfile", isAuthenticated);
    getCurrentProfile();
  }, [isAuthenticated, getCurrentProfile]);
  const [ActiveTab, setActiveTab] = useState("Profile");
  const changeTab = e => {
    const allTabs = document.getElementsByClassName("profile-title");
    Object.values(allTabs).forEach(tab => {
      tab.classList.remove("active");
    });
    e.target.classList.add("active");
    setActiveTab(e.target.innerHTML);
  };

  return (
    <div id="dashboard" className="fade-in">
      <div className="tabs">
        <button className="profile-title active" onClick={e => changeTab(e)}>
          Profile
        </button>
        <button className="profile-title" onClick={e => changeTab(e)}>
          My LOKA
        </button>
        <button className="profile-title" onClick={e => changeTab(e)}>
          Map
        </button>
      </div>

      <div className="tab__content">
        <div className="content__wrapper">
          {ActiveTab === "Profile" ? (
            <Profile
              profile={{ profile, loading }}
              isAuthenticated={isAuthenticated}
            />
          ) : ActiveTab === "My LOKA" ? (
            <MyLoka
              profile={{ profile, loading }}
              isAuthenticated={isAuthenticated}
            />
          ) : ActiveTab === "Map" ? (
            <Map
              profile={{ profile, loading }}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <Redirect to="/" />
          )}
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
