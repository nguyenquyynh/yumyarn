import {Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const NAVIGATION_IDS = ['Main', 'MainChat', 'PostDetail', 'OtherProfile'];

const buildDeepLinkFromNotificationData = data => {
  if (!data) {
    Linking.openURL('yumyarn://Main');
  }
  const isMatch = data?.includes('https://yumyarn.api.newonlineee.xyz/');
  if (isMatch) {
    Linking.openURL(
      `yumyarn://${
        data.split('https://yumyarn.api.newonlineee.xyz/')[1]
      }`,
    );
  }
  Linking.openURL(`yumyarn://${data}`);
};

const config = {
  screens: {
    Main: 'Main',
    MainChat: 'MainChat/:_id',
    PostDetail: 'PostDetail/:_id',
    OtherProfile: 'OtherProfile/:id',
  },
};

const linking = {
  prefixes: ['yumyarn://', 'https://yumyarn.api.newonlineee.xyz/'],
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

export {linking, NAVIGATION_IDS, buildDeepLinkFromNotificationData};
