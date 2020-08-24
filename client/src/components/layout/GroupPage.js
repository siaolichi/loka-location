import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Button} from '@material/react-button';
import axios from 'axios';

import {getGroupDetail} from '../../utils';
import CardModal from '../elements/CardModal';
import GroupDetail from '../elements/GroupDetail';
import Map from './Map';
import './GroupPage.scss';

export const GroupPage = ({modal, setModal}) => {
    const [editMap, setEditMap] = useState(false);
    const [show, setShow] = useState('list');
    const [group, setGroup] = useState(null);
    const initGroup = async () => {
        const group = (await axios.get(`/api/group/${modal.currentGroupId}`)).data;
        const displayGroup = await getGroupDetail(group);
        setGroup(displayGroup);
    };
    const clearGroup = () => {
        setModal((m) => ({...m, currentGroupId: null}));
    };
    if (!modal.currentGroupId) {
        return;
    }
    return (
        <div id='group-page'>
            <div className='select-button-wrapper'>
                <Button
                    onClick={() => {
                        setShow('list');
                    }}
                    className={show === 'list' ? 'select-button selected' : 'select-button'}
                >
                    List
                </Button>
                <Button
                    onClick={() => {
                        setShow('map');
                    }}
                    className={show === 'map' ? 'select-button selected' : 'select-button'}
                >
                    Map
                </Button>
            </div>

            <div className={show === 'list' ? 'left-section selected' : 'left-section'}>
                <GroupDetail
                    groupId={modal.currentGroupId}
                    clearGroup={clearGroup}
                    setShow={setShow}
                    initGroup={initGroup}
                    group={group}
                    setGroup={setGroup}
                />
            </div>
            <div className={show === 'map' ? 'right-section selected' : 'right-section'}>
                <div className='map-section-wrapper'>
                    {modal.selected.map((el) => el._id).includes(modal.currentGroupId) && (
                        <div>
                            <Button
                                outlined
                                onClick={() => {
                                    setEditMap(true);
                                }}
                                style={{margin: '10px'}}
                            >
                                Add New Location
                            </Button>
                        </div>
                    )}
                    {group && <Map group={group} />}
                    {editMap && (
                        <CardModal
                            groupId={modal.currentGroupId}
                            editMap={editMap}
                            setEditMap={setEditMap}
                            initGroup={initGroup}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
