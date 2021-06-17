export const ALL_MOVIES = 'ALL_MOVIES';
export const FILTER_MOVIES = 'FILTER_MOVIES';
export const TOGGLE_BOOKMARK = 'TOGGLE_BOOKMARK';

export const fullMovies = (data) => {
  return {
    type: ALL_MOVIES,
    fullData: data,
  };
};

export const filterOTT = (data) => {
  return {
    type: FILTER_MOVIES,
    fullFilter: data,
  };
};

export const toggleBookmark = (favData) => {
  return {
    type: TOGGLE_BOOKMARK,
    movieData: favData,
  };
};
