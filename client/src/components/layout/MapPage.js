/*eslint-disable react-hooks/exhaustive-deps*/
import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Select, {Option} from '@material/react-select';

import Map from './Map';
import LocationList from '../elements/LocationList';
import Spinner from './Spinner';

import {receivePublicGroups, changeGroupDetail} from '../../actions/group';
import {getGroupDetail} from '../../utils';

import './MapPage.scss';

const MapPage = ({match, receivePublicGroups, changeGroupDetail, allGroups, loading, isAuthenticated}) => {
    const [currentGroup, setCurrentGroup] = useState(null);
    const [animIn, setAnimIn] = useState(false);

    useEffect(() => {
        receivePublicGroups();
    }, []);

    useEffect(() => {
        if (allGroups.length > 0) changeGroup(match.params.group_id || allGroups[0]._id);
    }, [allGroups]);

    // useEffect(() => {
    //     if (currentGroup && !animIn) {
    //         setAnimIn(true);
    //     }
    // }, [currentGroup]);

    const changeGroup = async (groupId) => {
        if (animIn) setAnimIn(false);
        const newGroup = await getGroupDetail(allGroups.filter((group) => group._id === groupId)[0] || allGroups[0]);
        setTimeout(async () => {
            setCurrentGroup(newGroup);
            setAnimIn(true);
        }, 1500);
    };
    if (!currentGroup || !allGroups) return <Spinner />;

    return (
        <div id='map-page'>
            <div className='left-section'>
                <Select
                    value={currentGroup._id}
                    label='Select Groups'
                    className={isAuthenticated ? 'map-selection' : 'map-selection dark'}
                    outlined
                    onChange={(evt) => {
                        changeGroup(evt.target.value);
                    }}
                >
                    {allGroups.map((group, i) => (
                        <Option key={group._id} value={group._id}>
                            {group.name}
                        </Option>
                    ))}
                </Select>
                <LocationList group={currentGroup} animIn={animIn} isAuthenticated={isAuthenticated} />
                <div></div>
            </div>
            {
                <div className='right-section'>
                    <Map group={currentGroup} match={match} />
                </div>
            }
        </div>
    );
};

MapPage.propTypes = {
    allGroups: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    receivePublicGroups: PropTypes.func.isRequired,
    changeGroupDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    allGroups: state.group.allGroups,
    loading: state.group.loading,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
    receivePublicGroups,
    changeGroupDetail,
})(MapPage);
