import React, { Fragment, useRef } from 'react';
import LocationCard from './LocationCard';
import './LocationList.scss';
import InfoWindow from '../elements/InfoWindow';
import { editInfowindowContent } from '../../utils';
import { connect } from 'react-redux';

const LocationList = ({ group, map, infowindow }) => {
  const infoWindowRef = useRef(null);

  const onCardClick = (location) => {
    const infowindowContent = infoWindowRef.current;
    infowindow.setContent(infowindowContent);
    editInfowindowContent(infowindowContent, location);

    const marker = new window.google.maps.Marker({
      position: location.latLng,
      map: map,
      visible: false,
    });

    infowindow.open(map, marker);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
  };

  return (
    <Fragment>
      {group.locations &&
        group.locations.map((location, index) => (
          <LocationCard
            location={location}
            groupId={group._id}
            key={index}
            onClick={() => {
              onCardClick(location);
            }}
          />
        ))}
      <div className='location-footer'>
        <div className='text'>this map is created by {group.user.name}</div>
        <br />
        <br />
      </div>
      <InfoWindow infoWindowRef={infoWindowRef} />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  map: state.map.map,
  infowindow: state.map.infowindow,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
