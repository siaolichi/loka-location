import React, { useState, useEffect, useRef, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addLocationToGroup } from '../../actions/group';

import InfoWindow from './InfoWindow';
const mapContainerStyle = {
  height: 'calc(100% - 50px)',
  width: '100%'
};
const GMap = ({ addLocationToGroup, groupId, closeModal }) => {
  const [map, setMap] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [markers] = useState([]);
  const [description, setDescription] = useState('');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const initSetting = () => {
    let searchBox = new google.maps.places.SearchBox(
      inputRef.current.childNodes[0]
    );
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputRef.current);
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      clearMarkers();

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

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

    setInfoWindow(map, marker, infowindow, place, infoWindowRef);

    google.maps.event.addListener(marker, 'click', function () {
      setInfoWindow(map, marker, infowindow, place, infoWindowRef);
    });

    markers.push(marker);
  };
  const setInfoWindow = (map, marker, infowindow, place, infoWindowRef) => {
    let address = place.formatted_address.split(',');
    if (address.length > 1) address.pop();
    address.join('');
    let infowindowContent = infoWindowRef.current;
    infowindow.setContent(infowindowContent);
    if (place.photos)
      infowindowContent.children[0].setAttribute(
        'src',
        place.photos[0].getUrl()
      );
    infowindowContent.children[1].textContent = place.name;
    infowindowContent.children[2].textContent = address;
    infowindowContent.children[3].textContent =
      place.geometry.location.lat() + ',' + place.geometry.location.lng();
    infowindowContent.children[4].setAttribute('href', place.url);

    infowindowContent.children[6].addEventListener('click', function () {
      infowindow.close(map, marker);
    });

    infowindow.open(map, marker);
  };

  const clearMarkers = () => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].map == null) markers.splice(i, 1);
    }
  };

  const addLocation = async e => {
    const parent = e.currentTarget.parentNode;
    const location = {};
    const latLng = {
      lat: parseFloat(parent.children[3].textContent.split(',')[0]),
      lng: parseFloat(parent.children[3].textContent.split(',')[1])
    };
    location.photo = parent.children[0].getAttribute('src');
    location.name = parent.children[1].textContent;
    location.address = parent.children[2].textContent;
    location.latLng = latLng;
    location.url = parent.children[4].getAttribute('href');
    location.description = description;
    await addLocationToGroup(groupId, location);
    await setDescription('');
    closeModal();
  };
  return (
    <Fragment>
      <div>
        <div
          className='input-wrapper'
          ref={inputRef}
          style={{
            width: '100%'
          }}
        >
          <input
            value={inputValue}
            style={{ color: 'black' }}
            onChange={e => setInputValue(e.currentTarget.value)}
          />
        </div>
      </div>
      <div
        ref={containerRef}
        style={mapContainerStyle}
        className='map-container fade-in'
      ></div>
      <InfoWindow
        infoWindowRef={infoWindowRef}
        description={description}
        setDescription={setDescription}
        addLocation={addLocation}
      />
    </Fragment>
  );
};

GMap.propType = {
  addLocationToGroup: PropTypes.func.isRequired
};

export default connect(null, { addLocationToGroup })(GMap);
