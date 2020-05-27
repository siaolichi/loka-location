import { GET_GROUPS, GROUP_ERROR, EDIT_GROUP } from '../actions/types';
const initialState = {
  allGroups: [],
  error: {},
  loading: true,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_GROUPS:
      return {
        ...state,
        allGroups: payload,
        loading: false,
      };
    case GROUP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case EDIT_GROUP:
      const newGroup = state.allGroups.map((el) => {
        if (el._id === payload._id) {
          return payload;
        } else {
          return el;
        }
      });
      return {
        ...state,
        allGroups: newGroup,
      };
    default:
      return state;
  }
};
