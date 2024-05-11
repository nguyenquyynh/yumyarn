import {ThemeManager} from 'react-native-ui-lib';

ThemeManager.setComponentTheme('Text', {
    text: true,
});


ThemeManager.setComponentTheme('Button', (props, context) => {

  return {
    backgroundColor: props.outline ? 'black' : 'green',
  };
});