import React, {useState} from 'react';
import {connect} from 'react-redux';

import OtherGroupsList from '../elements/OtherGroupsList';
import SelectedGroupList from '../elements/SelectedGroupList';
import './MenuPage.scss';
import {Button} from '@material/react-button';

export const MenuPage = ({modal, setModal}) => {
    const [show, setShow] = useState('other');
    return (
        <div id='menu-page'>
            <div className='select-button-wrapper'>
                <Button
                    onClick={() => {
                        setShow('other');
                    }}
                    className={show === 'other' ? 'select-button selected' : 'select-button'}
                >
                    All Map
                </Button>
                <Button
                    onClick={() => {
                        setShow('selected');
                    }}
                    className={show === 'selected' ? 'select-button selected' : 'select-button'}
                >
                    My Favorite
                </Button>
            </div>

            <div className={show === 'selected' ? 'left-section selected' : 'left-section'}>
                <SelectedGroupList modal={modal} setModal={setModal} />
            </div>
            <div className={show === 'other' ? 'right-section selected' : 'right-section'}>
                <OtherGroupsList other={modal.other} setModal={setModal} />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);
