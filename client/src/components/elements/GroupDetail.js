/*eslint-disable react-hooks/exhaustive-deps*/
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import {staggerIn, fadeOut, getGroupDetail} from '../../utils';
import {addGroupToProfile, removeGroupToProfile} from '../../actions/profile';
import {changeGroupDetail, removeGroupFromAllGroups} from '../../actions/group';
import './GroupDetail.scss';
import LocationList from './LocationList';
import Spinner from '../layout/Spinner';

export const GroupDetail = ({
    allGroups,
    groupId,
    profile,
    setModal,
    changeGroupDetail,
    addGroupToProfile,
    removeGroupToProfile,
    removeGroupFromAllGroups,
}) => {
    const [group, setGroup] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const groupRef = useRef(null);

    useEffect(() => {
        const initGroup = async () => {
            const displayGroup = await getGroupDetail(allGroups.filter((el) => el._id === groupId)[0]);
            setGroup(displayGroup);
        };
        initGroup();
    }, []);

    useEffect(() => {
        console.log(group);
        if (group) {
            if (group.locations.length === 0 || group.locations[0].photo) setLoaded(true);
        }
    }, [group]);

    useEffect(() => {
        if (loaded) {
            staggerIn(groupRef.current.childNodes);
        }
    }, [loaded]);

    if (!groupId) {
        setModal((m) => ({...m, currentGroupId: null}));
        return '';
    }
    if (!loaded) return <Spinner />;

    const onBack = () => {
        const callback = () => {
            setModal((m) => ({...m, currentGroupId: null}));
        };
        fadeOut(groupRef.current.childNodes, callback);
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
            <div className='group-wrapper' ref={groupRef}>
                <div className='header'>
                    <div className='title'>{group.name}</div>
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
                <LocationList group={group} />
                {profile.user._id === group.user._id && (
                    <Button
                        onClick={(e) => {
                            removeGroupFromAllGroups(group);
                            setModal((m) => ({...m, currentGroupId: null}));
                        }}
                    >
                        Delete Map Completely
                    </Button>
                )}
            </div>
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
    changeGroupDetail,
    addGroupToProfile,
    removeGroupToProfile,
    removeGroupFromAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);
