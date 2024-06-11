import { StyleSheet } from 'react-native';
import { Colors, ThemeManager, Typography } from 'react-native-ui-lib';

import Fonts from 'configs/fonts';

const DEFAULT_TYPOGRAPHY = Typography.text;

ThemeManager.setComponentTheme(
  'Text',
  ({
    color,
    size,
    bold,
    fontBlack,
    light,
    medium,
    marcellus,
    fontWeight,
    lineHeight,
    underline,
    textDecorationLine = 'none',
    customStyle,
    alignRight,
    alignCenter,
    ...rest
  }) => {
    let propsColor = null;
    let propsStyle = {};
    const fontFamily = bold
      ? Fonts.BOLD
      : fontBlack
      ? Fonts.BLACK
      : light
      ? Fonts.LIGHT
      : medium
      ? Fonts.MEDIUM
      : marcellus
      ? Fonts.MARCELLUS
      : Fonts.REGULAR;

    Object.keys(rest).forEach(key => {
      if (typeof rest[key] === 'boolean' && !rest[key]) {
        return;
      }
      if (Colors[key]) {
        propsColor = Colors[key];
      }
      if (Typography[key]) {
        propsStyle = { ...propsStyle, ...Typography[key] };
      }
    });

    const customPropsStyle = {
      ...DEFAULT_TYPOGRAPHY,
      fontFamily,
      fontWeight: null,
      color: color || propsColor || Colors.text,
      textDecorationLine: underline ? 'underline' : textDecorationLine
    };
    if (alignRight) {
      customPropsStyle.textAlign = 'right';
    }
    if (lineHeight) {
      customPropsStyle.lineHeight = lineHeight;
    }
    if (size) {
      customPropsStyle.fontSize = size;
    }

    const style = StyleSheet.flatten([
      customPropsStyle,
      propsStyle,
      customStyle
    ]);

    return {
      style,
      ...rest
    };
  }
);
