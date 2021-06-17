import {TITLE} from '../action/Title';

const initialState = {
  title: [],
};

const titleReducer = (state = initialState, action) => {
  switch (action.type) {
    case TITLE:
      return {
        ...state,
        title: action.titleD,
      };
    default:
      return state;
  }
};

export default titleReducer;
