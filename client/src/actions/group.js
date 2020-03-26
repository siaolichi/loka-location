import axios from "axios";
import { setAlert } from "./alert";
import { GET_GROUPS, GROUP_ERROR } from "./types";
import { addGroupToProfile, removeGroupToProfile } from "./profile";

export const receivePublicGroups = () => async dispatch => {
  try {
    const res = await axios.get("/api/group");
    console.log(res);
    dispatch({
      type: GET_GROUPS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addLocationToGroup = (group_id, location) => async dispatch => {
  try {
    const config = {
      header: {
        "content-type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/group/location/${group_id}`,
      location,
      config
    );
    dispatch(receivePublicGroups());
    dispatch(setAlert("Location added", "success"));
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createGroup = group => async dispatch => {
  try {
    const config = {
      header: {
        "content-type": "application/json"
      }
    };
    const res = await axios.post("/api/group", group, config);
    console.log(res.data);
    await dispatch(receivePublicGroups());
    dispatch(addGroupToProfile(group.name));
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const changeLocationDetail = (group_id, location) => async dispatch => {
  try {
    const config = {
      header: {
        "content-type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/group/location/${group_id}/${location._id}`,
      location,
      config
    );
    console.log(res.data);
    dispatch(receivePublicGroups());
    dispatch(setAlert("Location updated", "success"));
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeLocation = (group_id, location_id) => async dispatch => {
  try {
    const config = {
      header: {
        "content-type": "application/json"
      }
    };
    const res = await axios.delete(
      `/api/group/location/${group_id}/${location_id}`,
      config
    );
    console.log(res.data);
    dispatch(receivePublicGroups());
    dispatch(setAlert("Location updated", "success"));
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeGroupFromAllGroups = group => async dispatch => {
  try {
    const config = {
      header: {
        "content-type": "application/json"
      }
    };
    const res = await axios.delete(`/api/group/${group._id}`, config);
    await dispatch(removeGroupToProfile(group.name));
    console.log(res.data);
    dispatch(receivePublicGroups());
    dispatch(setAlert("Group deleted", "success"));
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
