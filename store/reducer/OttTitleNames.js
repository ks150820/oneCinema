import {OTT_NETFLIX, KIDS} from '../action/OttTitleNames';

const inititalState = {
  Netflix: [],
  kids: [],
};

const ottTitleReducer = (state = inititalState, action) => {
  switch (action.type) {
    case OTT_NETFLIX:
      return {
        ...state,
        Netflix: action.netflix,
      };
    case KIDS:
      return {
        ...state,
        kids: action.k,
      };
    default:
      return state;
  }
};

export default ottTitleReducer;
