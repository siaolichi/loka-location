import React, { useState, useEffect, useRef, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextField, { Input } from "@material/react-text-field";
import { addLocationToGroup } from "../../actions/group";
import { Button } from "@material/react-button";
const mapContainerStyle = {
  height: "500px",
  width: "100%"
};
const GMap = ({ locations, addLocationToGroup, group_id }) => {
  const [map, setMap] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [markers] = useState([]);
  const [description, setDescription] = useState("");

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const infoWindowRef = useRef(null);

  const { google } = window;
  const infowindow = new google.maps.InfoWindow();

  useEffect(() => {
    setMap(
      new window.google.maps.Map(containerRef.current, {
        zoom: 12,
        center: { lat: 52.52, lng: 13.39 }
      })
    );
  }, []);
  useEffect(() => {
    if (map) initSetting();
  }, [map]);

  const initSetting = () => {
    let searchBox = new google.maps.places.SearchBox(
      inputRef.current.inputElement
    );
    map.addListener("bounds_changed", function() {
      searchBox.setBounds(map.getBounds());
    });
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputRef.current);
    map.addListener("bounds_changed", function() {
      searchBox.setBounds(map.getBounds());
    });
    console.log(locations);
    // locations.forEach((location, index) => {
    //   addMarker(map, location.latLng, location.name, "marker");
    // });
    searchBox.addListener("places_changed", function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      clearMarkers();

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        // Create a marker for each place.
        // setMarkers(
        //   markers.push(
        //     new google.maps.Marker({
        //       map: map,
        //       icon: icon,
        //       title: place.name,
        //       position: place.geometry.location
        //     })
        //   )
        // );
        addMarker(map, place);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  };
  const addMarker = (map, place) => {
    if (!map) return;
    const icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    const marker = new google.maps.Marker({
      position: place.geometry.location,
      title: place.name,
      icon: icon,
      map: map
    });

    // var address = "";
    // if (place.address_components) {
    //   address = [
    //     (place.address_components[0] &&
    //       place.address_components[0].short_name) ||
    //       "",
    //     (place.address_components[1] &&
    //       place.address_components[1].short_name) ||
    //       "",
    //     (place.address_components[2] &&
    //       place.address_components[2].short_name) ||
    //       ""
    //   ].join(" ");
    // }
    let address = place.formatted_address.split(",");
    address.pop();
    address.join("");
    let infowindowContent = infoWindowRef.current;
    console.log(place.name, address);
    infowindow.setContent(infowindowContent);
    infowindowContent.children[0].textContent = place.name;
    infowindowContent.children[1].textContent = address;
    infowindowContent.children[2].textContent =
      place.geometry.location.lat() + "," + place.geometry.location.lng();
    infowindowContent.children[4].addEventListener("click", function() {
      infowindow.close(map, marker);
    });
    infowindow.open(map, marker);
    google.maps.event.addListener(marker, "click", function() {
      infowindowContent.children[0].textContent = place.name;
      infowindowContent.children[1].textContent = address;
      infowindowContent.children[2].textContent =
        place.geometry.location.lat() + "," + place.geometry.location.lng();
      infowindow.open(map, marker);
    });
    markers.push(marker);
  };
  const clearMarkers = () => {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].map == null) markers.splice(i, 1);
    }
  };

  const addLocation = e => {
    const parent = e.currentTarget.parentNode;
    const location = {};
    const latLng = {
      lat: parseFloat(parent.children[2].textContent.split(",")[0]),
      lng: parseFloat(parent.children[2].textContent.split(",")[1])
    };
    location.name = parent.children[0].textContent;
    location.address = parent.children[1].textContent;
    location.latLng = latLng;
    location.description = description;
    addLocationToGroup(group_id, location);
    setDescription("");
  };
  return (
    <Fragment>
      <TextField
        label="Add new location"
        outlined
        style={{ width: "100%", margin: "10px auto", minWidth: "500px" }}
      >
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={e => setInputValue(e.currentTarget.value)}
        />
      </TextField>
      <div
        ref={containerRef}
        style={mapContainerStyle}
        className="map-container"
      ></div>
      <div ref={infoWindowRef}>
        <b className="title"></b>
        <p className="address"></p>
        <p className="lat-lng"></p>
        <TextField
          outlined
          textarea
          label="Add description"
          style={{
            width: "100%",
            margin: "10px auto",
            fontSize: "10px"
          }}
        >
          <Input
            value={description}
            onChange={e => setDescription(e.currentTarget.value)}
          />
        </TextField>
        <Button onClick={addLocation}>Add Location</Button>
      </div>
    </Fragment>
  );
};

GMap.propType = {
  addLocationToGroup: PropTypes.func.isRequired
};

export default connect(null, { addLocationToGroup })(GMap);
