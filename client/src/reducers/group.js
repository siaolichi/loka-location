import { GET_GROUPS, CREATE_GROUP, REMOVE_GROUP, CREATE_LOCATION, REMOVE_LOCAITON } from "../actions/types";
const initialState = {
    allGroups: [],
    myGroups: [],
    loading: true
};

export default (state = initialState, {type, payload}) => {
    switch(type){
        case GET_GROUPS:
            return {
                ...state,
                allGroups: payload,
                loading: false
            };
        default: return state
    }
}