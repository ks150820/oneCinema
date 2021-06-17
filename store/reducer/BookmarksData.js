import {BOOKMARKS_DATA, BOOKMARK_TITLE} from '../action/BookmarksData';

const initialState = {
  bookmarkData: [],
  bookmarkTitle: [],
};

const bookmarkReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKMARKS_DATA:
      return {
        ...state,
        bookmarkData: action.bookData,
      };
    case BOOKMARK_TITLE:
      return {
        ...state,
        bookmarkTitle: action.bookTitle,
      };
    default:
      return state;
  }
};

export default bookmarkReducer;
