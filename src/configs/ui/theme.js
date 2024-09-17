import {ThemeManager} from 'react-native-ui-lib';

ThemeManager.setComponentTheme('Text', (props, context) => {
   return {
    fontSize: props.fontSize ? props.fontSize : 12,
    color: props.color ? props.color : 'black',
   }
});

ThemeManager.setComponentTheme('Button', (props, context) => {
  return {
    backgroundColor: props.outline ? 'black' : 'green',
  };
});