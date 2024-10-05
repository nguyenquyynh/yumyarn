/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/configs';
import {notifyApp} from './src/services/MessagingService';
import {buildDeepLinkFromNotificationData} from 'src/services/Linking';

notifyApp(buildDeepLinkFromNotificationData);
AppRegistry.registerComponent(appName, () => App);
