import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import MaterialIcon from '@material/react-material-icon';
import { staggerIn, staggerOut } from '../../utils';
import { createGroup } from '../../actions/group';
import { getPlaceDetail } from '../../utils';
import './OtherGroups.scss';

export const OtherCroups = ({ createGroup, setModal, other }) => {
  const otherRef = useRef(null);
  const [createInput, setCreateInput] = useState('');
  useEffect(() => {
    if (other.length > 0) {
      staggerIn(otherRef.current.childNodes);
    }
  }, [other]);
  const hideAll = (group) => {
    staggerOut([...otherRef.current.childNodes], () => {
      setModal((m) => ({ ...m, currentGroupId: group._id }));
    });
  };
  return (
    <div id='other-group-list'>
      <div className='title'>ALL MAPS</div>

      <div
        className='group-content input-wrapper'
        style={{ paddingLeft: '10px' }}
      >
        <div className='label' style={{ lineHeight: 0 }}>
          Search for maps
        </div>
        <input />
        <MaterialIcon
          role='button'
          icon='search'
          onClick={(e) => {}}
          className='search-button'
        />
      </div>
      <div className='input-wrapper group-content'>
        <div className='label' style={{ lineHeight: 0 }}>
          create new map
        </div>
        <input
          value={createInput}
          onChange={(e) => {
            setCreateInput(e.currentTarget.value);
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
        {other.map((group, index) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherCroups);
