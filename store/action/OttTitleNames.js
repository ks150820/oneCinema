export const OTT_NETFLIX = 'OTT_TITLENAMES';
export const KIDS = 'KIDS';

export const ottNetflix = (data) => {
  return {
    type: OTT_NETFLIX,
    netflix: data,
  };
};

export const kidsTitle = (data) => {
  return {
    type: KIDS,
    k: data,
  };
};
