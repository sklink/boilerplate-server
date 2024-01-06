export const getExpiryDate = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
};
