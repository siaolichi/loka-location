/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material/react-button';

import { copyStringToClipboard } from '../../utils';
import '../../style/Map.scss';
import InfoWindow from '../elements/InfoWindow';

const GoogleMap = ({ group }) => {
  const { google } = window;
  let map;
  const infowindow = new google.maps.InfoWindow();
  const groupId = group._id;
  const containerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const shareBtn = useRef(null);

  // const [map, setMap] = useState(null);
  const [markers] = useState([]);

  useEffect(() => {
    map = new google.maps.Map(containerRef.current, {
      zoom: 11
    });
    initSetting();
  }, []);
  useEffect(() => {
    if (group.length > 0) initSetting();
  }, [group]);
  const initSetting = () => {
    const locations = group.locations;
    new google.maps.LatLngBounds();
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
      shareBtn.current
    );
    clearMarkers();
    if (locations[0]) {
      map.setCenter(locations[0].latLng);
    } else {
      map.setCenter({ lat: '120', lng: '120' });
    }
    locations.forEach(location => {
      addMarker(map, location, 'marker');
    });
    // let bounds = new google.maps.LatLngBounds();
    // map.fitBounds(bounds);
  };
  const addMarker = (map, location, type = 'marker') => {
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

    google.maps.event.addListener(marker, 'click', function () {
      if (location.photo) {
        infowindowContent.children[0].setAttribute('src', location.photo);
      } else {
        infowindowContent.children[0].setAttribute('style', 'display: none');
      }
      infowindowContent.children[1].textContent = location.name;
      infowindowContent.children[2].textContent = location.address;
      infowindowContent.children[4].textContent = location.description;

      if (location.url) {
        infowindowContent.children[5].setAttribute('href', location.url);
      } else {
        infowindowContent.children[5].setAttribute(
          'href',
          `https://www.google.com/maps/search/?api=1&query=${location.latLng.lat},${location.latLng.lng}`
        );
      }
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
    <div className='fade-in' style={{ flexGrow: 1 }}>
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
