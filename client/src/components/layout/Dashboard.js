import React, { useState } from "react";
import { connect } from "react-redux";
import Profile from "./Profile";
import MyLoka from "./MyLoka";
import Map from "./Map";
import "../../style/Dashboard.scss";
const Dashboard = props => {
  const [ActiveTab, setActiveTab] = useState(Profile);
  const changeTab = e => {
    const allTabs = document.getElementsByClassName("profile-title");
    Object.values(allTabs).forEach(tab => {
      tab.classList.remove("active");
    });
    e.target.classList.add("active");
    switch (e.target.innerHTML) {
      case "Profile":
        setActiveTab(Profile);
        break;
      case "My LOKA":
        setActiveTab(MyLoka);
        break;
      case "Map":
        setActiveTab(Map);
        break;
    }
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
          <ActiveTab />
        </div>
      </div>
    </div>
  );
};

export default connect(null, null)(Dashboard);
