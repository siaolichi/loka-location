import React from 'react';
import Map from './Map';

const MapPage = ({ match }) => {
  const mapWrapper = {
    width: '100%',
    height: 'calc(100vh - 120px)',
    display: 'flex'
  };
  return (
    <div style={mapWrapper}>
      <Map match={match} />
    </div>
  );
};

export default MapPage;
