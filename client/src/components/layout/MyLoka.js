import React, { useState, useEffect } from 'react';
import Button from '@material/react-button';
import PropTypes from 'prop-types';
import TextField, { Input, HelperText } from '@material/react-text-field';
import { connect } from 'react-redux';

import CardGrid from '../elements/CardGrid';
import { receivePublicGroups, createGroup } from '../../actions/group';
import Spinner from './Spinner';

const MyLoka = ({
  backToProfile,
  createGroup,
  receivePublicGroups,
  allGroups,
  profile: { profile, loading }
}) => {
  const [modal, setModal] = useState({
    openPublic: false,
    openPrivate: false,
    createPublic: false,
    choices: ['Berlin Wi-Fi Cafe', 'Berlin Twainese Restaurant'],
    newPublicGroupInput: '',
    newGroupInput: '',
    newGroupCode: '',
    selectedChoice: [],
    otherChoice: []
  });
  useEffect(() => {
    const initGroup = () => {
      const selected = [],
        other = [];
      for (let group of allGroups) {
        let index = profile.groups.indexOf(group.name);
        if (index > -1) selected.push(group);
        else other.push(group);
      }
      setModal(m => {
        return {
          ...m,
          selectedChoice: selected,
          otherChoice: other
        };
      });
    };

    if (allGroups.length > 0) initGroup();
  }, [allGroups, profile]);
  useEffect(() => {
    receivePublicGroups();
  }, []);

  if (!profile) {
    alert('Please create profile first.');
    backToProfile();
  }
  if (loading) return <Spinner />;
  return (
    <div>
      <CardGrid type='selected' choices={modal.selectedChoice} />
      <Button
        outlined
        style={{ margin: '20px', border: 'solid 1px #AAA', color: 'black' }}
        className='fade-in'
        onClick={() => {
          setModal({
            ...modal,
            openPublic: !modal.openPublic,
            openPrivate: false,
            createPublic: false
          });
        }}
      >
        Join Group
      </Button>
      <Button
        outlined
        style={{ margin: '20px', border: 'solid 1px #AAA', color: 'black' }}
        className='fade-in'
        onClick={() => {
          setModal({
            ...modal,
            createPublic: !modal.createPublic,
            openPrivate: false,
            openPublic: false
          });
        }}
      >
        Create Group
      </Button>
      {/* <Button
        outlined
        style={{ margin: "20px", border: "solid 1px #AAA", color: "black" }}
        className="fade-in"
        onClick={() => {
          setModal({
            ...modal,
            openPrivate: !modal.openPrivate,
            openPublic: false
          });
        }}
      >
        Add Private Group
      </Button> */}
      {modal.createPublic && (
        <div>
          <TextField label='Create group' outlined>
            <Input
              value={modal.newPublicGroupInput}
              onChange={e =>
                setModal({
                  ...modal,
                  newPublicGroupInput: e.currentTarget.value
                })
              }
            />
          </TextField>
          <Button
            outlined
            style={{
              margin: '20px',
              border: 'solid 1px #AAA',
              color: 'black',
              display: 'inline-box'
            }}
            className='fade-in'
            onClick={e => {
              setModal({
                ...modal,
                newPublicGroupInput: '',
                openPublic: false
              });
              createGroup({ name: modal.newPublicGroupInput, public: true });
            }}
          >
            create
          </Button>
        </div>
      )}
      {modal.openPublic && (
        <div>
          <CardGrid type='others' choices={modal.otherChoice} />
        </div>
      )}
      {modal.openPrivate && (
        <div>
          <small>Private Group Name</small>
          <TextField
            helperText={<HelperText>Please fill private group name</HelperText>}
            fullWidth
            dense
          >
            <Input
              value={modal.newGroupInput}
              onChange={e =>
                setModal({ ...modal, newGroupInput: e.currentTarget.value })
              }
            />
          </TextField>
          <small>Invitation Code</small>
          <TextField
            helperText={<HelperText>Please fill invitation code</HelperText>}
            fullWidth
            dense
          >
            <Input
              value={modal.newGroupCode}
              onChange={e =>
                setModal({ ...modal, newGroupCode: e.currentTarget.value })
              }
            />
          </TextField>
        </div>
      )}
    </div>
  );
};
MyLoka.propTypes = {
  allGroups: PropTypes.array.isRequired,
  createGroup: PropTypes.func.isRequired,
  receivePublicGroups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  allGroups: state.group.allGroups
});
export default connect(mapStateToProps, { receivePublicGroups, createGroup })(
  MyLoka
);
