/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material/react-button';
import GroupList from '../elements/GroupList';
import Spinner from './Spinner';
import GroupDetail from '../elements/GroupDetail';
import Map from './Map';
import './Dashboard.scss';
import { receivePublicGroups } from '../../actions/group';
import CardModal from '../elements/CardModal';
import { OtherCroups } from '../elements/OtherCroups';

export const Dashboard = ({
  profile: { profile, loading },
  allGroups,
  receivePublicGroups,
}) => {
  const [modal, setModal] = useState({
    selected: [],
    other: [],
    currentGroupId: null,
  });
  const [editMap, setEditMap] = useState(false);
  useEffect(() => {
    receivePublicGroups();
  }, []);

  useEffect(() => {
    const updateGroup = () => {
      const selected = [],
        other = [];
      for (let group of allGroups) {
        let index = profile.groups.indexOf(group.name);
        if (index > -1) selected.push(group);
        else other.push(group);
      }
      setModal((m) => {
        return { ...m, selected, other };
      });
    };

    if (allGroups.length > 0 && profile) updateGroup();
  }, [allGroups, profile]);

  if (!profile || loading) return <Spinner />;

  const leftSection = (modal) => {
    if (!modal.currentGroupId) {
      return <GroupList modal={modal} setModal={setModal} />;
    }
    return <GroupDetail groupId={modal.currentGroupId} setModal={setModal} />;
  };
  return (
    <div id='dashboard'>
      <div className='left-section'>{leftSection(modal)}</div>
      <div className='right-section'>
        {modal.currentGroupId ? (
          <Fragment>
            {modal.selected
              .map((el) => el._id)
              .includes(modal.currentGroupId) && (
              <div>
                <Button
                  outlined
                  onClick={() => {
                    setEditMap(true);
                  }}
                  style={{ margin: '10px' }}
                >
                  Add New Location
                </Button>
              </div>
            )}
            <Map
              group={
                allGroups.filter((el) => el._id === modal.currentGroupId)[0]
              }
            />
            {editMap && (
              <CardModal
                groupId={modal.showGroup}
                editMap={editMap}
                setEditMap={setEditMap}
              />
            )}
          </Fragment>
        ) : (
          <OtherCroups other={modal.other} setModal={setModal} />
        )}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  allGroups: state.group.allGroups,
});

const mapDispatchToProps = { receivePublicGroups };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
