import {OTT_LABELS, OTT_TITLE} from '../action/OttLabels';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  label: [],
  title: [],
};

const labelReducer = (state = initialState, action) => {
  switch (action.type) {
    case OTT_LABELS:
      return {
        ...state,
        label: action.ottData,
      };
    case OTT_TITLE:
      return {
        ...state,
        title: action.title,
      };
    default:
      return state;
  }
};

export default labelReducer;
