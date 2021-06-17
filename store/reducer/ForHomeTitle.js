import {FORHOME} from '../action/ForHomeTitle';

const initialState = {
  homeT: [],
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORHOME:
      return {
        ...state,
        homeT: action.title,
      };
    default:
      return state;
  }
};

export default homeReducer;
