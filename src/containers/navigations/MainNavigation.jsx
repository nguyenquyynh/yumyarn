import React, {useEffect, useState} from 'react';
import Authen from './Authen';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import MainApp from './MainApp';
import LoadingApp from 'components/commons/LoadingApp';
import {checkAuthen} from 'src/hooks/api/auth';
import {auth_check} from 'reducers/auth';
import {Toast} from 'react-native-ui-lib';
import {PermissionsAndroid, ToastAndroid} from 'react-native';
import {t} from 'lang';
import OpenApp from 'components/commons/OpenApp';
import {io, Socket} from 'socket.io-client';
import {initAppStateManager} from 'services/SocketAppStatus';
import messaging from '@react-native-firebase/messaging';
import {addfcmtoken, addSocket} from 'reducers/fcm';

const MainNavigation = () => {
  const auth = useSelector(state => state.auth);
  const fcm = useSelector(state => state.fcm);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const requestUserPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('token: ' + token);
        dispatch(addfcmtoken(token));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fcm?.socket && auth?.user) {
      fcm.socket.emit('newOnlUser', {id: auth.user._id});
    }
  }, [fcm]);

  useEffect(() => {
    requestUserPermission();
    const newSocket = io('https://api.phqmarket.online');
    dispatch(addSocket(newSocket));
    const cleanup = initAppStateManager(newSocket);
    return () => {
      cleanup();
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const Check = async () => {
      const authen = await checkAuthen(auth.token);
      setTimeout(() => {
        setLoading(false);
        if (!authen) {
          ToastAndroid.show(t('login.expired'), ToastAndroid.SHORT);
        }
      }, 1500);
      await dispatch(auth_check({isLogin: authen}));
    };
    Check();
  }, []);

  return (
    <NavigationContainer>
      {loading ? <OpenApp /> : auth.isLogin ? <MainApp /> : <Authen />}
    </NavigationContainer>
  );
};

export default MainNavigation;
