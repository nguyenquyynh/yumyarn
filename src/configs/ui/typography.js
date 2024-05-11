import { Typography } from 'react-native-ui-lib';

import { addScaleFactor } from './scaling';

Typography.loadTypographies(
  addScaleFactor(
    {
      xxiiText: {
        fontSize: 32,
        lineHeight: 40
      },
      xxviiiText: {
        fontSize: 28,
        lineHeight: 30
      },
      xxivText: {
        fontSize: 24,
        lineHeight: 35
      },
      head: {
        fontSize: 22,
        lineHeight: 32
      },
      largeText: {
        fontSize: 20,
        lineHeight: 24
      },
      xviiiText: {
        fontSize: 18,
        lineHeight: 26
      },
      xviiText: {
        fontSize: 17,
        lineHeight: 25
      },
      title: {
        fontSize: 18,
        lineHeight: 24
      },
      text: {
        fontSize: 14,
        lineHeight: 20
      },
      xiiitext: {
        fontSize: 13,
        lineHeight: 20
      },
      xiitext: {
        fontSize: 12,
        lineHeight: 14
      },
      appname: {
        fontSize: 30,
        lineHeight: 40
      },
      xlText: {
        fontSize: 40,
        lineHeight: 46
      },
    },
    ['fontSize', 'lineHeight']
  )
);
