import {TOTAL_MOVIES} from '../action/TotalMovies';

const initialState = {
  totalMovies: [],
};

const totalReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOTAL_MOVIES:
      return {
        ...state,
        totalMovies: action.totalData,
      };
    default:
      return state;
  }
};

export default totalReducer;
