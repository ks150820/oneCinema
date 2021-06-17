export const BOOKMARKS_DATA = 'BOOKMARKS_DATA';
export const BOOKMARK_TITLE = 'BOOKMARK_TITLE';

export const bookmarkData = (data) => {
  return {
    type: BOOKMARKS_DATA,
    bookData: data,
  };
};

export const bookmarkTitle = (data) => {
  return {
    type: BOOKMARK_TITLE,
    bookTitle: data,
  };
};
