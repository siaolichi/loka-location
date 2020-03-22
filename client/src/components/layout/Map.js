import React, { useState, useEffect, useRef, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "./Spinner";
import Select, { Option } from "@material/react-select";

const mapContainerStyle = {
  height: "500px",
  width: "100%"
};
const Map = ({
  getCurrentProfile,
  auth: { isAuthenticated },
  profile: { loading, profile }
}) => {
  const { google } = window;
  const containerRef = useRef(null);
  const [mapValue, setMapValue] = useState("Home");
  useEffect(() => {
    initMap();
    getCurrentProfile();
  }, [isAuthenticated]);
  useEffect(() => {
    getCurrentProfile();
  }, [profile]);
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const markersInfo = [
    {
      addr: profile.location,
      type: "home",
      content: profile.name,
      type: "home"
    }
  ];

  const initMap = () => {
    const map = new window.google.maps.Map(containerRef.current, {
      zoom: 7
    });
    for (let info of markersInfo) {
      getLatLngFromAddr(map, info.addr, info.content, info.type);
    }
  };
  const getLatLngFromAddr = (map, addr, content, type = "marker") => {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addr }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        const icon = {
          url: require(`../../img/${type}.png`),
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 32)
        };
        const marker = new google.maps.Marker({
          position: results[0].geometry.location,
          icon: icon,
          map: map
        });
        var infowindow = new google.maps.InfoWindow({
          content: content
        });

        google.maps.event.addListener(marker, "click", function() {
          infowindow.open(map, marker);
        });
        map.setCenter(results[0].geometry.location);
        console.log("Center");
      } else console.error("error: " + status);
    });
  };

  return (
    <Fragment>
      <Select
        outlined
        label="Select Group"
        value={mapValue}
        onChange={evt => setMapValue(evt.target.value)}
      >
        <Option value="pomsky">Home</Option>
        {profile.groups.map((value, i) => (
          <Option key={i} value={value}>
            {value}
          </Option>
        ))}
      </Select>
      <br />
      <br />
      <div ref={containerRef} style={mapContainerStyle}></div>
    </Fragment>
  );
};

Map.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Map);
