import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  TriggerType,
} from '@notifee/react-native';
import {NAVIGATION_IDS} from './Linking';

const createChannelId = async () => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    badge: true,
  });
  return channelId;
};

const viewNotify = async remoteMessage => {
  try {
    const channelId = await createChannelId();
    notifee.displayNotification({
      title: remoteMessage.data?.title || 'Lỗi',
      body: remoteMessage.data?.body || 'Lỗi',
      android: {
        channelId: channelId,
        pressAction: {
          id: remoteMessage.data?.navigationId || 'Main',
        },
        style: {
          type: AndroidStyle.MESSAGING,
          person: {
            name: remoteMessage.data?.title || 'Lỗi',
            icon: remoteMessage.data?.avatar,
          },
          messages: [
            {
              text: remoteMessage.data?.body || 'Lỗi',
              timestamp: Date.now(), // 10 minutes ago
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const notifyApp = async gotoLink => {
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (
      type === EventType.PRESS &&
      NAVIGATION_IDS.includes(detail.pressAction.id)
    ) {
      gotoLink(detail.pressAction.id);
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message hanlde background', remoteMessage);
    viewNotify(remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Message hanlde open', remoteMessage);
    viewNotify(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        viewNotify(remoteMessage);
      }
    });
};

export {notifyApp};
