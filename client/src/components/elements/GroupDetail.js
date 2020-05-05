import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import { staggerIn, fadeOut } from '../../utils';
import { addGroupToProfile, removeGroupToProfile } from '../../actions/profile';
import { removeGroupFromAllGroups } from '../../actions/group';
import LocationCard from './LocationCard';
import './GroupDetail.scss';

export const GroupDetail = ({
  group,
  userId,
  setModal,
  addGroupToProfile,
  removeGroupToProfile,
  removeGroupFromAllGroups
}) => {
  const groupRef = useRef(null);
  useEffect(() => {
    staggerIn(groupRef.current.childNodes);
  }, []);
  if (!group) {
    setModal(m => ({ ...m, status: 'selected', showModal: null }));
    return '';
  }
  const onBack = () => {
    const callback = () => {
      if (group.selected) {
        setModal(m => ({ ...m, status: 'selected', showModal: null }));
      } else {
        setModal(m => ({ ...m, status: 'other', showModal: null }));
      }
    };
    fadeOut(groupRef.current.childNodes, callback);
  };
  const onJoinGroup = name => {
    addGroupToProfile(name);
    group.selected = true;
  };
  const onLeaveGroup = name => {
    removeGroupToProfile(name);
    group.selected = false;
  };
  return (
    <div id='group-detail' className='fade-in'>
      <div className='title'>{group.name}</div>
      {group.selected ? (
        <MaterialIcon
          icon='favorite'
          className='icon-button favorite'
          onClick={() => {
            onLeaveGroup(group.name);
          }}
        />
      ) : (
        <MaterialIcon
          icon='favorite_border'
          className='icon-button favorite'
          onClick={() => {
            onJoinGroup(group.name);
          }}
        />
      )}
      <MaterialIcon
        icon='arrow_back'
        className='icon-button'
        onClick={() => {
          onBack();
        }}
      />
      <div className='group-wrapper' ref={groupRef}>
        {group.locations &&
          group.locations.map((location, index) => (
            <LocationCard
              location={location}
              groupId={group._id}
              selected={group.selected}
              key={index}
            />
          ))}
        <div className='footer'>
          <div className='text'>created by {group.user.name}</div>
          {userId === group.user._id && (
            <Button
              onClick={e => {
                removeGroupFromAllGroups(group);
              }}
            >
              Delete Map Completely
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

GroupDetail.propTypes = {
  useId: PropTypes.string,
  group: PropTypes.object,
  addGroupToProfile: PropTypes.func.isRequired,
  removeGroupToProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ userId: state.profile.profile.user._id });

const mapDispatchToProps = {
  addGroupToProfile,
  removeGroupToProfile,
  removeGroupFromAllGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);
