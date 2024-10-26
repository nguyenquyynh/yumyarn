/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/configs';
import {notifyApp, viewNotify} from './src/services/MessagingService';
import {buildDeepLinkFromNotificationData} from 'src/services/Linking';
import messaging from '@react-native-firebase/messaging';
notifyApp(buildDeepLinkFromNotificationData);
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message hanlde background', remoteMessage);
    viewNotify(remoteMessage);
  });
AppRegistry.registerComponent(appName, () => App);
