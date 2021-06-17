export const NEW_OTT = 'NEW_OTT';

export const newOtt = (data) => {
  return {
    type: NEW_OTT,
    newOTTData: data,
  };
};
