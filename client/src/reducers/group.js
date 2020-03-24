import { GET_GROUPS, GROUP_ERROR } from "../actions/types";
const initialState = {
  allGroups: [],
  myGroups: [],
  error: {},
  loading: true
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_GROUPS:
      return {
        ...state,
        allGroups: payload,
        loading: false
      };
    case GROUP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};
