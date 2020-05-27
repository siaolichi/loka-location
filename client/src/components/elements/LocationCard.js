import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialIcon from '@material/react-material-icon';
import Button from '@material/react-button';

import './LocationCard.scss';
import { removeLocation, changeLocationDetail } from '../../actions/group';

const LocationCard = ({
  location,
  groupId,
  selected,
  removeLocation,
  changeLocationDetail,
  profile,
}) => {
  const userId = profile ? profile.user._id : null;
  const [locationEdit, setLocationEdit] = useState(false);
  const [formData, setFormData] = useState(location);
  useEffect(() => {
    setFormData(location);
  }, [location]);
  const onUpdate = () => {
    changeLocationDetail(groupId, formData);
    setLocationEdit(false);
  };
  const onCanceled = () => {
    setLocationEdit(false);
    setFormData(location);
  };
  return locationEdit ? (
    <div className='group-content location'>
      <div className='left-section'></div>
      <div className='right-section'>
        <label>name</label>
        <br />
        <div className='input-wrapper'>
          <input
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.currentTarget.value });
            }}
          />
        </div>
        <label>comment</label>
        <br />
        <div className='input-wrapper' style={{ height: '80px' }}>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.currentTarget.value });
            }}
          />
        </div>
        <br />
        <Button outlined style={{ margin: '20px' }} onClick={onUpdate}>
          <b>Update</b>
        </Button>
        <Button outlined style={{ margin: '20px' }} onClick={onCanceled}>
          <b>Canceled</b>
        </Button>
      </div>
    </div>
  ) : (
    <div className='group-content location'>
      <div className='left-section'>
        {location.photo && (
          <img
            src={location.photo}
            alt={location.name}
            className='location-img'
          />
        )}
      </div>
      <div className='right-section'>
        <div className='location-title'>{location.name}</div>
        <div className='location-addr'>{location.address}</div>
        <div className='location-desc'>{location.description}</div>
        {selected && userId === location.user && (
          <div>
            <MaterialIcon
              icon='delete'
              className='edit-button'
              onClick={() => {
                removeLocation(groupId, location._id);
              }}
            />
            <MaterialIcon
              icon='edit'
              className='edit-button'
              onClick={() => {
                setLocationEdit(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

LocationCard.propTypes = {
  profile: PropTypes.object,
  removeLocation: PropTypes.func.isRequired,
  changeLocationDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const mapDispatchToProps = { removeLocation, changeLocationDetail };

export default connect(mapStateToProps, mapDispatchToProps)(LocationCard);
