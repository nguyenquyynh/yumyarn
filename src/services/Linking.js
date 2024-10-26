import {Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Chating from 'containers/chat/Chating';

const NAVIGATION_IDS = ['Home', 'MainChat', 'PostDetail'];

const buildDeepLinkFromNotificationData = data => {
  if (!data) {
    Linking.openURL('yumyarn://Home');
  }
  console.log(data)

  Linking.openURL(`yumyarn://${data}`);
};

const config = {
  screens: {
    Home: 'Home',
    MainChat: 'MainChat',
    PostDetail: 'PostDetail/:id',
  },
};

const linking = {
  prefixes: ['yumyarn://'],
  config,
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;
    const message = await messaging().getInitialNotification();
    return message ? buildDeepLinkFromNotificationData(message.data) : null;
  },
  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener('url', event => {
      listener(event.url); // listener nhận event chứ không phải url trực tiếp
    });

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      buildDeepLinkFromNotificationData(remoteMessage.data);
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      buildDeepLinkFromNotificationData(remoteMessage.data);
    });
    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
};

export {buildDeepLinkFromNotificationData, linking, NAVIGATION_IDS};
