import { PixelRatio } from 'react-native';

export const SCALE_FACTOR =
  {
    1: 1,
    1.5: 1,
    2: 1.1,
    3: 1.1,
    3.5: 1.2
  }[PixelRatio.get()] || 1;

export const addScaleFactor = (object, keys) => {
  return object;
  // if (typeof object === 'object') {
  //   const result = { ...object };
  //   Object.keys(object).forEach(key => {
  //     if (Array.isArray(keys)) {
  //       for (const arrKey of keys) {
  //         result[key][arrKey] = Math.round(object[key][arrKey] * SCALE_FACTOR);
  //       }
  //     } else if (typeof object[key] === 'object') {
  //       Object.keys(object[key]).forEach(k => {
  //         result[key][k] = Math.round(object[key][k] * SCALE_FACTOR);
  //       });
  //     } else {
  //       result[key] = Math.round(object[key] * SCALE_FACTOR);
  //     }
  //   });
  //   return result;
  // }
  // return object * SCALE_FACTOR;
};
