import React, { useState, useEffect, useRef, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import Select, { Option } from "@material/react-select";
import { receivePublicGroups } from "../../actions/group";

const mapContainerStyle = {
  height: "500px",
  width: "100%"
};
const Map = ({
  isAuthenticated,
  receivePublicGroups,
  allGroups,
  profile: { loading, profile }
}) => {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const { google } = window;
  const containerRef = useRef(null);
  const [mapValue, setMapValue] = useState("Home");
  useEffect(() => {
    setMap(new window.google.maps.Map(containerRef.current, {
      zoom: 12
    }));
    receivePublicGroups();
  }, []);
  useEffect(() => {
    if(map) addMarker(map, profile.location, profile.user.name, "home");
  }, [map]);
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;


  const changeGroupMap = (value) => {
    setMapValue(value);
    clearMarkers();
    if ( value === "Home" ) {
      console.log(profile)
      addMarker(map, profile.location, profile.user.name, "home");
    }
    allGroups.forEach((group, index)=>{
      if ( group.name === value ) {
        group.locations.forEach((location)=>{
          addMarker(map, location.address, location.name, "marker");
        })
      }
    });
  }
  const addMarker = (map, addr, content, type = "marker") => {
    let geocoder = new google.maps.Geocoder();
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
        })
        console.log(content)
        let infowindow = new google.maps.InfoWindow({
          content: content
        });

        google.maps.event.addListener(marker, "click", function() {
          infowindow.open(map, marker);
        });
        markers.push(marker);
        map.setCenter(results[0].geometry.location);
      } else console.error("error: " + status);
    });
  };
  const clearMarkers = () => {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (var i = 0; i < markers.length; i++) {
      if(markers[i].map == null) markers.splice(i, 1);
    }
  }

  return (
    <Fragment>
      <Select
        outlined
        label="Select Group"
        value={mapValue}
        onChange={evt => changeGroupMap(evt.target.value)}
      >
        <Option value="Home">Home</Option>
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
  allGroups: PropTypes.array.isRequired,
  receivePublicGroups:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  allGroups: state.group.allGroups
});
export default connect(mapStateToProps, {receivePublicGroups})(Map);
