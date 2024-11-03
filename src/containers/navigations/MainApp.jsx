import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddAdrressScreen from 'containers/post/AddAdrressScreen';
import MainPost from 'containers/post/MainPost';
import Main from 'containers/main/Main';
import Setting from 'containers/main/Setting';
import SearchMain from 'containers/search/SearchMain';
import ListPost from 'containers/post/ListPost';
import PostDetail from 'containers/post/PostDetail';
import EditProfile from 'containers/profile/EditProfile';
import FollowerList from 'containers/profile/FollowerList';
import FollowingList from 'containers/profile/FollowingList';
import OtherProfile from 'containers/profile/OtherProfile';
import About from 'containers/setting/About';
import Advertisement from 'containers/setting/Advertisement';
import HelpSupport from 'containers/setting/HelpSupport';
import MessageSetting from 'containers/setting/MessageSetting';
import Payment from 'containers/setting/Payment';
import PostSaved from 'containers/setting/PostSaved';
import SearchMap from 'containers/search/SearchMap';
import MainChat from 'containers/chat/MainChat';
import MainNotifications from 'containers/notification/MainNotifications';
import BuyAdvertisement from 'containers/advertisement/BuyAdvertisement';
import ZaloWebView from 'containers/advertisement/ZaloWebView';
import Policy from 'containers/setting/Policy';
import EditPost from 'containers/post/EditPost';
import {useSelector} from 'react-redux';
import Chating from 'containers/chat/Chating';
import {AppState, Linking, ToastAndroid} from 'react-native';
import Report from 'containers/setting/Report';
import ShakeDetection from 'containers/orther/ShakeScreen';
import Extentions from 'containers/setting/Extentions';

const MainApp = () => {
  const Stack = createNativeStackNavigator();
  const fcm = useSelector(state => state.fcm);
  const auth = useSelector(state => state.auth);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    if (fcm.socket) {
      fcm.socket.emit('newOnlUser', {
        id: auth.user._id,
        message_recive_status: auth?.user?.message_recive_status,
        message_active_status: auth?.user?.message_active_status,
        message_reading_status: auth?.user?.message_reading_status,
      });
    }
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (fcm.socket) {
          fcm.socket.emit('newOnlUser', {
            id: auth.user._id,
            message_recive_status: auth?.user?.message_recive_status,
            message_active_status: auth?.user?.message_active_status,
            message_reading_status: auth?.user?.message_reading_status,
          });
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [fcm]);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Search" component={SearchMain} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Post" component={MainPost} />
      <Stack.Screen name="ListPost" component={ListPost} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
      <Stack.Screen name="Adddrressscreen" component={AddAdrressScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="FollowerList" component={FollowerList} />
      <Stack.Screen name="FollowingList" component={FollowingList} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Advertisement" component={Advertisement} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="MessageSetting" component={MessageSetting} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="PostSaved" component={PostSaved} />
      <Stack.Screen name="SearchMap" component={SearchMap} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
      <Stack.Screen name="MainChat" component={MainChat} />
      <Stack.Screen name="MainNotifications" component={MainNotifications} />
      <Stack.Screen name="BuyAdvertisement" component={BuyAdvertisement} />
      <Stack.Screen name="ZaloWebView" component={ZaloWebView} />
      <Stack.Screen name="Policy" component={Policy} />
      <Stack.Screen name="EditPost" component={EditPost} />
      <Stack.Screen name="Chating" component={Chating} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="ShakeScreen" component={ShakeDetection} />
      <Stack.Screen name="Extentions" component={Extentions} />
    </Stack.Navigator>
  );
};

export default MainApp;
