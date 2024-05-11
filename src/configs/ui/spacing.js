import { Spacings } from 'react-native-ui-lib';

import { addScaleFactor } from './scaling';

const commonSpacings = {
  // app-based
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,

  // special cases
  z: 0,
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
  xi: 11,
  xii: 12,
  xiii: 13,
  xiv: 14,
  xv: 15,
  xvi: 16,
  xvii: 17,
  xviii: 18,
  xix: 19,
  xx: 20,
  xxii: 22,
  xxiii: 23,
  xxviii: 28,
  xxx: 30,
  xxxx: 40,
  xxxxi: 41,
  l: 50,
  lx: 60,
  c: 100,
  cc: 200,
};

Object.keys(commonSpacings).forEach(key => {
  commonSpacings[`n${key}`] = commonSpacings[key] * -1;
});

Spacings.loadSpacings(addScaleFactor(commonSpacings));
