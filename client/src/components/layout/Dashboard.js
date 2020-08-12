/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from './Spinner';
import GroupPage from './GroupPage';
import MenuPage from './MenuPage';
import { receivePublicGroups } from '../../actions/group';
import './Dashboard.scss';

export const Dashboard = ({ profile: { profile, loading }, allGroups, receivePublicGroups }) => {
    const [modal, setModal] = useState({
        selected: [],
        other: [],
        currentGroupId: null,
    });

    useEffect(() => {
        receivePublicGroups();
    }, []);

    useEffect(() => {
        const updateGroup = () => {
            const selected = [],
                other = [];
            for (let group of allGroups) {
                let index = profile.groups.indexOf(group.name);
                if (index > -1) selected.push(group);
                else other.push(group);
            }
            setModal((m) => {
                return { ...m, selected, other };
            });
        };

        if (allGroups.length > 0 && profile) updateGroup();
    }, [allGroups, profile]);

    if (!profile || loading) return <Spinner />;

    return (
        <div id='dashboard'>
            {modal.currentGroupId ? (
                <GroupPage modal={modal} setModal={setModal} allGroups={allGroups} />
            ) : (
                <MenuPage modal={modal} setModal={setModal} />
            )}
        </div>
    );
};

Dashboard.propTypes = {
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    allGroups: state.group.allGroups,
});

const mapDispatchToProps = { receivePublicGroups };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
