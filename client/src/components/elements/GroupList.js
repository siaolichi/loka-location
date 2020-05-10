/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, useRef, useState } from 'react';
import './GroupList.scss';
import MaterialIcon from '@material/react-material-icon';
import { staggerIn, staggerOut, fadeOut } from '../../utils';
import { createGroup } from '../../actions/group';
import { connect } from 'react-redux';

const GroupList = ({ modal, setModal, createGroup }) => {
  const otherRef = useRef(null);
  const selectedRef = useRef(null);
  const [createInput, setCreateInput] = useState('');
  const hideAll = group => {
    if (otherRef.current) {
      fadeOut(
        [...selectedRef.current.childNodes, ...otherRef.current.childNodes],
        () => {
          setModal(m => ({
            ...m,
            status: 'group-detail',
            showModal: group
          }));
        }
      );
    } else {
      staggerOut([...selectedRef.current.childNodes], () => {
        setModal(m => ({ ...m, status: 'group-detail', showModal: group }));
      });
    }
  };
  useEffect(() => {
    if (modal.other.length > 0) {
      if (modal.status === 'selected')
        staggerIn(selectedRef.current.childNodes);
      else {
        staggerIn([
          ...selectedRef.current.childNodes,
          ...otherRef.current.childNodes
        ]);
      }
    }
  }, [modal.other]);

  const showOthers = async e => {
    await setModal(m => ({ ...m, status: 'other' }));
    staggerIn(otherRef.current.childNodes);
  };

  const hideOthers = e => {
    staggerOut(otherRef.current.childNodes, () => {
      setModal(m => ({ ...m, status: 'selected' }));
    });
  };

  return (
    <div id='group-list' className='fade-in'>
      <div className='group-wrapper'>
        <div className='list-wrapper' ref={selectedRef}>
          <div className='title'>Ｍy Favorite</div>
          {modal.selected.map((group, index) => (
            <button
              key={index}
              className='group-content button'
              onClick={e => {
                hideAll({ ...group, selected: true });
              }}
            >
              {group.name}
            </button>
          ))}
          <button className='icon-button wrapper'>
            {modal.status === 'selected' ? (
              <MaterialIcon
                icon='add'
                className='icon-button add'
                onClick={showOthers}
              />
            ) : (
              <MaterialIcon
                icon='arrow_back'
                className='icon-button back'
                onClick={hideOthers}
              />
            )}
          </button>
        </div>
        {modal.status === 'other' && (
          <div className='list-wrapper' ref={otherRef}>
            {/* <div className='group-content' style={{ paddingLeft: '10px' }}>
              <input />
              <MaterialIcon
                role='button'
                icon='search'
                onClick={e => {}}
                className='search-button'
              />
            </div> */}

            <div className='input-wrapper group-content'>
              <div className='label' style={{ lineHeight: 0 }}>
                create new map
              </div>
              <input
                value={createInput}
                onChange={e => {
                  setCreateInput(e.currentTarget.value);
                }}
                style={{ width: 'calc( 100% - 50px)' }}
              />
              <MaterialIcon
                role='button'
                icon='done'
                onClick={e => {
                  console.log(createInput);
                  createGroup({ name: createInput, public: true });
                  setCreateInput('');
                }}
                className='search-button'
              />
            </div>
            {modal.other.map((group, index) => (
              <button
                key={index}
                className='group-content button'
                onClick={e => {
                  hideAll({ ...group, selected: false });
                }}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(null, { createGroup })(GroupList);
