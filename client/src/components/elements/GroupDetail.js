import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import { staggerIn, fadeOut } from '../../utils';
import { addGroupToProfile, removeGroupToProfile } from '../../actions/profile';
import {
  changeGroupDetail,
  removeGroupFromAllGroups,
} from '../../actions/group';
import './GroupDetail.scss';
import LocationList from './LocationList';
import Spinner from '../layout/Spinner';

export const GroupDetail = ({
  allGroups,
  groupId,
  userId,
  setModal,
  changeGroupDetail,
  addGroupToProfile,
  removeGroupToProfile,
  removeGroupFromAllGroups,
}) => {
  const [group, setGroup] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    changeGroupDetail(allGroups.filter((el) => el._id === groupId)[0]);
  }, []);
  const groupRef = useRef(null);

  useEffect(() => {
    setGroup(allGroups.filter((el) => el._id === groupId)[0]);
  }, [allGroups]);

  useEffect(() => {
    if (group && group.locations[0].photo) setLoaded(true);
  }, [group]);

  useEffect(() => {
    if (loaded) {
      staggerIn(groupRef.current.childNodes);
    }
  }, [loaded]);

  if (!groupId) {
    setModal((m) => ({ ...m, currentGroupId: null }));
    return '';
  }
  if (!loaded) return <Spinner />;

  const onBack = () => {
    const callback = () => {
      setModal((m) => ({ ...m, currentGroupId: null }));
    };
    fadeOut(groupRef.current.childNodes, callback);
  };
  const onJoinGroup = (name) => {
    addGroupToProfile(name);
    group.selected = true;
  };
  const onLeaveGroup = (name) => {
    removeGroupToProfile(name);
    group.selected = false;
  };

  return (
    <div id='group-detail' className='fade-in'>
      <div className='header'>
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
      </div>
      <div className='group-wrapper' ref={groupRef}>
        <LocationList group={group} />
        {userId === group.user._id && (
          <Button
            onClick={(e) => {
              removeGroupFromAllGroups(group);
            }}
          >
            Delete Map Completely
          </Button>
        )}
      </div>
    </div>
  );
};

GroupDetail.propTypes = {
  useId: PropTypes.string,
  group: PropTypes.object,
  addGroupToProfile: PropTypes.func.isRequired,
  removeGroupToProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userId: state.profile.profile.user._id,
  allGroups: state.group.allGroups,
});

const mapDispatchToProps = {
  changeGroupDetail,
  addGroupToProfile,
  removeGroupToProfile,
  removeGroupFromAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);
