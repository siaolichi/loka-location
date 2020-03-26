import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import Select, { Option } from "@material/react-select";
import { receivePublicGroups } from "../../actions/group";
import "../../style/Map.scss";
import { Button } from "@material/react-button";
import { setAlert } from "../../actions/alert";

const mapContainerStyle = {
  height: "500px",
  width: "100%",
  transition: "none"
};

function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement("textarea");
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(el);
}
const Map = ({
  match,
  receivePublicGroups,
  allGroups,
  profile: { loading, profile }
}) => {
  const { google } = window;
  const infowindow = new google.maps.InfoWindow();
  const [map, setMap] = useState(null);
  const [markers] = useState([]);
  const containerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [mapValue, setMapValue] = useState(
    profile ? profile.groups[0] : "Bubble Tea in Berlin"
  );
  const [groupId, setGroupId] = useState("");
  useEffect(() => {
    receivePublicGroups();
    setMap(
      new google.maps.Map(containerRef.current, {
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
    if (match) {
      const { params } = match;
      console.log(params);
      const initIndex = allGroups
        .map(group => group._id)
        .indexOf(params.groupId);
      if (allGroups[initIndex]) {
        setMapValue(allGroups[initIndex].name);
      } else {
        setMapValue(allGroups[0].name);
        setAlert("No group ID was found", "danger");
      }
    }
    changeGroupMap(mapValue);
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
        setGroupId(group._id);
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
      infowindowContent.children[3].textContent = location.description;
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
      <div className="share-map-container">
        <Button
          className="share-map-button"
          onClick={() => {
            copyStringToClipboard(
              `https://loka-location.herokuapp.com/map/${groupId}`
            );
            alert("Link is copied to your clipboard");
          }}
        >
          <Link to={`/map/${groupId}`}>SHARE THIS MAP!!</Link>
        </Button>
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
