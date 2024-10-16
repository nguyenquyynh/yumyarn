import { Linking } from "react-native";
import messaging from '@react-native-firebase/messaging';

const NAVIGATION_IDS = ['Main',  'MainChat'];

const buildDeepLinkFromNotificationData = (data) => {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.log('Unverified navigationId', navigationId)
    return 'yumyarn://Main';
  }
  if (navigationId === 'Main') {
    return 'yumyarn://Main';
  }

  return 'yumyarn://Main';
}

const linking = {
    prefixes: ['yumyarn://'],
    config: {
      screens: {
        Main: 'Main',
        MainChat: 'MainChat'
      }
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (typeof url === 'string') {
        return url;
      }
      //getInitialNotification: When the application is opened from a quit state.
      const message = await messaging().getInitialNotification();
      if(message){
        const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
        if (deeplinkURL) {
          return deeplinkURL;
        }
      }
        return null
    },
    subscribe(listener) {
      const onReceiveURL = ({url}) => listener(url);
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
  
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        const url = buildDeepLinkFromNotificationData(remoteMessage.data);
        if (typeof url === 'string') {
          listener(url);
        }
      });
      return () => {
        linkingSubscription.remove();
        unsubscribe()
      };
    },
  }

  export {buildDeepLinkFromNotificationData, linking, NAVIGATION_IDS}