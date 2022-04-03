/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useRef } from 'react';
import './SelectedGroupList.scss';

import { connect } from 'react-redux';

const GroupList = ({ modal, setModal }) => {
	const selectedRef = useRef(null);
	const hideAll = (groupId) => {
		setModal((m) => ({ ...m, currentGroupId: groupId }));
	};

	return (
		<div id='selected-group-list' className='fade-in'>
			<div className='list-wrapper' ref={selectedRef}>
				<div className='title'>Ｍy Favorite</div>
				{modal.selected.map((group, index) => (
					<button
						key={index}
						className='group-content button'
						onClick={(e) => {
							hideAll(group._id);
						}}
					>
						{group.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default connect(null, null)(GroupList);
