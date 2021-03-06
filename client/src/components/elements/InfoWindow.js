import React, { Fragment } from 'react';
import TextField, { Input } from '@material/react-text-field';
import { Button } from '@material/react-button';
import './InfoWIndow.scss';

const InfoWindow = ({
  infoWindowRef,
  description,
  setDescription,
  addLocation
}) => {
  return (
    <div style={{ display: 'none' }}>
      <div ref={infoWindowRef} className='infowindow'>
        <div className='photo'></div>
        <b className='title'></b>
        <p className='address'></p>
        <p className='lat-lng'></p>
        {addLocation ? (
          <Fragment>
            <a target='_blank' href='!#'>
              <b>Show on google map</b>
            </a>
            <TextField
              outlined
              textarea
              label='Add description'
              style={{
                width: '100%',
                margin: '10px auto',
                fontSize: '10px'
              }}
            >
              <Input
                value={description}
                onChange={e => setDescription(e.currentTarget.value)}
              />
            </TextField>
            <Button onClick={addLocation}>Add Location</Button>
          </Fragment>
        ) : (
          <Fragment>
            <p className='description' style={{ margin: '10px' }}></p>
            <a className='link' target='_blank' href='!#'>
              <b>Show on google map</b>
            </a>
          </Fragment>
        )}
        <div style={{ display: 'none' }} className='placeId'></div>
      </div>
    </div>
  );
};

export default InfoWindow;
