import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import Select, { Option } from "@material/react-select";
import { receivePublicGroups } from "../../actions/group";
import "../../style/Map.scss";

const mapContainerStyle = {
  height: "500px",
  width: "100%",
  transition: "none"
};
const Map = ({
  // isAuthenticated,
  receivePublicGroups,
  allGroups,
  profile: { loading, profile }
}) => {
  const { google } = window;
  const infowindow = new google.maps.InfoWindow();
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const containerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [mapValue, setMapValue] = useState("");
  useEffect(() => {
    receivePublicGroups();
    setMap(
      new window.google.maps.Map(containerRef.current, {
        zoom: 12
      })
    );
  }, []);
  useEffect(() => {
    if (map) initSetting();
  }, [allGroups]);
  if (loading) return <Spinner />;
  // if (!isAuthenticated) return <Redirect to="/login" />;
  const initSetting = () => {
    changeGroupMap(allGroups[0].name);
    var bounds = new google.maps.LatLngBounds();
    // map.fitBounds(bounds);
  };
  const changeGroupMap = value => {
    setMapValue(value);
    clearMarkers();
    // if (value === "Home") {
    //   console.log(profile);
    //   addMarker(map, profile.location, profile.user.name, "home");
    // }

    allGroups.forEach((group, index) => {
      if (group.name === value) {
        if (group.locations.length > 0)
          map.setCenter(group.locations[0].latLng);
        group.locations.forEach(location => {
          addMarker(map, location, "marker");
        });
      }
    });
  };
  const addMarker = (map, location, type = "marker") => {
    // Marker
    const icon = {
      url: require(`../../img/${type}.png`),
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0)
      // anchor: new google.maps.Point(0, 32)
    };
    const marker = new google.maps.Marker({
      position: location.latLng,
      icon: icon,
      map: map
    });
    // InfoWindow
    const infowindowContent = infoWindowRef.current;
    infowindow.setContent(infowindowContent);
    infowindow.close();

    google.maps.event.addListener(marker, "click", function() {
      infowindowContent.children[0].textContent = location.name;
      infowindowContent.children[1].textContent = location.address;
      infowindowContent.children[2].textContent = location.description;
      infowindow.open(map, marker);
      map.setZoom(15);
      map.setCenter(marker.getPosition());
    });
    markers.push(marker);
  };
  const clearMarkers = () => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].map == null) markers.splice(i, 1);
    }
  };

  return (
    <div className="fade-in fill-content">
      <Select
        value={mapValue}
        label="Select Groups"
        className="map-selection"
        onChange={evt => changeGroupMap(evt.target.value)}
      >
        {/* <Option value="Home">Home</Option> */}
        {profile
          ? profile.groups.map((group, i) => (
              <Option key={i} value={group}>
                {group}
              </Option>
            ))
          : allGroups.map((group, i) => (
              <Option key={i} value={group.name}>
                {group.name}
              </Option>
            ))}
      </Select>
      <br />
      <br />
      <div
        ref={containerRef}
        style={mapContainerStyle}
        className="map-container"
      ></div>
      <div ref={infoWindowRef}>
        <b className="title"></b>
        <p className="address"></p>
        <br />
        <p className="description"></p>
      </div>
    </div>
  );
};
Map.propTypes = {
  allGroups: PropTypes.array.isRequired,
  receivePublicGroups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  allGroups: state.group.allGroups
});
export default connect(mapStateToProps, { receivePublicGroups })(Map);
