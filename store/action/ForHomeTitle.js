import firestore from '@react-native-firebase/firestore';
export const FORHOME = 'FORHOME';

export const forHome = (data) => {
  return {
    type: FORHOME,
    title: data,
  };
};

// return async (dispatch) => {
//   try {
//     firestore()
//       .collection('BTotalMovies')
//       .where('forFilter', 'array-contains-any', data)
//       .limit(250)
//       .get()
//       .then((query) => {
//         console.log('coming inside.. for home');
//         const array = [];

//         query.docs.forEach((doc) => {
//           array.push({
//             ...doc.data(),
//             docId: doc.id,
//           });
//         });

//         dispatch({
//           type: FORHOME,
//           title: array,
//         });
//         //console.log(array);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// };
