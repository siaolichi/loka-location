import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select, { Option } from '@material/react-select';
import { Button } from '@material/react-button';

import { receivePublicGroups } from '../../actions/group';

import { setAlert } from '../../actions/alert';
import { copyStringToClipboard } from '../../utils';
import '../../style/Map.scss';
import InfoWindow from '../elements/InfoWindow';
import Spinner from './Spinner';

const mapContainerStyle = {
  height: 'calc( 100vh - 250px )',
  width: '100%',
  transition: 'none'
};

const GoogleMap = ({
  match,
  receivePublicGroups,
  allGroups,
  profile: { profile, loading }
}) => {
  const { google } = window;
  const infowindow = new google.maps.InfoWindow();
  const [map, setMap] = useState(null);
  const [markers] = useState([]);
  const containerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [mapValue, setMapValue] = useState(
    profile ? profile.groups[0] : 'Bubble Tea in Berlin'
  );
  const [groupId, setGroupId] = useState('');
  useEffect(() => {
    receivePublicGroups();
    setMap(
      new google.maps.Map(containerRef.current, {
        zoom: 12
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (map) initSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGroups]);
  const initSetting = () => {
    if (match) {
      const { params } = match;
      const initIndex = allGroups
        .map(group => group._id)
        .indexOf(params.groupId);
      if (allGroups[initIndex]) {
        setMapValue(allGroups[initIndex].name);
      } else {
        setMapValue(allGroups[0].name);
        setAlert('No group ID was found', 'danger');
      }
    }
    changeGroupMap(mapValue);
    // let bounds = new google.maps.LatLngBounds();
    new google.maps.LatLngBounds();
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
          addMarker(map, location, 'marker');
        });
      }
    });
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
      infowindowContent.children[0].textContent = location.name;
      infowindowContent.children[1].textContent = location.address;
      infowindowContent.children[3].textContent = location.description;
      infowindowContent.children[4].setAttribute(
        'href',
        `https://www.google.com/maps/search/?api=1&query=${location.latLng.lat},${location.latLng.lng}`
      );
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
    <div className='fade-in full-container'>
      <Select
        value={mapValue}
        label='Select Groups'
        className='map-selection'
        outlined
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
        className='map-container'
      ></div>
      <InfoWindow infoWindowRef={infoWindowRef} />
      <div className='share-map-container'>
        <Button
          className='share-map-button'
          onClick={() => {
            copyStringToClipboard(
              `https://loka-location.herokuapp.com/map/${groupId}`
            );
            alert('Link is copied to your clipboard');
          }}
        >
          <Link to={`/map/${groupId}`}>SHARE THIS MAP!!</Link>
        </Button>
      </div>
    </div>
  );
};
GoogleMap.propTypes = {
  allGroups: PropTypes.array.isRequired,
  receivePublicGroups: PropTypes.func.isRequired,
  profile: PropTypes.object,
  allGroups: PropTypes.array
};

const mapStateToProps = state => ({
  allGroups: state.group.allGroups,
  profile: state.profile
});
export default connect(mapStateToProps, { receivePublicGroups })(GoogleMap);
