import React, { useEffect, useState, Fragment } from "react";
import { TweenMax } from "gsap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

import "../../style/Animation.scss";
const TitleAnimation = ({ login, isAuthenticated }) => {
  const [change, setChange] = useState(false);
  const [isLogin, setLogin] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      TweenMax.to(".bubble", 1, { x: 100 });
      setChange(true);
    }, 2000);
  }, []);
  useEffect(() => {
    if (change) TweenMax.to(".bubble", { y: -50, opacity: 1, duration: 1 });
  }, [change]);
  const onClick = async e => {
    e.preventDefault();
    login({ email: "testUser@gmail.com", password: "12345678" });
    setLogin(true);
  };
  if (isAuthenticated && isLogin) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      {change ? (
        <div className="bubble-container" onClick={onClick}>
          <div className="bubble">Try it here!</div>
        </div>
      ) : (
        ""
      )}
      <div className="title-animation">
        <h1 className="block-effect" style={{ "--td": "1.2s" }}>
          <div
            className="block-reveal"
            style={{ "--bc": "#fff", "--d": ".1s", fontSize: "64px" }}
          >
            LOKA
          </div>
          <div
            className="block-reveal"
            style={{ "--bc": "#fff", "--d": ".5s", fontSize: "32px" }}
          >
            Share your Maps
          </div>
        </h1>
      </div>
    </Fragment>
  );
};
TitleAnimation.propType = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};
const mapStateToProp = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProp, { login })(TitleAnimation);
