import React, { useState, useEffect } from 'react';
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

export const Dashboard = ({
  profile: { profile, loading },
  allGroups,
  receivePublicGroups
}) => {
  const [modal, setModal] = useState({
    selected: [],
    other: [],
    status: 'selected',
    showModal: null
  });
  const [editMap, setEditMap] = useState(false);

  useEffect(() => {
    receivePublicGroups();
  }, []);

  useEffect(() => {
    const updateGroup = () => {
      const selected = [],
        other = [];
      let showModal = null;
      for (let group of allGroups) {
        if (modal.showModal && group._id === modal.showModal._id) {
          showModal = Object.assign({}, modal.showModal, group);
          console.log(showModal);
        }
        let index = profile.groups.indexOf(group.name);
        if (index > -1) selected.push(group);
        else other.push(group);
      }
      setModal(m => {
        return { ...m, selected, other, showModal };
      });
    };

    if (allGroups.length > 0 && profile) updateGroup();
  }, [allGroups, profile]);

  if (!profile || loading) return <Spinner />;

  const leftSection = modal => {
    switch (modal.status) {
      case 'selected':
        return <GroupList modal={modal} setModal={setModal} />;
      case 'other':
        return <GroupList modal={modal} setModal={setModal} />;
      case 'group-detail':
        return <GroupDetail group={modal.showModal} setModal={setModal} />;
        break;
      default:
        break;
    }
  };
  return (
    <div id='dashboard'>
      <div className='left-section'>{leftSection(modal)}</div>
      <div className='right-section'>
        {modal.showModal && (
          <Button
            outlined
            onClick={() => {
              setEditMap(true);
            }}
            style={{ margin: '10px' }}
          >
            Add New Location
          </Button>
        )}
        {modal.showModal && <Map groupId={modal.showModal._id} />}
        {modal.showModal && editMap && (
          <CardModal
            groupId={modal.showModal._id}
            groupName={modal.showModal.name}
            editMap={editMap}
            setEditMap={setEditMap}
          />
        )}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  allGroups: state.group.allGroups
});

const mapDispatchToProps = { receivePublicGroups };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
