import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material/react-button';

import CardModal from '../elements/CardModal';
import GroupDetail from '../elements/GroupDetail';
import Map from './Map';
import './GroupPage.scss';

export const GroupPage = ({ modal, setModal, allGroups }) => {
    const [editMap, setEditMap] = useState(false);
    const [show, setShow] = useState('list');
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
                <GroupDetail groupId={modal.currentGroupId} setModal={setModal} setShow={setShow} />
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
                                style={{ margin: '10px' }}
                            >
                                Add New Location
                            </Button>
                        </div>
                    )}
                    <Map group={allGroups.filter((el) => el._id === modal.currentGroupId)[0]} />
                    {editMap && <CardModal groupId={modal.currentGroupId} editMap={editMap} setEditMap={setEditMap} />}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
