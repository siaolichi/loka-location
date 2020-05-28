import React, { Fragment } from 'react';
import LocationCard from './LocationCard';
import './LocationList.scss';

const LocationList = ({ group, style }) => {
  return (
    <Fragment>
      {group.locations &&
        group.locations.map((location, index) => (
          <LocationCard location={location} groupId={group._id} key={index} />
        ))}
      <div className='location-footer'>
        <div className='text'>this map is created by {group.user.name}</div>
        <br />
        <br />
      </div>
    </Fragment>
  );
};

export default LocationList;
