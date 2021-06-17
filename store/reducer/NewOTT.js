import {NEW_OTT} from '../action/NewOTT';

const initialState = {
  ott: [],
};

const NewOttReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEW_OTT:
      return {
        ...state,
        ott: action.newOTTData,
      };
    default:
      return state;
  }
};

export default NewOttReducer;
