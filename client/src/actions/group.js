import axios from "axios";
import { setAlert } from "./alert";
import { GET_GROUPS, CREATE_GROUP, REMOVE_GROUP, CREATE_LOCATION, REMOVE_LOCAITON } from "./types";

export const receivePublicGroups = () => async dispatch => {
    const res = await axios.get('/api/group');
    dispatch({
        type: GET_GROUPS,
        payload: res.data
      });
    return ;
}