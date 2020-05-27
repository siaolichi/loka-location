/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material/react-button';

import { copyStringToClipboard, editInfowindowContent } from '../../utils';
import InfoWindow from '../elements/InfoWindow';

import './Map.scss';

const GoogleMap = ({ group }) => {
  const { google } = window;
  let map, service;
  const infowindow = new google.maps.InfoWindow();
  const groupId = group._id;
  const containerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const shareBtn = useRef(null);

  const [markers] = useState([]);

  useEffect(() => {
    initSetting();
  }, []);

  useEffect(() => {
    if (group.length > 0) initSetting();
  }, [group]);

  const initSetting = () => {
    map = new google.maps.Map(containerRef.current, { zoom: 11 });
    service = new window.google.maps.places.PlacesService(map);
    const locations = group.locations;
    new google.maps.LatLngBounds();

    // Put share button at the bottom of the map
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
      shareBtn.current
    );

    // Clear marker before new markers are set
    clearMarkers();

    // If group have already location, other wise set map center to a static number
    if (locations[0]) {
      map.setCenter(locations[0].latLng);
    } else {
      map.setCenter({ lat: '120', lng: '120' });
    }

    // Marker setup
    locations.forEach(async (location) => {
      addMarker(map, location, 'marker');
    });
  };

  const addMarker = async (map, location, type = 'marker') => {
    // Marker inital setup
    const icon = {
      url: require(`../../img/${type}.png`),
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
    };
    const marker = new google.maps.Marker({
      position: location.latLng,
      icon: icon,
      map: map,
    });

    // InfoWindow, defined outside so it will closed automatically after another marker is clicked
    const infowindowContent = infoWindowRef.current;
    infowindow.setContent(infowindowContent);
    infowindow.close();

    //Get Place detail when marker is clicked
    google.maps.event.addListener(marker, 'click', function () {
      editInfowindowContent(infowindowContent, location);

      //open infoWindow after got location details
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
    <div className='fade-in' style={{ flexGrow: 1, position: 'relative' }}>
      <div ref={containerRef} className='map-container'></div>
      <InfoWindow infoWindowRef={infoWindowRef} />
      <div style={{ display: 'none' }}>
        <div className='share-map-container' ref={shareBtn}>
          <Button
            raised
            className='button'
            onClick={() => {
              copyStringToClipboard(`https://loka-location.com/map/${groupId}`);
              alert('Link is copied to your clipboard');
            }}
          >
            <Link to={`/map/${groupId}`} style={{ color: 'white' }}>
              SHARE THIS MAP!!
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default GoogleMap;
