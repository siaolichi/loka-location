import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import PropTypes from "prop-types";
// import axios from "axios";
import {
  GoogleMap,
  useLoadScript,
  InfoWindow,
  Marker,
  useGoogleMap
} from "@react-google-maps/api";
const Map = props => {
  const [windowToggle, setWindowToggle] = useState({
    isOpen: false
  });
  const [position, setPosition] = useState({
    lat: 52,
    lng: 13
  });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDxKgb-lLBEg64zhXSLx_f1P_GrKTmYLKU"
  });
  const infoStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15
  };

  const openInfoWindow = e => {
    setWindowToggle({
      position: e.latLng,
      isOpen: true
    });
  };
  const closeToggle = e => {
    setWindowToggle({
      ...windowToggle,
      isOpen: false
    });
  };
  const renderMap = () => {
    const { google } = window;
    const getLatLngFromAddr = addr => {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: addr }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          setPosition(results[0].geometry.location);
        } else console.error("error: " + status);
      });
    };
    getLatLngFromAddr("Göhrener str.13, 10437 Berlin");
    const icon = {
      url: require("../../img/marker.png"),
      scaledSize: new google.maps.Size(50, 50)
    };
    return (
      <GoogleMap
        id="circle-example"
        mapContainerStyle={{
          height: "500px",
          width: "100%"
        }}
        zoom={7}
        center={position}
      >
        <Marker
          position={position}
          onClick={openInfoWindow}
          icon={icon}
          style={{ width: "10px", height: "10px" }}
        >
          {windowToggle.isOpen && (
            <InfoWindow position={position} onCloseClick={closeToggle}>
              <div style={infoStyle}>
                <h1>InfoWindow</h1>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? (
    renderMap()
  ) : (
    <div>Map cannot be loaded right now, sorry.</div>
  );
};

// Map.propTypes = {};

export default connect(null, null)(Map);
