import firestore from '@react-native-firebase/firestore';
export const OTT_LABELS = 'OTT_LABELS';
export const OTT_TITLE = 'OTT_TITLE';

export const ottLabel = data => {
  return {
    type: OTT_LABELS,
    ottData: data,
  };
};

export const ottTitle = data => {
  return async dispatch => {
    try {
      //console.log(data);
      let array = [];

      firestore()
        .collection('BTotalMovies')
        .where('titletype', '==', 'kids')
        .where('forFilter', 'array-contains-any', data)
        .get()
        .then(query => {
          console.log('coming inside..');

          query.docs.forEach(doc => {
            array.push({
              ...doc.data(),
              docId: doc.id,
            });
          });

          handleFireBase(array);
          //console.log(array);
        });
      function handleFireBase(array) {
        //console.log(array);
        dispatch({
          type: OTT_TITLE,
          title: array,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //console.log(array);
};
