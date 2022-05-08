export const expectArraysIntersect = (array1, array2) =>
  array1.some((item1) => array2.includes(item1));
