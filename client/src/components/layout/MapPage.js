import React, { useEffect, useState, useRef } from 'react';
import Map from './Map';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Select, { Option } from '@material/react-select';
import PropTypes from 'prop-types';

import { receivePublicGroups } from '../../actions/group';
import './MapPage.scss';
import LocationList from '../elements/LocationList';
import Spinner from './Spinner';
import { staggerIn } from '../../utils';

const MapPage = ({
  match,
  receivePublicGroups,
  allGroups,
  isAuthenticated
}) => {
  const listRef = useRef(null);
  const [groupId, setGroupId] = useState('5e7b564e1e97b17df5768734');
  const [selectedGroup, setSelectedGroup] = useState(null);
  useEffect(() => {
    receivePublicGroups();
  }, []);
  useEffect(() => {
    console.log(listRef);
    if (listRef.current) staggerIn(listRef.current.childNodes);
  }, [listRef.current]);
  useEffect(() => {
    if (allGroups.length > 0) {
      changeGroup(groupId);
    }
  }, [allGroups]);
  const changeGroup = groupId => {
    setGroupId(groupId);
    let tmpGroup = allGroups.filter(group => group._id === groupId);
    if (tmpGroup.length === 0) {
      setSelectedGroup(allGroups[0]);
      setGroupId(allGroups[0]._id);
    } else {
      setSelectedGroup(tmpGroup[0]);
    }
  };
  useEffect(() => {
    if (setSelectedGroup && listRef.current)
      staggerIn(listRef.current.childNodes);
  }, [setSelectedGroup]);
  if (!selectedGroup || !allGroups) return <Spinner />;
  return (
    <div id='map-page'>
      <div className='left-section'>
        <Select
          value={groupId}
          label='Select Groups'
          className={isAuthenticated ? 'map-selection' : 'map-selection dark'}
          outlined
          onChange={evt => {
            changeGroup(evt.target.value);
          }}
        >
          {/* <Option value="Home">Home</Option> */}
          {allGroups.map((group, i) => (
            <Option key={group._id} value={group._id}>
              {group.name}
            </Option>
          ))}
        </Select>
        <div
          className={isAuthenticated ? 'list-wrapper' : 'list-wrapper dark'}
          ref={listRef}
        >
          <LocationList group={selectedGroup} />
          <div></div>
        </div>
      </div>
      <div className='right-section'>
        <Route
          exact
          path={match.path}
          component={({ match }) => {
            return <Map group={selectedGroup} match={match} />;
          }}
        />
        <Route
          exact
          path={`${match.path}/:groupId`}
          component={({ match }) => {
            changeGroup(match.params.groupId);
            return <Map group={selectedGroup} match={match} />;
          }}
        />
      </div>
    </div>
  );
};

MapPage.propTypes = {
  allGroups: PropTypes.array.isRequired,
  receivePublicGroups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  allGroups: state.group.allGroups,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { receivePublicGroups })(MapPage);
