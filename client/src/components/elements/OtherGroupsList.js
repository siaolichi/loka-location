import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import MaterialIcon from '@material/react-material-icon';
import { staggerIn, staggerOut } from '../../utils';
import { createGroup } from '../../actions/group';
import './OtherGroupsList.scss';

export const OtherGroupsList = ({ createGroup, setModal, other }) => {
  const otherRef = useRef(null);
  const [createInput, setCreateInput] = useState('');
  const [showGroup, setShowGroup] = useState(other);
  useEffect(() => {
    setShowGroup(other);
  }, [other]);
  useEffect(() => {
    if (showGroup.length > 0) staggerIn(otherRef.current.childNodes);
  }, [showGroup]);
  const hideAll = (group) => {
    staggerOut([...otherRef.current.childNodes], () => {
      setModal((m) => ({ ...m, currentGroupId: group._id }));
    });
  };

  const groupFilter = (string) => {
    setShowGroup(
      other.filter(
        (el) => el.name.toLowerCase().indexOf(string.toLowerCase()) !== -1
      )
    );
  };
  return (
    <div id='other-group-list' className='fade-in'>
      <div className='title'>DISCOVER MORE</div>

      <div
        className='group-content input-wrapper fade-in'
        style={{ paddingLeft: '10px' }}
      >
        <div className='label' style={{ lineHeight: 0 }}>
          Search for maps
        </div>
        <input
          onChange={(e) => {
            groupFilter(e.target.value);
          }}
        />
        {/* <MaterialIcon
          role='button'
          icon='search'
          className='search-button'
        /> */}
      </div>
      <div className='input-wrapper group-content fade-in'>
        <div className='label' style={{ lineHeight: 0 }}>
          create new map
        </div>
        <input
          value={createInput}
          onChange={(e) => {
            setCreateInput(e.target.value);
          }}
          style={{ width: 'calc( 100% - 50px)' }}
        />
        <MaterialIcon
          role='button'
          icon='done'
          onClick={(e) => {
            createGroup({ name: createInput, public: true });
            setCreateInput('');
          }}
          className='search-button'
        />
      </div>
      <div className='list-wrapper' ref={otherRef}>
        {showGroup.map((group, index) => (
          <button
            key={index}
            className='group-content button'
            onClick={(e) => {
              hideAll(group);
            }}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { createGroup };

export default connect(mapStateToProps, mapDispatchToProps)(OtherGroupsList);
