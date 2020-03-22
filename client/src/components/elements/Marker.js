import React from "react";
import PropTypes from "prop-types";

const Marker = props => {
  const markerImg = {
    backgroundImage: require("../../img/marker.png")
  };
  return (
    <div>
      <img style={markerImg}></img>
    </div>
  );
};

Marker.propTypes = {};

export default Marker;
