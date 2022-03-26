import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import MaterialIcon from '@material/react-material-icon';
import Button from '@material/react-button';
import { staggerOut } from '../../utils';
import { createGroup } from '../../actions/group';
import './OtherGroupsList.scss';
import EditGroupModal from './EditGroupModal';

export const OtherGroupsList = ({ createGroup, setModal, allGroups }) => {
	const otherRef = useRef(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [groupList, setGroupList] = useState([]);
	const sortByCities = (groups) => {
		let sortedGroup = [];
		let general = { city: 'general', list: [] };
		const cities = groups.map((item) => item.city).filter((value, index, self) => self.indexOf(value) === index);
		for (let city of cities) {
			if (city) {
				const selected = groups.filter((item) => item.city === city);
				sortedGroup.push({ city: city, list: selected });
			} else {
				const selected = groups.filter((item) => !item.city);
				general.list = selected;
			}
		}
		if (general.list.length > 0) sortedGroup.push(general);
		setGroupList(sortedGroup);
	};
	useEffect(() => {
		sortByCities(allGroups);
	}, [allGroups]);
	const hideAll = (group) => {
		staggerOut([...otherRef.current.childNodes], () => {
			setModal((m) => ({ ...m, currentGroupId: group._id }));
		});
	};
	const groupFilter = (string) => {
		const filterGroup = allGroups.filter((el) => el.name.toLowerCase().indexOf(string.toLowerCase()) !== -1);
		sortByCities(filterGroup);
	};

	const listComponent = (list) =>
		list.map((group, index) => (
			<button
				key={index}
				className='group-content button'
				onClick={(e) => {
					hideAll(group);
				}}
			>
				<div className='group-title'>{group.name}</div>
				<p className='group-intro'>{group.introduction}</p>
			</button>
		));
	return (
		<div id='other-group-list' className='fade-in'>
			<div className='title-wrapper'>
				<div className='title'>DISCOVER MORE</div>
				<Button className='button' onClick={() => setShowAddModal(true)}>
					<MaterialIcon
						icon='add'
						style={{ marginRight: '5px', verticalAlign: 'middle', lineHeight: '20px', fontSize: '18px' }}
					/>
					Create New Map
				</Button>
			</div>
			<div className='input-wrapper fade-in'>
				<div className='label' style={{ lineHeight: 0 }}>
					Search for maps
				</div>
				<input
					onChange={(e) => {
						groupFilter(e.target.value);
					}}
				/>
			</div>
			<div className='list-wrapper' ref={otherRef}>
				{groupList.map(({ city, list }, index) => (
					<div
						style={{
							width: '100%'
						}}
					>
						<div className='city-title'>{city}</div>
						{listComponent(list)}
					</div>
				))}
			</div>
			<EditGroupModal show={showAddModal} setShow={setShowAddModal} />
		</div>
	);
};

const mapStateToProps = (state) => ({ allGroups: state.group.allGroups });

const mapDispatchToProps = { createGroup };

export default connect(mapStateToProps, mapDispatchToProps)(OtherGroupsList);
