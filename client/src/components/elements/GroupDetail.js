/*eslint-disable react-hooks/exhaustive-deps*/
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import MaterialIcon from '@material/react-material-icon';
import {addGroupToProfile, removeGroupToProfile} from '../../actions/profile';
import './GroupDetail.scss';
import LocationList from './LocationList';
import Spinner from '../layout/Spinner';
import EditGroupModal from './EditGroupModal';

export const GroupDetail = ({
    allGroups,
    group,
    setGroup,
    initGroup,
    profile,
    clearGroup,
    setShow,
    addGroupToProfile,
    removeGroupToProfile,
}) => {
    const [loaded, setLoaded] = useState(false);
    const [animIn, setAnimIn] = useState(false);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        initGroup();
    }, [allGroups]);

    useEffect(() => {
        if (group) {
            if (group.locations.length === 0 || group.locations[0].photo) setLoaded(true);
        }
    }, [group]);

    useEffect(() => {
        if (!animIn && loaded) setAnimIn(true);
    }, [loaded]);

    if (!loaded) return <Spinner />;

    const onBack = () => {
        clearGroup();
        setAnimIn(false);
    };
    const onJoinGroup = (name) => {
        addGroupToProfile(name);
        group.selected = true;
    };
    const onLeaveGroup = (name) => {
        removeGroupToProfile(name);
        group.selected = false;
    };

    return (
        <div id='group-detail' className='fade-in'>
            <div className='header'>
                <div className='title'>
                    {group.name}
                    {profile.user._id === group.user._id && (
                        <MaterialIcon
                            icon='edit'
                            className='icon-button edit'
                            onClick={() => {
                                setEdit(true);
                            }}
                        />
                    )}
                    <p style={{color: '#96ffe6'}}>{group.city}</p>
                    <p>{group.introduction}</p>
                </div>

                {profile.groups.indexOf(group.name) !== -1 ? (
                    <MaterialIcon
                        icon='favorite'
                        className='icon-button favorite'
                        onClick={() => {
                            onLeaveGroup(group.name);
                        }}
                    />
                ) : (
                    <MaterialIcon
                        icon='favorite_border'
                        className='icon-button favorite'
                        onClick={() => {
                            onJoinGroup(group.name);
                        }}
                    />
                )}
                <MaterialIcon
                    icon='arrow_back'
                    className='icon-button'
                    onClick={() => {
                        onBack();
                    }}
                />
            </div>
            <LocationList group={group} animIn={animIn} isAuthenticated={true} setShow={setShow} />
            <EditGroupModal
                group={group}
                clearGroup={clearGroup}
                show={profile.user._id === group.user._id && edit}
                setShow={setEdit}
                setGroup={setGroup}
            />
        </div>
    );
};

GroupDetail.propTypes = {
    profile: PropTypes.object,
    group: PropTypes.object,
    addGroupToProfile: PropTypes.func.isRequired,
    removeGroupToProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile.profile,
    allGroups: state.group.allGroups,
});

const mapDispatchToProps = {
    addGroupToProfile,
    removeGroupToProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);
