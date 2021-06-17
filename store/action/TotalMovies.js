export const TOTAL_MOVIES = 'TOTAL_MOVIES';

export const totalMovies = (totaldata) => {
  return {
    type: TOTAL_MOVIES,
    totalData: totaldata,
  };
};
