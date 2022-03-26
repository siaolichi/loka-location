/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select, { Option } from '@material/react-select';

import Map from './Map';
import LocationList from '../elements/LocationList';
import Spinner from './Spinner';

import { receivePublicGroups, changeGroupDetail } from '../../actions/group';
import { getGroupDetail } from '../../utils';

import './MapPage.scss';
import { Button } from '@material/react-button';

const MapPage = ({ match, receivePublicGroups, allGroups, loading, isAuthenticated }) => {
	const [currentGroup, setCurrentGroup] = useState(null);
	const [animIn, setAnimIn] = useState(false);
	const [show, setShow] = useState('list');

	useEffect(() => {
		receivePublicGroups();
	}, []);
	useEffect(() => {
		if (!loading) changeGroup(match?.params.group_id || allGroups[0]._id);
	}, [loading]);

	const changeGroup = async (groupId) => {
		setAnimIn(false);
		setCurrentGroup(null);
		const newGroup = await getGroupDetail(allGroups.filter((group) => group._id === groupId)[0]);
		setCurrentGroup(newGroup);
		setAnimIn(true);
	};
	if (!currentGroup || !allGroups) return <Spinner />;

	return (
		<div id='map-page'>
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
				<LocationList
					group={currentGroup}
					animIn={animIn}
					setAnimIn={setAnimIn}
					isAuthenticated={isAuthenticated}
					setShow={setShow}
				/>
				<div></div>
			</div>
			{
				<div className={show === 'map' ? 'right-section selected' : 'right-section'}>
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
	changeGroupDetail: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	allGroups: state.group.allGroups,
	loading: state.group.loading,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {
	receivePublicGroups,
	changeGroupDetail
})(MapPage);
