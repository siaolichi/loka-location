import React, { useState, Fragment, useEffect } from 'react';
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
  userId
}) => {
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
      <label>name</label>
      <br />
      <div className='input-wrapper'>
        <input
          value={formData.name}
          onChange={e => {
            setFormData({ ...formData, name: e.currentTarget.value });
          }}
        />
      </div>
      <label>comment</label>
      <br />
      <div className='input-wrapper' style={{ height: '80px' }}>
        <textarea
          value={formData.description}
          onChange={e => {
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
  ) : (
    <div className='group-content location'>
      <div className='location-title'>{location.name}</div>
      <div className='location-addr'>{location.address}</div>
      <div className='location-desc'>{location.description}</div>
      {selected && userId === location.user && (
        <Fragment>
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
        </Fragment>
      )}
    </div>
  );
};

LocationCard.propTypes = {
  userId: PropTypes.string.isRequired,
  removeLocation: PropTypes.func.isRequired,
  changeLocationDetail: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userId: state.profile.profile.user._id
});

const mapDispatchToProps = { removeLocation, changeLocationDetail };

export default connect(mapStateToProps, mapDispatchToProps)(LocationCard);
