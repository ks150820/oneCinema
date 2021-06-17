import {ALL_MOVIES, FILTER_MOVIES, TOGGLE_BOOKMARK} from '../action/AllMovies';
import _, {get} from 'lodash';

const initialState = {
  fullMovies: [],
  filterMovies: [],
  bookmark: [],
};

const AllMoviesReducer = (state = initialState, action) => {
  //console.log(action.fullFilter);
  switch (action.type) {
    case ALL_MOVIES:
      return {
        ...state,
        fullMovies: action.fullData,
        filterMovies: action.fullData,
      };
    case FILTER_MOVIES:
      const appliedFilters = action.fullFilter;
      // console.log(appliedFilters);
      const getFullArray = state.fullMovies.map((item, index) => {
        const getFilterValue = item.data.filter((item) => {
          const appliedArray = [];
          for (let i = 0; i < item.forFilter.length; i++) {
            for (let j = 0; j < appliedFilters.length; j++) {
              if (item.forFilter[i] === appliedFilters[j]) {
                appliedArray.push(appliedFilters[j]);
              }
            }
          }

          if (appliedArray.length > 0) return item;
        });

        return Object.assign({}, item, {data: getFilterValue});
      });

      //console.log('GetFullArray =', getFullArray);

      return {
        ...state,
        filterMovies: getFullArray,
      };
    case TOGGLE_BOOKMARK:
      return {
        ...state,
        bookmark: action.movieData,
      };

    default:
      return state;
  }
};

export default AllMoviesReducer;

// const existingIndex = state.bookmark.findIndex(
//   (movie) => (movie.Key = action.movieKey.Key),
// );
// if (existingIndex >= 0) {
//   const updatedBookMarkMovies = [...state.bookmark];
//   updatedBookMarkMovies.splice(existingIndex, 1);
//   return {...state, bookmark: updatedBookMarkMovies};
// } else {
//   //const meal = state.meals.find((meal) => meal.id === action.movieKey);
//   return {...state, bookmark: state.bookmark.concat(action.movieKey)};
// }
