/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, useState, useRef } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select, { Option } from '@material/react-select';

import Map from './Map';
import LocationList from '../elements/LocationList';
import Spinner from './Spinner';

import { receivePublicGroups, changeGroupDetail } from '../../actions/group';
import { staggerIn } from '../../utils';

import './MapPage.scss';

const MapPage = ({
  match,
  receivePublicGroups,
  changeGroupDetail,
  allGroups,
  loading,
  isAuthenticated,
}) => {
  const listRef = useRef(null);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    receivePublicGroups();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      setTimeout(() => {
        staggerIn(listRef.current.childNodes);
      }, 100);
    }
  }, [groupId]);

  useEffect(() => {
    if (loading === false) {
      changeGroup(allGroups[0]._id);
    }
  }, [loading]);

  const changeGroup = async (groupId) => {
    let group =
      allGroups.filter((group) => group._id === groupId)[0] || allGroups[0];
    await changeGroupDetail(group);
    setGroupId(group._id);
  };
  if (
    groupId &&
    !allGroups.filter((group) => group._id === groupId)[0].locations[0].photo
  )
    return <Spinner />;
  if (!groupId || !allGroups) return <Spinner />;

  return (
    <div id='map-page'>
      <div className='left-section'>
        <Select
          value={groupId}
          label='Select Groups'
          className={isAuthenticated ? 'map-selection' : 'map-selection dark'}
          outlined
          onChange={(evt) => {
            changeGroup(evt.target.value);
          }}
        >
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
          <LocationList
            group={allGroups.filter((group) => group._id === groupId)[0]}
          />
          <div></div>
        </div>
      </div>
      <div className='right-section'>
        <Route
          exact
          path={match.path}
          component={({ match }) => {
            return (
              <Map
                group={allGroups.filter((group) => group._id === groupId)[0]}
                match={match}
              />
            );
          }}
        />
        <Route
          exact
          path={`${match.path}/:groupId`}
          component={({ match }) => {
            changeGroup(match.params.groupId);
            return (
              <Map
                group={allGroups.filter((group) => group._id === groupId)[0]}
                match={match}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

MapPage.propTypes = {
  allGroups: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  receivePublicGroups: PropTypes.func.isRequired,
  changeGroupDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  allGroups: state.group.allGroups,
  loading: state.group.loading,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  receivePublicGroups,
  changeGroupDetail,
})(MapPage);
