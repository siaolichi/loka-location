import { ADD_MAP } from '../actions/types';
const initialState = {
  map: null,
  infowindow: null,
  service: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_MAP:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
