import axios from "axios";
import { setAlert } from "./alert";
import { GET_GROUPS, GROUP_ERROR } from "./types";

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
