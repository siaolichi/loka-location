import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import MaterialIcon from '@material/react-material-icon';
import Button from '@material/react-button';
import {staggerIn, staggerOut} from '../../utils';
import {createGroup} from '../../actions/group';
import './OtherGroupsList.scss';
import EditGroupModal from './EditGroupModal';

export const OtherGroupsList = ({createGroup, setModal, allGroups}) => {
    const otherRef = useRef(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showGroup, setShowGroup] = useState(allGroups);
    useEffect(() => {
        setShowGroup(allGroups);
    }, [allGroups]);
    useEffect(() => {
        if (showGroup.length > 0) staggerIn(otherRef.current.childNodes);
    }, [showGroup]);
    const hideAll = (group) => {
        staggerOut([...otherRef.current.childNodes], () => {
            setModal((m) => ({...m, currentGroupId: group._id}));
        });
    };
    const enterListener = (event) => {
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            document.getElementById('create-group-button').click();
        }
    };
    const groupFilter = (string) => {
        setShowGroup(allGroups.filter((el) => el.name.toLowerCase().indexOf(string.toLowerCase()) !== -1));
    };
    return (
        <div id='other-group-list' className='fade-in'>
            <div className='title-wrapper'>
                <div className='title'>DISCOVER MORE</div>
                <Button className='button' onClick={() => setShowAddModal(true)}>
                    <MaterialIcon
                        icon='add'
                        style={{marginRight: '5px', verticalAlign: 'middle', lineHeight: '20px', fontSize: '18px'}}
                    />
                    Create New Map
                </Button>
            </div>
            <div className='input-wrapper fade-in'>
                <div className='label' style={{lineHeight: 0}}>
                    Search for maps
                </div>
                <input
                    onChange={(e) => {
                        groupFilter(e.target.value);
                    }}
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
            <EditGroupModal show={showAddModal} setShow={setShowAddModal} />
        </div>
    );
};

const mapStateToProps = (state) => ({allGroups: state.group.allGroups});

const mapDispatchToProps = {createGroup};

export default connect(mapStateToProps, mapDispatchToProps)(OtherGroupsList);
