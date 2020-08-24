import axios from 'axios';
import {setAlert} from './alert';
import {GET_GROUPS, GROUP_ERROR, EDIT_GROUP} from './types';
import {addGroupToProfile, removeGroupToProfile} from './profile';
import {getGroupDetail} from '../utils';

export const receivePublicGroups = (id) => async (dispatch) => {
    try {
        const res = await axios.get('/api/group');
        // if (id)
        //     res.data = await res.data.map(async (el) => {
        //         if (el._id === id) {
        //             return await getGroupDetail(el);
        //         } else {
        //             return el;
        //         }
        //     });
        // else res.data[0] = await getGroupDetail(res.data[0]);
        await dispatch({
            type: GET_GROUPS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.data, status: err.response.status},
        });
    }
};

export const changeGroupDetail = (group) => async (dispatch) => {
    const newGroup = await getGroupDetail(group);
    await dispatch({
        type: EDIT_GROUP,
        payload: newGroup,
    });
};

export const addLocationToGroup = (group_id, location) => async (dispatch) => {
    try {
        const config = {
            header: {
                'content-type': 'application/json',
            },
        };
        await axios.post(`/api/group/location/${group_id}`, location, config);
        await dispatch(receivePublicGroups());
        dispatch(setAlert('Location added', 'success'));
    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status},
        });
    }
};

export const createGroup = (group) => async (dispatch) => {
    try {
        const config = {
            header: {
                'content-type': 'application/json',
            },
        };
        console.log('create group: ', group);
        await axios.post('/api/group', group, config);
        await dispatch(receivePublicGroups());
        dispatch(addGroupToProfile(group.name));
    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status},
        });
    }
};

export const changeLocationDetail = (group_id, location) => async (dispatch) => {
    try {
        const config = {
            header: {
                'content-type': 'application/json',
            },
        };
        await axios.post(`/api/group/location/${group_id}/${location._id}`, location, config);
        await dispatch(receivePublicGroups());
        dispatch(setAlert('Location updated', 'success'));
    } catch (err) {
        console.log(err);
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status},
        });
    }
};

export const removeLocation = (group_id, location_id) => async (dispatch) => {
    try {
        const config = {
            header: {
                'content-type': 'application/json',
            },
        };
        await axios.delete(`/api/group/location/${group_id}/${location_id}`, config);
        await dispatch(receivePublicGroups());
        dispatch(setAlert('Location updated', 'success'));
    } catch (err) {
        console.log(err);
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status},
        });
    }
};

export const removeGroupFromAllGroups = (group) => async (dispatch) => {
    try {
        const config = {
            header: {
                'content-type': 'application/json',
            },
        };
        await axios.delete(`/api/group/${group._id}`, config);
        await dispatch(removeGroupToProfile(group.name));
        await dispatch(receivePublicGroups());
        dispatch(setAlert('Map deleted', 'success'));
    } catch (err) {
        console.log(err);
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status},
        });
    }
};

export const editGroupInfo = (group) => async (dispatch) => {
    try {
        const config = {
            header: {
                'content-type': 'application/json',
            },
        };
        await axios.post(`/api/group/${group._id}`, group, config);
        await dispatch(receivePublicGroups());
        dispatch(setAlert('Map saved', 'success'));
    } catch (err) {
        console.log(err);
        dispatch({
            type: GROUP_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status},
        });
    }
};
