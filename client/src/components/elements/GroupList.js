/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, useRef } from 'react';
import './GroupList.scss';

import { staggerIn, staggerOut } from '../../utils';
import { connect } from 'react-redux';

const GroupList = ({ modal, setModal }) => {
  const selectedRef = useRef(null);
  const hideAll = (groupId) => {
    staggerOut([...selectedRef.current.childNodes], () => {
      setModal((m) => ({ ...m, currentGroupId: groupId }));
    });
  };
  useEffect(() => {
    if (modal.selected.length > 0) {
      staggerIn(selectedRef.current.childNodes);
    }
  }, [modal.other]);

  return (
    <div id='group-list' className='fade-in'>
      <div className='group-wrapper'>
        <div className='list-wrapper' ref={selectedRef}>
          <div className='title'>Ｍy Favorite</div>
          {modal.selected.map((group, index) => (
            <button
              key={index}
              className='group-content button'
              onClick={(e) => {
                hideAll(group._id);
              }}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(null, null)(GroupList);
